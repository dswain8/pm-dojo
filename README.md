# PM Dojo

Self-graded PM writing practice — timed scenarios, score yourself against hints, compare to model answers. No login required.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3333

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import the project at [vercel.com](https://vercel.com) → **Add New Project**.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy. Share the production URL.

`vercel.json` includes SPA rewrites so client-side routes work.

## Modes

- **Inbox Fire** — timed Slack/email responses
- **The Room** — branching meeting scenarios
- **Red Pen** — rewrite bad PM copy
- **First Principles** — name the principle and apply it

Progress is stored in the browser (`localStorage`).
