import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { DifficultyPicker } from "../components/DifficultyPicker";
import {
  type Difficulty,
  CONCEPT_SCENARIOS,
  DIFFICULTY_COLORS,
} from "../data/scenarios";
import { saveSession } from "../lib/storage";
import { gradeResponse, type ScoreResult } from "../lib/scoring";
import { ResultView } from "./InboxFire";

type Phase = "pick" | "think" | "grading" | "reveal";

export function FirstPrinciples() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [phase, setPhase] = useState<Phase>("pick");
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [response, setResponse] = useState("");
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filtered = useMemo(
    () => CONCEPT_SCENARIOS.filter((s) => s.difficulty === difficulty),
    [difficulty],
  );

  const scenario = filtered[scenarioIdx] ?? null;

  const startRound = useCallback(() => {
    setScenarioIdx(Math.floor(Math.random() * filtered.length));
    setResponse("");
    setResult(null);
    setErrorMsg(null);
    setPhase("think");
  }, [filtered]);

  const submit = useCallback(async () => {
    if (!scenario) return;
    setPhase("grading");
    setErrorMsg(null);

    // Build a principle hint string for the model, NOT shown to user
    const referencePrinciple = `${scenario.bestAnswer.principle} (${scenario.bestAnswer.source}) — ${scenario.bestAnswer.explanation}`;

    const { result: graded, aiError } = await gradeResponse(
      "first-principles",
      {
        title: scenario.title,
        situation: scenario.situation,
        principles: scenario.relatedPrinciples,
        modelAnswer: referencePrinciple,
      },
      response,
    );

    if (aiError) {
      setErrorMsg(
        `AI scoring failed (${aiError.error}): ${aiError.message ?? "unknown"}. Showing rubric score instead — check your key in Settings.`,
      );
    }

    setResult(graded);
    saveSession({
      mode: "first-principles",
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
      userResponse: response,
      timestamp: Date.now(),
    });
    setPhase("reveal");
  }, [scenario, response]);

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
            <span className="text-dojo-blue">🧠</span> First Principles
          </h1>
          <p className="text-dojo-muted mt-2">
            Messy situation. You write what you'd actually do. AI names the
            principle in play and grades how well you applied it.
          </p>
        </div>
        <div className="dojo-card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted">
            Difficulty
          </h2>
          <DifficultyPicker value={difficulty} onChange={setDifficulty} />
        </div>
        <button onClick={startRound} className="dojo-btn-primary w-full">
          Start
        </button>
      </div>
    );
  }

  if (!scenario) return null;

  if (phase === "think") {
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

        <div className="dojo-card border-dojo-blue/30">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-blue mb-3">
            Situation
          </h3>
          <p className="text-sm leading-relaxed">{scenario.situation}</p>
        </div>

        <div className="dojo-card">
          <label className="text-xs font-semibold uppercase tracking-wider text-dojo-muted block mb-2">
            What would you do? Write the move.
          </label>
          <textarea
            rows={7}
            className="w-full"
            placeholder="Describe what the PM should say, do, or write. Specifics, not platitudes."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            autoFocus
          />
          <p className="text-xs text-dojo-muted mt-2">
            Don't name a framework. Just write the move. The AI will name the
            principle and grade whether you applied it.
          </p>
        </div>

        {errorMsg && (
          <div className="dojo-card border-dojo-red/40 text-sm text-dojo-red">
            {errorMsg}
          </div>
        )}

        <button
          onClick={submit}
          disabled={response.trim().length < 20}
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
        <div className="text-4xl animate-pulse">🧠</div>
        <div>
          <h2 className="text-lg font-bold">Analyzing your move...</h2>
          <p className="text-sm text-dojo-muted mt-1">
            Identifying the principle and scoring your application.
          </p>
        </div>
      </div>
    );
  }

  // reveal
  if (!result) return null;
  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-xl font-bold">{scenario.title} — Graded</h2>

      <ResultView result={result} response={response} />

      {/* Reference principle for learning */}
      <div className="dojo-card border-dojo-green/30">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-green mb-2">
          Wiki Reference
        </h3>
        <p className="text-sm font-semibold mb-1">
          {scenario.bestAnswer.principle}
        </p>
        <p className="text-xs text-dojo-muted mb-2">
          Source: {scenario.bestAnswer.source}
        </p>
        <p className="text-sm text-dojo-text/80">
          {scenario.bestAnswer.explanation}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {scenario.relatedPrinciples.map((p) => (
          <span
            key={p}
            className="text-xs px-2 py-1 rounded-full border border-dojo-border text-dojo-muted"
          >
            {p}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            setPhase("pick");
            setResult(null);
          }}
          className="dojo-btn-primary flex-1"
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
