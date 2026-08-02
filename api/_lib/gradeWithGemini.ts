export type GradeMode = 'inbox-fire' | 'first-principles' | 'red-pen'

export interface GradeDimension {
  key: string
  label: string
  value: number
  max: number
  feedback: string
}

export interface GradeResult {
  mode: GradeMode
  dimensions: GradeDimension[]
  takeaway: string
}

export interface InboxFirePayload {
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
  userAnswer: string
}

export interface FirstPrinciplesPayload {
  title: string
  situation: string
  bestAnswer: {
    principle: string
    source: string
    explanation: string
  }
  relatedPrinciples: string[]
  principle: string
  application: string
}

export interface RedPenPayload {
  title: string
  original: string
  flaws: { tag: string; description: string }[]
  modelRewrite: string
  rewrite: string
}

export type GradePayload =
  | { mode: 'inbox-fire'; payload: InboxFirePayload }
  | { mode: 'first-principles'; payload: FirstPrinciplesPayload }
  | { mode: 'red-pen'; payload: RedPenPayload }

const MODEL = 'gemini-flash-lite-latest'

function clamp(n: unknown, max: number): number {
  const v = typeof n === 'number' ? n : Number(n)
  if (!Number.isFinite(v)) return 0
  return Math.max(0, Math.min(max, Math.round(v)))
}

function buildPrompt(req: GradePayload): string {
  if (req.mode === 'inbox-fire') {
    const p = req.payload
    return `PM writing coach. Score 0-10 on Clarity, Strategy, Substance.

Scenario: ${p.title}
Setup: ${p.setup}
Task: ${p.task}
Principles: ${p.principles.join('; ')}
Rubric — Clarity: ${p.gradingHints.clarity} | Strategy: ${p.gradingHints.strategy} | Substance: ${p.gradingHints.substance}
Model answer: ${p.modelAnswer}
User answer: ${p.userAnswer.trim() || '(empty)'}

Be strict. Mid answers are 4-7. One short feedback sentence per dimension.
Return ONLY JSON:
{"clarity":0,"strategy":0,"substance":0,"feedback":{"clarity":"...","strategy":"...","substance":"..."},"takeaway":"..."}`
  }

  if (req.mode === 'first-principles') {
    const p = req.payload
    return `PM principles coach. Score the learner 0-5 on Identification and Application.

Situation: ${p.title}
${p.situation}

Best answer principle: ${p.bestAnswer.principle}
Source: ${p.bestAnswer.source}
Explanation: ${p.bestAnswer.explanation}
Related: ${p.relatedPrinciples.join('; ')}

Learner's principle: ${p.principle.trim() || '(empty)'}
Learner's application: ${p.application.trim() || '(empty)'}

Identification = did they name the right (or a clearly equivalent) principle?
Application = was their application specific and actionable for THIS situation?
Be strict. Mid answers are 2-3. One short feedback sentence per dimension.
Return ONLY JSON:
{"identification":0,"application":0,"feedback":{"identification":"...","application":"..."},"takeaway":"..."}`
  }

  const p = req.payload
  return `PM writing coach. Grade the rewrite 0-10 on Clarity, Conciseness, and Flaws Fixed.

Title: ${p.title}
Original:
${p.original}

Known flaws:
${p.flaws.map((f) => `- [${f.tag}] ${f.description}`).join('\n')}

Model rewrite:
${p.modelRewrite}

Learner's rewrite:
${p.rewrite.trim() || '(empty)'}

Clarity = clear decision/point, scannable.
Conciseness = cut fluff without losing meaning.
Flaws Fixed = how well they addressed the tagged flaws (not just shorter).
Be strict. Mid answers are 4-7. One short feedback sentence per dimension.
Return ONLY JSON:
{"clarity":0,"conciseness":0,"flawsFixed":0,"feedback":{"clarity":"...","conciseness":"...","flawsFixed":"..."},"takeaway":"..."}`
}

function extractJson(text: string): Record<string, unknown> {
  const trimmed = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON in model response')
  return JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>
}

function collectText(parts: Array<{ text?: string }> | undefined): string {
  if (!parts?.length) return ''
  return parts.map((p) => p.text || '').join('').trim()
}

function parseResult(mode: GradeMode, raw: Record<string, unknown>): GradeResult {
  const feedback = (raw.feedback || {}) as Record<string, unknown>
  const takeaway = String(raw.takeaway || 'Tighten one thing and try again.')

  if (mode === 'inbox-fire') {
    return {
      mode,
      takeaway,
      dimensions: [
        {
          key: 'clarity',
          label: 'Clarity',
          value: clamp(raw.clarity, 10),
          max: 10,
          feedback: String(feedback.clarity || 'No clarity note.'),
        },
        {
          key: 'strategy',
          label: 'Strategy',
          value: clamp(raw.strategy, 10),
          max: 10,
          feedback: String(feedback.strategy || 'No strategy note.'),
        },
        {
          key: 'substance',
          label: 'Substance',
          value: clamp(raw.substance, 10),
          max: 10,
          feedback: String(feedback.substance || 'No substance note.'),
        },
      ],
    }
  }

  if (mode === 'first-principles') {
    return {
      mode,
      takeaway,
      dimensions: [
        {
          key: 'identification',
          label: 'Identification',
          value: clamp(raw.identification, 5),
          max: 5,
          feedback: String(feedback.identification || 'No identification note.'),
        },
        {
          key: 'application',
          label: 'Application',
          value: clamp(raw.application, 5),
          max: 5,
          feedback: String(feedback.application || 'No application note.'),
        },
      ],
    }
  }

  return {
    mode,
    takeaway,
    dimensions: [
      {
        key: 'clarity',
        label: 'Clarity',
        value: clamp(raw.clarity, 10),
        max: 10,
        feedback: String(feedback.clarity || 'No clarity note.'),
      },
      {
        key: 'conciseness',
        label: 'Conciseness',
        value: clamp(raw.conciseness, 10),
        max: 10,
        feedback: String(feedback.conciseness || 'No conciseness note.'),
      },
      {
        key: 'flawsFixed',
        label: 'Flaws Fixed',
        value: clamp(raw.flawsFixed, 10),
        max: 10,
        feedback: String(feedback.flawsFixed || 'No flaws note.'),
      },
    ],
  }
}

export async function gradeWithGemini(
  apiKey: string,
  req: GradePayload
): Promise<GradeResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`
  const body = JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: buildPrompt(req) }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2048,
      thinkingConfig: { thinkingBudget: 512 },
    },
  })

  let lastError = 'Grading failed'
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body,
      })

      if (res.status === 503 || res.status === 429) {
        lastError = `Gemini error ${res.status}: ${await res.text().catch(() => '')}`
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, res.status === 503 ? 1200 : 2000))
          continue
        }
        throw new Error(lastError.slice(0, 400))
      }

      if (!res.ok) {
        const errText = await res.text().catch(() => '')
        throw new Error(`Gemini error ${res.status}: ${errText.slice(0, 400)}`)
      }

      const data = (await res.json()) as {
        candidates?: Array<{
          finishReason?: string
          content?: { parts?: Array<{ text?: string }> }
        }>
      }
      const candidate = data.candidates?.[0]
      const text = collectText(candidate?.content?.parts)
      if (!text) {
        throw new Error(
          `Empty Gemini response (${candidate?.finishReason || 'no finish reason'})`
        )
      }
      return parseResult(req.mode, extractJson(text))
    } finally {
      clearTimeout(timeout)
    }
  }

  throw new Error(lastError.slice(0, 400))
}

/** Normalize legacy inbox-fire body OR new mode body into GradePayload */
export function normalizeGradeRequest(body: Record<string, unknown>): GradePayload {
  const mode = (body.mode as GradeMode | undefined) || 'inbox-fire'

  if (mode === 'first-principles') {
    const p = (body.payload || body) as Partial<FirstPrinciplesPayload>
    if (!p.title || !p.situation || !p.bestAnswer || typeof p.principle !== 'string') {
      throw new Error('Missing first-principles fields')
    }
    return {
      mode,
      payload: {
        title: p.title,
        situation: p.situation,
        bestAnswer: p.bestAnswer,
        relatedPrinciples: p.relatedPrinciples || [],
        principle: p.principle,
        application: String(p.application || ''),
      },
    }
  }

  if (mode === 'red-pen') {
    const p = (body.payload || body) as Partial<RedPenPayload>
    if (!p.title || !p.original || !p.modelRewrite || typeof p.rewrite !== 'string') {
      throw new Error('Missing red-pen fields')
    }
    return {
      mode,
      payload: {
        title: p.title,
        original: p.original,
        flaws: p.flaws || [],
        modelRewrite: p.modelRewrite,
        rewrite: p.rewrite,
      },
    }
  }

  // inbox-fire: support legacy { scenario, userAnswer }
  const legacy = body.scenario as Partial<InboxFirePayload> | undefined
  const p = (body.payload || legacy || body) as Partial<InboxFirePayload>
  const userAnswer =
    typeof body.userAnswer === 'string'
      ? body.userAnswer
      : typeof p.userAnswer === 'string'
        ? p.userAnswer
        : null

  if (
    !p.title ||
    !p.setup ||
    !p.task ||
    !p.gradingHints ||
    typeof userAnswer !== 'string'
  ) {
    throw new Error('Missing inbox-fire fields')
  }

  return {
    mode: 'inbox-fire',
    payload: {
      title: p.title,
      setup: p.setup,
      task: p.task,
      principles: p.principles || [],
      modelAnswer: p.modelAnswer || '',
      gradingHints: p.gradingHints,
      userAnswer,
    },
  }
}
