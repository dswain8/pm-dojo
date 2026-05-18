import type { PracticeArtifact } from './practice'

export type InvokeSource = 'Slack thread' | 'Exec review' | 'PRD / spec' | 'Customer note' | 'Meeting follow-up'

export type InvokeInput = {
  source: InvokeSource
  audience: string
  moment: string
  draft: string
}

export type InvokeRecommendation = {
  laneId: string
  laneTitle: string
  artifact: PracticeArtifact
  why: string
  nextMove: string
  prompt: string
}

const sourceToArtifact: Record<InvokeSource, PracticeArtifact> = {
  'Slack thread': 'Slack update',
  'Exec review': 'Exec memo',
  'PRD / spec': 'PRD section',
  'Customer note': 'Customer reply',
  'Meeting follow-up': 'Slack update',
}

function matchLane(text: string) {
  if (/\b(escalat|blocked|urgent|renew|churn|customer|ceo|risk|incident|hot)\b/.test(text)) {
    return {
      laneId: '01',
      laneTitle: 'Bad-News Update',
      why: 'This looks like a live escalation. The rep should force a recommendation, owner, and clock before the message goes out.',
    }
  }

  if (/\b(meeting|alignment|stakeholder|sales|eng|disagree|room|politic|follow-up|recap)\b/.test(text)) {
    return {
      laneId: '02',
      laneTitle: 'Navigate the Room',
      why: 'This is a room-shaping moment. The useful move is to make the decision and tradeoff legible without relitigating the meeting.',
    }
  }

  if (/\b(priority|priorit|roadmap|scope|cut|cutline|quarter|capacity|defer|tradeoff)\b/.test(text)) {
    return {
      laneId: '03',
      laneTitle: 'The Cutline',
      why: 'This is a prioritization moment. The rep should make what is in, what is out, and why the cut is worth it explicit.',
    }
  }

  if (/\b(exec|ceo|gm|board|leadership|vp|status|weekly|qbr)\b/.test(text)) {
    return {
      laneId: '04',
      laneTitle: 'Loop the Boss',
      why: 'This is an executive narrative moment. The artifact needs the delta, the decision, and the ask without performative drama.',
    }
  }

  if (/\b(assumption|experiment|mvp|validate|validation|discovery|hypothesis|test|learn|signal)\b/.test(text)) {
    return {
      laneId: '05',
      laneTitle: 'Pressure-Test',
      why: 'This is an uncertainty moment. The rep should identify what would change the decision before the team overcommits.',
    }
  }

  return {
    laneId: '00',
    laneTitle: 'Review Real Work',
    why: 'This is best handled as a preflight review. If you want a generic rep instead, choose a lane from Train.',
  }
}

function buildPrompt(input: InvokeInput, laneTitle: string) {
  const audience = input.audience.trim() || '[who needs to decide or act]'
  const moment = input.moment.trim() || '[what happened, stakes, constraints, timing]'
  const draft = input.draft.trim() || '[paste the draft or notes]'

  return `PM Dojo this before I send it.

Mode: ${laneTitle}
Audience: ${audience}

Moment:
${moment}

Draft:
${draft}

Score writing quality separately from PM judgment confidence. Tell me what landed, what missed, and the senior PM rewrite.`
}

export function recommendInvoke(input: InvokeInput): InvokeRecommendation {
  const text = `${input.source} ${input.audience} ${input.moment} ${input.draft}`.toLowerCase()
  const lane = matchLane(text)
  const hasDraft = input.draft.trim().split(/\s+/).filter(Boolean).length >= 12

  return {
    ...lane,
    artifact: sourceToArtifact[input.source],
    nextMove: hasDraft ? 'Review the live draft now.' : 'Run the matching lane before writing.',
    prompt: buildPrompt(input, lane.laneTitle),
  }
}
