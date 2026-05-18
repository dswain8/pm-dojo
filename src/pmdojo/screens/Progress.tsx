import type { ReactNode } from 'react'

import { Chip, Header, Radar } from '../components'
import { buildHeatmap, buildSenseiSuggestion, calculateLongestStreak, getMissPatterns, getRecentRuns, getSkillValues } from '../game'
import { summarizeOutcomePattern } from '../outcome'
import { DAILY_REP_TARGET, getNextRankProgress } from '../progression'
import type { AppState, Screen, Tokens } from '../types'

type ProgressProps = {
  nav: (screen: Screen) => void
  state: AppState
  tokens: Tokens
  startSuggestedRound: () => void
  openLaneRound: (laneId: string) => void
}

export function ProgressScreen({
  nav,
  state,
  tokens,
  startSuggestedRound,
  openLaneRound,
}: ProgressProps) {
  const skills = getSkillValues(state.history)
  const recent = getRecentRuns(state.history)
  const heatmap = buildHeatmap(state.history)
  const longestStreak = calculateLongestStreak(state.history)
  const suggestion = buildSenseiSuggestion(state.history)
  const rankProgress = getNextRankProgress(state.stats.xp)
  const missPatterns = getMissPatterns(state.history)
  const outcomeSummary = summarizeOutcomePattern(state.history)
  const outcomeCoaching = outcomeCoachingForSummary(outcomeSummary)

  return (
    <div style={{ width: '100%', minHeight: '100%', background: tokens.bg, color: tokens.ink, fontFamily: tokens.sans }}>
      <Header nav={nav} tokens={tokens} active="progress" />

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 48px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, marginBottom: 4 }}>Your practice</div>
            <div style={{ fontSize: 14, color: tokens.dim }}>Every round leaves a mark. Here's what's sharpening.</div>
          </div>
          <button
            onClick={() => nav('invoke')}
            style={{
              background: tokens.gold,
              color: tokens.bg,
              border: 'none',
              padding: '12px 20px',
              fontSize: 13,
              fontWeight: 800,
              borderRadius: 10,
              fontFamily: tokens.sans,
              cursor: 'pointer',
              boxShadow: `0 6px 16px rgba(var(--gold-rgb), 0.3)`,
            }}
          >
            ▶ REVIEW REAL WORK
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
          <div style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 14, padding: 22 }}>
            <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.dim, letterSpacing: 1.5, marginBottom: 8 }}>
              SKILL RADAR
            </div>
            <Radar values={state.stats.radar} baseline={[0.2, 0.2, 0.2, 0.2, 0.2]} tokens={tokens} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 10,
                fontFamily: tokens.mono,
                color: tokens.dimmer,
                marginTop: 4,
                paddingTop: 12,
                borderTop: `1px solid ${tokens.line}`,
              }}
            >
              <span>
                <span style={{ color: tokens.gold }}>●</span> current
              </span>
              <span>
                <span style={{ color: tokens.sky, opacity: 0.6 }}>◌</span> baseline (day 0)
              </span>
            </div>
          </div>
          <StatBlock
            label="STREAK"
            value={`${state.stats.streak}d`}
            color={tokens.hot}
            tokens={tokens}
            extra={
              <>
                <div style={{ display: 'flex', gap: 4, marginTop: 16 }}>
                  {heatmap.map((cell) => {
                    const opacity = cell.count === 0 ? 1 : Math.min(1, 0.22 + cell.count * 0.24)
                    return (
                      <div
                        key={cell.key}
                        title={`${cell.key}: ${cell.count} rep${cell.count === 1 ? '' : 's'}`}
                        style={{
                          flex: 1,
                          height: 22,
                          borderRadius: 3,
                          background: cell.count > 0 ? tokens.hot : tokens.panel2,
                          opacity,
                          outline: cell.isToday ? `1px solid ${tokens.lineStrong}` : 'none',
                        }}
                      />
                    )
                  })}
                </div>
                <div style={{ fontSize: 11, color: tokens.dim, marginTop: 10 }}>last 14 days · longest: {longestStreak}d</div>
              </>
            }
          />
          <StatBlock
            label="DAILY REPS"
            value={`${state.stats.dailyDone}/${DAILY_REP_TARGET}`}
            color={tokens.gold}
            tokens={tokens}
            extra={
              <>
                <div style={{ height: 8, background: tokens.panel2, borderRadius: 4, marginTop: 16, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, Math.round((state.stats.dailyDone / DAILY_REP_TARGET) * 100))}%`,
                      background: tokens.gold,
                      boxShadow: `0 0 12px ${tokens.gold}`,
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, color: tokens.dim, marginTop: 10 }}>small daily cadence, not a chore loop</div>
              </>
            }
          />
          <StatBlock
            label="XP THIS SEASON"
            value={state.stats.xp}
            color={tokens.mint}
            tokens={tokens}
            extra={
              <>
                <div style={{ height: 8, background: tokens.panel2, borderRadius: 4, marginTop: 16, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.round(rankProgress.progress * 100)}%`,
                      background: tokens.mint,
                      boxShadow: `0 0 12px ${tokens.mint}`,
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: tokens.dim, marginTop: 8 }}>
                  <span>Rank: {state.stats.rank}</span>
                  <span>{rankProgress.next ? `${rankProgress.xpToNext} to ${rankProgress.next.rank}` : 'top rank reached'}</span>
                </div>
              </>
            }
          />
        </div>

        <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.dim, letterSpacing: 2, marginBottom: 12 }}>SKILLS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 32 }}>
          {skills.map((skill) => (
            <div key={skill.key} style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 12, padding: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: tokens.mono,
                  fontSize: 10,
                  color: tokens[skill.color],
                  letterSpacing: 1.5,
                  marginBottom: 10,
                }}
              >
                <span>{skill.tag}</span>
                <span style={{ color: tokens.mint }}>{skill.delta}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{skill.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: tokens[skill.color], letterSpacing: -0.5 }}>
                  {Math.round(skill.value * 100)}
                </span>
                <span style={{ fontSize: 11, color: tokens.dim, fontFamily: tokens.mono }}>/100</span>
              </div>
              <div style={{ height: 4, background: tokens.panel2, borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ height: '100%', width: `${skill.value * 100}%`, background: tokens[skill.color] }} />
              </div>
              <div style={{ fontSize: 11, color: tokens.dim, lineHeight: 1.5, marginBottom: 10 }}>{skill.description}</div>
              <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.dimmer }}>{skill.reps} reps</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.dim, letterSpacing: 2, marginBottom: 12 }}>
              RECENT ROUNDS
            </div>
            <div style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 12, overflow: 'hidden' }}>
              {recent.length === 0 ? (
                <div style={{ padding: 18, color: tokens.dim, fontSize: 13, lineHeight: 1.6 }}>
                  No completed rounds yet. Your chart is intentionally empty until you create real signal.
                </div>
              ) : null}
              {recent.map((round, index) => (
                <div
                  key={`${round.round}-${round.lane}-${round.time}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 110px 60px 70px',
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderBottom: index < recent.length - 1 ? `1px solid ${tokens.line}` : 'none',
                    fontSize: 13,
                  }}
                >
                  <span style={{ fontFamily: tokens.mono, color: tokens.dimmer, fontSize: 11 }}>#{round.round}</span>
                  <span style={{ fontWeight: 500 }}>{round.lane}</span>
                  <Chip color={round.color} tokens={tokens}>
                    {round.tag}
                  </Chip>
                  <span
                    style={{
                      fontFamily: tokens.mono,
                      fontSize: 16,
                      fontWeight: 800,
                      color:
                        round.grade === 'S'
                          ? tokens.gold
                          : round.grade === 'A'
                            ? tokens.mint
                            : round.grade === 'B'
                              ? tokens.sky
                              : round.grade === 'C'
                                ? tokens.orchid
                                : tokens.hot,
                    }}
                  >
                    {round.grade}
                  </span>
                  <span style={{ fontFamily: tokens.mono, fontSize: 12, color: tokens.dim, textAlign: 'right' }}>
                    +{round.xp} <span style={{ color: tokens.dimmer }}>· {round.time}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.dim, letterSpacing: 2, marginBottom: 12 }}>
              SENSEI SUGGESTS
            </div>
            <div style={{ background: tokens.panel, border: `1px solid ${tokens.gold}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.gold, letterSpacing: 1.5, marginBottom: 10 }}>
                NEXT REP
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3, marginBottom: 10 }}>
                Drill <span style={{ color: tokens.mint }}>{suggestion.focusLabel}</span>. It's your shortest axis.
              </div>
              <div style={{ fontSize: 13, color: tokens.dim, lineHeight: 1.55, marginBottom: 16 }}>{suggestion.body}</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={startSuggestedRound}
                  style={{
                    background: tokens.gold,
                    color: tokens.bg,
                    border: 'none',
                    padding: '10px 18px',
                    fontSize: 13,
                    fontWeight: 800,
                    borderRadius: 10,
                    fontFamily: tokens.sans,
                    cursor: 'pointer',
                  }}
                >
                  ▶ START {suggestion.title.toUpperCase()}
                </button>
                <button
                  onClick={() => openLaneRound(suggestion.laneId)}
                  style={{
                    background: 'transparent',
                    color: tokens.dim,
                    border: `1px solid ${tokens.lineStrong}`,
                    padding: '10px 16px',
                    fontSize: 12,
                    borderRadius: 10,
                    fontFamily: tokens.sans,
                    cursor: 'pointer',
                  }}
                >
                  OPEN LANE
                </button>
              </div>
            </div>
            <div style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.sky, letterSpacing: 1.5, marginBottom: 10 }}>
                OUTCOME REPLAYS
              </div>
              <div style={{ fontSize: 34, fontWeight: 900, color: tokens.sky, letterSpacing: -0.8, marginBottom: 6 }}>
                {outcomeSummary.count}
              </div>
              <div style={{ fontSize: 13, color: tokens.dim, lineHeight: 1.55, marginBottom: 14 }}>
                {outcomeSummary.count === 0
                  ? 'No live-work outcomes logged yet. This is the loop that turns draft feedback into judgment training.'
                  : `Average learning signal: ${outcomeSummary.averageScore}/100. Latest: ${outcomeSummary.latest?.label.toLowerCase()}.`}
              </div>
              {outcomeSummary.latest?.lesson ? (
                <div style={{ background: tokens.bg2, border: `1px solid ${tokens.line}`, borderRadius: 9, padding: 12, marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontFamily: tokens.mono, color: tokens.dimmer, letterSpacing: 1.2, marginBottom: 5 }}>
                    LATEST LESSON
                  </div>
                  <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.55 }}>{outcomeSummary.latest.lesson}</div>
                </div>
              ) : null}
              <div style={{ background: tokens.bg2, border: `1px solid ${tokens.line}`, borderRadius: 9, padding: 12, marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: tokens.mono, color: tokens.mint, letterSpacing: 1.2, marginBottom: 5 }}>
                  {outcomeCoaching.title}
                </div>
                <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.55 }}>{outcomeCoaching.body}</div>
              </div>
              <button
                onClick={() => nav('outcome')}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: tokens.sky,
                  border: `1px solid ${tokens.lineStrong}`,
                  padding: '10px 14px',
                  fontSize: 12,
                  fontWeight: 800,
                  borderRadius: 10,
                  fontFamily: tokens.sans,
                  cursor: 'pointer',
                }}
              >
                LOG LATEST OUTCOME
              </button>
            </div>
            <div style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.sky, letterSpacing: 1.5, marginBottom: 12 }}>
                MISS PATTERNS
              </div>
              {missPatterns.length === 0 ? (
                <div style={{ fontSize: 13, color: tokens.dim, lineHeight: 1.55 }}>
                  Nothing to diagnose yet. Complete one rep and Dojo will track the rubric beats you miss most often.
                </div>
              ) : null}
              {missPatterns.map((miss) => (
                <div key={miss.label} style={{ borderTop: `1px solid ${tokens.line}`, paddingTop: 10, marginTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 750 }}>{miss.label}</span>
                    <span style={{ fontFamily: tokens.mono, fontSize: 11, color: tokens.hot }}>{miss.count}x</span>
                  </div>
                  <div style={{ fontSize: 11, color: tokens.dim, lineHeight: 1.5 }}>{miss.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function outcomeCoachingForSummary(summary: ReturnType<typeof summarizeOutcomePattern>) {
  if (summary.count === 0) {
    return {
      title: 'NEXT FIELD TEST',
      body: 'Use Preflight on one real artifact this week, then log what the reader actually did. That is the difference between a writing game and judgment training.',
    }
  }

  if (summary.averageScore >= 75) {
    return {
      title: 'PATTERN TO CARRY',
      body: 'You are logging enough outcome signal. Keep connecting the original PM call to what happened after the message landed.',
    }
  }

  return {
    title: 'MAKE THE REPLAY SHARPER',
    body: 'After the next send, capture the reader action, surprise, and next move in plain language. The replay should teach future-you what the rubric could not see.',
  }
}

function StatBlock({
  label,
  value,
  color,
  tokens,
  extra,
}: {
  label: string
  value: string | number
  color: string
  tokens: Tokens
  extra: ReactNode
}) {
  return (
    <div style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 14, padding: 22 }}>
      <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.dim, letterSpacing: 1.5, marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontSize: 56, fontWeight: 900, color, letterSpacing: -2, lineHeight: 1 }}>{value}</div>
      {extra}
    </div>
  )
}
