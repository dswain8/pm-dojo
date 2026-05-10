import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Timer } from "../components/Timer";
import { DifficultyPicker } from "../components/DifficultyPicker";
import {
  type Difficulty,
  type QuickDrawScenario,
  QUICK_DRAW_SCENARIOS,
  DIFFICULTY_TIME,
  DIFFICULTY_COLORS,
} from "../data/scenarios";
import { saveSession } from "../lib/storage";
import { gradeResponse, getUserApiKey, type ScoreResult } from "../lib/scoring";

type Phase = "pick" | "write" | "grading" | "results";

export function InboxFire() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [phase, setPhase] = useState<Phase>("pick");
  const [scenario, setScenario] = useState<QuickDrawScenario | null>(null);
  const [response, setResponse] = useState("");
  const [timerRunning, setTimerRunning] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filteredScenarios = useMemo(
    () => QUICK_DRAW_SCENARIOS.filter((s) => s.difficulty === difficulty),
    [difficulty],
  );

  const startRound = useCallback(() => {
    const pool = filteredScenarios;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setScenario(pick);
    setResponse("");
    setResult(null);
    setErrorMsg(null);
    setPhase("write");
    setTimerRunning(true);
  }, [filteredScenarios]);

  const submitResponse = useCallback(async () => {
    if (!scenario) return;
    setTimerRunning(false);
    setPhase("grading");
    setErrorMsg(null);

    const { result: graded, aiError } = await gradeResponse(
      "inbox-fire",
      {
        title: scenario.title,
        setup: scenario.setup,
        task: scenario.task,
        gradingHints: scenario.gradingHints,
        principles: scenario.principles,
        modelAnswer: scenario.modelAnswer,
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
      mode: "inbox-fire",
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
    setPhase("results");
  }, [scenario, response]);

  const handleExpire = useCallback(() => {
    if (response.trim().length >= 10) {
      void submitResponse();
    } else {
      setTimerRunning(false);
      setErrorMsg("Time's up. Write at least 10 characters to submit.");
    }
  }, [response, submitResponse]);

  const playAgain = useCallback(() => {
    setPhase("pick");
    setScenario(null);
    setResult(null);
  }, []);

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
            <span className="text-dojo-accent">🔥</span> Inbox Fire
          </h1>
          <p className="text-dojo-muted mt-2">
            You just got tagged. Read the message, react fast, and make the
            PM call explicit.
          </p>
        </div>

        <div className="dojo-card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted">
            Difficulty
          </h2>
          <DifficultyPicker value={difficulty} onChange={setDifficulty} />
          <p className="text-xs text-dojo-muted">
            {DIFFICULTY_TIME[difficulty]}s timer · {filteredScenarios.length}{" "}
            scenario{filteredScenarios.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button onClick={startRound} className="dojo-btn-primary w-full">
          Draw!
        </button>
      </div>
    );
  }

  if (!scenario) return null;

  if (phase === "write") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${DIFFICULTY_COLORS[scenario.difficulty]}`}
            >
              {scenario.difficulty}
            </span>
            <h2 className="text-xl font-bold mt-1">{scenario.title}</h2>
          </div>
          <Timer
            seconds={DIFFICULTY_TIME[scenario.difficulty]}
            running={timerRunning}
            onExpire={handleExpire}
          />
        </div>

        <div className="dojo-card">
          <p className="text-sm text-dojo-text/80">{scenario.setup}</p>
        </div>

        <div className="dojo-card border-dojo-accent/30">
          <p className="text-sm font-semibold text-dojo-accent mb-3">
            YOUR TASK: {scenario.task}
          </p>
          <textarea
            rows={8}
            className="w-full"
            placeholder="Start writing..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            autoFocus
          />
        </div>

        {errorMsg && (
          <div className="dojo-card border-dojo-red/40 text-sm text-dojo-red">
            {errorMsg}
          </div>
        )}

        <button
          onClick={submitResponse}
          disabled={response.trim().length < 10}
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
        <div className="text-4xl animate-pulse">⚔️</div>
        <div>
          <h2 className="text-lg font-bold">Grading your response...</h2>
          <p className="text-sm text-dojo-muted mt-1">
            Comparing against PM principles. Usually takes 3-5 seconds.
          </p>
        </div>
      </div>
    );
  }

  // results
  if (!result) return null;
  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-xl font-bold">{scenario.title} — Graded</h2>

      <ResultView
        result={result}
        response={response}
        modelAnswer={scenario.modelAnswer}
      />

      <div className="flex gap-3">
        <button onClick={playAgain} className="dojo-btn flex-1">
          New Round
        </button>
        <Link to="/" className="dojo-btn flex-1 text-center">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// Shared result view
export function ResultView({
  result,
  response,
  modelAnswer,
}: {
  result: ScoreResult;
  response: string;
  modelAnswer?: string;
}) {
  const verdict =
    result.total >= 24
      ? "Senior PM energy."
      : result.total >= 18
        ? "Solid. A few things to tighten."
        : result.total >= 12
          ? "Getting there. Read the feedback."
          : "Rough round. Specifics below.";

  return (
    <div className="space-y-6">
      {/* Total */}
      <div className="text-center">
        <div className="text-5xl font-bold text-dojo-accent">
          {result.total}
          <span className="text-dojo-muted text-2xl">/30</span>
        </div>
        <div className="text-dojo-muted text-sm mt-1">{verdict}</div>
        {result.engine && <EngineBadge engine={result.engine} />}
      </div>

      {/* Per-dimension */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Clarity", value: result.clarity, color: "dojo-green" },
          { label: "Strategy", value: result.strategy, color: "dojo-blue" },
          {
            label: "Substance",
            value: result.substance,
            color: "dojo-purple",
          },
        ].map((s) => (
          <div key={s.label} className="dojo-card text-center">
            <div
              className={`score-circle mx-auto ${
                s.value >= 8
                  ? "border-dojo-green text-dojo-green"
                  : s.value >= 6
                    ? "border-dojo-accent text-dojo-accent"
                    : s.value >= 4
                      ? "border-dojo-blue text-dojo-blue"
                      : "border-dojo-red text-dojo-red"
              }`}
            >
              {s.value}
            </div>
            <div className="text-xs uppercase tracking-wider text-dojo-muted mt-2">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Coach punch */}
      <div className="border border-amber-500/30 rounded-xl p-4 bg-amber-500/5">
        <div className="text-xs uppercase tracking-wider text-amber-400 mb-1">
          Coach
        </div>
        <div className="text-sm text-dojo-text/90">💡 {result.coachPunch}</div>
      </div>

      {/* Principle named (first-principles mode) */}
      {result.principleNamed && (
        <div className="border border-dojo-blue/40 rounded-xl p-4 bg-dojo-blue/5">
          <div className="text-xs uppercase tracking-wider text-dojo-blue mb-1">
            The principle in play
          </div>
          <div className="text-sm font-semibold">{result.principleNamed}</div>
          {result.principleSource && (
            <div className="text-xs text-dojo-muted mt-1">
              Source: {result.principleSource}
            </div>
          )}
        </div>
      )}

      {/* Feedback */}
      <div className="dojo-card space-y-2">
        <h3 className="text-sm font-semibold text-dojo-accent uppercase tracking-wider mb-2">
          Principles
        </h3>
        {result.feedback.map((f, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 px-3 py-2 rounded-lg border ${
              f.status === "applied"
                ? "border-dojo-green/30 bg-dojo-green/5"
                : f.status === "partial"
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "border-dojo-red/30 bg-dojo-red/5"
            }`}
          >
            <span
              className={`text-sm mt-0.5 ${
                f.status === "applied"
                  ? "text-dojo-green"
                  : f.status === "partial"
                    ? "text-amber-400"
                    : "text-dojo-red"
              }`}
            >
              {f.status === "applied"
                ? "✓"
                : f.status === "partial"
                  ? "~"
                  : "✗"}
            </span>
            <div className="flex-1">
              <div className="text-sm font-medium">{f.principle}</div>
              <div className="text-xs text-dojo-muted">{f.source}</div>
              <div className="text-xs text-dojo-text/80 mt-1">{f.note}</div>
            </div>
          </div>
        ))}
      </div>

      {/* User response */}
      <div className="dojo-card">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-muted mb-2">
          Your Response
        </h3>
        <p className="text-sm whitespace-pre-wrap text-dojo-text/70">
          {response}
        </p>
      </div>

      {/* Model answer */}
      {modelAnswer && (
        <div className="dojo-card border-dojo-green/30">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-green mb-2">
            Model Answer
          </h3>
          <p className="text-sm whitespace-pre-wrap text-dojo-text/80">
            {modelAnswer}
          </p>
        </div>
      )}
    </div>
  );
}

function EngineBadge({ engine }: { engine: "rubric" | "ai" }) {
  const hasKey = Boolean(getUserApiKey());
  if (engine === "ai") {
    return (
      <div className="text-xs mt-2">
        <span className="text-dojo-green">scored by AI (Claude Haiku)</span>
      </div>
    );
  }
  return (
    <div className="text-xs mt-2">
      <span className="text-dojo-blue">
        {hasKey
          ? "scored by rubric · AI call failed (see message above)"
          : "scored by rubric · add a key in Settings for AI scoring"}
      </span>
    </div>
  );
}
