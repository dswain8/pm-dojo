import { buildLanes, buildStats, syncStateFromHistory } from './game'
import type { AppState, RunRecord } from './types'

export const SEEDED_HISTORY: RunRecord[] = []

export const INITIAL_STATE: AppState = syncStateFromHistory({
  screen: 'landing',
  history: SEEDED_HISTORY,
  activeLaneId: null,
  activeScenarioId: null,
  customScenario: null,
  lastRun: null,
})

export function createInitialState() {
  return {
    ...INITIAL_STATE,
    lanes: buildLanes(SEEDED_HISTORY),
    stats: buildStats(SEEDED_HISTORY),
  }
}
