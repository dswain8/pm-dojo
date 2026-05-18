import type { PrincipleKey } from './principles'

export type LennySourceKind = 'newsletter' | 'podcast'

export type LennySourceRef = {
  id: string
  kind: LennySourceKind
  title: string
  author: string
  topicFile: string
  takeaway: string
}

export const LENNY_DATASET = {
  label: "Lenny's Newsletter + Podcast archive",
  localNewsletterPosts: 349,
  localPodcastTranscripts: 289,
  boundary: 'Only Lenny newsletter and podcast-derived material should be used for the Buildathon experience.',
  wikiIndexPath: 'wiki/INDEX.md',
  rawArchivePath: 'raw/lennys-newsletterpodcastdata-all',
}

export const LENNY_SOURCE_REFS: Record<string, LennySourceRef> = {
  'minto-scr': {
    id: 'minto-scr',
    kind: 'newsletter',
    title: 'The Minto Pyramid Principle and the SCR Framework',
    author: 'Lenny Rachitsky',
    topicFile: 'communication-and-writing.md',
    takeaway: 'Lead with the answer, then support it with context and evidence.',
  },
  'lulu-comms': {
    id: 'lulu-comms',
    kind: 'podcast',
    title: 'Lulu Cheng Meservey - Communication as Strategy',
    author: "Lenny's Podcast",
    topicFile: 'communication-and-writing.md',
    takeaway: 'Shape the message around the audience and the narrative vacuum.',
  },
  'seth-godin': {
    id: 'seth-godin',
    kind: 'podcast',
    title: 'Seth Godin - Tension and Good Communication',
    author: "Lenny's Podcast",
    topicFile: 'communication-and-writing.md',
    takeaway: 'A useful message creates productive tension toward a specific change.',
  },
  'product-strategy': {
    id: 'product-strategy',
    kind: 'newsletter',
    title: 'Getting Better at Product Strategy',
    author: 'Lenny Rachitsky',
    topicFile: 'product-strategy-and-execution.md',
    takeaway: 'Strategy should be opinionated, focused, and actionable.',
  },
  'mission-stack': {
    id: 'mission-stack',
    kind: 'newsletter',
    title: 'Mission -> Vision -> Strategy -> Goals -> Roadmap -> Task',
    author: 'Lenny Rachitsky',
    topicFile: 'product-strategy-and-execution.md',
    takeaway: 'Decisions should ladder up from mission to strategy to concrete work.',
  },
  'pitfalls-new-pms': {
    id: 'pitfalls-new-pms',
    kind: 'newsletter',
    title: 'The Most Common Pitfalls of New Product Managers',
    author: 'Lenny Rachitsky',
    topicFile: 'product-strategy-and-execution.md',
    takeaway: 'PMs should bring judgment, not just coordination.',
  },
  'communicating-tradeoffs': {
    id: 'communicating-tradeoffs',
    kind: 'newsletter',
    title: 'Communicating Tradeoffs So Leaders Will Listen',
    author: 'Tara Seshan / Lenny Rachitsky',
    topicFile: 'product-strategy-and-execution.md',
    takeaway: 'Translate resource tension into a clear company-level decision.',
  },
  'prioritizing-roadmap': {
    id: 'prioritizing-roadmap',
    kind: 'newsletter',
    title: 'Prioritizing Your Roadmap',
    author: 'Lenny Rachitsky',
    topicFile: 'product-strategy-and-execution.md',
    takeaway: 'Prioritization is sequencing with explicit impact and cost.',
  },
  'sunset-feature': {
    id: 'sunset-feature',
    kind: 'newsletter',
    title: 'When to Sunset a Feature',
    author: 'Lenny Rachitsky',
    topicFile: 'product-strategy-and-execution.md',
    takeaway: 'Good cuts name what stops, why, and what improves because of it.',
  },
  'when-not-experiment': {
    id: 'when-not-experiment',
    kind: 'newsletter',
    title: 'When NOT to Run an Experiment',
    author: 'Lenny Rachitsky',
    topicFile: 'product-strategy-and-execution.md',
    takeaway: 'Not every decision needs a test; pick the right evidence for the call.',
  },
  evals: {
    id: 'evals',
    kind: 'newsletter',
    title: "Beyond Vibe Checks: PM's Guide to Evals",
    author: 'Lenny Rachitsky',
    topicFile: 'analytical-thinking.md',
    takeaway: 'Define the evaluation criteria before trusting a confident output.',
  },
  'ai-lifecycle': {
    id: 'ai-lifecycle',
    kind: 'newsletter',
    title: 'Why Your AI Product Needs a Different Lifecycle',
    author: 'Lenny Rachitsky',
    topicFile: 'product-strategy-and-execution.md',
    takeaway: 'AI product judgment depends on evaluation loops, not one-time launch logic.',
  },
  'decision-frameworks': {
    id: 'decision-frameworks',
    kind: 'newsletter',
    title: 'My Favorite Decision-Making Frameworks',
    author: 'Lenny Rachitsky',
    topicFile: 'analytical-thinking.md',
    takeaway: 'Make who decides, what alternatives exist, and why explicit.',
  },
  'problem-solving': {
    id: 'problem-solving',
    kind: 'newsletter',
    title: 'A Three-Step Framework for Solving Problems',
    author: 'Lenny Rachitsky',
    topicFile: 'analytical-thinking.md',
    takeaway: 'Crystallize the problem before choosing the solution.',
  },
  'roger-martin': {
    id: 'roger-martin',
    kind: 'podcast',
    title: 'Roger Martin - The Discipline of Deciding',
    author: "Lenny's Podcast",
    topicFile: 'analytical-thinking.md',
    takeaway: 'Make the choice and the assumptions behind it explicit.',
  },
  'annie-duke': {
    id: 'annie-duke',
    kind: 'podcast',
    title: 'Annie Duke - Decision Quality vs. Outcome Quality',
    author: "Lenny's Podcast",
    topicFile: 'analytical-thinking.md',
    takeaway: 'Judge the decision process separately from how the outcome happened to land.',
  },
  'managing-up': {
    id: 'managing-up',
    kind: 'newsletter',
    title: 'Managing Up',
    author: 'Lenny Rachitsky',
    topicFile: 'managing-up.md',
    takeaway: 'Senior stakeholders need decisions, risks, and asks before narration.',
  },
  'getting-buy-in': {
    id: 'getting-buy-in',
    kind: 'newsletter',
    title: 'Getting Buy-In',
    author: 'Lenny Rachitsky',
    topicFile: 'managing-up.md',
    takeaway: 'Earn alignment by making the room feel heard while still landing a call.',
  },
  'saying-no': {
    id: 'saying-no',
    kind: 'newsletter',
    title: 'Saying No to Your Manager',
    author: 'Lenny Rachitsky',
    topicFile: 'managing-up.md',
    takeaway: 'A good no explains the tradeoff and gives the manager a real decision.',
  },
  influence: {
    id: 'influence',
    kind: 'newsletter',
    title: 'How to Get Better at Influence',
    author: 'Lenny Rachitsky',
    topicFile: 'influence-and-leadership.md',
    takeaway: 'Influence starts with understanding what the room needs to believe.',
  },
  'w-framework': {
    id: 'w-framework',
    kind: 'newsletter',
    title: 'The W Framework for Planning',
    author: 'Lenny Rachitsky',
    topicFile: 'meetings-and-real-time.md',
    takeaway: 'Align stakeholders early enough that the final plan is not a surprise.',
  },
  goals: {
    id: 'goals',
    kind: 'newsletter',
    title: 'Setting Goals',
    author: 'Lenny Rachitsky',
    topicFile: 'influence-and-leadership.md',
    takeaway: 'A useful goal changes decisions and clarifies what matters now.',
  },
  'bad-news': {
    id: 'bad-news',
    kind: 'newsletter',
    title: 'Communicating Bad News',
    author: 'Lenny Rachitsky',
    topicFile: 'feedback-and-difficult-conversations.md',
    takeaway: 'Get ahead of bad news, keep trust, and bring the next recommendation.',
  },
  'failure-execs': {
    id: 'failure-execs',
    kind: 'newsletter',
    title: 'Communicating Failure to Execs',
    author: 'Lenny Rachitsky',
    topicFile: 'feedback-and-difficult-conversations.md',
    takeaway: 'Separate the project from the person and show what we learned next.',
  },
  'gain-feedback': {
    id: 'gain-feedback',
    kind: 'newsletter',
    title: 'The GAIN Framework for Feedback',
    author: 'Jack Cohen / Lenny Rachitsky',
    topicFile: 'feedback-and-difficult-conversations.md',
    takeaway: 'Hard feedback lands better when it is tied to a shared gain and next action.',
  },
}

export const PRINCIPLE_SOURCE_IDS: Record<PrincipleKey, string[]> = {
  'front-load': ['minto-scr', 'lulu-comms', 'seth-godin'],
  recommendation: ['product-strategy', 'mission-stack', 'pitfalls-new-pms'],
  tradeoff: ['communicating-tradeoffs', 'decision-frameworks', 'roger-martin'],
  ask: ['managing-up', 'getting-buy-in', 'decision-frameworks'],
  evidence: ['problem-solving', 'prioritizing-roadmap', 'evals'],
  audience: ['influence', 'lulu-comms', 'seth-godin'],
  restraint: ['bad-news', 'failure-execs', 'gain-feedback'],
}

export const LANE_SOURCE_IDS: Record<string, string[]> = {
  '00': ['minto-scr', 'problem-solving', 'communicating-tradeoffs'],
  '01': ['bad-news', 'failure-execs', 'lulu-comms'],
  '02': ['influence', 'getting-buy-in', 'w-framework', 'decision-frameworks'],
  '03': ['prioritizing-roadmap', 'communicating-tradeoffs', 'saying-no', 'sunset-feature'],
  '04': ['managing-up', 'product-strategy', 'minto-scr', 'bad-news'],
  '05': ['problem-solving', 'when-not-experiment', 'evals', 'ai-lifecycle', 'roger-martin'],
}

export function getLennySourceRefs(sourceIds: string[]) {
  return Array.from(new Set(sourceIds)).flatMap((sourceId) => {
    const source = LENNY_SOURCE_REFS[sourceId]
    return source ? [source] : []
  })
}

export function getPrincipleLennySources(principleId: PrincipleKey) {
  return getLennySourceRefs(PRINCIPLE_SOURCE_IDS[principleId] ?? [])
}

export function getLaneLennySources(laneId: string) {
  return getLennySourceRefs(LANE_SOURCE_IDS[laneId] ?? LANE_SOURCE_IDS['00'])
}

export function lennySourceLabel(source: LennySourceRef) {
  return `${source.kind === 'newsletter' ? 'Newsletter' : 'Podcast'}: ${source.title}`
}

export function lennySourceSummary(sourceIds: string[], limit = 2) {
  const sources = getLennySourceRefs(sourceIds).slice(0, limit)
  return sources.map((source) => source.title).join(' + ')
}
