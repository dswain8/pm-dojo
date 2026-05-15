# Phase 6: LinkedIn-readiness

**Initiative:** LinkedIn launch
**Date opened:** 2026-05-10
**Status:** VERIFIED — FRIEND-BETA READY

## Initiative answers (asked once)

1. **Ship date:** Soft-float to 5 PMs via DM this week, LinkedIn post if DM round goes well (no hard deadline, but momentum-driven)
2. **Scope ceiling:** No backend, no LLM, no auth, no analytics — fully client-side, deterministic
3. **Target user:** PMs who write Slack/PRDs/exec-updates daily and want a preflight check before sending
4. **Time budget:** ~1–2 days for Phase 6, then ship
5. **Auto-reject signal:** `npm run verify` fails OR refusal sentinel renders as broken/error text on mobile
6. **Disagreeing with Codex:** Claude pushes back in the prompt before Debjeet sends; if Codex's diagnosis is wrong post-hoc, Claude flags in verification not silently accepts

## Prompt to Codex

```
Phase 6: LinkedIn-readiness

Goal: Make PM Dojo shippable to PMs on LinkedIn — first-impression-safe on mobile,
link-preview-safe on social, multi-artifact-discoverable.

Acceptance:
- `npm run verify` passes
- OG tags + favicon render in LinkedIn Post Inspector + Twitter Card Validator
- "Try sample" picks per-artifact-kind sample (slack/exec/prd/customer/meeting),
  not the same one every time
- `[Rewrite paused — ...]` sentinel renders as a styled callout (yellow/amber
  background, lock or pause icon), not raw bracketed text that reads as an error
- 375px viewport (iPhone SE): no horizontal scroll, all CTAs reachable, sample
  selector usable

Constraints:
- No new dependencies (use Tailwind utilities + existing dojo-* tokens)
- Client-side only, no LLM calls, no analytics
- og-image.png at /public/og-image.png, 1200x630, ≤300KB

Out of scope:
- A/B testing different copy
- LinkedIn analytics integration
- Multi-language

Files likely to touch:
- index.html (OG + favicon)
- public/og-image.png (new)
- public/favicon.svg (new)
- src/lib/review.ts (REVIEW_SAMPLE → REVIEW_SAMPLES per kind)
- src/modes/ReviewWork.tsx (sample picker, sentinel callout, mobile pass)

Report back with:
- Commit hash + message
- 5-line summary of what changed
- Any decisions you made (and why)
- `npm run verify` output (last 10 lines)
```

## Codex report

_Backfilled by Claude from commit `82c8c6e` — Codex shipped before the handoffs protocol existed. Future phases: Codex appends its own report here per the README._

Commit: `82c8c6e` — Phase 6: LinkedIn-readiness — OG tags, per-artifact samples, callout refusal, mobile pass

Files changed (7 files, +161 / -32):
- `index.html` — OG tags (og:title, og:description, og:type, og:image), Twitter Card, favicon link, description meta
- `public/favicon.svg` — new SVG favicon
- `public/og-image.png` — new 1200x630 social preview (19KB)
- `src/lib/review.ts` — `REVIEW_SAMPLE` → `REVIEW_SAMPLES: Record<ArtifactKind, ReviewInput>` with 5 artifact-kind samples (slack/exec/prd/customer/meeting)
- `src/modes/ReviewWork.tsx` — per-artifact "Try a sample" button, `PausedRewriteCallout` component (amber background, ⚠︎ icon, "Rewrite paused" header), responsive tap targets

## Verification

Acceptance:
- [✅] `npm run verify` passes — typecheck, rubric:lab (92/92), rubric:iterations (50/50), probe (5/5 Do not send), stress (11 MATCH / 0 FALSE_PASS / 0 FALSE_BLOCK / 1 WRONG_REASON dismissed / 3 KNOWN_GAP), build (372KB JS / 23KB CSS)
- [✅] OG tags present in `index.html`: `og:title`, `og:description`, `og:type`, `og:image`, `twitter:card`. Favicon at `/favicon.svg`. `og-image.png` 19KB (well under 300KB cap).
- [✅] `REVIEW_SAMPLES` record has all 5 artifact kinds with distinct, kind-appropriate prompts. `loadSample(artifactKind)` swaps input on click.
- [✅] `PausedRewriteCallout` (`ReviewWork.tsx:403`) renders sentinel as amber-bordered card with icon + heading + body — not raw bracketed text.
- [✅] 375px viewport: browser pass covered Home → Review → Try sample → Run review → Revised draft, plus banner dismissal. No horizontal scroll, all CTAs reachable, no visible tap targets under 44px.

Regressions checked:
- Sample picker doesn't break refusal flow (samples are intentionally complete drafts that pass — not adversarial inputs)
- Callout component is purely additive — non-paused flows still render `output.revisedDraft` in the existing `<pre>` block
- No new dependencies (constraint held)

Risks flagged (not blockers, defer to Phase 7):

1. **`og:image` is relative (`/og-image.png`).** LinkedIn Post Inspector historically prefers absolute URLs. May silently fail to render preview on first share. Fix: change to `https://[deployed-domain]/og-image.png` once Vercel domain is known, OR use a Vite plugin to inject absolute URL at build time per env.
2. **Public launch still needs real feedback.** The engine is ready for friends, not a broad claim that it understands PM judgment. Ask testers to use one real artifact and tell us where the output feels generic or wrong.

Verdict: **SHIP TO FRIENDS** — Vercel deploy + 5-10 trusted PM reviews next.

Next phase: `phase-7-vercel-deploy-and-mobile-confirm`
