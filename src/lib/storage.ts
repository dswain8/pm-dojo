export interface SessionScore {
  mode: 'quick-draw' | 'rewrite' | 'concept-clinic' | 'scenario' | 'inbox-fire' | 'the-room' | 'red-pen' | 'first-principles'
  scenarioId: string
  scenarioTitle: string
  difficulty: string
  scores: Record<string, number>
  timestamp: number
}

const STORAGE_KEY = 'pm-dojo-sessions'

export function getSessions(): SessionScore[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveSession(session: SessionScore) {
  const sessions = getSessions()
  sessions.push(session)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
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
