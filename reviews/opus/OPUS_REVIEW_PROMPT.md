# Prompt For Opus

You are Opus reviewing PM Dojo, a local React/Vite product-management judgment simulator.

Worktree:

```text
/Users/dswain/my-knowledge-base/app-codex-game-redesign
```

Branch:

```text
codex/pm-dojo-game-redesign
```

Start by reading:

```text
reviews/opus/OPUS_REVIEW_BRIEF.md
```

Then inspect the implementation, especially:

```text
src/pmdojo/App.tsx
src/pmdojo/screens/Invoke.tsx
src/pmdojo/invoke.ts
src/pmdojo/screens/Practice.tsx
src/pmdojo/screens/Round.tsx
src/pmdojo/screens/Critique.tsx
src/pmdojo/rubric.ts
src/pmdojo/context.ts
src/pmdojo/content.ts
src/pmdojo/scenario-packs/
pmdojo.acceptance.spec.ts
pmdojo.qa.spec.ts
pmdojo.scoring.spec.ts
```

Run or consider these commands:

```bash
npm run build
npx playwright test pmdojo.acceptance.spec.ts pmdojo.scoring.spec.ts pmdojo.qa.spec.ts --reporter=line
```

Review posture:

- Be critical, not polite.
- Do not praise the interface unless it changes product usefulness.
- Treat this as a serious PM product review, not a demo review.
- Look for false confidence, rubric gameability, shallow product loops, and integration gaps.
- Use file references where possible.

Return the review in this structure:

1. Ship-blocking product concerns.
2. Serious code/architecture concerns.
3. Scoring/rubric/gameability concerns.
4. UX/workflow concerns.
5. What is genuinely promising.
6. What to build next, in priority order.
7. Blunt verdict: useful for serious PMs today, useful with minor changes, or not yet.
