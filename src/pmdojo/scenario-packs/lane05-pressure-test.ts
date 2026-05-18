import { createLaneScenarios } from '../scenarioFactory'

export const PRESSURE_TEST_EXTRA_SCENARIOS = createLaneScenarios(
  {
    laneId: '05',
    code: 'LANE 05',
    title: 'Pressure-Test',
    tag: 'DISCOVERY',
    rail: '#5ef2b0',
    diff: 'BOSS',
    pressure: 'DISCOVERY · PRE-MORTEM',
    objectiveTitle: 'Assumption list',
    objectiveCopy: 'Under 220 words. Name the riskiest assumptions, fast tests, kill criteria, and how evidence changes scope.',
    wordLimit: 220,
    skillDeltas: {
      comms: 0.02,
      escal: 0,
      prio: 0.06,
      disco: 0.22,
      narr: 0.03,
    },
    coachHit: 'Strong discovery names what would have to be true, how to learn it fast, and what evidence would stop the build.',
    coachMiss: 'If the note cannot kill, shrink, or redirect the idea, it is a sales pitch wearing a discovery hat.',
    seniorName: 'Iris C.',
    seniorRole: 'Principal PM, OpenAI',
    focusPrinciple: 'evidence',
    emphasis: 'discovery',
  },
  [
    {
      id: 'pressure-test-03',
      brief:
        'The team wants AI to auto-resolve low-value billing disputes. Finance likes the cost story, but support worries one wrong resolution will destroy trust.',
      quote: '"Can we stop treating every dispute like a ticket, or is that how we keep customers safe?"',
      quoteAttribution: 'Head of Support',
      channelLabel: 'AI dispute automation · pre-mortem',
      chips: ['AI automation', 'Risk test', 'Kill criteria'],
      defaultDraft: `Before we build auto-resolution, I would test whether the easy cases are safe enough.

Assumptions:
1. Most disputes are repeatable enough to classify.
2. Customers trust an automated resolution if the audit trail is clear.
3. We save enough support time to justify the risk.

Tests:
- review 100 closed disputes
- shadow-score the AI on last month
- run 5 customer interviews on acceptable automation

Kill if the model makes trust-damaging calls or savings are too small.`,
      seniorDraft: `Assumptions:
1. Dispute volume has a large, repeatable class that can be resolved without judgment.
2. Accuracy can clear a trust bar on real historical disputes, not curated examples.
3. Customers accept automation when the reason, audit trail, and human escape hatch are obvious.

Concrete tests this week:
- classify the last 100 disputes by repeatability, dollar risk, and judgment required
- run a shadow-mode eval with support leads scoring false positives
- interview 5 finance admins on acceptable auto-resolution boundaries

Kill criteria: do not automate if false positive dollars or customer trust concerns exceed the support-time savings.
Scope implication: if it passes, ship suggestions first, then automate only the lowest-risk class.`,
      annotations: [
        {
          title: 'Trust is the real risk',
          body: 'The senior draft does not let the team hide behind ticket-volume math.',
          color: 'mint',
        },
        {
          title: 'Tests use real history',
          body: 'Shadow mode on prior disputes exposes false positives before customers feel them.',
          color: 'sky',
        },
        {
          title: 'Scope is staged',
          body: 'The answer converts a risky automation into suggestions before full automation.',
          color: 'gold',
        },
      ],
    },
    {
      id: 'pressure-test-04',
      brief:
        'A migration wizard is being pitched as the next quarter unlock. Sales wants it for competitive takeouts, but implementation says each migration has hidden cleanup work.',
      quote: '"The demo looks clean because it skips the bad data."',
      quoteAttribution: 'Implementation lead',
      channelLabel: 'competitive migration wizard · pre-mortem',
      chips: ['Migration wizard', 'Edge cases', 'Scope test'],
      defaultDraft: `I would not fund the full wizard until we know where migrations really fail.

Assumptions:
1. The common migration path is repeatable.
2. Bad source data is fixable through product guidance.
3. A wizard reduces implementation time enough to matter.

Tests:
- tag the last 30 migrations by blocker type
- prototype import validation on messy customer data
- concierge 3 migrations with a fake wizard checklist

Kill if most effort is bespoke cleanup. Scope to validation only if the wizard story is too broad.`,
      seniorDraft: `Assumptions:
1. Competitive migrations share a repeatable core flow rather than account-specific cleanup.
2. The highest-friction errors can be detected before import, not after implementation spends hours debugging.
3. Customers and internal teams will trust wizard guidance for data that affects payroll and billing.

Concrete tests this week:
- tag the last 30 migrations by blocker, elapsed time, and manual judgment required
- run messy source files through a clickable import-validation prototype
- concierge 3 live migrations using the proposed checklist

Kill criteria: stop the full wizard if bespoke cleanup is the dominant work.
Scope implication: if evidence is mixed, build validation and readiness scoring first, not end-to-end migration.`,
      annotations: [
        {
          title: 'Separates wizard from validation',
          body: 'The scope implication gives the team a smaller useful shape if the big bet fails.',
          color: 'gold',
        },
        {
          title: 'Looks at messy inputs',
          body: 'The tests avoid the polished-demo trap by using bad source files.',
          color: 'hot',
        },
        {
          title: 'Operational value is measured',
          body: 'The draft requires implementation-time reduction, not just a nicer customer story.',
          color: 'sky',
        },
      ],
    },
    {
      id: 'pressure-test-05',
      brief:
        'Growth wants to redesign onboarding around a shorter setup funnel. Activation is flat, but there is no agreement on whether users are confused, unmotivated, or blocked by prerequisites.',
      quote: '"We keep cutting steps, but I do not know which step is actually killing activation."',
      quoteAttribution: 'Growth PM',
      channelLabel: 'onboarding funnel · pre-mortem',
      chips: ['Onboarding funnel', 'Activation', 'Funnel evidence'],
      defaultDraft: `Before redesigning onboarding, we need to know why users drop.

Assumptions:
1. Drop-off is caused by friction in the flow, not missing prerequisites.
2. The shortened funnel still gets users to a valuable first action.
3. Better guidance changes activation, not just completion.

Tests:
- instrument step-level drop-off and time-to-value
- watch 8 new users complete setup
- A/B one guided checklist against current flow

Kill if users are blocked outside the UI or completion does not move activation.`,
      seniorDraft: `Recommendation: do not fund a funnel redesign until we know which activation failure we are solving.

Assumptions:
1. Flat activation is caused by controllable setup friction, not missing prerequisites, weak buyer handoff, or low intent.
2. The first-value moment is hidden or delayed; shortening steps will not strip context users need to activate.
3. The segment that completes faster also reaches higher-quality activation, not vanity completion.

Concrete tests this week:
- instrument each setup step with prerequisite failure, abandon reason, and time-to-first-value by segment
- watch 8 new admins attempt setup cold and tag confusion, motivation, and external-blocker failures
- run one guided checklist for the highest-drop segment with an activation-quality holdout

Owner/deadline: Growth PM and data science make a Friday go/no-go on redesign, checklist-only, or prerequisite work.

Kill criteria: do not redesign if the biggest blocker is outside the UI, the checklist lifts completion without activation quality, or segment results conflict.
Scope implication: if tests pass, rebuild only the failing segment/path; otherwise fund prerequisite fixes or lifecycle handoff before funnel work.`,
      annotations: [
        {
          title: 'Redesign is no longer assumed',
          body: 'The draft forces a Friday go/no-go between redesign, checklist-only, and prerequisite work.',
          color: 'mint',
        },
        {
          title: 'Failure modes are separated',
          body: 'The test plan splits confusion, motivation, prerequisites, and handoff gaps instead of saying "interview users."',
          color: 'sky',
        },
        {
          title: 'Activation quality is protected',
          body: 'The holdout prevents completion-rate wins from masquerading as real activation.',
          color: 'hot',
        },
      ],
    },
    {
      id: 'pressure-test-06',
      brief:
        'Data science has a prototype that explains revenue changes in plain English. Execs love the demo, but PMs are not sure users will trust generated analytics.',
      quote: '"The insight is impressive. I just cannot tell if it is decision-grade."',
      quoteAttribution: 'Analytics lead',
      channelLabel: 'analytics insight cards · pre-mortem',
      chips: ['Analytics insight', 'Trust bar', 'Decision-grade'],
      defaultDraft: `I would pressure-test the insight cards before we put them in the exec dashboard.

Assumptions:
1. The generated explanation is accurate enough for business review.
2. Users can verify where the insight came from.
3. It changes a decision or saves analyst time.

Tests:
- compare 50 generated insights against analyst-written explanations
- usability test source drill-down
- ask 6 leaders what decision they would make from the card

Kill if the insight is not trusted or not actionable. Scope to analyst assist if needed.`,
      seniorDraft: `Assumptions:
1. Generated revenue insights are accurate on real variance cases, including messy attribution.
2. Users can inspect the source data quickly enough to trust the explanation.
3. The card changes a forecast, follow-up, or decision rather than becoming dashboard decoration.

Concrete tests this week:
- blind-compare 50 generated cards against analyst-written variance notes
- test drill-down comprehension with 6 finance and GTM leaders
- measure whether users can name the decision they would take from each card

Kill criteria: do not launch customer-facing insights if accuracy or source traceability fails.
Scope implication: if value exists but trust is weak, keep it as analyst assist with human review.`,
      annotations: [
        {
          title: 'Decision-grade bar',
          body: 'The senior draft asks what action the insight changes.',
          color: 'mint',
        },
        {
          title: 'Traceability is tested',
          body: 'Trust depends on source inspection, not just fluent generated text.',
          color: 'sky',
        },
        {
          title: 'Customer launch is conditional',
          body: 'The fallback scope preserves value without overexposing risk.',
          color: 'gold',
        },
      ],
    },
    {
      id: 'pressure-test-07',
      brief:
        'A self-serve plan-change flow is on the roadmap to reduce sales tickets. Revenue leaders worry it may accelerate downgrades or create billing surprises.',
      quote: '"Self-serve is great until it teaches customers how to shrink faster."',
      quoteAttribution: 'Revenue ops partner',
      channelLabel: 'self-serve plan changes · pre-mortem',
      chips: ['Self-serve flow', 'Revenue risk', 'Guardrails'],
      defaultDraft: `Before building self-serve plan changes, I would test the revenue and trust risks.

Assumptions:
1. Customers mainly need transparency, not negotiation.
2. The flow reduces tickets without causing billing confusion.
3. Guardrails prevent accidental downgrades or surprise charges.

Tests:
- analyze last 100 plan-change tickets by reason and outcome
- prototype upgrade, downgrade, and cancel paths
- run 8 customer interviews on controls and confirmation copy

Kill if the flow increases confusion or avoidable downgrade risk.`,
      seniorDraft: `Assumptions:
1. Plan-change demand is operational enough for self-serve, not primarily negotiation or retention motion.
2. Customers understand downstream billing, access, and renewal effects before confirming.
3. Guardrails can prevent accidental downgrades without recreating a sales-assisted process.

Concrete tests this week:
- classify the last 100 plan-change tickets by reason, outcome, and revenue sensitivity
- prototype upgrade, downgrade, and cancellation paths with pricing-impact copy
- interview 8 admins on confidence, approval needs, and reversal expectations

Kill criteria: do not ship broad self-serve if users cannot predict billing impact or revenue-sensitive cases dominate.
Scope implication: start with low-risk upgrades and admin-initiated seat changes only.`,
      annotations: [
        {
          title: 'Revenue motion is separated',
          body: 'The draft tests whether tickets are operational or actually sales and retention work.',
          color: 'hot',
        },
        {
          title: 'Billing impact is explicit',
          body: 'The test focuses on whether users understand consequences before confirming.',
          color: 'mint',
        },
        {
          title: 'Scope starts safe',
          body: 'Low-risk upgrades preserve self-serve learning without opening every path.',
          color: 'gold',
        },
      ],
    },
    {
      id: 'pressure-test-08',
      brief:
        'Product marketing proposes bundling several advanced features into a premium package. The model looks good, but customer success says buyers may not understand the value split.',
      quote: '"This package might raise ASP, or it might make every renewal harder to explain."',
      quoteAttribution: 'Customer success director',
      channelLabel: 'premium packaging · pre-mortem',
      chips: ['Pricing packaging', 'WTP', 'Renewal risk'],
      defaultDraft: `I would validate the premium package before we change pricing.

Assumptions:
1. Buyers value these features together, not separately.
2. The package is easy to explain at renewal.
3. Willingness to pay is high enough to offset added sales friction.

Tests:
- review recent deals for feature-level demand
- run 10 pricing interviews with package cards
- test renewal talk tracks with CSMs

Kill if buyers cannot explain the bundle value or WTP is weak. Scope to one segment first.`,
      seniorDraft: `Assumptions:
1. The bundled features solve one buyer problem strongly enough to justify a premium package.
2. Customers can understand what moves into the package without feeling existing value was taken away.
3. Incremental willingness to pay offsets renewal friction, enablement cost, and packaging complexity.

Concrete tests this week:
- analyze recent closed-won and lost deals for feature-level pull
- run 10 buyer interviews using good/better/best package cards
- rehearse renewal talk tracks with CSMs on real account examples

Kill criteria: do not repackage if buyers cannot state the bundle value or renewal risk exceeds ASP lift.
Scope implication: pilot with one segment and net-new deals before touching renewals.`,
      annotations: [
        {
          title: 'Packaging has a buyer thesis',
          body: 'The draft demands a coherent problem, not a grab bag of advanced features.',
          color: 'mint',
        },
        {
          title: 'Renewal pain is included',
          body: 'It treats explanation cost as a real product risk.',
          color: 'hot',
        },
        {
          title: 'Pilot avoids broad blast radius',
          body: 'The scope limits learning to one segment and net-new deals first.',
          color: 'gold',
        },
      ],
    },
    {
      id: 'pressure-test-09',
      brief:
        'Design is pushing a mobile companion for manager approvals. Usage anecdotes are strong, but the desktop workflow already works for most managers.',
      quote: '"Every manager asks for mobile until we ask which decision they would make there."',
      quoteAttribution: 'Design research lead',
      channelLabel: 'mobile approval companion · pre-mortem',
      chips: ['Mobile companion', 'Workflow fit', 'Usage test'],
      defaultDraft: `I would test whether mobile is solving a real approval problem.

Assumptions:
1. Managers need to approve while away from desktop often enough.
2. The mobile context has enough information for a good decision.
3. Faster approval improves employee or finance outcomes.

Tests:
- measure approval latency by device and manager type
- prototype 3 mobile approval cards
- interview 8 managers about decisions they would not make on mobile

Kill if mobile only shifts convenience without outcome impact. Scope to simple approvals first.`,
      seniorDraft: `Assumptions:
1. Approval delay is caused by desktop dependence, not unclear policy or manager behavior.
2. The mobile surface can show enough context for managers to make safe decisions quickly.
3. Faster mobile approvals improve a measurable outcome like cycle time, employee experience, or SLA compliance.

Concrete tests this week:
- segment approval latency by workflow, manager type, and device access
- test 3 mobile approval prototypes with real decision data
- interview 8 managers on which approvals they would defer until desktop

Kill criteria: do not fund the companion if latency is not device-driven or decisions require desktop context.
Scope implication: start with low-risk approvals and read-only context before full workflow parity.`,
      annotations: [
        {
          title: 'Anecdotes become assumptions',
          body: 'The draft converts mobile demand into a testable cause of delay.',
          color: 'mint',
        },
        {
          title: 'Context is the safety bar',
          body: 'It asks whether mobile has enough information for a real decision.',
          color: 'sky',
        },
        {
          title: 'Parity is not assumed',
          body: 'The scope starts with simple approvals instead of cloning desktop.',
          color: 'gold',
        },
      ],
    },
    {
      id: 'pressure-test-10',
      brief:
        'Leadership wants a churn predictor surfaced in customer health dashboards. The model has promising offline accuracy, but CSMs are skeptical that it will change saves.',
      quote: '"A red account is not useful if I cannot tell what to do next."',
      quoteAttribution: 'Enterprise CSM',
      channelLabel: 'churn predictor · pre-mortem',
      chips: ['Churn predictor', 'Actionability', 'Model trust'],
      defaultDraft: `Before launching the churn predictor, I would test actionability.

Assumptions:
1. The score is accurate on current accounts, not just historical data.
2. CSMs understand the drivers well enough to act.
3. Acting on the score changes saves or renewal outcomes.

Tests:
- backtest on the last 2 renewal cohorts
- run CSM review of 20 scored accounts
- pilot playbooks for one segment

Kill if the model only creates anxiety without better actions. Scope to driver insights first.`,
      seniorDraft: `Assumptions:
1. The churn model remains accurate on current accounts and does not overfit historical renewal patterns.
2. CSMs can see the drivers and choose a next action without analyst translation.
3. The score improves save rate, prioritization, or renewal planning enough to justify workflow change.

Concrete tests this week:
- backtest the last 2 renewal cohorts and inspect false positives with CSMs
- review 20 live scored accounts for driver clarity and recommended action quality
- pilot one playbook in a single segment with outcome tracking

Kill criteria: do not launch if the predictor is not actionable or creates more noise than saves.
Scope implication: ship driver explanations and playbook prompts before a broad health-score rollout.`,
      annotations: [
        {
          title: 'Accuracy is not enough',
          body: 'The answer moves from model score to changed CSM action.',
          color: 'mint',
        },
        {
          title: 'False positives are inspected',
          body: 'The test treats wasted CSM attention as a real cost.',
          color: 'hot',
        },
        {
          title: 'Workflow change is earned',
          body: 'The scope starts with drivers and playbooks before broad dashboard placement.',
          color: 'gold',
        },
      ],
    },
    {
      id: 'pressure-test-11',
      brief:
        'Support wants an AI deflection bot for billing questions. The top-line ticket volume is attractive, but many billing tickets involve account-specific context.',
      quote: '"If the bot gives a generic answer to a specific billing problem, we lose twice."',
      quoteAttribution: 'Billing support manager',
      channelLabel: 'billing support deflection · pre-mortem',
      chips: ['Support deflection', 'AI trust', 'Ticket quality'],
      defaultDraft: `I would not launch the deflection bot until we know which tickets are safe.

Assumptions:
1. A meaningful share of billing tickets are generic enough for deflection.
2. The bot can detect account-specific issues and hand off.
3. Deflection improves resolution time without hurting trust.

Tests:
- classify last 200 billing tickets by safe deflection
- run offline answer grading with support
- test handoff copy with 10 users

Kill if safe volume is low or wrong answers create escalations. Scope to FAQ only first.`,
      seniorDraft: `Assumptions:
1. Billing ticket volume contains a large safe-deflection class, not mostly account-specific exceptions.
2. The bot can identify when it lacks account context and route to humans without pretending.
3. Deflection reduces time-to-resolution and repeat contacts without damaging billing trust.

Concrete tests this week:
- classify the last 200 billing tickets by safe deflection, account context, and escalation risk
- grade offline bot answers with support leads using real tickets
- test handoff and "I cannot answer that" moments with 10 admins

Kill criteria: do not launch if safe-deflection volume is low or wrong answers create repeat contacts.
Scope implication: start with authenticated FAQ and routing, not account-specific resolution.`,
      annotations: [
        {
          title: 'Safe volume is quantified',
          body: 'The draft prevents a big ticket number from masquerading as bot opportunity.',
          color: 'mint',
        },
        {
          title: 'Handoff is a feature',
          body: 'It tests whether the bot knows when not to answer.',
          color: 'sky',
        },
        {
          title: 'Trust cost is explicit',
          body: 'Billing support deflection can backfire through repeat contacts and escalations.',
          color: 'hot',
        },
      ],
    },
    {
      id: 'pressure-test-12',
      brief:
        'Enterprise admins are asking for a central admin console for bulk policy changes. The ask is loud, but the team does not know whether admins need power, safety, or auditability most.',
      quote: '"Bulk edit is easy to request and terrifying to use."',
      quoteAttribution: 'Enterprise design partner',
      channelLabel: 'enterprise admin console · pre-mortem',
      chips: ['Enterprise admin', 'Bulk actions', 'Auditability'],
      defaultDraft: `Before building the enterprise admin console, I would test the bulk-action risk.

Assumptions:
1. Admins need bulk changes frequently enough.
2. They trust previews, approvals, and rollback controls.
3. The console reduces manual work without increasing policy mistakes.

Tests:
- review last 50 enterprise admin requests
- prototype bulk preview and rollback
- run task tests with 6 admins

Kill if admins still require human review for high-risk changes. Scope to preview and audit log first.`,
      seniorDraft: `Assumptions:
1. Enterprise admins have repeated bulk-change jobs that are painful enough to justify a new console.
2. Preview, approval, rollback, and audit trails make bulk changes safe enough for production use.
3. The console reduces admin operations work without increasing misconfiguration incidents.

Concrete tests this week:
- classify the last 50 enterprise admin requests by frequency, risk, and manual effort
- test a bulk-edit prototype with preview, diff, rollback, and audit trail
- run 6 admin task sessions using real policy-change examples

Kill criteria: do not build broad bulk edit if safety controls do not create confidence.
Scope implication: ship read-only diffs, previews, and audit export before write-heavy bulk actions.`,
      annotations: [
        {
          title: 'Safety beats power',
          body: 'The senior draft treats control design as core product value.',
          color: 'mint',
        },
        {
          title: 'Frequency is validated',
          body: 'It asks whether loud enterprise asks represent repeated jobs.',
          color: 'sky',
        },
        {
          title: 'Write access is delayed',
          body: 'The scope reduces blast radius by starting with preview and audit surfaces.',
          color: 'gold',
        },
      ],
    },
    {
      id: 'pressure-test-13',
      brief:
        'Partnerships wants a marketplace so customers can discover integrations. Engineering worries the hard part is integration quality, not catalog browsing.',
      quote: '"A marketplace that sends users to broken connectors is worse than no marketplace."',
      quoteAttribution: 'Platform engineer',
      channelLabel: 'integration marketplace · pre-mortem',
      chips: ['Marketplace', 'Connector quality', 'Discovery'],
      defaultDraft: `I would validate marketplace demand and quality before building the catalog.

Assumptions:
1. Customers struggle to discover integrations today.
2. A marketplace increases adoption of valuable connectors.
3. Connector quality is good enough to promote.

Tests:
- analyze search/support data for integration discovery pain
- interview 8 customers on how they find integrations
- audit top 20 connectors for setup success and failure rates

Kill if discovery is not the bottleneck or connector quality is weak. Scope to curated listings first.`,
      seniorDraft: `Assumptions:
1. Integration adoption is limited by discovery and evaluation, not connector gaps or implementation effort.
2. Customers can judge fit, setup cost, and trust from marketplace content.
3. The connectors we promote meet a quality bar that will not create support drag.

Concrete tests this week:
- analyze search, support, and sales notes for integration-discovery pain
- interview 8 customers on how they currently find and evaluate connectors
- audit the top 20 connectors for setup success, failure rate, and support burden

Kill criteria: do not build a broad marketplace if discovery is not the bottleneck or quality is below bar.
Scope implication: launch curated verified listings before open catalog expansion.`,
      annotations: [
        {
          title: 'Marketplace is not assumed useful',
          body: 'The draft tests whether discovery is the real bottleneck.',
          color: 'mint',
        },
        {
          title: 'Quality gate is explicit',
          body: 'Promoted connectors must clear setup and support thresholds.',
          color: 'hot',
        },
        {
          title: 'Curated scope protects trust',
          body: 'Verified listings are a sharper first step than an open catalog.',
          color: 'gold',
        },
      ],
    },
    {
      id: 'pressure-test-14',
      brief:
        'Security customers want more granular permissions. The team can build dozens of toggles, but support says admins already struggle to reason about current roles.',
      quote: '"More knobs might be the thing that makes permissions less safe."',
      quoteAttribution: 'Security PM',
      channelLabel: 'granular permissions · pre-mortem',
      chips: ['Permissions', 'Admin clarity', 'Security risk'],
      defaultDraft: `Before adding more permissions, I would test whether admins can manage them safely.

Assumptions:
1. Customers need granular controls more than simpler role templates.
2. Admins can predict the effect of each permission.
3. More controls reduce security risk instead of creating misconfigurations.

Tests:
- review permission-related tickets and escalations
- prototype advanced toggles vs role templates
- run task tests with 8 admins

Kill if admins cannot explain the resulting access. Scope to templates and preview first.`,
      seniorDraft: `Assumptions:
1. The unmet need is true granularity, not clearer role templates or approval workflows.
2. Admins can understand, preview, and audit the effects of new permissions without expert help.
3. Additional controls reduce real security risk rather than increasing misconfiguration.

Concrete tests this week:
- classify permission tickets by missing control, confusion, and audit need
- compare prototypes for granular toggles versus role templates with impact preview
- run 8 admin task tests using realistic access-change scenarios

Kill criteria: do not add broad toggles if admins cannot predict resulting access.
Scope implication: ship templates, preview, and audit explanations before expanding the permission matrix.`,
      annotations: [
        {
          title: 'Granularity is challenged',
          body: 'The draft does not accept "more toggles" as the obvious solution.',
          color: 'mint',
        },
        {
          title: 'Misconfiguration is measured',
          body: 'It frames complexity as a security risk, not just UX friction.',
          color: 'hot',
        },
        {
          title: 'Templates become first scope',
          body: 'The senior move offers a safer shape if the toggle-heavy design fails.',
          color: 'gold',
        },
      ],
    },
    {
      id: 'pressure-test-15',
      brief:
        'CS leadership wants a renewal-risk workspace that combines health, usage, and stakeholder signals. PMs worry it will become another dashboard CSMs ignore.',
      quote: '"If this does not change the renewal meeting, it is just a prettier account page."',
      quoteAttribution: 'Renewals lead',
      channelLabel: 'renewal risk workspace · pre-mortem',
      chips: ['Renewal risk', 'CS workflow', 'Actionability'],
      defaultDraft: `I would test whether the renewal workspace changes CSM behavior.

Assumptions:
1. Risk signals are accurate and timely enough.
2. CSMs can translate signals into renewal actions.
3. The workspace improves renewal prep or save rate.

Tests:
- compare signal accuracy on last quarter renewals
- run 10 CSM prep sessions with a prototype
- track whether actions change for live renewals

Kill if CSMs still use their own spreadsheets or cannot act. Scope to renewal prep checklist first.`,
      seniorDraft: `Assumptions:
1. Health, usage, and stakeholder signals identify renewal risk earlier than current CSM judgment.
2. CSMs can convert those signals into concrete plays before the renewal meeting.
3. The workspace improves prep quality, prioritization, or save rate enough to replace current spreadsheets.

Concrete tests this week:
- compare proposed signals against last quarter's renewal outcomes and false alarms
- run 10 CSM prep sessions using a clickable workspace on live accounts
- track which actions changed versus the current renewal process

Kill criteria: do not build a full workspace if signals are late, noisy, or not actionable.
Scope implication: start with a renewal-prep checklist and signal explanations for one segment.`,
      annotations: [
        {
          title: 'Dashboard risk is named',
          body: 'The draft tests behavior change, not dashboard appreciation.',
          color: 'mint',
        },
        {
          title: 'Live account prep',
          body: 'Using current renewals makes the prototype harder to game.',
          color: 'sky',
        },
        {
          title: 'Scope follows workflow',
          body: 'The first build becomes renewal prep, not a broad workspace.',
          color: 'gold',
        },
      ],
    },
    {
      id: 'pressure-test-16',
      brief:
        'Platform wants an integration quality score to rank connectors and drive partner accountability. Partnerships worries a public score could damage relationships before the metric is fair.',
      quote: '"A score is only useful if customers trust it and partners do not think it is arbitrary."',
      quoteAttribution: 'Partnerships lead',
      channelLabel: 'integration quality score · pre-mortem',
      chips: ['Integration quality', 'Partner risk', 'Metric design'],
      defaultDraft: `Before launching quality scores, I would test the metric and partner response.

Assumptions:
1. We can measure connector quality fairly.
2. The score predicts customer setup success or support burden.
3. Partners will accept the score and improve quality.

Tests:
- compare candidate metrics against connector incidents
- review top 10 connectors with partner managers
- show scorecards to 6 customers

Kill if the score does not predict real outcomes or creates partner churn. Scope internal first.`,
      seniorDraft: `Assumptions:
1. Connector quality can be measured with stable signals like setup success, sync reliability, incident rate, and support burden.
2. The score helps customers choose better integrations and helps partners improve.
3. Partners will view the score as fair enough to act on before it becomes customer-visible.

Concrete tests this week:
- compare candidate metrics against historical connector incidents and setup abandonment
- review the top 10 scorecards with partner managers for fairness and explainability
- test customer comprehension with 6 admins choosing between connectors

Kill criteria: do not expose scores if they fail to predict outcomes or cannot be explained.
Scope implication: use internal quality dashboards before customer-visible rankings.`,
      annotations: [
        {
          title: 'Metric earns trust',
          body: 'The senior draft makes predictiveness and explainability required.',
          color: 'mint',
        },
        {
          title: 'Partner blast radius is real',
          body: 'It recognizes that public scoring changes a relationship, not just a UI.',
          color: 'hot',
        },
        {
          title: 'Internal-first scope',
          body: 'The launch path captures operational value while the score matures.',
          color: 'gold',
        },
      ],
    },
    {
      id: 'pressure-test-17',
      brief:
        'Finance ops wants automated revenue-recovery nudges for failed payments. The business case is strong, but CX worries aggressive automation will annoy healthy customers.',
      quote: '"Recovered dollars are not free if we train good customers to dislike us."',
      quoteAttribution: 'CX lead',
      channelLabel: 'revenue recovery automation · pre-mortem',
      chips: ['AI automation', 'Revenue recovery', 'Customer trust'],
      defaultDraft: `I would test revenue recovery automation against customer annoyance.

Assumptions:
1. Failed payments have segments where nudges drive recovery.
2. Messaging can be personalized without feeling threatening.
3. Automation improves recovery more than it increases complaints.

Tests:
- segment failed payments by reason and recovery path
- A/B 3 nudge sequences on a small cohort
- monitor complaints, unsubscribes, and recovery dollars

Kill if complaints rise or recovered dollars are marginal. Scope to low-risk segments first.`,
      seniorDraft: `Assumptions:
1. Failed-payment recovery has identifiable segments where automated nudges change outcomes.
2. Customers understand the issue and next step without feeling threatened or spammed.
3. Incremental recovery dollars exceed the cost of complaints, escalations, and relationship damage.

Concrete tests this week:
- segment the last 6 months of failures by reason, recovery path, and customer health
- run a small A/B on 3 nudge sequences with holdout and complaint tracking
- review message tone with CX on real account examples

Kill criteria: stop if automation lifts complaints or escalations faster than recovered dollars.
Scope implication: launch only low-risk payment-failure segments with caps and human override.`,
      annotations: [
        {
          title: 'Revenue has a trust cost',
          body: 'The draft refuses to treat recovered dollars as pure upside.',
          color: 'hot',
        },
        {
          title: 'Segmentation prevents blunt automation',
          body: 'The test looks for where nudges actually change behavior.',
          color: 'mint',
        },
        {
          title: 'Controls shape scope',
          body: 'Caps and override are part of the product, not later polish.',
          color: 'gold',
        },
      ],
    },
    {
      id: 'pressure-test-18',
      brief:
        'The data team wants anomaly alerts when billing metrics move unexpectedly. PMs worry users already ignore alerting because most notifications lack owner, severity, or next step.',
      quote: '"Another alert is not a product unless it tells me what to do."',
      quoteAttribution: 'Finance admin',
      channelLabel: 'billing anomaly alerts · pre-mortem',
      chips: ['Analytics insight', 'Alert fatigue', 'Owner clarity'],
      defaultDraft: `Before building anomaly alerts, I would test whether they drive action.

Assumptions:
1. Billing anomalies can be detected with low false positives.
2. Users know who owns the next step.
3. Alerts reduce time-to-diagnosis or prevent revenue leakage.

Tests:
- backtest anomaly rules on 12 months of data
- prototype alerts with severity and owner
- run 6 user sessions on what action they would take

Kill if false positives are high or action is unclear. Scope to weekly digest first.`,
      seniorDraft: `Assumptions:
1. We can detect meaningful billing anomalies with low false positives across customer segments.
2. Each alert can name severity, likely cause, owner, and next step clearly enough to drive action.
3. Alerts reduce time-to-diagnosis, revenue leakage, or support escalation more than they create fatigue.

Concrete tests this week:
- backtest anomaly candidates on 12 months of data and measure false positive cost
- prototype alert cards with severity, owner, cause, and suggested action
- run 6 finance-admin sessions asking what they would do next

Kill criteria: do not launch real-time alerts if users cannot act or false positives dominate.
Scope implication: start with a weekly anomaly digest and high-confidence rules only.`,
      annotations: [
        {
          title: 'Action beats notification',
          body: 'The draft makes next step and owner part of the validation bar.',
          color: 'mint',
        },
        {
          title: 'False positive cost is measured',
          body: 'Alert fatigue is treated as a product failure mode.',
          color: 'hot',
        },
        {
          title: 'Digest is the safer wedge',
          body: 'The scope implication avoids flooding users before confidence is proven.',
          color: 'gold',
        },
      ],
    },
    {
      id: 'pressure-test-19',
      brief:
        'Product wants reusable workflow templates for enterprise admins. Sales says templates will speed onboarding, but admins may need custom policy modeling more than canned starts.',
      quote: '"Templates sound useful until every enterprise says they are the exception."',
      quoteAttribution: 'Solutions architect',
      channelLabel: 'enterprise workflow templates · pre-mortem',
      chips: ['Enterprise admin', 'Templates', 'Onboarding'],
      defaultDraft: `I would test whether templates match real enterprise setup work.

Assumptions:
1. Common admin workflows repeat across enterprise customers.
2. Templates reduce setup time without causing risky misconfiguration.
3. Admins can adapt templates without needing services.

Tests:
- compare 20 enterprise implementations for workflow patterns
- prototype 3 templates with editable rules
- test setup with 6 admins

Kill if every setup is too bespoke. Scope to starter templates with clear diffs.`,
      seniorDraft: `Assumptions:
1. Enterprise setup contains repeated workflow patterns that templates can cover without hiding important differences.
2. Templates reduce setup time while preserving admin confidence, review, and auditability.
3. Admins can safely adapt templates without a solutions architect translating every rule.

Concrete tests this week:
- compare 20 enterprise implementations for repeated workflows, exceptions, and services effort
- prototype 3 templates with editable rules, preview, and diff
- run 6 admin setup sessions measuring time saved and misconfiguration risk

Kill criteria: do not build a template library if reuse is shallow or adaptation requires expert help.
Scope implication: ship a small set of starter templates with diff and review, not a broad catalog.`,
      annotations: [
        {
          title: 'Reuse is proven, not assumed',
          body: 'The test checks whether enterprise patterns actually repeat.',
          color: 'mint',
        },
        {
          title: 'Adaptation risk is included',
          body: 'Templates can create unsafe confidence if admins cannot inspect changes.',
          color: 'hot',
        },
        {
          title: 'Small library first',
          body: 'The scope starts narrow with reviewability instead of a template marketplace.',
          color: 'gold',
        },
      ],
    },
    {
      id: 'pressure-test-20',
      brief:
        'Engineering wants to expose integration observability to customers so admins can self-diagnose sync failures. Support likes the idea, but the data may be too technical for most admins.',
      quote: '"If customers need an engineer to interpret the health page, support will still get the ticket."',
      quoteAttribution: 'Support operations lead',
      channelLabel: 'integration observability · pre-mortem',
      chips: ['Integration quality', 'Self-serve flow', 'Diagnosis'],
      defaultDraft: `Before exposing integration health, I would test whether customers can self-diagnose.

Assumptions:
1. The health signals map to customer-understandable problems.
2. Admins can resolve common sync issues from the page.
3. The page reduces support tickets or speeds resolution.

Tests:
- review top integration tickets and required diagnostics
- prototype a health page with plain-language fixes
- run 8 admin task tests

Kill if admins cannot interpret or act. Scope to top 3 failure modes first.`,
      seniorDraft: `Assumptions:
1. Integration health signals can be translated into customer-understandable status, impact, and next step.
2. Admins can resolve or route the most common sync failures without support interpreting logs.
3. Exposing observability reduces ticket volume, speeds diagnosis, or improves trust enough to justify customer surface area.

Concrete tests this week:
- classify top integration tickets by failure mode, diagnostic needed, and customer actionability
- prototype a health page for the top 3 failure modes with plain-language fixes
- run 8 admin task tests measuring correct diagnosis and next action

Kill criteria: do not expose raw observability if admins cannot interpret or act on it.
Scope implication: ship guided diagnostics for the top failure modes before full log visibility.`,
      annotations: [
        {
          title: 'Observability is translated',
          body: 'The draft tests customer-understandable status, not internal debug output.',
          color: 'mint',
        },
        {
          title: 'Support deflection is proven',
          body: 'The product must change diagnosis behavior, not just publish more data.',
          color: 'sky',
        },
        {
          title: 'Top failure modes constrain scope',
          body: 'The first release avoids a broad health page that nobody can use.',
          color: 'gold',
        },
      ],
    },
  ],
)
