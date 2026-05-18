import { laneContextReview, type ContextReview } from './context'
import type { ContextConfidence, RunRecord, RubricCheck, Scenario, ScenarioAnnotation } from './types'

type ToneColor = 'mint' | 'gold' | 'hot'

export type SendReadiness = {
  label: 'SHIP IT' | 'REVISE FIRST' | 'DO NOT SEND YET'
  color: ToneColor
  body: string
  risk: string
}

export type CoachingOutput = {
  title: string
  body: string
  fix?: string
  color: ToneColor
}

export type RevisedDraftOutput = {
  body: string
  words: number
}

export type CritiqueOutput = {
  hits: RubricCheck[]
  misses: RubricCheck[]
  contextReview: ContextReview
  readiness: SendReadiness
  coaching: CoachingOutput
  revisedDraft: RevisedDraftOutput
  revisionReasons: ScenarioAnnotation[]
}

type ArtifactKind = 'slack' | 'exec' | 'prd' | 'customer' | 'meeting' | 'prioritization'

type DraftParts = {
  call?: string
  context?: string
  evidence?: string
  impact?: string
  tradeoff?: string
  ask?: string
  boundary?: string
  change?: string
  other: string[]
}

export const BANNED_CRITIQUE_PATTERNS = [
  /this is the right rep/i,
  /generic practice/i,
  /PM Dojo can/i,
  /PM archaeology/i,
  /senior PM/i,
]

export const BANNED_REVISED_DRAFT_PATTERNS = [
  /^Rec:/im,
  /^Recommendation:/im,
  /^What happened:/im,
  /^Interpretation:/im,
  /^Trade-?off:/im,
  /^Impact:/im,
]

const wordCount = (value: string) => value.trim().split(/\s+/).filter(Boolean).length

export function buildCritiqueOutput(scenario: Scenario, run: RunRecord): CritiqueOutput {
  const hits = run.checks.filter((check) => check.hit)
  const misses = run.checks.filter((check) => !check.hit)
  const contextReview = contextReviewForRun(run, scenario)
  const readiness = sendReadinessForRun(run, contextReview, misses)
  const coaching = coachingForReview(scenario, misses, readiness, contextReview)
  const revisedDraft = buildRevisedDraft(scenario, run)

  return {
    hits,
    misses,
    contextReview,
    readiness,
    coaching,
    revisedDraft,
    revisionReasons: buildRevisionReasons(revisedDraft.body),
  }
}

export function outputContractViolations(output: CritiqueOutput) {
  const critiqueText = [output.coaching.title, output.coaching.body, output.coaching.fix ?? '', output.readiness.body, output.readiness.risk].join('\n')
  const revisedText = output.revisedDraft.body
  const violations: string[] = []

  for (const pattern of BANNED_CRITIQUE_PATTERNS) {
    if (pattern.test(critiqueText)) {
      violations.push(`critique contains ${pattern}`)
    }
  }

  for (const pattern of BANNED_REVISED_DRAFT_PATTERNS) {
    if (pattern.test(revisedText)) {
      violations.push(`revised draft contains ${pattern}`)
    }
  }

  if (revisedText.includes('PM Dojo')) {
    violations.push('revised draft contains PM Dojo self-reference')
  }

  return violations
}

function sendReadinessForRun(run: RunRecord, contextReview: ContextReview, misses: RubricCheck[]): SendReadiness {
  const contextThin = contextReview.confidence === 'thin'
  const contextUsable = contextReview.confidence === 'usable'
  const judgmentFuzzy = typeof run.judgmentScore === 'number' && run.judgmentScore < 48
  const judgmentPartial = typeof run.judgmentScore === 'number' && run.judgmentScore < 78

  if (contextThin || judgmentFuzzy || run.grade === 'D' || run.grade === 'C') {
    return {
      label: 'DO NOT SEND YET',
      color: 'hot',
      body: 'Do not send this yet. The reader would have to infer the call, evidence, or ask.',
      risk: 'The main risk is false alignment: people read it and still do not know the decision or owner.',
    }
  }

  if (contextUsable || judgmentPartial || run.grade === 'B' || misses.length > 0) {
    return {
      label: 'REVISE FIRST',
      color: 'gold',
      body: 'Revise before sending. The call is usable, but one high-risk beat is still under-specified.',
      risk: 'The reader may understand the situation but miss the action you need from them.',
    }
  }

  return {
    label: 'SHIP IT',
    color: 'mint',
    body: 'Ready to send after a quick tone pass.',
    risk: 'Only situational risk remains: politics, tone, or facts not included in the prompt.',
  }
}

function coachingForReview(
  scenario: Scenario,
  misses: RubricCheck[],
  readiness: SendReadiness,
  contextReview: ContextReview,
): CoachingOutput {
  if (contextReview.confidence === 'thin') {
    return {
      title: 'Missing context.',
      body: 'The draft can be scored for structure, but the PM call is not judgeable yet.',
      fix: 'Add the audience, what changed, the concrete evidence, the accepted cost, and the decision or action needed.',
      color: 'hot',
    }
  }

  if (misses.length === 0) {
    return {
      title: 'The call is clear.',
      body: `${readiness.body} The draft shows the call, evidence, cost, and next action.`,
      color: readiness.color,
    }
  }

  const firstMiss = misses[0]
  const signal = checkSignal(firstMiss)

  if (/audience|reader|exec|customer|stakeholder/.test(signal)) {
    return {
      title: "Reader's decision is implicit.",
      body: `The draft names the issue, but it does not make the reader's job obvious enough for ${scenario.channelLabel.toLowerCase()}.`,
      fix: actionForMiss(firstMiss),
      color: 'gold',
    }
  }

  if (/ask|owner|when|deadline|action|decide/.test(signal)) {
    return {
      title: 'Ask is too soft.',
      body: 'The ending needs a named owner, clock, or decision so the reader can act without translating.',
      fix: actionForMiss(firstMiss),
      color: 'gold',
    }
  }

  if (/front|lede|lead|point|recommendation|rec/.test(signal)) {
    return {
      title: 'Point arrives late.',
      body: 'Lead with the call. Context should support the decision, not hide it.',
      fix: actionForMiss(firstMiss),
      color: 'gold',
    }
  }

  if (/evidence|fact|metric|signal|data/.test(signal)) {
    return {
      title: 'Evidence is too thin.',
      body: 'The call needs the fact, customer, metric, or deadline that makes it reasonable.',
      fix: actionForMiss(firstMiss),
      color: 'hot',
    }
  }

  if (/tradeoff|risk|cost|non-goal|no-list|not promising/.test(signal)) {
    return {
      title: 'Cost is hidden.',
      body: 'Name what you are accepting or not promising so disagreement has a clear surface area.',
      fix: actionForMiss(firstMiss),
      color: 'hot',
    }
  }

  return {
    title: `${firstMiss.label} is under-specified.`,
    body: `This ${scenario.channelLabel.toLowerCase()} artifact leaves one important PM beat unclear.`,
    fix: actionForMiss(firstMiss),
    color: readiness.color,
  }
}

function buildRevisedDraft(scenario: Scenario, run: RunRecord): RevisedDraftOutput {
  const artifact = inferArtifactKind(scenario)
  const parts = partsForRevision(scenario, run)
  const body = formatByArtifact(artifact, parts)

  return {
    body,
    words: wordCount(body),
  }
}

function partsForRevision(scenario: Scenario, run: RunRecord): DraftParts {
  const benchmarkParts = extractDraftParts(scenario.seniorDraft.body)
  const checkpoint = run.judgmentCheckpoint

  if (checkpoint) {
    return {
      call: checkpoint.recommendation || benchmarkParts.call,
      context: scenario.brief || benchmarkParts.context,
      evidence: checkpoint.evidence || benchmarkParts.evidence || benchmarkParts.context,
      tradeoff: checkpoint.tradeoff || benchmarkParts.tradeoff || benchmarkParts.impact,
      ask: checkpoint.ask || benchmarkParts.ask,
      boundary: checkpoint.nonGoals || benchmarkParts.boundary,
      change: checkpoint.changeMind || benchmarkParts.change,
      other: benchmarkParts.other,
    }
  }

  return {
    call: benchmarkParts.call,
    context: benchmarkParts.context || scenario.brief,
    evidence: benchmarkParts.evidence || benchmarkParts.context || scenario.brief,
    impact: benchmarkParts.impact,
    tradeoff: benchmarkParts.tradeoff || benchmarkParts.impact,
    ask: benchmarkParts.ask,
    boundary: benchmarkParts.boundary,
    change: benchmarkParts.change,
    other: benchmarkParts.other,
  }
}

function formatByArtifact(artifact: ArtifactKind, parts: DraftParts) {
  if (artifact === 'customer') {
    return compactParagraphs([
      `Thanks for raising this. ${capitalizeFirst(sentence(parts.call))}`,
      parts.evidence ? sentence(parts.evidence) : parts.context ? sentence(parts.context) : '',
      parts.boundary ? notDoingSentence(parts.boundary) : '',
      parts.tradeoff ? `I am choosing this path because ${lowerFirst(sentence(parts.tradeoff))}` : '',
      parts.ask ? sentence(parts.ask) : '',
    ])
  }

  if (artifact === 'prd') {
    return compactParagraphs([
      `Decision\n${sentence(parts.call)}`,
      `Rationale\n${sentence(parts.evidence || parts.context)}`,
      parts.boundary ? `Out of scope\n${sentence(parts.boundary)}` : '',
      parts.tradeoff ? `Risk accepted\n${sentence(parts.tradeoff)}` : '',
      parts.ask ? `Open decision\n${sentence(parts.ask)}` : parts.change ? `Change trigger\n${sentence(parts.change)}` : '',
    ])
  }

  if (artifact === 'exec') {
    return compactParagraphs([
      `Bottom line: ${sentence(parts.call)}`,
      sentence(parts.evidence || parts.context),
      parts.tradeoff ? `Why this path: ${sentence(parts.tradeoff)}` : '',
      parts.boundary ? `Not promising yet: ${sentence(parts.boundary)}` : '',
      parts.ask ? `Decision needed: ${sentence(parts.ask)}` : '',
      parts.change ? `I would revisit this if ${lowerFirst(sentence(parts.change))}` : '',
    ])
  }

  if (artifact === 'meeting') {
    return compactParagraphs([
      `Decision: ${sentence(parts.call)}`,
      parts.evidence || parts.context ? `Reason: ${sentence(parts.evidence || parts.context)}` : '',
      parts.tradeoff ? `Cost: ${sentence(parts.tradeoff)}` : '',
      parts.ask ? `Owner and next step: ${sentence(parts.ask)}` : '',
    ])
  }

  if (artifact === 'prioritization') {
    return compactParagraphs([
      `Cutline: ${sentence(parts.call)}`,
      parts.evidence || parts.context ? `Why: ${sentence(parts.evidence || parts.context)}` : '',
      parts.boundary ? `Not doing: ${sentence(parts.boundary)}` : '',
      parts.tradeoff ? `Cost: ${sentence(parts.tradeoff)}` : '',
      parts.ask ? `Decision needed: ${sentence(parts.ask)}` : '',
    ])
  }

  return compactParagraphs([
    capitalizeFirst(sentence(parts.call)),
    sentence(parts.evidence || parts.context),
    parts.tradeoff ? sentence(parts.tradeoff) : '',
    parts.boundary ? notDoingSentence(parts.boundary) : '',
    parts.ask ? sentence(parts.ask) : '',
    parts.change ? revisitSentence(parts.change) : '',
  ])
}

function buildRevisionReasons(revisedDraft: string): ScenarioAnnotation[] {
  const firstLine = revisedDraft.split('\n').find((line) => line.trim())?.trim() ?? 'The first line carries the call.'

  return [
    {
      title: 'Opens with the call',
      body: `First visible line: "${firstLine.slice(0, 90)}${firstLine.length > 90 ? '...' : ''}"`,
      color: 'gold',
    },
    {
      title: 'Uses concrete evidence',
      body: 'The rewrite keeps the fact, customer, metric, or constraint that makes the call credible.',
      color: 'mint',
    },
    {
      title: 'Names the action',
      body: 'The reader gets the decision, owner, or next step instead of a status update with no job.',
      color: 'sky',
    },
  ]
}

function extractDraftParts(text: string): DraftParts {
  const parts: DraftParts = { other: [] }

  for (const paragraph of text.split(/\n{2,}/).map((entry) => entry.trim()).filter(Boolean)) {
    const match = paragraph.match(/^([^:\n]{2,40}):\s*([\s\S]+)$/)

    if (!match) {
      parts.other.push(paragraph)
      continue
    }

    const label = match[1].trim().toLowerCase()
    const value = match[2].trim()

    if (/^(rec|recommendation|decision|proposal|summary|update|cutline|assumption)$/.test(label)) {
      parts.call ??= value
    } else if (/^(context|what changed|what happened)$/.test(label)) {
      parts.context ??= value
    } else if (/^(evidence|why)$/.test(label)) {
      parts.evidence ??= value
    } else if (/^impact$/.test(label)) {
      parts.impact ??= value
    } else if (/^(tradeoff|risk|cost|risk accepted|scope implication)$/.test(label)) {
      parts.tradeoff ??= value
    } else if (/^(need|ask|next step|decision needed|open decision)$/.test(label)) {
      parts.ask ??= value
    } else if (/^(not doing|out|out of scope)$/.test(label)) {
      parts.boundary ??= value
    } else if (/^(revisit if|change trigger|kill if)$/.test(label)) {
      parts.change ??= value
    } else {
      parts.other.push(value)
    }
  }

  if (!parts.call && parts.other.length > 0) {
    parts.call = parts.other[0]
  }

  return parts
}

function inferArtifactKind(scenario: Scenario): ArtifactKind {
  const signal = `${scenario.objectiveTitle} ${scenario.channelLabel} ${scenario.chips.join(' ')} ${scenario.title} ${scenario.tag}`.toLowerCase()

  if (/customer|reply|external note/.test(signal)) {
    return 'customer'
  }

  if (/prd|spec|requirement/.test(signal)) {
    return 'prd'
  }

  if (/exec|memo|ceo|board|leadership|readout|qbr|kpi/.test(signal)) {
    return 'exec'
  }

  if (/meeting|room|follow-up|staff/.test(signal)) {
    return 'meeting'
  }

  if (/cutline|prioriti|roadmap|scope|fund/.test(signal)) {
    return 'prioritization'
  }

  return 'slack'
}

function contextLabel(confidence: ContextConfidence) {
  if (confidence === 'strong') {
    return 'STRONG CONTEXT'
  }

  if (confidence === 'usable') {
    return 'USABLE CONTEXT'
  }

  return 'THIN CONTEXT'
}

function contextReviewForRun(run: RunRecord, scenario: Scenario): ContextReview {
  if (scenario.source !== 'practice') {
    return laneContextReview()
  }

  const confidence = run.contextConfidence ?? 'usable'

  return {
    confidence,
    score: run.contextScore ?? 55,
    label: contextLabel(confidence),
    detail:
      run.contextNote ??
      'Real-draft critique depends on the context supplied. Add audience, facts, stakes, and the tradeoff for stronger PM judgment.',
    missing: [],
  }
}

function checkSignal(check: RubricCheck) {
  return `${check.id} ${check.label} ${check.detail} ${check.principleLabel ?? ''}`.toLowerCase()
}

export function actionForMiss(check: RubricCheck) {
  const signal = checkSignal(check)

  if (/front|lede|lead|point|recommendation|rec/.test(signal)) {
    return 'Move the call into sentence one.'
  }

  if (/audience|reader|exec|customer|stakeholder/.test(signal)) {
    return 'Name the reader and the decision they need to make, approve, or stop worrying about.'
  }

  if (/evidence|fact|metric|signal|data/.test(signal)) {
    return 'Add the fact that makes the call reasonable: number, customer, deadline, or observed signal.'
  }

  if (/tradeoff|risk|cost|non-goal|no-list|not promising/.test(signal)) {
    return 'Name the cost or risk you are accepting.'
  }

  if (/ask|owner|when|deadline|action|decide/.test(signal)) {
    return 'End with who acts, by when, and what happens next.'
  }

  if (/scope|cut|priority|sequence/.test(signal)) {
    return 'State what is in, what is out, and why this cutline wins.'
  }

  return check.detail
}

function compactParagraphs(parts: Array<string | undefined>) {
  return parts
    .map((part) => part?.trim())
    .filter(Boolean)
    .join('\n\n')
}

function sentence(value: string | undefined) {
  const text = stripKnownLabel(value ?? '').trim()

  if (!text) {
    return ''
  }

  return /[.!?]$/.test(text) ? text : `${text}.`
}

function stripKnownLabel(value: string) {
  return value.replace(/^(Rec|Recommendation|What happened|Interpretation|Trade-?off|Impact|Evidence|Context|Why|Need|Ask):\s*/i, '')
}

function lowerFirst(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1)
}

function capitalizeFirst(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function notDoingSentence(value: string) {
  const text = sentence(value)

  if (/^(do not|don't|not\b|no\b|avoid\b)/i.test(text)) {
    return text
  }

  return `Do not ${lowerFirst(text)}`
}

function revisitSentence(value: string) {
  const text = sentence(value)

  if (/^if\b/i.test(text)) {
    return text
  }

  return `If ${lowerFirst(text)}`
}
