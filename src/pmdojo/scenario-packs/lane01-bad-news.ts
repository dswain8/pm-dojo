import { createLaneScenarios } from '../scenarioFactory'

const BAD_NEWS_META: Parameters<typeof createLaneScenarios>[0] = {
  laneId: '01',
  code: 'LANE 01',
  title: 'Bad-News Update',
  tag: 'ESCALATION',
  rail: '#ff5b3a',
  diff: 'HARD',
  pressure: 'POLITICAL · HOT',
  objectiveTitle: 'Internal Slack update',
  objectiveCopy: 'Under 120 words. Lead with the call, separate evidence from unknowns, and assign the next move.',
  wordLimit: 120,
  skillDeltas: {
    comms: 0.1,
    escal: 0.16,
    prio: 0.04,
    disco: 0,
    narr: 0.04,
  },
  coachHit: 'You kept the room in decision mode by pairing the bad news with an owner, a clock, and a safe next line.',
  coachMiss: 'This lane punishes vague concern. Name the customer-safe path, the tradeoff, and who moves by when.',
  seniorName: 'Maya L.',
  seniorRole: 'Senior PM, Stripe',
  focusPrinciple: 'ask',
  emphasis: 'escalation',
}

export const BAD_NEWS_EXTRA_SCENARIOS = createLaneScenarios(BAD_NEWS_META, [
  {
    id: 'bad-news-03',
    brief:
      'A Fortune 100 customer found that your new permissions rollout removed admin access for 42 managers during payroll approval week. Their CIO is asking for a public RCA.',
    quote: `"We cannot approve payroll with admins locked out. I need a real answer in the next hour."`,
    quoteAttribution: 'CIO, Meridian Foods',
    channelLabel: '#enterprise-escalations · draft',
    chips: ['Slack', '<=120w', 'customer'],
    defaultDraft: `Update: Meridian is blocked on payroll approvals because 42 admins lost access after the permissions rollout.

Rec: restore the old permission mapping for Meridian today, then run RCA before we re-enable the rollout for them.

Risk: rollback delays the new model for one enterprise customer, but avoids payroll exposure.

Need @alex to confirm restore timing by 2pm and @rhea to draft the customer-safe line by 2:30pm.`,
    seniorDraft: `Rec: rollback Meridian to the old permission mapping now; do not defend the new rollout until payroll approval is unblocked.

Evidence: 42 admins lost access during payroll week. Their CIO asked for an RCA within an hour.

Tradeoff: this delays the permissions rollout for one enterprise, but the larger risk is payroll failure and executive escalation.

Need @alex restore ETA by 2pm, @rhea customer-safe line by 2:30pm, and I will send the CIO holding update by 3pm.`,
    annotations: [
      {
        title: 'Recommendation first',
        body: 'The draft chooses rollback before explaining the rollout history.',
        color: 'hot',
      },
      {
        title: 'Customer-safe restraint',
        body: 'It avoids premature RCA claims while still giving the CIO a credible holding update.',
        color: 'mint',
      },
      {
        title: 'Named recovery path',
        body: 'Restore owner, comms owner, and customer timing are all explicit.',
        color: 'sky',
      },
    ],
    cues: [
      { color: 'hot', text: 'payroll approval is at risk' },
      { color: 'gold', text: 'CIO wants RCA in 1h' },
      { color: 'mint', text: 'rollback is politically safer' },
    ],
  },
  {
    id: 'bad-news-04',
    brief:
      'The mobile launch you announced to Sales has a crash rate spike in the staged rollout. Marketing has a launch email queued for 8am tomorrow.',
    quote: `"Are we still green? I need to know before the email locks."`,
    quoteAttribution: 'Head of Lifecycle Marketing',
    channelLabel: '#mobile-launch · draft',
    chips: ['Slack', '<=120w', 'launch'],
    defaultDraft: `Rec: pause tomorrow's launch email and hold rollout at 10% until crash rate is back under threshold.

Evidence: staged cohort crash rate moved from 0.4% to 3.1% after the payment-sheet change.

Risk: pausing creates a Sales comms cleanup, but sending the email points customers at a broken path.

Need @maya to freeze lifecycle by 6pm, @ken to own crash fix ETA, and @liz to send the field line today.`,
    seniorDraft: `Decision: pause the 8am launch email; keep mobile rollout capped at 10% until crash rate is under 1%.

Evidence: crash rate is 3.1% in staged rollout, up from 0.4%, concentrated on the new payment sheet.

Tradeoff: we absorb a GTM reset today instead of creating customer-visible failure tomorrow.

Need @maya to freeze the email by 6pm, @ken fix ETA by 7pm, @liz AM-safe field line by EOD.`,
    annotations: [
      {
        title: 'Launch call, not status',
        body: 'The first sentence gives Marketing the decision they need before lock.',
        color: 'hot',
      },
      {
        title: 'Threshold included',
        body: 'A concrete crash-rate bar makes the restart condition measurable.',
        color: 'sky',
      },
      {
        title: 'GTM tradeoff named',
        body: 'It admits the Sales cleanup cost without letting that override product quality.',
        color: 'gold',
      },
    ],
  },
  {
    id: 'bad-news-05',
    brief:
      'Finance found that a proration bug overcharged 73 SMB customers on renewal invoices. Support wants to know whether to proactively notify customers before refunds are ready.',
    quote: `"If customers discover this first, we lose the trust argument. What can we say now?"`,
    quoteAttribution: 'VP Support',
    channelLabel: '#billing-incident · draft',
    chips: ['Slack', '<=120w', 'billing'],
    defaultDraft: `Rec: proactively notify affected customers today with a correction promise, not a refund ETA we have not confirmed.

Known: 73 SMB renewal invoices included incorrect proration charges.

Unknown: final refund amounts until Finance completes reconciliation.

Risk: waiting lowers inbound volume today but makes us look evasive if customers find it.

Need @devon final customer list by 1pm, @ira refund timing by 3pm, and I will send the customer-safe note by 4pm.`,
    seniorDraft: `Rec: notify the 73 affected customers today and separate the apology from the refund ETA.

Evidence: renewal invoices overcharged due to proration logic; Finance is still reconciling exact credits.

Customer-safe line: "We found an invoice calculation error on your renewal and will correct it without action from you."

Tradeoff: proactive comms may create tickets today, but hiding until refunds are ready is a trust risk.

Need @devon customer list by 1pm, @ira credit timing by 3pm, final note by 4pm.`,
    annotations: [
      {
        title: 'Proactive stance',
        body: 'The recommendation chooses trust over short-term ticket avoidance.',
        color: 'hot',
      },
      {
        title: 'Known and unknown split',
        body: 'It confirms the billing error without inventing exact refund amounts.',
        color: 'gold',
      },
      {
        title: 'Safe external line',
        body: 'The customer wording is clear, owned, and avoids legal overreach.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'bad-news-06',
    brief:
      'Legal blocked a promised analytics export because it may expose employee-level health data in two EU countries. The beta customer expects access tomorrow.',
    quote: `"We promised this in the beta plan. Can I tell them it is delayed, or is there a narrower version?"`,
    quoteAttribution: 'Enterprise CSM',
    channelLabel: '#privacy-review · draft',
    chips: ['Slack', '<=120w', 'legal'],
    defaultDraft: `Rec: do not release the employee-level export tomorrow. Offer the customer an aggregated export while Legal reviews EU health-data exposure.

Evidence: Legal flagged two countries where row-level data could expose sensitive attributes.

Risk: narrower export disappoints the beta customer, but shipping the full export creates privacy exposure.

Need @lena to confirm compliant aggregation by 4pm, @marco to validate scope, and I will send the CSM-safe line today.`,
    seniorDraft: `Decision: block the full analytics export for tomorrow; offer only aggregated data until Legal clears EU health-data handling.

Evidence: Legal found employee-level rows could expose sensitive attributes in two EU countries.

Tradeoff: we risk beta disappointment, but the alternative is releasing a feature we may not be allowed to operate.

Need @lena compliant aggregation check by 4pm, @marco legal scope by 5pm, and I will give the CSM an external-safe line before EOD.`,
    annotations: [
      {
        title: 'Legal constraint respected',
        body: 'The draft does not negotiate with privacy risk as if it were a roadmap preference.',
        color: 'hot',
      },
      {
        title: 'Narrower path offered',
        body: 'It gives Sales something truthful to offer instead of only saying no.',
        color: 'mint',
      },
      {
        title: 'Explicit external boundary',
        body: 'The CSM gets a safe line only after Legal validates the scope.',
        color: 'sky',
      },
    ],
  },
  {
    id: 'bad-news-07',
    brief:
      'A $1.8M ARR renewal is two weeks out. The customer discovered that the roadmap slide promised SSO audit logs this quarter, but engineering cut it from the release yesterday.',
    quote: `"Their procurement team is asking whether this is still committed. We need the renewal answer today."`,
    quoteAttribution: 'Strategic AE',
    channelLabel: '#renewal-war-room · draft',
    chips: ['Slack', '<=120w', 'renewal'],
    defaultDraft: `Rec: tell the customer SSO audit logs are not committed this quarter and offer a dated design-review checkpoint instead.

Evidence: eng cut the item yesterday; renewal is $1.8M ARR and procurement is asking today.

Risk: a softer answer may save the call but creates a commitment we cannot meet.

Need @pavel to confirm earliest feasible delivery by 3pm and @sara to approve the renewal-safe line by 4pm.`,
    seniorDraft: `Rec: do not reconfirm SSO audit logs for this quarter. Offer a design-review checkpoint next Friday plus a delivery range after eng sizing.

Evidence: the item was cut yesterday; customer renewal is $1.8M ARR and procurement asked for a commitment today.

Tradeoff: this may weaken the renewal posture, but a false date is worse than a hard truth.

Need @pavel earliest feasible window by 3pm, @sara renewal-safe language by 4pm, AE update by 4:30pm.`,
    annotations: [
      {
        title: 'No fake commitment',
        body: 'The recommendation protects renewal trust by refusing to invent a quarter date.',
        color: 'hot',
      },
      {
        title: 'ARR evidence',
        body: 'The $1.8M figure makes the risk concrete without letting it distort the truth.',
        color: 'sky',
      },
      {
        title: 'Alternative next step',
        body: 'A design-review checkpoint gives GTM a credible path that is not a promise.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'bad-news-08',
    brief:
      'Sales is demoing a usage-based pricing calculator tomorrow, but Product has not approved the discount guardrails. RevOps warns the model can quote below margin.',
    quote: `"If we pull this now, the field will be furious. If we don't, we may create bad deals."`,
    quoteAttribution: 'RevOps Lead',
    channelLabel: '#pricing-launch · draft',
    chips: ['Slack', '<=120w', 'GTM'],
    defaultDraft: `Rec: pull tomorrow's calculator demo from field enablement until discount floors are locked.

Evidence: RevOps found the model can quote below margin on high-usage accounts.

Risk: Sales loses a demo asset for a day, but shipping it creates unapproved deal economics.

Need @nora to set minimum floors by noon tomorrow, @cal to update enablement, and I will send the field-safe note by 5pm today.`,
    seniorDraft: `Decision: do not demo the pricing calculator tomorrow unless discount floors are locked first.

Evidence: RevOps can produce below-margin quotes for high-usage accounts in the current model.

Tradeoff: the field loses a promised asset for 24h, but the bigger risk is anchoring customers on economics we cannot approve.

Need @nora final floors by noon tomorrow, @cal remove the enablement slide today, and I will send the AM-safe explanation by 5pm.`,
    annotations: [
      {
        title: 'GTM friction accepted',
        body: 'The draft names Sales frustration but prioritizes deal-quality risk.',
        color: 'gold',
      },
      {
        title: 'Concrete failure mode',
        body: 'Below-margin quoting is a sharper reason than generic readiness concern.',
        color: 'sky',
      },
      {
        title: 'Field-safe path',
        body: 'It tells enablement what to remove and when the replacement answer arrives.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'bad-news-09',
    brief:
      'A regional database failover caused intermittent 500s for admins changing employee bank accounts. Payroll close starts in four hours for APAC customers.',
    quote: `"Support is getting payroll panic. Is this contained enough to tell customers to retry?"`,
    quoteAttribution: 'Incident Commander',
    channelLabel: '#infra-incident · draft',
    chips: ['Slack', '<=120w', 'outage'],
    defaultDraft: `Rec: do not tell customers to retry yet. Keep the incident open until bank-account change success rate is stable for 30 minutes.

Evidence: APAC admins are seeing intermittent 500s and payroll close starts in four hours.

Risk: premature all-clear creates payroll failures; holding adds support pressure now.

Need @sameer stability metric by 11am, @joy customer impact list by 11:15, and I will send the support-safe line by 11:30.`,
    seniorDraft: `Rec: keep customer guidance at "we are validating recovery"; do not tell admins to retry until success rate is stable for 30 minutes.

Evidence: bank-account changes are throwing intermittent 500s during APAC payroll close, four hours before cutoff.

Tradeoff: Support takes more inbound now, but a premature all-clear could create failed payroll changes.

Need @sameer recovery metric by 11am, @joy impacted customers by 11:15, support-safe update from me by 11:30.`,
    annotations: [
      {
        title: 'No premature all-clear',
        body: 'The draft prevents Support from converting a partial recovery into customer risk.',
        color: 'hot',
      },
      {
        title: 'Operational threshold',
        body: 'Stable for 30 minutes gives engineering and Support the same recovery bar.',
        color: 'sky',
      },
      {
        title: 'Payroll context',
        body: 'APAC payroll close explains why this is more than a generic 500 spike.',
        color: 'gold',
      },
    ],
  },
  {
    id: 'bad-news-10',
    brief:
      'The CEO is about to cite a 28% activation lift in all-hands, but Analytics discovered the dashboard double-counted reactivated accounts. The true lift is closer to 9%.',
    quote: `"The slide is in the deck. Are we changing it or caveating it?"`,
    quoteAttribution: 'Chief of Staff',
    channelLabel: '#exec-comms · draft',
    chips: ['Slack', '<=120w', 'metric'],
    defaultDraft: `Rec: change the all-hands slide now to 9% verified lift and remove the 28% claim.

Evidence: Analytics found reactivated accounts were double-counted in the activation dashboard.

Risk: the smaller number is less exciting, but the current slide is not exec-safe.

Need @avni to confirm the corrected query by 2pm, @miles to update the deck, and I will send the CEO-safe line by 2:30.`,
    seniorDraft: `Decision: replace the 28% activation lift with the verified 9% lift before all-hands.

Evidence: the dashboard double-counted reactivated accounts; Analytics has a corrected query in review.

Tradeoff: the story gets less punchy, but leaving the inflated number creates an avoidable credibility issue for the CEO.

Need @avni query confirmation by 2pm, @miles deck update by 2:15, and I will send the exec-safe wording by 2:30.`,
    annotations: [
      {
        title: 'Protects the exec',
        body: 'The recommendation makes the CEO forward-safe instead of optimizing the slide story.',
        color: 'hot',
      },
      {
        title: 'Corrected evidence',
        body: 'It names why the old metric is wrong and what number is verified.',
        color: 'sky',
      },
      {
        title: 'No caveat dodge',
        body: 'The draft chooses replacement over a vague footnote that still spreads the bad number.',
        color: 'gold',
      },
    ],
  },
  {
    id: 'bad-news-11',
    brief:
      'A vendor dependency for identity verification slipped by three weeks. Your onboarding redesign cannot hit the promised pilot date without removing automated checks.',
    quote: `"Can we still make the pilot if we turn off the vendor piece?"`,
    quoteAttribution: 'GM, Platform',
    channelLabel: '#onboarding-pilot · draft',
    chips: ['Slack', '<=120w', 'dependency'],
    defaultDraft: `Rec: slip the onboarding pilot by three weeks rather than remove automated identity checks.

Evidence: the vendor pushed verification readiness; without it, the pilot relies on manual review.

Risk: delay hurts the Q2 proof point, but manual checks weaken fraud controls and support scale.

Need @tomas to confirm the vendor date by 5pm, @hana to resize manual fallback, and I will send the pilot-safe update tomorrow morning.`,
    seniorDraft: `Rec: move the onboarding pilot date by three weeks; do not launch by removing automated identity checks.

Evidence: the vendor dependency slipped and manual review would be the only control for pilot accounts.

Tradeoff: we lose the Q2 proof point timing, but launching with weaker fraud controls creates a worse customer and risk story.

Need @tomas vendor-confirmed date by 5pm, @hana fallback cost by tomorrow 10am, and I will send the customer-safe pilot update after that.`,
    annotations: [
      {
        title: 'Dependency translated',
        body: 'The vendor slip is framed as a launch-safety decision, not vendor trivia.',
        color: 'gold',
      },
      {
        title: 'Unsafe workaround rejected',
        body: 'It explicitly says not to remove the control to preserve a date.',
        color: 'hot',
      },
      {
        title: 'Fallback input requested',
        body: 'Manual-review sizing is assigned before customer communication changes.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'bad-news-12',
    brief:
      'Your VP learned from a customer call that the self-serve downgrade flow was removed from scope last week. The executive roadmap still shows it as launching this month.',
    quote: `"I do not want to be surprised by customers on my own roadmap. What changed?"`,
    quoteAttribution: 'VP Product',
    channelLabel: '#exec-roadmap · draft',
    chips: ['Slack', '<=120w', 'exec'],
    defaultDraft: `Update: the roadmap slide is wrong. Self-serve downgrade was cut last week and will not launch this month.

Rec: send a correction to leadership today with the reason, current mitigation, and new decision date.

Evidence: Support risk work took the capacity; downgrade remains manual.

Risk: this is an exec surprise, but correcting now prevents more customer-call confusion.

Need @priya capacity note by 1pm and @leo deck correction by 2pm.`,
    seniorDraft: `Update: leadership has stale roadmap info. Self-serve downgrade was cut last week and should be removed from this month's launch slide.

Evidence: Support-risk work consumed the capacity; downgrades remain manual for now.

Tradeoff: the correction is uncomfortable, but letting execs repeat a dead date is worse.

Need @priya capacity rationale by 1pm, @leo deck correction by 2pm, and I will send VP-safe language with the new decision date by 2:30.`,
    annotations: [
      {
        title: 'Owns the surprise',
        body: 'The draft names stale roadmap info directly instead of burying it in process context.',
        color: 'hot',
      },
      {
        title: 'Reason, not excuse',
        body: 'Capacity shifted to Support risk; that explains the change without blaming the team.',
        color: 'gold',
      },
      {
        title: 'Leadership-safe correction',
        body: 'Deck owner, rationale owner, and VP wording are all assigned.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'bad-news-13',
    brief:
      'Enablement trained the field to pitch a new admin analytics pack, but the SKU is not orderable in CPQ. AEs are in live late-stage calls this afternoon.',
    quote: `"The deck says sell it now. CPQ says it does not exist. What do we tell reps?"`,
    quoteAttribution: 'Sales Enablement Manager',
    channelLabel: '#field-enablement · draft',
    chips: ['Slack', '<=120w', 'field'],
    defaultDraft: `Rec: tell reps not to quote the analytics pack today; use discovery language only until CPQ is live.

Evidence: enablement deck says sell now, but the SKU is not orderable.

Risk: pausing hurts late-stage momentum, but quoting a non-orderable SKU creates deal cleanup.

Need @ravi CPQ ETA by 2pm, @megan deck patch by 2:30, and I will send the field-safe line before afternoon calls.`,
    seniorDraft: `Decision: field should not quote the admin analytics pack today. Use discovery-only language until CPQ has an orderable SKU.

Evidence: reps were trained to sell now, but CPQ cannot generate the SKU for late-stage deals.

Tradeoff: we slow some calls this afternoon, but quoting a non-orderable product creates customer and RevOps cleanup.

Need @ravi CPQ ETA by 2pm, @megan enablement patch by 2:30, field-safe line from me by 2:45.`,
    annotations: [
      {
        title: 'Clear rep instruction',
        body: 'Reps get a do-not-quote instruction, not an ambiguous readiness note.',
        color: 'hot',
      },
      {
        title: 'Operational evidence',
        body: 'The problem is concrete: the SKU cannot be ordered in CPQ.',
        color: 'sky',
      },
      {
        title: 'Safe alternate language',
        body: 'Discovery-only keeps conversations alive without creating false availability.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'bad-news-14',
    brief:
      'A migration from legacy plans to the new subscription service failed for 31 customers. The old system now shows canceled add-ons while the new system shows active entitlements.',
    quote: `"Support is seeing contradictory account state. Can we tell customers their access is safe?"`,
    quoteAttribution: 'Billing Ops Lead',
    channelLabel: '#subscription-migration · draft',
    chips: ['Slack', '<=120w', 'migration'],
    defaultDraft: `Rec: stop the migration batch and do not confirm access is safe until we reconcile the 31 accounts.

Known: legacy plans show canceled add-ons while new entitlements show active access.

Risk: telling customers access is safe before reconciliation could hide billing or permission errors.

Need @elena to freeze the batch now, @noah reconciliation list by 3pm, and I will send Support a holding line by 3:30.`,
    seniorDraft: `Decision: freeze the migration batch now; Support should use a holding line until the 31 accounts are reconciled.

Evidence: legacy plans show canceled add-ons while the new subscription service shows active entitlements.

Tradeoff: freezing slows migration progress, but telling customers access is safe before reconciliation risks billing and permission errors.

Need @elena batch freeze confirmation now, @noah account-level reconciliation by 3pm, and I will send Support-safe language by 3:30.`,
    annotations: [
      {
        title: 'Migration stop called',
        body: 'The first move is to freeze the batch, not to keep investigating while damage spreads.',
        color: 'hot',
      },
      {
        title: 'Contradiction preserved',
        body: 'It repeats the two conflicting systems so the room knows exactly what is unsafe.',
        color: 'sky',
      },
      {
        title: 'Support boundary',
        body: 'Support gets holding language instead of an unearned all-clear.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'bad-news-15',
    brief:
      'A customer advisory board starts in 45 minutes. The flagship demo environment has stale payroll data from another account due to a seed script error.',
    quote: `"Do we cancel the demo, sanitize it manually, or avoid that section?"`,
    quoteAttribution: 'Product Marketing Lead',
    channelLabel: '#cab-demo · draft',
    chips: ['Slack', '<=120w', 'demo'],
    defaultDraft: `Rec: remove the payroll section from today's CAB demo; do not manually sanitize live data under time pressure.

Evidence: seed script pulled stale payroll data from another account into the demo environment.

Risk: skipping the section weakens the story, but showing or rushing sensitive data cleanup is worse.

Need @liam to disable the section by 1pm, @zoe to update talk track, and I will send the customer-safe moderator note by 1:10.`,
    seniorDraft: `Decision: cut the payroll section from today's CAB demo. Do not manually sanitize the environment 45 minutes before customers join.

Evidence: demo seed data includes stale payroll records from another account.

Tradeoff: the demo loses the strongest workflow, but rushed cleanup creates confidentiality risk and a worse live failure.

Need @liam section disabled by 1pm, @zoe revised talk track by 1:05, and I will send the moderator-safe line by 1:10.`,
    annotations: [
      {
        title: 'Sensitive data discipline',
        body: 'The recommendation refuses a risky manual fix minutes before customers arrive.',
        color: 'hot',
      },
      {
        title: 'CAB tradeoff named',
        body: 'It acknowledges the story gets weaker without making that the deciding factor.',
        color: 'gold',
      },
      {
        title: 'Minute-level owners',
        body: 'In a 45-minute window, exact owners and times make the recovery credible.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'bad-news-16',
    brief:
      'An API partner says your webhook retry change caused duplicate benefit enrollment events. Two shared customers are asking which system is the source of truth.',
    quote: `"We need a joint answer before their admins start deleting enrollments manually."`,
    quoteAttribution: 'Partner Engineering Manager',
    channelLabel: '#partner-incident · draft',
    chips: ['Slack', '<=120w', 'partner'],
    defaultDraft: `Rec: tell shared customers not to manually delete enrollments; pause retries for the affected partner while we reconcile duplicates.

Evidence: webhook retry change appears tied to duplicate benefit enrollment events for two customers.

Risk: pausing retries may delay new events, but manual cleanup could corrupt source-of-truth state.

Need @owen to pause retries by 12pm, @mia duplicate list by 1pm, and I will send the partner-safe line by 1:30.`,
    seniorDraft: `Rec: pause webhook retries for this partner and tell admins not to manually delete duplicate enrollments.

Evidence: two shared customers have duplicate benefit enrollment events after our retry change.

Tradeoff: pausing retries can delay new events, but manual deletion risks corrupting source-of-truth state across systems.

Need @owen retry pause by 12pm, @mia duplicate-event list by 1pm, partner-safe joint language from me by 1:30 after we confirm reconciliation ownership.`,
    annotations: [
      {
        title: 'Prevents customer workaround',
        body: 'The draft blocks manual deletion before admins create harder-to-reconcile damage.',
        color: 'hot',
      },
      {
        title: 'Partner-safe framing',
        body: 'It uses appears tied to until reconciliation confirms exact causality.',
        color: 'mint',
      },
      {
        title: 'Source-of-truth risk',
        body: 'The tradeoff is framed around data integrity, not partner blame.',
        color: 'sky',
      },
    ],
  },
  {
    id: 'bad-news-17',
    brief:
      'A scheduled price increase notice went to 9,400 customers with the wrong effective date. Customer Marketing wants to send a correction immediately.',
    quote: `"The inbox is already lighting up. Do we correct the date now or wait for Billing to confirm impact?"`,
    quoteAttribution: 'Customer Marketing Director',
    channelLabel: '#customer-comms · draft',
    chips: ['Slack', '<=120w', 'comms'],
    defaultDraft: `Rec: send a correction today, but only state the verified effective date and avoid account-specific billing impact until Billing confirms.

Evidence: 9,400 customers received the wrong price-increase date.

Risk: waiting increases confusion; over-explaining now could create inaccurate account promises.

Need @bea verified date by 3pm, @omar impacted segments by 4pm, and I will approve the customer-safe correction by 4:30.`,
    seniorDraft: `Rec: send a correction today with the verified effective date; do not include account-specific billing impact yet.

Evidence: 9,400 customers received a price-increase notice with the wrong date and Support is already seeing inbound.

Tradeoff: a narrow correction may feel incomplete, but waiting lets the wrong date spread while detailed impact is still unconfirmed.

Need @bea date verification by 3pm, @omar segment impact by 4pm, customer-safe correction approved by 4:30.`,
    annotations: [
      {
        title: 'Corrects fast',
        body: 'The draft does not wait for perfect impact analysis before fixing the false date.',
        color: 'hot',
      },
      {
        title: 'Scope controlled',
        body: 'It limits the correction to verified information and avoids account-specific promises.',
        color: 'mint',
      },
      {
        title: 'Evidence of urgency',
        body: 'The customer count and inbound signal justify moving today.',
        color: 'sky',
      },
    ],
  },
  {
    id: 'bad-news-18',
    brief:
      'A new AI support deflection feature answered 18 payroll tax questions with outdated state guidance. The support queue dropped, but Legal is worried about reliance risk.',
    quote: `"The metric looks great, but we may have given wrong tax guidance. What is the PM call?"`,
    quoteAttribution: 'Legal Counsel',
    channelLabel: '#ai-support · draft',
    chips: ['Slack', '<=120w', 'AI risk'],
    defaultDraft: `Rec: disable AI answers for payroll tax topics today and route those tickets to human support until content is revalidated.

Evidence: 18 responses used outdated state guidance while deflection metrics improved.

Risk: disabling hurts the support KPI, but incorrect tax guidance creates customer reliance risk.

Need @neel topic block by 2pm, @faye affected-response list by 3pm, and I will send the support-safe line by 3:30.`,
    seniorDraft: `Decision: turn off AI answers for payroll tax topics today; keep summarization only until state guidance is revalidated.

Evidence: 18 customer responses used outdated tax guidance even though deflection improved.

Tradeoff: we give back support-volume wins, but continuing creates reliance risk on potentially wrong tax advice.

Need @neel topic block by 2pm, @faye affected customers by 3pm, and I will send Support and Legal the customer-safe line by 3:30.`,
    annotations: [
      {
        title: 'Metric does not win',
        body: 'The draft refuses to let deflection improvement override legal/customer risk.',
        color: 'hot',
      },
      {
        title: 'Narrow mitigation',
        body: 'It disables tax answers without killing every AI support capability.',
        color: 'mint',
      },
      {
        title: 'Affected-response owner',
        body: 'The list of customers who received bad guidance has a named owner and deadline.',
        color: 'sky',
      },
    ],
  },
  {
    id: 'bad-news-19',
    brief:
      'A payroll cutoff reminder was not sent to 620 admins because the notification service dropped a segment filter. Some customers may miss same-day submission.',
    quote: `"Can we blast everyone now, or will that create more confusion?"`,
    quoteAttribution: 'Lifecycle Ops Lead',
    channelLabel: '#payroll-notifications · draft',
    chips: ['Slack', '<=120w', 'payroll'],
    defaultDraft: `Rec: send a targeted late reminder to the 620 missed admins now; do not blast all customers.

Evidence: notification service dropped the segment filter for the payroll cutoff reminder.

Risk: broad resend creates duplicate/conflicting notices, but targeted resend may still be late for same-day submission.

Need @mina exact missed segment by 10am, @raj send readiness by 10:15, and Support-safe language from me by 10:30.`,
    seniorDraft: `Decision: send a targeted late reminder to the 620 missed admins; no all-customer blast.

Evidence: the notification service dropped the segment filter for the payroll cutoff reminder, and same-day submission may be at risk.

Tradeoff: targeted comms may still miss some late admins, but a broad resend creates duplicate notices and support noise.

Need @mina missed-admin file by 10am, @raj send readiness by 10:15, and I will give Support the customer-safe explanation by 10:30.`,
    annotations: [
      {
        title: 'Targeted recovery',
        body: 'The recommendation fixes the missed population without confusing everyone else.',
        color: 'hot',
      },
      {
        title: 'Cutoff risk explicit',
        body: 'Same-day submission risk explains why the reminder cannot wait.',
        color: 'gold',
      },
      {
        title: 'Support prepared',
        body: 'Customer-facing explanation lands after the segment and send plan are confirmed.',
        color: 'mint',
      },
    ],
  },
  {
    id: 'bad-news-20',
    brief:
      'A board pre-read says the new monetization workflow reduced quote cycle time by 35%. Sales Ops now says the sample excluded stalled enterprise deals, and the true result is flat.',
    quote: `"The board deck goes out tonight. Are we correcting the claim or cutting the slide?"`,
    quoteAttribution: 'Chief of Staff, Revenue',
    channelLabel: '#board-prep · draft',
    chips: ['Slack', '<=120w', 'board'],
    defaultDraft: `Rec: cut the 35% cycle-time claim from the board deck tonight and replace it with a narrower adoption update.

Evidence: Sales Ops found the sample excluded stalled enterprise deals; true cycle time is flat.

Risk: losing the metric weakens the monetization story, but board-facing data must be defensible.

Need @cora corrected cohort read by 6pm, @ben slide replacement by 7pm, and I will send the exec-safe line after validation.`,
    seniorDraft: `Decision: remove the 35% quote-cycle claim from the board pre-read; replace it with adoption progress and the corrected measurement plan.

Evidence: the sample excluded stalled enterprise deals, and Sales Ops now reads cycle time as flat.

Tradeoff: the monetization story gets less impressive, but an undefensible board metric is worse than a narrower update.

Need @cora corrected cohort by 6pm, @ben replacement slide by 7pm, and I will send exec-safe wording once both are validated.`,
    annotations: [
      {
        title: 'Board-safe correction',
        body: 'The draft removes the bad claim instead of trying to caveat it into acceptability.',
        color: 'hot',
      },
      {
        title: 'Measurement flaw named',
        body: 'It identifies the excluded stalled deals, which is the root of the inflated metric.',
        color: 'sky',
      },
      {
        title: 'Narrative replacement',
        body: 'Adoption progress preserves a true story while the measurement plan is repaired.',
        color: 'mint',
      },
    ],
  },
])
