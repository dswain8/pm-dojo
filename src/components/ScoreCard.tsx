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
  takeaway?: string
  yourResponse?: string
}

function scoreColor(value: number, max: number): string {
  const pct = value / max
  if (pct >= 0.8) return 'border-dojo-green text-dojo-green'
  if (pct >= 0.6) return 'border-dojo-accent text-dojo-accent'
  if (pct >= 0.4) return 'border-dojo-blue text-dojo-blue'
  return 'border-dojo-red text-dojo-red'
}

export function ScoreCard({
  scores,
  modelAnswer,
  principles,
  takeaway,
  yourResponse,
}: ScoreCardProps) {
  const total = scores.reduce((sum, s) => sum + s.value, 0)
  const maxTotal = scores.reduce((sum, s) => sum + s.max, 0)

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center">
        <div className="text-4xl font-bold text-dojo-accent animate-score-reveal inline-block">
          {total}/{maxTotal}
        </div>
        <div className="text-dojo-muted text-sm mt-1">
          {takeaway
            ? takeaway
            : total / maxTotal >= 0.8
              ? 'Senior PM energy. Nice.'
              : total / maxTotal >= 0.6
                ? 'Solid. A few things to tighten.'
                : total / maxTotal >= 0.4
                  ? 'Getting there. See the notes below.'
                  : 'Rough round. Read the feedback — then try again.'}
        </div>
      </div>

      <div
        className={`grid gap-4 ${
          scores.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'
        }`}
      >
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
            <div className="text-xs text-dojo-text/80 mt-2 text-left leading-relaxed">
              {s.feedback}
            </div>
          </div>
        ))}
      </div>

      {yourResponse !== undefined && (
        <div className="dojo-card">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-muted mb-2">
            Your Response
          </h3>
          <p className="text-sm whitespace-pre-wrap text-dojo-text/80">
            {yourResponse.trim() || '(empty)'}
          </p>
        </div>
      )}

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
