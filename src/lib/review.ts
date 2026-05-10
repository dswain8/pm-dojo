import {
  EXCELLENT_REWRITE_TARGET,
  assessWithRubricBank,
  getArtifactLabel,
  scoreToReadiness,
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

export const REVIEW_SAMPLE: ReviewInput = {
  artifactKind: "slack",
  audience: "VP Product, Eng lead, and Support lead",
  pmCall:
    "Pause the Friday CSV export launch until we validate the duplicate billing edge case and get Support-ready messaging.",
  context:
    "Beta found 17 duplicate export rows across 3 payroll customers. Support has two open escalations. Sales wants the launch this Friday because the feature is in two renewal conversations.",
  draft:
    "quick vibe check: csv export is kind of cooked lol. we can probably still ship friday but there is a duplicate row thing and support may get spicy. maybe eng can look? sales really wants this so i don't want to block unless folks feel strongly.",
};
