import { getPrinciple, inferPrincipleId } from './principles'
import { countImportantTermHits, extractImportantTerms, hasConcreteEvidenceSignal } from './signals'
import type { ContextConfidence, Grade, JudgmentCheckpoint, RubricCheck, RunRecord, Scenario } from './types'

export type DraftEvaluation = {
  checks: RubricCheck[]
  xp: number
  grade: Grade
  evaluator: string
}

export type DraftEvaluator = {
  id: string
  evaluate: (scenario: Scenario, draft: string) => DraftEvaluation
}

function evaluateChecks(scenario: Scenario, draft: string): RubricCheck[] {
  const lowerDraft = draft.toLowerCase()

  return scenario.rubric.map((rule) => {
    const result = rule.evaluate(draft, lowerDraft)
    const principle = getPrinciple(rule.principleId ?? inferPrincipleId(rule.id, rule.label))

    return {
      id: rule.id,
      label: rule.label,
      pts: rule.pts,
      detail: rule.detail,
      hit: result.hit,
      partial: result.partial,
      principleId: principle.id,
      principleLabel: principle.shortLabel,
      principleSource: principle.source,
    }
  })
}

export function countWords(draft: string) {
  return draft.trim().split(/\s+/).filter(Boolean).length
}

function hasStructure(draft: string) {
  const lines = draft
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return lines.length >= 3 || /\b1\.|\b2\.|\b3\.|in:|out:|tests?:|why:|ask:/i.test(draft)
}

function hasDecisionLead(draft: string) {
  return /^(rec|recommendation|decision|ask|cutline|assumption|proposal|summary|update)[:\s-]/i.test(draft.trim()) ||
    /^(before (we )?(fund|funding|build|building|launch|launching|commit|committing)|riskiest assumptions|assumptions|tests?)\b/i.test(
      draft.trim(),
    ) ||
    /\b(rec|recommendation|decision|ask|cutline|proposal|summary|update):/i.test(draft.slice(0, 260))
}

function hasReasoningBridge(draft: string) {
  return /\b(because|why|so that|therefore|impact|evidence|signal|reason|risk|tradeoff|unless|assumption|test|kill|demand|value)\b/i.test(
    draft,
  )
}

function hasOwnerOrClock(draft: string) {
  return /@\w+|\b(owner|need|ask|approve|confirm|decision|next step|this week|today|tomorrow|eod|noon|friday|monday|tuesday|wednesday|thursday|by \d|by [a-z]+|\d\s?(am|pm))\b/i.test(
    draft,
  )
}

function scenarioTermHits(scenario: Scenario, draft: string) {
  if (scenario.source === 'practice') {
    const terms = extractImportantTerms([scenario.brief, scenario.quoteAttribution, scenario.chips], 14)
    return countImportantTermHits(draft, terms)
  }

  const terms = extractImportantTerms(
    [scenario.brief, scenario.quote, scenario.quoteAttribution, scenario.cues.map((cue) => cue.text), scenario.chips],
    18,
  )
  return countImportantTermHits(draft, terms)
}

function qualityCap(scenario: Scenario, draft: string) {
  const lowerDraft = draft.toLowerCase()
  const wordCount = countWords(draft)
  const structureMarks = (draft.match(/[.?!:\n]/g) || []).length
  const structured = hasStructure(draft)
  const termHits = scenarioTermHits(scenario, draft)
  const keywords = [
    /rec|recommend|decision/,
    /tradeoff|risk|cost|delay/,
    /customer|arr|revenue|metric|kpi|invoice|billing|renewal/,
    /@\w+|owner|approve|confirm/,
    /today|tomorrow|friday|eod|by /,
    /test|validate|evidence|kill/,
    /scope|cut|pause|defer/,
  ].filter((pattern) => pattern.test(lowerDraft)).length

  if (wordCount === 0) {
    return 0
  }

  if (wordCount < 12) {
    return 18
  }

  if (wordCount < 28 && keywords >= 5) {
    return 30
  }

  if (/\b(no tradeoff|tradeoff:\s*(none|n\/a)|no risk|no downside)\b/.test(lowerDraft)) {
    return 45
  }

  if (keywords >= 6 && structureMarks < 2) {
    return 35
  }

  if (
    /\b(all .* important|keep (the )?(list|plan|scope|conversation|options) open|keep talking|revisit later|looking into it|share more when|should build .* before deciding)\b/.test(
      lowerDraft,
    )
  ) {
    return 30
  }

  if (!structured && keywords >= 4) {
    return 35
  }

  if (wordCount >= 28 && scenario.source !== 'practice' && termHits === 0) {
    return 52
  }

  if (wordCount >= 45 && !hasDecisionLead(draft)) {
    return 62
  }

  if (wordCount >= 45 && !hasConcreteEvidenceSignal(draft)) {
    return 68
  }

  if (wordCount >= 45 && !hasReasoningBridge(draft)) {
    return 72
  }

  if (wordCount >= 45 && !hasOwnerOrClock(draft)) {
    return 72
  }

  return null
}

export function calculateProjectedXp(checks: RubricCheck[]) {
  return checks.reduce((total, check) => {
    if (check.hit) {
      return total + check.pts
    }

    if (check.partial) {
      return total + Math.floor(check.pts / 2)
    }

    return total
  }, 0)
}

export function gradeForXp(xp: number): Grade {
  if (xp >= 80) {
    return 'S'
  }

  if (xp >= 65) {
    return 'A'
  }

  if (xp >= 50) {
    return 'B'
  }

  if (xp >= 35) {
    return 'C'
  }

  return 'D'
}

export const localRegexEvaluator: DraftEvaluator = {
  id: 'local-principle-regex-v3',
  evaluate: (scenario, draft) => {
    const checks = evaluateChecks(scenario, draft)
    const rawXp = calculateProjectedXp(checks)
    const cap = qualityCap(scenario, draft)
    const xp = cap === null ? rawXp : Math.min(rawXp, cap)

    return {
      checks,
      xp,
      grade: gradeForXp(xp),
      evaluator: localRegexEvaluator.id,
    }
  },
}

export function evaluateDraft(scenario: Scenario, draft: string, evaluator: DraftEvaluator = localRegexEvaluator) {
  return evaluator.evaluate(scenario, draft)
}

export function evaluateRubric(scenario: Scenario, draft: string): RubricCheck[] {
  return evaluateDraft(scenario, draft).checks
}

export function createRunRecord(
  scenario: Scenario,
  draft: string,
  timeLeft: number,
  submittedAt: string,
  context?: {
    contextConfidence: ContextConfidence
    contextScore: number
    contextNote: string
    judgmentCheckpoint?: JudgmentCheckpoint
    judgmentScore?: number
    judgmentNote?: string
  },
): RunRecord {
  const evaluation = evaluateDraft(scenario, draft)

  return {
    laneId: scenario.laneId,
    scenarioId: scenario.id,
    draft,
    checks: evaluation.checks,
    xp: evaluation.xp,
    words: countWords(draft),
    timeLeft,
    submittedAt,
    skillDeltas: scenario.skillDeltas,
    grade: evaluation.grade,
    evaluator: evaluation.evaluator,
    ...context,
  }
}
