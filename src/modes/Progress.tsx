import { Link } from 'react-router-dom'
import { getSessions, getStreak } from '../lib/storage'

export function Progress() {
  const sessions = getSessions()
  const streak = getStreak()

  const byMode = sessions.reduce(
    (acc, s) => {
      acc[s.mode] = (acc[s.mode] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const modeLabels: Record<string, string> = {
    'quick-draw': '⚡ Quick Draw',
    'rewrite': '✏️ Rewrite Arena',
    'concept-clinic': '🧠 Concept Clinic',
    'scenario': '🎭 Scenario Replay',
  }

  // Recent sessions (last 10)
  const recent = [...sessions].reverse().slice(0, 10)

  if (sessions.length === 0) {
    return (
      <div className="space-y-8 text-center pt-16">
        <div className="text-4xl">🥋</div>
        <h1 className="text-2xl font-bold">No sessions yet</h1>
        <p className="text-dojo-muted">Complete your first round to start tracking progress.</p>
        <Link to="/" className="dojo-btn-primary inline-block">Enter the Dojo</Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <Link to="/" className="text-dojo-muted text-sm hover:text-dojo-accent">← Arena</Link>
        <h1 className="text-3xl font-bold mt-4">Progress</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="dojo-card text-center">
          <div className="text-3xl font-bold text-dojo-accent">{sessions.length}</div>
          <div className="text-xs text-dojo-muted">Total Rounds</div>
        </div>
        <div className="dojo-card text-center">
          <div className="text-3xl font-bold text-dojo-accent">{streak}</div>
          <div className="text-xs text-dojo-muted">Day Streak</div>
        </div>
        <div className="dojo-card text-center">
          <div className="text-3xl font-bold text-dojo-accent">{Object.keys(byMode).length}/4</div>
          <div className="text-xs text-dojo-muted">Modes Tried</div>
        </div>
      </div>

      {/* By mode */}
      <div className="dojo-card">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted mb-4">By Mode</h2>
        <div className="space-y-3">
          {Object.entries(modeLabels).map(([key, label]) => {
            const count = byMode[key] || 0
            const pct = sessions.length > 0 ? (count / sessions.length) * 100 : 0
            return (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{label}</span>
                  <span className="text-dojo-muted">{count} rounds</span>
                </div>
                <div className="w-full h-2 bg-dojo-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-dojo-accent rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent */}
      <div className="dojo-card">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted mb-4">Recent Sessions</h2>
        <div className="space-y-2">
          {recent.map((s, i) => (
            <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-dojo-border last:border-0">
              <div>
                <span className="text-dojo-text">{s.scenarioTitle}</span>
                <span className="text-dojo-muted ml-2 text-xs">{s.difficulty}</span>
              </div>
              <div className="text-dojo-accent font-bold">
                {Object.values(s.scores).reduce((a, b) => a + b, 0)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clear data */}
      <button
        onClick={() => {
          if (window.confirm('Clear all progress? This cannot be undone.')) {
            localStorage.removeItem('pm-dojo-sessions')
            window.location.reload()
          }
        }}
        className="text-xs text-dojo-muted hover:text-dojo-red transition-colors"
      >
        Clear all progress
      </button>
    </div>
  )
}
