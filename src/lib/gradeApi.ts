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

export async function requestGrade(body: Record<string, unknown>): Promise<GradeResult> {
  const res = await fetch('/api/grade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Grading failed')
  }
  return data as GradeResult
}

export function scoresRecord(result: GradeResult): Record<string, number> {
  return Object.fromEntries(result.dimensions.map((d) => [d.key, d.value]))
}
