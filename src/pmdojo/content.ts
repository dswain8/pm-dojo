import { EXTRA_SCENARIOS } from './scenario-packs'
import type { Lane, Scenario, SkillDeltas, SkillKey } from './types'

const emptyDeltas = (): SkillDeltas => ({
  comms: 0,
  escal: 0,
  prio: 0,
  disco: 0,
  narr: 0,
})

const hasMention = /@\w+/
const blamePattern = /should have|their fault|we failed|obviously|clearly|just fix it/i

export const DAILY_LANE_ID = '01'
export const MY_DRAFT_LANE_ID = '00'

export const SKILL_META: Record<
  SkillKey,
  { label: string; tag: string; color: 'gold' | 'hot' | 'sky' | 'mint' | 'orchid'; description: string }
> = {
  comms: {
    label: 'Communication',
    tag: 'COMMS',
    color: 'gold',
    description: 'Lead with the point. Land the message cleanly.',
  },
  escal: {
    label: 'Escalation',
    tag: 'ESCAL',
    color: 'hot',
    description: 'Surface risk early. Bring a recommendation.',
  },
  prio: {
    label: 'Prioritization',
    tag: 'PRIO',
    color: 'sky',
    description: 'Make the cutline legible.',
  },
  disco: {
    label: 'Discovery',
    tag: 'DISCO',
    color: 'mint',
    description: 'Pressure-test before overcommit.',
  },
  narr: {
    label: 'Narrative',
    tag: 'NARR',
    color: 'orchid',
    description: 'Tell the story that earns the room.',
  },
}

export const LANE_BLUEPRINTS: Array<Omit<Lane, 'reps' | 'locked' | 'unlock' | 'scenarioCount'>> = [
  {
    id: MY_DRAFT_LANE_ID,
    title: 'Practice My Draft',
    shortTitle: 'My Draft',
    tag: 'LIVE WORK',
    rail: '#5ef2b0',
    artifact: 'Any draft',
    diff: 'NORMAL',
    hook: 'Paste a real update, memo, or PRD paragraph and get the PM delta.',
    focus: 'comms',
  },
  {
    id: '01',
    title: 'Bad-News Update',
    shortTitle: 'Bad-News',
    tag: 'ESCALATION',
    rail: '#ff5b3a',
    artifact: 'Slack · 120w',
    diff: 'HARD',
    hook: 'You just got tagged. Respond without making things worse.',
    focus: 'escal',
  },
  {
    id: '02',
    title: 'Navigate the Room',
    shortTitle: 'The Room',
    tag: 'POLITICS',
    rail: '#ffc53a',
    artifact: 'Meeting log',
    diff: 'HARD',
    hook: 'The meeting is already happening. Hold the line, lose the ego.',
    focus: 'narr',
  },
  {
    id: '03',
    title: 'The Cutline',
    shortTitle: 'Cutline',
    tag: 'PRIO',
    rail: '#6eaaff',
    artifact: 'Prio doc',
    diff: 'NORMAL',
    hook: 'Nine things want in. Four make it. Make the cut legible.',
    focus: 'prio',
  },
  {
    id: '04',
    title: 'Loop the Boss',
    shortTitle: 'Exec Loop',
    tag: 'EXEC',
    rail: '#c888ff',
    artifact: 'Memo · 250w',
    diff: 'HARD',
    hook: 'Tell your CEO what just changed, without drama.',
    focus: 'comms',
  },
  {
    id: '05',
    title: 'Pressure-Test',
    shortTitle: 'Pressure-Test',
    tag: 'DISCOVERY',
    rail: '#5ef2b0',
    artifact: 'Assumption list',
    diff: 'BOSS',
    hook: 'Before you commit, find what the team is waving past.',
    focus: 'disco',
  },
]

export const SCENARIOS: Scenario[] = [
  {
    id: 'bad-news-01',
    laneId: '01',
    code: 'LANE 01',
    title: 'Bad-News Update',
    tag: 'ESCALATION',
    rail: '#ff5b3a',
    diff: 'HARD',
    pressure: 'POLITICAL · HOT',
    brief:
      "You're PM for Atlas. Northwind, a top-5 customer, went over your head to your CEO. The blocker is one you deprioritized last sprint.",
    quote: `"We're past patience. Fix the API ceiling by Friday or we don't renew."`,
    quoteAttribution: 'Northwind CFO, CC: your CEO',
    cues: [
      { color: 'hot', text: "their CFO is CC'd" },
      { color: 'gold', text: 'engineering is mid-migration' },
      { color: 'sky', text: 'QBR record exists, search it' },
      { color: 'mint', text: 'your CEO wants a reply in 20m' },
    ],
    objectiveTitle: 'Internal Slack post',
    objectiveCopy: 'Under 120 words. Land the rec. Pull the right people. Set the clock.',
    channelLabel: '#atlas-leads · draft',
    chips: ['Slack', '≤120w', 'internal'],
    wordLimit: 120,
    defaultDraft: `@leads — quick ping before I reply to Northwind's escalation.

The API ceiling we scoped out of last sprint is now a CEO-level conversation.

Rec: ship a temporary 5x raise by Thursday, full fix next cycle. ~3 days of migration work, buys us the renewal.

Need 10m with @sahar on feasibility and @derek on precedent before I reply to their CFO.`,
    coachHit: 'You led with the rec. That keeps the room in decision mode instead of postmortem mode.',
    coachMiss: 'You still need a clock. If nobody knows when Northwind hears back, the draft feels less in control than the situation demands.',
    seniorDraft: {
      name: 'Maya L.',
      role: 'Senior PM, Stripe',
      grade: 'S',
      xp: 96,
      words: 112,
      body: `@leads — CEO got pulled into Northwind. Rec below; need decisions in 30m so I can reply by 2pm.

Situation: Their CFO emailed our CEO. Same API ceiling we scoped out last sprint. Renewal is on the line.

Rec: ship 5x limit by Thu (3d migration hit), full fix next cycle. Alternative is losing $240k ARR.

Need from you: @sahar — feasibility by 1pm. @derek — have we done a temp raise before? @erin — am I off on $ impact?`,
    },
    annotations: [
      {
        title: 'Clock in the first line',
        body: "'Need decisions in 30m so I can reply by 2pm' tells the room exactly when to move.",
        color: 'mint',
      },
      {
        title: 'Dollars, not vibes',
        body: "Putting '$240k ARR' on the page makes the tradeoff concrete instead of emotional.",
        color: 'sky',
      },
      {
        title: 'Named asks, each person',
        body: 'Each mention has one decision attached to it, so nobody has to guess why they were pulled in.',
        color: 'orchid',
      },
    ],
    skillDeltas: {
      ...emptyDeltas(),
      comms: 0.12,
      escal: 0.1,
      prio: 0.04,
      narr: 0.05,
    },
    rubric: [
      {
        id: 'lead',
        label: 'Lead with the point',
        pts: 18,
        detail: 'Say the recommendation up top.',
        evaluate: (draft) => ({ hit: /rec[:\s]|recommend/i.test(draft) }),
      },
      {
        id: 'risk',
        label: 'Name the risk',
        pts: 15,
        detail: "Call out what's on the line.",
        evaluate: (_, lowerDraft) => ({ hit: /renew|churn|arr|ceo|escalat/.test(lowerDraft) }),
      },
      {
        id: 'call',
        label: 'Concrete call',
        pts: 20,
        detail: 'Time + number + action.',
        evaluate: (_, lowerDraft) => ({ hit: /5x|raise|ship|by thu|by thursday|3d|3 day/.test(lowerDraft) }),
      },
      {
        id: 'cost',
        label: 'Show the cost',
        pts: 12,
        detail: 'Engineering and customer cost.',
        evaluate: (_, lowerDraft) => ({
          hit: (/\$|arr|renew/.test(lowerDraft) && /day|migration/.test(lowerDraft)) || /\$240k/.test(lowerDraft),
          partial: /day|migration/.test(lowerDraft),
        }),
      },
      {
        id: 'clock',
        label: 'Set a clock',
        pts: 10,
        detail: 'When will the customer hear back?',
        evaluate: (_, lowerDraft) => ({ hit: /reply by|by 2pm|by 1pm|in 20m|30m/.test(lowerDraft) }),
      },
      {
        id: 'blame',
        label: 'Avoid blame',
        pts: 10,
        detail: 'Blameless, forward-looking.',
        evaluate: (_, lowerDraft) => ({ hit: !blamePattern.test(lowerDraft) }),
      },
      {
        id: 'ppl',
        label: 'Pull the right people',
        pts: 15,
        detail: 'Name the humans you need.',
        evaluate: (draft) => ({ hit: hasMention.test(draft) }),
      },
    ],
  },
  {
    id: 'room-01',
    laneId: '02',
    code: 'LANE 02',
    title: 'Navigate the Room',
    tag: 'POLITICS',
    rail: '#ffc53a',
    diff: 'HARD',
    pressure: 'LIVE · POLITICAL',
    brief:
      "You're walking out of a roadmap review. Sales wants a logo feature this quarter, engineering wants a platform reset, and your GM asked you to send the follow-up in 15 minutes.",
    quote: `"I still don't know what we actually decided in there."`,
    quoteAttribution: 'GM, in the hallway',
    cues: [
      { color: 'hot', text: 'sales leader is escalating in parallel' },
      { color: 'gold', text: 'eng lead will not absorb both tracks' },
      { color: 'sky', text: 'GM wants one message to both teams' },
      { color: 'orchid', text: 'nobody wants to look like they lost' },
    ],
    objectiveTitle: 'Meeting recap note',
    objectiveCopy: 'Under 160 words. Capture the call, tradeoff, and next owner without relitigating the room.',
    channelLabel: '#roadmap-staff · follow-up',
    chips: ['Meeting log', '≤160w', 'cross-functional'],
    wordLimit: 160,
    defaultDraft: `Quick follow-up from roadmap review:

Decision: keep the platform reset in Q2, not the logo feature. We can't absorb both without slipping reliability work.

Tradeoff: sales loses one ask this quarter, but we keep the migration and uptime plan intact.

Need @marco to send customer impact by tomorrow and @ivy to confirm reset milestones before I close the loop with the GM.`,
    coachHit: 'You can lower the temperature if the room leaves with one clear call and one clear tradeoff.',
    coachMiss: 'If the note only says who won, the meeting happens again tomorrow. Write the decision and the cost together.',
    seniorDraft: {
      name: 'Priya S.',
      role: 'Senior PM, Airbnb',
      grade: 'A',
      xp: 88,
      words: 121,
      body: `Decision from roadmap review: hold the platform reset in Q2. We are not pulling the logo feature into the quarter.

Why: the reset is the gating work for reliability and we do not have capacity to add the sales ask without moving the migration and taking on incident risk.

Follow-ups:
@marco — send the customer list and revenue exposure by tomorrow 11am.
@ivy — confirm the revised reset milestones by EOD.
I'll send the external response once those two inputs are in.`,
    },
    annotations: [
      {
        title: 'Decision first',
        body: "The note opens with the call, so nobody has to infer the outcome from a politics summary.",
        color: 'gold',
      },
      {
        title: 'Tradeoff named explicitly',
        body: 'It says what the team is protecting and what the team is saying no to in the same breath.',
        color: 'sky',
      },
      {
        title: 'Next owners are clean',
        body: 'Each follow-up has an owner, an input, and a time. That keeps the recap operational.',
        color: 'mint',
      },
    ],
    skillDeltas: {
      ...emptyDeltas(),
      comms: 0.07,
      escal: 0.06,
      prio: 0.05,
      narr: 0.12,
    },
    rubric: [
      {
        id: 'decision',
        label: 'Open with the decision',
        pts: 20,
        detail: 'State what the room decided in the first beat.',
        evaluate: (_, lowerDraft) => ({ hit: /decision|we are not|we're not|we are holding|hold the/.test(lowerDraft) }),
      },
      {
        id: 'tradeoff',
        label: 'Name the tradeoff',
        pts: 18,
        detail: 'What are you protecting, and what loses?',
        evaluate: (_, lowerDraft) => ({ hit: /tradeoff|risk|capacity|slip|uptime|reliability/.test(lowerDraft) }),
      },
      {
        id: 'owners',
        label: 'Assign next owners',
        pts: 18,
        detail: 'A follow-up note should create motion, not just document history.',
        evaluate: (draft) => ({ hit: (draft.match(/@\w+/g) || []).length >= 2 }),
      },
      {
        id: 'clock',
        label: 'Set the timing',
        pts: 14,
        detail: 'Put a time box on the next inputs.',
        evaluate: (_, lowerDraft) => ({ hit: /tomorrow|eod|11am|today|by /.test(lowerDraft) }),
      },
      {
        id: 'unresolved',
        label: 'Capture what still needs input',
        pts: 14,
        detail: 'Name the open input instead of pretending the issue is fully closed.',
        evaluate: (_, lowerDraft) => ({ hit: /confirm|need|input|once those/.test(lowerDraft) }),
      },
      {
        id: 'restraint',
        label: 'Keep the tone neutral',
        pts: 16,
        detail: 'Do not relitigate personalities or blame.',
        evaluate: (_, lowerDraft) => ({ hit: !blamePattern.test(lowerDraft) && !/sales is wrong|eng is wrong/.test(lowerDraft) }),
      },
    ],
  },
  {
    id: 'cutline-01',
    laneId: '03',
    code: 'LANE 03',
    title: 'The Cutline',
    tag: 'PRIO',
    rail: '#6eaaff',
    diff: 'NORMAL',
    pressure: 'PLANNING · TIGHT',
    brief:
      'You have room for four bets in Q3. Nine asks are in flight. Finance wants the list tonight so they can close headcount planning.',
    quote: `"Please don't send me another list where everything is somehow tier 1."`,
    quoteAttribution: 'Finance partner',
    cues: [
      { color: 'sky', text: 'four slots, nine asks' },
      { color: 'gold', text: 'headcount plan closes tonight' },
      { color: 'hot', text: 'customer escalations are biasing the room' },
      { color: 'mint', text: 'retention goal is the actual company target' },
    ],
    objectiveTitle: 'Prioritization note',
    objectiveCopy: 'Under 180 words. Name the top four, the cuts, and the logic tying them to the quarter.',
    channelLabel: '#q3-planning · shortlist',
    chips: ['Prio doc', '≤180w', 'quarterly plan'],
    wordLimit: 180,
    defaultDraft: `Q3 cutline:

In: renewal API ceiling, invoice reliability, self-serve amendments, and usage anomaly alerts.

Out: custom exports, admin theming, seat-bundle experiments, and partner dashboard.

Why: the quarter goal is retention. The top four either reduce churn risk directly or unblock revenue already in pipeline.

Tradeoff: we are delaying visible surface-area work to protect core billing reliability.

I'll turn this into a staffing view after @maya confirms engineering sizing.`,
    coachHit: 'A good cutline sounds calm because it makes the no as legible as the yes.',
    coachMiss: 'If the list does not tie back to the quarter goal, it reads like opinion dressed up as prioritization.',
    seniorDraft: {
      name: 'Jordan K.',
      role: 'Director PM, Notion',
      grade: 'A',
      xp: 84,
      words: 132,
      body: `Q3 recommendation: fund four bets only.

In:
1. Renewal API ceiling
2. Invoice reliability
3. Self-serve amendments
4. Usage anomaly alerts

Out this quarter: custom exports, admin theming, seat-bundle experiments, partner dashboard, and anything else not directly tied to retention or booked revenue.

Logic: the company goal is retention. These four either prevent churn on committed renewals or protect billing reliability on existing revenue.

Tradeoff: we are saying no to polish and exploratory growth work to keep the quarter economically coherent.`,
    },
    annotations: [
      {
        title: 'The list is ranked',
        body: 'Ranked lists force clarity. Buckets hide tradeoffs.',
        color: 'sky',
      },
      {
        title: 'Out list is explicit',
        body: 'The strongest prioritization notes say no on the page instead of in hallway conversations later.',
        color: 'hot',
      },
      {
        title: 'Goal linkage is tight',
        body: 'Every in item is justified against the quarter goal, not against local team enthusiasm.',
        color: 'mint',
      },
    ],
    skillDeltas: {
      ...emptyDeltas(),
      comms: 0.06,
      prio: 0.14,
      disco: 0.03,
      narr: 0.02,
    },
    rubric: [
      {
        id: 'in-list',
        label: 'Name the top picks',
        pts: 18,
        detail: 'Put the in-list on the page.',
        evaluate: (_, lowerDraft) => ({ hit: /\bin:\b|1\.|2\.|3\.|4\./.test(lowerDraft) }),
      },
      {
        id: 'out-list',
        label: 'Name the cuts',
        pts: 18,
        detail: 'A cutline is not real until the out-list is visible.',
        evaluate: (_, lowerDraft) => ({ hit: /\bout:\b|out this quarter|delaying|saying no/.test(lowerDraft) }),
      },
      {
        id: 'goal',
        label: 'Tie to the quarter goal',
        pts: 20,
        detail: 'Explain why these bets serve the company objective.',
        evaluate: (_, lowerDraft) => ({ hit: /retention|goal|revenue|renewal|churn/.test(lowerDraft) }),
      },
      {
        id: 'tradeoff',
        label: 'Show the tradeoff',
        pts: 16,
        detail: 'Say what kind of work loses.',
        evaluate: (_, lowerDraft) => ({ hit: /tradeoff|delay|polish|exploratory|visible surface/.test(lowerDraft) }),
      },
      {
        id: 'ranking',
        label: 'Make the order legible',
        pts: 12,
        detail: 'Ranked or grouped, but clearly ordered.',
        evaluate: (_, lowerDraft) => ({ hit: /1\.|2\.|3\.|4\.|top four/.test(lowerDraft) }),
      },
      {
        id: 'next-step',
        label: 'Close with the next move',
        pts: 16,
        detail: 'Show how this turns into an operating plan.',
        evaluate: (_, lowerDraft) => ({ hit: /staffing|sizing|next|turn this into/.test(lowerDraft) }),
      },
    ],
  },
  {
    id: 'exec-01',
    laneId: '04',
    code: 'LANE 04',
    title: 'Loop the Boss',
    tag: 'EXEC',
    rail: '#c888ff',
    diff: 'HARD',
    pressure: 'EXEC · HIGH SIGNAL',
    brief:
      'A partner launch slipped after Legal changed the contract language. Your CEO wants the board-safe version before tonight’s update.',
    quote: `"Give me the version I can forward without a meeting."`,
    quoteAttribution: 'CEO',
    cues: [
      { color: 'orchid', text: 'CEO will forward this as written' },
      { color: 'hot', text: 'partner is already frustrated' },
      { color: 'gold', text: 'Legal is correct, but late' },
      { color: 'sky', text: 'board update goes out tonight' },
    ],
    objectiveTitle: 'Exec memo',
    objectiveCopy: 'Under 250 words. Say what changed, the impact, the decision, and the ask.',
    channelLabel: 'CEO forwardable memo',
    chips: ['Memo', '≤250w', 'exec'],
    wordLimit: 250,
    defaultDraft: `Decision: move the partner launch by two weeks and hold external dates until Legal confirms the revised language.

What changed: Legal flagged the reseller clause after the final review, which means the current contract cannot go out as drafted.

Impact: we miss the original launch date, but avoid shipping a deal structure we would have to unwind later.

Ask: approve the slip and let me align partner comms with @olivia and Legal by 4pm so you have a clean board update tonight.`,
    coachHit: 'Exec notes work when they lower the number of follow-up questions, not when they show how much context you have.',
    coachMiss: 'If the memo hides the decision or the ask, your CEO has to do the synthesis work themselves.',
    seniorDraft: {
      name: 'Elena R.',
      role: 'VP Product, Linear',
      grade: 'A',
      xp: 86,
      words: 128,
      body: `Decision: slip the partner launch two weeks. Do not re-commit externally until Legal clears the revised reseller language.

What changed: Legal caught a clause in final review that makes the current agreement unsafe to send.

Impact: we miss the original date, but the cost of a two-week slip is lower than signing into a structure we may need to unwind with the partner.

Ask: approve the slip. If yes, I will align partner comms with @olivia and Legal by 4pm and send you a board-safe update for tonight's packet.`,
    },
    annotations: [
      {
        title: 'Forwardable first line',
        body: 'The opening sentence already contains the decision and the constraint, which makes the memo relay-ready.',
        color: 'orchid',
      },
      {
        title: 'Impact without drama',
        body: 'It states the downside and the avoided downside without turning the note into a blame narrative.',
        color: 'gold',
      },
      {
        title: 'Single clear ask',
        body: 'Executives want to know what decision is being requested from them right now.',
        color: 'mint',
      },
    ],
    skillDeltas: {
      ...emptyDeltas(),
      comms: 0.11,
      escal: 0.08,
      narr: 0.08,
    },
    rubric: [
      {
        id: 'decision',
        label: 'Lead with the decision',
        pts: 20,
        detail: 'Put the decision in the first line.',
        evaluate: (_, lowerDraft) => ({ hit: /^decision:|slip the partner launch|move the partner launch/.test(lowerDraft) }),
      },
      {
        id: 'change',
        label: 'Explain what changed',
        pts: 16,
        detail: 'Name the fact that caused the update.',
        evaluate: (_, lowerDraft) => ({ hit: /what changed|legal|clause|final review/.test(lowerDraft) }),
      },
      {
        id: 'impact',
        label: 'State the business impact',
        pts: 18,
        detail: 'Say the cost of the decision or the avoided cost.',
        evaluate: (_, lowerDraft) => ({ hit: /impact|cost|partner|two-week|unwind|miss the original date/.test(lowerDraft) }),
      },
      {
        id: 'ask',
        label: 'Make the ask explicit',
        pts: 18,
        detail: 'Say what approval or input you need.',
        evaluate: (_, lowerDraft) => ({ hit: /ask:|approve|if yes/.test(lowerDraft) }),
      },
      {
        id: 'clock',
        label: 'Set the next clock',
        pts: 12,
        detail: 'Anchor the next move in time.',
        evaluate: (_, lowerDraft) => ({ hit: /4pm|tonight|today|by /.test(lowerDraft) }),
      },
      {
        id: 'restraint',
        label: 'Keep it board-safe',
        pts: 16,
        detail: 'No heat, no blame, no side quests.',
        evaluate: (_, lowerDraft) => ({ hit: !blamePattern.test(lowerDraft) }),
      },
    ],
  },
  {
    id: 'pressure-test-01',
    laneId: '05',
    code: 'LANE 05',
    title: 'Pressure-Test',
    tag: 'DISCOVERY',
    rail: '#5ef2b0',
    diff: 'BOSS',
    pressure: 'DISCOVERY · BOSS',
    brief:
      'Growth wants to launch AI invoice summaries next month. Everyone is excited, but no one has written down what would need to be true for this to work.',
    quote: `"Can we please validate this before we commit a quarter of roadmap to it?"`,
    quoteAttribution: 'Your eng manager',
    cues: [
      { color: 'mint', text: 'exec team is excited by the AI story' },
      { color: 'hot', text: 'accuracy risk could hit trust fast' },
      { color: 'gold', text: 'no customer evidence yet' },
      { color: 'sky', text: 'team needs a go/no-go frame this week' },
    ],
    objectiveTitle: 'Assumption list',
    objectiveCopy: 'Under 200 words. List the riskiest assumptions, how to test them, and what would kill the idea.',
    channelLabel: 'AI invoice summaries · pre-mortem',
    chips: ['Assumption list', '≤200w', 'discovery'],
    wordLimit: 200,
    defaultDraft: `Before we commit, here are the assumptions that matter:

1. Customers actually want summaries inside billing workflow, not in email.
2. Accuracy is high enough that finance teams trust the output.
3. Summaries reduce support load or invoice confusion in a measurable way.

Tests this week:
- 5 customer calls with examples
- offline eval on historical invoices
- smoke test in the invoice detail page

Kill condition: if accuracy is weak or users don't see value in-workflow, we should not fund a full quarter build.`,
    coachHit: 'Discovery reps matter because they slow the team down at exactly the right moment.',
    coachMiss: 'If you cannot name the kill condition, you are still selling the idea to yourself.',
    seniorDraft: {
      name: 'Rina P.',
      role: 'Principal PM, OpenAI',
      grade: 'S',
      xp: 92,
      words: 146,
      body: `Before funding AI invoice summaries, I want three assumptions tested:

1. Demand: finance users want summaries in the billing workflow, not in email or support docs.
2. Accuracy: the model is reliable enough on real invoice edge cases that trust doesn't collapse on first use.
3. Value: summaries reduce confusion, support volume, or time-to-understand enough to justify ongoing cost.

Proposed tests this week:
- 5 customer interviews using current invoice examples
- offline eval on historical invoices with a pass/fail bar
- concierge prototype in the invoice detail page

Kill the project if either demand is weak or accuracy fails the bar. If both pass, then scope an MVP.`,
    },
    annotations: [
      {
        title: 'Assumptions are ranked by risk',
        body: 'It starts with demand and trust, not with implementation details.',
        color: 'mint',
      },
      {
        title: 'Tests are concrete',
        body: 'Every test can happen this week. That keeps discovery from turning into theater.',
        color: 'sky',
      },
      {
        title: 'Kill condition is explicit',
        body: 'The best discovery notes make it clear what evidence would stop the team from building.',
        color: 'hot',
      },
    ],
    skillDeltas: {
      ...emptyDeltas(),
      disco: 0.18,
      prio: 0.05,
      narr: 0.04,
    },
    rubric: [
      {
        id: 'assumptions',
        label: 'Name the key assumptions',
        pts: 20,
        detail: 'Write the assumptions that would have to be true.',
        evaluate: (_, lowerDraft) => ({ hit: /assumption|1\.|2\.|3\.|would need to be true/.test(lowerDraft) }),
      },
      {
        id: 'demand',
        label: 'Cover demand and value',
        pts: 16,
        detail: 'Who wants this, and why would it matter?',
        evaluate: (_, lowerDraft) => ({ hit: /want|value|support|confusion|workflow/.test(lowerDraft) }),
      },
      {
        id: 'accuracy',
        label: 'Cover trust risk',
        pts: 16,
        detail: 'AI bets die on trust before they die on novelty.',
        evaluate: (_, lowerDraft) => ({ hit: /accuracy|reliable|trust|edge cases/.test(lowerDraft) }),
      },
      {
        id: 'tests',
        label: 'Propose concrete tests',
        pts: 20,
        detail: 'List tests the team can actually run now.',
        evaluate: (_, lowerDraft) => ({ hit: /customer|interview|call|offline eval|prototype|smoke test/.test(lowerDraft) }),
      },
      {
        id: 'kill',
        label: 'State the kill condition',
        pts: 16,
        detail: 'What result would make you stop?',
        evaluate: (_, lowerDraft) => ({ hit: /kill condition|if .* we should not|stop|do not fund/.test(lowerDraft) }),
      },
      {
        id: 'next-step',
        label: 'Close with a decision path',
        pts: 12,
        detail: 'Say what happens if the tests pass.',
        evaluate: (_, lowerDraft) => ({ hit: /if both pass|if yes|then scope|go\/no-go/.test(lowerDraft) }),
      },
    ],
  },
  {
    id: 'bad-news-02',
    laneId: '01',
    code: 'LANE 01',
    title: 'Bad-News Update',
    tag: 'ESCALATION',
    rail: '#ff5b3a',
    diff: 'HARD',
    pressure: 'RELIABILITY · HOT',
    brief:
      'A billing import job corrupted invoice totals for 14 customers. Support found it first. Sales is asking whether they can tell accounts this is contained.',
    quote: `"Please give us the customer-safe answer before the AMs start improvising."`,
    quoteAttribution: 'Head of Support',
    cues: [
      { color: 'hot', text: '14 customers have visible invoice errors' },
      { color: 'gold', text: 'root cause is still under investigation' },
      { color: 'sky', text: 'AMs need the same language' },
      { color: 'mint', text: 'finance needs correction timing' },
    ],
    objectiveTitle: 'Internal Slack post',
    objectiveCopy: 'Under 130 words. Say what happened, what is known, what is not known, and the next customer-safe update.',
    channelLabel: '#billing-war-room · draft',
    chips: ['Slack', '<=130w', 'incident'],
    wordLimit: 130,
    defaultDraft: `Rec: hold customer replies until we confirm the correction window, but give AMs one safe line now.

Known: 14 customers have incorrect invoice totals from the import job.

Unknown: whether any downstream reporting copied the bad totals.

Next: @nina owns root cause by 1pm, @omar owns customer list, and I will send the AM-safe update by 2pm.`,
    coachHit: 'The draft separates knowns from unknowns. That keeps the team honest without freezing customer communication.',
    coachMiss: 'This kind of update needs a safe external line and a clock. Otherwise every team writes its own version.',
    seniorDraft: {
      name: 'Maya L.',
      role: 'Senior PM, Stripe',
      grade: 'A',
      xp: 90,
      words: 105,
      body: `Rec: do not let AMs send custom replies yet. Use one holding line until we confirm correction timing.

Known: 14 customers have incorrect invoice totals from the import job.

Unknown: whether reporting or exports copied those totals.

Customer-safe line: "We found an invoice display issue affecting a small set of accounts and are validating corrections now."

Need: @nina root cause by 1pm, @omar customer list by 1:30, I will send final AM language by 2pm.`,
    },
    annotations: [
      { title: 'Known vs unknown', body: 'The note is transparent without overstating certainty.', color: 'gold' },
      { title: 'Customer-safe language', body: 'It gives the field a line they can use without inventing detail.', color: 'mint' },
      { title: 'Owners and clock', body: 'Every next input has a person and a time.', color: 'sky' },
    ],
    skillDeltas: {
      ...emptyDeltas(),
      comms: 0.1,
      escal: 0.12,
      narr: 0.04,
    },
    rubric: [
      {
        id: 'rec',
        label: 'Lead with the recommendation',
        pts: 18,
        detail: 'Tell the room what to do first.',
        evaluate: (_, lowerDraft) => ({ hit: /^rec|recommend|do not|hold customer/.test(lowerDraft.trim()) }),
      },
      {
        id: 'known',
        label: 'Separate knowns',
        pts: 14,
        detail: 'Say what is confirmed.',
        evaluate: (_, lowerDraft) => ({ hit: /known|confirmed|14 customers|incorrect invoice/.test(lowerDraft) }),
      },
      {
        id: 'unknown',
        label: 'Separate unknowns',
        pts: 14,
        detail: 'Say what is still being checked.',
        evaluate: (_, lowerDraft) => ({ hit: /unknown|still|investigat|validat|whether/.test(lowerDraft) }),
      },
      {
        id: 'safe-line',
        label: 'Give a customer-safe line',
        pts: 18,
        detail: 'Prevent every GTM team from writing its own version.',
        evaluate: (_, lowerDraft) => ({ hit: /customer-safe|safe line|holding line|tell customers|external/.test(lowerDraft) }),
      },
      {
        id: 'owners',
        label: 'Name owners',
        pts: 18,
        detail: 'Pull the people who own the next inputs.',
        evaluate: (draft) => ({ hit: (draft.match(/@\w+/g) || []).length >= 2 }),
      },
      {
        id: 'clock',
        label: 'Set a clock',
        pts: 18,
        detail: 'Say when the next update lands.',
        evaluate: (_, lowerDraft) => ({ hit: /1pm|1:30|2pm|by /.test(lowerDraft) }),
      },
    ],
  },
  {
    id: 'room-02',
    laneId: '02',
    code: 'LANE 02',
    title: 'Navigate the Room',
    tag: 'POLITICS',
    rail: '#ffc53a',
    diff: 'HARD',
    pressure: 'STAFF · TENSE',
    brief:
      'In staff, Design says the checkout redesign is not ready. Growth says delaying will miss the experiment window. Your VP asks you to send the decision note.',
    quote: `"I need this to not become Design versus Growth."`,
    quoteAttribution: 'VP Product',
    cues: [
      { color: 'gold', text: 'both teams have valid constraints' },
      { color: 'hot', text: 'experiment window closes next week' },
      { color: 'sky', text: 'design risk is customer trust' },
      { color: 'orchid', text: 'VP wants one accountable call' },
    ],
    objectiveTitle: 'Decision recap',
    objectiveCopy: 'Under 170 words. Make the decision, rationale, dissent, and next check explicit.',
    channelLabel: '#checkout-staff · decision note',
    chips: ['Decision note', '<=170w', 'staff'],
    wordLimit: 170,
    defaultDraft: `Decision: ship the checkout experiment only to 10% traffic next week, not the full ramp.

Why: Growth keeps the learning window, Design limits trust risk while the remaining states are cleaned up.

Dissent: Design still believes the error states need more polish before broad exposure.

Next: @leo owns final design QA by Tuesday, @anika owns ramp guardrails, and I will bring the 10% readout back Friday.`,
    coachHit: 'This keeps the room out of team-vs-team mode by naming the tradeoff and the dissent.',
    coachMiss: 'A political recap must protect both the decision and the people who disagreed.',
    seniorDraft: {
      name: 'Priya S.',
      role: 'Senior PM, Airbnb',
      grade: 'A',
      xp: 91,
      words: 116,
      body: `Decision: run the checkout experiment at 10% traffic next week. Do not start the full ramp yet.

Rationale: Growth preserves the experiment window, while Design gets guardrails around the unfinished error states.

Dissent: Design is not comfortable with broad exposure until the error states are cleaned up. I agree with limiting ramp for that reason.

Next: @leo completes design QA by Tuesday, @anika confirms ramp guardrails by Wednesday, and I will bring the 10% readout to staff Friday.`,
    },
    annotations: [
      { title: 'Dissent is preserved', body: 'The note does not erase disagreement; it makes it manageable.', color: 'orchid' },
      { title: 'Partial ramp solves both constraints', body: 'The decision is a product call, not a compromise for its own sake.', color: 'sky' },
      { title: 'Next review is explicit', body: 'The room knows when the decision will be revisited.', color: 'mint' },
    ],
    skillDeltas: {
      ...emptyDeltas(),
      comms: 0.07,
      prio: 0.06,
      narr: 0.13,
    },
    rubric: [
      {
        id: 'decision',
        label: 'State the decision',
        pts: 20,
        detail: 'Open with the call.',
        evaluate: (_, lowerDraft) => ({ hit: /^decision|ship|run the checkout/.test(lowerDraft.trim()) }),
      },
      {
        id: 'rationale',
        label: 'Give the rationale',
        pts: 16,
        detail: 'Explain why this call beats the alternatives.',
        evaluate: (_, lowerDraft) => ({ hit: /why|rationale|because|preserves|limits/.test(lowerDraft) }),
      },
      {
        id: 'dissent',
        label: 'Name dissent cleanly',
        pts: 16,
        detail: 'Protect the disagreement without relitigating it.',
        evaluate: (_, lowerDraft) => ({ hit: /dissent|design still|not comfortable|disagree/.test(lowerDraft) }),
      },
      {
        id: 'guardrails',
        label: 'Use guardrails',
        pts: 14,
        detail: 'A partial decision needs limits.',
        evaluate: (_, lowerDraft) => ({ hit: /10%|guardrail|ramp|traffic/.test(lowerDraft) }),
      },
      {
        id: 'owners',
        label: 'Assign owners',
        pts: 18,
        detail: 'Name who owns the next inputs.',
        evaluate: (draft) => ({ hit: (draft.match(/@\w+/g) || []).length >= 2 }),
      },
      {
        id: 'review',
        label: 'Set the review point',
        pts: 16,
        detail: 'Say when the room learns again.',
        evaluate: (_, lowerDraft) => ({ hit: /friday|readout|next week|by /.test(lowerDraft) }),
      },
    ],
  },
  {
    id: 'cutline-02',
    laneId: '03',
    code: 'LANE 03',
    title: 'The Cutline',
    tag: 'PRIO',
    rail: '#6eaaff',
    diff: 'NORMAL',
    pressure: 'ROADMAP · CROWDING',
    brief:
      'Support, Sales, and Data all want Q4 work. You have one team and two open slots. Leadership asked for the cutline before planning lock.',
    quote: `"The list is fine. I need the why."`,
    quoteAttribution: 'Chief Product Officer',
    cues: [
      { color: 'sky', text: 'two slots, six asks' },
      { color: 'gold', text: 'support volume is measurable' },
      { color: 'hot', text: 'sales has the loudest customer' },
      { color: 'mint', text: 'data platform work is invisible but compounding' },
    ],
    objectiveTitle: 'Cutline memo',
    objectiveCopy: 'Under 190 words. Pick two, cut four, and explain the principle.',
    channelLabel: '#q4-planning · cutline',
    chips: ['Cutline', '<=190w', 'planning'],
    wordLimit: 190,
    defaultDraft: `Q4 cutline: fund support deflection and data quality, cut custom exports, audit dashboard, CSV redesign, and admin themes.

Principle: choose work that reduces repeated operational drag, not the loudest single-account ask.

Why these two: support deflection lowers weekly ticket volume; data quality reduces every downstream reporting escalation.

Tradeoff: we are saying no to visible UI polish and bespoke sales asks this quarter.

Next: I will send the staffing version after @nina confirms data sizing.`,
    coachHit: 'The principle is doing real work here. It explains the no-list without turning the memo into politics.',
    coachMiss: 'A cutline without a principle is just a preference list with better formatting.',
    seniorDraft: {
      name: 'Jordan K.',
      role: 'Director PM, Notion',
      grade: 'A',
      xp: 87,
      words: 123,
      body: `Recommendation: fund two Q4 bets: support deflection and data quality.

Cut: custom exports, audit dashboard, CSV redesign, and admin themes.

Principle: prioritize work that removes repeated operational drag over work tied to one loud account or surface polish.

Why: support deflection reduces weekly ticket volume; data quality reduces downstream reporting escalations across every customer segment.

Tradeoff: we are delaying visible UI improvements and bespoke sales asks.

Next: @nina confirms data sizing by tomorrow, then I will send the staffing view for planning lock.`,
    },
    annotations: [
      { title: 'Principle over politics', body: 'The memo gives leadership a reusable decision rule.', color: 'sky' },
      { title: 'No-list is specific', body: 'The cut work is named directly, so there is less room for drift.', color: 'hot' },
      { title: 'Metric direction is clear', body: 'The selected work maps to support volume and escalation reduction.', color: 'mint' },
    ],
    skillDeltas: {
      ...emptyDeltas(),
      comms: 0.05,
      prio: 0.16,
      narr: 0.04,
    },
    rubric: [
      {
        id: 'recommendation',
        label: 'Lead with the cutline',
        pts: 18,
        detail: 'Say what is in and out.',
        evaluate: (_, lowerDraft) => ({ hit: /recommendation|cutline|fund|in:|cut:/.test(lowerDraft) }),
      },
      {
        id: 'principle',
        label: 'State the principle',
        pts: 20,
        detail: 'Explain the rule behind the list.',
        evaluate: (_, lowerDraft) => ({ hit: /principle|prioritize|choose work|decision rule/.test(lowerDraft) }),
      },
      {
        id: 'cuts',
        label: 'Name the cuts',
        pts: 16,
        detail: 'The no-list must be visible.',
        evaluate: (_, lowerDraft) => ({ hit: /cut|out|saying no|delaying/.test(lowerDraft) }),
      },
      {
        id: 'why',
        label: 'Explain why these win',
        pts: 18,
        detail: 'Tie the in-list to measurable leverage.',
        evaluate: (_, lowerDraft) => ({ hit: /support volume|ticket|data quality|reporting|operational drag/.test(lowerDraft) }),
      },
      {
        id: 'tradeoff',
        label: 'Name the tradeoff',
        pts: 14,
        detail: 'Say what kind of value is being delayed.',
        evaluate: (_, lowerDraft) => ({ hit: /tradeoff|delaying|ui|sales|polish|bespoke/.test(lowerDraft) }),
      },
      {
        id: 'next',
        label: 'Close with next step',
        pts: 14,
        detail: 'Turn the cutline into a plan.',
        evaluate: (_, lowerDraft) => ({ hit: /staffing|sizing|planning lock|by tomorrow/.test(lowerDraft) }),
      },
    ],
  },
  {
    id: 'exec-02',
    laneId: '04',
    code: 'LANE 04',
    title: 'Loop the Boss',
    tag: 'EXEC',
    rail: '#c888ff',
    diff: 'HARD',
    pressure: 'EXEC · FORWARDABLE',
    brief:
      'A launch KPI is missing by 35%. The team has a plausible fix, but it requires delaying the next planned feature by one week.',
    quote: `"Give me the version that says whether this is a wobble or a strategy change."`,
    quoteAttribution: 'CEO',
    cues: [
      { color: 'orchid', text: 'CEO wants board-forwardable clarity' },
      { color: 'hot', text: 'KPI miss is visible' },
      { color: 'gold', text: 'fix costs one week of roadmap' },
      { color: 'sky', text: 'team needs permission to pause feature work' },
    ],
    objectiveTitle: 'Exec memo',
    objectiveCopy: 'Under 240 words. Say what happened, whether strategy changes, and what decision you need.',
    channelLabel: 'CEO update · forwardable',
    chips: ['Memo', '<=240w', 'exec'],
    wordLimit: 240,
    defaultDraft: `Decision: keep the launch strategy, but pause the next feature for one week to fix activation.

What happened: the launch KPI is 35% below target. The issue appears concentrated in setup completion, not top-of-funnel demand.

Impact: this is a wobble in execution, not a strategy change yet.

Ask: approve the one-week pause so the team can ship the setup fix and bring a KPI readout next Friday.`,
    coachHit: 'The memo answers the executive question directly: wobble, not strategy change.',
    coachMiss: 'Execs need the interpretation, not just the metric. Say what the miss means and what decision it requires.',
    seniorDraft: {
      name: 'Elena R.',
      role: 'VP Product, Linear',
      grade: 'A',
      xp: 89,
      words: 110,
      body: `Recommendation: keep the launch strategy, but pause the next feature for one week to fix activation.

What happened: launch KPI is 35% below target. The miss is concentrated in setup completion, not demand.

Interpretation: this looks like an execution wobble, not evidence that the strategy is wrong.

Tradeoff: we lose one week on the next feature to protect the launch motion we already funded.

Ask: approve the pause. I will send a setup-fix plan tomorrow and a KPI readout next Friday.`,
    },
    annotations: [
      { title: 'Interpretation included', body: 'The note tells the CEO what the miss means.', color: 'orchid' },
      { title: 'Strategy is separated from execution', body: 'That distinction prevents overreaction.', color: 'sky' },
      { title: 'Ask is explicit', body: 'The team needs permission to pause, and the memo says so.', color: 'mint' },
    ],
    skillDeltas: {
      ...emptyDeltas(),
      comms: 0.12,
      escal: 0.06,
      prio: 0.05,
      narr: 0.08,
    },
    rubric: [
      {
        id: 'rec',
        label: 'Lead with recommendation',
        pts: 20,
        detail: 'Say the executive decision first.',
        evaluate: (_, lowerDraft) => ({ hit: /recommendation|decision|keep the launch|pause/.test(lowerDraft) }),
      },
      {
        id: 'metric',
        label: 'Name the metric miss',
        pts: 14,
        detail: 'Quantify what changed.',
        evaluate: (_, lowerDraft) => ({ hit: /35%|kpi|below target|miss/.test(lowerDraft) }),
      },
      {
        id: 'interpretation',
        label: 'Interpret the signal',
        pts: 18,
        detail: 'Say whether this changes strategy.',
        evaluate: (_, lowerDraft) => ({ hit: /wobble|strategy|execution|not evidence/.test(lowerDraft) }),
      },
      {
        id: 'tradeoff',
        label: 'Name the tradeoff',
        pts: 16,
        detail: 'Say what the fix costs.',
        evaluate: (_, lowerDraft) => ({ hit: /tradeoff|one week|pause|lose/.test(lowerDraft) }),
      },
      {
        id: 'ask',
        label: 'Make the ask',
        pts: 16,
        detail: 'Say what approval you need.',
        evaluate: (_, lowerDraft) => ({ hit: /ask|approve|permission/.test(lowerDraft) }),
      },
      {
        id: 'next',
        label: 'Set the next update',
        pts: 16,
        detail: 'Tell the reader when they will see the next readout.',
        evaluate: (_, lowerDraft) => ({ hit: /tomorrow|next friday|readout|by /.test(lowerDraft) }),
      },
    ],
  },
  {
    id: 'pressure-test-02',
    laneId: '05',
    code: 'LANE 05',
    title: 'Pressure-Test',
    tag: 'DISCOVERY',
    rail: '#5ef2b0',
    diff: 'BOSS',
    pressure: 'DISCOVERY · RISKY',
    brief:
      'The team wants to build a self-serve migration wizard. The pitch is strong, but support says edge cases drive most migration pain.',
    quote: `"I am not convinced the happy path is where the value is."`,
    quoteAttribution: 'Support lead',
    cues: [
      { color: 'mint', text: 'self-serve story is attractive' },
      { color: 'hot', text: 'edge cases may dominate value' },
      { color: 'gold', text: 'support has qualitative evidence' },
      { color: 'sky', text: 'team wants a go/no-go by Friday' },
    ],
    objectiveTitle: 'Assumption list',
    objectiveCopy: 'Under 210 words. Identify the riskiest assumptions, tests, and kill criteria.',
    channelLabel: 'migration wizard · pre-mortem',
    chips: ['Assumption list', '<=210w', 'discovery'],
    wordLimit: 210,
    defaultDraft: `Riskiest assumptions before we fund the migration wizard:

1. Most migration pain is in repeatable happy-path steps, not rare edge cases.
2. Customers trust self-serve guidance for a workflow that can break billing.
3. Support load drops enough to justify the build.

Tests by Friday:
- classify last 50 migration tickets by happy path vs edge case
- interview 5 customers who recently migrated
- concierge the wizard flow for 3 accounts

Kill condition: if edge cases dominate or customers still want human review, do not fund the full build.`,
    coachHit: 'The draft challenges the attractive product story with the right evidence question.',
    coachMiss: 'Discovery has to say what would kill the idea. Otherwise it is just pre-sales for the roadmap.',
    seniorDraft: {
      name: 'Rina P.',
      role: 'Principal PM, OpenAI',
      grade: 'S',
      xp: 94,
      words: 143,
      body: `Before funding the migration wizard, test three assumptions:

1. Pain location: most migration pain sits in repeatable happy-path steps, not long-tail edge cases.
2. Trust: customers are willing to follow self-serve guidance for a workflow that can affect billing.
3. Value: the wizard reduces support load enough to justify build and maintenance cost.

Tests this week:
- classify the last 50 migration tickets by happy path vs edge case
- interview 5 recently migrated customers
- concierge the wizard flow for 3 accounts

Kill the project if edge cases drive most pain or customers still require human review. If both pass, scope an MVP around the repeatable steps only.`,
    },
    annotations: [
      { title: 'Happy path is challenged', body: 'The draft tests whether the nice product story is where the real value sits.', color: 'mint' },
      { title: 'Evidence is immediate', body: 'Ticket classification and concierge testing can happen this week.', color: 'sky' },
      { title: 'Scope follows evidence', body: 'The MVP is constrained to the repeatable steps only if the assumptions pass.', color: 'gold' },
    ],
    skillDeltas: {
      ...emptyDeltas(),
      disco: 0.2,
      prio: 0.05,
      narr: 0.03,
    },
    rubric: [
      {
        id: 'assumptions',
        label: 'Name assumptions',
        pts: 18,
        detail: 'Say what must be true.',
        evaluate: (_, lowerDraft) => ({ hit: /assumption|1\.|2\.|3\.|must be true/.test(lowerDraft) }),
      },
      {
        id: 'edge-cases',
        label: 'Test the edge-case risk',
        pts: 18,
        detail: 'Do not assume the happy path contains the value.',
        evaluate: (_, lowerDraft) => ({ hit: /edge case|happy path|long-tail|rare/.test(lowerDraft) }),
      },
      {
        id: 'trust',
        label: 'Cover customer trust',
        pts: 14,
        detail: 'Migration workflows need trust, not just usability.',
        evaluate: (_, lowerDraft) => ({ hit: /trust|human review|billing|confidence/.test(lowerDraft) }),
      },
      {
        id: 'tests',
        label: 'Propose tests',
        pts: 20,
        detail: 'List concrete validation steps.',
        evaluate: (_, lowerDraft) => ({ hit: /classify|tickets|interview|concierge|test/.test(lowerDraft) }),
      },
      {
        id: 'kill',
        label: 'Set kill criteria',
        pts: 18,
        detail: 'Say what evidence stops the work.',
        evaluate: (_, lowerDraft) => ({ hit: /kill|do not fund|if .* dominate|stop/.test(lowerDraft) }),
      },
      {
        id: 'scope',
        label: 'Tie evidence to scope',
        pts: 12,
        detail: 'Say how the result changes the MVP.',
        evaluate: (_, lowerDraft) => ({ hit: /mvp|scope|repeatable steps|if both pass/.test(lowerDraft) }),
      },
    ],
  },
]

export const ALL_SCENARIOS: Scenario[] = [...SCENARIOS, ...EXTRA_SCENARIOS]

export const SCENARIOS_BY_LANE = ALL_SCENARIOS.reduce<Record<string, Scenario[]>>((accumulator, scenario) => {
  accumulator[scenario.laneId] = accumulator[scenario.laneId] || []
  accumulator[scenario.laneId].push(scenario)
  return accumulator
}, {})
