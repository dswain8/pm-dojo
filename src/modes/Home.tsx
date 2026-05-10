import { Link } from "react-router-dom";
import { getSessions, getStreak } from "../lib/storage";

export function Home() {
  const sessions = getSessions();
  const realWorkReviews = sessions.filter((s) => s.mode === "review-real-work");
  const streak = getStreak();

  return (
    <div className="space-y-10 animate-slide-up">
      <section className="dojo-card overflow-hidden relative border-dojo-accent/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_34rem)]" />
        <div className="relative space-y-7">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-dojo-accent">
              PM Dojo
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-4 max-w-3xl">
              Make the PM call sharper before you send it.
            </h1>
            <p className="text-dojo-muted text-lg mt-5 max-w-2xl leading-relaxed">
              Paste a Slack update, exec memo, PRD section, customer reply, or
              meeting follow-up. PM Dojo checks whether the call, evidence,
              tradeoff, and ask are clear enough to send.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/review" className="dojo-btn-primary text-center">
              Review Real Work
            </Link>
            <Link to="/practice" className="dojo-btn text-center">
              Practice a Rep
            </Link>
          </div>

          <div className="grid gap-3 text-sm md:grid-cols-3">
            <ProofPoint label="1" text="Paste the messy draft or notes." />
            <ProofPoint label="2" text="State the PM call you want to carry." />
            <ProofPoint label="3" text="Get landed, missed, and a revised draft." />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="dojo-card">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-accent">
            Best first use
          </h2>
          <p className="text-dojo-text/90 mt-3">
            Use it on a real artifact you are about to send. Generic practice is
            useful later; the fastest trust test is whether the rewrite is
            better than your current draft.
          </p>
        </div>

        <div className="dojo-card">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted">
            Your loop
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-2xl font-bold text-dojo-accent">
                {realWorkReviews.length}
              </div>
              <div className="text-xs text-dojo-muted">real-work reviews</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-dojo-accent">
                {streak}
              </div>
              <div className="text-xs text-dojo-muted">day streak</div>
            </div>
          </div>
          <Link
            to="/progress"
            className="mt-4 inline-flex min-h-11 items-center text-sm text-dojo-muted hover:text-dojo-accent"
          >
            View progress →
          </Link>
        </div>
      </section>

      <section className="text-center text-xs text-dojo-muted/70">
        PM Dojo is a local preflight and practice tool. It is strongest at
        communication judgment: point, evidence, tradeoff, ask.
      </section>
    </div>
  );
}

function ProofPoint({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-lg border border-dojo-border bg-dojo-bg/50 p-4">
      <div className="text-dojo-accent font-bold">{label}</div>
      <div className="text-dojo-muted mt-1">{text}</div>
    </div>
  );
}
