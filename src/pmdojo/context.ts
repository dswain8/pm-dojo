import type { PracticeInput } from './practice'
import { evaluateJudgmentCheckpoint, judgmentParts } from './judgment'
import { countImportantTermHits, extractImportantTerms, hasConcreteEvidenceSignal } from './signals'
import type { ContextConfidence } from './types'

export type ContextReview = {
  confidence: ContextConfidence
  score: number
  label: string
  detail: string
  missing: string[]
}

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length
}

function hasConcreteFact(value: string) {
  return hasConcreteEvidenceSignal(value)
}

function hasConstraintOrTradeoff(value: string) {
  return /\b(tradeoff|risk|cost|constraint|scope|delay|slip|defer|cut|alternative|impact|because|but|instead)\b/i.test(value)
}

function hasDecisionOrAsk(value: string) {
  return /\b(rec|recommendation|decision|ask|need|approve|confirm|decide|owner|next step|can you)\b/i.test(value)
}

export function evaluatePracticeContext(input: PracticeInput): ContextReview {
  const audienceWords = words(input.audience)
  const situationWords = words(input.situation)
  const draftWords = words(input.draft)
  const judgmentReview = evaluateJudgmentCheckpoint(input.judgment)
  const combined = `${input.audience}\n${input.situation}\n${input.draft}\n${judgmentParts(input.judgment).join('\n')}`
  const contextTerms = extractImportantTerms([input.audience, input.situation, judgmentParts(input.judgment)], 16)
  const connectedHits = countImportantTermHits(input.draft, contextTerms)
  const missing: string[] = []
  let score = 0

  if (audienceWords >= 2) {
    score += 20
  } else {
    missing.push('specific audience')
  }

  if (situationWords >= 18) {
    score += 25
  } else if (situationWords >= 8) {
    score += 12
    missing.push('full situation')
  } else {
    missing.push('situation and stakes')
  }

  if (draftWords >= 35) {
    score += 25
  } else if (draftWords >= 18) {
    score += 12
    missing.push('complete draft')
  } else {
    missing.push('complete draft')
  }

  if (hasConcreteFact(combined)) {
    score += 15
  } else {
    missing.push('concrete facts')
  }

  if (hasConstraintOrTradeoff(combined)) {
    score += 10
  } else {
    missing.push('constraint or tradeoff')
  }

  if (hasDecisionOrAsk(combined)) {
    score += 5
  } else {
    missing.push('decision or ask')
  }

  if (judgmentReview.score >= 78) {
    score += 10
  } else if (judgmentReview.score >= 48) {
    score += 5
    missing.push('complete PM call')
  } else {
    missing.push('PM call checkpoint')
  }

  if (situationWords >= 8 && draftWords >= 18) {
    if (connectedHits >= 2) {
      score += 10
    } else if (connectedHits === 1) {
      score += 5
      missing.push('draft tied to context')
    } else {
      missing.push('draft tied to context')
    }
  }

  score = Math.min(100, score)

  if (score >= 75) {
    return {
      confidence: 'strong',
      score,
      label: 'STRONG CONTEXT',
      detail: 'Enough audience, stakes, facts, and tradeoff signal to judge the PM call.',
      missing: [],
    }
  }

  if (score >= 45) {
    return {
      confidence: 'usable',
      score,
      label: 'USABLE CONTEXT',
      detail: 'Good enough to review the artifact, but PM judgment may still be under-specified.',
      missing,
    }
  }

  return {
    confidence: 'thin',
    score,
    label: 'THIN CONTEXT',
    detail:
      'Dojo can review writing mechanics, but not whether the PM call is right. Add audience, stakes, facts, tradeoff, ask, and the checkpoint.',
    missing,
  }
}

export function laneContextReview(): ContextReview {
  return {
    confidence: 'strong',
    score: 95,
    label: 'SCENARIO SUPPLIED',
    detail: 'Dojo supplied the audience, pressure, stakes, objective, and rubric for this rep.',
    missing: [],
  }
}
