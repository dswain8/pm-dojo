import { useState } from "react";
import { Link } from "react-router-dom";
import { saveSession } from "../lib/storage";
import {
  REVIEW_SAMPLE,
  reviewArtifact,
  type ArtifactKind,
  type ReviewInput,
  type ReviewOutput,
} from "../lib/review";

const ARTIFACTS: Array<{ value: ArtifactKind; label: string; hint: string }> = [
  { value: "slack", label: "Slack", hint: "Status update or escalation" },
  { value: "exec", label: "Exec memo", hint: "Decision or readout" },
  { value: "prd", label: "PRD", hint: "Decision section" },
  { value: "customer", label: "Customer", hint: "Reply before sending" },
  { value: "meeting", label: "Follow-up", hint: "Post-meeting next steps" },
];

const EMPTY_INPUT: ReviewInput = {
  artifactKind: "slack",
  audience: "",
  pmCall: "",
  context: "",
  draft: "",
};

function readinessClass(readiness: ReviewOutput["readiness"]): string {
  if (readiness === "Send") return "border-dojo-green/40 bg-dojo-green/10 text-dojo-green";
  if (readiness === "Revise first") return "border-amber-500/40 bg-amber-500/10 text-amber-300";
  return "border-dojo-red/40 bg-dojo-red/10 text-dojo-red";
}

function qualityClass(score: number): string {
  if (score >= 95) return "border-dojo-green/40 bg-dojo-green/10 text-dojo-green";
  if (score >= 85) return "border-amber-500/40 bg-amber-500/10 text-amber-300";
  return "border-dojo-red/40 bg-dojo-red/10 text-dojo-red";
}

function confidenceCopy(output: ReviewOutput): string {
  if (output.missingContext.length === 0) {
    return "Enough context to judge the PM call and rewrite the artifact.";
  }
  return "Writing can improve, but PM judgment is under-supported until the missing context is added.";
}

export function ReviewWork() {
  const [input, setInput] = useState<ReviewInput>(EMPTY_INPUT);
  const [output, setOutput] = useState<ReviewOutput | null>(null);

  const canReview =
    input.draft.trim().length >= 20 && input.pmCall.trim().length >= 8;

  const update = <K extends keyof ReviewInput>(key: K, value: ReviewInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }));
    setOutput(null);
  };

  const runReview = () => {
    const result = reviewArtifact(input);
    setOutput(result);
    saveSession({
      mode: "review-real-work",
      scenarioId: `review-${Date.now()}`,
      scenarioTitle: "Review Real Work",
      difficulty: input.artifactKind,
      scores: {
        clarity: Math.round(result.score / 10),
        strategy: Math.round(result.rewriteQuality / 10),
        substance: Math.round(
          result.draftAssessment.dimensions.find((item) => item.id === "evidence")?.score ?? 0,
        ),
        total: result.score,
      },
      feedback: [
        ...result.landed.map((note) => ({
          principle: "What landed",
          source: "PM Dojo preflight",
          status: "applied" as const,
          note,
        })),
        ...result.missed.map((note) => ({
          principle: "What missed",
          source: "PM Dojo preflight",
          status: "missed" as const,
          note,
        })),
      ],
      coachPunch: result.oneLine,
      userResponse: input.draft,
      timestamp: Date.now(),
    });
  };

  const loadSample = () => {
    setInput(REVIEW_SAMPLE);
    setOutput(null);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Link to="/" className="text-dojo-muted text-sm hover:text-dojo-accent">
            ← Home
          </Link>
          <p className="text-xs uppercase tracking-[0.35em] text-dojo-accent mt-5">
            Review real work
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Preflight before you send.
          </h1>
          <p className="text-dojo-muted mt-3 max-w-2xl">
            Paste the artifact, state the PM call, then get what landed, what
            missed, and a revised draft shaped like something you can actually send.
          </p>
        </div>
        <button onClick={loadSample} className="dojo-btn md:self-center">
          Load messy sample
        </button>
      </div>

      <div className="dojo-card space-y-5">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-dojo-muted mb-3">
            What are you sending?
          </h2>
          <div className="grid gap-2 md:grid-cols-5">
            {ARTIFACTS.map((artifact) => {
              const selected = input.artifactKind === artifact.value;
              return (
                <button
                  key={artifact.value}
                  onClick={() => update("artifactKind", artifact.value)}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    selected
                      ? "border-dojo-accent bg-dojo-accent/10"
                      : "border-dojo-border hover:border-dojo-accent/60"
                  }`}
                >
                  <div className="text-sm font-semibold">{artifact.label}</div>
                  <div className="text-[11px] text-dojo-muted mt-1">
                    {artifact.hint}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-dojo-muted">
              Audience / decision-maker
            </span>
            <input
              value={input.audience}
              onChange={(e) => update("audience", e.target.value)}
              placeholder="Who needs to decide, act, or be reassured?"
              className="w-full rounded-lg border border-dojo-border bg-dojo-card px-4 py-3 text-sm text-dojo-text focus:border-dojo-accent/50 focus:outline-none focus:ring-1 focus:ring-dojo-accent/30"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-dojo-muted">
              PM call
            </span>
            <input
              value={input.pmCall}
              onChange={(e) => update("pmCall", e.target.value)}
              placeholder="What should happen next?"
              className="w-full rounded-lg border border-dojo-border bg-dojo-card px-4 py-3 text-sm text-dojo-text focus:border-dojo-accent/50 focus:outline-none focus:ring-1 focus:ring-dojo-accent/30"
            />
          </label>
        </div>

        <label className="space-y-2 block">
          <span className="text-xs font-semibold uppercase tracking-wider text-dojo-muted">
            Context that changes the judgment
          </span>
          <textarea
            rows={3}
            value={input.context}
            onChange={(e) => update("context", e.target.value)}
            placeholder="Facts, stakes, deadline, customer signal, competing pressure. Keep it short."
            className="w-full"
          />
        </label>

        <label className="space-y-2 block">
          <span className="text-xs font-semibold uppercase tracking-wider text-dojo-muted">
            Draft or notes
          </span>
          <textarea
            rows={8}
            value={input.draft}
            onChange={(e) => update("draft", e.target.value)}
            placeholder="Paste the thing you are about to send. Messy is fine."
            className="w-full"
          />
        </label>

        <button
          onClick={runReview}
          disabled={!canReview}
          className="dojo-btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Review before send
        </button>
        {!canReview && (
          <p className="text-xs text-dojo-muted text-center">
            Add a PM call and at least a short draft. The review is only useful
            when it knows what decision the artifact is supposed to carry.
          </p>
        )}
      </div>

      {output && (
        <div className="space-y-6 animate-slide-up">
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`rounded-xl border p-5 ${readinessClass(output.readiness)}`}>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] opacity-80">
                  Draft readiness
                </div>
                <div className="text-2xl font-bold mt-1">{output.readiness}</div>
              </div>
              <div className="text-4xl font-bold">{output.score}/100</div>
              <p className="text-sm mt-3 text-dojo-text/90">{output.oneLine}</p>
            </div>

            <div className={`rounded-xl border p-5 ${qualityClass(output.rewriteQuality)}`}>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] opacity-80">
                  Dojo rewrite quality
                </div>
                <div className="text-2xl font-bold mt-1">
                  Target {output.rewriteTarget}+
                </div>
              </div>
              <div className="text-4xl font-bold">{output.rewriteQuality}/100</div>
              <p className="text-sm mt-3 text-dojo-text/90">
                Scored against the authored rubric bank after rewrite passes.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SignalList title="What landed" tone="green" items={output.landed} />
            <SignalList title="What missed" tone="red" items={output.missed} />
          </div>

          {output.missingContext.length > 0 && (
            <div className="dojo-card border-amber-500/30 bg-amber-500/5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-300 mb-3">
                Need before trusting judgment
              </h2>
              <p className="text-sm text-dojo-text/80 mb-3">
                {confidenceCopy(output)}
              </p>
              <ul className="space-y-2">
                {output.missingContext.map((item) => (
                  <li key={item} className="text-sm text-dojo-text/80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="dojo-card border-dojo-green/30">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-green mb-3">
              Revised draft
            </h2>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-dojo-text/90 font-sans">
              {output.revisedDraft}
            </pre>
          </div>

          <div className="dojo-card">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted mb-3">
              Why this is stronger
            </h2>
            <ul className="space-y-2">
              {output.revisionReasons.map((reason) => (
                <li key={reason} className="text-sm text-dojo-text/80 flex gap-2">
                  <span className="text-dojo-accent">→</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <details className="dojo-card group">
            <summary className="cursor-pointer list-none text-sm font-semibold uppercase tracking-wider text-dojo-muted group-open:mb-3">
              Rubric details
            </summary>
            <div className="grid gap-2 md:grid-cols-2">
              {output.rewriteAssessment.dimensions.map((dimension) => (
                <div
                  key={dimension.id}
                  className="rounded-lg border border-dojo-border px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-dojo-text">{dimension.label}</span>
                    <span className="text-xs text-dojo-muted">
                      {dimension.score}/{dimension.max}
                    </span>
                  </div>
                  {dimension.status !== "strong" && (
                    <p className="text-xs text-dojo-muted mt-1">{dimension.repair}</p>
                  )}
                </div>
              ))}
            </div>
          </details>

          <div className="flex gap-3">
            <button onClick={() => setOutput(null)} className="dojo-btn flex-1">
              Edit and rerun
            </button>
            <Link to="/practice" className="dojo-btn flex-1 text-center">
              Practice this skill
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function SignalList({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "green" | "red";
  items: string[];
}) {
  const color =
    tone === "green"
      ? "text-dojo-green border-dojo-green/30 bg-dojo-green/5"
      : "text-dojo-red border-dojo-red/30 bg-dojo-red/5";

  return (
    <div className="dojo-card">
      <h2
        className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
          tone === "green" ? "text-dojo-green" : "text-dojo-red"
        }`}
      >
        {title}
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className={`rounded-lg border px-3 py-2 text-sm ${color}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
