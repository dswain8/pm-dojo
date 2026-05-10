require("sucrase/register");

const { reviewArtifact } = require("../src/lib/review.ts");

const cases = [
  {
    id: "CW-LEGAL-REVIEW-SKIP",
    category: "Confident-but-wrong-call",
    expectedBehavior:
      "Known gap: the deterministic rubric should likely rewrite this to 95+ because the artifact is well-shaped, even though shipping without Legal review is bad judgment.",
    failureMode:
      "If this passes, that is the documented judgment-quality gap; if it blocks, the engine may be over-claiming semantic judgment it does not have.",
    input: {
      artifactKind: "exec",
      audience: "GM, Legal, and Support VP",
      pmCall:
        "Ship EU contractor onboarding by Friday despite pending Legal review.",
      context:
        "Pilot conversion is 31% higher in EU. 14 customers asked for contractor onboarding. Legal review is scheduled next Monday. Sales forecast says Friday launch protects $620k pipeline.",
      draft:
        "Decision needed: ship EU contractor onboarding by Friday despite pending Legal review. Context: pilot conversion is 31% higher, 14 customers asked for it, and Friday launch protects $620k pipeline. Recommendation: ship before Legal review completes. Tradeoff: we accept legal-review risk, but avoid slipping $620k pipeline and customer momentum. Ask: GM approves launch by Thursday.",
    },
  },
  {
    id: "CW-HIRE-BEFORE-DEMAND",
    category: "Confident-but-wrong-call",
    expectedBehavior:
      "Known gap: the artifact has evidence and a contrast marker, so the engine should likely pass it even though hiring before validating demand is a weak PM call.",
    failureMode:
      "Passing silently documents the limitation: PM Dojo judges presentation coherence, not whether the investment decision is wise.",
    input: {
      artifactKind: "exec",
      audience: "COO and Finance lead",
      pmCall:
        "Hire four support specialists by June 1 before validating enterprise demand.",
      context:
        "Only 3 enterprise admins requested weekend support. Hiring costs $52k monthly. Sales believes the role could help two renewal conversations worth $410k ARR.",
      draft:
        "Decision needed: hire four support specialists by June 1 before validating enterprise demand. Context: 3 enterprise admins requested weekend support, and Sales says it could help two renewals worth $410k ARR. Recommendation: hire now. Tradeoff: we add $52k monthly cost before demand is proven, but avoid being under-staffed if renewals convert. Ask: approve headcount by Friday.",
    },
  },
  {
    id: "CW-DEPRECATE-KEY-CUSTOMER",
    category: "Confident-but-wrong-call",
    expectedBehavior:
      "Known gap: the engine should likely produce an excellent rewrite because the structure is strong, even though deprecating a key customer's workflow is bad judgment.",
    failureMode:
      "A 95+ pass is the known limitation; the deterministic engine has no customer-strategy model.",
    input: {
      artifactKind: "slack",
      audience: "CS lead, Enterprise PM, and Support",
      pmCall:
        "Deprecate legacy SFTP export by Friday even though Atlas still depends on it.",
      context:
        "New export covers 92% of accounts. Atlas is a $1.2M ARR customer and used legacy SFTP 38 times last week. Sunset saves 2 engineers for 3 weeks.",
      draft:
        "Recommendation: deprecate legacy SFTP export by Friday even though Atlas still depends on it. Why: new export covers 92% of accounts, and sunset saves 2 engineers for 3 weeks. Tradeoff: we risk Atlas disruption, but reduce legacy maintenance and keep the platform migration moving. Ask: CS confirms Atlas comms by Thursday.",
    },
  },
  {
    id: "MESSY-SLACK-INCIDENT-2AM",
    category: "Messy real-human drafts",
    expectedBehavior:
      "Should parse the rushed Slack texture, remove casual language, and produce a clean rewrite without inventing new commitments.",
    failureMode:
      "Bug if it refuses for a typo/casual-register reason or hallucinates structure not present in the input.",
    input: {
      artifactKind: "slack",
      audience: "Eng on-call, Support lead, and VP Product",
      pmCall:
        "Pause CSV export rollout by 9am until duplicate rows are below 0.1%.",
      context:
        "Duplicate rows hit 2.7% across 9 payroll customers. Support has 5 escalations. Sales has a renewal demo tomorrow.",
      draft:
        "ok sry typing fast, csv thing is not clean yet duplicate rows are 2.7% across 9 payroll customers and support already has 5 escalations. i think pause by 9am? tradeoff is renewal demo gets messier but we avoid sending bad payroll exports. eng/support pls confirm by 8:30.",
    },
  },
  {
    id: "MESSY-CUSTOMER-RUSHED-REPLY",
    category: "Messy real-human drafts",
    expectedBehavior:
      "Should turn a rushed customer reply into accountable customer-facing language while preserving the stated commitment and date.",
    failureMode:
      "Bug if it flags the messy wording as missing accountability or invents a different update date.",
    input: {
      artifactKind: "customer",
      audience: "Payroll admin at Harbor",
      pmCall:
        "Tell Harbor we will send verified overtime totals by Friday and will not promise same-day correction.",
      context:
        "Harbor found 11 overtime mismatches. Recalculation finishes Thursday night. Payroll closes Friday at 2pm.",
      draft:
        "hey harbor - quick update, not ideal: 11 overtime rows mismatched, recalculation finishes thurs night. we will send verified totals by Friday and can't promise same-day correction before payroll close.",
    },
  },
  {
    id: "MESSY-MEETING-TWO-THREADS",
    category: "Messy real-human drafts",
    expectedBehavior:
      "Should extract the meeting decision despite two ideas in one paragraph and rewrite into follow-up structure.",
    failureMode:
      "Bug if it chooses the side-topic as the decision or blocks despite concrete evidence/tradeoff/owner/date.",
    input: {
      artifactKind: "meeting",
      audience: "Billing Eng, Support, and Product Ops",
      pmCall:
        "Move billing-alert GA to June 14 and ship admin copy fixes this Friday.",
      context:
        "Alert false positives are 8.4%. Copy fixes cover 73% of support confusion. Full GA needs 2 more weeks of threshold tuning.",
      draft:
        "notes are messy: copy fixes can go this friday, that helps support. full GA should move to june 14 bc false positives are 8.4% and thresholds need 2 more weeks. tradeoff is launch story splits, but customers get clearer admin copy now. product ops owns comms by friday.",
    },
  },
  {
    id: "NUM-ACTIVATION-AS-COST",
    category: "Plausible numeric coherence trick",
    expectedBehavior:
      "Should flag that the same activation metric is being reused as the tradeoff cost rather than explaining the actual cost.",
    failureMode:
      "False pass if numeric propagation clears coherence even though 42% activation is evidence, not a tradeoff.",
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
  {
    id: "NUM-ARR-AS-TRADEOFF",
    category: "Plausible numeric coherence trick",
    expectedBehavior:
      "Should catch that $1.8M ARR is being copied into the tradeoff line as if it were the cost, not connected to the decision logic.",
    failureMode:
      "False pass if the engine accepts repeated dollars as coherence without understanding relevance.",
    input: {
      artifactKind: "exec",
      audience: "CFO and Billing GM",
      pmCall:
        "Launch collections dashboard by Monday despite reconciliation mismatch.",
      context:
        "ARR exposure is $1.8M. Reconciliation mismatch affects 42 invoices. Finance close starts Monday.",
      draft:
        "Decision needed: launch collections dashboard by Monday. Context: ARR exposure is $1.8M and 42 invoices mismatch before Finance close. Recommendation: launch anyway. Tradeoff: we give up $1.8M ARR, but avoid slipping the dashboard. Ask: CFO approves by Friday.",
    },
  },
  {
    id: "NUM-TICKETS-AS-COST",
    category: "Plausible numeric coherence trick",
    expectedBehavior:
      "Should flag that support-ticket count is being reused as a fake cost instead of naming what slows down or gets cut.",
    failureMode:
      "False pass if the engine treats '27 tickets' in both evidence and tradeoff as coherent reasoning.",
    input: {
      artifactKind: "slack",
      audience: "Support lead and Payments PM",
      pmCall:
        "Hold payout retry launch until webhook failures are below 1%.",
      context:
        "Webhook failures are 6.5%. Support has 27 payout tickets. Retry launch is scheduled tomorrow.",
      draft:
        "Recommendation: hold payout retry launch until webhook failures are below 1%. Why: webhook failures are 6.5% and Support has 27 payout tickets. Tradeoff: we give up 27 payout tickets, but avoid scaling failed retries. Ask: Payments confirms by EOD.",
    },
  },
  {
    id: "LONG-EXEC-PARAGRAPH-3-DECISION",
    category: "Long-form drafts",
    expectedBehavior:
      "Should extract the buried decision and tradeoff from a long exec memo without choosing the earlier background option as the recommendation.",
    failureMode:
      "Bug if the rewrite chooses the wrong decision-shaped sentence or blocks despite complete context.",
    expectedNeedle: "Delay partner payroll API launch",
    input: {
      artifactKind: "exec",
      audience: "GM, API Eng lead, and Partnerships",
      pmCall:
        "Delay partner payroll API launch by two weeks until replay protection passes validation.",
      context:
        "Replay protection fails 3.8% of retry simulations. 21 partner integrations are queued. Two-week delay moves $360k pipeline into next month.",
      draft:
        "The partner payroll API is in an awkward spot. The launch narrative is strong because 21 integrations are queued, Partnerships has already drafted enablement, and the beta customers are asking for a clearer date. We looked at a smaller launch, but that would still expose the retry path to partners who cannot safely recover duplicated events. The team also discussed shipping docs first while keeping writes closed, but that creates a confusing half-launch.\n\nMy recommendation is to delay partner payroll API launch by two weeks until replay protection passes validation. Replay protection fails 3.8% of retry simulations today. The cost is real: the delay moves $360k pipeline into next month, but it avoids pushing an API surface that can duplicate payroll events under retry. If we agree, API Eng owns validation, Partnerships updates the 21 queued integrations, and PM sends the revised date by Friday.\n\nDecision needed today: approve the two-week delay and stop launch comms until validation passes.",
    },
  },
  {
    id: "LONG-PRD-BURIED-SCOPE-CUT",
    category: "Long-form drafts",
    expectedBehavior:
      "Should preserve the intended PRD scope cut even though earlier paragraphs discuss broader V1 options.",
    failureMode:
      "Bug if it extracts the aspirational broader scope instead of the actual V1 decision.",
    expectedNeedle: "Cut custom chart recreation from V1",
    input: {
      artifactKind: "prd",
      audience: "Reporting Eng and Design",
      pmCall:
        "Cut custom chart recreation from V1 and ship saved-filter migration by July 1.",
      context:
        "Saved filters cover 79% of legacy usage. Custom chart recreation adds 6 weeks. Enterprise sunset is July 1.",
      draft:
        "There are three possible V1 shapes. The broadest version recreates saved filters, scheduled exports, and custom charts, which would feel closest to parity. The narrower version only migrates saved filters and leaves charts for manual rebuild. A third option delays the sunset entirely. We should not choose the broadest path just because it is comforting.\n\nDecision: cut custom chart recreation from V1 and ship saved-filter migration by July 1. Saved filters cover 79% of legacy usage, while chart recreation adds 6 weeks and would push us past the enterprise sunset. Tradeoff: admins rebuild custom charts manually in V1, but we preserve the July 1 migration path for the majority of usage. Open ask: Design confirms the empty state and migration review step by Tuesday.\n\nNon-goal for this PRD: scheduled exports and custom chart templates remain out of V1 unless leadership moves the sunset.",
    },
  },
  {
    id: "LONG-EXEC-MULTIPLE-CALLS",
    category: "Long-form drafts",
    expectedBehavior:
      "Should keep the final recommendation as the decision despite multiple plausible calls in the memo.",
    failureMode:
      "Bug if it extracts 'launch to all admins' or 'run another beta' instead of the stated cap decision.",
    expectedNeedle: "Cap AI summary rollout at 25 customers",
    input: {
      artifactKind: "exec",
      audience: "GM and Finance lead",
      pmCall:
        "Cap AI summary rollout at 25 customers until token cost drops below $0.08 per account.",
      context:
        "Current token cost is $0.21 per account. 25 customers cover the top 3 workflows. All-admin rollout adds $38k monthly run-rate.",
      draft:
        "The AI summary beta has momentum. Sales wants a broader launch because demos land well, and Support believes summaries reduce admin confusion. There is also an argument to run another beta cycle before making any call, because the cost curve is still moving. A third option is to launch to all admins now and clean up cost later, but that would put us into a bad unit-economic posture.\n\nRecommendation: cap AI summary rollout at 25 customers until token cost drops below $0.08 per account. Current token cost is $0.21 per account. The 25-customer cap covers the top 3 workflows and gives us enough signal without adding the $38k monthly run-rate of all-admin rollout. Tradeoff: we slow broad customer learning, but avoid scaling an uneconomic feature. Ask: approve the cap by Friday and revisit once token cost is under the threshold.\n\nIf Finance disagrees, the alternative is not full launch; it is a smaller 10-customer beta with stricter usage limits.",
    },
  },
  {
    id: "SLOP-LEVERAGE-SYNERGY",
    category: "AI-slop drafts",
    expectedBehavior:
      "Should surface filler/AI-slop language or cap the rewrite instead of treating the draft as excellent work.",
    failureMode:
      "False pass if it scores a hollow, generic artifact as excellent without any warning.",
    input: {
      artifactKind: "exec",
      audience: "CEO",
      pmCall:
        "Approve the platform acceleration plan by Friday.",
      context: "",
      draft:
        "I want to highlight that this is a best in class opportunity to leverage cross-functional synergies. Going forward, our north star should be alignment around platform acceleration. It is worth noting that the team is excited to share momentum. Recommendation: approve the plan. Tradeoff: opportunity cost. Ask: please approve by Friday.",
    },
  },
  {
    id: "SLOP-EXCITED-PRD",
    category: "AI-slop drafts",
    expectedBehavior:
      "Should penalize hollow PRD language and avoid upgrading it to excellent without concrete evidence.",
    failureMode:
      "False pass if surface coherence plus AI-ish PM phrases reach 95+.",
    input: {
      artifactKind: "prd",
      audience: "Engineering and Design",
      pmCall:
        "Build the next-generation admin experience by Friday.",
      context: "",
      draft:
        "We are excited to share a next-generation admin experience that unlocks delightful customer outcomes. It is worth noting that this will leverage our existing platform and create strategic alignment. Decision: build the experience by Friday. Evidence: customers want better workflows. Tradeoff: some sequencing complexity. Open ask: Engineering aligns this week.",
    },
  },
  {
    id: "SLOP-CUSTOMER-APOLOGY",
    category: "AI-slop drafts",
    expectedBehavior:
      "Should refuse or flag the empty customer reply because it lacks accountable facts and commitment.",
    failureMode:
      "False pass if generic empathy language turns into a 95+ customer rewrite.",
    input: {
      artifactKind: "customer",
      audience: "Customer admin",
      pmCall:
        "Tell the customer we value the partnership and are investigating.",
      context: "",
      draft:
        "We are excited to continue partnering with you and want to highlight that your experience is our north star. Going forward, we are leveraging our teams to investigate this issue and will circle back with best in class support. Thank you for your patience.",
    },
  },
];

const expectedCounts = new Map();
for (const testCase of cases) {
  expectedCounts.set(testCase.category, (expectedCounts.get(testCase.category) ?? 0) + 1);
}

if (cases.length !== 15 || [...expectedCounts.values()].some((count) => count !== 3)) {
  console.error("Synthetic stress test must contain exactly 15 cases, 3 per category.");
  process.exit(1);
}

function blockersFor(output) {
  return [
    ...output.missingContext,
    ...(output.rewriteAssessment.pmCallBlockers || []),
    ...output.draftAssessment.antiPatterns.map((hit) => hit.label),
  ];
}

function includesNeedle(output, needle) {
  if (!needle) return true;
  return output.revisedDraft.toLowerCase().includes(needle.toLowerCase());
}

function compareToExpected(testCase, output, blockers) {
  if (testCase.category === "Confident-but-wrong-call") {
    return output.rewriteQuality >= 95 && output.readiness !== "Do not send"
      ? "KNOWN_GAP"
      : "FALSE_BLOCK";
  }

  if (testCase.category === "Messy real-human drafts") {
    if (output.rewriteQuality >= 90 && output.readiness !== "Do not send" && blockers.length === 0) {
      return "MATCH";
    }
    return blockers.length > 0 ? "WRONG_REASON" : "FALSE_BLOCK";
  }

  if (testCase.category === "Plausible numeric coherence trick") {
    return output.rewriteQuality >= 95 ? "FALSE_PASS" : "MATCH";
  }

  if (testCase.category === "Long-form drafts") {
    if (output.rewriteQuality >= 95 && includesNeedle(output, testCase.expectedNeedle)) {
      return "MATCH";
    }
    if (output.readiness === "Do not send") return "FALSE_BLOCK";
    return "WRONG_REASON";
  }

  if (testCase.category === "AI-slop drafts") {
    const surfacedWarning = blockers.length > 0 || output.draftAssessment.antiPatterns.length > 0;
    return output.rewriteQuality >= 95 && !surfacedWarning ? "FALSE_PASS" : "MATCH";
  }

  return "WRONG_REASON";
}

const results = cases.map((testCase) => {
  const output = reviewArtifact(testCase.input);
  const blockers = blockersFor(output);
  return {
    id: testCase.id,
    category: testCase.category,
    draftScore: output.score,
    rewriteQuality: output.rewriteQuality,
    readiness: output.readiness,
    blockers,
    compare: compareToExpected(testCase, output, blockers),
  };
});

console.log("ID  category  draftScore  rewriteQuality  readiness  blockers  COMPARE_TO_EXPECTED");
for (const result of results) {
  console.log(
    [
      result.id,
      result.category,
      result.draftScore,
      result.rewriteQuality,
      result.readiness,
      result.blockers.length > 0 ? result.blockers.join(" | ") : "none",
      result.compare,
    ].join("  "),
  );
}

const statuses = ["MATCH", "FALSE_PASS", "FALSE_BLOCK", "WRONG_REASON", "KNOWN_GAP"];
console.log("\n=== STRESS TEST SUMMARY ===");
console.log(`Total: ${results.length}`);
for (const status of statuses) {
  const ids = results.filter((result) => result.compare === status).map((result) => result.id);
  console.log(`${status}: ${ids.length}${ids.length > 0 ? ` (${ids.join(", ")})` : ""}`);
}
