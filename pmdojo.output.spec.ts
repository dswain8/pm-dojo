import { expect, test } from '@playwright/test'

import { ALL_SCENARIOS, SCENARIOS_BY_LANE } from './src/pmdojo/content'
import { buildCritiqueOutput, outputContractViolations } from './src/pmdojo/output'
import { createPracticeScenario, type PracticeArtifact } from './src/pmdojo/practice'
import { createRunRecord } from './src/pmdojo/rubric'
import type { JudgmentCheckpoint, RunRecord, Scenario } from './src/pmdojo/types'

const judgment: JudgmentCheckpoint = {
  recommendation: 'pause the launch note until Friday and send the corrected billing explanation first',
  nonGoals: 'send the current launch note or imply the invoice deltas are understood',
  evidence: 'Support found three renewal customers with invoice deltas they cannot explain yet',
  tradeoff: 'we lose one launch week, but avoid a customer note we may need to unwind',
  ask: '@maya approves the customer note by EOD and @devon confirms the impacted list by 3pm',
  changeMind: 'Support and Billing can explain the deltas and confirm the note is accurate',
}

const artifactDrafts: Record<PracticeArtifact, string> = {
  'Slack update': `Pause the launch note until Friday and send the corrected billing explanation first.

Support found three renewal customers with invoice deltas they cannot explain yet.

We lose one launch week, but avoid a customer note we may need to unwind.

@maya approves the note by EOD and @devon confirms the impacted list by 3pm.`,
  'Exec memo': `Bottom line: pause the launch note until Friday and send the corrected billing explanation first.

Support found three renewal customers with invoice deltas they cannot explain yet.

We lose one launch week, but avoid a customer note we may need to unwind.

Decision needed: @maya approves the note by EOD and @devon confirms the impacted list by 3pm.`,
  'PRD section': `Decision
Pause the launch note until Friday and send the corrected billing explanation first.

Rationale
Support found three renewal customers with invoice deltas they cannot explain yet.

Risk accepted
We lose one launch week, but avoid a customer note we may need to unwind.

Open decision
@maya approves the note by EOD and @devon confirms the impacted list by 3pm.`,
  'Customer reply': `Thanks for raising this. We are pausing the launch note until Friday and sending the corrected billing explanation first.

Support found three renewal customers with invoice deltas they cannot explain yet.

We are not going to imply the invoice deltas are understood until Billing confirms the explanation.

I will send the corrected note after @maya approves it by EOD.`,
}

const artifactExpectations: Record<PracticeArtifact, RegExp[]> = {
  'Slack update': [/^Pause the launch note/im, /@maya approves/im],
  'Exec memo': [/^Bottom line:/im, /^Decision needed:/im],
  'PRD section': [/^Decision$/im, /^Rationale$/im, /^Open decision$/im],
  'Customer reply': [/^Thanks for raising this/im, /Do not send/im],
}

function practiceScenario(artifact: PracticeArtifact) {
  return createPracticeScenario({
    artifact,
    audience: artifact === 'Customer reply' ? 'Customer admin and CSM' : 'VP Product, Support lead, Eng owner',
    situation: 'Support found three renewal customers will see invoice deltas they cannot explain before the launch note goes out.',
    draft: artifactDrafts[artifact],
    judgment,
  })
}

function runForScenario(scenario: Scenario, draft = scenario.defaultDraft): RunRecord {
  return createRunRecord(scenario, draft, 420, '2026-05-02T00:00:00.000Z', {
    contextConfidence: scenario.source === 'practice' ? 'strong' : 'usable',
    contextScore: scenario.source === 'practice' ? 100 : 80,
    contextNote: 'Enough context for output QA.',
    judgmentCheckpoint: scenario.source === 'practice' ? judgment : undefined,
    judgmentScore: scenario.source === 'practice' ? 100 : undefined,
    judgmentNote: scenario.source === 'practice' ? 'Checkpoint is explicit.' : undefined,
  })
}

test('practice outputs are artifact-shaped and pass the no-fluff contract', () => {
  const artifacts: PracticeArtifact[] = ['Slack update', 'Exec memo', 'PRD section', 'Customer reply']

  for (const artifact of artifacts) {
    const scenario = practiceScenario(artifact)
    const output = buildCritiqueOutput(scenario, runForScenario(scenario))

    expect(outputContractViolations(output), artifact).toEqual([])
    expect(output.coaching.body, artifact).not.toMatch(/right rep|generic practice|PM Dojo|senior PM|PM archaeology/i)
    expect(output.revisedDraft.body, artifact).not.toMatch(/^(Rec|Recommendation|What happened|Interpretation|Trade-?off|Impact):/im)
    expect(output.revisedDraft.body, artifact).not.toMatch(/^(Cost to name|Do not promise|Revisit if):/im)

    for (const expectation of artifactExpectations[artifact]) {
      expect(output.revisedDraft.body, artifact).toMatch(expectation)
    }
  }
})

test('lane outputs do not leak benchmark memo headings into the suggested rewrite', () => {
  const representativeScenarios = [
    SCENARIOS_BY_LANE['01'][0],
    SCENARIOS_BY_LANE['02'][0],
    SCENARIOS_BY_LANE['03'][0],
    SCENARIOS_BY_LANE['04'][7],
    SCENARIOS_BY_LANE['05'][0],
  ]

  for (const scenario of representativeScenarios) {
    const output = buildCritiqueOutput(scenario, runForScenario(scenario))

    expect(outputContractViolations(output), scenario.id).toEqual([])
    expect(output.revisedDraft.words, scenario.id).toBeGreaterThan(12)
  }
})

test('all authored lane scenarios satisfy the output contract', () => {
  for (const scenario of ALL_SCENARIOS) {
    if (scenario.source !== 'lane') {
      continue
    }

    const output = buildCritiqueOutput(scenario, runForScenario(scenario))

    expect(outputContractViolations(output), scenario.id).toEqual([])
  }
})

test('output contract catches fluff and memo-template revised drafts', () => {
  const scenario = practiceScenario('Slack update')
  const output = buildCritiqueOutput(scenario, runForScenario(scenario))
  const badOutput = {
    ...output,
    coaching: {
      ...output.coaching,
      body: 'This is the right rep because real work beats generic practice.',
    },
    revisedDraft: {
      ...output.revisedDraft,
      body: `Recommendation: send the note.

What happened: support found a problem.

Tradeoff: there is risk.`,
    },
  }

  expect(outputContractViolations(badOutput).length).toBeGreaterThan(0)
})
