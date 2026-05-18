import { createLaneScenarios } from '../scenarioFactory'

export const EXEC_EXTRA_SCENARIOS = createLaneScenarios(
  {
    laneId: '04',
    code: 'LANE 04',
    title: 'Loop the Boss',
    tag: 'EXEC',
    rail: '#c888ff',
    diff: 'HARD',
    pressure: 'EXEC · FORWARDABLE',
    objectiveTitle: 'Exec memo',
    objectiveCopy: 'Under 250 words. Front-load the decision, impact, tradeoff, and ask so the note can be forwarded.',
    wordLimit: 250,
    skillDeltas: {
      comms: 0.13,
      escal: 0.04,
      prio: 0.04,
      disco: 0.02,
      narr: 0.11,
    },
    coachHit: 'Exec updates work when the reader can forward the first line and the team can act from the last line.',
    coachMiss: 'If the note buries the call, hides the tradeoff, or ends with "thoughts?", the executive has to do the PM job.',
    seniorName: 'Nadia S.',
    seniorRole: 'VP Product, Atlassian',
    focusPrinciple: 'front-load',
    emphasis: 'exec',
  },
  [
    {
      id: 'exec-03',
      brief:
        'The CEO dashboard is overstating active customers because trial workspaces are counted as paid. The CEO wants to know whether to hold the Monday leadership readout.',
      quote: `"Can I use the dashboard in staff, or do we need to pull it?"`,
      quoteAttribution: 'CEO',
      channelLabel: 'CEO dashboard update',
      chips: ['CEO update', 'Metric risk', 'Exec'],
      defaultDraft: `Recommendation: hold the dashboard slide for Monday until Finance signs off on the active-customer definition.

What changed: we found trial workspaces are being counted as paid active customers, which inflates the metric by 12%.

Impact: the product trend still looks positive, but the current number is not safe for the leadership readout.

Ask: approve pulling the slide today. I will send a corrected metric and source note with @finance by Monday 10am.`,
      seniorDraft: `Recommendation: pull the active-customer slide from Monday staff until Finance signs off on the paid definition.

What changed: trial workspaces are currently counted as paid active customers, inflating the metric by 12%.

Impact: the product trend still appears positive, but the current number would overstate customer traction if forwarded.

Tradeoff: we lose a clean proof point in Monday's deck to protect metric credibility.

Ask: approve the pull today. I will send the corrected metric, owner, and source note with @finance by Monday 10am.`,
      annotations: [
        {
          title: 'Forwardable answer first',
          body: 'The senior draft gives the CEO the usable call before explaining the metric bug.',
          color: 'orchid',
        },
        {
          title: 'Integrity over optics',
          body: 'It protects the product narrative while making the metric credibility risk explicit.',
          color: 'sky',
        },
        {
          title: 'Ask has timing',
          body: 'The ask names the approval, replacement artifact, owner path, and Monday deadline.',
          color: 'mint',
        },
      ],
      cues: [
        { color: 'orchid', text: 'CEO needs a usable line' },
        { color: 'hot', text: 'metric is inflated by 12%' },
        { color: 'gold', text: 'leadership readout is Monday' },
      ],
    },
    {
      id: 'exec-04',
      brief:
        'A board packet claims the enterprise expansion motion is on track, but two lighthouse customers pushed implementation from May to July after security review delays.',
      quote: `"Give me the board-safe version, not the rosy version."`,
      quoteAttribution: 'CEO',
      channelLabel: 'Board packet note',
      chips: ['Board note', 'Enterprise', 'Narrative'],
      defaultDraft: `Update: the enterprise expansion motion is still viable, but the May proof point is no longer board-safe.

Two lighthouse customers moved implementation to July after security reviews took longer than planned.

Impact: Q2 expansion ARR risk is now $1.8M unless we close two smaller accounts or reset the board language.

Ask: approve changing the packet from "on track" to "demand validated, security cycle extends time-to-value" by EOD.`,
      seniorDraft: `Recommendation: revise the board packet line to "demand is validated, but security review is extending time-to-value."

What changed: two lighthouse customers moved implementation from May to July after security review delays.

Impact: the enterprise thesis is intact, but the May proof point is no longer board-safe and $1.8M of Q2 expansion ARR is now timing risk.

Tradeoff: the revised line is less celebratory, but it avoids defending an "on track" claim if May installs miss.

Ask: approve the wording by EOD. I will update the packet and attach the July recovery plan.`,
      annotations: [
        {
          title: 'Board language is precise',
          body: 'The senior draft supplies the exact sentence the CEO can forward without softening the risk.',
          color: 'orchid',
        },
        {
          title: 'Thesis and timing split',
          body: 'It separates demand validation from implementation timing so the board line stays credible.',
          color: 'gold',
        },
        {
          title: 'Risk is quantified',
          body: 'The $1.8M timing risk makes the downside specific instead of sounding like generic caution.',
          color: 'sky',
        },
      ],
      cues: [
        { color: 'orchid', text: 'board packet needs exact wording' },
        { color: 'hot', text: '$1.8M Q2 timing risk' },
        { color: 'mint', text: 'CEO approval needed by EOD' },
      ],
    },
    {
      id: 'exec-05',
      brief:
        'The Sales VP wants Product to approve a custom packaging exception for a strategic deal. The exception would create support commitments the roadmap cannot absorb.',
      quote: `"Should I back Sales here or hold the line?"`,
      quoteAttribution: 'COO',
      channelLabel: 'VP escalation',
      chips: ['VP escalation', 'Packaging', 'Tradeoff'],
      defaultDraft: `Recommendation: hold the packaging line for this deal.

The requested exception creates a custom support commitment for 1 customer that we cannot operationalize across the next 20 enterprise deals.

Impact: saying yes may help this quarter, but it creates a support and roadmap liability.

Ask: approve a narrower offer by 3pm: standard enterprise package, 60-day implementation support, and no custom SLA.`,
      seniorDraft: `Recommendation: hold the packaging line and offer one concession: standard enterprise package plus 60 days of implementation support.

What changed: Sales wants a custom support SLA for one strategic deal, but Product and Support cannot make that promise repeatable across the next 20 enterprise accounts.

Impact: approving the exception may help this quarter's close, but would make custom packaging the expected escalation path.

Tradeoff: we risk losing or delaying this deal to protect support capacity and roadmap predictability.

Ask: approve the narrower offer by 3pm. I will align Sales, Support, and Legal on the external line today.`,
      annotations: [
        {
          title: 'Clear escalation answer',
          body: 'The senior draft answers the COO first and gives Sales a usable alternative in the same line.',
          color: 'orchid',
        },
        {
          title: 'Deal versus system',
          body: 'It shows why the executive call is not this deal alone, but the precedent for the next 20.',
          color: 'gold',
        },
        {
          title: 'Alternative included',
          body: 'The no is restrained because it includes a narrower offer, timing, and cross-functional follow-through.',
          color: 'mint',
        },
      ],
      cues: [
        { color: 'hot', text: 'strategic deal pressure' },
        { color: 'gold', text: 'custom SLA would repeat badly' },
        { color: 'sky', text: 'COO wants a call' },
      ],
    },
    {
      id: 'exec-06',
      brief:
        'Six weeks after pushing a self-serve expansion strategy, the data shows regulated customers are converting only when Sales assists procurement and security.',
      quote: `"Is this a strategy reversal or a segment correction?"`,
      quoteAttribution: 'CEO',
      channelLabel: 'Strategy reversal memo',
      chips: ['Strategy', 'Reversal', 'Segment'],
      defaultDraft: `Recommendation: reverse the self-serve push for regulated customers, but keep it for commercial accounts.

Data: regulated accounts convert at 4% self-serve versus 18% when Sales assists procurement and security.

Impact: this is a segment correction, not a full strategy failure.

Ask: approve shifting regulated expansion back to sales-assisted by Friday while we keep the self-serve tests running for commercial.`,
      seniorDraft: `Recommendation: treat regulated self-serve as a segment correction, not a company-wide strategy reversal.

What changed: regulated customers convert at 4% through self-serve versus 18% when Sales supports procurement and security review.

Impact: the self-serve motion still fits commercial accounts, but it is slowing the regulated segment we expected to expand in Q2.

Tradeoff: moving regulated expansion back to sales-assisted raises GTM cost, but protects higher-value deals from stalling.

Ask: approve the segment split by Friday. I will update the Q2 operating plan and bring a 30-day readout.`,
      annotations: [
        {
          title: 'Names the reversal type',
          body: 'The senior draft gives the CEO the interpretation to repeat: segment correction, not strategy failure.',
          color: 'orchid',
        },
        {
          title: 'Evidence drives the call',
          body: 'The 4% versus 18% contrast explains why the operating model should change.',
          color: 'sky',
        },
        {
          title: 'Cost is visible',
          body: 'It earns trust by naming the GTM cost before the exec has to drag it out.',
          color: 'gold',
        },
      ],
      cues: [
        { color: 'orchid', text: 'CEO is testing interpretation' },
        { color: 'hot', text: 'regulated conversion is 4%' },
        { color: 'mint', text: 'operating plan changes Friday' },
      ],
    },
    {
      id: 'exec-07',
      brief:
        'A mobile launch is scheduled for Thursday, but the latest build has a crash in the onboarding flow for 9% of new Android users.',
      quote: `"Do we ship and patch, or slip?"`,
      quoteAttribution: 'CEO',
      channelLabel: 'Launch slip update',
      chips: ['Launch slip', 'Mobile', 'Risk'],
      defaultDraft: `Decision: slip the mobile launch one week.

Reason: the latest Android build crashes for 9% of new users during onboarding.

Impact: shipping Thursday would create a visible failure in the first-run experience and likely increase support tickets.

Ask: approve moving launch to next Thursday. I will send the revised launch note and crash fix owner by 5pm today.`,
      seniorDraft: `Recommendation: slip the mobile launch one week rather than ship Thursday and patch.

What changed: the latest Android build crashes for 9% of new users during onboarding.

Impact: shipping would create a visible first-run failure and likely turn launch week into support and app-store cleanup.

Tradeoff: we give up one week of launch momentum to protect trust in the onboarding experience.

Ask: approve the slip by 5pm today. I will publish the revised launch plan, fix owner, and next Thursday go/no-go check.`,
      annotations: [
        {
          title: 'Ship-or-slip answered',
          body: 'The senior draft turns a bug report into the launch call the CEO asked for.',
          color: 'orchid',
        },
        {
          title: 'Impact is user-facing',
          body: 'It explains why 9% crash risk matters to customers, Support, and app-store perception.',
          color: 'hot',
        },
        {
          title: 'Recovery path included',
          body: 'The ask pairs the slip with owner, date, and go/no-go mechanics so the delay is controlled.',
          color: 'mint',
        },
      ],
      cues: [
        { color: 'hot', text: '9% Android onboarding crash' },
        { color: 'gold', text: 'Thursday launch pressure' },
        { color: 'sky', text: 'exec wants ship-or-slip call' },
      ],
    },
    {
      id: 'exec-08',
      brief:
        'A pricing experiment increased ARPA by 7%, but downgrade requests doubled among accounts with fewer than 50 employees.',
      quote: `"Is this a good price signal or a churn warning?"`,
      quoteAttribution: 'CFO',
      channelLabel: 'Pricing risk memo',
      chips: ['Pricing', 'Churn risk', 'CFO'],
      defaultDraft: `Recommendation: keep the pricing change for 50+ employee accounts, but pause rollout below 50 employees.

The experiment lifted ARPA 7%, but downgrade requests doubled in the smaller-account segment.

Impact: the price signal is positive upmarket and risky downmarket.

Ask: approve segmenting the rollout by tomorrow so Finance can model revenue without assuming broad adoption.`,
      seniorDraft: `Recommendation: segment the pricing rollout: keep the new price for 50+ employee accounts and pause below 50.

What changed: ARPA increased 7%, but downgrade requests doubled in the smaller-account segment.

Impact: the signal supports upmarket willingness-to-pay and warns of downmarket churn risk.

Tradeoff: segmenting lowers near-term headline revenue versus broad rollout, but avoids forcing churn in accounts with weaker willingness-to-pay.

Ask: approve the segmented rollout by tomorrow. I will send Finance the revised revenue model and downgrade monitoring plan.`,
      annotations: [
        {
          title: 'Signal is interpreted',
          body: 'The senior draft answers the CFO question directly: upmarket signal, downmarket churn warning.',
          color: 'orchid',
        },
        {
          title: 'Segmented recommendation',
          body: 'It avoids the false binary of full rollout versus full rollback.',
          color: 'sky',
        },
        {
          title: 'Revenue tradeoff named',
          body: 'It names the revenue cost of segmentation, which makes the recommendation board-safe.',
          color: 'gold',
        },
      ],
      cues: [
        { color: 'hot', text: 'downgrades doubled' },
        { color: 'gold', text: 'ARPA is up 7%' },
        { color: 'mint', text: 'Finance needs model inputs' },
      ],
    },
    {
      id: 'exec-09',
      brief:
        'Compliance has blocked a new analytics export because it includes EU employee data in a US-hosted pipeline. The launch was promised to two enterprise customers.',
      quote: `"Give me the customer-safe and compliance-safe answer."`,
      quoteAttribution: 'General Counsel',
      channelLabel: 'Compliance block update',
      chips: ['Compliance', 'Customer comms', 'Launch'],
      defaultDraft: `Decision: block the analytics export launch until EU data is removed from the US-hosted pipeline.

Impact: two enterprise customers will not receive the export this week.

Customer-safe line: we found a data residency issue in final review and are moving the export to a compliant path.

Ask: approve the hold today and let me align Customer Success and Legal on customer comms by 2pm.`,
      seniorDraft: `Decision: hold the analytics export launch until EU employee data is removed from the US-hosted pipeline.

Why: Compliance is right to block this; the current path creates a data residency risk we should not turn into an exception for two enterprise promises.

Impact: two customers miss this week's export delivery, but we avoid launching a compliance issue into production.

Tradeoff: we absorb customer disappointment now instead of creating legal and trust exposure later.

External line: "We found a data residency issue in final review and are moving the export to the compliant path."

Ask: approve the hold by 2pm today. I will align Customer Success and Legal on comms.`,
      annotations: [
        {
          title: 'Compliance call is unambiguous',
          body: 'The senior draft makes the hold non-negotiable while still giving customers a clean explanation.',
          color: 'orchid',
        },
        {
          title: 'External line is safe',
          body: 'It gives a sentence Legal and Customer Success can use without blame or over-disclosure.',
          color: 'mint',
        },
        {
          title: 'Tradeoff is explicit',
          body: 'It names the near-term customer miss and the larger legal and trust exposure being avoided.',
          color: 'gold',
        },
      ],
      cues: [
        { color: 'hot', text: 'EU data in US-hosted pipeline' },
        { color: 'gold', text: 'two enterprise promises at risk' },
        { color: 'sky', text: 'external line must be safe' },
      ],
    },
    {
      id: 'exec-10',
      brief:
        'A competitor announced a free tier that overlaps with your entry package. Sales is pushing for an immediate matching offer before the CEO asks in staff.',
      quote: `"Are we reacting, or do we actually need to change pricing?"`,
      quoteAttribution: 'CEO',
      channelLabel: 'Competitor news brief',
      chips: ['Competitor', 'Pricing', 'CEO'],
      defaultDraft: `Recommendation: do not match the competitor free tier this week.

What changed: their free tier overlaps with our entry package, but it excludes admin controls and integrations that drive our paid conversion.

Impact: Sales will get questions, but we do not yet have evidence that the free tier changes our win rate.

Ask: approve a 10-day field readout before any pricing change.`,
      seniorDraft: `Recommendation: do not match the competitor free tier this week.

What changed: the competitor's free tier overlaps with our entry package, but excludes admin controls and integrations that drive paid conversion.

Impact: Sales will face buyer questions immediately; that is positioning risk, not evidence that pricing is wrong.

Tradeoff: waiting 10 days may feel slow, but a rushed free tier would reset willingness-to-pay before we have win-rate signal.

Ask: approve a 10-day field readout. I will send Sales a response script today and bring win/loss signal next Friday.`,
      annotations: [
        {
          title: 'No panic response',
          body: 'The senior draft gives the CEO a calm line for staff instead of letting competitor news drive pricing.',
          color: 'orchid',
        },
        {
          title: 'Positioning versus strategy',
          body: 'It distinguishes buyer objections Sales needs today from evidence needed for a pricing change.',
          color: 'sky',
        },
        {
          title: 'Fast learning loop',
          body: 'The ask does not stall; it buys 10 days for signal while giving Sales an immediate script.',
          color: 'mint',
        },
      ],
      cues: [
        { color: 'hot', text: 'competitor free tier landed' },
        { color: 'gold', text: 'Sales wants matching offer' },
        { color: 'sky', text: 'CEO will ask in staff' },
      ],
    },
    {
      id: 'exec-11',
      brief:
        'The quarterly activation KPI missed by 22%. The miss is concentrated in customers who never connected payroll data during setup.',
      quote: `"What should I tell leadership: miss, root cause, or plan?"`,
      quoteAttribution: 'CEO',
      channelLabel: 'Missed KPI update',
      chips: ['KPI miss', 'Activation', 'Plan'],
      defaultDraft: `Update: Q2 activation missed by 22%, driven mainly by customers who did not connect payroll data in setup.

Recommendation: keep the KPI target, but pause two roadmap items for a two-week setup fix.

Impact: this is fixable inside the current strategy, but only if we move capacity now.

Ask: approve the two-week pause today so I can send leadership the root cause and recovery plan.`,
      seniorDraft: `Recommendation: keep the activation KPI target and pause two roadmap items for a two-week setup fix.

What happened: Q2 activation missed by 22%. The miss is concentrated in customers who never connected payroll data during setup.

Impact: this is a setup failure inside the current strategy; without a fix, the next readout will likely miss for the same reason.

Tradeoff: pausing two roadmap items creates schedule pain, but avoids lowering the KPI before we fix the known leak.

Ask: approve the two-week pause today. I will send leadership the root cause, fix owner, and next KPI readout date.`,
      annotations: [
        {
          title: 'Miss plus interpretation',
          body: 'The senior draft gives leadership the miss, root cause, and the meaning in one controlled narrative.',
          color: 'orchid',
        },
        {
          title: 'Root cause is specific',
          body: 'Payroll-data setup turns the note from generic KPI disappointment into a recoverable operating issue.',
          color: 'sky',
        },
        {
          title: 'Capacity ask is explicit',
          body: 'The tradeoff makes clear the fix costs roadmap capacity, then asks for the pause with timing.',
          color: 'mint',
        },
      ],
      cues: [
        { color: 'hot', text: 'activation missed by 22%' },
        { color: 'gold', text: 'two roadmap items at risk' },
        { color: 'mint', text: 'leadership needs a plan' },
      ],
    },
    {
      id: 'exec-12',
      brief:
        'Hiring is frozen after the team lost two engineers. The roadmap still shows three executive commitments for the quarter.',
      quote: `"Which promise do we break?"`,
      quoteAttribution: 'GM',
      channelLabel: 'Headcount constraint memo',
      chips: ['Headcount', 'Roadmap', 'Exec'],
      defaultDraft: `Recommendation: keep the compliance commitment and onboarding revamp, and defer the admin reporting refresh to next quarter.

Capacity changed: we lost two engineers and cannot backfill this quarter.

Impact: trying to keep all three commitments increases delivery risk on the two that matter most.

Ask: approve the roadmap cut by Friday so I can reset the exec commitment tracker.`,
      seniorDraft: `Recommendation: keep compliance readiness and onboarding revamp; defer admin reporting refresh to next quarter.

What changed: losing two engineers with no backfill leaves us roughly 30% short of planned product-engineering capacity this quarter.

Impact: keeping all three executive commitments would make compliance readiness and onboarding recovery less credible.

Tradeoff: admin reporting is visible to Sales, but it is lower-risk than missing compliance readiness or activation recovery.

Ask: approve the cut by Friday. I will update the exec commitment tracker and give Sales the revised reporting line.`,
      annotations: [
        {
          title: 'Break one promise deliberately',
          body: 'The senior draft names the cutline instead of pretending all three commitments can survive the capacity change.',
          color: 'orchid',
        },
        {
          title: 'Capacity quantified',
          body: 'The 30% capacity gap grounds the recommendation in operating reality, not preference.',
          color: 'sky',
        },
        {
          title: 'Stakeholder fallout named',
          body: 'It names the Sales-visible downside so the GM can approve with eyes open.',
          color: 'gold',
        },
      ],
      cues: [
        { color: 'hot', text: 'two engineers lost' },
        { color: 'gold', text: 'three exec commitments remain' },
        { color: 'sky', text: 'GM wants the cutline' },
      ],
    },
    {
      id: 'exec-13',
      brief:
        'A top-10 customer is likely to churn after three missed implementation dates. The CEO needs the narrative before their account review tomorrow.',
      quote: `"Tell me what happened without turning this into a blame memo."`,
      quoteAttribution: 'CEO',
      channelLabel: 'Customer-loss narrative',
      chips: ['Customer loss', 'Narrative', 'CEO'],
      defaultDraft: `Update: Redwood is likely to churn after three missed implementation dates.

Root cause: we sold the migration path before Product and Services had a repeatable playbook for their data complexity.

Impact: $900K ARR is at risk and the account has lost confidence in the plan.

Ask: approve a retention offer by noon tomorrow: executive apology, 30-day migration tiger team, and no new expansion ask until we stabilize.`,
      seniorDraft: `Recommendation: make one retention offer for Redwood before tomorrow's account review: executive apology, 30-day migration tiger team, and no expansion ask until stable.

What happened: Redwood is likely to churn after three missed implementation dates; the latest miss was on our side, not a customer delay.

Impact: $900K ARR is at risk, and the account has lost confidence in our ability to land the promised workflow.

Tradeoff: the package is expensive and visibly owns the miss, but it is better than entering the review with blame or another vague save plan.

Ask: approve the package by noon tomorrow.`,
      annotations: [
        {
          title: 'Retention call first',
          body: 'The senior draft opens with the save package, giving the CEO a decision before the narrative.',
          color: 'orchid',
        },
        {
          title: 'Blame-free ownership',
          body: 'It owns the latest miss without turning the account review into a Sales, Services, or customer blame memo.',
          color: 'hot',
        },
        {
          title: 'Tradeoff is honest',
          body: 'The package cost is visible, but the note explains why it beats a vague or defensive save plan.',
          color: 'mint',
        },
      ],
      cues: [
        { color: 'hot', text: '$900K ARR at risk' },
        { color: 'gold', text: 'three missed dates' },
        { color: 'sky', text: 'CEO needs account-review narrative' },
      ],
    },
    {
      id: 'exec-14',
      brief:
        'A billing email incident sent duplicate renewal notices to 1,400 customers. The CEO wants a postmortem summary for leadership.',
      quote: `"Give me the postmortem version that says what we changed."`,
      quoteAttribution: 'CEO',
      channelLabel: 'Postmortem summary',
      chips: ['Postmortem', 'Incident', 'Customer'],
      defaultDraft: `Summary: 1,400 customers received duplicate renewal notices because the email job retried after a timeout without an idempotency check.

Impact: no billing amounts changed, but Customer Support saw a 38% ticket spike.

Fix: we disabled the job, added idempotency, and are adding a pre-send sample check.

Ask: approve sending leadership this postmortem and a customer-safe line by 4pm.`,
      seniorDraft: `Recommendation: send this leadership postmortem: duplicate renewal notices were caused by retrying an email job without an idempotency check, and the fix is now gated before re-enable.

What changed: 1,400 customers received duplicate notices; no billing amounts changed, but support tickets spiked 38%.

Impact: the incident created customer confusion, not billing inaccuracies.

Tradeoff: we are holding automated renewal notices for 24 hours to verify the fix, which adds manual coverage risk for Support.

Ask: approve the summary and customer-safe line by 4pm. I will send with Support and Legal.`,
      annotations: [
        {
          title: 'Postmortem has a call',
          body: 'The senior draft is not just a recap; it gives leadership the exact summary to send.',
          color: 'orchid',
        },
        {
          title: 'Customer impact is bounded',
          body: 'It separates the reassuring fact from the real support impact, which keeps the tone restrained.',
          color: 'sky',
        },
        {
          title: 'Prevention is explicit',
          body: 'The fix gate and 24-hour hold show what changed operationally, not just that the team is sorry.',
          color: 'mint',
        },
      ],
      cues: [
        { color: 'hot', text: '1,400 customers received duplicate notices' },
        { color: 'gold', text: '38% support ticket spike' },
        { color: 'mint', text: 'leadership needs prevention detail' },
      ],
    },
    {
      id: 'exec-15',
      brief:
        'The enterprise migration program is blocked on data-engineering capacity. Without a dedicated owner, two committed customers will miss the quarter.',
      quote: `"What exactly do you need from me?"`,
      quoteAttribution: 'CPO',
      channelLabel: 'Resource ask memo',
      chips: ['Resource ask', 'Enterprise', 'Capacity'],
      defaultDraft: `Ask: approve one dedicated data engineer for six weeks to unblock enterprise migrations.

Why: two committed customers need data mapping work that the current platform team cannot absorb.

Impact: without the owner, $2.4M ARR slips out of quarter and Services will keep escalating case by case.

Tradeoff: the engineer comes from reporting refresh work.

Decision: confirm the temporary allocation by tomorrow noon.`,
      seniorDraft: `Ask: approve one dedicated data engineer for six weeks by tomorrow noon to unblock enterprise migrations.

Why now: two committed customers need data mapping work that the platform team cannot absorb inside current sprint capacity.

Impact: without a named owner, $2.4M ARR slips out of quarter and Services will keep escalating one-off migration issues.

Tradeoff: the engineer would come from reporting refresh work, delaying that launch by roughly three weeks.

Follow-through: I will publish the migration owner, milestones, and reporting-refresh reset the same day.`,
      annotations: [
        {
          title: 'Ask is the headline',
          body: 'The senior draft answers the CPO with resource, duration, deadline, and purpose in the first line.',
          color: 'orchid',
        },
        {
          title: 'Cost is not hidden',
          body: 'It names the reporting-refresh delay so the approval is not framed as free capacity.',
          color: 'gold',
        },
        {
          title: 'Operational follow-through',
          body: 'The follow-through tells the CPO what happens immediately after the staffing decision.',
          color: 'mint',
        },
      ],
      cues: [
        { color: 'hot', text: '$2.4M ARR at timing risk' },
        { color: 'gold', text: 'data engineering is the bottleneck' },
        { color: 'sky', text: 'CPO wants exact resource ask' },
      ],
    },
    {
      id: 'exec-16',
      brief:
        'A partner integration that underpins next month\'s keynote demo is behind because the partner API changed without notice.',
      quote: `"Do I need to change the keynote story?"`,
      quoteAttribution: 'CEO',
      channelLabel: 'Keynote demo update',
      chips: ['CEO update', 'Partner', 'Demo'],
      defaultDraft: `Recommendation: keep the keynote story, but replace the live partner integration with a controlled demo unless the API stabilizes by next Wednesday.

What changed: the partner changed two API fields without notice, which broke our current demo path.

Impact: the story is still right, but the live demo is not reliable enough yet.

Ask: approve the fallback plan today so Design and Eng can prepare both paths.`,
      seniorDraft: `Recommendation: keep the keynote story, but prepare a controlled-demo fallback unless the partner API stabilizes by next Wednesday.

What changed: the partner changed two API fields without notice, breaking the current live demo path.

Impact: the customer value story is still true; the risk is stage reliability, not strategy.

Tradeoff: a controlled demo is less impressive than a live integration, but avoids a public failure in front of customers and press.

Ask: approve the fallback today. I will give you a go/no-go readout next Wednesday and align Design, Eng, and partner comms.`,
      annotations: [
        {
          title: 'Story versus demo split',
          body: 'The senior draft prevents an overcorrection by preserving the keynote story while changing the demo plan.',
          color: 'orchid',
        },
        {
          title: 'Fallback has a trigger',
          body: 'Next Wednesday creates an executive-safe decision point instead of open-ended demo anxiety.',
          color: 'mint',
        },
        {
          title: 'Tradeoff is executive-safe',
          body: 'It names the cost of less live-demo magic and the larger risk of a public failure.',
          color: 'gold',
        },
      ],
      cues: [
        { color: 'hot', text: 'partner API changed without notice' },
        { color: 'gold', text: 'keynote demo is next month' },
        { color: 'sky', text: 'CEO may change story' },
      ],
    },
    {
      id: 'exec-17',
      brief:
        'An AI summarization feature is showing strong adoption, but inference costs are 3x the launch model and will erase margin if usage continues.',
      quote: `"Is this a success story or a margin problem?"`,
      quoteAttribution: 'CFO',
      channelLabel: 'Margin risk note',
      chips: ['Pricing risk', 'AI cost', 'CFO'],
      defaultDraft: `Recommendation: keep the AI summarization feature live, but add usage caps and pause expansion to lower-tier plans.

Adoption is strong: 41% of eligible admins used it last week. Cost is the issue: inference spend is 3x the launch model.

Impact: without caps, the feature erases margin on lower-tier accounts.

Ask: approve caps by Friday and let us bring revised packaging next week.`,
      seniorDraft: `Recommendation: keep AI summarization live, but add usage caps and pause expansion to lower-tier plans.

What changed: adoption is ahead of plan, with 41% of eligible admins using it last week. Inference cost is also 3x the launch model.

Interpretation: this is product pull with an unsolved margin model, not a feature failure.

Tradeoff: caps may slow usage growth, but protect gross margin while we tune cost and packaging.

Ask: approve caps by Friday. I will bring revised packaging, cost targets, and customer messaging next week.`,
      annotations: [
        {
          title: 'Success and risk both named',
          body: 'The note avoids overcorrecting by framing adoption as real and margin as unresolved.',
          color: 'orchid',
        },
        {
          title: 'Financial impact is concrete',
          body: '3x inference cost and margin risk make the issue CFO-relevant.',
          color: 'gold',
        },
        {
          title: 'Ask protects optionality',
          body: 'Caps buy time to fix packaging without killing a feature users want.',
          color: 'mint',
        },
      ],
      cues: [
        { color: 'hot', text: 'inference cost is 3x model' },
        { color: 'gold', text: '41% eligible admin usage' },
        { color: 'sky', text: 'CFO needs success-versus-risk framing' },
      ],
    },
    {
      id: 'exec-18',
      brief:
        'A regional GM wants a custom uptime SLA for one government deal. Engineering says the monitoring stack cannot support the commitment for another quarter.',
      quote: `"Can we make the promise and catch up later?"`,
      quoteAttribution: 'COO',
      channelLabel: 'SLA escalation memo',
      chips: ['VP escalation', 'Compliance', 'Deal risk'],
      defaultDraft: `Recommendation: do not commit to the custom uptime SLA this quarter.

Engineering cannot monitor or prove the SLA until the new observability stack ships next quarter.

Impact: making the promise now may help the government deal, but creates contractual risk we cannot operate.

Ask: approve a safer offer today: standard SLA, executive support coverage, and a written review when observability is ready.`,
      seniorDraft: `Recommendation: do not promise the custom uptime SLA this quarter.

Why: Engineering cannot monitor or prove the SLA until the new observability stack ships next quarter. A promise we cannot measure is not customer-safe.

Impact: we may put the government deal at risk, but committing now creates contractual exposure and an operating standard we cannot meet.

Alternative: offer the standard SLA, named executive support coverage, and a written SLA review once observability is live.

Ask: approve that line today so Sales and Legal can respond consistently.`,
      annotations: [
        {
          title: 'No unsafe promise',
          body: 'The senior draft makes the operating constraint the basis for the executive call.',
          color: 'orchid',
        },
        {
          title: 'Deal risk is acknowledged',
          body: 'It does not pretend the safer answer has no revenue consequence.',
          color: 'gold',
        },
        {
          title: 'Consistent external line',
          body: 'The ask aligns Sales and Legal before the regional GM creates a one-off commitment.',
          color: 'mint',
        },
      ],
      cues: [
        { color: 'hot', text: 'government deal pressure' },
        { color: 'gold', text: 'SLA cannot be measured yet' },
        { color: 'sky', text: 'COO wants promise-or-hold call' },
      ],
    },
    {
      id: 'exec-19',
      brief:
        'A partner-led acquisition channel is producing low-quality signups and distracting the growth team from a direct channel that converts better.',
      quote: `"Are we shutting the partner motion down or just tuning it?"`,
      quoteAttribution: 'CEO',
      channelLabel: 'Channel strategy reversal',
      chips: ['Strategy reversal', 'Growth', 'Partner'],
      defaultDraft: `Recommendation: pause new investment in the partner-led acquisition channel for 30 days and move growth capacity back to direct.

Data: partner signups convert to paid at 3%, while direct converts at 11% with lower support volume.

Impact: this is not a permanent shutdown, but the current channel is distracting the team from better-converting demand.

Ask: approve the 30-day pause by tomorrow.`,
      seniorDraft: `Recommendation: pause new investment in the partner-led acquisition channel for 30 days and move growth capacity back to direct.

What changed: partner signups convert to paid at 3%, versus 11% for direct, and create higher support volume during setup.

Interpretation: this is a channel-quality problem, not evidence that the product has weak demand.

Tradeoff: pausing may strain the partner relationship, but continuing burns growth capacity on low-quality signups.

Ask: approve the 30-day pause by tomorrow. I will give Partnerships a clear rationale and bring a restart bar before we resume.`,
      annotations: [
        {
          title: 'Shutdown scope is explicit',
          body: 'The memo says 30-day pause, not permanent kill, which reduces unnecessary escalation.',
          color: 'orchid',
        },
        {
          title: 'Quality signal beats volume',
          body: 'Paid conversion and support volume explain why the channel is not working.',
          color: 'sky',
        },
        {
          title: 'Partner fallout is named',
          body: 'It anticipates relationship cost and proposes a rationale before Partnerships is surprised.',
          color: 'gold',
        },
      ],
      cues: [
        { color: 'hot', text: 'partner channel converts at 3%' },
        { color: 'gold', text: 'direct converts at 11%' },
        { color: 'mint', text: 'partner comms need rationale' },
      ],
    },
    {
      id: 'exec-20',
      brief:
        'A new onboarding checklist reduced support tickets, but it also added friction that lowered trial-to-paid conversion for small customers.',
      quote: `"Which metric wins: support reduction or conversion?"`,
      quoteAttribution: 'CEO',
      channelLabel: 'Metric tradeoff memo',
      chips: ['CEO update', 'KPI tradeoff', 'Onboarding'],
      defaultDraft: `Recommendation: keep the checklist for enterprise trials and remove two required steps for small customers.

Signal: support tickets dropped 24%, but trial-to-paid conversion for small customers fell 9%.

Impact: the checklist is useful where setup complexity is high, but too heavy for simple accounts.

Ask: approve the segment split by Friday so we can protect support savings without sacrificing small-customer conversion.`,
      seniorDraft: `Recommendation: segment the onboarding checklist. Keep it for enterprise trials and remove two required steps for small customers.

What changed: the checklist reduced support tickets by 24%, but small-customer trial-to-paid conversion fell 9%.

Interpretation: the checklist solves complexity for enterprise accounts and adds friction for simple accounts.

Tradeoff: removing steps for small customers may bring back some support volume, but protects a higher-leverage conversion point.

Ask: approve the segment split by Friday. I will ship the small-customer variant and bring a support-versus-conversion readout in two weeks.`,
      annotations: [
        {
          title: 'Metric tradeoff resolved',
          body: 'The senior draft answers which metric wins by segment instead of forcing one global answer.',
          color: 'orchid',
        },
        {
          title: 'Impact is balanced',
          body: 'It gives both the 24% support improvement and 9% conversion loss.',
          color: 'sky',
        },
        {
          title: 'Follow-up readout promised',
          body: 'The two-week readout makes the decision reversible and evidence-driven.',
          color: 'mint',
        },
      ],
      cues: [
        { color: 'gold', text: 'support tickets down 24%' },
        { color: 'hot', text: 'small-customer conversion down 9%' },
        { color: 'sky', text: 'CEO wants the metric call' },
      ],
    },
  ],
)
