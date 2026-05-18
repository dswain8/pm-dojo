import { ALL_SCENARIOS, DAILY_LANE_ID, LANE_BLUEPRINTS, MY_DRAFT_LANE_ID, SCENARIOS_BY_LANE, SKILL_META } from './content'
import { rankForXp } from './progression'
import { gradeForXp } from './rubric'
import type { AppState, Lane, RunRecord, Scenario, Screen, SkillKey, Stats } from './types'

const LANE_UNLOCK_AT: Record<string, number> = {
  [MY_DRAFT_LANE_ID]: 0,
  '01': 0,
  '02': 0,
  '03': 0,
  '04': 0,
  '05': 0,
}

const SKILL_ORDER: SkillKey[] = ['comms', 'escal', 'prio', 'disco', 'narr']

function dayKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function laneCounts(history: RunRecord[]) {
  return history.reduce<Record<string, number>>((accumulator, run) => {
    accumulator[run.laneId] = (accumulator[run.laneId] || 0) + 1
    return accumulator
  }, {})
}

export function getScenarioById(id: string | null | undefined) {
  return ALL_SCENARIOS.find((scenario) => scenario.id === id) ?? null
}

export function getLaneById(id: string | null | undefined) {
  return LANE_BLUEPRINTS.find((lane) => lane.id === id) ?? null
}

export function buildLanes(history: RunRecord[]): Lane[] {
  const counts = laneCounts(history)
  const totalRounds = history.length

  return LANE_BLUEPRINTS.map((lane) => {
    const unlockAt = LANE_UNLOCK_AT[lane.id] ?? 0
    const locked = totalRounds < unlockAt
    const remaining = Math.max(0, unlockAt - totalRounds)

    return {
      ...lane,
      reps: counts[lane.id] || 0,
      scenarioCount: SCENARIOS_BY_LANE[lane.id]?.length || 0,
      locked,
      unlock: locked ? `${remaining} more reps` : undefined,
    }
  })
}

export function buildStats(history: RunRecord[]): Stats {
  const xp = history.reduce((total, run) => total + run.xp, 0)
  const radarTotals = history.reduce(
    (accumulator, run) => {
      for (const key of SKILL_ORDER) {
        accumulator[key] += run.skillDeltas[key]
      }
      return accumulator
    },
    { comms: 0, escal: 0, prio: 0, disco: 0, narr: 0 },
  )
  const radar = SKILL_ORDER.map((key) => Math.min(1, Number(radarTotals[key].toFixed(2)))) as Stats['radar']
  const counts = laneCounts(history)
  const topLaneId =
    Object.entries(counts)
      .sort((left, right) => right[1] - left[1])[0]?.[0] ?? DAILY_LANE_ID
  const topLane = getLaneById(topLaneId)?.shortTitle ?? 'Bad-News'
  const streak = calculateCurrentStreak(history)
  const today = dayKey(new Date())
  const dailyDone = history.filter((run) => dayKey(new Date(run.submittedAt)) === today).length

  return {
    rounds: history.length,
    streak,
    xp,
    rank: rankForXp(xp),
    dailyDone,
    radar,
    topLane,
  }
}

export function syncStateFromHistory(
  current: Pick<AppState, 'screen' | 'history' | 'activeLaneId' | 'activeScenarioId' | 'customScenario' | 'lastRun'>,
  screen = current.screen,
): AppState {
  return {
    screen,
    history: current.history,
    activeLaneId: current.activeLaneId,
    activeScenarioId: current.activeScenarioId,
    customScenario: current.customScenario,
    lastRun: current.lastRun,
    lanes: buildLanes(current.history),
    stats: buildStats(current.history),
  }
}

export function pickScenarioForLane(laneId: string, history: RunRecord[]) {
  const scenarios = SCENARIOS_BY_LANE[laneId] ?? []
  if (scenarios.length === 0) {
    return null
  }

  const reps = history.filter((run) => run.laneId === laneId).length
  return scenarios[reps % scenarios.length]
}

export function getQuickStartLaneId() {
  return DAILY_LANE_ID
}

export function getSuggestedLaneId(history: RunRecord[]) {
  if (history.length === 0) {
    return getQuickStartLaneId()
  }

  const radar = buildStats(history).radar
  const weakestIndex = radar.reduce((bestIndex, value, index, values) => (value < values[bestIndex] ? index : bestIndex), 0)
  const weakestSkill = SKILL_ORDER[weakestIndex]
  const unlockedLanes = buildLanes(history).filter((lane) => !lane.locked && lane.id !== MY_DRAFT_LANE_ID)
  return unlockedLanes.find((lane) => lane.focus === weakestSkill)?.id ?? getQuickStartLaneId()
}

export function calculateCurrentStreak(history: RunRecord[]) {
  if (history.length === 0) {
    return 0
  }

  const uniqueDays = new Set(history.map((run) => dayKey(new Date(run.submittedAt))))
  const cursor = new Date()
  let streak = 0

  while (uniqueDays.has(dayKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export function calculateLongestStreak(history: RunRecord[]) {
  if (history.length === 0) {
    return 0
  }

  const uniqueDays = Array.from(new Set(history.map((run) => dayKey(new Date(run.submittedAt))))).sort()
  let longest = 1
  let current = 1

  for (let index = 1; index < uniqueDays.length; index += 1) {
    const currentDay = new Date(`${uniqueDays[index]}T00:00:00`)
    const previousDay = new Date(`${uniqueDays[index - 1]}T00:00:00`)
    const diff = (currentDay.getTime() - previousDay.getTime()) / (1000 * 60 * 60 * 24)

    if (diff === 1) {
      current += 1
      longest = Math.max(longest, current)
    } else {
      current = 1
    }
  }

  return longest
}

export function buildHeatmap(history: RunRecord[], days = 14) {
  const counts = history.reduce<Record<string, number>>((accumulator, run) => {
    const key = dayKey(new Date(run.submittedAt))
    accumulator[key] = (accumulator[key] || 0) + 1
    return accumulator
  }, {})
  const today = new Date()

  return Array.from({ length: days }, (_, index) => {
    const cellDate = new Date(today)
    cellDate.setDate(today.getDate() - (days - 1 - index))
    const key = dayKey(cellDate)
    return {
      key,
      count: counts[key] || 0,
      isToday: key === dayKey(today),
    }
  })
}

export function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) {
    return 'just now'
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`
  }

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) {
    return 'yesterday'
  }

  return `${diffDays}d ago`
}

export function getSkillValues(history: RunRecord[]) {
  const radar = buildStats(history).radar
  return SKILL_ORDER.map((key, index) => ({
    key,
    value: radar[index],
    ...SKILL_META[key],
    reps: history.filter((run) => run.skillDeltas[key] > 0).length,
    delta: `+${Math.round(history.reduce((total, run) => total + run.skillDeltas[key] * 100, 0))}`,
  }))
}

export function getRecentRuns(history: RunRecord[], limit = 5) {
  return [...history]
    .sort((left, right) => new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime())
    .slice(0, limit)
    .map((run, index) => ({
      round: String(history.length - index).padStart(3, '0'),
      lane: getLaneById(run.laneId)?.title ?? run.laneId,
      grade: run.grade,
      xp: run.xp,
      tag: getLaneById(run.laneId)?.tag ?? 'ROUND',
      color: getLaneById(run.laneId)?.rail ?? '#ffc53a',
      time: formatRelativeTime(run.submittedAt),
    }))
}

export function getMissPatterns(history: RunRecord[], limit = 3) {
  const misses = history.reduce<Record<string, { label: string; detail: string; count: number }>>((accumulator, run) => {
    for (const check of run.checks) {
      if (check.hit) {
        continue
      }

      const current = accumulator[check.id] ?? { label: check.label, detail: check.detail, count: 0 }
      current.count += 1
      accumulator[check.id] = current
    }

    return accumulator
  }, {})

  return Object.values(misses)
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label))
    .slice(0, limit)
}

export function buildSenseiSuggestion(history: RunRecord[]) {
  const suggestedLaneId = getSuggestedLaneId(history)
  const lane = getLaneById(suggestedLaneId)
  const focus = lane ? SKILL_META[lane.focus] : SKILL_META.disco
  const misses = getMissPatterns(history, 1)

  if (history.length === 0) {
    return {
      laneId: suggestedLaneId,
      title: lane?.title ?? 'Bad-News Update',
      focusLabel: focus.label,
      body: `No fake baseline here. Start with ${lane?.title ?? 'Bad-News Update'} to establish your first real practice mark.`,
    }
  }

  return {
    laneId: suggestedLaneId,
    title: lane?.title ?? 'Pressure-Test',
    focusLabel: focus.label,
    body:
      misses.length > 0
        ? `Most common miss: ${misses[0].label.toLowerCase()}. Run ${lane?.title ?? 'Pressure-Test'} next to train that under pressure.`
        : `Your shortest axis is ${focus.label.toLowerCase()}. Run ${lane?.title ?? 'Pressure-Test'} next to balance the shape.`,
  }
}

export function migrateScreen(screen: unknown): Screen {
  if (
    screen === 'landing' ||
    screen === 'demo' ||
    screen === 'lanes' ||
    screen === 'invoke' ||
    screen === 'practice' ||
    screen === 'round' ||
    screen === 'critique' ||
    screen === 'outcome' ||
    screen === 'progress' ||
    screen === 'manual'
  ) {
    return screen
  }

  return 'landing'
}

export function normalizeSavedState(saved: unknown, fallback: AppState) {
  if (!saved || typeof saved !== 'object') {
    return fallback
  }

  const candidate = saved as Partial<AppState>
  if (!Array.isArray(candidate.history)) {
    return fallback
  }

  const history = candidate.history
    .filter((run): run is RunRecord => Boolean(run && run.laneId && run.scenarioId && run.submittedAt))
    .map((run) => ({
      ...run,
      grade: run.grade || gradeForXp(run.xp),
      evaluator: run.evaluator || 'legacy-local',
    }))

  return syncStateFromHistory(
    {
      screen: migrateScreen(candidate.screen),
      history,
      activeLaneId: candidate.activeLaneId ?? null,
      activeScenarioId: candidate.activeScenarioId ?? null,
      customScenario: candidate.customScenario ?? null,
      lastRun: candidate.lastRun ?? null,
    },
    migrateScreen(candidate.screen),
  )
}

export function getActiveScenario(
  state: Pick<AppState, 'activeScenarioId' | 'activeLaneId' | 'customScenario' | 'history'>,
): Scenario | null {
  if (state.customScenario && state.customScenario.id === state.activeScenarioId) {
    return state.customScenario
  }

  return getScenarioById(state.activeScenarioId) ?? (state.activeLaneId ? pickScenarioForLane(state.activeLaneId, state.history) : null)
}
