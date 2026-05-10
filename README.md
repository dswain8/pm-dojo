# PM Dojo

## What it is

A preflight check for PM artifacts. Paste a draft, get back either a tightened rewrite or an honest refusal.

## Try it

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173/`.

## The five artifact kinds

- `slack`: Use for short launch updates, incident calls, or cross-functional asks.
- `exec`: Use when a leader needs a decision, recommendation, context, tradeoff, and ask.
- `prd`: Use for product or scope decisions that Engineering and Design need to act on.
- `customer`: Use before sending a customer-facing reply that needs accountability without internal jargon.
- `meeting`: Use to turn a discussion into what changed, what tradeoff was accepted, and who owns the next step.

## What a refusal means

`[Rewrite paused ...]` and `Accountability:` prompts are intentional. PM Dojo refuses to invent commitments or fabricate tradeoffs. Refusal means your input is missing the judgment, not that the tool is broken.

## What it does NOT do

- It has no judgment model and does not check whether your numbers are relevant or true.
- It has no memory of past drafts, prior decisions, company context, or recipient preferences.

## Where to find more

See [docs/PM_DOJO_95_GOAL.md](docs/PM_DOJO_95_GOAL.md).
