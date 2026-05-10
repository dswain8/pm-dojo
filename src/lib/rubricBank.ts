import { analyzeResponse } from "./rubric";

export type ArtifactKind =
  | "slack"
  | "exec"
  | "prd"
  | "customer"
  | "meeting";

export interface ReviewInputBase {
  artifactKind: ArtifactKind;
  audience: string;
  pmCall: string;
  context: string;
  draft: string;
}

export type AssessmentMode = "user-draft" | "dojo-rewrite";

export type RubricDimensionId =
  | "pm-call"
  | "audience-fit"
  | "evidence"
  | "tradeoff"
  | "ask-owner-date"
  | "artifact-shape"
  | "specificity"
  | "tone";

export interface RubricDimensionScore {
  id: RubricDimensionId;
  label: string;
  max: number;
  score: number;
  status: "strong" | "partial" | "miss";
  landed: string;
  missed: string;
  repair: string;
}

export interface AntiPatternHit {
  id: string;
  label: string;
  severity: number;
  repair: string;
  examples: string[];
}

export interface RubricAssessment {
  version: string;
  mode: AssessmentMode;
  score: number;
  maxScore: number;
  dimensions: RubricDimensionScore[];
  landed: string[];
  missed: string[];
  repairs: string[];
  antiPatterns: AntiPatternHit[];
  missingContext: string[];
  pmCallBlockers: string[];
  canReachExcellent: boolean;
}

export const RUBRIC_BANK_VERSION = "authored-rubric-bank-v1";
export const EXCELLENT_REWRITE_TARGET = 95;

const ARTIFACT_LABELS: Record<ArtifactKind, string> = {
  slack: "Slack update",
  exec: "exec memo",
  prd: "PRD decision note",
  customer: "customer reply",
  meeting: "meeting follow-up",
};

export const ARTIFACT_RUBRICS: Record<
  ArtifactKind,
  {
    label: string;
    requiredMoves: string[];
    shapeSignals: RegExp[];
    toneRule: string;
  }
> = {
  slack: {
    label: "Slack update",
    requiredMoves: ["recommendation", "why", "tradeoff", "ask"],
    shapeSignals: [/\brecommendation:/i, /\bwhy:/i, /\btradeoff:/i, /\bask:/i],
    toneRule: "Direct, short, skimmable, no casual slang.",
  },
  exec: {
    label: "Exec memo",
    requiredMoves: ["decision needed", "context", "recommendation", "tradeoff", "ask"],
    shapeSignals: [
      /\bdecision needed:/i,
      /\bcontext:/i,
      /\brecommendation:/i,
      /\btradeoff:/i,
      /\bask:/i,
    ],
    toneRule: "Decision-first, no wandering setup, no uncertainty laundering.",
  },
  prd: {
    label: "PRD decision note",
    requiredMoves: ["decision", "evidence", "tradeoff", "open ask"],
    shapeSignals: [/\bdecision:/i, /\bevidence:/i, /\btradeoff:/i, /\bopen ask:/i],
    toneRule: "Precise enough for Eng and Design to act without reinterpreting intent.",
  },
  customer: {
    label: "Customer reply",
    requiredMoves: ["direct update", "evidence", "accountability", "next step"],
    shapeSignals: [/\bhi\b/i, /\bdirect update:/i, /\baccountability:/i, /\bnext step:/i],
    toneRule: "Clear, accountable, no internal jargon, no blame shifting.",
  },
  meeting: {
    label: "Meeting follow-up",
    requiredMoves: ["follow-up", "what changed", "tradeoff", "next step"],
    shapeSignals: [/\bfollow-up/i, /\bwhat changed:/i, /\btradeoff:/i, /\bnext step:/i],
    toneRule: "Turns discussion into owners, dates, and decisions.",
  },
};

const DIMENSION_META: Record<RubricDimensionId, { label: string; max: number }> = {
  "pm-call": { label: "PM call", max: 14 },
  "audience-fit": { label: "Audience fit", max: 10 },
  evidence: { label: "Evidence", max: 16 },
  tradeoff: { label: "Tradeoff", max: 12 },
  "ask-owner-date": { label: "Ask / owner / date", max: 16 },
  "artifact-shape": { label: "Artifact shape", max: 12 },
  specificity: { label: "Specificity", max: 10 },
  tone: { label: "Tone / signal", max: 10 },
};

const SLANG_PATTERNS = [
  "lol",
  "lmao",
  "wtf",
  "yolo",
  "vibe",
  "vibes",
  "sus",
  "ngmi",
  "cooked",
  "dumpster fire",
  "hot mess",
  "ship it lol",
];

const WEAK_LANGUAGE = [
  "maybe",
  "probably",
  "kind of",
  "sort of",
  "i think",
  "i guess",
  "hopefully",
  "somewhat",
  "a bit",
  "not trying to",
];

const PLATITUDES = [
  "align",
  "synergy",
  "leverage",
  "circle back",
  "touch base",
  "take offline",
  "best practices",
  "low-hanging fruit",
  "moving forward",
];

export const ANTI_PATTERN_BANK = [
  {
    id: "casual-slang",
    label: "Casual slang in work artifact",
    severity: 14,
    patterns: SLANG_PATTERNS.map((term) => new RegExp(`\\b${escapeRegex(term)}\\b`, "i")),
    repair: "Replace casual slang with the concrete risk, blocker, or customer impact.",
  },
  {
    id: "hedged-call",
    label: "Hedged recommendation",
    severity: 10,
    patterns: WEAK_LANGUAGE.map((term) => new RegExp(`\\b${escapeRegex(term)}\\b`, "i")),
    repair: "Turn uncertainty into either a decision, a risk, or a stated unknown.",
  },
  {
    id: "corporate-filler",
    label: "Corporate filler",
    severity: 8,
    patterns: PLATITUDES.map((term) => new RegExp(`\\b${escapeRegex(term)}\\b`, "i")),
    repair: "Replace filler with the specific action, owner, or constraint.",
  },
  {
    id: "self-expression",
    label: "Self-expression instead of reader action",
    severity: 8,
    patterns: [/\bi wanted to\b/i, /\bi feel\b/i, /\bthinking out loud\b/i],
    repair: "Write for the reader's decision, not the writer's inner monologue.",
  },
  {
    id: "fake-consensus",
    label: "Fake alignment language",
    severity: 8,
    patterns: [/\bget aligned\b/i, /\bmake sure everyone is aligned\b/i, /\bloop everyone in\b/i],
    repair: "Name the actual decision or disagreement instead of hiding behind alignment.",
  },
  {
    id: "no-owner",
    label: "Ownerless action",
    severity: 10,
    patterns: [/\bsomeone should\b/i, /\bwe should probably\b/i, /\bcan folks\b/i],
    repair: "Name the owner, date, and expected response.",
  },
  {
    id: "keyword-stuffing",
    label: "Keyword-stuffed non-answer",
    severity: 22,
    patterns: [
      /\b(recommend|risk|tradeoff|customer|stakeholder|approve|ship|pause|ask|decide|owner|evidence|metric)\b(?:[\s.,;:!-]+(?:recommend|risk|tradeoff|customer|stakeholder|approve|ship|pause|ask|decide|owner|evidence|metric)\b){5,}/i,
    ],
    repair: "Write the artifact, not rubric bingo. A pile of PM words is not a decision.",
  },
] as const;

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function compact(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

const NAMED_ENTITY_STOPWORDS = new Set([
  "Ask",
  "Accountability",
  "CEO",
  "CFO",
  "Context",
  "Customer",
  "Customers",
  "Decision",
  "Evidence",
  "Friday",
  "Monday",
  "Open",
  "Recommendation",
  "Saturday",
  "Sunday",
  "Target",
  "Team",
  "Thursday",
  "Tradeoff",
  "Tuesday",
  "Wednesday",
]);

function hasNamedEntity(text: string): boolean {
  const matches = text.match(/\b[A-Z][a-zA-Z]{5,}\b/g) ?? [];
  return matches.some((match) => !NAMED_ENTITY_STOPWORDS.has(match));
}

function hasSubstantiveEvidence(text: string): boolean {
  return hasAny(text, [
    /\b\d+(\.\d+)?%/i,
    /\$[\d,]+(?:\.\d+)?[kKmM]?/i,
    /\b\d+\s+(customers|users|tickets|escalations|admins|sellers|integrations|mismatches)\b/i,
  ]) || hasNamedEntity(text);
}

function hasSubstantiveTradeoff(text: string): boolean {
  return tradeoffCandidateSentences(text).some((sentence) => hasAny(sentence, [
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
  ]));
}

function hasCustomerAccountability(text: string): boolean {
  if (/i will not invent a commitment/i.test(text)) return false;
  return hasAny(text, [
    /\bwe\s+are\s+(keeping|delaying|holding|extending|maintaining|disabling|restoring)\b.*\b(until|through|by|while|to validate|to protect)\b/i,
    /\bwe\s+(will|are going to|commit to|are committed to)\s+(send|share|provide|complete|validate|verify|correct|fix|keep|hold|disable|restore|extend|migrate|review|protect)\b/i,
    /\bwe\s+(cannot|can't|will not|won't)\s+(promise|guarantee|commit|release|delete|accelerate|confirm)\b/i,
    /\bnot\s+(promising|promise|guaranteeing)\b/i,
    /\b(if|even if)\b.*\b(slips?|delays?|changes?)\b.*\b(still|remain|we will)\b/i,
  ]);
}

function hasTradeoffHedge(text: string): boolean {
  return hasAny(text, [
    /\btrade[- ]?off\b/i,
    /\brisk\b/i,
    /\bcost\b/i,
    /\bdownside\b/i,
    /\bdelay\b/i,
    /\bdelaying\b/i,
    /\bdefer\b/i,
    /\bdeferring\b/i,
    /\bpause\b/i,
    /\bhold\b/i,
    /\bslip\b/i,
    /\bcut\b/i,
  ]);
}

function tradeoffCandidateSentences(text: string): string[] {
  return text
    .replace(/\n+/g, ". ")
    .split(/(?<=[.!?])\s+|(?=\b(?:Tradeoff|Downside|Risk|Cost):)/i)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .filter(
      (sentence) =>
        hasTradeoffHedge(sentence) ||
        hasAny(sentence, [
          /\bbut\b/i,
          /\bin exchange for\b/i,
          /\bversus\b/i,
          /\bvs\.?\b/i,
          /\binstead of\b/i,
          /\bwhile\b/i,
          /\bat the cost of\b/i,
          /\bwe lose\b/i,
          /\bwe give up\b/i,
        ]),
    );
}

function explicitTradeoffSentences(text: string): string[] {
  return text
    .replace(/\n+/g, ". ")
    .split(/(?<=[.!?])\s+|(?=\b(?:Tradeoff|Downside|Risk|Cost):)/i)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .filter((sentence) =>
      hasAny(sentence, [
        /^\s*(trade[- ]?off|downside|risk|cost):/i,
        /\btrade[- ]?off is\b/i,
        /\btrade[- ]?off:?\b/i,
      ]),
    );
}

function hasNonSubstantiveTradeoff(text: string): boolean {
  return explicitTradeoffSentences(text).some(
    (sentence) => hasTradeoffHedge(sentence) && !hasSubstantiveTradeoff(sentence),
  );
}

function tokenizeImportant(text: string): string[] {
  return compact(text)
    .toLowerCase()
    .split(/[^a-z0-9$%.-]+/)
    .filter((word) => word.length >= 4)
    .filter(
      (word) =>
        ![
          "with",
          "from",
          "that",
          "this",
          "until",
          "will",
          "should",
          "need",
          "needs",
          "before",
          "after",
          "because",
        ].includes(word),
    );
}

function hasCallInText(input: ReviewInputBase, text: string): boolean {
  const callTerms = tokenizeImportant(input.pmCall).slice(0, 8);
  if (callTerms.length === 0) return false;
  const lower = text.toLowerCase();
  const hits = callTerms.filter((term) => lower.includes(term)).length;
  return hits >= Math.min(3, callTerms.length);
}

function hasAudienceSignal(input: ReviewInputBase, text: string): boolean {
  const lower = `${input.audience} ${text}`.toLowerCase();
  if (
    input.audience.trim().length >= 3 &&
    text.toLowerCase().includes(input.audience.trim().toLowerCase())
  ) {
    return true;
  }
  return hasAny(lower, [
    /\b(vp|ceo|cfo|cto|exec|gm|director|lead|manager|admin)\b/i,
    /\b(customer|customers|sales|support|eng|engineering|design|finance|legal|cs|pm)\b/i,
    /\bteam\b/i,
  ]);
}

function hasEvidence(text: string): boolean {
  return hasAny(text, [
    /\b\d+(\.\d+)?%?\b/i,
    /\$[\d,.]+/i,
    /\b(customer|customers|pilot|beta|incident|p0|p1|sla|deadline|renewal|close|blocked|escalation)\b/i,
    /\b(chargeback|payout|legal hold|data access|security review|crash[- ]free)\b/i,
    /\b(audit[- ]log|actor attribution|unauthorized access|patch verification|webhook|replay protection)\b/i,
    /\bq[1-4]\b/i,
  ]);
}

function hasTradeoff(text: string): boolean {
  return hasAny(text, [
    /\btrade[- ]?off\b/i,
    /\brisk\b/i,
    /\bcost\b/i,
    /\bdownside\b/i,
    /\bhold\b/i,
    /\bthrottle\b/i,
    /\bprotect\b/i,
    /\bguarantee\b/i,
    /\bsigned term\b/i,
    /\bdisable\b/i,
    /\bdisabling\b/i,
    /\bextend(ed)?\b/i,
    /\bmigrat(e|ion|ing)\b/i,
    /\bsunset\b/i,
    /\bdelay\b/i,
    /\bdelaying\b/i,
    /\bdefer\b/i,
    /\bdeferring\b/i,
    /\bpause\b/i,
    /\bfreeze\b/i,
    /\bcut\b/i,
    /\bmiss\b/i,
    /\bslip\b/i,
    /\bmove launch\b/i,
    /\bnot doing\b/i,
    /\bwe give up\b/i,
    /\bin exchange for\b/i,
    /\baccept(ing)?\b/i,
    /\berror rate\b/i,
    /\bcannot promise\b/i,
    /\bcan't promise\b/i,
    /\bsame[- ]day\b/i,
    /\bextra validation\b/i,
    /\bverified\b/i,
    /\bverification\b/i,
    /\bavoid(s|ing)?\b/i,
  ]);
}

function hasAsk(text: string): boolean {
  return hasAny(text, [
    /\bplease\b/i,
    /\bapprove\b/i,
    /\bconfirm\b/i,
    /\bdecide\b/i,
    /\bsign[- ]?off\b/i,
    /\brespond\b/i,
    /\breply\b/i,
    /\bunblock\b/i,
    /\bnext step\b/i,
  ]);
}

function hasOwnerOrDate(text: string): boolean {
  return hasAny(text, [
    /\b(today|tomorrow|eod|monday|tuesday|wednesday|thursday|friday|by \d|q[1-4])\b/i,
    /\b(jan(?:uary)?\.?|feb(?:ruary)?\.?|mar(?:ch)?\.?|apr(?:il)?\.?|may|jun(?:e)?\.?|jul(?:y)?\.?|aug(?:ust)?\.?|sep(?:tember)?\.?|oct(?:ober)?\.?|nov(?:ember)?\.?|dec(?:ember)?\.?)\s+\d{1,2}\b/i,
    /\b(owner|dri|finance|eng|engineering|support|sales|design|legal|pm|cs)\b/i,
  ]);
}

function scoreStatus(score: number, max: number): RubricDimensionScore["status"] {
  const pct = score / max;
  if (pct >= 0.8) return "strong";
  if (pct >= 0.45) return "partial";
  return "miss";
}

function dimension(
  id: RubricDimensionId,
  score: number,
  landed: string,
  missed: string,
  repair: string,
): RubricDimensionScore {
  const meta = DIMENSION_META[id];
  const bounded = Math.max(0, Math.min(meta.max, Math.round(score)));
  return {
    id,
    label: meta.label,
    max: meta.max,
    score: bounded,
    status: scoreStatus(bounded, meta.max),
    landed,
    missed,
    repair,
  };
}

function artifactShapeScore(input: ReviewInputBase, text: string, mode: AssessmentMode): number {
  const rubric = ARTIFACT_RUBRICS[input.artifactKind];
  const shapeHits = rubric.shapeSignals.filter((signal) => signal.test(text)).length;
  if (mode === "dojo-rewrite" || shapeHits > 0) {
    return (shapeHits / rubric.shapeSignals.length) * DIMENSION_META["artifact-shape"].max;
  }
  const sentences = text.split(/[.!?\n]+/).filter((part) => part.trim().length > 0).length;
  if (sentences <= 4 && text.length > 80) return 7;
  return 4;
}

function articleFor(label: string): string {
  return /^[aeiou]/i.test(label) ? "an" : "a";
}

export function detectAntiPatterns(text: string): AntiPatternHit[] {
  const signals = analyzeResponse(text);
  const explicitHits = ANTI_PATTERN_BANK.flatMap((pattern) => {
    const examples = pattern.patterns
      .map((regex) => text.match(regex)?.[0])
      .filter((match): match is string => Boolean(match));
    if (examples.length === 0) return [];
    return [
      {
        id: pattern.id,
        label: pattern.label,
        severity: pattern.severity,
        repair: pattern.repair,
        examples: [...new Set(examples)].slice(0, 3),
      },
    ];
  });

  if (signals.stuffed && !explicitHits.some((hit) => hit.id === "keyword-stuffing")) {
    return [
      ...explicitHits,
      {
        id: "keyword-stuffing",
        label: "Keyword-stuffed non-answer",
        severity: 22,
        repair: "Write the artifact, not rubric bingo. A pile of PM words is not a decision.",
        examples: ["rubric keywords dominate the draft"],
      },
    ];
  }

  return explicitHits;
}

export function findMissingContext(input: ReviewInputBase): string[] {
  const combined = `${input.context}\n${input.draft}`;
  const missing: string[] = [];
  if (compact(input.audience).length < 3) missing.push("Name who needs to decide, act, or be reassured.");
  if (compact(input.pmCall).length < 12) missing.push("State the PM call as a one-line decision.");
  if (!hasSubstantiveEvidence(`${input.context}\n${input.draft}`)) {
    missing.push("Add one concrete fact: metric, customer signal, deadline, or constraint.");
  }
  if (input.artifactKind === "customer" && !hasCustomerAccountability(`${input.pmCall}\n${combined}`)) {
    missing.push("State what we are committing to, refusing to promise, or keeping true if timing slips.");
  } else if (input.artifactKind !== "customer" && !hasSubstantiveTradeoff(`${input.pmCall}\n${combined}`)) {
    missing.push("State the tradeoff: what slows down, what risk we accept, or what we are not doing.");
  }
  return missing;
}

export function assessWithRubricBank(
  input: ReviewInputBase,
  text: string,
  mode: AssessmentMode,
): RubricAssessment {
  const combinedForContext = `${input.pmCall}\n${input.audience}\n${input.context}\n${text}`;
  const signals = analyzeResponse(text);
  const antiPatterns = [
    ...detectAntiPatterns(text),
    ...(input.artifactKind === "customer" &&
    hasAny(text, [/\beng\b/i, /\bqa\b/i, /\bdri\b/i, /\bstandup\b/i, /\binternal\b/i, /\bpipeline\b/i])
      ? [
          {
            id: "customer-internal-jargon",
            label: "Internal jargon in customer reply",
            severity: 12,
            repair:
              "Translate internal process language into customer-facing accountability.",
            examples: ["internal process language"],
          },
        ]
      : []),
  ];
  const missingContext = findMissingContext(input);
  const artifactLabel = ARTIFACT_LABELS[input.artifactKind];

  const callStrong = hasCallInText(input, text) || hasAny(text, [/\brecommendation:/i, /\bdecision needed:/i]);
  const callPartial = compact(input.pmCall).length >= 12 || signals.decisionCount > 0;

  const audienceStrong = hasAudienceSignal(input, text);
  const evidenceStrong = hasEvidence(text);
  const evidencePartial = hasEvidence(combinedForContext);
  const tradeoffStrong =
    input.artifactKind === "customer" ? hasCustomerAccountability(text) : hasTradeoff(text);
  const tradeoffPartial =
    input.artifactKind === "customer"
      ? hasCustomerAccountability(combinedForContext)
      : hasTradeoff(combinedForContext);
  const askStrong = hasAsk(text) && hasOwnerOrDate(text);
  const askPartial = hasAsk(text) || hasOwnerOrDate(text);
  const shapeScore = artifactShapeScore(input, text, mode);
  const isKeywordStuffed = antiPatterns.some((hit) => hit.id === "keyword-stuffing");
  const specificityScore =
    Math.min(
      DIMENSION_META.specificity.max,
      Math.min(5, signals.numberCount * 2) +
        (hasOwnerOrDate(text) ? 3 : 0) +
        (signals.actionVerbCount >= 2 ? 2 : signals.actionVerbCount) +
        (hasAsk(text) && hasOwnerOrDate(text) && hasEvidence(text) ? 2 : 0),
    );
  const tonePenalty = Math.min(
    DIMENSION_META.tone.max,
    antiPatterns.reduce((sum, hit) => sum + Math.ceil(hit.severity / 3), 0),
  );
  const placeholderPenalty = /\[[^\]]+\]/.test(text) ? 4 : 0;

  const dimensions = [
    dimension(
      "pm-call",
      isKeywordStuffed ? 0 : callStrong ? 14 : callPartial ? 8 : 0,
      "The artifact carries a PM call, not just a topic.",
      "State the PM call explicitly: what should happen next and why.",
      "Put the recommendation or decision in the first line.",
    ),
    dimension(
      "audience-fit",
      audienceStrong ? 10 : compact(input.audience).length >= 3 ? 7 : 0,
      "The audience is identifiable.",
      "Name who needs to decide, act, or be reassured.",
      "Tune the artifact to a named reader or role.",
    ),
    dimension(
      "evidence",
      isKeywordStuffed ? 0 : evidenceStrong ? 16 : evidencePartial ? 9 : 0,
      "The artifact includes a concrete fact, customer signal, metric, or deadline.",
      "Add one concrete fact: metric, customer count, deadline, revenue impact, incident severity, or observed signal.",
      "Move the strongest fact into the body; do not invent evidence.",
    ),
    dimension(
      "tradeoff",
      isKeywordStuffed ? 0 : tradeoffStrong ? 12 : tradeoffPartial ? 8 : 0,
      input.artifactKind === "customer"
        ? "The customer-facing accountability is visible."
        : "The cost or risk is visible.",
      input.artifactKind === "customer"
        ? "Name what you are committing to, refusing to promise, or keeping true if timing slips."
        : "Name the tradeoff or risk you are accepting.",
      input.artifactKind === "customer"
        ? "Add the accountability line before sending."
        : "Say what you are delaying, accepting, or not doing.",
    ),
    dimension(
      "ask-owner-date",
      isKeywordStuffed ? 0 : askStrong ? 16 : askPartial ? 9 : 0,
      "The reader has a next action, owner, or date.",
      "End with the exact ask: approve, decide, respond, unblock, or disagree by a date.",
      "Add an owner/date ask so the artifact turns into action.",
    ),
    dimension(
      "artifact-shape",
      isKeywordStuffed ? 0 : shapeScore,
      `The draft resembles a ${artifactLabel}.`,
      `Reshape this as ${articleFor(artifactLabel)} ${artifactLabel}, not a generic critique.`,
      `Use the expected moves: ${ARTIFACT_RUBRICS[input.artifactKind].requiredMoves.join(", ")}.`,
    ),
    dimension(
      "specificity",
      isKeywordStuffed ? 0 : specificityScore,
      "The message has concrete nouns, actions, and timing.",
      "The draft is still too vague to act on.",
      "Add concrete noun + owner + date + action.",
    ),
    dimension(
      "tone",
      DIMENSION_META.tone.max - tonePenalty - placeholderPenalty,
      "The tone is direct and work-native.",
      `Remove language that weakens ${artifactLabel} judgment.`,
      "Cut slang, hedging, filler, and placeholders before sending.",
    ),
  ];

  const maxScore = dimensions.reduce((sum, item) => sum + item.max, 0);
  const missedDimensions = dimensions.filter((item) => item.status !== "strong");
  const contextBlockers =
    mode === "dojo-rewrite" && missingContext.length > 0 ? missingContext : [];
  const rawScore = dimensions.reduce((sum, item) => sum + item.score, 0);
  const uncappedScore = Math.round((rawScore / maxScore) * 100);
  const hasPlaceholder = /\[[^\]]+\]/.test(text);
  const nonSubstantiveDraftTradeoff =
    input.artifactKind !== "customer" && hasNonSubstantiveTradeoff(input.draft);
  const score =
    mode === "dojo-rewrite" && nonSubstantiveDraftTradeoff
      ? Math.min(uncappedScore, 80)
      : mode === "dojo-rewrite" && missingContext.length > 0
        ? Math.min(uncappedScore, 89)
        : mode === "dojo-rewrite" && hasPlaceholder
          ? Math.min(uncappedScore, 89)
          : uncappedScore;

  return {
    version: RUBRIC_BANK_VERSION,
    mode,
    score,
    maxScore: 100,
    dimensions,
    landed: dimensions
      .filter((item) => item.status === "strong")
      .map((item) => item.landed)
      .slice(0, 4),
    missed: [
      ...antiPatterns.map(
        (hit) =>
          `${hit.repair} Detected: ${hit.examples.join(", ")}.`,
      ),
      ...missedDimensions.map((item) => item.missed),
    ].slice(0, 5),
    repairs: [
      ...antiPatterns.map((hit) => hit.repair),
      ...missedDimensions.map((item) => item.repair),
    ].slice(0, 6),
    antiPatterns,
    missingContext: contextBlockers,
    pmCallBlockers: [],
    canReachExcellent: contextBlockers.length === 0 && !hasPlaceholder,
  };
}

export function scoreToReadiness(score: number, missedCount: number): "Send" | "Revise first" | "Do not send" {
  if (score >= 78 && missedCount <= 2) return "Send";
  if (score >= 46) return "Revise first";
  return "Do not send";
}

export function getArtifactLabel(kind: ArtifactKind): string {
  return ARTIFACT_LABELS[kind];
}

export function getSlangTerms(): string[] {
  return SLANG_PATTERNS;
}
