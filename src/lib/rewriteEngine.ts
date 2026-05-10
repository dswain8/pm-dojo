import {
  ARTIFACT_RUBRICS,
  EXCELLENT_REWRITE_TARGET,
  assessWithRubricBank,
  getSlangTerms,
  type ReviewInputBase,
  type RubricAssessment,
} from "./rubricBank";

export interface RewriteResult {
  draft: string;
  assessment: RubricAssessment;
  iterations: string[];
}

const WEAK_LANGUAGE =
  /\b(kind of|sort of|maybe|probably|hopefully|i guess|i think|somewhat|a bit|not trying to)\b/gi;

const BLOCKED_PM_CALL_LINE =
  "[Rewrite paused — restate the call as a one-line decision before re-running]";
const TRADEOFF_PROMPT =
  "I will not invent the tradeoff for you. State what gets slower, what risk we accept, or what we are not doing, then re-run.";
const CUSTOMER_ACCOUNTABILITY_PROMPT =
  "I will not invent a commitment for you. State what we are committing to or refusing to promise, then re-run.";
const CUSTOMER_ASK_PROMPT =
  "I will not invent an update date for you. Add the date you will send the verified update, then re-run.";
const CONTEXT_TRADEOFF_BLOCK =
  "[Rewrite paused — your context and tradeoff say the same thing. Separate the fact from the cost.]";
const TRADEOFF_VERB_BLOCK =
  "[Rewrite paused — the tradeoff repeats the decision instead of naming the cost. State what changes, slows down, or gets cut.]";
const EVIDENCE_COHERENCE_BLOCK =
  "[Rewrite paused — your evidence does not show up in the decision or the tradeoff. The reader will not see the connection. Restate.]";
const CUSTOMER_INTERNAL_JARGON = /\b(eng|qa|dri|standup|pipeline|sprint)\b/i;
const CUSTOMER_SECOND_PERSON = /\b(you|your|yours|yourself)\b/i;
const BLAME_CUSTOMER_CALL = /^(tell\s+\S+\s+(it|they|you).*\b(fault|wrong|problem|mistake)\b)/i;
const DATE_PATTERN =
  /\b(monday|tuesday|wednesday|thursday|friday|today|tomorrow|jan(?:uary)?\.?\s+\d{1,2}|feb(?:ruary)?\.?\s+\d{1,2}|mar(?:ch)?\.?\s+\d{1,2}|apr(?:il)?\.?\s+\d{1,2}|may\s+\d{1,2}|jun(?:e)?\.?\s+\d{1,2}|jul(?:y)?\.?\s+\d{1,2}|aug(?:ust)?\.?\s+\d{1,2}|sep(?:tember)?\.?\s+\d{1,2}|oct(?:ober)?\.?\s+\d{1,2}|nov(?:ember)?\.?\s+\d{1,2}|dec(?:ember)?\.?\s+\d{1,2})\b/i;

const SUBSTANTIVE_TRADEOFF_PATTERNS = [
  /\bbut\b/i,
  /\bin exchange for\b/i,
  /\bversus\b/i,
  /\bvs\.?\b/i,
  /\binstead of\b/i,
  /\bwhile\b/i,
  /\bat the cost of\b/i,
  /\bwe lose\b/i,
  /\bwe give up\b/i,
  /\$[\d,]+(?:\.\d+)?[kKmM]?/i,
  /\b\d+\s+weeks?\b/i,
  /\b\d+\s+engineers?\b/i,
  /\b\d+\s+days?\b/i,
  /\b(engineering|eng|design|support|sales|legal|finance|cs|csm|risk ops)\s+capacity\b/i,
];

const ACTION_VERB_BASE: Record<string, string> = {
  avoid: "avoid",
  avoiding: "avoid",
  approve: "approve",
  approved: "approve",
  approving: "approve",
  block: "block",
  blocked: "block",
  blocking: "block",
  build: "build",
  building: "build",
  cap: "cap",
  capped: "cap",
  choose: "choose",
  cost: "cost",
  costs: "cost",
  cut: "cut",
  cutting: "cut",
  defer: "defer",
  deferred: "defer",
  deferring: "defer",
  delay: "delay",
  delayed: "delay",
  delaying: "delay",
  freeze: "freeze",
  frozen: "freeze",
  hold: "hold",
  holding: "hold",
  launch: "launch",
  lose: "lose",
  losing: "lose",
  migrate: "migrate",
  migrating: "migrate",
  move: "move",
  moving: "move",
  pause: "pause",
  paused: "pause",
  pausing: "pause",
  release: "release",
  rollback: "rollback",
  ship: "ship",
  shipping: "ship",
  stop: "stop",
  take: "take",
  takes: "take",
  update: "update",
};

interface SanitizedPmCall {
  call: string;
  unsafe: string[];
}

function sentenceCase(text: string): string {
  const cleaned = text.trim().replace(/\s+/g, " ");
  if (!cleaned) return "";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isRubricBingo(text: string): boolean {
  return /\b(recommend|risk|tradeoff|customer|stakeholder|approve|ship|pause|ask|decide|owner|evidence|metric)\b(?:[\s.,;:!-]+(?:recommend|risk|tradeoff|customer|stakeholder|approve|ship|pause|ask|decide|owner|evidence|metric)\b){5,}/i.test(
    text,
  );
}

function isTerseButActionableCall(text: string): boolean {
  return /^(delay|pause|hold|block|freeze|rollback|stop|cut|ship)\s+(launch|rollout|release|migration|sunset|beta|ga|v1|v2)\b/i.test(
    text,
  );
}

export function cleanWeakLanguage(text: string): string {
  const withoutSlang = getSlangTerms().reduce((cleaned, slang) => {
    return cleaned.replace(new RegExp(`\\b${escapeRegex(slang)}\\b`, "gi"), "");
  }, text);

  return withoutSlang
    .replace(WEAK_LANGUAGE, "")
    .replace(/\s+([.,!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function sanitizePmCall(input: ReviewInputBase): SanitizedPmCall {
  const compactCall = input.pmCall.trim().replace(/\s+/g, " ");
  const unsafe: string[] = [];

  if (compactCall.replace(/\s/g, "").length < 12 && !isTerseButActionableCall(compactCall)) {
    unsafe.push('The call is too short to rewrite safely — write it as: verb + object + "by <date>".');
  }

  if (input.artifactKind === "customer" && CUSTOMER_SECOND_PERSON.test(compactCall)) {
    unsafe.push("The call uses customer-blaming language. Reframe around what we are doing or owning.");
  }

  const slangHits = getSlangTerms().filter((slang) =>
    new RegExp(`\\b${escapeRegex(slang)}\\b`, "i").test(compactCall),
  );
  if (slangHits.length > 0) {
    unsafe.push(`The call uses casual/slang language: ${slangHits.slice(0, 3).join(", ")}. Rewrite it in work-safe language.`);
  }

  if (input.artifactKind === "customer" && CUSTOMER_INTERNAL_JARGON.test(compactCall)) {
    unsafe.push("The call exposes internal process jargon. Translate it into a customer-facing commitment.");
  }

  if (input.artifactKind === "customer" && BLAME_CUSTOMER_CALL.test(compactCall)) {
    unsafe.push("The call reads as blaming the customer. Reframe around what we are doing or owning.");
  }

  return {
    call: unsafe.length > 0 ? BLOCKED_PM_CALL_LINE : compactCall,
    unsafe: [...new Set(unsafe)],
  };
}

function capUnsafeAssessment(
  assessment: RubricAssessment,
  pmCallBlockers: string[],
): RubricAssessment {
  return {
    ...assessment,
    score: Math.min(assessment.score, 70),
    missingContext: [...assessment.missingContext, ...pmCallBlockers],
    pmCallBlockers,
    canReachExcellent: false,
  };
}

function extractEvidence(input: ReviewInputBase): string[] {
  const contextFacts = splitSentences(input.context);
  const draftFacts = splitSentences(input.draft).filter(
    (sentence) =>
      cleanWeakLanguage(sentence).length === sentence.trim().length &&
      !isRubricBingo(sentence),
  );
  const facts = [...contextFacts, ...draftFacts]
    .map(cleanWeakLanguage)
    .filter((sentence) =>
      /\b(\d+(\.\d+)?%?|\$[\d,.]+|today|tomorrow|monday|tuesday|wednesday|thursday|friday|q[1-4]|customer|customers|deadline|blocked|sla|p0|p1|renewal|close|pilot|beta|escalation|webhook|audit[- ]log|actor attribution|unauthorized access|patch verification|replay protection)\b/i.test(
        sentence,
      ),
    )
    .filter(Boolean);

  return [...new Set(facts)].slice(0, 3);
}

function hasSubstantiveTradeoffMarker(sentence: string): boolean {
  return SUBSTANTIVE_TRADEOFF_PATTERNS.some((pattern) => pattern.test(sentence));
}

function hasTradeoffCue(sentence: string): boolean {
  return [
    /^\s*(trade[- ]?off|downside|risk|cost):/i,
    /\btrade[- ]?off is\b/i,
    /\btrade[- ]?off:?\b/i,
    /\bbut\b/i,
    /\bin exchange for\b/i,
    /\bversus\b/i,
    /\bvs\.?\b/i,
    /\binstead of\b/i,
    /\bwhile\b/i,
    /\bat the cost of\b/i,
    /\bwe lose\b/i,
    /\bwe give up\b/i,
  ].some((pattern) => pattern.test(sentence));
}

function splitTradeoffCandidates(text: string): string[] {
  return text
    .replace(/\n+/g, ". ")
    .replace(/\b(Tradeoff|Downside|Risk|Cost):/gi, ". $1:")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function evidenceLine(input: ReviewInputBase): string {
  const evidence = extractEvidence(input);
  if (evidence.length === 0) {
    return "[Add the strongest fact: metric, customer signal, deadline, or constraint.]";
  }
  return evidence.map(sentenceCase).join(" ");
}

function extractTradeoff(input: ReviewInputBase): string | null {
  const tradeoffSentence = splitTradeoffCandidates(input.draft)
    .map(cleanWeakLanguage)
    .find(
      (sentence) =>
        !isRubricBingo(sentence) &&
        hasTradeoffCue(sentence) &&
        hasSubstantiveTradeoffMarker(sentence),
    );

  if (!tradeoffSentence) return null;
  return sentenceCase(
    tradeoffSentence
      .replace(/^trade[- ]?off:\s*/i, "")
      .replace(/^downside:\s*/i, ""),
  );
}

function buildTradeoff(input: ReviewInputBase): string {
  return extractTradeoff(input) ?? TRADEOFF_PROMPT;
}

function normalizeCustomerCall(sentence: string): string {
  return sentence
    .replace(/^tell\s+the\s+customer\s+(that\s+)?/i, "")
    .replace(/^tell\s+.+?\s+(that\s+)?(?=we\b|we're\b|we are\b|we cannot\b|we will\b)/i, "")
    .trim();
}

function hasCustomerAccountabilitySignal(sentence: string): boolean {
  if (/\b(working on|looking into|get back|more soon|patience)\b/i.test(sentence)) {
    return false;
  }
  return [
    /\bwe\s+are\s+(keeping|delaying|holding|extending|maintaining|disabling|restoring)\b.*\b(until|through|by|while|to validate|to protect)\b/i,
    /\bwe\s+(will|are going to|commit to|are committed to)\s+(send|share|provide|complete|validate|verify|correct|fix|keep|hold|disable|restore|extend|migrate|review|protect)\b/i,
    /\bwe\s+(cannot|can't|will not|won't)\s+(promise|guarantee|commit|release|delete|accelerate|confirm)\b/i,
    /\bnot\s+(promising|promise|guaranteeing)\b/i,
    /\b(if|even if)\b.*\b(slips?|delays?|changes?)\b.*\b(still|remain|we will)\b/i,
  ].some((pattern) => pattern.test(sentence));
}

function buildAccountability(input: ReviewInputBase): string {
  const source = `${input.pmCall}. ${input.context}. ${input.draft}`;
  const accountability = splitSentences(source)
    .map((sentence) => sentenceCase(cleanWeakLanguage(normalizeCustomerCall(sentence))))
    .find((sentence) => hasCustomerAccountabilitySignal(sentence));

  return accountability ?? CUSTOMER_ACCOUNTABILITY_PROMPT;
}

function buildAsk(input: ReviewInputBase): string {
  const text = `${input.pmCall} ${input.context} ${input.draft}`.toLowerCase();
  if (input.artifactKind === "customer") {
    const rawDate = text.match(DATE_PATTERN)?.[0];
    if (!rawDate) return CUSTOMER_ASK_PROMPT;
    const date = rawDate
      ? /today|tomorrow/i.test(rawDate)
        ? rawDate.toLowerCase()
        : sentenceCase(rawDate)
      : "the committed update time";
    return `We will send the validated update by ${date} and share an earlier note if that timing changes.`;
  }
  if (/finance|ledger|refund|close/.test(text)) {
    return "Please approve the one-week defer today. Finance owns reconciliation sign-off, Eng validates the fix, and PM/Support prepare customer messaging before launch.";
  }
  if (/validate|duplicate|bug|incident/.test(text) && /support|customer/.test(text)) {
    return "Please confirm today if we agree to move launch. Eng validates the issue, Support prepares customer messaging, and PM shares the new launch date.";
  }
  if (/customer|customers|renewal|sales/.test(text)) {
    return "Please confirm by EOD whether to proceed, defer, or escalate; I will update Sales and the customer-facing team after that decision.";
  }
  return "Please confirm the decision owner and any objection by EOD.";
}

function callLine(input: ReviewInputBase): string {
  const sanitized = sanitizePmCall(input);
  if (sanitized.unsafe.length > 0) return sanitized.call;
  const withoutInstruction = input.artifactKind === "customer"
    ? normalizeCustomerCall(sanitized.call)
    : sanitized.call;
  return sentenceCase(cleanWeakLanguage(withoutInstruction)) || "[State the recommendation.]";
}

function labeledLine(label: string, call: string): string {
  return call === BLOCKED_PM_CALL_LINE ? call : `${label}: ${call}`;
}

function blockedPmCallDraft(pmCallBlockers: string[]): string {
  const reason = pmCallBlockers[0] ?? "The call is not ready to rewrite yet.";
  return [
    BLOCKED_PM_CALL_LINE,
    "",
    `Reason: ${reason}`,
    'Restate the call as a one-line decision: verb + object + "by <date>".',
    "Re-run after restating the call.",
  ].join("\n");
}

function lineBody(draft: string, label: string): string {
  const escaped = escapeRegex(label);
  return draft.match(new RegExp(`^${escaped}:\\s*(.+)$`, "mi"))?.[1]?.trim() ?? "";
}

function replaceLineBody(draft: string, label: string, replacement: string): string {
  const escaped = escapeRegex(label);
  return draft.replace(new RegExp(`^${escaped}:.*$`, "mi"), `${label}: ${replacement}`);
}

function contextLine(input: ReviewInputBase, draft: string): string {
  if (input.artifactKind === "slack") return lineBody(draft, "Why");
  if (input.artifactKind === "exec") return lineBody(draft, "Context");
  if (input.artifactKind === "prd") return lineBody(draft, "Evidence");
  if (input.artifactKind === "meeting") return lineBody(draft, "What changed");
  return "";
}

function decisionLine(input: ReviewInputBase, draft: string): string {
  if (input.artifactKind === "slack") return lineBody(draft, "Recommendation");
  if (input.artifactKind === "exec") return lineBody(draft, "Recommendation") || lineBody(draft, "Decision needed");
  if (input.artifactKind === "prd") return lineBody(draft, "Decision");
  if (input.artifactKind === "meeting") {
    return draft.match(/^Follow-up for .+?:\s*(.+)$/mi)?.[1]?.trim() ?? "";
  }
  return lineBody(draft, "Direct update");
}

function normalizeForCoherence(text: string): string {
  return text
    .toLowerCase()
    .replace(/^trade[- ]?off:\s*/i, "")
    .replace(/[^\w$%.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstDecisionVerb(pmCall: string): string | null {
  const token = pmCall
    .toLowerCase()
    .split(/[^a-z]+/)
    .find((word) => ACTION_VERB_BASE[word]);
  return token ? ACTION_VERB_BASE[token] : null;
}

function actionVerbs(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z]+/)
    .map((word) => ACTION_VERB_BASE[word])
    .filter((word): word is string => Boolean(word));
}

function contextSignals(text: string): string[] {
  const metricSignals = text.match(/\b\d+(?:\.\d+)?%|\$[\d,]+(?:\.\d+)?[kKmM]?|\b\d+\s+(?:customers|users|tickets|escalations|admins|sellers|integrations|mismatches|weeks?|engineers?|days?)\b/gi) ?? [];
  const namedSignals = (text.match(/\b[A-Z][a-zA-Z]{5,}\b/g) ?? []).filter(
    (word) =>
      ![
        "Accountability",
        "Context",
        "Decision",
        "Evidence",
        "Friday",
        "Monday",
        "Recommendation",
        "Thursday",
        "Tradeoff",
        "Tuesday",
        "Wednesday",
      ].includes(word),
  );
  return [...new Set([...metricSignals, ...namedSignals].map((signal) => signal.toLowerCase()))];
}

function capAssessment(
  assessment: RubricAssessment,
  cap: number,
  reasons: string[],
): RubricAssessment {
  return {
    ...assessment,
    score: Math.min(assessment.score, cap),
    missingContext: [...new Set([...assessment.missingContext, ...reasons])],
    canReachExcellent: false,
  };
}

function validateCoherence(input: ReviewInputBase, draft: string): { draft: string; blockers: string[] } {
  if (input.artifactKind === "customer" || !/^Tradeoff:/mi.test(draft)) {
    return { draft, blockers: [] };
  }

  const context = contextLine(input, draft);
  const tradeoff = lineBody(draft, "Tradeoff");
  const decision = decisionLine(input, draft);
  let nextDraft = draft;
  const blockers: string[] = [];

  if (!tradeoff || /^\[Rewrite paused/.test(tradeoff)) {
    return { draft, blockers };
  }

  if (
    context &&
    normalizeForCoherence(context) &&
    normalizeForCoherence(context) === normalizeForCoherence(tradeoff)
  ) {
    nextDraft = replaceLineBody(nextDraft, "Tradeoff", CONTEXT_TRADEOFF_BLOCK);
    blockers.push("Your context and tradeoff say the same thing. Separate the fact from the cost.");
    return { draft: nextDraft, blockers };
  }

  const decisionVerb = firstDecisionVerb(input.pmCall);
  const tradeoffVerbs = actionVerbs(tradeoff);
  if (
    decisionVerb &&
    tradeoffVerbs.length > 0 &&
    tradeoffVerbs.every((verb) => verb === decisionVerb) &&
    !hasTradeoffCue(tradeoff)
  ) {
    nextDraft = replaceLineBody(nextDraft, "Tradeoff", TRADEOFF_VERB_BLOCK);
    blockers.push("The tradeoff repeats the decision instead of naming the cost.");
    return { draft: nextDraft, blockers };
  }

  const signals = contextSignals(context);
  const decisionOrTradeoff = `${decision} ${tradeoff}`.toLowerCase();
  const hasContextSignalInDecisionOrTradeoff = signals.some((signal) =>
    decisionOrTradeoff.includes(signal),
  );
  if (tradeoff === TRADEOFF_PROMPT && signals.length > 0 && !hasContextSignalInDecisionOrTradeoff) {
    nextDraft = replaceLineBody(nextDraft, "Tradeoff", EVIDENCE_COHERENCE_BLOCK);
    blockers.push("Your evidence does not show up in the decision or the tradeoff. The reader will not see the connection. Restate.");
  }

  return { draft: nextDraft, blockers };
}

function rewriteGuardrailBlockers(draft: string): string[] {
  const blockers: string[] = [];
  if (draft.includes(TRADEOFF_PROMPT)) {
    blockers.push("I will not invent a tradeoff for you. State the cost, risk, or no-list, then re-run.");
  }
  if (draft.includes(CUSTOMER_ACCOUNTABILITY_PROMPT)) {
    blockers.push("I will not invent a commitment for you. State what we are committing to or refusing to promise, then re-run.");
  }
  if (draft.includes(CUSTOMER_ASK_PROMPT)) {
    blockers.push("I will not invent an update date for you. Add the date you will send the verified update, then re-run.");
  }
  if (draft.includes(CONTEXT_TRADEOFF_BLOCK)) {
    blockers.push("Your context and tradeoff say the same thing. Separate the fact from the cost.");
  }
  if (draft.includes(TRADEOFF_VERB_BLOCK)) {
    blockers.push("The tradeoff repeats the decision instead of naming the cost.");
  }
  if (draft.includes(EVIDENCE_COHERENCE_BLOCK)) {
    blockers.push("Your evidence does not show up in the decision or the tradeoff. The reader will not see the connection. Restate.");
  }
  return blockers;
}

function assessRewrite(input: ReviewInputBase, draft: string): { draft: string; assessment: RubricAssessment } {
  const coherent = validateCoherence(input, draft);
  let assessment = assessWithRubricBank(input, coherent.draft, "dojo-rewrite");
  const blockers = [...coherent.blockers, ...rewriteGuardrailBlockers(coherent.draft)];
  if (blockers.length > 0) {
    assessment = capAssessment(assessment, 80, blockers);
  }
  return { draft: coherent.draft, assessment };
}

function buildStructuredDraft(input: ReviewInputBase): string {
  const sanitized = sanitizePmCall(input);
  if (sanitized.unsafe.length > 0) {
    return blockedPmCallDraft(sanitized.unsafe);
  }

  const call = callLine(input);
  const evidence = evidenceLine(input);
  const tradeoff = buildTradeoff(input);
  const accountability = buildAccountability(input);
  const ask = buildAsk(input);
  const audience = sentenceCase(input.audience) || "team";

  if (input.artifactKind === "slack") {
    return [
      labeledLine("Recommendation", call),
      "",
      `Why: ${evidence}`,
      "",
      `Tradeoff: ${tradeoff}`,
      "",
      `Ask: ${ask}`,
    ].join("\n");
  }

  if (input.artifactKind === "exec") {
    return [
      labeledLine("Decision needed", call),
      "",
      `Context: ${evidence}`,
      "",
      labeledLine("Recommendation", call),
      "",
      `Tradeoff: ${tradeoff}`,
      "",
      `Ask: ${ask}`,
    ].join("\n");
  }

  if (input.artifactKind === "customer") {
    return [
      `Hi ${audience},`,
      "",
      labeledLine("Direct update", call),
      "",
      evidence,
      "",
      `Accountability: ${accountability}`,
      "",
      `Next step: ${ask}`,
    ].join("\n");
  }

  if (input.artifactKind === "prd") {
    return [
      labeledLine("Decision", call),
      "",
      `Evidence: ${evidence}`,
      "",
      `Tradeoff: ${tradeoff}`,
      "",
      `Open ask: ${ask}`,
    ].join("\n");
  }

  return [
    call === BLOCKED_PM_CALL_LINE ? call : `Follow-up for ${audience}: ${call}`,
    "",
    `What changed: ${evidence}`,
    "",
    `Tradeoff: ${tradeoff}`,
    "",
    `Next step: ${ask}`,
  ].join("\n");
}

function patchDraft(input: ReviewInputBase, current: string, assessment: RubricAssessment): string {
  let next = cleanWeakLanguage(current);
  const failedIds = new Set(
    assessment.dimensions
      .filter((dimension) => dimension.status !== "strong")
      .map((dimension) => dimension.id),
  );

  if (
    failedIds.has("artifact-shape") ||
    failedIds.has("pm-call") ||
    failedIds.has("evidence") ||
    failedIds.has("tradeoff") ||
    failedIds.has("ask-owner-date")
  ) {
    next = buildStructuredDraft(input);
  }

  if (failedIds.has("tone")) {
    next = cleanWeakLanguage(next);
  }

  return next;
}

export function buildExcellentRewrite(input: ReviewInputBase): RewriteResult {
  const sanitized = sanitizePmCall(input);
  let draft = buildStructuredDraft(input);
  let evaluated = assessRewrite(input, draft);
  draft = evaluated.draft;
  let assessment = evaluated.assessment;
  const iterations = [
    `Applied ${ARTIFACT_RUBRICS[input.artifactKind].label} structure from the authored rubric bank.`,
  ];

  if (sanitized.unsafe.length > 0) {
    return {
      draft,
      assessment: capUnsafeAssessment(assessment, sanitized.unsafe),
      iterations: [
        ...iterations,
        "Paused the rewrite because the PM call needs to be restated first.",
      ],
    };
  }

  for (let pass = 1; pass <= 3; pass += 1) {
    if (assessment.score >= EXCELLENT_REWRITE_TARGET || !assessment.canReachExcellent) {
      break;
    }

    const patched = patchDraft(input, draft, assessment);
    if (patched === draft) break;
    draft = patched;
    evaluated = assessRewrite(input, draft);
    draft = evaluated.draft;
    assessment = evaluated.assessment;
    iterations.push(
      `Pass ${pass}: repaired ${assessment.repairs.slice(0, 2).join(" + ") || "rubric misses"}.`,
    );
  }

  return { draft, assessment, iterations };
}
