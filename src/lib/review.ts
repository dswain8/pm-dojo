import {
  EXCELLENT_REWRITE_TARGET,
  assessWithRubricBank,
  getArtifactLabel,
  scoreToReadiness,
  type ArtifactKind,
  type ReviewInputBase,
  type RubricAssessment,
} from "./rubricBank";
import { buildExcellentRewrite } from "./rewriteEngine";

export type { ArtifactKind } from "./rubricBank";

export interface ReviewInput extends ReviewInputBase {}

export interface ReviewOutput {
  readiness: "Send" | "Revise first" | "Do not send";
  score: number;
  oneLine: string;
  landed: string[];
  missed: string[];
  revisedDraft: string;
  revisionReasons: string[];
  draftAssessment: RubricAssessment;
  rewriteAssessment: RubricAssessment;
  rewriteQuality: number;
  rewriteTarget: number;
  missingContext: string[];
}

function buildOneLine(
  readiness: ReviewOutput["readiness"],
  draftAssessment: RubricAssessment,
  rewriteAssessment: RubricAssessment,
  input: ReviewInput,
): string {
  if (draftAssessment.antiPatterns.length > 0) {
    const hit = draftAssessment.antiPatterns[0];
    return `${hit.repair} Detected: ${hit.examples.join(", ")}.`;
  }

  if (readiness === "Send" && rewriteAssessment.score >= EXCELLENT_REWRITE_TARGET) {
    return `Good enough to send. PM Dojo still tightened it into a ${rewriteAssessment.score}/100 ${getArtifactLabel(input.artifactKind)}.`;
  }

  if (draftAssessment.missed.length > 0) return draftAssessment.missed[0];

  return "Revise before sending. The draft needs a sharper PM call.";
}

function buildRevisionReasons(
  rewriteAssessment: RubricAssessment,
  iterations: string[],
): string[] {
  const strengths = rewriteAssessment.dimensions
    .filter((dimension) => dimension.status === "strong")
    .map((dimension) => dimension.landed);

  return [...iterations, ...strengths].slice(0, 5);
}

export function reviewArtifact(input: ReviewInput): ReviewOutput {
  const draftAssessment = assessWithRubricBank(input, input.draft, "user-draft");
  const rewrite = buildExcellentRewrite(input);
  const baseReadiness = scoreToReadiness(
    draftAssessment.score,
    draftAssessment.missed.length,
  );
  const readiness =
    rewrite.assessment.pmCallBlockers.length > 0 || rewrite.assessment.score < 90
      ? "Do not send"
      : baseReadiness;

  return {
    readiness,
    score: draftAssessment.score,
    oneLine: buildOneLine(readiness, draftAssessment, rewrite.assessment, input),
    landed: draftAssessment.landed,
    missed: draftAssessment.missed,
    revisedDraft: rewrite.draft,
    revisionReasons: buildRevisionReasons(rewrite.assessment, rewrite.iterations),
    draftAssessment,
    rewriteAssessment: rewrite.assessment,
    rewriteQuality: rewrite.assessment.score,
    rewriteTarget: EXCELLENT_REWRITE_TARGET,
    missingContext: rewrite.assessment.missingContext,
  };
}

export const REVIEW_SAMPLES: Record<ArtifactKind, ReviewInput> = {
  slack: {
    artifactKind: "slack",
    audience: "VP Product, Eng lead, and Support lead",
    pmCall:
      "Pause the Friday CSV export launch until we validate the duplicate billing edge case and get Support-ready messaging.",
    context:
      "Beta found 17 duplicate export rows across 3 payroll customers. Support has two open escalations. Sales wants the launch this Friday because the feature is in two renewal conversations.",
    draft:
      "quick vibe check: I think we should pause the Friday CSV export. Beta found 17 duplicate rows across 3 payroll customers. Tradeoff is we protect Support and payroll trust while giving Sales one week of workaround messaging for the two renewal threads. Can Eng confirm the fix by Thursday and Support prep copy by Friday?",
  },
  exec: {
    artifactKind: "exec",
    audience: "CFO and VP Sales",
    pmCall:
      "Approve a one-week delay to the usage-based billing launch by Friday so Finance can validate invoice totals.",
    context:
      "Finance found a $184K invoice variance across 23 accounts in Wednesday's dry run. Sales has 4 renewal demos next week. Engineering can validate the rating fix by Thursday, but launch would move from May 17 to May 24.",
    draft:
      "I want to align on usage billing launch. The dry run had a $184K variance across 23 accounts and Finance is nervous. We can still go, but I don't think that is the right call. My recommendation is to move it one week. Tradeoff: we protect invoice accuracy while losing the May 17 launch date and giving Sales one week of workaround messaging. Can you approve by Friday?",
  },
  prd: {
    artifactKind: "prd",
    audience: "Checkout Eng, Design, and Risk",
    pmCall:
      "Ship hosted-card fallback in v1 by May 24 and defer wallet fallback to v2.",
    context:
      "Checkout completion dropped from 61% to 54% for users with expired cards. 38 support tickets mention card-update failures. Wallet fallback adds 2 engineers for 3 weeks and misses the May 24 recovery target.",
    draft:
      "For v1 let's do hosted-card fallback only. Evidence is the completion drop from 61% to 54% and 38 support tickets. The wallet path is useful, but it costs 2 engineers for 3 weeks versus hitting the May 24 recovery window. Open question is whether Risk is okay with the hosted-flow copy by Monday.",
  },
  customer: {
    artifactKind: "customer",
    audience: "Acme payroll admin",
    pmCall:
      "Tell Acme we are holding the payroll export until we verify the duplicate-row fix by Friday.",
    context:
      "Acme saw 12 duplicate rows in yesterday's payroll export. Engineering has a patch in validation. We are not promising the export will reopen before Friday until we verify the corrected file.",
    draft:
      "Hi Acme — quick update. We found the 12 duplicate rows from yesterday's export and we're holding the export while we verify the fix. We'll send the validated update by Friday. We're not promising a reopen before that because I don't want to give you a date until the corrected file passes validation.",
  },
  meeting: {
    artifactKind: "meeting",
    audience: "Activation pod",
    pmCall:
      "Move the onboarding checklist experiment to seller segment only by Wednesday.",
    context:
      "In today's review, SMB admins had a 3% activation dip, while seller accounts improved onboarding completion from 48% to 57%. Support has 9 SMB confusion tickets. Keeping all segments live would add 4 days of Design and QA review.",
    draft:
      "Follow-up from experiment review: I think we should narrow this to sellers. What changed: seller onboarding moved from 48% to 57%, but SMB activation dipped 3% and Support has 9 tickets. Tradeoff is that we keep the seller lift while giving up a broad rollout this week and spending 4 more days on Design and QA review for SMB. Next step: I will send the updated segment plan by Wednesday unless anyone objects today.",
  },
};
