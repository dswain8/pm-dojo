import { useState } from 'react'

import { Logo, PhasePip } from '../components'
import { getLaneLennySources } from '../lenny'
import { actionForMiss, buildCritiqueOutput } from '../output'
import { withAlpha } from '../tokens'
import type { AppState, RubricCheck, RunRecord, Scenario, Screen, Tokens } from '../types'

type CritiqueProps = {
  nav: (screen: Screen) => void
  state: AppState
  tokens: Tokens
  ambientGlow: boolean
  tweakPanelInset: number
  rewriteRound: () => void
  finishRound: (nextScreen: 'landing' | 'round' | 'practice') => void
  scenario: Scenario
}

export function CritiqueScreen({
  nav,
  state,
  tokens,
  ambientGlow,
  tweakPanelInset,
  rewriteRound,
  finishRound,
  scenario,
}: CritiqueProps) {
  const run: RunRecord = state.lastRun ?? {
    laneId: scenario.laneId,
    scenarioId: scenario.id,
    draft: '',
    checks: [],
    xp: 0,
    words: 0,
    timeLeft: 0,
    submittedAt: new Date().toISOString(),
    skillDeltas: scenario.skillDeltas,
    grade: 'D',
    evaluator: 'local-principle-regex-v3',
  }
  const gradeColor = { S: tokens.gold, A: tokens.mint, B: tokens.sky, C: tokens.orchid, D: tokens.hot }[run.grade]
  const lane = state.lanes.find((entry) => entry.id === run.laneId)
  const isPracticeDraft = scenario.source === 'practice'
  const output = buildCritiqueOutput(scenario, run)
  const { hits, misses, contextReview, readiness, coaching, revisedDraft, revisionReasons } = output
  const readinessColor = tokens[readiness.color]
  const coachingColor = tokens[coaching.color]
  const [copiedSeniorDraft, setCopiedSeniorDraft] = useState(false)
  const lennySources = getLaneLennySources(scenario.laneId).slice(0, 3)

  const copySeniorDraft = () => {
    if (!navigator.clipboard) {
      return
    }

    void navigator.clipboard.writeText(revisedDraft.body).then(() => {
      setCopiedSeniorDraft(true)
      window.setTimeout(() => setCopiedSeniorDraft(false), 1800)
    })
  }

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        background: tokens.bg,
        color: tokens.ink,
        fontFamily: tokens.sans,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {ambientGlow ? (
        <div
          style={{
            position: 'absolute',
            top: -200,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 700,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${withAlpha(coachingColor, 0.13)}, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      ) : null}

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 28px',
          borderBottom: `1px solid ${tokens.line}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Logo size={26} tokens={tokens} />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>
            ROUND {String(state.stats.rounds + 1).padStart(3, '0')}
          </span>
          <span style={{ fontSize: 11, color: tokens.dim, fontFamily: tokens.mono, letterSpacing: 1 }}>
            · {scenario.code} · {scenario.title.toUpperCase()} · COMPLETE
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            ['BRIEF', 'done'],
            ['WRITE', 'done'],
            ['CRIT', 'active'],
            ['REPLAY', 'pending'],
          ].map(([label, phaseState]) => (
            <PhasePip
              key={label}
              label={label}
              state={phaseState as 'done' | 'active' | 'pending'}
              tokens={tokens}
            />
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '40px 40px 60px' }}>
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: 34, marginBottom: 32 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.dim, letterSpacing: 2, marginBottom: 12 }}>
              GRADE
            </div>
            <div
              style={{
                fontSize: 160,
                fontWeight: 900,
                color: gradeColor,
                lineHeight: 0.85,
                letterSpacing: -8,
                textShadow: `0 0 60px ${withAlpha(gradeColor, 0.27)}`,
              }}
            >
              {run.grade}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: tokens.gold }}>+{run.xp}</span>
              <span style={{ fontSize: 13, color: tokens.dim, fontFamily: tokens.mono }}>xp</span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: `linear-gradient(145deg, ${withAlpha(coachingColor, 0.14)}, ${tokens.panel} 58%)`,
              border: `1px solid ${withAlpha(coachingColor, 0.4)}`,
              borderRadius: 18,
              padding: 26,
              boxShadow: `0 22px 60px ${withAlpha(coachingColor, 0.08)}`,
            }}
          >
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
              <Pill label="LIVE CRITIQUE" color={coachingColor} tokens={tokens} />
              <Pill label={readiness.label} color={readinessColor} tokens={tokens} />
              <Pill label={contextReview.label} color={tokens.dim} tokens={tokens} />
              <Pill label="LENNY-DERIVED RUBRIC" color={tokens.mint} tokens={tokens} />
            </div>
            <div style={{ fontSize: 31, fontWeight: 850, lineHeight: 1.18, letterSpacing: -0.7, marginBottom: 14 }}>
              {coaching.title}
            </div>
            <div style={{ fontSize: 15, color: tokens.dim, lineHeight: 1.65, maxWidth: 780, marginBottom: coaching.fix ? 18 : 0 }}>
              {coaching.body}
            </div>
            {coaching.fix ? (
              <div style={{ background: tokens.bg2, border: `1px solid ${tokens.line}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 10, fontFamily: tokens.mono, color: tokens.gold, letterSpacing: 1.4, marginBottom: 6 }}>
                  FIX FIRST
                </div>
                <div style={{ fontSize: 13, color: tokens.ink, lineHeight: 1.55 }}>{coaching.fix}</div>
              </div>
            ) : null}
            <div style={{ display: 'flex', gap: 18, fontSize: 12, color: tokens.dim, fontFamily: tokens.mono, marginTop: 18 }}>
              <span>
                {hits.length}/{run.checks.length} beats hit
              </span>
              <span>{run.words} words</span>
              <span>
                {Math.floor((480 - run.timeLeft) / 60)}:{String((480 - run.timeLeft) % 60).padStart(2, '0')} used
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            background: tokens.panel,
            border: `1px solid ${withAlpha(tokens.mint, 0.24)}`,
            borderRadius: 14,
            padding: 18,
            marginBottom: 32,
            display: 'grid',
            gridTemplateColumns: '210px 1fr',
            gap: 18,
            alignItems: 'start',
          }}
        >
          <div>
            <div style={{ fontFamily: tokens.mono, fontSize: 11, color: tokens.mint, letterSpacing: 2, marginBottom: 8 }}>
              SOURCE LINEAGE
            </div>
            <div style={{ fontSize: 13, color: tokens.dim, lineHeight: 1.55 }}>
              The critique uses Lenny archive-derived principles only.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {lennySources.map((source) => (
              <div key={source.id} style={{ background: tokens.bg2, border: `1px solid ${tokens.line}`, borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>{source.title}</div>
                <div style={{ fontFamily: tokens.mono, fontSize: 9, color: tokens.dimmer, letterSpacing: 0.5 }}>
                  {source.kind.toUpperCase()} · {source.topicFile}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          <div style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 14, padding: 22 }}>
            <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.mint, letterSpacing: 2, marginBottom: 16 }}>
              WHAT LANDED
            </div>
            {hits.length === 0 ? <div style={{ color: tokens.dim, fontSize: 13 }}>No beats hit this round.</div> : null}
            {hits.map((check) => (
              <FeedbackRow key={check.id} check={check} hit tokens={tokens} />
            ))}
          </div>
          <div style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 14, padding: 22 }}>
            <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.hot, letterSpacing: 2, marginBottom: 16 }}>
              WHAT MISSED
            </div>
            {misses.length === 0 ? <div style={{ color: tokens.dim, fontSize: 13 }}>Clean round. No required rewrite.</div> : null}
            {misses.map((check) => (
              <FeedbackRow key={check.id} check={check} tokens={tokens} fix={actionForMiss(check)} />
            ))}
          </div>
        </div>

        <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.dim, letterSpacing: 2, marginBottom: 14 }}>
          REVISED DRAFT
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '0.92fr 1.08fr', gap: 16, marginBottom: 32 }}>
          <div style={{ background: tokens.bg2, border: `1px solid ${tokens.line}`, borderRadius: 14, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Your draft</div>
              <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.dim }}>{run.words} words</div>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: tokens.ink, whiteSpace: 'pre-wrap', fontFamily: tokens.sans }}>
              {run.draft}
            </div>
          </div>
          <div style={{ background: tokens.bg2, border: `1px solid ${tokens.gold}`, borderRadius: 14, padding: 20, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 850, marginBottom: 3 }}>Suggested rewrite</div>
                <div style={{ color: tokens.dim, fontFamily: tokens.mono, fontSize: 11 }}>
                  Artifact-shaped · {revisedDraft.words} words
                </div>
              </div>
              <button
                onClick={copySeniorDraft}
                style={{
                  background: copiedSeniorDraft ? withAlpha(tokens.mint, 0.16) : tokens.gold,
                  color: copiedSeniorDraft ? tokens.mint : tokens.bg,
                  border: `1px solid ${copiedSeniorDraft ? withAlpha(tokens.mint, 0.38) : tokens.gold}`,
                  padding: '8px 11px',
                  fontSize: 10,
                  fontWeight: 900,
                  borderRadius: 8,
                  fontFamily: tokens.mono,
                  cursor: 'pointer',
                  letterSpacing: 0.5,
                  flexShrink: 0,
                }}
              >
                {copiedSeniorDraft ? 'COPIED' : 'COPY REVISED DRAFT'}
              </button>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.75, color: tokens.ink, whiteSpace: 'pre-wrap' }}>{revisedDraft.body}</div>
          </div>
        </div>

        <div style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 14, padding: 22, marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.gold, letterSpacing: 2, marginBottom: 10 }}>
            WHY THIS REVISION WORKS
          </div>
          <div style={{ fontSize: 13, color: tokens.dim, lineHeight: 1.6, marginBottom: 18 }}>
            The rewrite keeps the same artifact type and removes the missing PM beat.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {revisionReasons.map((annotation) => (
              <Annotation
                key={annotation.title}
                title={annotation.title}
                body={annotation.body}
                color={tokens[annotation.color]}
                tokens={tokens}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: tokens.dim, fontFamily: tokens.mono }}>
            +{run.xp} xp · {lane ? `${lane.title} moves to ${lane.reps + 1} reps` : 'practice log updates on save'} ·{' '}
            {Math.max(0, 3 - Math.min(3, state.stats.dailyDone + 1))} more today for daily bonus
          </div>
          <div style={{ display: 'flex', gap: 10, marginRight: tweakPanelInset }}>
            <button
              onClick={rewriteRound}
              style={{
                background: 'transparent',
                color: tokens.ink,
                border: `1px solid ${tokens.lineStrong}`,
                padding: '12px 20px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 10,
                fontFamily: tokens.sans,
                cursor: 'pointer',
              }}
            >
              ↺ REWRITE
            </button>
            <button
              onClick={() => nav('outcome')}
              style={{
                background: withAlpha(tokens.sky, 0.12),
                color: tokens.sky,
                border: `1px solid ${withAlpha(tokens.sky, 0.42)}`,
                padding: '12px 20px',
                fontSize: 13,
                fontWeight: 800,
                borderRadius: 10,
                fontFamily: tokens.sans,
                cursor: 'pointer',
              }}
            >
              LOG OUTCOME
            </button>
            <button
              onClick={() => finishRound('landing')}
              style={{
                background: 'transparent',
                color: tokens.dim,
                border: `1px solid ${tokens.line}`,
                padding: '12px 20px',
                fontSize: 13,
                borderRadius: 10,
                fontFamily: tokens.sans,
                cursor: 'pointer',
              }}
            >
              END ROUND
            </button>
            {isPracticeDraft ? (
              <button
                onClick={() => finishRound('practice')}
                style={{
                  background: tokens.gold,
                  color: tokens.bg,
                  border: 'none',
                  padding: '12px 24px',
                  fontSize: 13,
                  fontWeight: 800,
                  borderRadius: 10,
                  fontFamily: tokens.sans,
                  cursor: 'pointer',
                  boxShadow: `0 6px 16px ${withAlpha(tokens.gold, 0.3)}`,
                }}
              >
                NEW DRAFT →
              </button>
            ) : (
              <button
                onClick={() => finishRound('round')}
                style={{
                  background: tokens.gold,
                  color: tokens.bg,
                  border: 'none',
                  padding: '12px 24px',
                  fontSize: 13,
                  fontWeight: 800,
                  borderRadius: 10,
                  fontFamily: tokens.sans,
                  cursor: 'pointer',
                  boxShadow: `0 6px 16px ${withAlpha(tokens.gold, 0.3)}`,
                }}
              >
                NEXT ROUND →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Pill({ label, color, tokens }: { label: string; color: string; tokens: Tokens }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        color,
        border: `1px solid ${withAlpha(color, 0.36)}`,
        background: withAlpha(color, 0.08),
        borderRadius: 100,
        padding: '5px 9px',
        fontFamily: tokens.mono,
        fontSize: 10,
        fontWeight: 850,
        letterSpacing: 1,
      }}
    >
      {label}
    </span>
  )
}

function FeedbackRow({
  check,
  hit = false,
  fix,
  tokens,
}: {
  check: RubricCheck
  hit?: boolean
  fix?: string
  tokens: Tokens
}) {
  const color = hit ? tokens.mint : tokens.hot

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '18px 1fr', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
      <span style={{ color, fontSize: 14 }}>{hit ? '✓' : '○'}</span>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
          <div style={{ fontSize: 14, fontWeight: 750 }}>{check.label}</div>
          <div style={{ fontFamily: tokens.mono, fontSize: 11, color, flexShrink: 0 }}>{hit ? `+${check.pts}` : 'fix'}</div>
        </div>
        <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.5 }}>{check.detail}</div>
        {fix ? (
          <div style={{ fontSize: 12, color: tokens.ink, lineHeight: 1.5, marginTop: 7 }}>
            <span style={{ color: tokens.gold, fontFamily: tokens.mono, fontSize: 10, letterSpacing: 0.8 }}>FIX:</span> {fix}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function Annotation({
  title,
  body,
  color,
  tokens,
}: {
  title: string
  body: string
  color: string
  tokens: Tokens
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: color, display: 'inline-block' }} />
        <div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>
      </div>
      <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.55 }}>{body}</div>
    </div>
  )
}
