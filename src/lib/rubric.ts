// Deterministic scoring rubric. Runs in-browser, no network, no key.
// Scores 0-10 on clarity/strategy/substance by pattern-matching against
// the wiki principles (weak words, front-load, anti-sell, specificity).

import type { ScoreResult, FeedbackItem } from "./scoring";

const WEAK_WORDS = [
  "just",
  "maybe",
  "perhaps",
  "i think",
  "kind of",
  "sort of",
  "a bit",
  "try to",
  "wanted to",
  "i guess",
  "probably",
  "somewhat",
  "a little",
  "hopefully",
];

const PLATITUDES = [
  "align",
  "synergy",
  "leverage",
  "circle back",
  "touch base",
  "take offline",
  "at the end of the day",
  "moving forward",
  "best practices",
  "low-hanging fruit",
];

const ANTI_SELL = [
  "tradeoff",
  "trade-off",
  "risk",
  "downside",
  "concern",
  "cost",
  "however",
  "but",
  "caveat",
  "drawback",
];

const DECISION_WORDS = [
  "recommend",
  "propose",
  "suggest",
  "decide",
  "choose",
  "pick",
  "should",
  "will",
  "plan to",
  "going to",
];

const STAKEHOLDER_WORDS = [
  "team",
  "user",
  "customer",
  "stakeholder",
  "vp",
  "ceo",
  "exec",
  "eng",
  "design",
  "sales",
  "legal",
  "finance",
];

const ACTION_VERBS = [
  "ship",
  "send",
  "write",
  "draft",
  "meet",
  "ask",
  "tell",
  "show",
  "escalate",
  "post",
  "email",
  "fix",
  "pause",
  "kill",
  "cut",
  "run",
  "build",
  "test",
  "measure",
];

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countMatches(text: string, patterns: string[]): number {
  const lower = text.toLowerCase();
  return patterns.reduce((n, p) => {
    const escaped = escapeRegex(p);
    // Whole-word on both sides for single words; for multi-word phrases, anchor
    // at a word boundary on both ends of the phrase.
    const re = new RegExp(`\\b${escaped}\\b`, "g");
    const m = lower.match(re);
    return n + (m ? m.length : 0);
  }, 0);
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export interface RubricSignals {
  wordCount: number;
  weakWordCount: number;
  platitudeCount: number;
  antiSellCount: number;
  decisionCount: number;
  stakeholderCount: number;
  actionVerbCount: number;
  numberCount: number;
  frontLoadsRecommendation: boolean;
  buriedLede: boolean;
  stuffed: boolean; // keyword-stuffing detector
}

// Declarative/status verbs that count as "leading with the point" even when no
// explicit recommendation is being made (e.g. status updates, post-mortems).
const STATUS_LEAD_VERBS = [
  "shipped",
  "launched",
  "resolved",
  "fixed",
  "blocked",
  "approved",
  "rejected",
  "completed",
  "confirmed",
  "decided",
  "paused",
  "killed",
  "cut",
  "delivered",
  "missed",
  "slipped",
  "escalated",
];

export function analyzeResponse(text: string): RubricSignals {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const first15Words = words.slice(0, 15).join(" ").toLowerCase();
  const hasDecisionUpFront = DECISION_WORDS.some((w) =>
    first15Words.includes(w),
  );
  const hasStatusLeadUpFront = STATUS_LEAD_VERBS.some((v) =>
    new RegExp(`\\b${v}\\b`).test(first15Words),
  );
  const hasNumberUpFront = /\b\d/.test(first15Words);
  const frontLoadsRecommendation =
    hasDecisionUpFront || hasStatusLeadUpFront || hasNumberUpFront;
  // Only flag "buried lede" when the writer wrote long enough to have space to
  // bury it AND the opener is neither a recommendation, a status statement,
  // nor an opening with a number/metric.
  const buriedLede = !frontLoadsRecommendation && wordCount > 60;
  const numberCount = (text.match(/\b\d+(\.\d+)?%?\b/g) || []).length;

  const weakWordCount = countMatches(text, WEAK_WORDS);
  const platitudeCount = countMatches(text, PLATITUDES);
  const antiSellCount = countMatches(text, ANTI_SELL);
  const decisionCount = countMatches(text, DECISION_WORDS);
  const stakeholderCount = countMatches(text, STAKEHOLDER_WORDS);
  const actionVerbCount = countMatches(text, ACTION_VERBS);

  // Keyword-stuffing guard: if scoring keywords dominate word count, the writer
  // is gaming the rubric rather than communicating. Penalize in Strategy/Substance.
  const scoringKeywordTotal =
    antiSellCount + decisionCount + stakeholderCount + actionVerbCount;
  const stuffed = wordCount > 0 && scoringKeywordTotal / wordCount > 0.25;

  return {
    wordCount,
    weakWordCount,
    platitudeCount,
    antiSellCount,
    decisionCount,
    stakeholderCount,
    actionVerbCount,
    numberCount,
    frontLoadsRecommendation,
    buriedLede,
    stuffed,
  };
}

function scoreClarity(s: RubricSignals): number {
  let score = 5;
  score -= Math.min(6, s.weakWordCount);
  score -= Math.min(3, s.platitudeCount * 2);
  if (s.frontLoadsRecommendation) score += 3;
  if (s.buriedLede) score -= 2;
  if (s.wordCount >= 30 && s.wordCount <= 150) score += 2;
  if (s.wordCount > 250) score -= 1;
  if (s.wordCount < 20) score -= 3;
  return clamp(score, 0, 10);
}

function scoreStrategy(s: RubricSignals): number {
  let score = 4;
  score += Math.min(4, s.antiSellCount * 2);
  score += Math.min(2, s.stakeholderCount);
  if (s.decisionCount >= 1) score += 2;
  if (s.decisionCount >= 3) score += 1;
  if (s.stuffed) score -= 4;
  return clamp(score, 0, 10);
}

function scoreSubstance(s: RubricSignals): number {
  let score = 4;
  score += Math.min(4, s.numberCount);
  score += Math.min(3, s.actionVerbCount);
  score -= Math.min(3, s.platitudeCount * 2);
  if (s.wordCount < 20) score -= 3;
  if (s.stuffed) score -= 4;
  return clamp(score, 0, 10);
}

function buildFeedback(s: RubricSignals, text: string): FeedbackItem[] {
  const items: FeedbackItem[] = [];

  if (s.frontLoadsRecommendation) {
    items.push({
      principle: "Front-load the point",
      source: "Wes Kao — Conciseness",
      status: "applied",
      note: "Your recommendation shows up in the first 15 words. Reader gets the signal immediately.",
    });
  } else if (s.buriedLede) {
    items.push({
      principle: "Front-load the point",
      source: "Wes Kao — Conciseness",
      status: "missed",
      note: "The recommendation is buried. Move your actual ask or decision to the first sentence.",
    });
  }

  if (s.weakWordCount === 0) {
    items.push({
      principle: "Cut weak words",
      source: "Wes Kao — Signal-per-word",
      status: "applied",
      note: "No hedging detected. Direct voice.",
    });
  } else {
    const found = WEAK_WORDS.filter((w) =>
      text.toLowerCase().includes(w),
    ).slice(0, 3);
    items.push({
      principle: "Cut weak words",
      source: "Wes Kao — Signal-per-word",
      status: s.weakWordCount >= 3 ? "missed" : "partial",
      note: `Detected: ${found.join(", ")}. Each one drains signal. Delete or replace with a direct verb.`,
    });
  }

  if (s.antiSellCount >= 2) {
    items.push({
      principle: "Anti-sell the tradeoff",
      source: "Wes Kao — Influence",
      status: "applied",
      note: "You named costs/risks/tradeoffs. Builds credibility faster than pure advocacy.",
    });
  } else if (s.antiSellCount === 1) {
    items.push({
      principle: "Anti-sell the tradeoff",
      source: "Wes Kao — Influence",
      status: "partial",
      note: "One hedge detected. Name at least one real cost or risk explicitly.",
    });
  } else {
    items.push({
      principle: "Anti-sell the tradeoff",
      source: "Wes Kao — Influence",
      status: "missed",
      note: "Pure advocacy without acknowledging downsides reads as unserious. Name one tradeoff.",
    });
  }

  if (s.decisionCount >= 1) {
    items.push({
      principle: "Make the recommendation",
      source: "Shreyas Doshi — Managing up",
      status: "applied",
      note: "You proposed a move, not just described the situation.",
    });
  } else {
    items.push({
      principle: "Make the recommendation",
      source: "Shreyas Doshi — Managing up",
      status: "missed",
      note: 'No recommendation verb detected (recommend/propose/should/will). Don\'t ask "what do you want me to do" — propose.',
    });
  }

  if (s.platitudeCount >= 1) {
    const found = PLATITUDES.filter((p) =>
      text.toLowerCase().includes(p),
    ).slice(0, 2);
    items.push({
      principle: "Kill platitudes",
      source: "Communication & Writing wiki",
      status: "missed",
      note: `Corporate filler detected: ${found.join(", ")}. Replace with the specific action.`,
    });
  }

  if (s.stuffed) {
    items.push({
      principle: "Don't game the rubric",
      source: "Rubric integrity check",
      status: "missed",
      note: "Scoring keywords dominate your word count. Keyword-stuffing inflates pattern matches but reads as thin to any human reader. Write the message, not the buzzword bingo.",
    });
  }

  return items.slice(0, 6);
}

function buildCoachPunch(
  s: RubricSignals,
  clarity: number,
  strategy: number,
  substance: number,
): string {
  const lowest = Math.min(clarity, strategy, substance);
  if (lowest === clarity && clarity < 6) {
    if (s.buriedLede)
      return "Your answer is in paragraph 2. Move it to sentence 1.";
    if (s.weakWordCount >= 3)
      return `You hedged ${s.weakWordCount} times. Pick one claim and stand behind it.`;
    return "Tighten the language. Every weak word costs you credibility.";
  }
  if (lowest === strategy && strategy < 6) {
    if (s.antiSellCount === 0)
      return "You sold without naming a cost. Senior PMs name the tradeoff first.";
    if (s.decisionCount === 0)
      return "You described the problem but didn't propose a move. Propose.";
    return "Add a stakeholder and a tradeoff. That's strategy.";
  }
  if (lowest === substance && substance < 6) {
    if (s.numberCount === 0)
      return "No numbers, no dates, no specifics. Vague responses don't get acted on.";
    return "More concrete verbs. What exactly will you do, to whom, by when?";
  }
  return "Solid round. Find the weakest dimension and push it next time.";
}

export function scoreWithRubric(response: string): ScoreResult {
  const signals = analyzeResponse(response);
  const clarity = scoreClarity(signals);
  const strategy = scoreStrategy(signals);
  const substance = scoreSubstance(signals);
  const total = clarity + strategy + substance;

  return {
    clarity,
    strategy,
    substance,
    total,
    maxTotal: 30,
    feedback: buildFeedback(signals, response),
    coachPunch: buildCoachPunch(signals, clarity, strategy, substance),
  };
}
