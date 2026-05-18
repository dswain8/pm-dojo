import { ALL_SCENARIOS, LANE_BLUEPRINTS, MY_DRAFT_LANE_ID, SCENARIOS_BY_LANE } from './content'
import { DOJO_PRINCIPLES, inferPrincipleId } from './principles'

export const REPOSITORY_VERSION = 'dojo-repository-v1'
export const TARGET_SCENARIOS_PER_LANE = 20

export function getScenarioInventory() {
  return LANE_BLUEPRINTS.map((lane) => {
    const scenarios = SCENARIOS_BY_LANE[lane.id] ?? []

    return {
      laneId: lane.id,
      title: lane.title,
      tag: lane.tag,
      artifact: lane.artifact,
      diff: lane.diff,
      rail: lane.rail,
      isPracticeLane: lane.id === MY_DRAFT_LANE_ID,
      scenarios: scenarios.map((scenario) => ({
        id: scenario.id,
        title: scenario.title,
        channelLabel: scenario.channelLabel,
        wordLimit: scenario.wordLimit,
        rubricChecks: scenario.rubric.length,
        seniorDraftWords: scenario.seniorDraft.words,
        principles: Array.from(new Set(scenario.rubric.map((rule) => rule.principleId ?? inferPrincipleId(rule.id, rule.label)))),
      })),
    }
  })
}

export function getRepositoryStats() {
  const trainingLanes = LANE_BLUEPRINTS.filter((lane) => lane.id !== MY_DRAFT_LANE_ID)
  const authoredScenarios = ALL_SCENARIOS.length
  const authoredSeniorDrafts = ALL_SCENARIOS.filter((scenario) => scenario.seniorDraft.body.trim().length > 0).length
  const authoredRubricChecks = ALL_SCENARIOS.reduce((total, scenario) => total + scenario.rubric.length, 0)

  return {
    version: REPOSITORY_VERSION,
    laneCount: LANE_BLUEPRINTS.length,
    trainingLaneCount: trainingLanes.length,
    authoredScenarios,
    targetScenarios: trainingLanes.length * TARGET_SCENARIOS_PER_LANE,
    authoredSeniorDrafts,
    authoredRubricChecks,
    principleCount: DOJO_PRINCIPLES.length,
    averageScenariosPerTrainingLane: Number((authoredScenarios / trainingLanes.length).toFixed(1)),
  }
}
