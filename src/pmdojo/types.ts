import type { PrincipleKey } from './principles'

export type Screen =
  | 'landing'
  | 'demo'
  | 'lanes'
  | 'invoke'
  | 'practice'
  | 'round'
  | 'critique'
  | 'outcome'
  | 'progress'
  | 'manual'

export type SkillKey = 'comms' | 'escal' | 'prio' | 'disco' | 'narr'

export type SkillDeltas = Record<SkillKey, number>

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D'

export type ContextConfidence = 'thin' | 'usable' | 'strong'

export type JudgmentCheckpoint = {
  recommendation: string
  nonGoals: string
  evidence: string
  tradeoff: string
  ask: string
  changeMind: string
}

export type OutcomeStatus = 'landed' | 'mixed' | 'missed' | 'not-sent'

export type OutcomeReplay = {
  status: OutcomeStatus
  readerResponse: string
  surprise: string
  lesson: string
  nextMove: string
  score: number
  label: string
  loggedAt: string
}

export type Stats = {
  rounds: number
  streak: number
  xp: number
  rank: string
  dailyDone: number
  radar: [number, number, number, number, number]
  topLane: string
}

export type Lane = {
  id: string
  title: string
  shortTitle: string
  tag: string
  rail: string
  artifact: string
  diff: 'NORMAL' | 'HARD' | 'BOSS'
  reps: number
  hook: string
  focus: SkillKey
  scenarioCount: number
  locked: boolean
  unlock?: string
}

export type RubricCheck = {
  id: string
  label: string
  hit: boolean
  partial?: boolean
  pts: number
  detail: string
  principleId?: PrincipleKey
  principleLabel?: string
  principleSource?: string
}

export type RubricRule = {
  id: string
  label: string
  pts: number
  detail: string
  principleId?: PrincipleKey
  evaluate: (draft: string, lowerDraft: string) => Pick<RubricCheck, 'hit' | 'partial'>
}

export type ScenarioCue = {
  color: 'hot' | 'gold' | 'sky' | 'mint' | 'orchid'
  text: string
}

export type ScenarioAnnotation = {
  title: string
  body: string
  color: 'hot' | 'gold' | 'sky' | 'mint' | 'orchid'
}

export type SeniorDraft = {
  name: string
  role: string
  grade: Grade
  xp: number
  words: number
  body: string
}

export type Scenario = {
  id: string
  laneId: string
  code: string
  title: string
  tag: string
  rail: string
  diff: Lane['diff']
  pressure: string
  quote: string
  quoteAttribution: string
  brief: string
  cues: ScenarioCue[]
  objectiveTitle: string
  objectiveCopy: string
  channelLabel: string
  chips: string[]
  wordLimit: number
  defaultDraft: string
  coachHit: string
  coachMiss: string
  seniorDraft: SeniorDraft
  annotations: ScenarioAnnotation[]
  rubric: RubricRule[]
  skillDeltas: SkillDeltas
  source?: 'lane' | 'practice'
}

export type RunRecord = {
  laneId: string
  scenarioId: string
  draft: string
  checks: RubricCheck[]
  xp: number
  words: number
  timeLeft: number
  submittedAt: string
  skillDeltas: SkillDeltas
  grade: Grade
  evaluator: string
  contextConfidence?: ContextConfidence
  contextScore?: number
  contextNote?: string
  judgmentCheckpoint?: JudgmentCheckpoint
  judgmentScore?: number
  judgmentNote?: string
  outcome?: OutcomeReplay
}

export type LastRun = RunRecord

export type AppState = {
  screen: Screen
  stats: Stats
  lanes: Lane[]
  history: RunRecord[]
  activeLaneId: string | null
  activeScenarioId: string | null
  customScenario: Scenario | null
  lastRun: LastRun | null
}

export type AccentKey = 'gold' | 'amber' | 'mint' | 'orchid'

export type TweakState = {
  accent: AccentKey
  ambientGlow: boolean
}

export type Tokens = {
  sans: string
  mono: string
  bg: string
  bg2: string
  panel: string
  panel2: string
  line: string
  lineStrong: string
  ink: string
  dim: string
  dimmer: string
  hot: string
  gold: string
  mint: string
  sky: string
  orchid: string
}
