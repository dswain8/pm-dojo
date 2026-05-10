import { reviewArtifact, type ReviewInput } from "./review";
import {
  ALL_REVIEW_ROBUSTNESS_CASES,
  PM_WORKFLOW_CASES,
  REVIEW_GOLDEN_CASES,
  type ReviewGoldenCase,
  type PMWorkflowCase,
  type ReviewRobustnessCase,
} from "./reviewTests";
import type { ArtifactKind } from "./rubricBank";

export const RUBRIC_LAB_TARGET = {
  productGoal: "PM Dojo 9.5",
  minimumCases: 80,
  minimumPassRate: 0.95,
  minimumCasesPerArtifact: 3,
  excellentRewriteScore: 95,
} as const;

type LabExpectation =
  | "golden"
  | "excellent"
  | "capped"
  | "low-draft-excellent-rewrite";

export interface RubricLabCaseResult {
  id: string;
  name: string;
  domain: string;
  artifactKind: ArtifactKind;
  expectation: LabExpectation;
  draftScore: number;
  rewriteScore: number;
  pass: boolean;
  flags: string[];
}

export interface RubricLabReport {
  target: typeof RUBRIC_LAB_TARGET;
  totalCases: number;
  passedCases: number;
  passRate: number;
  qualityScore: number;
  meetsGate: boolean;
  artifactCoverage: Record<ArtifactKind, number>;
  domainCoverage: string[];
  failures: RubricLabCaseResult[];
  results: RubricLabCaseResult[];
}

export interface RubricLabIterationReport {
  iteration: number;
  workflow: string;
  totalWorkflowCases: number;
  passedWorkflowCases: number;
  pass: boolean;
  failures: RubricLabCaseResult[];
}

const BAD_REWRITE_LEAK =
  /lol|spicy|kinda|cooked|brrr|circle back|touch base|best practices|\bDRI\b|standup|internal validation|pipeline is not green|rubric bingo|synergy|north star/i;

function hasPlaceholder(text: string): boolean {
  return /\[[^\]]+\]/.test(text);
}

function artifactCoverage(cases: Array<{ input: ReviewInput }>): Record<ArtifactKind, number> {
  return cases.reduce<Record<ArtifactKind, number>>(
    (coverage, testCase) => ({
      ...coverage,
      [testCase.input.artifactKind]: coverage[testCase.input.artifactKind] + 1,
    }),
    {
      slack: 0,
      exec: 0,
      prd: 0,
      customer: 0,
      meeting: 0,
    },
  );
}

function goldenResult(testCase: ReviewGoldenCase): RubricLabCaseResult {
  const output = reviewArtifact(testCase.input);
  const missedText = output.missed.join(" ").toLowerCase();
  const flags = [
    output.score >= testCase.expectedDraftBelow ? "draft-over-scored" : "",
    output.rewriteQuality < testCase.expectedRewriteAtLeast ? "rewrite-under-target" : "",
    ...testCase.expectedMissIncludes.map((needle) =>
      missedText.includes(needle) ? "" : `missing-expected-feedback:${needle}`,
    ),
  ].filter(Boolean);

  return {
    id: testCase.id,
    name: testCase.name,
    domain: "golden",
    artifactKind: testCase.input.artifactKind,
    expectation: "golden",
    draftScore: output.score,
    rewriteScore: output.rewriteQuality,
    pass: flags.length === 0,
    flags,
  };
}

function robustnessResult(testCase: ReviewRobustnessCase): RubricLabCaseResult {
  const output = reviewArtifact(testCase.input);
  const rewriteHasPlaceholder = hasPlaceholder(output.revisedDraft);
  const rewriteHasBadLeak = BAD_REWRITE_LEAK.test(output.revisedDraft);
  const flags: string[] = [];

  if (testCase.expectedRewrite === "excellent") {
    if (output.rewriteQuality < RUBRIC_LAB_TARGET.excellentRewriteScore) {
      flags.push("rewrite-under-95");
    }
    if (rewriteHasPlaceholder) flags.push("placeholder-leak");
    if (rewriteHasBadLeak) flags.push("bad-language-leak");
  }

  if (testCase.expectedRewrite === "capped" && output.rewriteQuality >= RUBRIC_LAB_TARGET.excellentRewriteScore) {
    flags.push("thin-context-false-excellent");
  }

  if (testCase.expectedRewrite === "low-draft-excellent-rewrite") {
    if (output.score >= 50) flags.push("bad-draft-over-scored");
    if (output.rewriteQuality < RUBRIC_LAB_TARGET.excellentRewriteScore) {
      flags.push("rewrite-under-95");
    }
    if (rewriteHasPlaceholder) flags.push("placeholder-leak");
    if (rewriteHasBadLeak) flags.push("bad-language-leak");
  }

  return {
    id: testCase.id,
    name: testCase.name,
    domain: testCase.domain,
    artifactKind: testCase.input.artifactKind,
    expectation: testCase.expectedRewrite,
    draftScore: output.score,
    rewriteScore: output.rewriteQuality,
    pass: flags.length === 0,
    flags,
  };
}

export function runRubricLab(): RubricLabReport {
  const results = [
    ...REVIEW_GOLDEN_CASES.map(goldenResult),
    ...ALL_REVIEW_ROBUSTNESS_CASES.map(robustnessResult),
  ];
  const allCases = [...REVIEW_GOLDEN_CASES, ...ALL_REVIEW_ROBUSTNESS_CASES];
  const passedCases = results.filter((result) => result.pass).length;
  const passRate = passedCases / results.length;
  const coverage = artifactCoverage(allCases);
  const coveragePass = Object.values(coverage).every(
    (count) => count >= RUBRIC_LAB_TARGET.minimumCasesPerArtifact,
  );
  const domainCoverage = [
    ...new Set(ALL_REVIEW_ROBUSTNESS_CASES.map((testCase) => testCase.domain)),
  ].sort();
  const enoughCases = results.length >= RUBRIC_LAB_TARGET.minimumCases;
  const qualityScore = Math.round(passRate * 100);
  const meetsGate =
    enoughCases &&
    coveragePass &&
    passRate >= RUBRIC_LAB_TARGET.minimumPassRate &&
    results.every((result) => result.pass);

  return {
    target: RUBRIC_LAB_TARGET,
    totalCases: results.length,
    passedCases,
    passRate,
    qualityScore,
    meetsGate,
    artifactCoverage: coverage,
    domainCoverage,
    failures: results.filter((result) => !result.pass),
    results,
  };
}

export function runWorkflowIterations(): RubricLabIterationReport[] {
  return Array.from({ length: 10 }, (_, index) => {
    const iteration = index + 1;
    const cases = PM_WORKFLOW_CASES.filter(
      (testCase) => testCase.iteration <= iteration,
    );
    const currentBatch = PM_WORKFLOW_CASES.filter(
      (testCase) => testCase.iteration === iteration,
    );
    const results = cases.map(robustnessResult);
    const failures = results.filter((result) => !result.pass);
    const workflows = [
      ...new Set(currentBatch.map((testCase: PMWorkflowCase) => testCase.workflow)),
    ];

    return {
      iteration,
      workflow: workflows.join(", "),
      totalWorkflowCases: cases.length,
      passedWorkflowCases: results.length - failures.length,
      pass: failures.length === 0,
      failures,
    };
  });
}

export function formatWorkflowIterationReport(
  iterations: RubricLabIterationReport[],
): string {
  return iterations
    .map((iteration) => {
      const failureText =
        iteration.failures.length === 0
          ? "none"
          : iteration.failures
              .map(
                (failure) =>
                  `${failure.id} draft=${failure.draftScore} rewrite=${failure.rewriteScore} flags=${failure.flags.join(",")}`,
              )
              .join(" | ");
      return `Iteration ${iteration.iteration}: ${iteration.pass ? "PASS" : "FAIL"} ${iteration.workflow} cumulative=${iteration.passedWorkflowCases}/${iteration.totalWorkflowCases} failures=${failureText}`;
    })
    .join("\n");
}

export function formatRubricLabReport(report: RubricLabReport): string {
  const coverage = Object.entries(report.artifactCoverage)
    .map(([artifact, count]) => `${artifact}:${count}`)
    .join(" ");
  const failures =
    report.failures.length === 0
      ? "none"
      : report.failures
          .map(
            (failure) =>
              `${failure.id} draft=${failure.draftScore} rewrite=${failure.rewriteScore} flags=${failure.flags.join(",")}`,
          )
          .join("\n");

  return [
    `Rubric Lab: ${report.target.productGoal}`,
    `Cases: ${report.passedCases}/${report.totalCases} passing (${Math.round(report.passRate * 100)}%)`,
    `Quality score: ${report.qualityScore}/100`,
    `Gate: ${report.meetsGate ? "PASS" : "FAIL"}`,
    `Artifact coverage: ${coverage}`,
    `Domain coverage: ${report.domainCoverage.length} domains`,
    `Failures: ${failures}`,
  ].join("\n");
}
