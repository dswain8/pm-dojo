import type { OutcomeReplay, OutcomeStatus, RunRecord } from './types'

export type OutcomeDraft = {
  status: OutcomeStatus
  readerResponse: string
  surprise: string
  lesson: string
  nextMove: string
}

export type OutcomeReview = {
  score: number
  label: string
  detail: string
  missing: string[]
}

export const EMPTY_OUTCOME_DRAFT: OutcomeDraft = {
  status: 'mixed',
  readerResponse: '',
  surprise: '',
  lesson: '',
  nextMove: '',
}

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length
}

function hasSpecificSignal(value: string) {
  return /@\w+|\b(customer|exec|vp|ceo|eng|sales|support|approved|blocked|pushed|asked|decided|date|eod|today|tomorrow|friday|\$|arr|renewal|churn|metric|deadline)\b/i.test(
    value,
  )
}

export function evaluateOutcomeReplay(input: OutcomeDraft): OutcomeReview {
  const missing: string[] = []
  let score = 0

  if (input.status) {
    score += 10
  }

  if (words(input.readerResponse) >= 10) {
    score += 30
  } else if (words(input.readerResponse) >= 4) {
    score += 16
    missing.push('specific reader response')
  } else {
    missing.push('what happened after sending')
  }

  if (hasSpecificSignal(input.readerResponse)) {
    score += 10
  } else {
    missing.push('specific names, decisions, or stakes')
  }

  if (words(input.surprise) >= 6) {
    score += 20
  } else {
    missing.push('what surprised you')
  }

  if (words(input.lesson) >= 6) {
    score += 20
  } else {
    missing.push('lesson for next time')
  }

  if (words(input.nextMove) >= 5) {
    score += 10
  } else {
    missing.push('next move')
  }

  score = Math.min(100, score)

  if (score >= 75) {
    return {
      score,
      label: 'GOOD REPLAY',
      detail: 'Enough outcome signal to turn this from a writing rep into a judgment rep.',
      missing: [],
    }
  }

  if (score >= 45) {
    return {
      score,
      label: 'PARTIAL REPLAY',
      detail: 'Useful learning signal, but the outcome still needs sharper evidence or a next move.',
      missing,
    }
  }

  return {
    score,
    label: 'THIN REPLAY',
    detail: 'This records that the round happened, but it will not teach much until the response and lesson are explicit.',
    missing,
  }
}

export function buildOutcomeReplay(input: OutcomeDraft, loggedAt: string): OutcomeReplay {
  const review = evaluateOutcomeReplay(input)

  return {
    status: input.status,
    readerResponse: input.readerResponse.trim(),
    surprise: input.surprise.trim(),
    lesson: input.lesson.trim(),
    nextMove: input.nextMove.trim(),
    score: review.score,
    label: review.label,
    loggedAt,
  }
}

export function latestReplayableRun(history: RunRecord[]) {
  return [...history]
    .sort((left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime())
    .find((run) => !run.outcome)
}

export function summarizeOutcomePattern(history: RunRecord[]) {
  const outcomes = history.filter((run) => run.outcome)
  const latest = outcomes[outcomes.length - 1]?.outcome

  return {
    count: outcomes.length,
    latest,
    averageScore:
      outcomes.length === 0
        ? 0
        : Math.round(outcomes.reduce((total, run) => total + (run.outcome?.score ?? 0), 0) / outcomes.length),
  }
}
