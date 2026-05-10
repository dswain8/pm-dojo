import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { DifficultyPicker } from "../components/DifficultyPicker";
import {
  type Difficulty,
  type RewriteScenario,
  REWRITE_SCENARIOS,
  DIFFICULTY_COLORS,
} from "../data/scenarios";
import { saveSession } from "../lib/storage";
import { gradeResponse, type ScoreResult } from "../lib/scoring";
import { ResultView } from "./InboxFire";

type Phase = "pick" | "rewrite" | "grading" | "compare";

export function RedPen() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [phase, setPhase] = useState<Phase>("pick");
  const [scenario, setScenario] = useState<RewriteScenario | null>(null);
  const [rewrite, setRewrite] = useState("");
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filtered = useMemo(
    () => REWRITE_SCENARIOS.filter((s) => s.difficulty === difficulty),
    [difficulty],
  );

  const startRound = useCallback(() => {
    const pick = filtered[Math.floor(Math.random() * filtered.length)];
    setScenario(pick);
    setRewrite("");
    setResult(null);
    setErrorMsg(null);
    setPhase("rewrite");
  }, [filtered]);

  const submit = useCallback(async () => {
    if (!scenario) return;
    setPhase("grading");
    setErrorMsg(null);

    const { result: graded, aiError } = await gradeResponse(
      "red-pen",
      {
        title: scenario.title,
        original: scenario.original,
        flaws: scenario.flaws,
        modelAnswer: scenario.modelRewrite,
      },
      rewrite,
    );

    if (aiError) {
      setErrorMsg(
        `AI scoring failed (${aiError.error}): ${aiError.message ?? "unknown"}. Showing rubric score instead — check your key in Settings.`,
      );
    }

    setResult(graded);
    saveSession({
      mode: "red-pen",
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      difficulty: scenario.difficulty,
      scores: {
        clarity: graded.clarity,
        strategy: graded.strategy,
        substance: graded.substance,
        total: graded.total,
      },
      feedback: graded.feedback,
      coachPunch: graded.coachPunch,
      userResponse: rewrite,
      timestamp: Date.now(),
    });
    setPhase("compare");
  }, [scenario, rewrite]);

  if (phase === "pick") {
    return (
      <div className="space-y-8">
        <div>
          <Link
            to="/practice"
            className="text-dojo-muted text-sm hover:text-dojo-accent"
          >
            ← Practice
          </Link>
          <h1 className="text-3xl font-bold mt-4">
            <span className="text-dojo-green">✂️</span> Red Pen
          </h1>
          <p className="text-dojo-muted mt-2">
            Bad PM writing. You fix it, then compare the sharper version
            against the actual flaws.
          </p>
        </div>
        <div className="dojo-card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted">
            Difficulty
          </h2>
          <DifficultyPicker value={difficulty} onChange={setDifficulty} />
          <p className="text-xs text-dojo-muted">
            {filtered.length} scenario{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={startRound} className="dojo-btn-primary w-full">
          Start Rep
        </button>
      </div>
    );
  }

  if (!scenario) return null;

  if (phase === "rewrite") {
    return (
      <div className="space-y-6">
        <div>
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${DIFFICULTY_COLORS[scenario.difficulty]}`}
          >
            {scenario.difficulty}
          </span>
          <h2 className="text-xl font-bold mt-1">{scenario.title}</h2>
        </div>

        <div className="dojo-card border-dojo-red/30">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-red mb-2">
            Original ({scenario.original.split(/\s+/).length} words)
          </h3>
          <p className="text-sm text-dojo-text/70 italic leading-relaxed">
            {scenario.original}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {scenario.flaws.map((f) => (
              <span
                key={f.tag}
                className="text-xs px-2 py-1 rounded-full bg-dojo-red/10 text-dojo-red border border-dojo-red/20"
              >
                {f.tag}
              </span>
            ))}
          </div>
        </div>

        <div className="dojo-card border-dojo-green/30">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-green mb-2">
            Your Rewrite
          </h3>
          <textarea
            rows={8}
            className="w-full"
            placeholder="Rewrite it. Fix the flaws. Keep the substance."
            value={rewrite}
            onChange={(e) => setRewrite(e.target.value)}
            autoFocus
          />
          {rewrite.trim() && (
            <p className="text-xs text-dojo-muted mt-2">
              {rewrite.split(/\s+/).length} words
            </p>
          )}
        </div>

        {errorMsg && (
          <div className="dojo-card border-dojo-red/40 text-sm text-dojo-red">
            {errorMsg}
          </div>
        )}

        <button
          onClick={submit}
          disabled={rewrite.trim().length < 10}
          className="dojo-btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Submit for Grading
        </button>
      </div>
    );
  }

  if (phase === "grading") {
    return (
      <div className="space-y-6 text-center py-16">
        <div className="text-4xl animate-pulse">✂️</div>
        <div>
          <h2 className="text-lg font-bold">Grading your rewrite...</h2>
          <p className="text-sm text-dojo-muted mt-1">
            Checking which flaws you fixed. Usually 3-5 seconds.
          </p>
        </div>
      </div>
    );
  }

  // compare
  if (!result) return null;
  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-xl font-bold">{scenario.title} — Graded</h2>

      <div className="dojo-card">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-red mb-2">
          Original
        </h3>
        <p className="text-sm italic text-dojo-text/60 leading-relaxed">
          {scenario.original}
        </p>
      </div>

      <ResultView
        result={result}
        response={rewrite}
        modelAnswer={scenario.modelRewrite}
      />

      <div className="flex gap-3">
        <button
          onClick={() => {
            setPhase("pick");
            setScenario(null);
            setResult(null);
          }}
          className="dojo-btn flex-1"
        >
          New Round
        </button>
        <Link to="/" className="dojo-btn flex-1 text-center">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
