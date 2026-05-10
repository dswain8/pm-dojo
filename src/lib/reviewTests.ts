import { reviewArtifact, type ReviewInput } from "./review";

export interface ReviewGoldenCase {
  id: string;
  name: string;
  input: ReviewInput;
  expectedDraftBelow: number;
  expectedRewriteAtLeast: number;
  expectedMissIncludes: string[];
}

export interface ReviewRobustnessCase {
  id: string;
  name: string;
  domain: string;
  input: ReviewInput;
  expectedRewrite: "excellent" | "capped" | "low-draft-excellent-rewrite";
}

export const REVIEW_GOLDEN_CASES: ReviewGoldenCase[] = [
  {
    id: "billing-refund-exec-slang",
    name: "Exec memo with billing slang and hedging",
    expectedDraftBelow: 75,
    expectedRewriteAtLeast: 95,
    expectedMissIncludes: ["slang", "ask"],
    input: {
      artifactKind: "exec",
      audience: "CFO, Billing GM, and Eng director",
      pmCall:
        "Defer auto-refund launch by one week until Finance signs off on the ledger reconciliation plan.",
      context:
        "Refund pilot found 11 mismatched ledger rows across 2 test customers. Finance close starts Monday. Support has no customer-facing macro yet.",
      draft:
        "The refund launch vibes are kinda off. Finance is nervous and eng says the ledger thing is mostly fine. I think we should maybe push a week? Not trying to be dramatic but if this blows up close will be a mess lol.",
    },
  },
  {
    id: "csv-launch-slack",
    name: "Bad news Slack launch pause",
    expectedDraftBelow: 75,
    expectedRewriteAtLeast: 95,
    expectedMissIncludes: ["slang", "uncertainty"],
    input: {
      artifactKind: "slack",
      audience: "VP Product, Eng lead, and Support lead",
      pmCall:
        "Pause the Friday CSV export launch until we validate the duplicate billing edge case and get Support-ready messaging.",
      context:
        "Beta found 17 duplicate export rows across 3 payroll customers. Support has two open escalations. Sales wants the launch this Friday because the feature is in two renewal conversations.",
      draft:
        "quick vibe check: csv export is kind of cooked lol. we can probably still ship friday but there is a duplicate row thing and support may get spicy. maybe eng can look?",
    },
  },
  {
    id: "customer-reply-no-tradeoff",
    name: "Customer reply with weak accountability",
    expectedDraftBelow: 80,
    expectedRewriteAtLeast: 95,
    expectedMissIncludes: ["committing"],
    input: {
      artifactKind: "customer",
      audience: "Payroll admin at Acme",
      pmCall:
        "Tell Acme we are delaying the export fix until Tuesday so we can validate payroll totals before release.",
      context:
        "Acme found 4 incorrect export totals during payroll close. Engineering has a fix but QA needs one more payroll-cycle validation run.",
      draft:
        "Thanks for flagging. We are working on this and should have more soon. We appreciate your patience.",
    },
  },
  {
    id: "prd-decision-no-owner",
    name: "PRD decision without owner",
    expectedDraftBelow: 85,
    expectedRewriteAtLeast: 80,
    expectedMissIncludes: ["ask"],
    input: {
      artifactKind: "prd",
      audience: "Engineering and Design",
      pmCall:
        "Cut CSV customization from V1 and ship standard export first.",
      context:
        "Custom columns add 3 weeks. Standard export covers 82% of beta requests and unblocks 6 customers waiting on payroll reporting.",
      draft:
        "For V1 we should do standard export and probably come back to customization later because it is expensive.",
    },
  },
  {
    id: "meeting-follow-up-thin-context",
    name: "Meeting follow-up missing facts",
    expectedDraftBelow: 70,
    expectedRewriteAtLeast: 70,
    expectedMissIncludes: ["fact"],
    input: {
      artifactKind: "meeting",
      audience: "Growth and Billing leads",
      pmCall: "Move forward with the pricing experiment.",
      context: "",
      draft:
        "Good discussion today. I think we are aligned that the pricing experiment is the right move. Let's circle back next week.",
    },
  },
];

export const REVIEW_ROBUSTNESS_CASES: ReviewRobustnessCase[] = [
  {
    id: "slack-security-incident",
    name: "Security launch pause with casual slang",
    domain: "security",
    expectedRewrite: "capped",
    input: {
      artifactKind: "slack",
      audience: "CISO, Support lead, and Enterprise CS",
      pmCall:
        "Pause SSO rollout until the audit-log gap is fixed and Support has the customer escalation script.",
      context:
        "Pilot found 6 missing audit-log events across 2 enterprise customers. One customer has a security review tomorrow. Sales wants SSO live for a renewal.",
      draft:
        "SSO launch is looking sketchy lol. audit logs are missing for some customers. I think we should pause but sales will be annoyed. can eng check this today?",
    },
  },
  {
    id: "slack-growth-experiment",
    name: "Growth experiment with supplied tradeoff",
    domain: "growth",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "slack",
      audience: "Growth lead and Lifecycle PM",
      pmCall:
        "Stop the onboarding email experiment and roll back to control while we inspect activation drop.",
      context:
        "Variant B improved open rate by 9% but activation fell 4.8% across 12k users. Next send batch is tomorrow morning.",
      draft:
        "recommend pausing variant b before tomorrow. open rate is up 9% but activation is down 4.8% across 12k users. tradeoff: we may lose short term email learnings, but avoid scaling a bad activation path. ask: growth confirm rollback by 5pm or share blocker.",
    },
  },
  {
    id: "exec-infra-cost-capped",
    name: "Infra cost memo missing explicit tradeoff",
    domain: "infrastructure",
    expectedRewrite: "capped",
    input: {
      artifactKind: "exec",
      audience: "CTO and CFO",
      pmCall:
        "Choose the 30-day capacity cap instead of immediate multi-region expansion.",
      context:
        "Search latency p95 is 920ms for 3% of enterprise tenants. Multi-region adds $420k annual run-rate. Capacity cap restores p95 under 700ms for 90% of affected traffic within 10 days.",
      draft:
        "I wanted to make sure we are aligned. Multi-region is a big swing and maybe we should leverage a cap first. It is a best practices thing and we can circle back.",
    },
  },
  {
    id: "prd-api-rate-limit-keyword-stuffing",
    name: "API PRD keyword stuffing attack",
    domain: "API platform",
    expectedRewrite: "capped",
    input: {
      artifactKind: "prd",
      audience: "API Eng and Developer Relations",
      pmCall: "Add per-client rate limits before opening the public API beta.",
      context:
        "Load test found 3 clients can consume 64% of shared worker capacity. Public beta starts Monday.",
      draft:
        "recommend risk tradeoff customer stakeholder approve today ship pause ask decide owner evidence metric launch risk tradeoff customer approve today.",
    },
  },
  {
    id: "customer-benefits-internal-jargon",
    name: "Customer reply with internal jargon",
    domain: "benefits",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "customer",
      audience: "Benefits admin at Northstar",
      pmCall:
        "Tell Northstar we are delaying eligibility sync until Thursday to validate dependent coverage totals.",
      context:
        "Northstar found 31 dependent coverage mismatches. Fix is ready, but QA needs one more carrier-file validation cycle.",
      draft:
        "Hi, Eng has a fix but QA needs another pass and the DRI will update after standup. We are delaying because the pipeline is not green. Please bear with us.",
    },
  },
  {
    id: "customer-thin-sorry-capped",
    name: "Customer apology with no facts",
    domain: "support",
    expectedRewrite: "capped",
    input: {
      artifactKind: "customer",
      audience: "Customer admin",
      pmCall: "Tell the customer we are working on it.",
      context: "",
      draft: "Sorry for the issue. We are working on this and will get back soon.",
    },
  },
  {
    id: "meeting-sales-pressure",
    name: "Sales pressure meeting follow-up",
    domain: "sales escalation",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "meeting",
      audience: "Sales, Product, and Support leads",
      pmCall:
        "Do not commit custom SFTP delivery for the renewal until we price and scope it.",
      context:
        "Customer renewal is $480k ARR. Custom SFTP adds 6 weeks and would bypass the standard export roadmap. SE needs a response by Friday.",
      draft:
        "sales wants us to just say yes. renewal is 480k and sftp is 6 weeks. we should not commit until priced/scoped. downside is renewal risk. ask: sales/product agree by friday on paid custom work vs roadmap no.",
    },
  },
  {
    id: "meeting-vague-alignment-capped",
    name: "Meeting follow-up with no facts",
    domain: "strategy",
    expectedRewrite: "capped",
    input: {
      artifactKind: "meeting",
      audience: "Product leadership",
      pmCall: "Align on Q4 platform priorities.",
      context: "",
      draft:
        "Good chat. We are aligned on the direction and should keep pushing. Let us sync again next week.",
    },
  },
  {
    id: "slack-toxic-incident-freeze",
    name: "Incident rollout freeze with slang",
    domain: "incident response",
    expectedRewrite: "capped",
    input: {
      artifactKind: "slack",
      audience: "Eng manager, Support lead, and VP Product",
      pmCall:
        "Freeze rollout until we isolate the P1 billing incident and publish customer-safe support guidance.",
      context:
        "P1 started today. 11 customers saw duplicate invoice emails. Support has 4 escalations. Rollout is at 12% of accounts.",
      draft:
        "this rollout is cooked lol. invoices are going brrr and support is getting smoked. probably freeze? eng pls look asap.",
    },
  },
  {
    id: "slack-only-date-no-fact-capped",
    name: "Launch delay with date but no evidence",
    domain: "launch",
    expectedRewrite: "capped",
    input: {
      artifactKind: "slack",
      audience: "Engineering and Support",
      pmCall: "Move launch next week until the issue is understood.",
      context: "",
      draft: "Launch should move next week. This is risky.",
    },
  },
  {
    id: "exec-bad-news-slip",
    name: "Exec bad-news date slip with enough facts",
    domain: "billing analytics",
    expectedRewrite: "capped",
    input: {
      artifactKind: "exec",
      audience: "CFO and Billing GM",
      pmCall:
        "Miss the May 31 collections dashboard date and move launch to June 14 after finance reconciliation passes.",
      context:
        "Reconciliation found $1.8M mismatch across 42 invoices. Finance close starts Monday. Data fix is estimated at 6 business days.",
      draft:
        "Bad news: dashboard may slip. There is a $1.8M mismatch across 42 invoices and close is Monday. I think launch should move to June 14 after reconciliation passes.",
    },
  },
  {
    id: "customer-angry-defensive-repair",
    name: "Customer reply that blames the customer",
    domain: "payroll support",
    expectedRewrite: "capped",
    input: {
      artifactKind: "customer",
      audience: "Payroll admin at Northstar",
      pmCall:
        "Apologize, do not blame the customer, and commit to a verified correction by Friday.",
      context:
        "Customer reported 7 employees missing overtime. Root cause is our import mapping. Payroll deadline is Friday 2pm.",
      draft:
        "You uploaded the file in a weird format so overtime did not map. Engineering is checking internally. We will circle back.",
    },
  },
  {
    id: "customer-overpromise-correction",
    name: "Customer reply that overpromises a same-day fix",
    domain: "finance support",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "customer",
      audience: "Finance admin at Mercury",
      pmCall:
        "Tell the customer we cannot promise same-day invoice correction and will provide verified totals by Thursday.",
      context:
        "Invoice export had 9 incorrect tax rows. Tax recalculation job finishes Wednesday night. Support promised an update today.",
      draft: "We will fix this today. Sorry for the inconvenience.",
    },
  },
  {
    id: "prd-placeholder-context-capped",
    name: "PRD placeholders are not real context",
    domain: "product spec",
    expectedRewrite: "capped",
    input: {
      artifactKind: "prd",
      audience: "Engineering and Design",
      pmCall: "Build the [feature] for [persona] so they can [goal].",
      context: "[Add context later].",
      draft: "Problem: [problem]. Goal: [goal]. Non-goal: [non-goal].",
    },
  },
  {
    id: "slack-marketplace-fraud",
    name: "Marketplace payout launch with fraud risk",
    domain: "marketplace risk",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "slack",
      audience: "Payments PM, Risk lead, Support",
      pmCall:
        "Hold seller payout launch for one week until Risk reviews the chargeback spike.",
      context:
        "Pilot sellers had 18% chargeback rate versus 4% baseline. 3 support tickets mention missing payout explanations. Launch email is scheduled tomorrow.",
      draft:
        "payout launch feels sketchy. chargebacks are way higher and support has tickets. I think we hold a week but marketplace will be annoyed.",
    },
  },
  {
    id: "customer-data-deletion-legal-hold",
    name: "Customer deletion request blocked by legal hold",
    domain: "privacy support",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "customer",
      audience: "IT admin at Atlas",
      pmCall:
        "Tell Atlas we cannot accelerate deletion until legal hold review is complete on Monday.",
      context:
        "Atlas requested deletion today. Account has an active legal hold review. Security confirmed no new data access since Wednesday.",
      draft:
        "We cannot delete today because legal is reviewing. Security says no new access since Wednesday. We will update Monday.",
    },
  },
  {
    id: "slack-one-word-garbage-capped",
    name: "One-word launch draft stays capped",
    domain: "launch",
    expectedRewrite: "capped",
    input: {
      artifactKind: "slack",
      audience: "Team",
      pmCall: "Decide launch path.",
      context: "",
      draft: "ship?",
    },
  },
  {
    id: "slack-enterprise-rollout-hold",
    name: "Enterprise rollout held despite positive SMB signal",
    domain: "growth",
    expectedRewrite: "capped",
    input: {
      artifactKind: "slack",
      audience: "Growth PM, Eng lead, Data Science",
      pmCall:
        "Hold enterprise rollout but continue SMB ramp because enterprise error rate is still above threshold.",
      context:
        "SMB activation is +4.8%. Enterprise error rate is 3.2% versus the 1% launch threshold. Sales wants enterprise in the launch note tomorrow.",
      draft: "Ship it. Activation is up. Let us not overthink it.",
    },
  },
  {
    id: "exec-ai-cost-cap",
    name: "AI beta cap with unit economics risk",
    domain: "AI cost",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "exec",
      audience: "GM and Finance lead",
      pmCall:
        "Cap AI summary beta at 25 customers until token cost drops below $0.08 per account.",
      context:
        "Current beta cost is $0.21 per account. 25 customers cover the top 3 workflows. Opening to all admins adds $38k monthly run-rate.",
      draft:
        "We should cap the AI summary beta at 25 customers. Cost is $0.21 per account and broad rollout adds $38k monthly. Tradeoff is slower learning, but we avoid scaling an uneconomic feature. Please approve cap today.",
    },
  },
  {
    id: "exec-fake-confidence-capped",
    name: "Exec memo with confidence but no evidence",
    domain: "strategy",
    expectedRewrite: "capped",
    input: {
      artifactKind: "exec",
      audience: "CEO",
      pmCall: "Win the market.",
      context: "",
      draft:
        "We are confident this is the right strategic move. The upside is massive and the team is aligned.",
    },
  },
  {
    id: "prd-mobile-crash-release",
    name: "Mobile release blocked by crash-free threshold",
    domain: "mobile reliability",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "prd",
      audience: "Mobile engineering and QA",
      pmCall: "Block Android release until crash-free sessions return above 99.5%.",
      context:
        "Latest build has 97.9% crash-free sessions. Crash is concentrated in payroll approval flow. Release train closes Friday.",
      draft:
        "Do not release Android this week. Crash-free is 97.9% and payroll approval is affected. Tradeoff is missing release train versus avoiding payroll approval failures. QA/Eng decide by Friday.",
    },
  },
  {
    id: "prd-metrics-without-call-capped",
    name: "PRD metrics without a PM call",
    domain: "activation",
    expectedRewrite: "capped",
    input: {
      artifactKind: "prd",
      audience: "Engineering",
      pmCall: "",
      context: "Activation is 42%. 16 customers requested export filters. Q3 target is 55%.",
      draft: "Metrics: activation 42, requests 16, target 55. We need improvements.",
    },
  },
  {
    id: "customer-empty-call-capped",
    name: "Customer reply with no actual PM call",
    domain: "support",
    expectedRewrite: "capped",
    input: {
      artifactKind: "customer",
      audience: "Customer admin",
      pmCall: "",
      context: "They asked when the report is fixed.",
      draft: "Thanks for your patience. We are looking into it.",
    },
  },
  {
    id: "meeting-partner-sla",
    name: "Partner SLA follow-up with support capacity tradeoff",
    domain: "partnerships",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "meeting",
      audience: "Partnerships, Support, Product",
      pmCall:
        "Do not sign the partner SLA until Support staffing for weekend coverage is approved.",
      context:
        "Partner asks for 2-hour weekend response. Current Support weekend queue p90 is 11 hours. Staffing plan costs $24k monthly. Partner needs answer by Thursday.",
      draft:
        "Decision: do not sign 2-hour weekend SLA until staffing is approved. Current p90 is 11 hours and staffing costs $24k/month. Tradeoff is partner pressure versus SLA breach risk. Support/Partnerships confirm by Thursday.",
    },
  },
  {
    id: "meeting-legal-risk-launch",
    name: "Launch follow-up blocked on legal language",
    domain: "legal review",
    expectedRewrite: "capped",
    input: {
      artifactKind: "meeting",
      audience: "GM, Legal, and Support",
      pmCall:
        "Delay public launch until Legal signs off on updated data-processing language.",
      context:
        "Privacy review found 3 missing clauses. Launch announcement is drafted for Monday. Support has 2 customer questions queued.",
      draft:
        "We should delay launch until legal signs off. Privacy found 3 missing clauses and launch note is Monday. Risk is support answering with wrong language. Ask: legal signs off Friday or GM decides to override.",
    },
  },
];

export interface PMWorkflowCase extends ReviewRobustnessCase {
  iteration: number;
  workflow: string;
}

export const PM_WORKFLOW_CASES: PMWorkflowCase[] = [
  {
    iteration: 1,
    workflow: "Incident response",
    id: "wf01-slack-auth-rollback",
    name: "Auth rollback escalation after partial outage",
    domain: "incident response",
    expectedRewrite: "capped",
    input: {
      artifactKind: "slack",
      audience: "Eng on-call, Support lead, and GM",
      pmCall:
        "Rollback the new session refresh path now and keep the launch frozen until login error rate is back under 0.2%.",
      context:
        "Login error rate hit 1.7% for 24 enterprise customers. Support has 9 escalations. The launch announcement is scheduled for tomorrow morning.",
      draft:
        "Auth is pretty bad right now. We should roll back before more customers hit it. Support is already getting escalations and launch comms are tomorrow.",
    },
  },
  {
    iteration: 1,
    workflow: "Incident response",
    id: "wf01-exec-metering-ga-delay",
    name: "Metering GA delayed by billing accuracy issue",
    domain: "usage billing",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "exec",
      audience: "CFO, Product GM, and Eng director",
      pmCall:
        "Delay usage-metering GA by two weeks until duplicate event suppression passes Finance audit.",
      context:
        "Pilot found 0.9% duplicate usage events across 11 customers. Potential invoice exposure is $740k ARR. Finance audit starts Monday.",
      draft:
        "We need to delay GA two weeks. Duplicate usage events are still showing up in pilot and Finance audit is Monday. The tradeoff is missing the launch date, but billing accuracy matters more. Please approve the delay today.",
    },
  },
  {
    iteration: 1,
    workflow: "Incident response",
    id: "wf01-prd-permission-boundary",
    name: "Permission boundary decision note",
    domain: "permissions",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "prd",
      audience: "Platform Eng and Security",
      pmCall:
        "Block delegated-admin launch until permission inheritance is explicit for payroll and finance roles.",
      context:
        "Security review found 3 ambiguous inheritance paths. Payroll admin access affects 18 beta tenants. Launch train closes Friday.",
      draft:
        "Decision: block delegated-admin launch until inheritance is explicit. Security found 3 ambiguous paths and payroll admin access affects 18 beta tenants. Tradeoff is missing Friday train versus avoiding privilege escalation. Open ask: Security and Platform confirm the model by Friday.",
    },
  },
  {
    iteration: 1,
    workflow: "Incident response",
    id: "wf01-customer-api-rate-limit",
    name: "Customer reply for emergency API throttling",
    domain: "developer support",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "customer",
      audience: "Developer lead at Finch",
      pmCall:
        "Tell Finch we are keeping the temporary API throttle through Thursday to protect webhook reliability while we validate the fix.",
      context:
        "Finch hit 28% webhook retry failures today. Temporary throttle reduced failures to 3%. Fix validation completes Thursday.",
      draft:
        "We are keeping the throttle for now. It brought retries down a lot and we need to validate the fix. We will update Thursday.",
    },
  },
  {
    iteration: 1,
    workflow: "Incident response",
    id: "wf01-meeting-incident-review-capped",
    name: "Incident review notes without decision or evidence",
    domain: "incident response",
    expectedRewrite: "capped",
    input: {
      artifactKind: "meeting",
      audience: "Incident review group",
      pmCall: "Improve the incident process.",
      context: "",
      draft:
        "Good retro. We should tighten process and make sure teams are aligned next time.",
    },
  },
  {
    iteration: 2,
    workflow: "Pricing and packaging",
    id: "wf02-slack-pricing-sales-conflict",
    name: "Pricing launch conflict with Sales",
    domain: "pricing",
    expectedRewrite: "capped",
    input: {
      artifactKind: "slack",
      audience: "Sales leadership, RevOps, and Pricing PM",
      pmCall:
        "Hold the packaging change for enterprise renewals until RevOps confirms quote migration rules.",
      context:
        "17 renewal quotes are in flight. RevOps found 4 cases where bundle discount would be removed. QBR deck goes out Friday.",
      draft:
        "pricing change might mess up some renewal quotes. I think hold enterprise renewals until revops confirms migration. downside is QBR story gets weaker.",
    },
  },
  {
    iteration: 2,
    workflow: "Pricing and packaging",
    id: "wf02-exec-price-increase-thin-capped",
    name: "Price increase memo with confidence but no customer signal",
    domain: "pricing",
    expectedRewrite: "capped",
    input: {
      artifactKind: "exec",
      audience: "CEO and CRO",
      pmCall: "Raise prices next month.",
      context: "",
      draft:
        "We should raise prices next month. The market can support it and this is the right strategic move.",
    },
  },
  {
    iteration: 2,
    workflow: "Pricing and packaging",
    id: "wf02-prd-entitlement-cutover",
    name: "Plan entitlement cutover scope",
    domain: "entitlements",
    expectedRewrite: "capped",
    input: {
      artifactKind: "prd",
      audience: "Billing Eng, Product Ops, and Support",
      pmCall:
        "Ship entitlement cutover for new customers only and migrate existing customers after support macros are ready.",
      context:
        "New-customer path covers 68% of May pipeline. Existing-customer migration has 23 edge-case tickets. Support macro draft is due Wednesday.",
      draft:
        "Decision: cut over entitlements for new customers only. Evidence: new-customer path covers 68% of May pipeline and existing migration has 23 edge cases. Tradeoff: slower full migration, lower support risk. Open ask: Support confirms macro by Wednesday.",
    },
  },
  {
    iteration: 2,
    workflow: "Pricing and packaging",
    id: "wf02-customer-price-overpromise",
    name: "Customer reply that overpromises legacy price protection",
    domain: "pricing support",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "customer",
      audience: "Procurement lead at BrightCo",
      pmCall:
        "Tell BrightCo we cannot guarantee legacy pricing beyond the signed term and will send renewal options by Friday.",
      context:
        "BrightCo renewal is 42 days away. Contract term protects current price until July 31. Sales needs Finance-approved options by Friday.",
      draft:
        "We can keep the same pricing. Sales is checking with Finance and we will get back soon.",
    },
  },
  {
    iteration: 2,
    workflow: "Pricing and packaging",
    id: "wf02-meeting-packaging-decision",
    name: "Packaging council decision follow-up",
    domain: "pricing",
    expectedRewrite: "capped",
    input: {
      artifactKind: "meeting",
      audience: "Pricing council, Sales, Finance, and Support",
      pmCall:
        "Proceed with new packaging for self-serve only and defer enterprise migration until renewal quote rules are tested.",
      context:
        "Self-serve has 312 monthly signups. Enterprise has 17 renewal quotes in flight. Quote-rule testing completes next Tuesday.",
      draft:
        "Follow-up: proceed with self-serve packaging, defer enterprise migration. What changed: 312 self-serve signups are clean, but 17 enterprise renewals still need quote-rule testing. Tradeoff: slower enterprise rollout, fewer quote surprises. Next step: RevOps confirms test result Tuesday.",
    },
  },
  {
    iteration: 3,
    workflow: "Global launch",
    id: "wf03-slack-locale-blocker",
    name: "Localization blocker before global launch",
    domain: "localization",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "slack",
      audience: "International PM, Legal, and Support",
      pmCall:
        "Delay Brazil launch until Portuguese tax copy is approved and Support has localized macros.",
      context:
        "Legal flagged 5 untranslated tax terms. Support has no Portuguese macro. Launch webinar is scheduled Thursday.",
      draft:
        "Brazil launch should move. Legal found untranslated tax terms and support does not have PT macros. Tradeoff is delaying webinar momentum, but we avoid confusing tax guidance. Please confirm by EOD.",
    },
  },
  {
    iteration: 3,
    workflow: "Global launch",
    id: "wf03-exec-market-entry-thin-capped",
    name: "Market entry memo with no constraints",
    domain: "international expansion",
    expectedRewrite: "capped",
    input: {
      artifactKind: "exec",
      audience: "GM International",
      pmCall: "Enter Germany this quarter.",
      context: "",
      draft:
        "Germany is strategically important and we should move this quarter. The opportunity is large.",
    },
  },
  {
    iteration: 3,
    workflow: "Global launch",
    id: "wf03-prd-data-residency-scope",
    name: "Data residency V1 scope decision",
    domain: "data residency",
    expectedRewrite: "capped",
    input: {
      artifactKind: "prd",
      audience: "Infra, Legal, and Enterprise PM",
      pmCall:
        "Limit EU data residency V1 to document storage and exclude analytics exports until deletion tests pass.",
      context:
        "Document storage covers 9 of 12 signed EU commitments. Analytics export deletion test failed twice. Customer deadline is June 20.",
      draft:
        "Decision: EU residency V1 is document storage only. Evidence: covers 9 of 12 commitments, analytics deletion failed twice, June 20 deadline. Tradeoff: analytics exports stay out of V1 to protect compliance. Open ask: Legal confirms wording by Friday.",
    },
  },
  {
    iteration: 3,
    workflow: "Global launch",
    id: "wf03-customer-localization-delay",
    name: "Customer reply for localized tax copy delay",
    domain: "localization support",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "customer",
      audience: "Payroll admin at ContaSul",
      pmCall:
        "Tell ContaSul we are delaying the Portuguese tax-guide update until Friday to complete legal review.",
      context:
        "Legal flagged 5 untranslated tax terms. The current English guide remains accurate. Portuguese review completes Friday.",
      draft:
        "The Portuguese copy is delayed because legal is still reviewing some terms. English copy is still correct. We will update Friday.",
    },
  },
  {
    iteration: 3,
    workflow: "Global launch",
    id: "wf03-meeting-legal-localization",
    name: "Localization legal review follow-up",
    domain: "legal review",
    expectedRewrite: "capped",
    input: {
      artifactKind: "meeting",
      audience: "Legal, Localization, Support, and PM",
      pmCall:
        "Do not publish localized tax copy until Legal approves the five flagged terms.",
      context:
        "Five Portuguese tax terms are unapproved. Webinar reminder is scheduled Wednesday. Support macro translation is 80% complete.",
      draft:
        "Follow-up: do not publish localized tax copy until Legal approves five terms. What changed: webinar reminder is Wednesday and macro translation is 80%. Tradeoff: slower launch comms, lower tax-compliance risk. Next step: Legal gives approve/no-go by Wednesday noon.",
    },
  },
  {
    iteration: 4,
    workflow: "Trust and safety",
    id: "wf04-slack-seller-verification",
    name: "Seller verification rollout pause",
    domain: "trust and safety",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "slack",
      audience: "Marketplace PM, Risk Ops, and Support",
      pmCall:
        "Pause seller instant-payout expansion until manual review clears the 14 flagged accounts.",
      context:
        "Risk Ops flagged 14 accounts with mismatched tax IDs. Instant payout expansion touches 1,200 sellers. Support has 6 payout-delay tickets today.",
      draft:
        "Instant payout expansion should pause until Risk clears 14 flagged accounts. It hits 1,200 sellers and support already has 6 tickets. Downside is slower seller activation, but we avoid fraud exposure.",
    },
  },
  {
    iteration: 4,
    workflow: "Trust and safety",
    id: "wf04-exec-trust-investment",
    name: "Trust investment decision memo",
    domain: "trust and safety",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "exec",
      audience: "COO and Marketplace GM",
      pmCall:
        "Approve two Risk Ops contractors for 60 days before expanding instant payouts to unmanaged sellers.",
      context:
        "Manual review backlog is 430 sellers. Fraud loss was $118k last month. Contractor cost is $36k for 60 days.",
      draft:
        "Decision needed: approve two Risk Ops contractors for 60 days. Backlog is 430 sellers and fraud loss was $118k last month. Recommendation is to staff review before unmanaged payout expansion. Tradeoff is $36k cost versus lower fraud exposure. Ask: approve by Friday.",
    },
  },
  {
    iteration: 4,
    workflow: "Trust and safety",
    id: "wf04-prd-moderation-keyword-stuffing",
    name: "Moderation PRD keyword stuffing attack",
    domain: "moderation",
    expectedRewrite: "capped",
    input: {
      artifactKind: "prd",
      audience: "Trust Eng and Policy",
      pmCall:
        "Add manual review for high-risk seller profile edits before self-serve profile publishing.",
      context:
        "Policy review found 22 high-risk edits in the last 7 days. Self-serve publishing launches Monday.",
      draft:
        "recommend risk tradeoff customer owner evidence metric pause approve decide ship risk evidence owner metric approve tradeoff.",
    },
  },
  {
    iteration: 4,
    workflow: "Trust and safety",
    id: "wf04-customer-fraud-hold",
    name: "Customer reply for payout hold",
    domain: "marketplace support",
    expectedRewrite: "capped",
    input: {
      artifactKind: "customer",
      audience: "Seller admin at CraftHub",
      pmCall:
        "Tell CraftHub the payout remains on hold until tax ID review finishes Thursday.",
      context:
        "Tax ID mismatch triggered review. No funds are lost. Risk Ops review completes Thursday.",
      draft:
        "Your payout is held because tax ID review is pending. No funds are lost and review completes Thursday.",
    },
  },
  {
    iteration: 4,
    workflow: "Trust and safety",
    id: "wf04-meeting-risk-policy-vague-capped",
    name: "Risk policy meeting with no decision",
    domain: "trust policy",
    expectedRewrite: "capped",
    input: {
      artifactKind: "meeting",
      audience: "Risk and Product",
      pmCall: "Discuss seller risk policy.",
      context: "",
      draft:
        "We discussed seller risk and should continue refining the policy with the right stakeholders.",
    },
  },
  {
    iteration: 5,
    workflow: "AI quality",
    id: "wf05-slack-ai-hallucination-pause",
    name: "AI summary rollout paused after quality issue",
    domain: "AI quality",
    expectedRewrite: "capped",
    input: {
      artifactKind: "slack",
      audience: "AI PM, Support, Legal, and Eng",
      pmCall:
        "Pause AI meeting-summary rollout for regulated customers until hallucination rate is below 1%.",
      context:
        "QA found 7 hallucinated action items in 180 summaries. Two regulated customers are in tomorrow's rollout cohort. Legal review is pending.",
      draft:
        "Pause regulated cohort tomorrow. QA found 7 hallucinated action items out of 180 and Legal has not approved. Tradeoff is slower AI adoption but lower customer-trust risk.",
    },
  },
  {
    iteration: 5,
    workflow: "AI quality",
    id: "wf05-exec-ai-quality-readout",
    name: "AI quality readout with launch recommendation",
    domain: "AI quality",
    expectedRewrite: "capped",
    input: {
      artifactKind: "exec",
      audience: "CEO, Legal, and AI GM",
      pmCall:
        "Launch AI summaries to SMB only and exclude regulated customers until Legal approves the disclosure copy.",
      context:
        "SMB QA pass rate is 98.8%. Regulated-customer disclosure copy is unapproved. Support macro draft is due Monday.",
      draft:
        "Decision needed: launch SMB only, exclude regulated customers. QA pass rate is 98.8%, disclosure copy is unapproved, and support macro is due Monday. Tradeoff is smaller launch, lower regulatory exposure. Ask: approve SMB-only launch today.",
    },
  },
  {
    iteration: 5,
    workflow: "AI quality",
    id: "wf05-prd-human-review-nongoal",
    name: "AI human-review PRD scope",
    domain: "AI workflow",
    expectedRewrite: "capped",
    input: {
      artifactKind: "prd",
      audience: "AI Eng, Design, and Legal",
      pmCall:
        "Require human review before AI-generated termination notices are sent; do not automate send in V1.",
      context:
        "Legal flagged termination notices as high-risk. Beta generated 3 incorrect policy citations out of 120 drafts. HR admins requested review queue by June 10.",
      draft:
        "Decision: human review is required before AI termination notices send. Evidence: 3 of 120 drafts had wrong policy citations and HR admins need queue by June 10. Tradeoff: no auto-send in V1 to protect trust. Open ask: Legal signs off on review copy by Friday.",
    },
  },
  {
    iteration: 5,
    workflow: "AI quality",
    id: "wf05-customer-ai-summary-incorrect",
    name: "Customer reply for incorrect AI summary",
    domain: "AI support",
    expectedRewrite: "capped",
    input: {
      artifactKind: "customer",
      audience: "HR admin at Maple",
      pmCall:
        "Tell Maple the incorrect AI summary was not sent externally and we are disabling summaries for their workspace until review completes Friday.",
      context:
        "AI summary included 2 incorrect action items. Admin flagged it within 20 minutes. No external recipient received the summary.",
      draft:
        "The AI summary had two wrong action items. It was not sent outside your workspace. We are disabling summaries until review completes Friday.",
    },
  },
  {
    iteration: 5,
    workflow: "AI quality",
    id: "wf05-meeting-ai-safety-thin-capped",
    name: "AI safety meeting follow-up with no facts",
    domain: "AI safety",
    expectedRewrite: "capped",
    input: {
      artifactKind: "meeting",
      audience: "AI working group",
      pmCall: "Improve AI safety.",
      context: "",
      draft:
        "We had a good conversation about AI safety. Everyone agrees we should be careful and keep iterating.",
    },
  },
  {
    iteration: 6,
    workflow: "Mobile release",
    id: "wf06-slack-mobile-hotfix",
    name: "Mobile hotfix release decision",
    domain: "mobile reliability",
    expectedRewrite: "capped",
    input: {
      artifactKind: "slack",
      audience: "Mobile Eng, QA, and Support",
      pmCall:
        "Ship Android hotfix today and hold iOS release until receipt upload crash is fixed.",
      context:
        "Android hotfix fixes 82% of reported receipt upload failures. iOS crash-free sessions dropped to 98.1%. App review cutoff is Friday.",
      draft:
        "Ship Android hotfix today, hold iOS. Android fixes most receipt failures and iOS crash-free is 98.1%. Tradeoff is split-platform messaging. Support/QA confirm by 3pm.",
    },
  },
  {
    iteration: 6,
    workflow: "Mobile release",
    id: "wf06-exec-app-store-delay",
    name: "App-store delay exec readout",
    domain: "mobile release",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "exec",
      audience: "GM, Support VP, and Mobile lead",
      pmCall:
        "Delay iOS receipt capture launch by one week and use the slot for Android hotfix messaging.",
      context:
        "iOS crash-free sessions are 98.1% against a 99.5% bar. Android hotfix fixes 82% of receipt failures. Support has 31 mobile tickets this week.",
      draft:
        "Decision needed: delay iOS receipt capture by one week. iOS is below crash-free bar, Android hotfix fixes 82% of failures, and Support has 31 tickets. Tradeoff is delayed iOS story versus fewer mobile failures. Ask: approve by EOD.",
    },
  },
  {
    iteration: 6,
    workflow: "Mobile release",
    id: "wf06-prd-offline-mode-scope",
    name: "Offline mode scope decision",
    domain: "mobile offline",
    expectedRewrite: "capped",
    input: {
      artifactKind: "prd",
      audience: "Mobile Eng and Design",
      pmCall:
        "Ship offline receipt capture for upload queue only and exclude offline editing from V1.",
      context:
        "Upload queue covers 74% of offline user requests. Offline editing adds 5 weeks. Field sales demo is next Thursday.",
      draft:
        "Decision: V1 is upload queue only. Evidence: covers 74% of requests, offline editing adds 5 weeks, sales demo is Thursday. Tradeoff: less complete offline mode, faster reliable launch. Open ask: Design confirms empty states by Monday.",
    },
  },
  {
    iteration: 6,
    workflow: "Mobile release",
    id: "wf06-customer-mobile-sync-delay",
    name: "Customer reply for mobile sync delay",
    domain: "mobile support",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "customer",
      audience: "Field ops admin at BuildRight",
      pmCall:
        "Tell BuildRight we are delaying mobile sync fix until Tuesday to validate offline receipt uploads.",
      context:
        "BuildRight reported 12 missing receipt uploads. Fix passed Android QA but iOS validation needs one more offline run. Tuesday is the next field payroll close.",
      draft:
        "The sync fix is delayed until Tuesday because iOS still needs offline validation. Android passed QA. We know 12 uploads are missing and will update before payroll close.",
    },
  },
  {
    iteration: 6,
    workflow: "Mobile release",
    id: "wf06-meeting-design-no-decision-capped",
    name: "Design critique follow-up without decision",
    domain: "design review",
    expectedRewrite: "capped",
    input: {
      artifactKind: "meeting",
      audience: "Design and Mobile PM",
      pmCall: "Improve the receipt upload design.",
      context: "",
      draft:
        "The design discussion was productive. We should keep exploring a clearer upload experience.",
    },
  },
  {
    iteration: 7,
    workflow: "Enterprise admin",
    id: "wf07-slack-role-permissions",
    name: "Role permissions escalation",
    domain: "enterprise admin",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "slack",
      audience: "Enterprise PM, Security, and Admin Eng",
      pmCall:
        "Block custom-role beta for payroll permissions until audit logs show role-change actor and timestamp.",
      context:
        "Two beta admins changed payroll access without actor attribution. Audit-log patch is 70% complete. Customer security review is Wednesday.",
      draft:
        "Custom-role beta should block payroll permissions until audit logs show actor and timestamp. Two admins changed access without attribution and security review is Wednesday. Tradeoff is beta scope cut, but we avoid an audit gap.",
    },
  },
  {
    iteration: 7,
    workflow: "Enterprise admin",
    id: "wf07-exec-audit-log-investment",
    name: "Audit-log investment decision",
    domain: "enterprise admin",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "exec",
      audience: "CTO and Enterprise GM",
      pmCall:
        "Fund the audit-log reliability sprint before expanding custom roles to payroll and finance.",
      context:
        "Audit logs missed actor attribution in 2 beta tenants. Custom roles unlock 6 enterprise renewals worth $2.1M ARR. Sprint cost is 3 engineers for 2 weeks.",
      draft:
        "Decision needed: fund audit-log reliability sprint first. Two beta tenants missed actor attribution and 6 renewals depend on this. Tradeoff is 2-week delay for 3 engineers, but lower enterprise security risk. Ask: approve sprint today.",
    },
  },
  {
    iteration: 7,
    workflow: "Enterprise admin",
    id: "wf07-prd-custom-role-v1",
    name: "Custom role V1 PRD scope",
    domain: "enterprise admin",
    expectedRewrite: "capped",
    input: {
      artifactKind: "prd",
      audience: "Admin Eng, Security, and Design",
      pmCall:
        "Ship custom roles for read-only finance access and exclude payroll write access from V1.",
      context:
        "Read-only finance covers 11 of 15 beta asks. Payroll write access needs audit-log actor attribution. Beta kickoff is next Monday.",
      draft:
        "Decision: V1 is read-only finance access only. Evidence: covers 11 of 15 beta asks and payroll write needs audit attribution. Tradeoff: narrower V1, safer beta. Open ask: Security confirms permission copy Friday.",
    },
  },
  {
    iteration: 7,
    workflow: "Enterprise admin",
    id: "wf07-customer-permission-bug",
    name: "Customer reply for permission bug",
    domain: "enterprise support",
    expectedRewrite: "capped",
    input: {
      artifactKind: "customer",
      audience: "IT admin at HelioBank",
      pmCall:
        "Tell HelioBank we are disabling custom-role edits until the audit-log patch is verified Friday.",
      context:
        "Two admins saw missing actor attribution. No unauthorized access was detected. Patch verification completes Friday.",
      draft:
        "We are disabling custom-role edits until audit logs are verified Friday. No unauthorized access was detected. The issue is missing actor attribution.",
    },
  },
  {
    iteration: 7,
    workflow: "Enterprise admin",
    id: "wf07-meeting-security-exception-capped",
    name: "Security exception meeting with no facts",
    domain: "security review",
    expectedRewrite: "capped",
    input: {
      artifactKind: "meeting",
      audience: "Security and Product",
      pmCall: "Decide whether to grant an exception.",
      context: "",
      draft:
        "We discussed the exception. Product wants flexibility and Security wants safety. More discussion is needed.",
    },
  },
  {
    iteration: 8,
    workflow: "Data and analytics",
    id: "wf08-slack-dashboard-mismatch",
    name: "Dashboard metric mismatch escalation",
    domain: "analytics",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "slack",
      audience: "Data Eng, Revenue Ops, and Product Analytics",
      pmCall:
        "Hide the new revenue dashboard from exec view until invoice-status definitions match Finance reporting.",
      context:
        "Dashboard shows $3.4M more open ARR than Finance report. 28 invoices use mismatched status mapping. Exec readout is tomorrow.",
      draft:
        "Hide the dashboard from exec view until status definitions match Finance. It is off by $3.4M and 28 invoices map differently. Tradeoff is losing tomorrow's demo, but we avoid sending wrong revenue data.",
    },
  },
  {
    iteration: 8,
    workflow: "Data and analytics",
    id: "wf08-exec-metric-definition",
    name: "Metric-definition change memo",
    domain: "analytics",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "exec",
      audience: "CFO, RevOps, and Data lead",
      pmCall:
        "Use Finance invoice status as the source of truth and delay product dashboard launch until mappings match.",
      context:
        "Product dashboard is $3.4M higher than Finance reporting. 28 invoices have mismatched status mapping. Board prep starts Friday.",
      draft:
        "Decision needed: use Finance invoice status as source of truth and delay dashboard launch. Product number is $3.4M high and 28 invoices mismatch. Tradeoff is delaying dashboard visibility, but board prep needs one number. Ask: CFO approves source of truth today.",
    },
  },
  {
    iteration: 8,
    workflow: "Data and analytics",
    id: "wf08-prd-analytics-export-scope",
    name: "Analytics export V1 scope",
    domain: "analytics",
    expectedRewrite: "capped",
    input: {
      artifactKind: "prd",
      audience: "Data Eng and Analytics PM",
      pmCall:
        "Ship CSV export for invoice status only and defer ARR roll-forward export until Finance mapping is reconciled.",
      context:
        "Invoice status export covers 76% of admin requests. ARR roll-forward mismatches Finance by $3.4M. Customer beta starts Monday.",
      draft:
        "Decision: V1 is invoice-status CSV only. Evidence: covers 76% of requests and ARR roll-forward is $3.4M off Finance. Tradeoff: narrower export, cleaner beta. Open ask: Finance validates mapping by Monday.",
    },
  },
  {
    iteration: 8,
    workflow: "Data and analytics",
    id: "wf08-customer-reporting-delay",
    name: "Customer reply for reporting delay",
    domain: "analytics support",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "customer",
      audience: "Finance admin at Orbit",
      pmCall:
        "Tell Orbit we are delaying ARR roll-forward export until Monday because Finance mapping reconciliation is still in progress.",
      context:
        "Orbit asked for ARR roll-forward today. Reconciliation found 28 invoice-status mapping mismatches. Invoice-status CSV remains available.",
      draft:
        "ARR export is delayed until Monday because mapping reconciliation is still in progress. Invoice-status CSV is available today.",
    },
  },
  {
    iteration: 8,
    workflow: "Data and analytics",
    id: "wf08-meeting-data-quality-vague-capped",
    name: "Data quality meeting with no accountable next step",
    domain: "analytics",
    expectedRewrite: "capped",
    input: {
      artifactKind: "meeting",
      audience: "Data quality group",
      pmCall: "Improve reporting quality.",
      context: "",
      draft:
        "We agreed reporting quality is important and should continue improving definitions across teams.",
    },
  },
  {
    iteration: 9,
    workflow: "Platform and APIs",
    id: "wf09-slack-api-deprecation",
    name: "API deprecation notice decision",
    domain: "API platform",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "slack",
      audience: "Developer Relations, API Eng, and Support",
      pmCall:
        "Send 90-day deprecation notice for v1 webhook signatures and block new integrations from using v1 starting Monday.",
      context:
        "v1 signatures fail replay protection. 43 active integrations still use v1. New integration creation is 18 per week.",
      draft:
        "Send 90-day v1 deprecation notice and block new v1 integrations Monday. v1 fails replay protection and 43 integrations still use it. Tradeoff is partner migration work, but we stop adding insecure usage.",
    },
  },
  {
    iteration: 9,
    workflow: "Platform and APIs",
    id: "wf09-exec-api-versioning-cost",
    name: "API versioning investment memo",
    domain: "API platform",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "exec",
      audience: "CTO and Platform GM",
      pmCall:
        "Fund API versioning work before launching the public partner ecosystem.",
      context:
        "43 integrations still use v1 webhooks. Versioning work is 4 engineers for 3 weeks. Partner ecosystem launch is planned for Q3.",
      draft:
        "Decision needed: fund API versioning before partner ecosystem launch. 43 integrations are still on v1 and versioning takes 4 engineers for 3 weeks. Tradeoff is Q3 launch pressure versus avoiding partner-breaking changes. Ask: approve staffing this week.",
    },
  },
  {
    iteration: 9,
    workflow: "Platform and APIs",
    id: "wf09-prd-webhook-retry",
    name: "Webhook retry PRD decision",
    domain: "API reliability",
    expectedRewrite: "capped",
    input: {
      artifactKind: "prd",
      audience: "API Eng and Developer Relations",
      pmCall:
        "Ship exponential retry for payroll webhooks and exclude custom retry policies from V1.",
      context:
        "Payroll webhook failures are 6.2% during customer close windows. Exponential retry covers 81% of failed deliveries in simulation. Custom retry policies add 4 weeks.",
      draft:
        "Decision: V1 is exponential retry only. Evidence: failures are 6.2%, simulation recovers 81%, custom policies add 4 weeks. Tradeoff: less partner configurability, faster reliability win. Open ask: DevRel confirms migration copy Friday.",
    },
  },
  {
    iteration: 9,
    workflow: "Platform and APIs",
    id: "wf09-customer-breaking-change",
    name: "Customer reply for API breaking change",
    domain: "developer support",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "customer",
      audience: "Developer lead at NovaHR",
      pmCall:
        "Tell NovaHR we will keep v1 webhook support for 90 days and share migration docs by Friday.",
      context:
        "NovaHR has 6 production webhooks on v1. v2 supports replay protection. Migration docs are in review and due Friday.",
      draft:
        "We are not turning off v1 immediately. You have 90 days, and v2 has replay protection. We will send migration docs Friday.",
    },
  },
  {
    iteration: 9,
    workflow: "Platform and APIs",
    id: "wf09-meeting-roadmap-debate",
    name: "Platform roadmap follow-up",
    domain: "API platform",
    expectedRewrite: "capped",
    input: {
      artifactKind: "meeting",
      audience: "Platform PM, API Eng, DevRel, and Support",
      pmCall:
        "Prioritize webhook retry before custom field mapping because it lowers live customer failure rate this quarter.",
      context:
        "Webhook failures are 6.2% in payroll close windows. Custom field mapping has 14 beta requests. Retry simulation recovers 81% of failures.",
      draft:
        "Follow-up: prioritize webhook retry before custom field mapping. What changed: failures hit 6.2%, retry recovers 81%, mapping has 14 beta asks. Tradeoff: slower configurability, better reliability. Next step: API Eng confirms retry plan Friday.",
    },
  },
  {
    iteration: 10,
    workflow: "Lifecycle and sunsetting",
    id: "wf10-slack-feature-sunset",
    name: "Feature sunset risk update",
    domain: "sunsetting",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "slack",
      audience: "CS, Support, and Product Ops",
      pmCall:
        "Delay legacy report sunset by 30 days for enterprise admins until export parity reaches 95%.",
      context:
        "Export parity is 87%. 31 enterprise admins used legacy report last week. Support macro is ready but migration guide is not.",
      draft:
        "Delay legacy report sunset 30 days for enterprise admins. Parity is 87% and 31 admins still used it last week. Tradeoff is carrying old report longer, but we avoid migration churn.",
    },
  },
  {
    iteration: 10,
    workflow: "Lifecycle and sunsetting",
    id: "wf10-exec-product-sunset",
    name: "Product sunset decision memo",
    domain: "sunsetting",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "exec",
      audience: "GM, Support VP, and CS lead",
      pmCall:
        "Move legacy report sunset from June 1 to July 1 for enterprise admins while keeping SMB sunset unchanged.",
      context:
        "Enterprise export parity is 87%. SMB parity is 98%. 31 enterprise admins used legacy report last week.",
      draft:
        "Decision needed: move enterprise sunset to July 1, keep SMB June 1. Enterprise parity is 87%, SMB parity is 98%, and 31 enterprise admins still used legacy. Tradeoff is carrying old report longer for enterprise while preserving SMB migration momentum. Ask: approve split sunset today.",
    },
  },
  {
    iteration: 10,
    workflow: "Lifecycle and sunsetting",
    id: "wf10-prd-migration-assistant",
    name: "Migration assistant PRD scope",
    domain: "migration",
    expectedRewrite: "capped",
    input: {
      artifactKind: "prd",
      audience: "Reporting Eng and Design",
      pmCall:
        "Build migration assistant for saved report filters and exclude chart recreation from V1.",
      context:
        "Saved filters cover 79% of legacy report usage. Chart recreation adds 6 weeks. Enterprise sunset is July 1.",
      draft:
        "Decision: V1 migrates saved filters only. Evidence: filters cover 79% of usage, chart recreation adds 6 weeks, sunset is July 1. Tradeoff: less complete migration, faster admin unblock. Open ask: Design confirms review step Tuesday.",
    },
  },
  {
    iteration: 10,
    workflow: "Lifecycle and sunsetting",
    id: "wf10-customer-sunset-notice",
    name: "Customer sunset notice with migration path",
    domain: "customer migration",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "customer",
      audience: "Reporting admin at Northwind",
      pmCall:
        "Tell Northwind legacy report access is extended to July 1 and we will migrate saved filters by June 21.",
      context:
        "Northwind has 8 saved legacy filters. New report export parity is 87%. Migration assistant beta starts June 21.",
      draft:
        "We are extending legacy report access to July 1 and will migrate saved filters by June 21. New report export parity is 87%.",
    },
  },
  {
    iteration: 10,
    workflow: "Lifecycle and sunsetting",
    id: "wf10-meeting-sunset-next-steps",
    name: "Sunset planning follow-up",
    domain: "sunsetting",
    expectedRewrite: "capped",
    input: {
      artifactKind: "meeting",
      audience: "CS, Support, Product Ops, and Reporting PM",
      pmCall:
        "Use split sunset: SMB stays June 1, enterprise moves to July 1, and Product Ops owns migration list by Friday.",
      context:
        "SMB export parity is 98%. Enterprise parity is 87%. 31 enterprise admins used legacy last week.",
      draft:
        "Follow-up: split sunset. SMB stays June 1, enterprise moves July 1. What changed: SMB parity is 98%, enterprise is 87%, and 31 admins still use legacy. Tradeoff: extra support window for enterprise, less migration risk. Next step: Product Ops owns migration list Friday.",
    },
  },
];

export const PHASE3_SUBSTANTIVE_EXCELLENT_CASES: ReviewRobustnessCase[] = [
  {
    id: "phase3-slack-enterprise-audit-pause",
    name: "Slack rollout pause with explicit launch-slot cost",
    domain: "enterprise audit exports",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "slack",
      audience: "Enterprise PM, Eng lead, and Support",
      pmCall:
        "Pause enterprise audit-export rollout until failure rate is below 0.5%.",
      context:
        "Failure rate is 2.4% across 18 enterprise tenants. Support has 7 tickets. Launch email is scheduled Tuesday.",
      draft:
        "Recommend pausing enterprise audit-export rollout until failure rate is under 0.5%. Failure rate is 2.4% across 18 enterprise tenants and Support has 7 tickets. Tradeoff: we lose Tuesday's launch email slot, but avoid expanding broken exports to enterprise admins. Ask: Eng confirms the new rollout gate by EOD.",
    },
  },
  {
    id: "phase3-exec-eu-payroll-delay",
    name: "Exec launch delay with concrete pipeline cost",
    domain: "EU payroll",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "exec",
      audience: "CFO and Payroll GM",
      pmCall:
        "Approve a two-week EU payroll launch delay until tax validation passes.",
      context:
        "Tax validation failed in 3 of 12 countries. The delay moves $480k pipeline. Country payroll corrections would require 2 engineers for 5 days.",
      draft:
        "I recommend moving EU payroll launch by two weeks. Tax validation failed in 3 of 12 countries, and the current launch would expose $480k pipeline to incorrect tax setup. Tradeoff: we lose two weeks of launch momentum, but avoid country-level payroll corrections that would take 2 engineers for 5 days. Ask: approve the delay by Friday.",
    },
  },
  {
    id: "phase3-prd-saved-filters-v1",
    name: "PRD scope cut with explicit manual-work cost",
    domain: "reporting migration",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "prd",
      audience: "Reporting Eng and Design",
      pmCall:
        "Ship saved-filter migration and cut chart recreation from V1.",
      context:
        "Saved filters cover 79% of legacy-report usage. Chart recreation adds 6 weeks. The legacy sunset is July 1.",
      draft:
        "For V1, build saved-filter migration and cut chart recreation. Saved filters cover 79% of legacy-report usage, while chart recreation adds 6 weeks before the July 1 sunset. Tradeoff: admins recreate charts manually for V1, but we unblock the 79% migration path by July 1. Open ask: Design confirms the review state by Tuesday.",
    },
  },
  {
    id: "phase3-meeting-webhook-retry-first",
    name: "Meeting follow-up that chooses retry before mapping",
    domain: "webhook reliability",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "meeting",
      audience: "API Eng, Payroll PM, and Support",
      pmCall:
        "Choose webhook retry before custom mapping because it cuts payroll-close failures this quarter.",
      context:
        "Payroll-close webhook failures are 6.2%. Retry recovers 81% in simulation. Custom mapping has 14 beta requests and costs 4 weeks.",
      draft:
        "Follow-up for API Eng and Payroll PM: choose webhook retry before custom mapping. What changed: payroll-close failures are 6.2%, retry recovers 81% in simulation, and custom mapping has 14 beta requests. Tradeoff: we give up 4 weeks of mapping work this quarter, but reduce live payroll failures now. Next step: API Eng confirms retry plan Friday.",
    },
  },
  {
    id: "phase3-customer-payout-accountability",
    name: "Customer reply with accountability instead of tradeoff",
    domain: "payout review",
    expectedRewrite: "excellent",
    input: {
      artifactKind: "customer",
      audience: "Finance admin at Acme",
      pmCall:
        "Tell Acme we will keep the payout hold until Friday review completes and will not promise same-day release.",
      context:
        "Payout hold was triggered by a tax ID mismatch. No funds were lost. Review completes Friday.",
      draft:
        "We are keeping the payout hold until the tax ID review completes Friday. No funds were lost. We will not promise same-day release, but we will send the review result by Friday and keep the payout protected until then.",
    },
  },
];

export const NUMERIC_MISAPPLICATION_CASES: ReviewRobustnessCase[] = [
  {
    id: "numeric-misapplication-activation-as-cost",
    name: "Evidence activation metric reused as tradeoff cost",
    domain: "numeric coherence",
    expectedRewrite: "capped",
    input: {
      artifactKind: "prd",
      audience: "Growth Eng and Design",
      pmCall:
        "Build checklist nudges by Friday to improve activation.",
      context:
        "Activation is 42%. Target is 55%. 16 customers asked for setup guidance.",
      draft:
        "Decision: build checklist nudges by Friday. Evidence: activation is 42%, target is 55%, and 16 customers asked for setup guidance. Tradeoff: we give up 42% activation, but improve setup clarity. Open ask: Design confirms nudge copy by Wednesday.",
    },
  },
];

export const PM_UNSAFE_CALL_CASES: ReviewRobustnessCase[] = [
  {
    id: "unsafe-customer-blame-call",
    name: "Customer call blames the customer",
    domain: "unsafe PM call",
    expectedRewrite: "capped",
    input: {
      artifactKind: "customer",
      audience: "Customer admin",
      pmCall: "Tell them it is their fault",
      context: "",
      draft:
        "Hi, your file format was wrong, which is why eng could not process it.",
    },
  },
  {
    id: "unsafe-three-word-call",
    name: "Three-word PM call",
    domain: "unsafe PM call",
    expectedRewrite: "capped",
    input: {
      artifactKind: "exec",
      audience: "CEO",
      pmCall: "Fix this now",
      context: "Pilot found 12 errors before launch.",
      draft: "We should fix this now. Pilot found 12 errors. Please approve by Friday.",
    },
  },
  {
    id: "unsafe-slang-call",
    name: "PM call contains slang",
    domain: "unsafe PM call",
    expectedRewrite: "capped",
    input: {
      artifactKind: "slack",
      audience: "Product and Eng",
      pmCall: "Pause the launch because the rollout is cooked lol",
      context: "Beta found 8 failed imports today.",
      draft: "Pause launch. Beta found 8 failed imports today. Please confirm by EOD.",
    },
  },
  {
    id: "unsafe-customer-your-file-format",
    name: "Customer call uses second-person blame",
    domain: "unsafe PM call",
    expectedRewrite: "capped",
    input: {
      artifactKind: "customer",
      audience: "Payroll admin at Acme",
      pmCall: "Tell Acme your file format must be fixed before retry",
      context: "Import failed for 4 payroll rows. Retry window closes Friday.",
      draft: "Your file format was wrong. Fix it and we can retry.",
    },
  },
  {
    id: "unsafe-customer-internal-jargon-call",
    name: "Customer call references DRI and standup",
    domain: "unsafe PM call",
    expectedRewrite: "capped",
    input: {
      artifactKind: "customer",
      audience: "Benefits admin at Northstar",
      pmCall: "Tell Northstar the DRI will update after standup",
      context: "Coverage sync failed for 12 dependents. Carrier file retry is Friday.",
      draft: "The DRI will update after standup once QA checks the pipeline.",
    },
  },
  {
    id: "unsafe-empty-call",
    name: "Empty PM call",
    domain: "unsafe PM call",
    expectedRewrite: "capped",
    input: {
      artifactKind: "meeting",
      audience: "Product and Eng",
      pmCall: "",
      context: "Launch review is Friday.",
      draft: "We discussed launch and next steps. The team will keep moving.",
    },
  },
];

export const ALL_REVIEW_ROBUSTNESS_CASES: ReviewRobustnessCase[] = [
  ...REVIEW_ROBUSTNESS_CASES,
  ...PM_WORKFLOW_CASES,
  ...PHASE3_SUBSTANTIVE_EXCELLENT_CASES,
  ...NUMERIC_MISAPPLICATION_CASES,
  ...PM_UNSAFE_CALL_CASES,
];

export function runReviewGoldenCases() {
  return REVIEW_GOLDEN_CASES.map((testCase) => {
    const output = reviewArtifact(testCase.input);
    const missedText = output.missed.join(" ").toLowerCase();
    return {
      id: testCase.id,
      draftScore: output.score,
      rewriteScore: output.rewriteQuality,
      pass:
        output.score < testCase.expectedDraftBelow &&
        output.rewriteQuality >= testCase.expectedRewriteAtLeast &&
        testCase.expectedMissIncludes.every((needle) =>
          missedText.includes(needle),
        ),
    };
  });
}

export function runReviewRobustnessCases() {
  return ALL_REVIEW_ROBUSTNESS_CASES.map((testCase) => {
    const output = reviewArtifact(testCase.input);
    const rewriteHasBadLeak =
      /lol|spicy|kinda|cooked|circle back|touch base|best practices|\bDRI\b|standup|internal validation|pipeline is not green|rubric bingo/i.test(
        output.revisedDraft,
      );
    const rewriteHasPlaceholder = /\[[^\]]+\]/.test(output.revisedDraft);

    const pass =
      testCase.expectedRewrite === "excellent"
        ? output.rewriteQuality >= 95 && !rewriteHasBadLeak && !rewriteHasPlaceholder
        : testCase.expectedRewrite === "capped"
          ? output.rewriteQuality < 95
          : output.score < 50 &&
            output.rewriteQuality >= 95 &&
            !rewriteHasBadLeak &&
            !rewriteHasPlaceholder;

    return {
      id: testCase.id,
      draftScore: output.score,
      rewriteScore: output.rewriteQuality,
      pass,
    };
  });
}
