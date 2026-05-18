export type PrincipleKey = 'front-load' | 'recommendation' | 'tradeoff' | 'ask' | 'evidence' | 'audience' | 'restraint'

export type DojoPrinciple = {
  id: PrincipleKey
  label: string
  shortLabel: string
  source: string
  description: string
  scoringQuestion: string
  antiPattern: string
}

export const DOJO_PRINCIPLES: DojoPrinciple[] = [
  {
    id: 'front-load',
    label: 'Front-load the point',
    shortLabel: 'Point',
    source: 'Lenny archive',
    description: 'Open with the decision, recommendation, or risk before context.',
    scoringQuestion: 'Can the reader understand the point from the first line?',
    antiPattern: 'Long setup, calendar narration, or “wanted to flag” throat-clearing.',
  },
  {
    id: 'recommendation',
    label: 'Make the call',
    shortLabel: 'Call',
    source: 'Lenny archive',
    description: 'Bring a PM recommendation instead of only describing the situation.',
    scoringQuestion: 'Does the draft say what we should do now?',
    antiPattern: 'Neutral status update that forces the reader to infer the decision.',
  },
  {
    id: 'tradeoff',
    label: 'Name the tradeoff',
    shortLabel: 'Tradeoff',
    source: 'Lenny archive',
    description: 'Make the cost, downside, or no-list explicit before someone else does.',
    scoringQuestion: 'Is the choice legible, including what we are not doing?',
    antiPattern: 'Upside-only framing, false certainty, or hiding the sacrifice.',
  },
  {
    id: 'ask',
    label: 'Give the reader a job',
    shortLabel: 'Ask',
    source: 'Lenny archive',
    description: 'Convert ambiguity into a named ask, owner, or next decision.',
    scoringQuestion: 'Does every important reader know what is needed from them?',
    antiPattern: '“Thoughts?” or “Let me know” when a decision or owner is needed.',
  },
  {
    id: 'evidence',
    label: 'Use evidence, not vibes',
    shortLabel: 'Evidence',
    source: 'Lenny archive',
    description: 'Anchor the claim in customer, metric, deadline, dollar, or risk evidence.',
    scoringQuestion: 'Is the claim supported by concrete signal?',
    antiPattern: 'Adjectives standing in for proof: big, important, urgent, strategic.',
  },
  {
    id: 'audience',
    label: 'Write for the room',
    shortLabel: 'Audience',
    source: 'Lenny archive',
    description: 'Shape the artifact around the actual reader, politics, and decision path.',
    scoringQuestion: 'Is this framed for the people who must act on it?',
    antiPattern: 'Writing what the PM wants to say instead of what the room needs to decide.',
  },
  {
    id: 'restraint',
    label: 'Keep trust under pressure',
    shortLabel: 'Restraint',
    source: 'Lenny archive',
    description: 'Avoid blame, panic, filler, and performative certainty when stakes rise.',
    scoringQuestion: 'Does the note increase trust while still being direct?',
    antiPattern: 'Blame, over-apology, weak words, hedging, or drama.',
  },
]

export const PRINCIPLES_BY_ID = DOJO_PRINCIPLES.reduce<Record<PrincipleKey, DojoPrinciple>>((accumulator, principle) => {
  accumulator[principle.id] = principle
  return accumulator
}, {} as Record<PrincipleKey, DojoPrinciple>)

export function getPrinciple(id: PrincipleKey) {
  return PRINCIPLES_BY_ID[id]
}

export function inferPrincipleId(id: string, label: string): PrincipleKey {
  const text = `${id} ${label}`.toLowerCase()

  if (/ask|owner|next|confirm|approval|staffing|decision owner|person/.test(text)) {
    return 'ask'
  }

  if (/tradeoff|risk|cost|impact|delay|kill|out|cut|downside|unknown/.test(text)) {
    return 'tradeoff'
  }

  if (/evidence|dollar|arr|metric|goal|kpi|known|customer|impact|why|rationale|signal|data/.test(text)) {
    return 'evidence'
  }

  if (/audience|room|dissent|ceo|field|customer-safe|forwardable|politic/.test(text)) {
    return 'audience'
  }

  if (/blame|restraint|tone|clean|drama|trust|weak|hedge/.test(text)) {
    return 'restraint'
  }

  if (/decision|rec|recommend|call|principle|assumption|rank/.test(text)) {
    return 'recommendation'
  }

  return 'front-load'
}
