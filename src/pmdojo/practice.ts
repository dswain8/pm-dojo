import { MY_DRAFT_LANE_ID } from './content'
import { carriesJudgmentField, hasAnyJudgment, judgmentParts, normalizeJudgmentCheckpoint } from './judgment'
import { countImportantTermHits, extractImportantTerms, hasConcreteEvidenceSignal } from './signals'
import type { JudgmentCheckpoint, Scenario } from './types'

export type PracticeArtifact = 'Slack update' | 'Exec memo' | 'PRD section' | 'Customer reply'

export type PracticeInput = {
  artifact: PracticeArtifact
  audience: string
  situation: string
  draft: string
  judgment: JudgmentCheckpoint
}

const wordLimitByArtifact: Record<PracticeArtifact, number> = {
  'Slack update': 140,
  'Exec memo': 260,
  'PRD section': 320,
  'Customer reply': 180,
}

function inferChips(input: PracticeInput) {
  return [input.artifact, `<=${wordLimitByArtifact[input.artifact]}w`, input.audience || 'audience']
}

function makeSeniorDraft(input: PracticeInput) {
  const audience = input.audience.trim() || 'the reader'
  const situation = input.situation.trim() || 'the situation'
  const judgment = normalizeJudgmentCheckpoint(input.judgment)
  const recommendation = judgment.recommendation || 'take the smallest safe path that resolves the issue'
  const evidence = judgment.evidence || situation
  const tradeoff = judgment.tradeoff || 'we should move quickly without overcommitting or hiding the risk'
  const ask = judgment.ask || `confirm the owner, timing, and any escalation context before this goes to ${audience}`
  const nonGoals = judgment.nonGoals ? `\n\nNot doing: ${judgment.nonGoals}` : ''
  const changeMind = judgment.changeMind ? `\n\nRevisit if: ${judgment.changeMind}` : ''

  if (input.artifact === 'Customer reply') {
    return `Thanks for the context. Here's the direct answer:

Recommendation: ${recommendation}.

What changed: ${evidence}

Impact: ${tradeoff}.

Next step: ${ask}.${nonGoals}${changeMind}`
  }

  if (input.artifact === 'PRD section') {
    return `Decision: ${recommendation}.

Context: ${situation}

Evidence: ${evidence}

Tradeoff: ${tradeoff}.

Open questions:
1. What evidence would make us stop or change course?
2. What metric proves this worked?
3. Who needs to make the call before build starts?

Ask: ${ask}.${nonGoals}${changeMind}`
  }

  if (input.artifact === 'Exec memo') {
    return `Decision: ${recommendation}.

What changed: ${situation}

Evidence: ${evidence}

Tradeoff: ${tradeoff}.

Ask for ${audience}: ${ask}.${nonGoals}${changeMind}`
  }

  return `Rec: ${recommendation}.

Context: ${situation}

Why: ${evidence}

Tradeoff: ${tradeoff}.

Need: ${ask}.${nonGoals}${changeMind}`
}

export function createPracticeScenario(input: PracticeInput): Scenario {
  const wordLimit = wordLimitByArtifact[input.artifact]
  const situation = input.situation.trim() || 'Paste the context you are responding to.'
  const audience = input.audience.trim() || 'the decision maker'
  const judgment = normalizeJudgmentCheckpoint(input.judgment)
  const hasCheckpoint = hasAnyJudgment(judgment)
  const contextTerms = extractImportantTerms([audience, situation, judgmentParts(judgment)], 18)
  const seniorBody = makeSeniorDraft(input)

  return {
    id: `practice-${Date.now()}`,
    laneId: MY_DRAFT_LANE_ID,
    code: 'LIVE DRAFT',
    title: 'Practice My Draft',
    tag: 'LIVE WORK',
    rail: '#5ef2b0',
    diff: 'NORMAL',
    pressure: 'REAL WORK · REVIEW',
    brief: situation,
    quote: `"Make the draft easier to decide from."`,
    quoteAttribution: audience,
    cues: [
      { color: 'gold', text: `audience: ${audience}` },
      { color: 'mint', text: `artifact: ${input.artifact}` },
      { color: 'sky', text: 'look for the decision or ask' },
      { color: 'hot', text: 'name the tradeoff before the reader does' },
    ],
    objectiveTitle: input.artifact,
    objectiveCopy: `Keep it under ${wordLimit} words. Front-load the point, make the ask, and make the tradeoff legible.`,
    channelLabel: `${input.artifact.toLowerCase()} · live draft`,
    chips: inferChips(input),
    wordLimit,
    defaultDraft: input.draft,
    coachHit: 'The draft is tied to the live artifact.',
    coachMiss: 'The draft needs a sharper point, clearer ask, or explicit tradeoff.',
    seniorDraft: {
      name: 'PM Dojo',
      role: 'Suggested rewrite',
      grade: 'A',
      xp: 86,
      words: seniorBody.trim().split(/\s+/).filter(Boolean).length,
      body: seniorBody,
    },
    annotations: [
      {
        title: 'Point before context',
        body: 'The reader should know the recommendation or ask before they read the evidence.',
        color: 'gold',
      },
      {
        title: 'Audience-shaped ask',
        body: 'A useful PM draft tells this specific reader what decision, input, or action is needed.',
        color: 'mint',
      },
      {
        title: 'Tradeoff named',
        body: 'Strong drafts make the cost visible so the reader does not have to infer the PM judgment.',
        color: 'sky',
      },
    ],
    skillDeltas: {
      comms: 0.1,
      escal: 0.05,
      prio: 0.05,
      disco: input.artifact === 'PRD section' ? 0.06 : 0.01,
      narr: 0.07,
    },
    source: 'practice',
    rubric: [
      {
        id: 'judgment-call',
        label: 'Carries the PM call',
        pts: 16,
        detail: hasCheckpoint ? 'The draft must carry the recommendation from your checkpoint.' : 'State the recommendation or decision clearly.',
        principleId: 'recommendation',
        evaluate: (draft, lowerDraft) => ({
          hit: judgment.recommendation
            ? carriesJudgmentField(draft, judgment.recommendation)
            : /^(rec|recommendation|decision|ask|need|proposal|summary):|^rec[:\s]|^decision[:\s]|^ask[:\s]/.test(lowerDraft.trim()),
          partial: judgment.recommendation ? /recommend|decision|rec:|ask|need|proposal/.test(lowerDraft) : undefined,
        }),
      },
      {
        id: 'judgment-evidence',
        label: 'Carries the evidence',
        pts: 14,
        detail: hasCheckpoint ? 'The draft should reuse the evidence that made the call reasonable.' : 'Use concrete facts, numbers, dates, or named constraints.',
        principleId: 'evidence',
        evaluate: (draft) => ({
          hit: judgment.evidence ? carriesJudgmentField(draft, judgment.evidence) : /@\w+/.test(draft) || hasConcreteEvidenceSignal(draft),
          partial: judgment.evidence ? hasConcreteEvidenceSignal(draft) : undefined,
        }),
      },
      {
        id: 'judgment-tradeoff',
        label: 'Carries the tradeoff',
        pts: 14,
        detail: hasCheckpoint ? 'The draft should preserve the cost or risk you decided to accept.' : 'Say what cost, risk, or alternative is being accepted.',
        principleId: 'tradeoff',
        evaluate: (draft, lowerDraft) => ({
          hit: judgment.tradeoff
            ? carriesJudgmentField(draft, judgment.tradeoff)
            : /tradeoff|risk|cost|impact|alternative|delay|slip|churn|revenue|customer|scope/.test(lowerDraft),
          partial: judgment.tradeoff ? /tradeoff|risk|cost|impact|alternative|delay|slip|scope|but|instead/.test(lowerDraft) : undefined,
        }),
      },
      {
        id: 'judgment-ask',
        label: 'Carries the ask',
        pts: 12,
        detail: hasCheckpoint ? 'The reader should see the same owner, decision, or timing from your checkpoint.' : 'Tell the audience what decision, input, or action you need.',
        principleId: 'ask',
        evaluate: (draft, lowerDraft) => ({
          hit: judgment.ask ? carriesJudgmentField(draft, judgment.ask) : /need|ask|approve|confirm|decide|input|owner|next step|can you/.test(lowerDraft),
          partial: judgment.ask ? /@\w+|need|ask|approve|confirm|decide|input|owner|next step|today|tomorrow|eod|by /.test(lowerDraft) : undefined,
        }),
      },
      {
        id: 'judgment-boundary',
        label: 'Carries the no-list',
        pts: 10,
        detail: hasCheckpoint ? 'If you chose not to do something, the draft should not hide that boundary.' : 'Name what is out, deferred, or intentionally not promised.',
        principleId: 'tradeoff',
        evaluate: (draft, lowerDraft) => ({
          hit: judgment.nonGoals
            ? carriesJudgmentField(draft, judgment.nonGoals)
            : /not doing|out:|defer|cut|hold|pause|not promise|do not/.test(lowerDraft),
          partial: judgment.nonGoals ? /not doing|out:|defer|cut|hold|pause|not promise|do not/.test(lowerDraft) : undefined,
        }),
      },
      {
        id: 'front-load',
        label: 'Front-load the point',
        pts: 10,
        detail: 'Lead with the decision, recommendation, or ask.',
        principleId: 'front-load',
        evaluate: (_, lowerDraft) => ({
          hit: /^(rec|recommendation|decision|ask|need|proposal|summary):|^rec[:\s]|^decision[:\s]|^ask[:\s]/.test(lowerDraft.trim()),
        }),
      },
      {
        id: 'audience',
        label: 'Write for the audience',
        pts: 8,
        detail: 'Use language that fits the reader and their decision.',
        principleId: 'audience',
        evaluate: (_, lowerDraft) => ({
          hit: audience === 'the decision maker' ? /you|we|team|customer/.test(lowerDraft) : lowerDraft.includes(audience.toLowerCase().split(/\s+/)[0]),
        }),
      },
      {
        id: 'context-fit',
        label: 'Tied to supplied context',
        pts: 8,
        detail: 'Reuse the concrete names, facts, or constraints from the situation so the critique can judge PM fit.',
        principleId: 'evidence',
        evaluate: (draft) => {
          const hits = countImportantTermHits(draft, contextTerms)
          return { hit: hits >= 2, partial: hits === 1 }
        },
      },
      {
        id: 'restraint',
        label: 'Remove weak language',
        pts: 6,
        detail: 'Avoid hedging and throat-clearing.',
        principleId: 'restraint',
        evaluate: (_, lowerDraft) => ({
          hit: !/maybe|just|i think|kind of|sort of|probably|wanted to|quick question/.test(lowerDraft),
        }),
      },
      {
        id: 'concise',
        label: 'Respect the artifact size',
        pts: 2,
        detail: `Stay within ${wordLimit} words.`,
        evaluate: (draft) => ({
          hit: draft.trim().split(/\s+/).filter(Boolean).length <= wordLimit,
        }),
      },
    ],
  }
}
