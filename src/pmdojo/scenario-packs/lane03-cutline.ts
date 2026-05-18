import { createLaneScenarios } from '../scenarioFactory'

const CUTLINE_META: Parameters<typeof createLaneScenarios>[0] = {
  laneId: '03',
  code: 'LANE 03',
  title: 'The Cutline',
  tag: 'PRIO',
  rail: '#6eaaff',
  diff: 'NORMAL',
  pressure: 'PLANNING · CAPACITY',
  objectiveTitle: 'Prioritization doc',
  objectiveCopy: 'Under 180 words. Name what is in, what is out, why the cutline holds, and the ask.',
  wordLimit: 180,
  skillDeltas: {
    comms: 0.04,
    escal: 0.01,
    prio: 0.18,
    disco: 0.04,
    narr: 0.03,
  },
  coachHit: 'Strong cutlines make the no-list safe to repeat.',
  coachMiss: 'If everything stays in, the team is not prioritizing. It is just collecting requests.',
  seniorName: 'Jon K.',
  seniorRole: 'Director PM, Linear',
  focusPrinciple: 'tradeoff',
  emphasis: 'cutline',
}

const CUTLINE_SEEDS: Parameters<typeof createLaneScenarios>[1] = [
  {
    id: 'cutline-03',
    brief:
      'Quarter planning has eight credible bets and room for three. Finance needs the locked list before the headcount plan closes.',
    quote: `"I need the three bets we can actually staff, not the eight everyone likes."`,
    quoteAttribution: 'Finance lead',
    channelLabel: '#q2-planning · capacity',
    chips: ['Quarter plan', 'Capacity', '<=180w'],
    defaultDraft: `Q2 cutline: fund renewal risk dashboard, invoice retry reliability, and self-serve downgrade controls.

Out: homepage revamp, Slack notifications v2, marketplace bundles, admin color themes, and partner scorecards.

Why: the quarter goal is net revenue retention and billing trust. The in-list maps directly to renewal risk or failed payments.

Tradeoff: we are giving up acquisition polish to protect existing revenue.

Ask: @maya confirms sizing by Friday so Finance can close the headcount plan.`,
    seniorDraft: `Recommendation: lock Q2 to three bets.

In: renewal risk dashboard, invoice retry reliability, and self-serve downgrade controls.

Out: homepage revamp, Slack notifications v2, marketplace bundles, admin color themes, and partner scorecards.

Why: Q2 is a retention quarter. These three reduce churn risk or failed-payment exposure on existing revenue.

Tradeoff: we are delaying acquisition polish and partner surface area.

Ask: @maya confirms engineering sizing by Friday; I will send Finance the staffed plan after that.`,
    annotations: [
      {
        title: 'Capacity is the forcing function',
        body: 'The memo does not debate all eight ideas. It converts capacity into a real decision.',
        color: 'sky',
      },
      {
        title: 'Goal decides the list',
        body: 'Retention and billing trust explain why the selected bets beat more visible growth work.',
        color: 'mint',
      },
      {
        title: 'No-list prevents backfill',
        body: 'Naming the five cuts keeps stakeholders from treating unfunded items as implicit stretch work.',
        color: 'hot',
      },
    ],
  },
  {
    id: 'cutline-04',
    brief:
      'Support wants debt work after ticket volume spiked. Growth wants a referral launch for the same two engineers.',
    quote: `"If we pick support debt, I need to know what growth number we are intentionally risking."`,
    quoteAttribution: 'Growth lead',
    channelLabel: '#roadmap · support-vs-growth',
    chips: ['Support debt', 'Growth bet', 'Tradeoff'],
    defaultDraft: `Cutline: fund refund reason capture and smarter issue routing. Do not fund the referral dashboard this sprint.

Why: 42% of billing tickets are refund-status confusion, and Support is missing SLA on enterprise accounts.

Tradeoff: we probably delay one acquisition experiment, but we reduce recurring load and churn risk.

Ask: @sam validates ticket categories tomorrow; @nora moves the referral work to next planning.`,
    seniorDraft: `Recommendation: put the two engineers on support debt.

In: refund reason capture and automated issue routing.

Out: referral dashboard, launch badges, social sharing, and the campaign analytics polish.

Why: 42% of billing tickets are refund-status confusion, and SLA misses are now touching enterprise renewals.

Tradeoff: we are intentionally slowing one growth loop to reduce recurring support load and churn risk.

Ask: @sam confirms the ticket slice tomorrow; @nora updates the growth plan by Friday.`,
    annotations: [
      {
        title: 'The growth cost is named',
        body: 'This does not pretend support debt is free. It states the acquisition work being delayed.',
        color: 'gold',
      },
      {
        title: 'Support work has evidence',
        body: 'The 42% ticket slice makes the debt concrete instead of moral.',
        color: 'sky',
      },
      {
        title: 'Two owners close the loop',
        body: 'Support validates the evidence while Growth updates the displaced plan.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'cutline-05',
    brief:
      'A seven-figure enterprise renewal is pushing for three custom asks. Security also wants reusable enterprise foundations.',
    quote: `"Are we building the customer request or the enterprise product?"`,
    quoteAttribution: 'Head of Enterprise',
    channelLabel: '#enterprise · renewal-cutline',
    chips: ['Enterprise', 'Renewal', 'Platform'],
    defaultDraft: `Enterprise cutline: fund audit log export, SCIM lifecycle, and role-boundary fixes.

Out: custom approval chain, branded PDF package, and the manual data bridge requested by Atlas.

Why: the renewal risk is real, but the reusable blockers are security and admin control, not one-off workflow shape.

Tradeoff: Sales loses some bespoke leverage, but Product avoids owning a custom fork.

Ask: @lina confirms which items can be positioned as the renewal path by Wednesday.`,
    seniorDraft: `Recommendation: solve the reusable enterprise blockers, not the bespoke renewal list.

In: audit log export, SCIM lifecycle, and role-boundary fixes.

Out: custom approval chain, branded PDF package, and Atlas-only manual data bridge.

Why: the $2.4M renewal needs credible security and admin controls. Those same foundations unlock the next ten enterprise deals.

Tradeoff: we may disappoint one account on workflow shape to avoid a custom fork.

Ask: @lina confirms the customer-facing cutline by Wednesday; I will align Sales and Security after.`,
    annotations: [
      {
        title: 'Reusable beats bespoke',
        body: 'The cutline separates the renewal need from the account-specific implementation request.',
        color: 'mint',
      },
      {
        title: 'Revenue pressure is acknowledged',
        body: 'The memo does not hand-wave the renewal. It names the value and still holds the product line.',
        color: 'gold',
      },
      {
        title: 'The out-list is defensible',
        body: 'The rejected work is framed as custom fork risk, not as sales noise.',
        color: 'hot',
      },
    ],
  },
  {
    id: 'cutline-06',
    brief:
      'Platform wants a quarter for entitlements and permissions cleanup. Feature teams want the same capacity for visible admin improvements.',
    quote: `"Platform work keeps getting approved in theory and cut in practice."`,
    quoteAttribution: 'Engineering manager',
    channelLabel: '#platform · cutline',
    chips: ['Platform', 'Permissions', 'Roadmap'],
    defaultDraft: `Q3 platform cutline: fund entitlements hardening, permissions migration, and event-contract cleanup.

Out: new admin widgets, bulk invite polish, dashboard redesign, and role color labels.

Why: three planned launches depend on trustworthy permissions. Shipping more UI on unstable access rules compounds support and security risk.

Tradeoff: the roadmap will look less flashy for one quarter.

Ask: @devon confirms the two-squad platform plan by Monday.`,
    seniorDraft: `Recommendation: reserve Q3 capacity for platform foundations.

In: entitlements hardening, permissions migration, and event-contract cleanup.

Out: new admin widgets, bulk invite polish, dashboard redesign, and role color labels.

Why: three customer-facing launches are blocked by unreliable access rules. Fixing the foundation increases delivery confidence across teams.

Tradeoff: we give up visible admin improvements this quarter to reduce future launch and security risk.

Ask: @devon confirms the two-squad plan by Monday; I will update the roadmap cutline after.`,
    annotations: [
      {
        title: 'Invisible work is made legible',
        body: 'The note ties platform investment to three launches, not vague engineering hygiene.',
        color: 'sky',
      },
      {
        title: 'The polish tradeoff is explicit',
        body: 'Visible admin work is named as the thing being sacrificed.',
        color: 'gold',
      },
      {
        title: 'The owner is engineering',
        body: 'The ask lands on the person who can confirm staffing, not the room in general.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'cutline-07',
    brief:
      'Leadership wants an AI feature in the launch story. The team is worried the quality bar is not safe enough for customers.',
    quote: `"I want AI in the keynote, but not if Support becomes the QA team."`,
    quoteAttribution: 'GM',
    channelLabel: '#ai-launch · scope',
    chips: ['AI feature', 'Quality bar', 'Launch'],
    defaultDraft: `AI cutline: ship the support-summary beta behind admin opt-in, with eval tracking and human review.

Out: auto-send replies, AI roadmap generator, and broad GA messaging.

Why: summaries can reduce handle time while keeping humans in control. Auto-send creates customer trust risk before we have enough eval data.

Tradeoff: the launch story is narrower, but safer.

Ask: @priya approves the eval threshold by Friday.`,
    seniorDraft: `Recommendation: ship a narrow AI beta, not a broad AI launch.

In: support-summary beta, admin opt-in, eval harness, and human review queue.

Out: auto-send replies, AI roadmap generator, public GA messaging, and customer-facing claims about autonomy.

Why: summaries can reduce support handle time while preserving human judgment. We do not yet have quality data for automated customer replies.

Tradeoff: the keynote story is smaller, but we avoid turning Support into the QA layer.

Ask: @priya approves the eval threshold by Friday before launch copy locks.`,
    annotations: [
      {
        title: 'AI scope has a safety rail',
        body: 'The in-list includes opt-in, evals, and human review instead of just the feature name.',
        color: 'mint',
      },
      {
        title: 'Out-list blocks overclaiming',
        body: 'Cutting GA messaging and autonomy claims keeps marketing from outrunning product quality.',
        color: 'hot',
      },
      {
        title: 'The tradeoff protects trust',
        body: 'The memo accepts a smaller story to avoid a larger operational and customer-risk bill.',
        color: 'gold',
      },
    ],
  },
  {
    id: 'cutline-08',
    brief:
      'A compliance deadline moved up by six weeks. Three roadmap items now compete with required audit evidence work.',
    quote: `"The deadline is real. The question is what we are willing to slip."`,
    quoteAttribution: 'Legal counsel',
    channelLabel: '#compliance · deadline',
    chips: ['Compliance', 'Deadline', 'Audit'],
    defaultDraft: `Compliance cutline: fund data-retention controls, access-review exports, and audit evidence automation.

Out: FYI notifications, analytics refresh, and webhook catalog.

Why: the June 30 deadline blocks enterprise certification. The out-list improves experience, but none is a compliance gate.

Tradeoff: we slip Q2 polish to avoid a late audit scramble.

Ask: @marco confirms legal acceptance criteria by Tuesday.`,
    seniorDraft: `Recommendation: move the compliance gate above roadmap polish.

In: data-retention controls, access-review exports, and audit evidence automation.

Out: FYI notifications, analytics refresh, webhook catalog, and dashboard copy cleanup.

Why: the June 30 deadline is now the enterprise blocker. These three items produce the evidence Legal needs for certification.

Tradeoff: we delay customer-visible polish and developer convenience for one quarter.

Ask: @marco confirms acceptance criteria by Tuesday; I will publish the revised roadmap that afternoon.`,
    annotations: [
      {
        title: 'Deadline beats preference',
        body: 'The compliance date gives the cutline a non-negotiable anchor.',
        color: 'hot',
      },
      {
        title: 'Evidence is the output',
        body: 'The selected work is tied to audit evidence, not generic compliance posture.',
        color: 'sky',
      },
      {
        title: 'Polish is consciously slipped',
        body: 'The note names what customers and developers will not get this quarter.',
        color: 'gold',
      },
    ],
  },
  {
    id: 'cutline-09',
    brief:
      'The billing ledger migration is halfway done. Sales wants new discounting features before the old ledger is fully retired.',
    quote: `"Every quarter we add one more thing to the system we are trying to leave."`,
    quoteAttribution: 'Staff engineer',
    channelLabel: '#billing-migration · planning',
    chips: ['Migration', 'Billing', 'Reliability'],
    defaultDraft: `Migration cutline: fund the top-80% ledger v2 migration, reconciliation tooling, and rollback monitor.

Out: new coupon types, custom invoice templates, and regional tax backlog expansion.

Why: the old ledger is driving close pain and duplicate investigation work. New features on it extend the migration tail.

Tradeoff: we delay monetization asks to remove operational risk.

Ask: @rachel confirms the cohort list tomorrow.`,
    seniorDraft: `Recommendation: finish the migration path before adding more billing surface area.

In: top-80% ledger v2 migration, reconciliation tooling, and rollback monitor.

Out: new coupon types, custom invoice templates, regional tax backlog expansion, and one-off discount overrides.

Why: the old ledger is still driving close pain and incident investigations. Building on it extends the migration tail.

Tradeoff: we delay near-term monetization asks to reduce operational and accounting risk.

Ask: @rachel confirms the migration cohorts tomorrow; I will cut the sales-facing list after.`,
    annotations: [
      {
        title: 'Migration tail is the enemy',
        body: 'The memo explains why new features are expensive when built on the retiring system.',
        color: 'sky',
      },
      {
        title: 'Monetization cost is visible',
        body: 'Sales asks are not dismissed. They are delayed in service of retiring operational risk.',
        color: 'gold',
      },
      {
        title: 'Cohorts make it executable',
        body: 'The ask turns a strategy call into a concrete migration plan.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'cutline-10',
    brief:
      'Ops is asking for internal tooling after months of manual escalation work. Product marketing wants a customer-facing activity feed.',
    quote: `"I know internal tools are not launchable, but the manual queue is breaking."`,
    quoteAttribution: 'Operations lead',
    channelLabel: '#ops-tooling · roadmap',
    chips: ['Internal tooling', 'Ops debt', 'SLA'],
    defaultDraft: `Cutline: fund the ops case console and refund audit trail.

Out: customer activity feed, manager dashboard, user mentions, and export styling.

Why: Ops is hand-stitching 320 escalations a month, which is now creating SLA misses for paying customers.

Tradeoff: we lose a more marketable roadmap item to remove a hidden operating bottleneck.

Ask: @ops names the pilot team by Thursday.`,
    seniorDraft: `Recommendation: fund the internal tooling because it is now customer-impacting.

In: ops case console and refund audit trail.

Out: customer activity feed, manager dashboard, user mentions, and export styling.

Why: Ops is hand-stitching 320 escalations a month, and the manual queue is causing SLA misses for paying customers.

Tradeoff: we give up a more marketable launch item to remove a hidden operating bottleneck.

Ask: @ops names the pilot team by Thursday; @liam confirms whether one engineer can stay on activity-feed discovery.`,
    annotations: [
      {
        title: 'Internal work earns its seat',
        body: 'The rationale connects tooling to customer SLA, not employee convenience alone.',
        color: 'mint',
      },
      {
        title: 'Launch optics are acknowledged',
        body: 'The tradeoff names the customer-facing feature being displaced.',
        color: 'gold',
      },
      {
        title: 'Pilot owner reduces ambiguity',
        body: 'The ask makes adoption part of the plan instead of assuming tooling impact will appear.',
        color: 'sky',
      },
    ],
  },
  {
    id: 'cutline-11',
    brief:
      'Data teams want a quarter to fix metric quality. Executives are asking for a refreshed dashboard for the next board meeting.',
    quote: `"The dashboard is prettier than the numbers are trustworthy."`,
    quoteAttribution: 'Analytics lead',
    channelLabel: '#data-quality · board-metrics',
    chips: ['Data quality', 'Metrics', 'Exec'],
    defaultDraft: `Data cutline: fund canonical account hierarchy, metric definitions, and freshness alerts.

Out: dashboard reskin, new chart types, team scorecards, and board animation polish.

Why: revenue and activation numbers disagree across systems. A prettier dashboard will only spread bad data faster.

Tradeoff: the next board view is less polished, but the numbers become defensible.

Ask: @anika signs metric definitions by Friday.`,
    seniorDraft: `Recommendation: fix metric quality before redesigning the dashboard.

In: canonical account hierarchy, metric definitions, and freshness alerts.

Out: dashboard reskin, new chart types, team scorecards, and board animation polish.

Why: revenue and activation numbers currently disagree across systems. Better visuals will only make bad data more persuasive.

Tradeoff: the next board view is less polished, but the underlying numbers become defensible.

Ask: @anika signs the metric definitions by Friday; I will move dashboard polish to the next planning pass.`,
    annotations: [
      {
        title: 'Truth before theater',
        body: 'The cutline prioritizes trust in the metric over presentation quality.',
        color: 'sky',
      },
      {
        title: 'The rejected work is tempting',
        body: 'Board polish has real pressure, which makes the no-list meaningful.',
        color: 'gold',
      },
      {
        title: 'Definitions are the dependency',
        body: 'The ask targets the decision needed before engineering can improve freshness and hierarchy.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'cutline-12',
    brief:
      'Pricing Council wants evidence before changing packaging. Sales wants discount tooling immediately for quarter-end deals.',
    quote: `"If we ship discount flexibility without telemetry, we will not know what we broke."`,
    quoteAttribution: 'Pricing lead',
    channelLabel: '#pricing · packaging',
    chips: ['Pricing', 'Telemetry', 'Sales'],
    defaultDraft: `Pricing cutline: fund packaging telemetry, annual discount guardrails, and expansion price preview.

Out: coupon builder, usage-based experiment, tier rename, and manual approval shortcuts.

Why: we need evidence before a packaging change. Guardrails protect quarter-end selling without turning pricing into exceptions.

Tradeoff: Sales gets fewer knobs now so we can learn cleanly.

Ask: @noah approves the measurement plan Tuesday.`,
    seniorDraft: `Recommendation: prioritize pricing instrumentation and guardrails over more discount flexibility.

In: packaging telemetry, annual discount guardrails, and expansion price preview.

Out: coupon builder, usage-based experiment, tier rename, and manual approval shortcuts.

Why: Pricing Council needs clean evidence before changing packaging. Guardrails still support quarter-end deals without creating unmeasured exceptions.

Tradeoff: Sales gets fewer knobs this quarter so we can learn without polluting the pricing data.

Ask: @noah approves the measurement plan Tuesday; I will publish the sales cutline after.`,
    annotations: [
      {
        title: 'Learning is protected',
        body: 'The in-list preserves telemetry before the team adds flexibility that could muddy the data.',
        color: 'mint',
      },
      {
        title: 'Sales pressure is handled',
        body: 'Guardrails give Sales a path without opening every discount knob.',
        color: 'gold',
      },
      {
        title: 'The no-list blocks exception creep',
        body: 'Manual shortcuts are cut because they undermine the pricing decision system.',
        color: 'hot',
      },
    ],
  },
  {
    id: 'cutline-13',
    brief:
      'Retention data shows a renewal-risk spike. Growth still wants the planned top-of-funnel campaign and freemium invite loop.',
    quote: `"Do we protect the base or keep funding the acquisition story?"`,
    quoteAttribution: 'Revenue operations',
    channelLabel: '#retention · roadmap-cut',
    chips: ['Retention', 'Growth', 'Renewals'],
    defaultDraft: `Retention cutline: fund renewal health triggers, downgrade save flow, and CSM action center.

Out: acquisition landing pages, partner promo, freemium invite loop, and lifecycle email redesign.

Why: 11 enterprise renewals are at risk in the next 60 days. These bets help identify and save existing revenue.

Tradeoff: top-of-funnel growth slows for one quarter.

Ask: @iris confirms the target accounts by EOD.`,
    seniorDraft: `Recommendation: make Q2 a retention quarter.

In: renewal health triggers, downgrade save flow, and CSM action center.

Out: acquisition landing pages, partner promo, freemium invite loop, and lifecycle email redesign.

Why: 11 enterprise renewals are at risk in the next 60 days. The selected work gives CSMs earlier signal and a save path.

Tradeoff: we slow top-of-funnel experimentation to protect existing revenue.

Ask: @iris confirms the target account list by EOD; @marin moves growth asks to the next planning review.`,
    annotations: [
      {
        title: 'Existing revenue wins',
        body: 'The cutline uses renewal timing to justify pausing acquisition work.',
        color: 'sky',
      },
      {
        title: 'Risk is quantified',
        body: 'Eleven renewals in 60 days makes the priority legible to growth and revenue teams.',
        color: 'gold',
      },
      {
        title: 'The displaced owner is named',
        body: 'Growth has a concrete next step instead of hearing an abstract no.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'cutline-14',
    brief:
      'The company shifted strategy from enterprise expansion to mid-market efficiency. The old roadmap still contains several enterprise-heavy bets.',
    quote: `"The strategy changed, but the roadmap did not."`,
    quoteAttribution: 'Chief Product Officer',
    channelLabel: '#roadmap-reset · strategy',
    chips: ['Roadmap reset', 'Strategy', 'ICP'],
    defaultDraft: `Roadmap reset: fund self-serve onboarding, plan migration, and billing transparency.

Out: enterprise workflow builder, bespoke approval rules, white-glove import tooling, and custom contract templates.

Why: the new FY strategy is mid-market efficiency. The in-list reduces sales and services dependency.

Tradeoff: we will disappoint some enterprise pipeline conversations.

Ask: @cpo confirms the customer-facing narrative by Monday.`,
    seniorDraft: `Recommendation: reset the roadmap to match the new mid-market strategy.

In: self-serve onboarding, plan migration, and billing transparency.

Out: enterprise workflow builder, bespoke approval rules, white-glove import tooling, and custom contract templates.

Why: the FY strategy now rewards efficient mid-market growth. These items reduce sales and services dependency.

Tradeoff: we will disappoint some enterprise pipeline conversations and lose a few bespoke deal accelerants.

Ask: @cpo confirms the narrative by Monday; I will send the revised roadmap with the out-list included.`,
    annotations: [
      {
        title: 'Strategy is operationalized',
        body: 'The memo turns the ICP shift into specific roadmap cuts.',
        color: 'sky',
      },
      {
        title: 'Pipeline pain is not hidden',
        body: 'The tradeoff makes the enterprise consequence explicit before Sales raises it.',
        color: 'gold',
      },
      {
        title: 'Narrative matters',
        body: 'The ask recognizes that a roadmap reset needs a customer-facing explanation, not just tickets.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'cutline-15',
    brief:
      'Engineering capacity was cut by 30% after planning started. The team must re-issue the roadmap without pretending the old plan still fits.',
    quote: `"Please do not bring me a heroic plan with fewer people and the same scope."`,
    quoteAttribution: 'VP Engineering',
    channelLabel: '#capacity-cut · replan',
    chips: ['Capacity cut', 'Replan', 'Roadmap'],
    defaultDraft: `Capacity replan: keep reliability fixes, compliance musts, and the single revenue blocker.

Out: experiments, UI polish, low-usage admin settings, and nice-to-have reporting.

Why: we went from eight engineers to five. The old scope would create a fake plan and late cuts.

Tradeoff: the quarter gets less novelty, but the committed work becomes credible.

Ask: @eng confirms the five-person allocation today.`,
    seniorDraft: `Recommendation: re-cut the roadmap for five engineers, not the old eight-person plan.

In: reliability fixes, compliance musts, and the single revenue blocker tied to Q3 bookings.

Out: experiments, UI polish, low-usage admin settings, and nice-to-have reporting.

Why: a 30% capacity cut makes the old plan impossible without quality risk and late thrash.

Tradeoff: the quarter has less novelty, but the committed work becomes credible.

Ask: @eng confirms allocation today; I will publish the revised commitment list tomorrow morning.`,
    annotations: [
      {
        title: 'No heroic planning',
        body: 'The memo refuses to carry old scope after capacity changed.',
        color: 'hot',
      },
      {
        title: 'Credibility is the value',
        body: 'The tradeoff favors a plan the team can actually deliver over a more exciting list.',
        color: 'sky',
      },
      {
        title: 'Timing is tight',
        body: 'The ask gives engineering one clear confirmation point so the replan can move.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'cutline-16',
    brief:
      'Launch is six weeks away. The team can ship the core workflow safely, but not every promised add-on.',
    quote: `"The date can hold only if the scope gets honest."`,
    quoteAttribution: 'Launch manager',
    channelLabel: '#launch · scope-lock',
    chips: ['Launch scope', 'GTM', 'Cutline'],
    defaultDraft: `Launch cutline: ship core checkout, invoicing, permissions, and alerting.

Out: advanced analytics, bulk import, localization, custom roles, and template gallery.

Why: the launch promise is safe transaction flow. The out-list is useful but not required for the first customer cohort.

Tradeoff: narrower launch story, lower operational risk.

Ask: @gtm aligns sales and comms to this scope by Friday.`,
    seniorDraft: `Recommendation: hold the launch date by narrowing scope.

In: core checkout, invoicing, permissions, and alerting.

Out: advanced analytics, bulk import, localization, custom roles, and template gallery.

Why: the launch promise is that customers can transact safely. The cut items improve breadth but are not required for the first cohort.

Tradeoff: the launch story is narrower, but operational risk is lower and QA can finish.

Ask: @gtm updates sales and comms to this scope by Friday before enablement starts.`,
    annotations: [
      {
        title: 'Promise defines scope',
        body: 'The in-list is tied to the launch promise, not stakeholder wish lists.',
        color: 'sky',
      },
      {
        title: 'Date and scope are linked',
        body: 'The memo makes the tradeoff between launch date and add-ons explicit.',
        color: 'gold',
      },
      {
        title: 'GTM must absorb the cutline',
        body: 'The ask prevents sales and comms from selling the old scope.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'cutline-17',
    brief:
      'Partnerships wants six integrations for a marketplace announcement. Product can only support OAuth foundations and three high-demand CRM mappings.',
    quote: `"A bigger logo slide is not the same as a better integration strategy."`,
    quoteAttribution: 'Product partnerships lead',
    channelLabel: '#partner-marketplace · integrations',
    chips: ['Partners', 'Integrations', 'Marketplace'],
    defaultDraft: `Partner cutline: fund OAuth foundations and the top three CRM mappings.

Out: six long-tail connectors, partner co-marketing portal, custom Zapier fields, and marketplace badges.

Why: 74% of integration pipeline depends on CRM reliability. The long tail makes the announcement bigger but not more useful.

Tradeoff: smaller launch surface, stronger integration quality.

Ask: @ali confirms the top three partner targets by Wednesday.`,
    seniorDraft: `Recommendation: ship fewer integrations with better foundations.

In: OAuth foundations and the top three CRM mappings.

Out: six long-tail connectors, partner co-marketing portal, custom Zapier fields, and marketplace badges.

Why: 74% of integration pipeline depends on CRM reliability. OAuth foundations also reduce maintenance cost for future connectors.

Tradeoff: the marketplace announcement has fewer logos, but the integrations customers use most are more reliable.

Ask: @ali confirms the top three partner targets by Wednesday; I will update the launch list after.`,
    annotations: [
      {
        title: 'Logo count is challenged',
        body: 'The memo rejects a vanity metric in favor of usage-weighted integration quality.',
        color: 'hot',
      },
      {
        title: 'Foundation plus focus',
        body: 'The in-list combines platform leverage with a narrow customer-facing set.',
        color: 'mint',
      },
      {
        title: 'Partner ask is concrete',
        body: 'Partnerships must choose the top three instead of keeping the six-logo story alive.',
        color: 'sky',
      },
    ],
  },
  {
    id: 'cutline-18',
    brief:
      'A billing incident exposed retry and idempotency gaps. Product still has a planned real-time activity feed for the upcoming release.',
    quote: `"We can launch the feed, but customers are still asking why duplicates happened."`,
    quoteAttribution: 'Customer success director',
    channelLabel: '#post-incident · hardening',
    chips: ['Incident', 'Reliability', 'Trust'],
    defaultDraft: `Post-incident cutline: fund idempotency keys, retry backoff, and runbook automation.

Out: real-time activity feed, notification rebrand, beta flags, and dashboard empty states.

Why: duplicate charges created customer trust damage. Hardening the transaction path beats adding visibility on top of fragile behavior.

Tradeoff: the release loses its splashiest feature.

Ask: @sre publishes owner mapping by tomorrow.`,
    seniorDraft: `Recommendation: prioritize incident hardening over the activity-feed release.

In: idempotency keys, retry backoff, and runbook automation.

Out: real-time activity feed, notification rebrand, beta flags, and dashboard empty states.

Why: duplicate charges damaged customer trust. We should fix the transaction path before adding more visibility around it.

Tradeoff: the release loses its splashiest feature, but we reduce repeat-incident risk.

Ask: @sre publishes owner mapping by tomorrow; I will send the customer-safe roadmap note after.`,
    annotations: [
      {
        title: 'Trust outranks splash',
        body: 'The cutline favors reliability work after an incident instead of moving on to a shinier release.',
        color: 'hot',
      },
      {
        title: 'Root cause drives priority',
        body: 'Idempotency and retry behavior connect directly to duplicate charge risk.',
        color: 'sky',
      },
      {
        title: 'External comms are anticipated',
        body: 'The ask sets up a customer-safe roadmap note once ownership is clear.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'cutline-19',
    brief:
      'Activation is below target. Design wants a brand refresh, while Growth wants to fix invite reliability and first-run setup.',
    quote: `"The product looks better than it activates."`,
    quoteAttribution: 'Growth PM',
    channelLabel: '#activation · onboarding',
    chips: ['Activation', 'Onboarding', 'Growth'],
    defaultDraft: `Activation cutline: fund invite reliability, first-run setup, and role templates.

Out: brand refresh, in-app education redesign, referral widget, and admin wallpaper.

Why: activation leaks at invite acceptance and first configuration. Brand polish will not fix the conversion gap.

Tradeoff: the product looks less refreshed this quarter, but more teams reach value.

Ask: @growth confirms the activation metric by Monday.`,
    seniorDraft: `Recommendation: fund activation mechanics before brand polish.

In: invite reliability, first-run setup, and role templates.

Out: brand refresh, in-app education redesign, referral widget, and admin wallpaper.

Why: activation is leaking at invite acceptance and first configuration. These fixes target the steps where teams fail to reach value.

Tradeoff: the product looks less refreshed this quarter, but conversion work gets the capacity it needs.

Ask: @growth confirms the activation metric by Monday; @design keeps only research running for the refresh.`,
    annotations: [
      {
        title: 'Conversion beats cosmetics',
        body: 'The memo names the specific activation steps instead of arguing against design generally.',
        color: 'sky',
      },
      {
        title: 'Design still has a path',
        body: 'Keeping research alive makes the no less brittle while preserving the capacity cut.',
        color: 'mint',
      },
      {
        title: 'Metric lock matters',
        body: 'The ask prevents the team from optimizing onboarding without agreeing on the target.',
        color: 'gold',
      },
    ],
  },
  {
    id: 'cutline-20',
    brief:
      'After an acquisition, leadership asked for a unified roadmap that fits one shared team. Compliance, migration, AI, and pricing all want priority.',
    quote: `"This cannot be four strategies stacked on top of one team."`,
    quoteAttribution: 'GM',
    channelLabel: '#roadmap · unified-cutline',
    chips: ['Portfolio cutline', 'Acquisition', 'Leadership'],
    defaultDraft: `Unified cutline: fund compliance deadline, billing migration, and retention-risk work.

Out: AI demo, pricing experiment, internal tool refresh, and partner marketplace expansion.

Why: one team cannot carry four strategies. These three protect contractual commitments and existing revenue first.

Tradeoff: the roadmap has less novelty and fewer launch moments.

Ask: @leadership confirms this sequence by Friday.`,
    seniorDraft: `Recommendation: sequence the unified roadmap around obligation before upside.

In: compliance deadline, billing migration, and retention-risk work.

Out: AI demo, pricing experiment, internal tool refresh, and partner marketplace expansion.

Why: after the acquisition, one shared team cannot carry four strategies. The in-list protects contractual commitments and existing revenue.

Tradeoff: we lose novelty and launch moments this quarter to reduce obligation and migration risk.

Ask: @leadership confirms the sequence by Friday; I will convert it into the shared roadmap doc.`,
    annotations: [
      {
        title: 'Portfolio principle is clear',
        body: 'Obligation before upside gives leadership a repeatable rule for the merged roadmap.',
        color: 'sky',
      },
      {
        title: 'Novelty is intentionally cut',
        body: 'AI and pricing are attractive bets, which makes their deferral a real tradeoff.',
        color: 'gold',
      },
      {
        title: 'Leadership owns the sequence',
        body: 'The ask puts confirmation with the group that requested the unified roadmap.',
        color: 'mint',
      },
    ],
  },
]

export const CUTLINE_EXTRA_SCENARIOS = createLaneScenarios(CUTLINE_META, CUTLINE_SEEDS)
