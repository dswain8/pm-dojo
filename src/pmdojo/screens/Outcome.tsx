import { useState } from 'react'

import { Header } from '../components'
import { getLaneById } from '../game'
import { EMPTY_OUTCOME_DRAFT, evaluateOutcomeReplay, latestReplayableRun, type OutcomeDraft } from '../outcome'
import { withAlpha } from '../tokens'
import type { AppState, OutcomeStatus, RunRecord, Screen, Tokens } from '../types'

type OutcomeProps = {
  nav: (screen: Screen) => void
  state: AppState
  tokens: Tokens
  ambientGlow: boolean
  saveOutcome: (draft: OutcomeDraft) => void
  skipOutcome: () => void
}

const statusOptions: Array<{ value: OutcomeStatus; label: string; detail: string }> = [
  { value: 'landed', label: 'Landed', detail: 'The reader acted or aligned.' },
  { value: 'mixed', label: 'Mixed', detail: 'Some motion, some pushback.' },
  { value: 'missed', label: 'Missed', detail: 'The artifact did not create the intended motion.' },
  { value: 'not-sent', label: 'Not sent', detail: 'You changed course before sending.' },
]

export function OutcomeScreen({ nav, state, tokens, ambientGlow, saveOutcome, skipOutcome }: OutcomeProps) {
  const replayableRun = state.lastRun ?? latestReplayableRun(state.history)
  const [draft, setDraft] = useState<OutcomeDraft>(EMPTY_OUTCOME_DRAFT)
  const review = evaluateOutcomeReplay(draft)
  const canSave = review.score >= 45

  if (!replayableRun) {
    return (
      <div style={{ width: '100%', minHeight: '100%', background: tokens.bg, color: tokens.ink, fontFamily: tokens.sans }}>
        <Header nav={nav} tokens={tokens} active="progress" />
        <div style={{ maxWidth: 840, margin: '0 auto', padding: '64px 48px' }}>
          <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: -1, marginBottom: 12 }}>No replay ready.</div>
          <div style={{ fontSize: 15, color: tokens.dim, lineHeight: 1.6, marginBottom: 24 }}>
            Complete a preflight review or a training round first. Then come back here after the artifact meets the world.
          </div>
          <button onClick={() => nav('invoke')} style={primaryButton(tokens)}>
            REVIEW REAL WORK
          </button>
        </div>
      </div>
    )
  }

  const lane = getLaneById(replayableRun.laneId)

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
            top: -220,
            right: -220,
            width: 650,
            height: 650,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(110,170,255,.16), transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      ) : null}
      <Header nav={nav} tokens={tokens} active="progress" />

      <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: '42px 48px 64px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.sky, letterSpacing: 2, marginBottom: 12 }}>
              OUTCOME REPLAY
            </div>
            <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: -1.4, marginBottom: 8 }}>What happened after send?</div>
            <div style={{ fontSize: 14, color: tokens.dim, lineHeight: 1.6, maxWidth: 720 }}>
              This is the part most PM training misses. The artifact is only half the rep; the learning comes from comparing your intended PM call to the reaction it created.
            </div>
          </div>
          <ReplayScore review={review} tokens={tokens} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 16 }}>
          <RunSnapshot run={replayableRun} laneTitle={lane?.title ?? replayableRun.laneId} tokens={tokens} />

          <div style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 14, padding: 20 }}>
            <FieldLabel tokens={tokens}>Outcome</FieldLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 18 }}>
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDraft((current) => ({ ...current, status: option.value }))}
                  style={{
                    background: draft.status === option.value ? withAlpha(tokens.gold, 0.14) : tokens.bg2,
                    color: draft.status === option.value ? tokens.ink : tokens.dim,
                    border: `1px solid ${draft.status === option.value ? tokens.gold : tokens.line}`,
                    borderRadius: 10,
                    padding: 12,
                    fontFamily: tokens.sans,
                    cursor: 'pointer',
                    textAlign: 'left',
                    minHeight: 94,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 850, marginBottom: 6 }}>{option.label}</div>
                  <div style={{ fontSize: 11, lineHeight: 1.45, color: tokens.dim }}>{option.detail}</div>
                </button>
              ))}
            </div>

            <FieldLabel tokens={tokens}>Reader response</FieldLabel>
            <textarea
              value={draft.readerResponse}
              onChange={(event) => setDraft((current) => ({ ...current, readerResponse: event.target.value }))}
              placeholder="What did the reader do, ask, approve, block, or misunderstand?"
              style={textAreaStyle(tokens, 112)}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <FieldLabel tokens={tokens}>Surprise</FieldLabel>
                <textarea
                  value={draft.surprise}
                  onChange={(event) => setDraft((current) => ({ ...current, surprise: event.target.value }))}
                  placeholder="What did you not predict about the reaction?"
                  style={textAreaStyle(tokens, 118)}
                />
              </div>
              <div>
                <FieldLabel tokens={tokens}>Lesson</FieldLabel>
                <textarea
                  value={draft.lesson}
                  onChange={(event) => setDraft((current) => ({ ...current, lesson: event.target.value }))}
                  placeholder="What should future-you do differently?"
                  style={textAreaStyle(tokens, 118)}
                />
              </div>
            </div>

            <FieldLabel tokens={tokens}>Next move</FieldLabel>
            <textarea
              value={draft.nextMove}
              onChange={(event) => setDraft((current) => ({ ...current, nextMove: event.target.value }))}
              placeholder="What will you send, ask, escalate, or decide next?"
              style={textAreaStyle(tokens, 92)}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, gap: 16 }}>
              <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.55 }}>
                {review.missing.length > 0 ? `Add: ${review.missing.slice(0, 4).join(' · ')}` : 'Replay is useful enough to save.'}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={skipOutcome} style={secondaryButton(tokens)}>
                  SKIP FOR NOW
                </button>
                <button
                  onClick={() => saveOutcome(draft)}
                  disabled={!canSave}
                  style={{
                    ...primaryButton(tokens),
                    background: canSave ? tokens.gold : tokens.panel2,
                    color: canSave ? tokens.bg : tokens.dimmer,
                    cursor: canSave ? 'pointer' : 'default',
                    boxShadow: canSave ? `0 8px 20px ${withAlpha(tokens.gold, 0.24)}` : 'none',
                  }}
                >
                  SAVE REPLAY →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReplayScore({ review, tokens }: { review: ReturnType<typeof evaluateOutcomeReplay>; tokens: Tokens }) {
  const color = review.score >= 75 ? tokens.mint : review.score >= 45 ? tokens.gold : tokens.hot

  return (
    <div style={{ background: tokens.panel, border: `1px solid ${withAlpha(color, 0.34)}`, borderRadius: 14, padding: 18, width: 250 }}>
      <div style={{ fontSize: 10, fontFamily: tokens.mono, color, letterSpacing: 1.6, marginBottom: 8 }}>
        LEARNING SIGNAL · {review.score}/100
      </div>
      <div style={{ fontSize: 18, fontWeight: 900, color, marginBottom: 6 }}>{review.label}</div>
      <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.55 }}>{review.detail}</div>
    </div>
  )
}

function RunSnapshot({ run, laneTitle, tokens }: { run: RunRecord; laneTitle: string; tokens: Tokens }) {
  return (
    <div style={{ background: tokens.bg2, border: `1px solid ${tokens.line}`, borderRadius: 14, padding: 18, alignSelf: 'start' }}>
      <div style={{ fontSize: 10, fontFamily: tokens.mono, color: tokens.gold, letterSpacing: 1.5, marginBottom: 10 }}>
        ORIGINAL REP
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 42, fontWeight: 900, color: tokens.gold }}>{run.grade}</div>
        <div style={{ fontFamily: tokens.mono, fontSize: 12, color: tokens.dim }}>+{run.xp}xp · {laneTitle}</div>
      </div>
      {run.judgmentCheckpoint?.recommendation ? (
        <SnapshotBlock title="PM call" body={run.judgmentCheckpoint.recommendation} tokens={tokens} />
      ) : null}
      <SnapshotBlock title="Draft sent or reviewed" body={run.draft || 'No draft text saved.'} tokens={tokens} />
    </div>
  )
}

function SnapshotBlock({ title, body, tokens }: { title: string; body: string; tokens: Tokens }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 10, fontFamily: tokens.mono, color: tokens.dimmer, letterSpacing: 1.2, marginBottom: 6 }}>
        {title.toUpperCase()}
      </div>
      <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.65, whiteSpace: 'pre-wrap', maxHeight: 230, overflow: 'auto' }}>
        {body}
      </div>
    </div>
  )
}

function FieldLabel({ children, tokens }: { children: string; tokens: Tokens }) {
  return (
    <div style={{ fontSize: 10, fontFamily: tokens.mono, color: tokens.dimmer, letterSpacing: 1.3, marginBottom: 8, marginTop: 12 }}>
      {children.toUpperCase()}
    </div>
  )
}

function textAreaStyle(tokens: Tokens, height: number) {
  return {
    width: '100%',
    height,
    resize: 'none' as const,
    background: tokens.bg2,
    color: tokens.ink,
    border: `1px solid ${tokens.line}`,
    borderRadius: 10,
    padding: 12,
    outline: 'none',
    fontFamily: tokens.sans,
    fontSize: 13,
    lineHeight: 1.6,
    caretColor: tokens.gold,
  }
}

function primaryButton(tokens: Tokens) {
  return {
    background: tokens.gold,
    color: tokens.bg,
    border: 'none',
    padding: '12px 18px',
    borderRadius: 10,
    fontFamily: tokens.sans,
    fontSize: 13,
    fontWeight: 850,
    cursor: 'pointer',
  }
}

function secondaryButton(tokens: Tokens) {
  return {
    background: 'transparent',
    color: tokens.dim,
    border: `1px solid ${tokens.line}`,
    padding: '12px 18px',
    borderRadius: 10,
    fontFamily: tokens.sans,
    fontSize: 13,
    cursor: 'pointer',
  }
}
