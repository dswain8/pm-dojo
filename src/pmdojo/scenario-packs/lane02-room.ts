import { createLaneScenarios } from '../scenarioFactory'

const roomSkillDeltas = {
  comms: 0.06,
  escal: 0.04,
  prio: 0.04,
  disco: 0.02,
  narr: 0.16,
}

export const ROOM_EXTRA_SCENARIOS = createLaneScenarios(
  {
    laneId: '02',
    code: 'LANE 02',
    title: 'Navigate the Room',
    tag: 'POLITICS',
    rail: '#ffc53a',
    diff: 'HARD',
    pressure: 'ROOM · LIVE',
    objectiveTitle: 'Meeting follow-up',
    objectiveCopy: 'Under 150 words. Preserve dissent, land the call, cite evidence, name the tradeoff, and assign owner/timing.',
    wordLimit: 150,
    skillDeltas: roomSkillDeltas,
    coachHit: 'You protected the dissent and still landed a decision. That is the room skill.',
    coachMiss: 'The room needs a decision path, not a transcript. Name the disagreement, evidence, call, tradeoff, and next owner.',
    seniorName: 'Rhea P.',
    seniorRole: 'Group PM, Figma',
    focusPrinciple: 'audience',
    emphasis: 'room',
  },
  [
    {
      id: 'room-03',
      brief:
        'Design wants another week to fix onboarding empty states. Engineering says the API contract freezes tomorrow and moving now will break the beta plan. Your VP asks for the follow-up.',
      quote: `"If we ship it like this, users will think the product is broken."`,
      quoteAttribution: 'Design lead, launch readiness',
      channelLabel: '#onboarding-launch · follow-up',
      chips: ['Decision note', '<=150w', 'design-eng'],
      cues: [
        { color: 'gold', text: 'design risk is first-use trust' },
        { color: 'hot', text: 'API contract freezes tomorrow' },
        { color: 'sky', text: 'beta customers start Monday' },
        { color: 'orchid', text: 'VP needs one call' },
      ],
      defaultDraft: `Decision: keep the beta date and do not reopen the API contract tomorrow.

Design dissent is valid: the empty states still create trust risk for first-use accounts.

Tradeoff: we protect the Monday beta and accept a narrower surface instead of chasing polish late.

Next: @mira owns revised empty-state copy by EOD, @ash owns API freeze, and I will review the first 20 beta sessions Friday before any ramp.`,
      seniorDraft: `Decision: hold the API freeze tomorrow and ship Monday beta with narrowed onboarding. Do not reopen the contract.

Evidence: beta customers start Monday and the API contract freezes tomorrow. The remaining risk is first-use trust in empty states.

Dissent: Design is right that the current empty states can make the product look broken. We are constraining exposure, not dismissing the objection.

Tradeoff: launch certainty over a fully polished first-use flow.

Next: @mira lands copy fixes by EOD, @ash confirms freeze by 2pm, and I will review the first 20 beta sessions Friday before ramp.`,
      annotations: [
        {
          title: 'Dissent gets preserved',
          body: 'The note names the design objection as valid, then explains why it does not change the call.',
          color: 'orchid',
        },
        {
          title: 'Call cannot reopen quietly',
          body: 'The API freeze, Monday beta, and Friday readout make the decision forwardable instead of another debate prompt.',
          color: 'gold',
        },
        {
          title: 'Evidence anchors the call',
          body: 'Five beta customers and 20 sessions make the follow-up feel operational, not political.',
          color: 'sky',
        },
      ],
    },
    {
      id: 'room-04',
      brief:
        'Sales escalated a GlobalBank renewal in pipeline review. They want a custom SSO reporting commitment this quarter. Engineering says it would displace the auth cleanup already tied to two launches.',
      quote: `"If we say no, we may lose the renewal. If we say yes, we blow up the quarter."`,
      quoteAttribution: 'Revenue leader, pipeline review',
      channelLabel: '#pipeline-staff · decision note',
      chips: ['Follow-up', '<=150w', 'sales escal'],
      cues: [
        { color: 'hot', text: '$420k renewal at risk' },
        { color: 'gold', text: 'sales wants a committed date' },
        { color: 'sky', text: 'auth cleanup unblocks two launches' },
        { color: 'mint', text: 'customer line needed today' },
      ],
      defaultDraft: `Decision: do not commit custom SSO reporting this quarter for GlobalBank.

We will offer the existing admin export plus a design-partner slot for standard reporting in Q3.

Dissent: Sales believes the renewal needs a named commitment. I am not ignoring that risk; I think the bespoke path creates bigger roadmap risk.

Next: @nate sends the revenue exposure by 3pm, @isha confirms export limits, and I will draft the customer-safe line today.`,
      seniorDraft: `Decision: do not promise custom SSO reporting for GlobalBank this quarter. Offer admin export now plus a Q3 standard-reporting design slot.

Evidence: the $420k renewal is real, but the bespoke path displaces auth cleanup for two launches and creates precedent we cannot support.

Dissent: Sales disagrees and wants a dated commitment. We will preserve that renewal risk in the account note.

Tradeoff: higher renewal risk now for lower roadmap and precedent risk.

Next: @nate sends revenue exposure by 3pm, @isha confirms export limits by EOD, and I will draft the customer-safe alternative today.`,
      annotations: [
        {
          title: 'Revenue pressure stays explicit',
          body: 'The senior note keeps the $420k risk visible while still making a non-bespoke product call.',
          color: 'hot',
        },
        {
          title: 'No bespoke promise',
          body: 'The decision protects the roadmap by naming the precedent risk directly.',
          color: 'gold',
        },
        {
          title: 'External line is owned',
          body: 'A room decision becomes useful when someone owns the customer-safe follow-up.',
          color: 'mint',
        },
      ],
    },
    {
      id: 'room-05',
      brief:
        'Legal objects to launching an AI notes pilot because the retention clause is not approved. CS wants the pilot for three strategic customers next week. You need the decision recap.',
      quote: `"I am not comfortable learning about this clause from a customer escal."`,
      quoteAttribution: 'Legal counsel, launch review',
      channelLabel: '#ai-notes-pilot · recap',
      chips: ['Decision recap', '<=150w', 'legal'],
      cues: [
        { color: 'hot', text: 'three strategic customers waiting' },
        { color: 'gold', text: 'retention clause unresolved' },
        { color: 'sky', text: 'CS wants momentum' },
        { color: 'orchid', text: 'legal objection is principled' },
      ],
      defaultDraft: `Decision: pause the external AI notes pilot until Legal clears the retention clause.

Dissent: CS is right that delaying risks momentum with three strategic customers, but launching without approved terms creates a worse trust problem.

Tradeoff: we slip the pilot by one week to avoid a contract issue we would have to unwind.

Next: @ravi owns clause review by Wednesday, @lena owns customer comms, and I will run an internal dry run Friday.`,
      seniorDraft: `Decision: pause the external AI notes pilot for one week until Legal approves the retention clause.

Evidence: three strategic customers are ready next week, but the retention clause is not approved and cannot be defended externally yet.

Dissent: CS disagrees because a pause may weaken pilot momentum. Legal is also right that discovering clause risk through a customer escal would be worse.

Tradeoff: delayed learning for a cleaner legal and trust posture.

Next: @ravi returns clause language by Wednesday, @lena drafts customer comms by EOD, and I will run the internal dry run Friday.`,
      annotations: [
        {
          title: 'Legal is not cast as blocker',
          body: 'The objection is framed as trust risk, which keeps the room aligned instead of defensive.',
          color: 'orchid',
        },
        {
          title: 'Delay buys a specific unlock',
          body: 'The one-week pause is tied to approved clause language, which keeps the decision from sounding like legal anxiety.',
          color: 'sky',
        },
        {
          title: 'Dissent informs comms',
          body: 'CS disagreement is preserved and converted into better customer messaging.',
          color: 'mint',
        },
      ],
    },
    {
      id: 'room-06',
      brief:
        'Support pushes back in a planning review: CSV import errors drive 18% of weekly admin tickets. Product wanted the team on the new dashboard. The GM asks you to land the call.',
      quote: `"We cannot keep calling this an edge case when it is the top ticket driver."`,
      quoteAttribution: 'Support lead, planning review',
      channelLabel: '#admin-planning · follow-up',
      chips: ['Meeting note', '<=150w', 'support'],
      cues: [
        { color: 'hot', text: '18% of tickets' },
        { color: 'gold', text: 'dashboard launch loses one sprint' },
        { color: 'sky', text: 'support has direct evidence' },
        { color: 'mint', text: 'GM wants the cut today' },
      ],
      defaultDraft: `Decision: move one sprint from dashboard polish to CSV import reliability.

Why: CSV errors are 18% of weekly admin tickets, and the dashboard does not matter if setup keeps failing.

Dissent: Product still believes dashboard momentum is important for the Q2 story.

Tradeoff: dashboard slips one sprint; support volume and admin trust get addressed first.

Next: @sana sizes CSV fixes by tomorrow, @eli updates the dashboard milestone, and I will bring ticket impact back Friday.`,
      seniorDraft: `Decision: fund CSV import reliability next sprint and move dashboard polish back one sprint.

Evidence: CSV import errors drive 18% of weekly admin tickets. That is stronger operating evidence than the dashboard launch narrative right now.

Dissent: Product disagrees because dashboard polish is the visible Q2 story. We are not cutting it; we are sequencing reliability first.

Tradeoff: one sprint of launch delay for lower support volume and higher admin trust.

Next: @sana sizes fixes by tomorrow, @eli updates the milestone by EOD, and I will report ticket movement Friday.`,
      annotations: [
        {
          title: 'Support evidence wins cleanly',
          body: 'The note gives Support a fair hearing through ticket data, not volume in the room.',
          color: 'sky',
        },
        {
          title: 'Sequencing over defeat',
          body: 'The dashboard is delayed, not humiliated, which preserves buy-in.',
          color: 'gold',
        },
        {
          title: 'Ticket metric closes the loop',
          body: 'The follow-up has a Friday measurement point, so Support evidence remains tied to an outcome.',
          color: 'mint',
        },
      ],
    },
    {
      id: 'room-07',
      brief:
        'The CEO asks in exec review to add AI summaries back into the launch demo. The team cut it because privacy review is incomplete. Everyone looks at you to write the recap.',
      quote: `"I want the magic in the demo, but I do not want a privacy mess."`,
      quoteAttribution: 'CEO, exec review',
      channelLabel: '#launch-exec · decision note',
      chips: ['Exec recap', '<=150w', 'CEO'],
      cues: [
        { color: 'orchid', text: 'CEO wants the story' },
        { color: 'hot', text: 'privacy review is incomplete' },
        { color: 'gold', text: 'demo is in four days' },
        { color: 'sky', text: 'customer beta starts after demo' },
      ],
      defaultDraft: `Decision: include AI summaries in the CEO demo using mock data only. Do not add it to customer beta yet.

Dissent: CEO wants the launch story to show the full magic. Privacy still has an unresolved review, so customer exposure stays blocked.

Tradeoff: the demo gets the narrative; beta stays narrower until the risk is cleared.

Next: @mina owns mock data by EOD, @jo confirms privacy status Thursday, and I will update beta scope Friday.`,
      seniorDraft: `Decision: show AI summaries in the CEO demo with mock data only. Keep it out of customer beta until privacy review clears.

Evidence: the demo is in four days, customer beta starts after it, and privacy review is still incomplete.

Dissent: The CEO wants the magic in the story. Privacy disagrees with any real-data exposure this week. This path honors both constraints.

Tradeoff: stronger demo narrative for a narrower customer beta.

Next: @mina prepares mock data by EOD, @jo confirms privacy status by Thursday, and I will update beta scope Friday.`,
      annotations: [
        {
          title: 'CEO ask is translated',
          body: 'The note turns an override into a bounded decision rather than a full scope reversal.',
          color: 'orchid',
        },
        {
          title: 'Customer boundary is explicit',
          body: 'Mock data for demo and no beta exposure keeps the decision safe to forward.',
          color: 'hot',
        },
        {
          title: 'Political override is bounded',
          body: 'The CEO ask becomes a demo-only decision instead of a silent reversal of the privacy gate.',
          color: 'gold',
        },
      ],
    },
    {
      id: 'room-08',
      brief:
        'A partner dependency is slipping. Partnerships wants to hold the joint launch date. Engineering says the partner API will not pass certification by then. You owe the launch-room follow-up.',
      quote: `"We are planning against a date the dependency cannot meet."`,
      quoteAttribution: 'Engineering manager, partner launch room',
      channelLabel: '#partner-launch · follow-up',
      chips: ['Launch note', '<=150w', 'partner'],
      cues: [
        { color: 'hot', text: 'partner API failed certification' },
        { color: 'gold', text: 'joint launch date is public internally' },
        { color: 'sky', text: 'native flow can ship alone' },
        { color: 'mint', text: 'partner comms need a line' },
      ],
      defaultDraft: `Decision: decouple launch. Ship the native workflow on the current date and move partner integration behind certification.

Dissent: Partnerships wants to hold the joint date because momentum with the partner is fragile.

Tradeoff: we lose the bigger launch moment, but we avoid announcing an integration that cannot pass certification.

Next: @omar confirms native launch readiness tomorrow, @tess owns partner comms, and I will reset the integration date after certification.`,
      seniorDraft: `Decision: decouple the launch. Ship the native workflow on the current date; hold partner integration until certification passes.

Evidence: the partner API missed certification, while the native flow is ready for customers. One date would make the whole launch hostage to the riskiest piece.

Dissent: Partnerships disagrees because a split launch weakens partner momentum. That is the cost we are accepting.

Tradeoff: smaller joint launch moment for lower customer and credibility risk.

Next: @omar confirms native readiness by tomorrow, @tess drafts partner comms by EOD, and I will reset the integration date after certification.`,
      annotations: [
        {
          title: 'Dependency is isolated',
          body: 'The decision separates what is ready from what is partner-bound.',
          color: 'sky',
        },
        {
          title: 'Partner dissent is respected',
          body: 'The note does not pretend launch momentum is irrelevant; it states the accepted cost.',
          color: 'orchid',
        },
        {
          title: 'Certification is the gate',
          body: 'The note gives Partnerships a clean reason for the split and prevents a date from overruling readiness.',
          color: 'gold',
        },
      ],
    },
    {
      id: 'room-09',
      brief:
        'Growth wants to roll out an onboarding experiment because activation is up 3%. Data Science says the sample is underpowered and the lift may be noise. The experiment readout needs a decision.',
      quote: `"The chart is green, but I would not bet the roadmap on it yet."`,
      quoteAttribution: 'Data scientist, experiment readout',
      channelLabel: '#growth-readout · decision',
      chips: ['Readout', '<=150w', 'data'],
      cues: [
        { color: 'sky', text: '+3% activation signal' },
        { color: 'hot', text: 'sample is underpowered' },
        { color: 'gold', text: 'Growth wants rollout now' },
        { color: 'mint', text: 'one more week reaches sample' },
      ],
      defaultDraft: `Decision: do not roll out the onboarding variant yet. Extend the experiment one week to reach the planned sample.

Dissent: Growth believes the +3% activation signal is enough to move now.

Tradeoff: we delay a possible win, but avoid scaling noise into the default journey.

Next: @vihaan confirms sample target by EOD, @kara keeps traffic at 50%, and I will bring the final readout next Friday.`,
      seniorDraft: `Decision: hold rollout and extend the onboarding experiment one week to hit the planned sample size.

Evidence: activation is up 3%, but Data Science says the sample is underpowered. One more week gets us to the planned readout.

Dissent: Growth disagrees because the window is green and waiting may slow activation gains. That upside stays in the final readout.

Tradeoff: delayed upside for higher confidence.

Next: @vihaan confirms the sample target by EOD, @kara keeps traffic at 50%, and I will bring the final readout next Friday.`,
      annotations: [
        {
          title: 'Signal is not overclaimed',
          body: 'The draft acknowledges the green metric without pretending it is conclusive.',
          color: 'sky',
        },
        {
          title: 'Dissent is substantive',
          body: 'Growth has a valid speed argument, and the note preserves it cleanly.',
          color: 'orchid',
        },
        {
          title: 'Confidence has a clock',
          body: 'The decision names the sample target and next Friday readout, so waiting is measurable rather than passive.',
          color: 'mint',
        },
      ],
    },
    {
      id: 'room-10',
      brief:
        'In roadmap review, Platform asks for a reliability quarter. Product Marketing wants admin workflow launches for the analyst event. The CPO wants a recap that will hold.',
      quote: `"If everything is a launch, nothing is a strategy."`,
      quoteAttribution: 'CPO, roadmap review',
      channelLabel: '#roadmap-review · decision',
      chips: ['Roadmap recap', '<=150w', 'CPO'],
      cues: [
        { color: 'gold', text: 'analyst event in Q3' },
        { color: 'hot', text: 'three incidents last month' },
        { color: 'sky', text: 'platform asks for a reliability quarter' },
        { color: 'orchid', text: 'marketing needs a story' },
      ],
      defaultDraft: `Decision: keep reliability as the Q3 P0 and move admin workflow launches into scoped discovery.

Dissent: Product Marketing believes the analyst event needs a visible launch.

Tradeoff: we lose some event narrative, but three incidents last month make reliability the stronger company bet.

Next: @dev owns reliability milestones by Friday, @lila owns the analyst narrative with discovery proof points, and I will bring the updated roadmap Monday.`,
      seniorDraft: `Decision: Q3 P0 remains reliability. Admin workflows move to scoped discovery, not committed launch.

Evidence: three incidents last month make reliability the highest-leverage customer work. A weaker analyst-event story is smaller than another trust hit.

Dissent: Product Marketing disagrees because the event needs visible product progress. We will support the story with discovery proof points, not a false launch commitment.

Tradeoff: less launch surface for stronger customer trust.

Next: @dev sends reliability milestones by Friday, @lila drafts the event narrative by Monday, and I will publish the roadmap update Monday.`,
      annotations: [
        {
          title: 'Strategy beats event pressure',
          body: 'The note explains why customer trust outranks a visible launch moment.',
          color: 'gold',
        },
        {
          title: 'Marketing gets an honest path',
          body: 'The dissent is redirected into discovery proof points instead of being allowed to inflate roadmap commitment.',
          color: 'orchid',
        },
        {
          title: 'Roadmap language is precise',
          body: 'Discovery is named as discovery, preventing accidental commitment creep.',
          color: 'sky',
        },
      ],
    },
    {
      id: 'room-11',
      brief:
        'An experiment readout shows the new upgrade modal lifted conversion 6% but increased support tickets 22%. Growth wants to ramp. Support wants it killed. You need the decision note.',
      quote: `"We found money, but we also found confusion."`,
      quoteAttribution: 'GM, experiment readout',
      channelLabel: '#upgrade-experiment · follow-up',
      chips: ['Experiment', '<=150w', 'growth-support'],
      cues: [
        { color: 'sky', text: '+6% conversion' },
        { color: 'hot', text: '+22% support tickets' },
        { color: 'gold', text: 'ramp decision due today' },
        { color: 'mint', text: 'copy fix is plausible' },
      ],
      defaultDraft: `Decision: hold the upgrade modal at 10% and do not ramp this week.

Rationale: conversion is up 6%, but support tickets are up 22%, so the win is not clean enough to scale.

Dissent: Growth wants to capture the revenue lift now.

Tradeoff: we leave short-term conversion on the table to fix customer confusion.

Next: @aria owns copy changes by tomorrow, @sam owns ticket tagging, and I will bring a clean readout Friday.`,
      seniorDraft: `Decision: keep the upgrade modal at 10% and pause ramp until the confusion fix is tested.

Evidence: conversion is up 6%, but support tickets are up 22%. Scaling now would create more revenue and more confused customers.

Dissent: Growth disagrees because the revenue signal is real. Support disagrees with keeping any traffic live. The middle path is a bounded hold, not a permanent compromise.

Tradeoff: delayed revenue for cleaner customer experience.

Next: @aria ships copy fixes by tomorrow, @sam tags ticket causes by EOD, and I will bring the Friday readout.`,
      annotations: [
        {
          title: 'Both metrics matter',
          body: 'The senior note keeps conversion and ticket load in the same frame.',
          color: 'sky',
        },
        {
          title: 'Two dissents are separated',
          body: 'Growth and Support disagree for different reasons, and the note avoids flattening them.',
          color: 'orchid',
        },
        {
          title: 'Hold is bounded by a fix',
          body: 'The 10% cap, copy work, ticket tagging, and Friday readout make the compromise scoreable.',
          color: 'mint',
        },
      ],
    },
    {
      id: 'room-12',
      brief:
        'The customer advisory board pushed hard for audit logs and custom roles. Enterprise Sales wants both committed. Engineering says only audit logs fit the quarter. You need the CAB follow-up.',
      quote: `"They heard us nod. I do not want them hearing a roadmap promise we cannot keep."`,
      quoteAttribution: 'Engineering director, CAB debrief',
      channelLabel: '#cab-debrief · follow-up',
      chips: ['CAB note', '<=150w', 'customers'],
      cues: [
        { color: 'hot', text: 'six CAB customers asked' },
        { color: 'gold', text: 'Sales wants both committed' },
        { color: 'sky', text: 'audit logs fit the quarter' },
        { color: 'orchid', text: 'custom roles are larger than expected' },
      ],
      defaultDraft: `Decision: commit audit logs for Q3. Do not commit custom roles yet.

Why: six CAB customers asked for both, but Engineering can only deliver audit logs without cutting reliability work.

Dissent: Enterprise Sales believes custom roles are needed for two renewals.

Tradeoff: clearer customer trust signal now; less breadth in the roadmap promise.

Next: @noah drafts the CAB follow-up by tomorrow, @priya sizes custom roles, and I will bring renewal impact Friday.`,
      seniorDraft: `Decision: tell the CAB we are committing audit logs for Q3 and keeping custom roles in discovery.

Evidence: six CAB customers asked for both, but audit logs fit the quarter and address the broadest trust gap. Custom roles would cut committed reliability work.

Dissent: Enterprise Sales disagrees because two renewals mention custom roles. We will capture that impact before the next roadmap review.

Tradeoff: narrower promise for higher-confidence delivery.

Next: @noah drafts the CAB note by tomorrow, @priya sizes custom roles by Friday, and I will bring renewal impact Friday.`,
      annotations: [
        {
          title: 'Customer promise is contained',
          body: 'The note prevents a nod in the room from becoming a roadmap commitment.',
          color: 'hot',
        },
        {
          title: 'Promise boundary is clean',
          body: 'Audit logs are committed and custom roles stay in discovery, which keeps the CAB note from becoming accidental scope.',
          color: 'sky',
        },
        {
          title: 'Sales dissent gets evidence path',
          body: 'Renewal impact becomes an input to the next decision instead of a side argument.',
          color: 'mint',
        },
      ],
    },
    {
      id: 'room-13',
      brief:
        'Pricing council is split. Finance wants a 25-seat minimum for margin. Sales says SMB churn will spike. Product recommends a narrower rollout but needs to land the note.',
      quote: `"We need margin discipline without teaching the field to fear the new packaging."`,
      quoteAttribution: 'COO, pricing council',
      channelLabel: '#pricing-council · decision',
      chips: ['Pricing note', '<=150w', 'council'],
      cues: [
        { color: 'hot', text: '25-seat floor improves margin' },
        { color: 'gold', text: 'SMB churn risk is unresolved' },
        { color: 'sky', text: 'net-new segment is cleaner' },
        { color: 'mint', text: 'field guidance due tomorrow' },
      ],
      defaultDraft: `Decision: pilot the 25-seat minimum for net-new customers above 100 employees. Do not apply it to SMB renewals this quarter.

Dissent: Finance wants broader margin impact now; Sales believes even a pilot may spook the field.

Tradeoff: slower margin improvement, lower churn and enablement risk.

Next: @ben sends expected revenue impact by tomorrow, @maya drafts field guidance, and I will bring pilot metrics to pricing council in two weeks.`,
      seniorDraft: `Decision: pilot the 25-seat minimum only for net-new customers above 100 employees. Exclude SMB renewals this quarter.

Evidence: the seat floor improves margin, but SMB churn risk is unresolved. Net-new 100+ employee accounts give us a cleaner test.

Dissent: Finance disagrees with the narrow scope. Sales worries the field will still over-apply it. Both risks are real and need guidance.

Tradeoff: slower margin capture for lower churn and enablement risk.

Next: @ben sends revenue impact by tomorrow, @maya drafts field guidance by EOD, and I will bring pilot metrics to council in two weeks.`,
      annotations: [
        {
          title: 'Segment boundary is the decision',
          body: 'The note avoids a vague pilot by naming exactly who is in and out.',
          color: 'sky',
        },
        {
          title: 'Two political risks survive',
          body: 'Finance and Sales objections are both preserved without letting either own the whole call.',
          color: 'orchid',
        },
        {
          title: 'Council gets a learning loop',
          body: 'The two-week metric review turns the political split into a bounded pricing test.',
          color: 'mint',
        },
      ],
    },
    {
      id: 'room-14',
      brief:
        'After a tense QBR, the customer asks for a roadmap date on permissions. CSM wants a commitment to save the account. Engineering says sizing is not done. Write the internal follow-up.',
      quote: `"I need a path to confidence, not a date we invent in the room."`,
      quoteAttribution: 'VP Engineering, QBR debrief',
      channelLabel: '#northstar-qbr · follow-up',
      chips: ['QBR follow-up', '<=150w', 'customer'],
      cues: [
        { color: 'hot', text: '$600k account at risk' },
        { color: 'gold', text: 'customer asked for a date' },
        { color: 'sky', text: 'sizing incomplete' },
        { color: 'mint', text: 'CSM needs a response by Friday' },
      ],
      defaultDraft: `Decision: do not give Northstar a roadmap date yet. Give them a sizing checkpoint and a decision date.

Dissent: CSM believes the $600k account needs a committed timeline now.

Tradeoff: we risk frustration this week, but avoid a date Engineering has not sized.

Next: @irene owns sizing by Thursday, @cal owns the customer note by Friday, and I will approve the path-to-confidence message before it goes out.`,
      seniorDraft: `Decision: do not commit a permissions launch date to Northstar yet. Send a path-to-confidence note with sizing Thursday and a decision date Friday.

Evidence: the $600k account risk is real, but Engineering has not sized the work. Inventing a date after the QBR creates a second trust problem.

Dissent: CSM disagrees and believes the account needs a firmer commitment now. That urgency shapes the Friday response, not the roadmap date.

Tradeoff: short-term customer frustration for a credible plan.

Next: @irene completes sizing by Thursday, @cal drafts the customer note by Friday morning, and I will review it before send.`,
      annotations: [
        {
          title: 'Trust beats fake certainty',
          body: 'The note chooses a credible checkpoint over a soothing but unsupported date.',
          color: 'gold',
        },
        {
          title: 'CSM pressure is legitimate',
          body: 'The account risk stays visible, which keeps the follow-up from sounding engineering-only.',
          color: 'hot',
        },
        {
          title: 'Customer response is owned',
          body: 'Sizing, draft, and PM review are all assigned, so the internal call converts into an external path.',
          color: 'mint',
        },
      ],
    },
    {
      id: 'room-15',
      brief:
        'In the postmortem, Infra asks for a two-week release freeze after a billing incident. Product wants to keep the committed launch. The VP wants one decision note.',
      quote: `"If the lesson is real, the roadmap has to absorb it."`,
      quoteAttribution: 'VP Product, postmortem',
      channelLabel: '#billing-postmortem · decision',
      chips: ['Postmortem', '<=150w', 'incident'],
      cues: [
        { color: 'hot', text: 'billing incident affected 1,200 invoices' },
        { color: 'gold', text: 'launch was customer-committed' },
        { color: 'sky', text: 'Infra wants a freeze' },
        { color: 'mint', text: 'postmortem action owner needed' },
      ],
      defaultDraft: `Decision: slip the launch one week and reserve two engineers for billing guardrails. Do not run a full two-week freeze.

Dissent: Infra wants the full freeze after the 1,200-invoice incident. Product still wants to hold the customer date.

Tradeoff: launch slips, but we address the actual failure mode without freezing unrelated work.

Next: @tara owns guardrail scope by tomorrow, @mike updates customer comms, and I will review incident actions Friday.`,
      seniorDraft: `Decision: slip the committed launch one week and dedicate two engineers to billing guardrails. Do not apply a blanket two-week freeze.

Evidence: the incident affected 1,200 invoices, so the roadmap must absorb real remediation. A full freeze is broader than the failure mode requires.

Dissent: Infra disagrees and wants more safety margin. Product disagrees with any slip because customers already have the date.

Tradeoff: one-week delay for targeted incident risk reduction.

Next: @tara scopes guardrails by tomorrow, @mike updates customer comms by EOD, and I will review postmortem actions Friday.`,
      annotations: [
        {
          title: 'Postmortem changes the plan',
          body: 'The note shows the lesson has roadmap consequences, which gives the postmortem teeth.',
          color: 'hot',
        },
        {
          title: 'Remediation is specific',
          body: 'Two engineers on billing guardrails is concrete enough to avoid both performative freeze and business-as-usual.',
          color: 'sky',
        },
        {
          title: 'Both teams lose something',
          body: 'Product absorbs a slip; Infra accepts less than a full freeze. The tradeoff is explicit.',
          color: 'orchid',
        },
      ],
    },
    {
      id: 'room-16',
      brief:
        'Exec staff is split between an enterprise retention push and a mid-market growth bet. Sales wants growth capacity. CS wants churn risk handled first. The COO asks for the follow-up.',
      quote: `"I do not want us leaving this room with two strategies and one team."`,
      quoteAttribution: 'COO, exec staff',
      channelLabel: '#exec-staff · follow-up',
      chips: ['Exec staff', '<=150w', 'strategy'],
      cues: [
        { color: 'hot', text: 'enterprise churn risk is near-term' },
        { color: 'gold', text: 'mid-market growth has upside' },
        { color: 'sky', text: 'one team cannot staff both' },
        { color: 'orchid', text: 'COO wants a single strategy' },
      ],
      defaultDraft: `Decision: keep H1 capacity on enterprise retention. Run mid-market pricing research without engineering build this quarter.

Dissent: Sales wants product capacity on growth now because pipeline creation is slowing.

Tradeoff: we delay a possible growth bet to protect near-term churn risk and keep one team focused.

Next: @ren owns retention milestones by Friday, @sofia owns mid-market research by next week, and I will bring the readout to exec staff.`,
      seniorDraft: `Decision: H1 product capacity stays on enterprise retention. Mid-market growth moves to pricing research only, with no engineering build this quarter.

Evidence: the same team cannot credibly do both. Enterprise churn risk is near-term; mid-market upside still needs customer and pricing evidence.

Dissent: Sales disagrees because pipeline creation is slowing and wants growth capacity now. That concern becomes an input to the research brief.

Tradeoff: slower growth exploration for sharper retention focus.

Next: @ren sends retention milestones by Friday, @sofia starts mid-market research next week, and I will bring the exec-staff readout after five customer calls.`,
      annotations: [
        {
          title: 'One strategy, one team',
          body: 'The senior note refuses the fake alignment of funding two strategies with one capacity pool.',
          color: 'gold',
        },
        {
          title: 'Growth is not dismissed',
          body: 'Sales dissent is redirected into research rather than treated as noise.',
          color: 'orchid',
        },
        {
          title: 'Growth has a reentry path',
          body: 'Five customer calls give Sales a concrete evidence gate rather than a vague promise to revisit.',
          color: 'mint',
        },
      ],
    },
    {
      id: 'room-17',
      brief:
        'Security objects to making SOC2 evidence exports self-serve for a sales deal. Sales says manual review will not scale and the customer wants it by month-end. You need the decision note.',
      quote: `"Self-serve is the product answer, but it is not safe until the threat model is done."`,
      quoteAttribution: 'Security lead, deal review',
      channelLabel: '#security-deal-review · recap',
      chips: ['Deal review', '<=150w', 'security'],
      cues: [
        { color: 'hot', text: 'customer wants month-end export' },
        { color: 'gold', text: 'security threat model incomplete' },
        { color: 'sky', text: 'manual review can unblock one deal' },
        { color: 'mint', text: 'sales needs a line today' },
      ],
      defaultDraft: `Decision: offer SOC2 evidence export through manual review for this customer. Do not make it self-serve until the threat model is complete.

Dissent: Sales believes manual review is not scalable and may slow the month-end deal.

Tradeoff: slower fulfillment now, lower security risk before we expose evidence broadly.

Next: @kyle owns manual review SLA by tomorrow, @rima owns threat model timing, and I will send Sales the customer-safe line today.`,
      seniorDraft: `Decision: support this SOC2 export through manual review only. Do not ship self-serve evidence exports until Security completes the threat model.

Evidence: the customer needs month-end export, but the threat model is incomplete. Broad self-serve access before review creates risk we cannot explain away later.

Dissent: Sales disagrees because manual review adds friction and may slow the deal. That cost is acceptable for one account, not as the product default.

Tradeoff: slower fulfillment for lower security and customer-trust risk.

Next: @kyle confirms manual review SLA by tomorrow, @rima sends threat-model timing by EOD, and I will give Sales the customer line today.`,
      annotations: [
        {
          title: 'Unsafe scale is blocked',
          body: 'The decision supports the deal without turning the exception into a product surface.',
          color: 'hot',
        },
        {
          title: 'Exception does not become product',
          body: 'The manual path serves the deal while keeping self-serve behind the security gate.',
          color: 'gold',
        },
        {
          title: 'External wording is owned',
          body: 'Sales gets a customer-safe line, which is the artifact the room actually needs.',
          color: 'mint',
        },
      ],
    },
    {
      id: 'room-18',
      brief:
        'Launch readiness is tense. Marketing wants to announce GA on Tuesday. Engineering says p95 page load is still 1.8s over target and wants ten more days. Your GM asks for the call.',
      quote: `"A launch that makes the product feel slower is not a launch win."`,
      quoteAttribution: 'Engineering lead, readiness review',
      channelLabel: '#ga-readiness · decision',
      chips: ['Readiness', '<=150w', 'launch'],
      cues: [
        { color: 'hot', text: 'p95 is 1.8s over target' },
        { color: 'gold', text: 'GA announcement planned Tuesday' },
        { color: 'sky', text: 'waitlist can still open' },
        { color: 'orchid', text: 'marketing needs a credible story' },
      ],
      defaultDraft: `Decision: do not announce GA Tuesday. Open the waitlist and docs, then move GA ten days after p95 is back on target.

Dissent: Marketing believes the campaign loses momentum if GA moves.

Tradeoff: we lose launch heat, but avoid inviting customers into a slower product.

Next: @li owns performance fix date by tomorrow, @emma owns waitlist messaging by EOD, and I will reset the launch plan Friday.`,
      seniorDraft: `Decision: hold GA. Open the waitlist and docs Tuesday, then announce GA ten days after p95 returns to target.

Evidence: p95 page load is still 1.8s over target. A launch that increases perceived slowness creates more customer trust risk than a delayed announcement.

Dissent: Marketing disagrees because the campaign window is already booked. We will preserve momentum with waitlist and docs instead of GA.

Tradeoff: less launch heat now; better first customer experience.

Next: @li sends the performance plan by tomorrow, @emma updates messaging by EOD, and I will publish the reset Friday.`,
      annotations: [
        {
          title: 'GA has a quality gate',
          body: 'The note ties launch to p95 recovery, not comfort or vibes.',
          color: 'sky',
        },
        {
          title: 'Campaign has a fallback',
          body: 'Waitlist and docs give Marketing a usable Tuesday plan without pretending GA quality is ready.',
          color: 'orchid',
        },
        {
          title: 'Tradeoff is customer-facing',
          body: 'The cost is framed through first customer experience, which makes the call easier to defend.',
          color: 'gold',
        },
      ],
    },
    {
      id: 'room-19',
      brief:
        'A marketplace partner wants a co-branded announcement before certification is complete. Partnerships wants the signal. QA says two blocking bugs remain. You need the partner-room follow-up.',
      quote: `"We can create momentum without pretending certification is done."`,
      quoteAttribution: 'QA manager, partner sync',
      channelLabel: '#marketplace-partner · follow-up',
      chips: ['Partner note', '<=150w', 'QA'],
      cues: [
        { color: 'hot', text: 'two certification blockers remain' },
        { color: 'gold', text: 'partner wants public signal' },
        { color: 'sky', text: 'private lighthouse is viable' },
        { color: 'mint', text: 'announcement copy due today' },
      ],
      defaultDraft: `Decision: no public co-branded announcement until certification clears. Run a private lighthouse with the partner instead.

Dissent: Partnerships believes a public signal is needed to keep the partner engaged.

Tradeoff: less market momentum, but we avoid announcing an integration with two blocking bugs.

Next: @paul owns certification bug status by tomorrow, @neha drafts private lighthouse terms, and I will review announcement copy after clearance.`,
      seniorDraft: `Decision: hold the public co-branded announcement until certification clears. Move forward with a private lighthouse only.

Evidence: two certification blockers remain. A public announcement before clearance creates credibility risk with customers and the partner.

Dissent: Partnerships disagrees because the partner wants market signal now. We will give them progress through the lighthouse, not a premature launch.

Tradeoff: lower public momentum for higher launch credibility.

Next: @paul sends blocker status by tomorrow, @neha drafts lighthouse terms by EOD, and I will approve announcement copy only after clearance.`,
      annotations: [
        {
          title: 'Public vs private is the lever',
          body: 'The decision keeps partner motion alive without crossing the certification line.',
          color: 'sky',
        },
        {
          title: 'QA evidence is decisive',
          body: 'Two blocking bugs make the risk concrete enough to withstand partner pressure.',
          color: 'hot',
        },
        {
          title: 'Momentum is not confused with launch',
          body: 'The lighthouse preserves partner motion while keeping public claims behind certification.',
          color: 'mint',
        },
      ],
    },
    {
      id: 'room-20',
      brief:
        'In board-prep staff, Finance wants the margin story first. Product wants growth roadmap first. CTO wants the reliability caveat visible. The CEO asks you to send the alignment note.',
      quote: `"The board needs one story, not our org chart."`,
      quoteAttribution: 'CEO, board-prep staff',
      channelLabel: '#board-prep · alignment',
      chips: ['Alignment note', '<=150w', 'board prep'],
      cues: [
        { color: 'orchid', text: 'CEO wants one story' },
        { color: 'hot', text: 'margin pressure is board-visible' },
        { color: 'gold', text: 'growth roadmap is the product ask' },
        { color: 'sky', text: 'reliability caveat must survive' },
      ],
      defaultDraft: `Decision: lead the board story with retention and reliability, then frame growth as the H2 upside once margin guardrails hold.

Dissent: Product wants growth first; Finance wants margin first. CTO wants reliability risk unmistakable.

Tradeoff: the story is less exciting up front, but more credible for the board.

Next: @alina owns margin proof points by tomorrow, @gabe owns reliability caveat, and I will send the integrated narrative Friday.`,
      seniorDraft: `Decision: board narrative leads with retention and reliability, then positions growth roadmap as H2 upside under margin guardrails.

Evidence: margin pressure is board-visible, the reliability caveat must survive, and the board needs one story rather than three functional pitches.

Dissent: Product disagrees with growth coming second. Finance wants margin sharper. CTO wants the caveat explicit. All three inputs are reflected in the sequence.

Tradeoff: less exciting opening for a more credible board story.

Next: @alina sends margin proof points by tomorrow, @gabe sends reliability language by EOD, and I will circulate the integrated narrative Friday.`,
      annotations: [
        {
          title: 'Org-chart conflict becomes narrative',
          body: 'The note turns three functional asks into one board-facing sequence.',
          color: 'orchid',
        },
        {
          title: 'Dissent is synthesized',
          body: 'Each exec concern survives, but none gets to dominate the story alone.',
          color: 'gold',
        },
        {
          title: 'Audience decides the sequence',
          body: 'The board is the reader, so the narrative optimizes for credibility over internal excitement.',
          color: 'sky',
        },
      ],
    },
  ],
)
