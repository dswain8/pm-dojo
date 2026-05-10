import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface ActiveSession {
  status: "active" | "scoring" | "complete" | "idle";
  mode: string | null;
  phase: "scenario" | "waiting" | "scoring" | "results" | null;
  scenario: {
    title: string;
    source: string;
    context: string;
    audience: string[];
    stakes: string;
    content: string;
  } | null;
  userResponse: string | null;
  score: {
    clarity: number;
    strategy: number;
    substance: number;
    total: number;
    maxTotal: number;
  } | null;
  feedback: Array<{
    principle: string;
    source: string;
    status: "missed" | "applied" | "partial";
    note: string;
  }> | null;
  modelAnswer: string | null;
  keyTakeaway: string | null;
  clutchRating: number | null;
  streak: number | null;
  belt: string | null;
  timestamp: string | null;
}

const MODE_LABELS: Record<
  string,
  { icon: string; name: string; color: string }
> = {
  "inbox-fire": { icon: "🔥", name: "INBOX FIRE", color: "text-blue-400" },
  "the-room": { icon: "🚪", name: "THE ROOM", color: "text-emerald-400" },
  "red-pen": { icon: "✂️", name: "RED PEN", color: "text-indigo-400" },
  "first-principles": {
    icon: "🧠",
    name: "FIRST PRINCIPLES",
    color: "text-slate-400",
  },
  boss: { icon: "⚡", name: "BOSS FIGHT", color: "text-amber-400" },
};

function scoreColor(value: number, max: number): string {
  const pct = value / max;
  if (pct >= 0.8) return "text-emerald-400 border-emerald-400";
  if (pct >= 0.6) return "text-blue-400 border-blue-400";
  if (pct >= 0.4) return "text-amber-400 border-amber-400";
  return "text-red-400 border-red-400";
}

function statusColor(status: string): string {
  if (status === "applied")
    return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  if (status === "partial")
    return "text-amber-400 border-amber-500/30 bg-amber-500/10";
  return "text-red-400 border-red-500/30 bg-red-500/10";
}

export function LiveSession() {
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [polling] = useState(true);

  // Poll active-session.json every 1 second
  useEffect(() => {
    if (!polling) return;

    const fetchSession = () => {
      // /api/* is gone since the API route was removed. Read directly from the
      // static JSON in /progress/ — written by the local session-logger.
      fetch("/progress/active-session.json")
        .then((r) => (r.ok ? r.json() : null))
        .then(setSession)
        .catch(() => {});
    };

    fetchSession();
    const interval = setInterval(fetchSession, 1000);
    return () => clearInterval(interval);
  }, [polling]);

  // Idle state
  if (!session || session.status === "idle" || !session.mode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="border border-dojo-border rounded-xl p-8 text-center max-w-md">
          <div className="text-4xl mb-4">⚔️</div>
          <h2 className="text-xl font-bold text-blue-400 mb-2">
            Waiting for session...
          </h2>
          <p className="text-sm text-dojo-muted mb-4">
            Run{" "}
            <code className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
              /spar
            </code>{" "}
            in Claude Code to start a session. This screen updates live.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-dojo-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Listening...
          </div>
        </div>
        <Link
          to="/"
          className="text-sm text-dojo-muted hover:text-blue-400 transition-colors font-mono"
        >
          ← back to home
        </Link>
      </div>
    );
  }

  const modeInfo = MODE_LABELS[session.mode] || {
    icon: "⚔️",
    name: session.mode.toUpperCase(),
    color: "text-blue-400",
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Mode + Status header */}
      <div className="border border-dojo-border rounded-xl overflow-hidden">
        <div className="bg-dojo-border/50 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{modeInfo.icon}</span>
            <span
              className={`font-bold text-sm tracking-wider ${modeInfo.color}`}
            >
              {modeInfo.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            {session.streak && (
              <span className="text-orange-400">{session.streak}d 🔥</span>
            )}
            {session.clutchRating && (
              <span className="text-blue-400">
                CR: {session.clutchRating.toLocaleString()}
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                session.phase === "scenario"
                  ? "bg-blue-500/20 text-blue-400"
                  : session.phase === "waiting"
                    ? "bg-amber-500/20 text-amber-400 animate-pulse"
                    : session.phase === "results"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-dojo-border text-dojo-muted"
              }`}
            >
              {session.phase === "scenario" && "YOUR TURN"}
              {session.phase === "waiting" && "SCORING..."}
              {session.phase === "scoring" && "RESULTS"}
              {session.phase === "results" && "RESULTS"}
            </span>
          </div>
        </div>
      </div>

      {/* Scenario */}
      {session.scenario && (
        <div className="dojo-card space-y-3">
          <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
            {session.scenario.title}
          </h3>
          {session.scenario.source && (
            <div className="text-xs text-dojo-muted font-mono">
              source: {session.scenario.source}
            </div>
          )}
          {session.scenario.stakes && (
            <div className="text-xs">
              <span className="text-amber-400 font-mono">stakes</span>
              <span className="text-dojo-muted/50"> :: </span>
              <span className="text-dojo-muted">{session.scenario.stakes}</span>
            </div>
          )}
          {session.scenario.audience &&
            session.scenario.audience.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {session.scenario.audience.map((a, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded-full border border-dojo-border text-dojo-muted"
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}
          <div className="text-sm text-dojo-text/80 whitespace-pre-wrap border-l-2 border-blue-500/30 pl-4">
            {session.scenario.content}
          </div>
        </div>
      )}

      {/* User response (shown during waiting/results) */}
      {session.userResponse &&
        (session.phase === "waiting" ||
          session.phase === "scoring" ||
          session.phase === "results") && (
          <div className="dojo-card">
            <h3 className="text-sm font-semibold text-dojo-muted uppercase tracking-wider mb-2">
              Your Response
            </h3>
            <div className="text-sm text-dojo-text/70 whitespace-pre-wrap border-l-2 border-dojo-border pl-4">
              {session.userResponse}
            </div>
          </div>
        )}

      {/* Scoring animation */}
      {session.phase === "waiting" && (
        <div className="dojo-card text-center py-8">
          <div className="text-2xl mb-2 animate-pulse">⚔️</div>
          <div className="text-sm text-dojo-muted font-mono">
            Analyzing your response...
          </div>
        </div>
      )}

      {/* Results */}
      {(session.phase === "scoring" || session.phase === "results") &&
        session.score && (
          <div className="space-y-4 animate-slide-up">
            {/* Score circles */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Clarity", value: session.score.clarity },
                { label: "Strategy", value: session.score.strategy },
                { label: "Substance", value: session.score.substance },
              ].map((s) => (
                <div key={s.label} className="dojo-card text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-2 mx-auto animate-score-reveal ${scoreColor(s.value, 10)}`}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-dojo-muted mt-2">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="text-center">
              <span className="text-4xl font-bold text-blue-400">
                {session.score.total}
              </span>
              <span className="text-dojo-muted text-lg">
                /{session.score.maxTotal}
              </span>
            </div>

            {/* Feedback / Principles */}
            {session.feedback && session.feedback.length > 0 && (
              <div className="dojo-card space-y-2">
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">
                  Principles
                </h3>
                {session.feedback.map((f, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 px-3 py-2 rounded-lg border ${statusColor(f.status)}`}
                  >
                    <span className="text-sm mt-0.5">
                      {f.status === "applied"
                        ? "✓"
                        : f.status === "partial"
                          ? "~"
                          : "✗"}
                    </span>
                    <div>
                      <div className="text-sm font-medium">{f.principle}</div>
                      <div className="text-xs opacity-70">
                        {f.source} — {f.note}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Coaching punch / key takeaway */}
            {session.keyTakeaway && (
              <div className="border border-amber-500/30 rounded-xl p-4 bg-amber-500/5">
                <div className="text-sm text-amber-400 font-medium">
                  💡 {session.keyTakeaway}
                </div>
              </div>
            )}

            {/* Model answer */}
            {session.modelAnswer && (
              <div className="dojo-card">
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                  Model Answer
                </h3>
                <div className="text-sm text-dojo-text/80 whitespace-pre-wrap">
                  {session.modelAnswer}
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
