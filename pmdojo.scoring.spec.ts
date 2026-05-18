import { expect, test } from '@playwright/test'

import { ALL_SCENARIOS, MY_DRAFT_LANE_ID, SCENARIOS_BY_LANE } from './src/pmdojo/content'
import { getLaneLennySources, getPrincipleLennySources } from './src/pmdojo/lenny'
import { DOJO_PRINCIPLES } from './src/pmdojo/principles'
import { createPracticeScenario } from './src/pmdojo/practice'
import { TARGET_SCENARIOS_PER_LANE } from './src/pmdojo/repository'
import { evaluateDraft } from './src/pmdojo/rubric'

const TRAINING_LANES = ['01', '02', '03', '04', '05']

const laneAntiDrafts: Record<string, string> = {
  '01': 'This is bad and we probably should have handled it earlier. Can someone fix it? Thoughts?',
  '02': 'Everyone disagreed in the meeting. I think we should keep talking and maybe revisit later.',
  '03': 'All of these projects are important. I do not want to cut anything yet, so let us keep the list open.',
  '04': 'Quick update: things slipped. We are looking into it and I will share more when I know more.',
  '05': 'This seems promising. Users will probably like it, and we should build the MVP before deciding.',
}

const keywordSoup =
  'rec decision tradeoff risk customer ARR $240k Friday @maya approve evidence test kill scope owner confirm metric'

test('scenario repository has enough authored reps per lane', () => {
  for (const laneId of TRAINING_LANES) {
    expect(SCENARIOS_BY_LANE[laneId], `lane ${laneId}`).toHaveLength(TARGET_SCENARIOS_PER_LANE)
  }
})

test('authored drafts score as usable PM artifacts', () => {
  for (const scenario of ALL_SCENARIOS) {
    if (scenario.laneId === MY_DRAFT_LANE_ID) {
      continue
    }

    expect(evaluateDraft(scenario, scenario.defaultDraft).xp, `${scenario.id} default draft`).toBeGreaterThanOrEqual(50)
    expect(evaluateDraft(scenario, scenario.seniorDraft.body).xp, `${scenario.id} senior draft`).toBeGreaterThanOrEqual(70)
  }
})

test('generated scenario rubrics include scenario-specific checks', () => {
  for (const scenario of ALL_SCENARIOS) {
    if (scenario.source !== 'lane') {
      continue
    }

    expect(scenario.rubric.some((rule) => rule.id === 'scenario-signal'), `${scenario.id} scenario signal`).toBe(true)
    expect(scenario.rubric.some((rule) => rule.id === 'actual-moment'), `${scenario.id} actual moment`).toBe(true)
  }
})

test('visible source lineage is Lenny-derived', () => {
  for (const principle of DOJO_PRINCIPLES) {
    expect(principle.source).toBe('Lenny archive')
    expect(getPrincipleLennySources(principle.id).length, principle.id).toBeGreaterThanOrEqual(2)
  }

  for (const laneId of TRAINING_LANES) {
    expect(getLaneLennySources(laneId).length, laneId).toBeGreaterThanOrEqual(2)
  }
})

test('anti-pattern drafts and keyword soup do not pass', () => {
  for (const scenario of ALL_SCENARIOS) {
    if (scenario.laneId === MY_DRAFT_LANE_ID) {
      continue
    }

    expect(evaluateDraft(scenario, laneAntiDrafts[scenario.laneId]).xp, `${scenario.id} weak draft`).toBeLessThanOrEqual(35)
    expect(evaluateDraft(scenario, keywordSoup).xp, `${scenario.id} keyword soup`).toBeLessThanOrEqual(35)
  }
})

test('polished but wrong-context drafts are capped', () => {
  const scenario = SCENARIOS_BY_LANE['01'][0]
  const wrongContextDraft = `Rec: approve the pricing calculator launch by Friday and tell Sales they can quote it.

Evidence: the CRM workflow is ready, the admin demo landed well, and the new discount floor should improve conversion.

Tradeoff: we take some enablement risk, but the revenue upside is worth the push.

Need @maya to approve the field note by EOD.`

  expect(evaluateDraft(scenario, wrongContextDraft).xp).toBeLessThanOrEqual(52)
})

test('practice scoring rewards carrying the explicit PM call through', () => {
  const scenario = createPracticeScenario({
    artifact: 'Slack update',
    audience: 'VP Product, support lead, eng owner',
    situation: 'Support found three renewal customers will see invoice deltas they cannot explain before the launch note goes out.',
    judgment: {
      recommendation: 'Pause the launch note until Friday and send the corrected billing explanation first.',
      nonGoals: 'Do not send the current launch note or imply the invoice deltas are understood yet.',
      evidence: 'Support cannot explain the invoice delta, and three renewal customers are affected.',
      tradeoff: 'We lose one launch week, but avoid a customer note we may need to unwind.',
      ask: '@maya approves the customer note by EOD; @devon confirms the impacted list by 3pm.',
      changeMind: 'If Support can explain the deltas and Billing confirms the note is accurate, ship the launch note.',
    },
    draft: '',
  })
  const carriedDraft = `Rec: pause the launch note until Friday and send the corrected billing explanation first.

Evidence: Support cannot explain the invoice delta, and three renewal customers are affected.

Tradeoff: we lose one launch week, but avoid a customer note we may need to unwind.

Not doing: we should not send the current launch note or imply the deltas are understood yet.

Need @maya to approve the customer note by EOD and @devon to confirm the impacted list by 3pm.`
  const genericDraft = `Rec: send an update today and keep everyone aligned.

Evidence: this is important for customers and the team.

Tradeoff: there is some risk, but moving fast is better.

Need someone to approve the message soon.`

  const carried = evaluateDraft(scenario, carriedDraft)
  const generic = evaluateDraft(scenario, genericDraft)

  expect(carried.xp).toBeGreaterThan(generic.xp + 25)
  expect(carried.checks.find((check) => check.id === 'judgment-call')?.hit).toBe(true)
  expect(carried.checks.find((check) => check.id === 'judgment-evidence')?.hit).toBe(true)
  expect(carried.checks.find((check) => check.id === 'judgment-tradeoff')?.hit).toBe(true)
  expect(carried.checks.find((check) => check.id === 'judgment-ask')?.hit).toBe(true)
})
