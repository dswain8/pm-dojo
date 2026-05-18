import { useState } from 'react'

import { Header } from '../components'
import { evaluatePracticeContext, type ContextReview } from '../context'
import { countWords, evaluateDraft } from '../rubric'
import { EMPTY_JUDGMENT_CHECKPOINT, evaluateJudgmentCheckpoint } from '../judgment'
import { createPracticeScenario, type PracticeArtifact, type PracticeInput } from '../practice'
import { withAlpha } from '../tokens'
import type { Screen, Tokens } from '../types'
import { JudgmentFields } from './JudgmentFields'

type PracticeProps = {
  nav: (screen: Screen) => void
  tokens: Tokens
  ambientGlow: boolean
  submitPracticeDraft: (input: PracticeInput) => void
}

const artifacts: PracticeArtifact[] = ['Slack update', 'Exec memo', 'PRD section', 'Customer reply']

const sampleDraft = `Rec: pause the launch by Friday and send customers the corrected billing note first.

Evidence: Support cannot explain the invoice delta yet and three renewal customers are affected.

Tradeoff: we lose one launch week, but avoid a customer note we may need to unwind.

Need @maya to approve the note by EOD and @devon to confirm the customer list by 3pm.`

const sampleSituation =
  'The billing launch note is ready, but support just found that three renewal customers will see invoice deltas they cannot yet explain.'

const sampleJudgment = {
  recommendation: 'Pause the launch by Friday and send the corrected billing note first.',
  nonGoals: 'Do not send the current launch note or promise a refund ETA yet.',
  evidence: 'Support cannot explain the invoice delta, and three renewal customers are affected.',
  tradeoff: 'We lose one launch week, but avoid a billing-trust note we may need to unwind.',
  ask: '@maya approves the customer note by EOD; @devon confirms the impacted list by 3pm.',
  changeMind: 'If Support can explain the deltas and Billing confirms the note is accurate, ship the launch note.',
}

export function PracticeScreen({ nav, tokens, ambientGlow, submitPracticeDraft }: PracticeProps) {
  const [artifact, setArtifact] = useState<PracticeArtifact>('Slack update')
  const [audience, setAudience] = useState('')
  const [situation, setSituation] = useState('')
  const [draft, setDraft] = useState('')
  const [judgment, setJudgment] = useState(EMPTY_JUDGMENT_CHECKPOINT)
  const input = { artifact, audience, situation, draft, judgment }
  const contextReview = evaluatePracticeContext(input)
  const judgmentReview = evaluateJudgmentCheckpoint(judgment)
  const liveScenario = createPracticeScenario(input)
  const evaluation = evaluateDraft(liveScenario, draft)
  const checks = evaluation.checks
  const projectedXp = evaluation.xp
  const words = countWords(draft)
  const hitCount = checks.filter((check) => check.hit).length
  const loadSample = () => {
    setArtifact('Slack update')
    setAudience('VP Product, support lead, eng owner')
    setSituation(sampleSituation)
    setJudgment(sampleJudgment)
    setDraft(sampleDraft)
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
            top: -220,
            right: -180,
            width: 620,
            height: 620,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(94,242,176,.16), transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      ) : null}

      <Header nav={nav} tokens={tokens} active="lanes" />

      <div style={{ position: 'relative', maxWidth: 1440, margin: '0 auto', padding: '38px 48px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 38, fontWeight: 850, letterSpacing: -1, marginBottom: 6 }}>Practice my draft</div>
            <div style={{ fontSize: 14, color: tokens.dim, maxWidth: 650, lineHeight: 1.6 }}>
              Paste a real PM artifact. Dojo scores the draft, gives you the senior-PM delta, and saves the rep to your practice history.
            </div>
          </div>
          <div style={{ fontFamily: tokens.mono, fontSize: 11, color: tokens.dimmer, letterSpacing: 1.2 }}>
            LIVE WORK · PRIVATE LOCAL
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 320px', gap: 16, alignItems: 'stretch' }}>
          <div style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.gold, letterSpacing: 1.5, marginBottom: 14 }}>
              CONTEXT
            </div>

            <FieldLabel tokens={tokens}>Artifact</FieldLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, marginBottom: 16 }}>
              {artifacts.map((option) => (
                <button
                  key={option}
                  onClick={() => setArtifact(option)}
                  style={{
                    textAlign: 'left',
                    background: artifact === option ? withAlpha(tokens.gold, 0.14) : tokens.bg2,
                    color: artifact === option ? tokens.ink : tokens.dim,
                    border: `1px solid ${artifact === option ? tokens.gold : tokens.line}`,
                    borderRadius: 8,
                    padding: '10px 12px',
                    fontFamily: tokens.sans,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {option}
                </button>
              ))}
            </div>

            <FieldLabel tokens={tokens}>Audience</FieldLabel>
            <input
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
              style={inputStyle(tokens)}
              placeholder="e.g. VP Product, eng lead, CSM, customer admin..."
            />

            <FieldLabel tokens={tokens}>Situation</FieldLabel>
            <textarea
              value={situation}
              onChange={(event) => setSituation(event.target.value)}
              style={{ ...inputStyle(tokens), height: 150, resize: 'none', lineHeight: 1.55 }}
              placeholder="What happened, why it matters, known facts, deadline, and what makes the call tricky..."
            />

            <JudgmentFields value={judgment} onChange={setJudgment} tokens={tokens} />

            <button
              onClick={loadSample}
              style={{
                width: '100%',
                background: withAlpha(tokens.sky, 0.1),
                color: tokens.sky,
                border: `1px solid ${withAlpha(tokens.sky, 0.35)}`,
                borderRadius: 9,
                padding: '10px 12px',
                fontFamily: tokens.sans,
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                marginTop: 8,
              }}
            >
              USE SAMPLE CONTEXT
            </button>

            <ContextQuality review={contextReview} tokens={tokens} />
            <JudgmentQuality review={judgmentReview} tokens={tokens} />
          </div>

          <div style={{ background: tokens.bg2, border: `1px solid ${tokens.line}`, borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                padding: '12px 18px',
                borderBottom: `1px solid ${tokens.line}`,
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: tokens.mono,
                fontSize: 11,
                color: tokens.dim,
              }}
            >
              <span>{artifact.toLowerCase()} · draft</span>
              <span>
                <span style={{ color: words > liveScenario.wordLimit ? tokens.hot : tokens.ink, fontWeight: 700 }}>{words}</span>
                <span style={{ color: tokens.dimmer }}> / {liveScenario.wordLimit} words</span>
              </span>
            </div>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              style={{
                flex: 1,
                minHeight: 470,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                resize: 'vertical',
                color: tokens.ink,
                fontFamily: tokens.sans,
                fontSize: 15,
                lineHeight: 1.7,
                padding: 22,
                caretColor: tokens.gold,
              }}
              placeholder="Paste the draft you are about to send..."
            />
            <div style={{ padding: 14, borderTop: `1px solid ${tokens.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: tokens.mono, fontSize: 11, color: tokens.dim }}>
                {hitCount}/{checks.length} beats hit · +{projectedXp}xp projected
              </div>
              <button
                onClick={() => submitPracticeDraft(input)}
                disabled={draft.trim().length === 0}
                style={{
                  background: draft.trim().length > 0 ? tokens.gold : tokens.panel2,
                  color: draft.trim().length > 0 ? tokens.bg : tokens.dimmer,
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: 10,
                  fontFamily: tokens.sans,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: draft.trim().length > 0 ? 'pointer' : 'default',
                  boxShadow: draft.trim().length > 0 ? `0 8px 20px ${withAlpha(tokens.gold, 0.24)}` : 'none',
                }}
              >
                REVIEW DRAFT
              </button>
            </div>
          </div>

          <div style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.dim, letterSpacing: 1.5, marginBottom: 14 }}>
              LIVE RUBRIC · LOCAL PRINCIPLES
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: tokens.gold, letterSpacing: -1 }}>+{projectedXp}</div>
              <div style={{ fontSize: 12, color: tokens.dim, fontFamily: tokens.mono }}>xp</div>
            </div>
            {checks.map((check) => {
              const stateLabel = check.hit ? 'hit' : check.partial ? 'partial' : 'miss'
              const color = { hit: tokens.mint, partial: tokens.gold, miss: tokens.hot }[stateLabel]
              const shown = check.hit ? check.pts : check.partial ? Math.floor(check.pts / 2) : 0

              return (
                <div key={check.id} style={{ marginBottom: 13, fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ color: tokens.ink }}>
                      <span style={{ color }}>{stateLabel === 'hit' ? '✓' : stateLabel === 'partial' ? '◐' : '○'}</span> {check.label}
                    </span>
                    <span style={{ color, fontFamily: tokens.mono, fontWeight: 700, fontSize: 11 }}>{shown > 0 ? `+${shown}` : 'miss'}</span>
                  </div>
                  <div style={{ fontFamily: tokens.mono, fontSize: 10, color: tokens.gold, marginBottom: 4, letterSpacing: 0.5 }}>
                    {check.principleLabel ?? 'PM'} · {check.principleSource ?? 'local rubric'}
                  </div>
                  {!check.hit ? <div style={{ color: tokens.dim, fontSize: 11, lineHeight: 1.4 }}>{check.detail}</div> : null}
                </div>
              )
            })}
          </div>
        </div>
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

function ContextQuality({ review, tokens }: { review: ContextReview; tokens: Tokens }) {
  const color = review.confidence === 'strong' ? tokens.mint : review.confidence === 'usable' ? tokens.gold : tokens.hot

  return (
    <div
      style={{
        marginTop: 16,
        background: tokens.bg2,
        border: `1px solid ${withAlpha(color, 0.32)}`,
        borderRadius: 10,
        padding: 14,
      }}
    >
      <div style={{ fontSize: 10, fontFamily: tokens.mono, color, letterSpacing: 1.5, marginBottom: 8 }}>
        CONTEXT QUALITY · {review.score}/100
      </div>
      <div style={{ fontSize: 15, fontWeight: 800, color, marginBottom: 6 }}>{review.label}</div>
      <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.55 }}>{review.detail}</div>
      {review.missing.length > 0 ? (
        <div style={{ marginTop: 10, fontSize: 11, color: tokens.dimmer, lineHeight: 1.65 }}>
          Add: {review.missing.slice(0, 4).join(' · ')}
        </div>
      ) : null}
    </div>
  )
}

function JudgmentQuality({
  review,
  tokens,
}: {
  review: ReturnType<typeof evaluateJudgmentCheckpoint>
  tokens: Tokens
}) {
  const color = review.score >= 78 ? tokens.mint : review.score >= 48 ? tokens.gold : tokens.hot

  return (
    <div
      style={{
        marginTop: 12,
        background: tokens.bg2,
        border: `1px solid ${withAlpha(color, 0.32)}`,
        borderRadius: 10,
        padding: 14,
      }}
    >
      <div style={{ fontSize: 10, fontFamily: tokens.mono, color, letterSpacing: 1.5, marginBottom: 8 }}>
        PM CALL · {review.score}/100
      </div>
      <div style={{ fontSize: 15, fontWeight: 800, color, marginBottom: 6 }}>{review.label}</div>
      <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.55 }}>{review.detail}</div>
      {review.missing.length > 0 ? (
        <div style={{ marginTop: 10, fontSize: 11, color: tokens.dimmer, lineHeight: 1.65 }}>
          Add: {review.missing.slice(0, 4).join(' · ')}
        </div>
      ) : null}
    </div>
  )
}

function inputStyle(tokens: Tokens) {
  return {
    width: '100%',
    boxSizing: 'border-box' as const,
    background: tokens.bg2,
    color: tokens.ink,
    border: `1px solid ${tokens.line}`,
    borderRadius: 8,
    padding: '11px 12px',
    outline: 'none',
    fontFamily: tokens.sans,
    fontSize: 13,
    marginBottom: 4,
  }
}
