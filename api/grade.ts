import {
  gradeWithGemini,
  normalizeGradeRequest,
} from './_lib/gradeWithGemini'

export const config = { runtime: 'edge', regions: ['iad1'] }

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
}

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return json(
      { error: 'Grading is not configured. Set GEMINI_API_KEY on the server.' },
      503
    )
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  let gradeReq
  try {
    gradeReq = normalizeGradeRequest(body)
  } catch (err) {
    return json(
      { error: err instanceof Error ? err.message : 'Invalid grade request' },
      400
    )
  }

  const answerLen =
    gradeReq.mode === 'inbox-fire'
      ? gradeReq.payload.userAnswer.length
      : gradeReq.mode === 'first-principles'
        ? gradeReq.payload.principle.length + gradeReq.payload.application.length
        : gradeReq.payload.rewrite.length

  if (answerLen > 8000) {
    return json({ error: 'Answer too long' }, 400)
  }

  try {
    const result = await gradeWithGemini(apiKey, gradeReq)
    return json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Grading failed'
    console.error('grade error:', message)
    if (message.includes('429') || message.toLowerCase().includes('quota')) {
      return json(
        {
          error:
            'Gemini free-tier quota hit. Wait a few minutes (or until daily reset) and retry.',
        },
        429
      )
    }
    if (message.includes('503') || message.toLowerCase().includes('high demand')) {
      return json(
        { error: 'Gemini is busy right now. Hit Retry in a few seconds.' },
        503
      )
    }
    if (message.includes('aborted') || message.includes('AbortError')) {
      return json({ error: 'Grading timed out. Try again.' }, 504)
    }
    return json({ error: 'Could not grade response. Try again.' }, 502)
  }
}
