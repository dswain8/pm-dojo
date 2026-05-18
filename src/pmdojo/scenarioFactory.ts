import type { PrincipleKey } from './principles'
import { countImportantTermHits, extractImportantTerms, hasConcreteEvidenceSignal } from './signals'
import type { Lane, RubricRule, Scenario, ScenarioAnnotation, ScenarioCue, SkillDeltas } from './types'

type LaneMeta = Pick<Scenario, 'laneId' | 'code' | 'title' | 'tag' | 'rail' | 'diff' | 'pressure'> & {
  objectiveTitle: string
  objectiveCopy: string
  wordLimit: number
  skillDeltas: SkillDeltas
  coachHit: string
  coachMiss: string
  seniorName: string
  seniorRole: string
  focusPrinciple: PrincipleKey
  emphasis: 'escalation' | 'room' | 'cutline' | 'exec' | 'discovery'
}

type ScenarioSeed = {
  id: string
  brief: string
  quote: string
  quoteAttribution: string
  channelLabel: string
  chips: string[]
  defaultDraft: string
  seniorDraft: string
  annotations: ScenarioAnnotation[]
  cues?: ScenarioCue[]
  scenarioTerms?: string[]
}

const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

const hasMention = /@\w+/
const hasDeadline = /\b(eod|today|tomorrow|friday|monday|tuesday|wednesday|thursday|next week|by \d|by [a-z]+|am|pm)\b/i
const weakLanguage = /\b(maybe|just|kind of|sort of|probably|wanted to|quick question|thoughts\?|not sure)\b/i
const blameLanguage = /\b(should have|their fault|we failed|obviously|clearly|just fix it|dropped the ball)\b/i

function startsWithDecision(draft: string) {
  return /^(rec|recommendation|decision|ask|cutline|assumption|proposal|summary|update)[:\s-]/i.test(draft.trim())
}

function hasActionVerb(lowerDraft: string) {
  return /recommend|decision|ship|hold|pause|cut|fund|approve|escalate|test|validate|scope|move|prioritize|defer|do not|don't/.test(
    lowerDraft,
  )
}

function hasEvidence(lowerDraft: string) {
  return hasConcreteEvidenceSignal(lowerDraft)
}

function hasTradeoff(lowerDraft: string) {
  return /tradeoff|risk|cost|delay|slip|pause|cut|not doing|out:|out this|defer|unknown|if .* then|kill|scope|capacity/.test(
    lowerDraft,
  )
}

function hasAsk(draft: string, lowerDraft: string) {
  return (
    (hasMention.test(draft) || /owner|need|ask|approve|confirm|input|decision/.test(lowerDraft)) &&
    (hasDeadline.test(draft) || /next step|by |today|tomorrow|friday|eod/.test(lowerDraft))
  )
}

function hasRestraint(draft: string) {
  return !weakLanguage.test(draft) && !blameLanguage.test(draft)
}

function buildScenarioTerms(meta: LaneMeta, seed: ScenarioSeed) {
  return seed.scenarioTerms ?? extractImportantTerms(
    [
      seed.brief,
      seed.quote,
      seed.quoteAttribution,
      seed.channelLabel,
      seed.chips,
      seed.cues?.map((cue) => cue.text),
      seed.defaultDraft,
      seed.seniorDraft,
      meta.title,
      meta.tag,
    ],
    18,
  )
}

function buildRubric(meta: LaneMeta, seed: ScenarioSeed): RubricRule[] {
  const scenarioTerms = buildScenarioTerms(meta, seed)
  const shared: RubricRule[] = [
    {
      id: 'front-load',
      label: 'Point first',
      pts: 12,
      detail: 'Open with the call, ask, or risk before context.',
      principleId: 'front-load',
      evaluate: (draft) => ({ hit: startsWithDecision(draft), partial: draft.trim().length > 0 && words(draft) < 35 }),
    },
    {
      id: 'recommendation',
      label: 'Clear PM call',
      pts: 14,
      detail: 'Make a recommendation or decision, not just a description.',
      principleId: 'recommendation',
      evaluate: (_, lowerDraft) => ({ hit: hasActionVerb(lowerDraft) }),
    },
    {
      id: 'evidence',
      label: 'Concrete evidence',
      pts: 12,
      detail: 'Use customer, metric, dollar, deadline, or risk evidence.',
      principleId: 'evidence',
      evaluate: (_, lowerDraft) => ({ hit: hasEvidence(lowerDraft) }),
    },
    {
      id: 'tradeoff',
      label: 'Tradeoff named',
      pts: 14,
      detail: 'Name the cost, downside, no-list, or risk of the call.',
      principleId: 'tradeoff',
      evaluate: (_, lowerDraft) => ({ hit: hasTradeoff(lowerDraft) }),
    },
    {
      id: 'ask',
      label: 'Named ask or owner',
      pts: 12,
      detail: 'Give a person or reader a concrete job with timing.',
      principleId: 'ask',
      evaluate: (draft, lowerDraft) => ({ hit: hasAsk(draft, lowerDraft), partial: hasMention.test(draft) || /need|ask|approve|confirm/.test(lowerDraft) }),
    },
    {
      id: 'restraint',
      label: 'No panic or blame',
      pts: 8,
      detail: 'Keep trust high by avoiding blame, filler, and hedging.',
      principleId: 'restraint',
      evaluate: (draft) => ({ hit: hasRestraint(draft) }),
    },
  ]

  const laneSpecific: Record<LaneMeta['emphasis'], RubricRule> = {
    escalation: {
      id: 'customer-safe',
      label: 'Customer-safe path',
      pts: 10,
      detail: 'Separate what is confirmed from what should be said externally.',
      principleId: 'audience',
      evaluate: (_, lowerDraft) => ({ hit: /customer|external|safe line|field|am|holding line|confirm/.test(lowerDraft) }),
    },
    room: {
      id: 'room-alignment',
      label: 'Room is aligned',
      pts: 10,
      detail: 'Preserve dissent while making the decision path clear.',
      principleId: 'audience',
      evaluate: (_, lowerDraft) => ({ hit: /dissent|align|room|decision path|disagree|input|follow-up/.test(lowerDraft) }),
    },
    cutline: {
      id: 'explicit-no',
      label: 'No-list is explicit',
      pts: 10,
      detail: 'Say what is out, deferred, or unfunded.',
      principleId: 'tradeoff',
      evaluate: (_, lowerDraft) => ({ hit: /out:|cut|defer|not funding|not doing|saying no|hold/.test(lowerDraft) }),
    },
    exec: {
      id: 'exec-forwardable',
      label: 'Forwardable exec line',
      pts: 10,
      detail: 'Give an exec-safe line that can be forwarded without translation.',
      principleId: 'audience',
      evaluate: (_, lowerDraft) => ({ hit: /forward|exec|ceo|board|leadership|decision:|recommendation:/.test(lowerDraft) }),
    },
    discovery: {
      id: 'test-plan',
      label: 'Test before building',
      pts: 10,
      detail: 'Name a validation step, kill condition, or scope-changing test.',
      principleId: 'evidence',
      evaluate: (_, lowerDraft) => ({ hit: /test|validate|interview|prototype|experiment|kill|scope|evidence/.test(lowerDraft) }),
    },
  }

  const scenarioSpecific: RubricRule[] = [
    {
      id: 'scenario-signal',
      label: 'Uses scenario details',
      pts: 10,
      detail: 'Pull in names, numbers, constraints, or artifacts from this exact situation.',
      principleId: 'evidence',
      evaluate: (draft) => {
        const hits = countImportantTermHits(draft, scenarioTerms)
        return { hit: hits >= 2, partial: hits === 1 }
      },
    },
    {
      id: 'actual-moment',
      label: 'Addresses the actual moment',
      pts: 8,
      detail: 'Tie the action to this scenario instead of giving generic PM advice.',
      principleId: 'recommendation',
      evaluate: (draft, lowerDraft) => {
        const hasScenarioSignal = countImportantTermHits(draft, scenarioTerms) > 0
        const hasReason = /because|why|so that|therefore|impact|evidence|risk|tradeoff|unless/.test(lowerDraft)
        return {
          hit: hasActionVerb(lowerDraft) && hasScenarioSignal && hasReason,
          partial: hasActionVerb(lowerDraft) && hasScenarioSignal,
        }
      },
    },
  ]

  return [...shared, laneSpecific[meta.emphasis], ...scenarioSpecific]
}

export function emptySkillDeltas(): SkillDeltas {
  return {
    comms: 0,
    escal: 0,
    prio: 0,
    disco: 0,
    narr: 0,
  }
}

export function createLaneScenarios(meta: LaneMeta, seeds: ScenarioSeed[]): Scenario[] {
  return seeds.map((seed) => ({
    id: seed.id,
    laneId: meta.laneId,
    code: meta.code,
    title: meta.title,
    tag: meta.tag,
    rail: meta.rail,
    diff: meta.diff,
    pressure: meta.pressure,
    brief: seed.brief,
    quote: seed.quote,
    quoteAttribution: seed.quoteAttribution,
    cues: seed.cues ?? [
      { color: 'hot', text: 'decision pressure is live' },
      { color: 'gold', text: 'reader needs the call first' },
      { color: 'sky', text: 'evidence beats adjectives' },
      { color: 'mint', text: 'named owner or test required' },
    ],
    objectiveTitle: meta.objectiveTitle,
    objectiveCopy: meta.objectiveCopy,
    channelLabel: seed.channelLabel,
    chips: seed.chips,
    wordLimit: meta.wordLimit,
    defaultDraft: seed.defaultDraft,
    coachHit: meta.coachHit,
    coachMiss: meta.coachMiss,
    seniorDraft: {
      name: meta.seniorName,
      role: meta.seniorRole,
      grade: 'S',
      xp: 90,
      words: words(seed.seniorDraft),
      body: seed.seniorDraft,
    },
    annotations: seed.annotations,
    skillDeltas: meta.skillDeltas,
    rubric: buildRubric(meta, seed),
    source: 'lane',
  }))
}

export function laneDiffColor(diff: Lane['diff']) {
  return diff === 'BOSS' ? 'hot' : diff === 'HARD' ? 'gold' : 'sky'
}
