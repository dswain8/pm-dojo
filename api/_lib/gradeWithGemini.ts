export interface GradeScenarioInput {
  title: string
  setup: string
  task: string
  principles: string[]
  modelAnswer: string
  gradingHints: {
    clarity: string
    strategy: string
    substance: string
  }
}

export interface GradeResult {
  clarity: number
  strategy: number
  substance: number
  feedback: {
    clarity: string
    strategy: string
    substance: string
  }
  takeaway: string
}

const MODEL = 'gemini-flash-latest'

function clamp(n: unknown): number {
  const v = typeof n === 'number' ? n : Number(n)
  if (!Number.isFinite(v)) return 0
  return Math.max(0, Math.min(10, Math.round(v)))
}

function buildPrompt(scenario: GradeScenarioInput, userAnswer: string): string {
  return `PM writing coach. Score 0-10 on Clarity, Strategy, Substance.

Scenario: ${scenario.title}
Setup: ${scenario.setup}
Task: ${scenario.task}
Principles: ${scenario.principles.join('; ')}
Rubric — Clarity: ${scenario.gradingHints.clarity} | Strategy: ${scenario.gradingHints.strategy} | Substance: ${scenario.gradingHints.substance}
Model answer: ${scenario.modelAnswer}
User answer: ${userAnswer.trim() || '(empty)'}

Be strict. Mid answers are 4-7. One short feedback sentence per dimension.
Return ONLY JSON:
{"clarity":0,"strategy":0,"substance":0,"feedback":{"clarity":"...","strategy":"...","substance":"..."},"takeaway":"..."}`
}

function extractJson(text: string): GradeResult {
  const trimmed = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON in model response')
  return JSON.parse(trimmed.slice(start, end + 1)) as GradeResult
}

export async function gradeWithGemini(
  apiKey: string,
  scenario: GradeScenarioInput,
  userAnswer: string
): Promise<GradeResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)

  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: buildPrompt(scenario, userAnswer) }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800,
          thinkingConfig: { thinkingBudget: 512 },
        },
      }),
    })
  } finally {
    clearTimeout(timeout)
  }

  if (res.status === 429) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Gemini error 429: ${errText.slice(0, 400)}`)
  }
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Gemini error ${res.status}: ${errText.slice(0, 400)}`)
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Empty Gemini response')

  const parsed = extractJson(text)
  return {
    clarity: clamp(parsed.clarity),
    strategy: clamp(parsed.strategy),
    substance: clamp(parsed.substance),
    feedback: {
      clarity: String(parsed.feedback?.clarity || 'No clarity note.'),
      strategy: String(parsed.feedback?.strategy || 'No strategy note.'),
      substance: String(parsed.feedback?.substance || 'No substance note.'),
    },
    takeaway: String(parsed.takeaway || 'Lead with the point next time.'),
  }
}
