import { scoreWithRubric } from "./rubric";

export interface FeedbackItem {
  principle: string;
  status: "applied" | "partial" | "missed";
  note: string;
  source: string;
}

export interface ScoreResult {
  clarity: number;
  strategy: number;
  substance: number;
  total: number;
  maxTotal: number;
  feedback: FeedbackItem[];
  coachPunch: string;
  principleNamed?: string;
  principleSource?: string;
  engine?: "rubric" | "ai";
}

export interface ScoreError {
  error: string;
  message?: string;
}

export interface ScenarioPayload {
  title: string;
  setup?: string;
  task?: string;
  original?: string;
  flaws?: { tag: string; description: string }[];
  situation?: string;
  modelAnswer?: string;
  gradingHints?: { clarity: string; strategy: string; substance: string };
  principles?: string[];
}

const KEY_STORAGE = "pm-dojo-anthropic-key";

export function getUserApiKey(): string | null {
  try {
    return localStorage.getItem(KEY_STORAGE);
  } catch {
    return null;
  }
}

export function setUserApiKey(key: string | null): void {
  try {
    if (key && key.trim()) {
      localStorage.setItem(KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(KEY_STORAGE);
    }
  } catch {
    // ignore
  }
}

function buildSystemPrompt(mode: string): string {
  const base = `You are a senior PM coach grading a response on three dimensions (0-10 each):
- clarity: front-loading, conciseness, weak-word discipline, audience fit
- strategy: anti-sell tradeoffs, stakeholder awareness, decision-making
- substance: specificity, concrete actions, numbers/dates, no platitudes

Calibration anchors:
- 0-3: Missing the principle entirely
- 4-5: Attempted, shape is wrong
- 6-7: Solid, minor gaps
- 8-9: Senior PM energy
- 10: Near-perfect textbook application

Return ONLY valid JSON matching this shape:
{
  "clarity": 0-10,
  "strategy": 0-10,
  "substance": 0-10,
  "feedback": [{"principle": string, "source": string, "status": "applied"|"partial"|"missed", "note": string}],
  "coachPunch": string${
    mode === "first-principles"
      ? ',\n  "principleNamed": string,\n  "principleSource": string'
      : ""
  }
}`;
  if (mode === "first-principles") {
    return (
      base +
      "\n\nFor first-principles mode: YOU name the principle in play. The user wrote a move, not a label."
    );
  }
  return base;
}

async function gradeViaAnthropic(
  apiKey: string,
  mode: string,
  scenario: ScenarioPayload,
  userResponse: string,
): Promise<ScoreResult | ScoreError> {
  const prompt = `MODE: ${mode}
SCENARIO: ${JSON.stringify(scenario)}
USER RESPONSE:
${userResponse}

Grade it. Return JSON only.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1500,
        system: buildSystemPrompt(mode),
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      return {
        error: "anthropic_error",
        message: `${res.status}: ${body.slice(0, 200)}`,
      };
    }
    const data = await res.json();
    const text: string = data.content?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { error: "parse_error", message: "No JSON in AI response" };
    }
    const parsed = JSON.parse(jsonMatch[0]);
    const total =
      (parsed.clarity ?? 0) + (parsed.strategy ?? 0) + (parsed.substance ?? 0);
    return {
      clarity: parsed.clarity,
      strategy: parsed.strategy,
      substance: parsed.substance,
      total,
      maxTotal: 30,
      feedback: parsed.feedback ?? [],
      coachPunch: parsed.coachPunch ?? "",
      principleNamed: parsed.principleNamed,
      principleSource: parsed.principleSource,
      engine: "ai",
    };
  } catch (err) {
    return {
      error: "network_error",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export interface GradeOutcome {
  result: ScoreResult;
  aiError?: ScoreError; // present when AI was attempted but failed; rubric was used
}

export async function gradeResponse(
  mode: "inbox-fire" | "red-pen" | "first-principles",
  scenario: ScenarioPayload,
  userResponse: string,
): Promise<GradeOutcome> {
  const apiKey = getUserApiKey();
  if (apiKey) {
    const result = await gradeViaAnthropic(
      apiKey,
      mode,
      scenario,
      userResponse,
    );
    if (!isScoreError(result)) return { result };
    // AI attempted but failed — fall through to rubric, but surface the error
    const rubric = scoreWithRubric(userResponse);
    rubric.engine = "rubric";
    return { result: rubric, aiError: result };
  }
  const rubric = scoreWithRubric(userResponse);
  rubric.engine = "rubric";
  return { result: rubric };
}

export async function testApiKey(apiKey: string): Promise<ScoreError | null> {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 10,
        messages: [{ role: "user", content: "ping" }],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      return {
        error: res.status === 401 ? "invalid_key" : "anthropic_error",
        message: `${res.status}: ${body.slice(0, 200)}`,
      };
    }
    return null;
  } catch (err) {
    return {
      error: "network_error",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export function isScoreError(r: ScoreResult | ScoreError): r is ScoreError {
  return "error" in r;
}
