# Handoffs

One file per phase. Three sections. The audit trail for why we did what we did.

## Why this exists

PM Dojo is built by a 3-party loop: **Debjeet** (intent + judgment), **Claude** (prompts + review), **Codex** (implementation). Without a contract, the loop devolves into paste-relay. This folder is the contract.

## The trigger vocabulary (memorize these six)

Both agents respond to the same triggers. Default split: Claude prompts/reviews, Codex builds/fixes. Swap any time.

| Trigger | Who you say it to | What they do |
|---------|------|--------------|
| `prompt N: <goal>` | Claude (usually) | Draft Phase N prompt into `handoffs/phase-N-slug.md` |
| `build N` | Codex (usually) | Read `handoffs/phase-N-*.md`, execute prompt, append `## Codex report`, commit when verify passes |
| `review N` | Claude (usually) | Read phase file, check acceptance, append `## Verification`, verdict: SHIP / FIX / REWORK |
| `fix N` | Codex (usually) | Read latest `## Verification`, address each ❌, append updated report |
| `status` | Either | Read all `handoffs/*.md`, summarize verified / in-flight / blocked |
| `ship` | Either | Phase verified — write final commit message, tag if release |

### Ping-pong loop

```
You → Claude:  prompt 7: <one-line goal>
Claude:        drafts handoffs/phase-7-slug.md
You → Codex:   build 7
Codex:         executes, appends report, commits
You → Claude:  review 7
Claude:        verdict in phase file (SHIP / FIX / REWORK)
You → Codex:   fix 7  ← only if FIX or REWORK
You → Claude:  review 7  ← repeat until SHIP
You → Either:  ship
```

### Role swap

Triggers are symmetric. Use `build N` on Claude when the work is judgment-heavy (e.g., copy, prompt design). Use `review N` on Codex when you want a second pair of eyes — divergent verdicts from Claude+Codex are signal.

## The contract

Every phase has:

1. A **goal** (one sentence — what does done look like?)
2. An **acceptance test** (`npm run verify` + any extra behavior)
3. A **report** from Codex (commit hash + 5-line summary + decisions made)
4. A **verification** from Claude (acceptance met? regressions? next move)

If `npm run verify` doesn't pass, the phase isn't done. No debate.

## File structure

```
handoffs/
  README.md           ← this file
  _template.md        ← copy this for new phases
  phase-1-sanitize-pm-call.md
  phase-2-...
  phase-N-name.md
```

Filename: `phase-N-short-slug.md`. N is monotonic, slug is kebab-case.

## The phase prompt template

Claude writes the prompt. Debjeet pastes to Codex. Codex executes and reports back. Format is fixed:

```
Phase N: [name]

Goal: [one sentence — what does done look like?]

Acceptance:
- `npm run verify` passes
- [specific behavior — e.g. "OG tags render in LinkedIn debugger"]
- [specific behavior — e.g. "375px viewport: no horizontal scroll"]

Constraints:
- [what can't change — e.g. "no new dependencies"]
- [what can't change — e.g. "client-side only, no LLM calls"]

Out of scope:
- [explicit non-goals to prevent scope creep]

Files likely to touch:
- [path]
- [path]

Report back with:
- Commit hash + message
- 5-line summary of what changed
- Any decisions you made (and why)
- `npm run verify` output (last 10 lines)
```

## The Codex report template

Codex appends to the same phase file under `## Codex report`. Format:

```
## Codex report

Commit: `abc1234` — Phase N: [name]

Summary:
- [what changed, line 1]
- [what changed, line 2]
- ...

Decisions:
- [decision + reason — e.g. "used <picture> not <img srcset> because Safari has issues with srcset on AVIF"]

Verify output:
[paste last 10 lines of `npm run verify`]
```

## The Claude verification template

Claude appends under `## Verification`. Format:

```
## Verification

Acceptance:
- [✅/❌] verify passes
- [✅/❌] [specific behavior 1]
- [✅/❌] [specific behavior 2]

Regressions checked:
- [what I looked for and didn't find]

Verdict: [SHIP / FIX / REWORK]

Next phase: [phase N+1 slug, or "ready to release"]
```

## The six questions (asked once per initiative, not per phase)

Before phase 1 of any new initiative, Claude asks these. Answers go in the initiative's first handoff file.

1. **Ship date / hard deadline?**
2. **Scope ceiling — what's explicitly out?**
3. **Who's the target user, in one sentence?**
4. **Time budget for THIS push?**
5. **What's the auto-reject signal?**
6. **How do you want me to disagree with Codex?**

After that, Claude infers everything else from the goal and the gate.

## The verify gate

`npm run verify` is the contract. As of this writing it runs:

```
typecheck → rubric:lab → rubric:iterations → probe → stress → build
```

If any step fails, Codex hasn't shipped. If all pass and the phase-specific acceptance bullets pass, the phase is done.

To extend the gate, edit `package.json`'s `verify` script. **Do not** add tests that pass-by-default — every test must have failure modes that have actually fired.
