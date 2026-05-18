import { SKILL_META, type SkillKey } from '../data/game'

export type SessionMode =
  | 'quick-draw'
  | 'rewrite'
  | 'concept-clinic'
  | 'scenario'
  | 'inbox-fire'
  | 'the-room'
  | 'red-pen'
  | 'first-principles'

export interface SessionScore {
  mode: SessionMode
  scenarioId: string
  scenarioTitle: string
  difficulty: string
  scores: Record<string, number>
  scoreMax?: Record<string, number>
  skills?: SkillKey[]
  timestamp: number
}

const STORAGE_KEY = 'pm-dojo-sessions'

const MODE_SKILLS: Record<SessionMode, SkillKey[]> = {
  'quick-draw': ['communication', 'escalation'],
  rewrite: ['communication'],
  'concept-clinic': ['leadership', 'prioritization'],
  scenario: ['leadership', 'communication'],
  'inbox-fire': ['communication', 'escalation'],
  'the-room': ['leadership', 'communication'],
  'red-pen': ['communication', 'leadership'],
  'first-principles': ['prioritization', 'discovery', 'leadership'],
}

const MODE_SCORE_MAX_TOTAL: Partial<Record<SessionMode, number>> = {
  'quick-draw': 30,
  'concept-clinic': 10,
  scenario: 200,
  'inbox-fire': 30,
  'the-room': 200,
  'first-principles': 25,
}

export function getSessions(): SessionScore[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveSession(session: SessionScore) {
  const sessions = getSessions()
  sessions.push(session)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function getSessionTotal(session: SessionScore): number {
  return Object.values(session.scores).reduce((sum, value) => sum + value, 0)
}

export function getSessionMaxTotal(session: SessionScore): number | null {
  if (session.scoreMax) {
    return Object.values(session.scoreMax).reduce((sum, value) => sum + value, 0)
  }

  return MODE_SCORE_MAX_TOTAL[session.mode] ?? null
}

export function getSessionSkills(session: SessionScore): SkillKey[] {
  return session.skills && session.skills.length > 0
    ? session.skills
    : MODE_SKILLS[session.mode] ?? []
}

export interface SkillSummary {
  key: SkillKey
  label: string
  description: string
  rounds: number
  recentRounds: number
  averagePct: number | null
}

export function getSkillSummary(): SkillSummary[] {
  const sessions = getSessions()
  const recentSessions = sessions.slice(-10)

  return (Object.keys(SKILL_META) as SkillKey[]).map((key) => {
    const matching = sessions.filter((session) => getSessionSkills(session).includes(key))
    const recent = recentSessions.filter((session) => getSessionSkills(session).includes(key))
    const normalized = matching
      .map((session) => {
        const maxTotal = getSessionMaxTotal(session)
        if (!maxTotal || maxTotal <= 0) return null
        return getSessionTotal(session) / maxTotal
      })
      .filter((value): value is number => value !== null)

    const averagePct =
      normalized.length > 0
        ? normalized.reduce((sum, value) => sum + value, 0) / normalized.length
        : null

    return {
      key,
      label: SKILL_META[key].label,
      description: SKILL_META[key].description,
      rounds: matching.length,
      recentRounds: recent.length,
      averagePct,
    }
  })
}

export function getStreak(): number {
  const sessions = getSessions()
  if (sessions.length === 0) return 0

  const days = new Set(
    sessions.map((s) => new Date(s.timestamp).toDateString())
  )
  const today = new Date()
  let streak = 0

  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (days.has(d.toDateString())) {
      streak++
    } else if (i > 0) {
      break
    }
  }

  return streak
}

export function getTotalRounds(): number {
  return getSessions().length
}
