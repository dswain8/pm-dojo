import { Link } from "react-router-dom";

const PRACTICE_MODES = [
  {
    path: "/inbox-fire",
    label: "Inbox Fire",
    eyebrow: "Slack / escalation",
    description: "React to a messy inbound message without hiding the call.",
  },
  {
    path: "/red-pen",
    label: "Red Pen",
    eyebrow: "Rewrite",
    description: "Turn weak PM writing into something specific and useful.",
  },
  {
    path: "/first-principles",
    label: "First Principles",
    eyebrow: "Judgment",
    description: "Reason through a messy PM situation before choosing the move.",
  },
  {
    path: "/the-room",
    label: "The Room",
    eyebrow: "Stakeholders",
    description: "Handle meeting pressure, disagreement, and trust repair.",
  },
];

export function Practice() {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <Link to="/" className="text-dojo-muted text-sm hover:text-dojo-accent">
          ← Home
        </Link>
        <p className="text-xs uppercase tracking-[0.35em] text-dojo-accent mt-5">
          Practice reps
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">
          Train the move before it is live.
        </h1>
        <p className="text-dojo-muted mt-3 max-w-2xl">
          Use lanes when you want reps. Use Review Real Work when you are about
          to send something for real.
        </p>
      </div>

      <div className="dojo-card border-dojo-accent/30">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-dojo-accent">
              Suggested next rep
            </div>
            <h2 className="text-xl font-bold mt-1">Red Pen</h2>
            <p className="text-sm text-dojo-muted mt-1">
              Best companion to Review Real Work: learn to remove hedging,
              buried ledes, and vague asks.
            </p>
          </div>
          <Link to="/red-pen" className="dojo-btn-primary text-center">
            Start Red Pen
          </Link>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {PRACTICE_MODES.map((mode) => (
          <Link
            key={mode.path}
            to={mode.path}
            className="dojo-card group hover:border-dojo-accent/70 hover:shadow-lg hover:shadow-dojo-accent/10 transition-all"
          >
            <div className="text-xs uppercase tracking-wider text-dojo-muted">
              {mode.eyebrow}
            </div>
            <h2 className="text-xl font-bold mt-2 group-hover:text-dojo-accent">
              {mode.label}
            </h2>
            <p className="text-sm text-dojo-muted mt-2">{mode.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
