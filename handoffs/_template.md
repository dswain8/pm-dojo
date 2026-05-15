# Phase N: [name]

**Initiative:** [e.g., LinkedIn launch readiness]
**Date opened:** YYYY-MM-DD
**Status:** [PROMPTED / IN PROGRESS / VERIFIED / SHIPPED]

## Prompt to Codex

```
Phase N: [name]

Goal: [one sentence — what does done look like?]

Acceptance:
- `npm run verify` passes
- [specific behavior 1]
- [specific behavior 2]

Constraints:
- [what can't change]
- [what can't change]

Out of scope:
- [explicit non-goals]

Files likely to touch:
- [path]
- [path]

Report back with:
- Commit hash + message
- 5-line summary of what changed
- Any decisions you made (and why)
- `npm run verify` output (last 10 lines)
```

## Codex report

Commit: `___` — [message]

Summary:
- [line 1]
- [line 2]

Decisions:
- [decision + reason]

Verify output:
```
[paste]
```

## Verification

Acceptance:
- [ ] verify passes
- [ ] [specific behavior 1]
- [ ] [specific behavior 2]

Regressions checked:
- [what I looked for]

Verdict: [SHIP / FIX / REWORK]

Next phase: [N+1 slug, or "ready to release"]
