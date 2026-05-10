# PM Dojo 9.5 Goal

## Goal

PM Dojo should become a tool a strong product manager trusts before sending real work.

The target is not "fun PM arcade." The target is: paste a real Slack update, exec memo, PRD decision, customer reply, or meeting follow-up, and PM Dojo catches the right judgment gaps, refuses to over-score thin context, and produces a revised draft that a PM would actually consider sending.

## 9.5 Bar

PM Dojo reaches 9.5 when all of these are true:

1. [x] Real-work review is the primary product loop.
2. [x] Thin context cannot get a fake excellent score.
3. [x] Keyword-stuffed drafts are penalized, not rewarded.
4. [x] Rewrites never contain placeholders, slang, generic filler, or internal jargon in customer replies.
5. [x] Complete-context examples across all artifact types rewrite to 95+.
6. [x] The scorer explains whether the blocker is the draft or missing input context.
7. [x] The test bank covers at least 80 authored PM cases across five artifact types and ten domains.
8. [x] The Rubric Lab quality gate passes before we call an iteration shippable.
9. [x] Unsafe PM calls (blame, slang, internal jargon, too short) trigger a `[Rewrite paused ...]` refusal rather than a polished output.
10. [x] Customer replies never invent commitments the user did not state — the rewrite refuses with an `Accountability:` prompt instead.
11. [x] Decision/Tradeoff/Evidence lines are checked for coherence: if Context evidence does not propagate to Decision or Tradeoff, the rewrite is capped and flagged.

## Current Quality Gate

Run:

```bash
npm run gate
```

This runs, in order:

1. `npm run typecheck` — `tsc -b --noEmit`
2. `npm run rubric:lab` — full case bank with the gate criteria below
3. `npm run rubric:iterations` — 10 cumulative workflow iterations
4. `npm run probe` — adversarial probe (`scripts/probe-adversarial.cjs`)

The lab gate passes only when:

1. At least 80 cases exist.
2. Overall pass rate is 100% (every case meets its expected outcome).
3. No thin-context case rewrites to 95+.
4. No excellent rewrite leaks placeholders, slang, rubric-bingo, or internal-process language.
5. Every artifact type has at least three cases.

## Product Principle

PM Dojo should be honest before it is impressive.

If the user has not supplied enough judgment context, the right answer is not a confident rewrite. The right answer is: "I can improve the writing, but I cannot validate the PM call yet."

## What 9.5 Does NOT Yet Do

These are honest gaps. The 9.5 bar above is a deterministic preflight bar, not a judgment model. Do not market 9.5 beyond what these gaps allow.

1. **No judgment model.** The engine does not understand whether a PM call is *correct* — only whether it is *coherently presented*. A confident, internally consistent draft to do the wrong thing will still score well on rewrite quality.
2. **Numeric facts are not validated for relevance.** "42% activation, 55% target, 16 customer requests" is treated as substantive evidence regardless of whether those numbers actually justify the decision being recommended.
3. **The test bank is author-graded.** No external rater study, no inter-rater agreement, no correlation with how a strong PM would actually rank the same outputs. The bank shows the engine is internally consistent, not that the engine matches human judgment.
4. **Customer accountability is prompted, not generated.** When a customer reply lacks a commitment or refusal-to-promise, PM Dojo refuses with an `Accountability:` line. It does not invent the commitment for you. This is intentional, but it means the user must close the loop themselves.
5. **Rewrites refuse rather than invent.** Coherence violations, blocked PM calls, and missing accountability all surface as `[Rewrite paused ...]` sentinels rather than fabricated content. This is a feature for honesty, but a real PM tool will eventually need to ask better follow-up questions instead of just refusing.
6. **No retrieval, no memory.** Each review is stateless. PM Dojo cannot reference your past drafts, the company's prior decisions, or the recipient's known preferences.
7. **No live-LLM review.** The scorer is fully deterministic regex + heuristic. That makes it stable and auditable, but it caps the ceiling on nuance.

If you are tempted to claim PM Dojo is "PM-ready" beyond the bar above, re-read this list first.
