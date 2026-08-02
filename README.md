# PM Dojo

Timed PM writing practice — scenarios under pressure, then feedback on clarity, strategy, and substance. No login required.

**Inbox Fire** uses Gemini to grade your answer against a fixed PM rubric. Other modes are still self-guided for now.

## Run locally

1. Get a free API key: [Google AI Studio](https://aistudio.google.com/apikey)
2. Copy env file and add the key:

```bash
cp .env.example .env.local
# edit .env.local → GEMINI_API_KEY=...
```

3. Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3333

## Deploy (Vercel)

1. Push this repo to GitHub (already connected if you used the CLI deploy).
2. In Vercel → Project → **Settings → Environment Variables**, add:

   - `GEMINI_API_KEY` = your key (Production + Preview)

3. Redeploy. SPA routes and `/api/grade` both work via `vercel.json`.

## Modes

- **Inbox Fire** — timed Slack/email responses + AI grading
- **The Room** — branching meeting scenarios
- **Red Pen** — rewrite bad PM copy
- **First Principles** — name the principle and apply it

Progress is stored in the browser (`localStorage`).
