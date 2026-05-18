import { Link } from 'react-router-dom'
import { SKILL_META } from '../data/game'
import {
  getSessionMaxTotal,
  getSessionSkills,
  getSessionTotal,
  getSessions,
  getSkillSummary,
  getStreak,
  type SessionMode,
} from '../lib/storage'

const MODE_LABELS: Record<SessionMode, string> = {
  'quick-draw': 'Quick Draw',
  rewrite: 'Rewrite Arena',
  'concept-clinic': 'Concept Clinic',
  scenario: 'Scenario Replay',
  'inbox-fire': 'Bad-News Update',
  'the-room': 'Navigate the Room',
  'red-pen': 'Red Pen',
  'first-principles': 'Decision Lab',
}

export function Progress() {
  const sessions = getSessions()
  const streak = getStreak()
  const skillSummary = getSkillSummary()

  const recent = [...sessions].reverse().slice(0, 10)
  const totalRounds = sessions.length
  const practicedSkills = skillSummary.filter((skill) => skill.rounds > 0).length
  const scoredSessions = sessions.filter((session) => getSessionMaxTotal(session) !== null)
  const averagePct =
    scoredSessions.length > 0
      ? scoredSessions.reduce((sum, session) => {
          const maxTotal = getSessionMaxTotal(session)
          if (!maxTotal) return sum
          return sum + getSessionTotal(session) / maxTotal
        }, 0) / scoredSessions.length
      : null

  if (sessions.length === 0) {
    return (
      <div className="space-y-8 text-center pt-16">
        <div className="text-4xl">🥋</div>
        <h1 className="text-2xl font-bold">No sessions yet</h1>
        <p className="text-dojo-muted">
          Complete your first round to start tracking your PM skill map.
        </p>
        <Link to="/" className="dojo-btn-primary inline-block">
          Enter the Dojo
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <Link to="/" className="text-dojo-muted text-sm hover:text-dojo-accent">
          ← Arena
        </Link>
        <h1 className="text-3xl font-bold mt-4">Progress</h1>
        <p className="text-dojo-muted mt-2">
          Measure reps by PM skill, not just by which game mode happened to be open.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="dojo-card text-center">
          <div className="text-3xl font-bold text-dojo-accent">{totalRounds}</div>
          <div className="text-xs text-dojo-muted">Total Rounds</div>
        </div>
        <div className="dojo-card text-center">
          <div className="text-3xl font-bold text-dojo-accent">{streak}</div>
          <div className="text-xs text-dojo-muted">Day Streak</div>
        </div>
        <div className="dojo-card text-center">
          <div className="text-3xl font-bold text-dojo-accent">{practicedSkills}/5</div>
          <div className="text-xs text-dojo-muted">Skills Practiced</div>
        </div>
        <div className="dojo-card text-center">
          <div className="text-3xl font-bold text-dojo-accent">
            {averagePct !== null ? `${Math.round(averagePct * 100)}%` : '—'}
          </div>
          <div className="text-xs text-dojo-muted">Avg. Scored Reps</div>
        </div>
      </div>

      <div className="dojo-card space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted">
            Skill Map
          </h2>
          <p className="text-xs text-dojo-muted mt-2">
            The redesign goal is to track communication, escalation, prioritization, discovery, and leadership judgment separately.
          </p>
        </div>

        <div className="space-y-4">
          {skillSummary.map((skill) => (
            <div key={skill.key} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className={`text-sm font-semibold ${SKILL_META[skill.key].color}`}>
                    {skill.label}
                  </div>
                  <div className="text-xs text-dojo-muted">{skill.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-dojo-text">{skill.rounds}</div>
                  <div className="text-[11px] text-dojo-muted">reps</div>
                </div>
              </div>

              <div className="w-full h-2 bg-dojo-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-dojo-accent rounded-full transition-all"
                  style={{ width: `${totalRounds > 0 ? (skill.rounds / totalRounds) * 100 : 0}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-dojo-muted">
                <span>recent focus: {skill.recentRounds}/10</span>
                <span>
                  {skill.averagePct !== null
                    ? `avg scored reps: ${Math.round(skill.averagePct * 100)}%`
                    : 'needs more scored reps'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dojo-card">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted mb-4">
          Recent Sessions
        </h2>
        <div className="space-y-2">
          {recent.map((session, index) => {
            const total = getSessionTotal(session)
            const maxTotal = getSessionMaxTotal(session)
            const skills = getSessionSkills(session)

            return (
              <div
                key={`${session.timestamp}-${index}`}
                className="flex flex-col gap-2 py-3 border-b border-dojo-border last:border-0"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-dojo-text">{session.scenarioTitle}</div>
                    <div className="text-xs text-dojo-muted mt-1">
                      {MODE_LABELS[session.mode]} · {session.difficulty}
                    </div>
                  </div>
                  <div className="text-dojo-accent font-bold whitespace-nowrap">
                    {maxTotal !== null ? `${total}/${maxTotal}` : total}
                  </div>
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={`${session.timestamp}-${skill}`}
                        className={`text-[11px] px-2 py-1 rounded-full border border-white/10 ${SKILL_META[skill].bg} ${SKILL_META[skill].color}`}
                      >
                        {SKILL_META[skill].label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

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
