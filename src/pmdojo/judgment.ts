import { countImportantTermHits, extractImportantTerms, hasConcreteEvidenceSignal } from './signals'
import type { JudgmentCheckpoint } from './types'

export type JudgmentReview = {
  score: number
  label: string
  detail: string
  missing: string[]
}

export const EMPTY_JUDGMENT_CHECKPOINT: JudgmentCheckpoint = {
  recommendation: '',
  nonGoals: '',
  evidence: '',
  tradeoff: '',
  ask: '',
  changeMind: '',
}

export function normalizeJudgmentCheckpoint(judgment?: Partial<JudgmentCheckpoint>): JudgmentCheckpoint {
  return {
    recommendation: judgment?.recommendation?.trim() ?? '',
    nonGoals: judgment?.nonGoals?.trim() ?? '',
    evidence: judgment?.evidence?.trim() ?? '',
    tradeoff: judgment?.tradeoff?.trim() ?? '',
    ask: judgment?.ask?.trim() ?? '',
    changeMind: judgment?.changeMind?.trim() ?? '',
  }
}

export function judgmentParts(judgment?: Partial<JudgmentCheckpoint>) {
  const normalized = normalizeJudgmentCheckpoint(judgment)
  return Object.values(normalized).filter(Boolean)
}

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length
}

function hasSpecificAsk(value: string) {
  return /@\w+|\b(owner|need|ask|approve|confirm|decide|decision|next step|today|tomorrow|eod|friday|monday|tuesday|wednesday|thursday|by \d|by [a-z]+|\d\s?(am|pm))\b/i.test(
    value,
  )
}

function hasTradeoffSignal(value: string) {
  return /\b(tradeoff|risk|cost|delay|slip|scope|cut|defer|not doing|hold|pause|instead|but|lose|accept)\b/i.test(value)
}

export function evaluateJudgmentCheckpoint(judgment?: Partial<JudgmentCheckpoint>): JudgmentReview {
  const normalized = normalizeJudgmentCheckpoint(judgment)
  const missing: string[] = []
  let score = 0

  if (words(normalized.recommendation) >= 3) {
    score += 20
  } else {
    missing.push('recommendation')
  }

  if (normalized.evidence && hasConcreteEvidenceSignal(normalized.evidence)) {
    score += 20
  } else if (words(normalized.evidence) >= 5) {
    score += 12
    missing.push('concrete evidence')
  } else {
    missing.push('concrete evidence')
  }

  if (hasTradeoffSignal(normalized.tradeoff)) {
    score += 18
  } else if (words(normalized.tradeoff) >= 5) {
    score += 10
    missing.push('explicit tradeoff')
  } else {
    missing.push('explicit tradeoff')
  }

  if (hasSpecificAsk(normalized.ask)) {
    score += 18
  } else if (words(normalized.ask) >= 4) {
    score += 10
    missing.push('owner or clock')
  } else {
    missing.push('owner or clock')
  }

  if (words(normalized.nonGoals) >= 3) {
    score += 12
  } else {
    missing.push('what you are not doing')
  }

  if (words(normalized.changeMind) >= 4) {
    score += 12
  } else {
    missing.push('what would change the call')
  }

  if (score >= 78) {
    return {
      score,
      label: 'CALL IS EXPLICIT',
      detail: 'The PM call is written down before the prose, so Dojo can judge carry-through instead of guessing intent.',
      missing: [],
    }
  }

  if (score >= 48) {
    return {
      score,
      label: 'CALL IS PARTIAL',
      detail: 'There is enough signal to review the draft, but the actual PM judgment still has gaps.',
      missing,
    }
  }

  return {
    score,
    label: 'CALL IS FUZZY',
    detail: 'Dojo can coach writing, but it cannot reliably judge the PM call until the recommendation, evidence, tradeoff, and ask are explicit.',
    missing,
  }
}

export function carriesJudgmentField(draft: string, fieldValue: string, minimumHits = 1) {
  const value = fieldValue.trim()

  if (!value) {
    return false
  }

  const terms = extractImportantTerms([value], 10)

  if (terms.length === 0) {
    return false
  }

  return countImportantTermHits(draft, terms) >= minimumHits
}

export function hasAnyJudgment(judgment?: Partial<JudgmentCheckpoint>) {
  return judgmentParts(judgment).length > 0
}
