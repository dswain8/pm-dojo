# PM Dojo Product Evaluation

Date: 2026-05-03

## Verdict

PM Dojo is now past "dummy prototype" and into "useful private beta" territory. The product has a coherent loop:

1. Review real PM work before sending.
2. Train authored scenario lanes when there is no live artifact.
3. Compare against a stronger draft.
4. Track progress and miss patterns.

It is still not fully ship-ready as a standalone product for serious PMs because the hardest claim remains partially unsolved: expert judgment on arbitrary live work. The deterministic rubric is credible for reps, structure, anti-patterns, and carry-through checks. It is not yet enough to know whether the underlying PM call is truly right in a messy real-world situation.

## What Is Strong

- Home is now clear. It has one primary job: review real work before send.
- Train is now properly separated from Home. Lanes are practice, not the default product promise.
- Progress now owns XP, streak, radar, daily reps, and recent rounds, which removes arcade noise from the main workflow.
- The strongest product mechanic is the Judgment Checkpoint Before Draft: recommendation, non-goals, evidence, tradeoff, ask, and change-mind condition.
- The authored scenario bank is substantial: 5 training lanes, 100 scenarios, senior drafts, annotations, and rubric checks.
- Scenario-specific checks now exist in generated lanes, reducing the old "same rubric, different wrapper" problem.
- The output contract is much sharper: no fluff, no fake senior-PM framing, and artifact-shaped suggested rewrites.
- Blank starts are honest. Users have to write, with starter drafts as opt-in scaffolding.
- The app has regression coverage for scoring, output quality, QA flows, mobile overflow, and acceptance.

## What Is Still Weak

- Freeform expert judgment is still the ceiling. Regex can verify structure and carry-through, but it cannot fully know whether a PM should pause a launch, cut scope, escalate, or push back.
- Preflight still asks users to provide structured context. That is a good product choice, but it means PM Dojo depends on user honesty and completeness.
- The web app and Codex skills were previously not aligned. This is now improved by adding `debjeet-pm-dojo-preflight`, but that skill should be used in real sessions and refined from actual outputs.
- Progress is still mostly activity and miss-pattern tracking. It needs more longitudinal learning signals: recurring judgment gaps, before/after improvements, and outcome replay quality.
- The deterministic scorer remains gameable by a user who knows the rubric and writes structurally plausible but substantively wrong drafts.
- There is no optional LLM/expert scoring layer yet for high-stakes real artifacts.
- There is no shared server-side source of truth. The app, Codex skills, and portable project prompt can drift unless we keep the contract synchronized.

## Skill Layer Evaluation

Before this pass, Codex had Dojo skills:

- `debjeet-dojo-review`
- `debjeet-dojo-spar`
- `debjeet-dojo-prep`
- `debjeet-dojo-debrief`

Those were useful but thin. They pointed to the wiki and gave broad workflows, but they did not encode the current PM Dojo product mechanic.

This pass added:

- `debjeet-pm-dojo-preflight`: a real Codex skill for reviewing live PM artifacts before send.
- `pm-dojo-contract.md`: the shared judgment checkpoint, rubric, readiness labels, rewrite rules, and anti-fluff contract.
- `project-session-prompt.md`: a portable prompt for Claude Projects, ChatGPT Projects/GPTs, Plot-style sessions, or any workspace that cannot invoke Codex skills directly.
- Updated `debjeet-dojo-review` so everyday review requests use the stricter preflight contract.

## Recommended Product Direction

The right product wedge is not "a PM game." It is:

> A lightweight preflight ritual for PM judgment, with practice lanes when you do not have live work.

That means the product should optimize for:

- Fast invocation from wherever PM work happens.
- Real artifact review, not generic coaching.
- Structured judgment capture before draft polish.
- Suggested rewrite that is immediately usable.
- Outcome replay after the message lands.
- Practice lanes only when the user needs reps.

## Next Build Priorities

1. Add an optional expert/LLM review layer for live-work Preflight, behind a clear label: local rubric vs expert review.
2. Make outcome replay more central: after a real artifact is sent, ask what happened and update learning signals.
3. Keep skill and app contracts synced from one shared markdown/source file.
4. Add export/copy surfaces for the portable project-session prompt inside the app Manual.
5. Add more longitudinal coaching: "you repeatedly bury asks", "you under-name tradeoffs", "your evidence is getting stronger."
6. Stress-test the new Codex skill on 20 real PM artifacts and categorize failures before adding more automation.

## Ship Call

Private beta: yes.

Public standalone site: not yet.

The app is valuable enough for Debjeet to use personally and for a small trusted PM group to try. It should not yet claim to be a true PM judgment evaluator without either deeper authored rubrics, outcome calibration, or an optional expert/LLM review path.
