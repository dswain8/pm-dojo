import { useState } from "react";
import { Link } from "react-router-dom";
import { getUserApiKey, setUserApiKey, testApiKey } from "../lib/scoring";

type TestState =
  | { kind: "idle" }
  | { kind: "testing" }
  | { kind: "ok" }
  | { kind: "fail"; message: string };

export function Settings() {
  const [key, setKey] = useState(getUserApiKey() ?? "");
  const [saved, setSaved] = useState(false);
  const [test, setTest] = useState<TestState>({ kind: "idle" });
  const hasKey = !!getUserApiKey();

  const save = () => {
    setUserApiKey(key || null);
    setSaved(true);
    setTest({ kind: "idle" });
    setTimeout(() => setSaved(false), 1500);
  };

  const clear = () => {
    setUserApiKey(null);
    setKey("");
    setTest({ kind: "idle" });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const runTest = async () => {
    if (!key.trim()) return;
    setTest({ kind: "testing" });
    const err = await testApiKey(key.trim());
    if (!err) {
      setTest({ kind: "ok" });
    } else {
      setTest({
        kind: "fail",
        message: `${err.error}: ${err.message ?? "unknown error"}`,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Link to="/" className="text-dojo-muted text-sm hover:text-dojo-accent">
          ← Home
        </Link>
        <h1 className="text-3xl font-bold mt-4">Settings</h1>
        <p className="text-dojo-muted mt-2 text-sm">
          Choose how PM Dojo grades your responses.
        </p>
      </div>

      <div className="dojo-card space-y-4">
        <div>
          <h2 className="font-bold">Scoring engine</h2>
          <p className="text-xs text-dojo-muted mt-1">
            Current:{" "}
            <span className={hasKey ? "text-dojo-green" : "text-dojo-blue"}>
              {hasKey ? "AI (Claude Haiku)" : "Rubric (offline)"}
            </span>
          </p>
        </div>

        <div className="space-y-3 text-sm text-dojo-text/80">
          <div>
            <strong className="text-dojo-blue">Rubric (default, free):</strong>{" "}
            Deterministic pattern-matching against PM principles. Detects weak
            words, buried ledes, missing tradeoffs, vague verbs. Fast, private,
            no account needed.
          </div>
          <div>
            <strong className="text-dojo-green">AI (optional):</strong> Paste
            your own Anthropic API key. Semantic scoring that understands
            context and audience fit — things the rubric can&apos;t catch.
          </div>
        </div>
      </div>

      <div className="dojo-card space-y-3">
        <h2 className="font-bold">Anthropic API key (optional)</h2>
        <p className="text-xs text-dojo-muted">
          Get one at{" "}
          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noreferrer"
            className="text-dojo-blue hover:underline"
          >
            console.anthropic.com
          </a>
          . Haiku costs roughly $0.001 per graded round.
        </p>
        <input
          type="password"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setTest({ kind: "idle" });
          }}
          placeholder="sk-ant-..."
          className="w-full px-3 py-2 rounded-lg bg-dojo-border/20 border border-dojo-border focus:border-dojo-accent text-sm font-mono"
        />
        <div className="flex flex-wrap gap-3">
          <button onClick={save} className="dojo-btn-primary">
            {saved ? "Saved ✓" : hasKey ? "Update" : "Save key"}
          </button>
          <button
            onClick={runTest}
            className="dojo-btn"
            disabled={!key.trim() || test.kind === "testing"}
          >
            {test.kind === "testing" ? "Testing…" : "Test key"}
          </button>
          {hasKey && (
            <button onClick={clear} className="dojo-btn">
              Clear key
            </button>
          )}
        </div>
        {test.kind === "ok" && (
          <p className="text-xs text-dojo-green">
            ✓ Key works. AI scoring is ready.
          </p>
        )}
        {test.kind === "fail" && (
          <p className="text-xs text-dojo-red">✗ {test.message}</p>
        )}
      </div>

      <div className="dojo-card border-dojo-accent/20 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-accent mb-1">
          Key safety — read this
        </h3>
        <p className="text-sm text-dojo-text/80">
          Your key is stored in <code className="text-xs">localStorage</code> as
          plaintext and sent directly from your browser to Anthropic. Nothing is
          sent to my server.
        </p>
        <p className="text-sm text-dojo-text/80">
          That means any script running on this origin — including a hostile
          browser extension — can read the key. Safer options:
        </p>
        <ul className="text-sm text-dojo-text/80 list-disc list-inside space-y-1">
          <li>Use a restricted / short-lived API key</li>
          <li>Set a low monthly spend limit in the Anthropic console</li>
          <li>Clear the key when you&apos;re done</li>
        </ul>
      </div>

      <div className="dojo-card border-dojo-accent/20">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-accent mb-2">
          Self-host
        </h3>
        <p className="text-sm text-dojo-text/80">
          Fork{" "}
          <a
            href="https://github.com/dswain8/pm-dojo"
            target="_blank"
            rel="noreferrer"
            className="text-dojo-blue hover:underline"
          >
            github.com/dswain8/pm-dojo
          </a>{" "}
          and deploy to your own Vercel. Same client-side BYO-key model — the
          app does not support or require a server-side API key.
        </p>
      </div>
    </div>
  );
}
