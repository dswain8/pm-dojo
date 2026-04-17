interface Score {
  label: string
  value: number
  max: number
  color: string
  feedback: string
}

interface ScoreCardProps {
  scores: Score[]
  modelAnswer?: string
  principles: string[]
}

function scoreColor(value: number, max: number): string {
  const pct = value / max
  if (pct >= 0.8) return 'border-dojo-green text-dojo-green'
  if (pct >= 0.6) return 'border-dojo-accent text-dojo-accent'
  if (pct >= 0.4) return 'border-dojo-blue text-dojo-blue'
  return 'border-dojo-red text-dojo-red'
}

export function ScoreCard({ scores, modelAnswer, principles }: ScoreCardProps) {
  const total = scores.reduce((sum, s) => sum + s.value, 0)
  const maxTotal = scores.reduce((sum, s) => sum + s.max, 0)

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Overall */}
      <div className="text-center">
        <div className="text-4xl font-bold text-dojo-accent animate-score-reveal inline-block">
          {total}/{maxTotal}
        </div>
        <div className="text-dojo-muted text-sm mt-1">
          {total / maxTotal >= 0.8
            ? 'Senior PM energy. Nice.'
            : total / maxTotal >= 0.6
              ? 'Solid. A few things to tighten.'
              : total / maxTotal >= 0.4
                ? 'Getting there. See the notes below.'
                : 'Rough round. Read the feedback — then try again.'}
        </div>
      </div>

      {/* Individual scores */}
      <div className="grid grid-cols-3 gap-4">
        {scores.map((s) => (
          <div key={s.label} className="dojo-card text-center">
            <div
              className={`score-circle mx-auto ${scoreColor(s.value, s.max)}`}
            >
              {s.value}
            </div>
            <div className="text-xs uppercase tracking-wider text-dojo-muted mt-2">
              {s.label}
            </div>
            <div className="text-xs text-dojo-text/70 mt-2">{s.feedback}</div>
          </div>
        ))}
      </div>

      {/* Principles */}
      <div className="dojo-card">
        <h3 className="text-sm font-semibold text-dojo-accent uppercase tracking-wider mb-2">
          Principles Tested
        </h3>
        <div className="flex flex-wrap gap-2">
          {principles.map((p) => (
            <span
              key={p}
              className="text-xs px-2 py-1 rounded-full border border-dojo-border text-dojo-muted"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Model answer */}
      {modelAnswer && (
        <div className="dojo-card">
          <h3 className="text-sm font-semibold text-dojo-green uppercase tracking-wider mb-2">
            Model Answer
          </h3>
          <p className="text-sm text-dojo-text/80 whitespace-pre-wrap">
            {modelAnswer}
          </p>
        </div>
      )}
    </div>
  )
}
