# PM Dojo Opus Review Brief

Date: 2026-04-25
Branch: `codex/pm-dojo-game-redesign`
Workspace: `/Users/dswain/my-knowledge-base/app-codex-game-redesign`
Local URL: `http://127.0.0.1:8767/`

## What To Review

PM Dojo is a local React/Vite product-management judgment simulator. The intended product is a "flight sim" for PM judgment:

- PMs choose a scenario or invoke the Dojo from live work.
- They write a real artifact: Slack update, exec memo, prioritization doc, customer reply, PRD section.
- The app scores the artifact against a local PM rubric.
- The critique compares the user's draft against a senior PM draft and calls out what landed/missed.
- The progress surface tracks reps, streaks, XP, rank, skill radar, and recent rounds.

The most recent product direction is: PM Dojo should be useful at the moment of work, not only as a destination game. The new `Invoke Dojo` flow is intended to be a lightweight pre-send ritual for Slack/docs/meetings.

## Critical Review Goal

Do not praise polish. Review this as if deciding whether this can become a truly useful PM product.

Primary questions:

- Is the core loop meaningful enough for real PMs, or is it still a polished toy?
- Does `Invoke Dojo` make the product more work-native, or does it add another surface without enough real utility?
- Does the scoring create false confidence because it is regex/local and not grounded enough?
- Are the scenario repository, senior PM drafts, and rubric checks rich enough to support repeated use?
- Does the product teach PM judgment, or only reward PM-sounding keywords?
- What must be cut, simplified, or rebuilt before this should be treated as a serious product?

## How To Run

```bash
cd /Users/dswain/my-knowledge-base/app-codex-game-redesign
npm run dev
```

Open:

```text
http://127.0.0.1:8767/
```

Verification commands:

```bash
npm run build
npx playwright test pmdojo.acceptance.spec.ts pmdojo.scoring.spec.ts pmdojo.qa.spec.ts --reporter=line
```

Last Codex verification before this review brief:

- `npm run build` passed.
- `npx playwright test pmdojo.acceptance.spec.ts pmdojo.scoring.spec.ts pmdojo.qa.spec.ts --reporter=line` passed with `9 passed`.

## Main Files And Paths

App shell and state:

- `src/pmdojo/App.tsx`
- `src/pmdojo/types.ts`
- `src/pmdojo/game.ts`
- `src/pmdojo/seed.ts`
- `src/pmdojo/tokens.ts`

Screens:

- `src/pmdojo/screens/Landing.tsx`
- `src/pmdojo/screens/Invoke.tsx`
- `src/pmdojo/screens/Lanes.tsx`
- `src/pmdojo/screens/Practice.tsx`
- `src/pmdojo/screens/Round.tsx`
- `src/pmdojo/screens/Critique.tsx`
- `src/pmdojo/screens/Progress.tsx`
- `src/pmdojo/screens/Manual.tsx`

Product logic:

- `src/pmdojo/rubric.ts`
- `src/pmdojo/context.ts`
- `src/pmdojo/invoke.ts`
- `src/pmdojo/practice.ts`
- `src/pmdojo/progression.ts`
- `src/pmdojo/principles.ts`
- `src/pmdojo/repository.ts`

Scenario/content system:

- `src/pmdojo/content.ts`
- `src/pmdojo/scenarioFactory.ts`
- `src/pmdojo/scenario-packs/lane01-bad-news.ts`
- `src/pmdojo/scenario-packs/lane02-room.ts`
- `src/pmdojo/scenario-packs/lane03-cutline.ts`
- `src/pmdojo/scenario-packs/lane04-exec.ts`
- `src/pmdojo/scenario-packs/lane05-pressure-test.ts`
- `src/pmdojo/scenario-packs/index.ts`

Tests:

- `pmdojo.acceptance.spec.ts`
- `pmdojo.qa.spec.ts`
- `pmdojo.scoring.spec.ts`

## What Was Built

Core app:

- React 18 + Vite + TypeScript app under the `src/pmdojo/` module.
- LocalStorage persistence under `pmdojo-state`.
- Single state-machine style screens: landing, invoke, lanes, practice, round, critique, progress, manual.
- Geist-based dark Dojo visual system with local tokens and no UI library.

Landing / home:

- Hero CTA for suggested rep.
- Choose lane, invoke Dojo, and review draft entry points.
- Skill radar, Sensei suggestion, daily/streak/rank/XP stats.

Lanes:

- Five authored training lanes plus Practice My Draft.
- 20 authored reps per lane for the five training lanes, 100 authored scenarios total.
- Lanes are unlocked in this prototype, with HARD/BOSS representing intensity.

Round:

- Scenario brief, cues, objective, live draft editor, timer, word limit, live rubric scoring.
- Drafts now start blank by design.
- `USE STARTER DRAFT` exists as an explicit training aid rather than prefilled text.
- Empty drafts cannot submit.

Practice My Draft:

- Blank-by-default real draft review surface.
- Artifact selector for Slack update, exec memo, PRD section, customer reply.
- Audience/situation inputs.
- Context quality meter.
- `USE SAMPLE CONTEXT` for demo/testing only.

Invoke Dojo:

- New screen: `src/pmdojo/screens/Invoke.tsx`.
- New heuristic router: `src/pmdojo/invoke.ts`.
- Designed as a lightweight work-native intake: paste moment, audience, optional draft.
- Routes to a lane based on keywords and source.
- Can review the draft immediately using the Practice My Draft scoring path.
- Generates a copyable invocation prompt for use in another tool.
- Keyboard shortcut: `I`.

Critique:

- Grade reveal and XP.
- What landed / what missed.
- Scoring contract tied to local PM principles.
- Side-by-side comparison with senior PM draft.
- "Why theirs scored higher" annotations.
- Split between `WRITING QUALITY` and `PM JUDGMENT CONFIDENCE`.

Progress:

- Skill radar.
- Streak heatmap.
- Skill grid.
- Recent rounds.
- Sensei suggestion.

Manual:

- Explains Sensei, XP, rank, local scoring, scenario repository, and product rules.

Tests:

- Acceptance test covers the main product path.
- QA test covers primary screens, lane submissions, shortcuts, practice scoring, and mobile overflow.
- Scoring test checks scenario repository size, authored draft quality, and anti-pattern / keyword soup resistance.

## Known Risks To Inspect Hard

1. Regex scoring still cannot truly judge PM reasoning.
2. `Invoke Dojo` routing is heuristic and can misclassify mixed moments.
3. Context quality is a useful honesty layer, but it may still feel synthetic.
4. Senior drafts are authored examples, not generated from the user's company context.
5. Scenario content breadth is better now, but repeat value depends on whether scenarios feel real after several reps.
6. The app has no actual Slack/Docs/browser extension integration yet.
7. Local progress may motivate, but XP/rank could feel ornamental unless tied to real improvement.
8. There are older modified files outside `src/pmdojo/`; review whether they are intentional setup changes or leftover prototype drift.

## Review Method Requested

Please return findings in this order:

1. Ship-blocking product concerns.
2. Serious code/architecture concerns.
3. Scoring/rubric/gameability concerns.
4. UX/workflow concerns.
5. What is genuinely promising.
6. What to build next, in priority order.
7. A blunt verdict: is this useful for serious PMs today, with minor changes, or not yet?

Be direct. Favor concrete file references and exact behavior over high-level product language.
