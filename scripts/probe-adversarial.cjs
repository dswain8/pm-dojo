require("sucrase/register");
const { reviewArtifact } = require("../src/lib/review.ts");
const cases = [
  { id: "REAL-D-blame", input: { artifactKind: "customer", audience: "Customer", pmCall: "Tell them it is their fault", context: "", draft: "Hi, your file format was wrong, which is why eng could not process it." } },
  { id: "REAL-B-confident-empty", input: { artifactKind: "exec", audience: "CEO", pmCall: "Approve plan", context: "", draft: "Recommendation: approve the plan. Decision needed today. Customers want this. The team is aligned and ready to ship. Tradeoff: opportunity cost. Ask: please approve by Friday." } },
  { id: "REAL-F-thin-slip", input: { artifactKind: "exec", audience: "CFO", pmCall: "Delay launch", context: "", draft: "We should delay 2 weeks until Friday. Tradeoff: launch slips. Please approve by EOD." } },
  { id: "REAL-E-numeric-stuffing", input: { artifactKind: "prd", audience: "Eng", pmCall: "Build feature X", context: "Activation is 42%. Target is 55%. 16 customers asked.", draft: "Decision: build feature X by Friday. Evidence: 42% activation, 55% target, 16 customer requests, $200k impact, 3 engineers, 7 weeks. Tradeoff: delay feature Y. Open ask: approve by Monday." } },
  { id: "REAL-C-empty-customer", input: { artifactKind: "customer", audience: "Acme admin", pmCall: "Tell Acme we are looking at it", context: "", draft: "Hi Acme, we are working on this. We will get back to you Monday." } },
];
for (const c of cases) {
  const out = reviewArtifact(c.input);
  console.log(`\n=== ${c.id} draft=${out.score} rewrite=${out.rewriteQuality} readiness=${out.readiness}`);
  console.log("missingContext:", out.missingContext);
  console.log("pmCallBlockers:", out.rewriteAssessment.pmCallBlockers || []);
  console.log("--- revisedDraft ---\n" + out.revisedDraft);
}
