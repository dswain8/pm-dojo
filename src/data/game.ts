import type { Difficulty } from './scenarios'

export type SkillKey =
  | 'communication'
  | 'escalation'
  | 'prioritization'
  | 'discovery'
  | 'leadership'

export const SKILL_META: Record<
  SkillKey,
  { label: string; description: string; color: string; bg: string }
> = {
  communication: {
    label: 'Communication',
    description: 'Lead with the point and land the message cleanly.',
    color: 'text-blue-300',
    bg: 'bg-blue-500/10',
  },
  escalation: {
    label: 'Escalation',
    description: 'Surface risk early and bring a recommendation.',
    color: 'text-amber-300',
    bg: 'bg-amber-500/10',
  },
  prioritization: {
    label: 'Prioritization',
    description: 'Choose what matters and make the cutline visible.',
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
  },
  discovery: {
    label: 'Discovery',
    description: 'Pressure-test assumptions before the team overcommits.',
    color: 'text-cyan-300',
    bg: 'bg-cyan-500/10',
  },
  leadership: {
    label: 'Leadership Judgment',
    description: 'Handle politics, tradeoffs, and stakeholder energy.',
    color: 'text-purple-300',
    bg: 'bg-purple-500/10',
  },
}

export interface MomentCard {
  path: string
  key: string
  title: string
  subtitle: string
  description: string
  cue: string
  artifact: string
  icon: string
  border: string
  glow: string
  iconBg: string
  skills: SkillKey[]
}

export const MOMENT_CARDS: MomentCard[] = [
  {
    path: '/inbox-fire',
    key: '1',
    title: 'Bad-News Update',
    subtitle: 'You just got tagged. Respond without making things worse.',
    description:
      'Practice the moment where trust is on the line: status slips, customer pressure, or uncomfortable stakeholder asks.',
    cue: 'Delay, incident, uncomfortable DM, angry stakeholder',
    artifact: 'Slack update or escalation note',
    icon: '🔥',
    border: 'border-blue-500/30 hover:border-blue-400',
    glow: 'hover:shadow-blue-500/20',
    iconBg: 'bg-blue-500/10',
    skills: ['communication', 'escalation'],
  },
  {
    path: '/the-room',
    key: '2',
    title: 'Navigate the Room',
    subtitle: 'Handle the meeting while the politics are still live.',
    description:
      'Practice messy rooms where you have incomplete information, conflicting incentives, and no time for the perfect answer.',
    cue: 'Leadership review, surprise objection, cross-functional conflict',
    artifact: 'Live response and decision path',
    icon: '🚪',
    border: 'border-emerald-500/30 hover:border-emerald-400',
    glow: 'hover:shadow-emerald-500/20',
    iconBg: 'bg-emerald-500/10',
    skills: ['leadership', 'communication'],
  },
  {
    path: '/red-pen',
    key: '3',
    title: 'Red Pen',
    subtitle: 'Turn vague PM writing into something that can actually move a decision.',
    description:
      'Practice rewriting updates, notes, and decision drafts so they become crisp, scannable, and harder to misread.',
    cue: 'Preamble, hedging, weak tradeoff framing, no ask',
    artifact: 'Rewrite and compare',
    icon: '✂️',
    border: 'border-indigo-500/30 hover:border-indigo-400',
    glow: 'hover:shadow-indigo-500/20',
    iconBg: 'bg-indigo-500/10',
    skills: ['communication', 'leadership'],
  },
  {
    path: '/first-principles',
    key: '4',
    title: 'Decision Lab',
    subtitle: 'Make the call under ambiguity instead of naming a framework.',
    description:
      'Practice structured judgment: define the decision, expose assumptions, weigh tradeoffs, and recommend the next move.',
    cue: 'Roadmap cutline, discovery uncertainty, strategy pressure',
    artifact: 'Decision memo or recommendation',
    icon: '🧠',
    border: 'border-slate-500/30 hover:border-slate-400',
    glow: 'hover:shadow-slate-500/20',
    iconBg: 'bg-slate-500/10',
    skills: ['prioritization', 'discovery', 'leadership'],
  },
]

export interface DecisionDrillScenario {
  id: string
  title: string
  difficulty: Difficulty
  prompt: string
  stakes: string
  artifact: string
  principles: string[]
  skills: SkillKey[]
  rubric: {
    decision: string
    outcome: string
    assumptions: string
    tradeoffs: string
    recommendation: string
  }
  modelAnswer: {
    decision: string
    outcome: string
    assumptions: string
    tradeoffs: string
    recommendation: string
  }
}

export const DECISION_DRILL_SCENARIOS: DecisionDrillScenario[] = [
  {
    id: 'dd-e1',
    title: 'CSV Export Pressure',
    difficulty: 'easy',
    prompt:
      'Customer Success says a prospect is calling CSV export a dealbreaker. Your roadmap is full this quarter, and only a handful of existing customers have asked for it.',
    stakes:
      'You need a recommendation that helps the team decide whether this is a roadmap move, a customer-specific workaround, or a polite no.',
    artifact: 'Recommendation note to your manager',
    principles: ['Front-load the point', 'What would need to be true?', 'Anti-sell'],
    skills: ['prioritization', 'discovery', 'communication'],
    rubric: {
      decision: 'Did you clearly say whether this should be prioritized now, later, or not at all?',
      outcome: 'Did you anchor the choice to a business outcome instead of to one loud request?',
      assumptions: 'Did you identify what would need to be true for this to deserve priority?',
      tradeoffs: 'Did you name what gets delayed or protected if you change the roadmap?',
      recommendation: 'Did you propose a concrete next move for the rep and for the product team?',
    },
    modelAnswer: {
      decision:
        'Do not add CSV export to the quarter roadmap yet. Treat this as a signal to validate, not a roadmap commitment.',
      outcome:
        'The outcome that matters is whether CSV export is a repeatable revenue or retention lever, not whether one deal is loud right now.',
      assumptions:
        'For this to deserve priority, we would need evidence that the problem shows up across similar prospects, that the workaround is genuinely inadequate, and that this request maps to a segment we want to win.',
      tradeoffs:
        'Pulling this in now means delaying higher-confidence work already tied to adoption. The upside is possible short-term deal support; the downside is roadmap churn around a weak signal.',
      recommendation:
        'Tell CS we are not committing roadmap space yet. Offer the current workaround, collect the details on the deal and similar asks this month, and revisit only if the pattern proves larger than a single prospect.',
    },
  },
  {
    id: 'dd-m1',
    title: 'Kill the Feature Sales Loves',
    difficulty: 'medium',
    prompt:
      'A lightly used feature is expensive to maintain and blocks a migration your team needs. Sales has been using it in demos and will be unhappy if you deprecate it.',
    stakes:
      'You need to recommend whether to keep it, sunset it, or phase it out without blowing up trust with Sales.',
    artifact: 'Decision note for a cross-functional leadership thread',
    principles: ['Anti-sell', 'Communication is strategy', 'Escalate with a recommendation'],
    skills: ['prioritization', 'leadership', 'communication'],
    rubric: {
      decision: 'Did you make an explicit call on keeping versus deprecating the feature?',
      outcome: 'Did you tie the call to the bigger architecture or company outcome at stake?',
      assumptions: 'Did you identify what must be true for the pain to Sales to be worth absorbing?',
      tradeoffs: 'Did you name the downside to Sales and the cost of not making the change?',
      recommendation: 'Did you give a practical path for affected deals instead of dumping the fallout on Sales?',
    },
    modelAnswer: {
      decision:
        'Deprecate the feature on a managed timeline instead of keeping it alive indefinitely.',
      outcome:
        'The outcome that matters is unblocking the migration that affects the broader product, not preserving a low-usage feature with growing maintenance cost.',
      assumptions:
        'For deprecation to be right, usage must truly be low-value, viable alternatives must exist for affected customers, and the migration benefit must materially improve the core roadmap.',
      tradeoffs:
        'This will create short-term friction for Sales and for a small set of deals. Keeping the feature avoids that pain, but it extends engineering drag and delays the higher-value migration.',
      recommendation:
        'Announce a sunset plan, arm Sales with a migration path and talking points, and personally review the highest-risk deals before the public deprecation date.',
    },
  },
  {
    id: 'dd-h1',
    title: 'AI Roadmap Push',
    difficulty: 'hard',
    prompt:
      'Leadership wants an AI story this quarter. In your product area, the biggest customer pain points are still deterministic workflow issues. You can probably ship a flashy AI feature, but you are not convinced it improves customer outcomes.',
    stakes:
      'You need a recommendation for your VP that is analytically strong and politically survivable.',
    artifact: 'Email to your VP',
    principles: ['What would need to be true?', 'Anti-sell', 'Communication is strategy'],
    skills: ['leadership', 'prioritization', 'discovery'],
    rubric: {
      decision: 'Did you clearly recommend whether to ship AI work now or defer it?',
      outcome: 'Did you frame the choice around customer and business outcomes, not trend pressure alone?',
      assumptions: 'Did you identify the assumptions required for AI to be the right bet right now?',
      tradeoffs: 'Did you name both the political downside of waiting and the customer downside of shipping prematurely?',
      recommendation: 'Did you offer a next move that is more credible than just saying no?',
    },
    modelAnswer: {
      decision:
        'Do not ship a customer-facing AI feature in this product area this quarter.',
      outcome:
        'The goal is to move retention and customer value, not to satisfy a superficial AI narrative.',
      assumptions:
        'AI would deserve priority only if it solved a top customer pain point better than deterministic improvements, if customers trusted the output enough to rely on it, and if the adoption path was realistic this quarter.',
      tradeoffs:
        'Waiting carries perception risk because other teams may look more visibly “AI-forward.” Shipping now carries the deeper risk of adding complexity and distraction to problems that are better solved with workflow improvements.',
      recommendation:
        'Protect the current roadmap, but propose a narrow exploration sprint to identify one AI use case with clear customer pull and measurable upside before committing roadmap space.',
    },
  },
  {
    id: 'dd-n1',
    title: 'Enterprise Deal Versus the Roadmap',
    difficulty: 'nightmare',
    prompt:
      'Sales says three enterprise deals are blocked unless you pull SSO into the next release. Your roadmap prioritizes self-serve adoption work with stronger product-wide impact. The CEO is now aware of the enterprise pressure.',
    stakes:
      'You need a recommendation that survives leadership scrutiny and keeps the team from thrashing.',
    artifact: 'Decision memo for the executive team',
    principles: ['What would need to be true?', 'Anti-sell', 'Escalate with a recommendation'],
    skills: ['prioritization', 'leadership', 'communication'],
    rubric: {
      decision: 'Did you make a clear call instead of listing pros and cons?',
      outcome: 'Did you define which company outcome wins if these priorities conflict?',
      assumptions: 'Did you surface the assumptions under both the enterprise-deal case and the self-serve case?',
      tradeoffs: 'Did you name the real cost of whichever path you chose?',
      recommendation: 'Did you turn the recommendation into an executable next move with owners or follow-up?',
    },
    modelAnswer: {
      decision:
        'Do not immediately yank the roadmap. First validate the enterprise pressure, then make a deliberate decision on whether SSO truly outweighs the self-serve bet.',
      outcome:
        'The company outcome to optimize is net business impact, not the loudest stakeholder voice. That means explicitly weighing near-term enterprise revenue against product-wide adoption leverage.',
      assumptions:
        'For SSO to jump the queue, the deals must be real, time-bound, and large enough to outweigh the opportunity cost. For the self-serve work to stay first, we need confidence that it meaningfully improves activation and that the enterprise risk can be contained.',
      tradeoffs:
        'Pulling SSO in may protect revenue but delays the self-serve work and teaches the org that roadmap pressure wins by escalation. Holding the line protects focus but risks real enterprise fallout if the deal data is stronger than expected.',
      recommendation:
        'Ask Sales for deal-level evidence within 48 hours, decide in an exec review with both revenue and product impact on the table, and communicate the cutline explicitly so the team does not keep re-litigating it.',
    },
  },
]
