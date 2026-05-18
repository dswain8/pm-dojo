# PM Dojo Opus Critical Review

Date: 2026-04-25
Reviewer: Claude Opus via local `claude --model opus`
Mode: read-only review
Prompt: `reviews/opus/OPUS_REVIEW_PROMPT.md`

## 1. Ship-blocking product concerns

**The scoring engine cannot distinguish judgment from keyword compliance.** This is the single biggest problem. Every rubric check in every scenario, both the hand-authored ones in `content.ts` and the factory-generated ones in `scenarioFactory.ts`, is a regex test. The `qualityCap` function in `rubric.ts:50-94` partially mitigates keyword soup by capping it at 30-35xp, but a structured draft that uses the right vocabulary in the right positions will score S-rank regardless of whether the PM judgment is actually sound. A user can write "Rec: ship the wrong thing by Thursday. Tradeoff: this will fail. Need @someone to approve by EOD." and score well on every beat.

This is not a future concern. It is the core product claim: that the app trains PM judgment. Today, Opus thinks that claim is false. The scoring teaches PM formatting, not PM thinking.

**Factory-generated scenarios, 90 of 100, share identical rubrics per lane.** `scenarioFactory.ts:70-166` creates the same seven rubric checks for every scenario in a lane. The hand-authored scenarios in `content.ts`, two per lane and ten total, have custom rubrics that test scenario-specific content, such as "5x raise by Thursday" for `bad-news-01` or "10% traffic" for `room-02`. But the factory scenarios cannot test scenario-specific reasoning because the rubric does not know the scenario specifics. A bad-news scenario about a permissions rollback and one about a mobile crash rate are scored identically. This makes 90% of the content interchangeable from a scoring perspective.

**The Practice My Draft senior PM comparison is a template, not a rewrite.** `practice.ts:24-76`, especially `makeSeniorDraft`, generates a fill-in-the-blank senior draft using the user's audience and situation strings. It does not actually rewrite the user's draft with better judgment. The critique screen presents this as "SIDE-BY-SIDE · YOU vs SENIOR PM" with "WHY THEIRS SCORED HIGHER" annotations. But the senior draft is a generic template that may score lower than the user's actual draft. The comparison is theater for the practice flow.

## 2. Serious code/architecture concerns

**All 100 scenarios are loaded into the bundle at import time.** `content.ts` imports `EXTRA_SCENARIOS` from the scenario packs index, and `ALL_SCENARIOS` is built eagerly. For 100 scenarios this is tolerable. At 500+ it will not be. No lazy-loading path exists.

**Inline styles everywhere, no component extraction.** Every screen file contains duplicated style patterns. `Invoke.tsx`, `Practice.tsx`, `Round.tsx`, and `Critique.tsx` all carry large inline UI blocks. `FieldLabel`, `ContextQuality`, `inputStyle`, and `textAreaStyle` are duplicated across `Invoke.tsx` and `Practice.tsx`. Not a blocker, but it makes iteration expensive.

**`tweakOpen` defaults to `true` in `App.tsx`.** The debug/tweak panel is visible by default for every user. This should default to `false` or be gated behind a dev flag. It is a dev tool leaking into the product surface.

**Timer interval behavior is fragile.** `Round.tsx` starts a `setInterval(1000)`. The cleanup runs on unmount, and the timer reset on scenario change calls `setSec(480)`. This is probably fine because there is only one interval, but the setup is fragile.

**`seed.ts` creates fake history.** Seven seeded runs mean a new user starts at 388xp, Kyū 4 rank, a 3-day streak, and seven completed rounds. This undermines the credibility of the progress system. If progress is meant to motivate, starting with fake progress is the wrong move.

## 3. Scoring/rubric/gameability concerns

**The `qualityCap` is the only anti-gaming defense, and it is bypassable.** `rubric.ts:41-94` caps XP for empty drafts, very short drafts, short keyword-dense drafts, unstructured keyword-heavy drafts, and specific hedging phrases. But a draft that is 35+ words, structured with line breaks, and uses the right vocabulary will bypass all caps. The scoring test only tests specific anti-pattern drafts and one keyword-soup string. It does not test the more dangerous case: a well-formatted but substantively wrong draft.

**Grades are purely XP-based, not rubric-quality-based.** `rubric.ts:110-128` maps S to 80+ XP, A to 65+ XP, and so on. With seven rubric checks totaling roughly 100 points, hitting five of seven checks gets an A. But the checks are binary keyword matches. A user can hit "Name the tradeoff" by writing "tradeoff: none."

**Factory rubric `hasEvidence` is extremely loose.** `scenarioFactory.ts:48-51` treats any digit, dollar sign, or words like "customer", "launch", "support", or "deadline" as evidence. Writing "the customer wants this by the deadline" scores the evidence beat. That is not evidence.

**The practice flow's context quality meter is also gameable.** `context.ts:28-105` awards points for audience word count, situation word count, draft word count, and broad concrete-fact keywords. A user can reach "STRONG CONTEXT" with any 35-word draft that mentions a number.

**"WHY THEIRS SCORED HIGHER" is always shown.** `Critique.tsx:274-289` uses a static header even when the user's draft scores higher than the senior draft. This creates false learning signals.

## 4. UX/workflow concerns

**Invoke Dojo is a surface without a workflow.** The Invoke screen asks the user to paste a moment, audience, and optional draft, then either reviews the draft via Practice scoring or routes to a lane. Reviewing the draft gives the same generic scoring as Practice. Running the lane ignores the user's pasted context and gives a scenario from the matched lane. Neither option uses the user's actual work context in scoring. The `COPY INVOCATION` button is the most honest feature on the screen because it acknowledges the app cannot actually do the work-native thing it promises.

**The 3-column layout is not mobile-friendly.** The QA test only checks that the landing page does not overflow on mobile. Invoke, Practice, and Round all use fixed grid columns like `320px minmax(420px,1fr) 340px`, which will break below 1080px. This matters because a pre-send ritual should work in narrow laptop or split-screen windows.

**The Sensei suggestion is effectively static.** `game.ts:236-247` hardcodes the body string: "You've been leaning on communication and escalation." This does not reflect the user's radar state.

**Progress tracking is XP-only, not improvement-tracking.** There is no mechanism to compare draft quality over time, track which rubric beats a user consistently misses, or show whether the user is improving at a specific skill. The progress screen rewards volume more than learning.

## 5. What is genuinely promising

**The scenario authoring is strong.** The ten hand-authored scenarios in `content.ts` are realistic, specific, and differentiated. The briefs, pressure labels, cues, and senior PM drafts feel like actual PM work. The annotations on senior drafts, such as "Clock in the first line", "Dollars, not vibes", and "Named asks, each person", teach real principles. If every scenario had this quality of rubric specificity, the product would be substantially more credible.

**The seven principles in `principles.ts` are the right ones.** Front-load, recommendation, tradeoff, ask, evidence, audience, restraint: this is a defensible PM writing rubric. The principles are attributed to specific wiki articles, have anti-patterns, and have scoring questions.

**The `qualityCap` concept is the right architecture.** Capping scores for structurally weak drafts regardless of keyword hits is the correct defensive posture. The current implementation is too loose, but the idea of a quality gate separate from rubric checks is exactly right and should become primary, not secondary.

**Starting blank is the right call.** `Round.tsx` starts with an empty textarea and `USE STARTER DRAFT` as an opt-in. This forces the user to actually write.

**The side-by-side critique is genuinely useful.** Showing the user's draft next to a senior PM draft with specific annotations is the most instructive part of the app.

## 6. What to build next, in priority order

1. **Make factory-scenario rubrics scenario-specific.** Each of the 90 factory scenarios should have at least two or three rubric checks that test scenario-specific content: names, numbers, decisions, constraints, and details mentioned in the brief. Without this, 90% of the content is a dressed-up keyword quiz.

2. **Add structural scoring to `qualityCap`.** The current cap only catches degenerate cases. Add a positive structural score: Does the draft have distinct sections? Does the first sentence contain a verb and noun related to the scenario? Is there a real because/why, not just the word?

3. **Remove seeded history.** Start users at zero rounds, zero XP, no streak. Let the first session be an honest baseline.

4. **Fix "WHY THEIRS SCORED HIGHER" to be conditional.** If the user scores higher than the senior draft, say so and show what they did well. If they score lower, show the delta.

5. **Make the Sensei suggestion dynamic.** `buildSenseiSuggestion` should generate its body text from the actual radar state, not from a hardcoded sentence.

6. **Default `tweakOpen` to `false`.** It is a dev panel, not a user feature.

7. **Make Invoke Dojo actually use the pasted context in scoring.** When a user pastes their real moment and draft, the rubric should check whether the draft addresses the specific situation described, even if only by checking whether key nouns from the moment appear in the draft. Currently the Invoke-to-Review-Draft path uses the generic practice rubric.

8. **Add responsive breakpoints.** The 3-column layouts need to collapse below 1024px.

9. **Track rubric-check miss patterns over time.** The progress screen should show signals like: "You've missed the tradeoff beat in 7 of your last 10 rounds."

10. **Consider LLM-assisted scoring as an optional upgrade path.** The regex engine is a ceiling on product credibility. Even a lightweight LLM call that evaluates whether the draft actually addresses the scenario's core decision would transform the product from formatting checker to judgment evaluator.

## 7. Blunt verdict

**Not yet useful for serious PMs.**

The scenario authoring, principles, and critique format are strong enough to be the foundation of something real. But the scoring engine is a keyword matcher wearing a sensei robe. A PM who uses this daily will learn to format drafts correctly: front-load, mention tradeoffs, tag people, set deadlines. That is valuable, but it is the PM equivalent of learning to structure an essay without learning to think.

The app claims to train judgment but measures vocabulary.

With scenario-specific rubrics on the factory scenarios and stronger structural scoring, this moves to "useful with caveats." With LLM-assisted scoring, it becomes genuinely differentiated. Right now, it is a well-crafted prototype that teaches PM formatting habits and has the architecture to become a judgment trainer, but is not one yet.
