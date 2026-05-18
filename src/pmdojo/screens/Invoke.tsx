import { useState } from 'react'

import { Header, Chip } from '../components'
import { evaluatePracticeContext, type ContextReview } from '../context'
import { recommendInvoke, type InvokeInput, type InvokeSource } from '../invoke'
import { LENNY_DATASET, getLaneLennySources } from '../lenny'
import type { PracticeInput } from '../practice'
import { withAlpha } from '../tokens'
import type { JudgmentCheckpoint, Screen, Tokens } from '../types'

type InvokeProps = {
  nav: (screen: Screen) => void
  tokens: Tokens
  ambientGlow: boolean
  openLaneRound: (laneId: string) => void
  submitPracticeDraft: (input: PracticeInput) => void
}

const sources: InvokeSource[] = ['Slack thread', 'Exec review', 'PRD / spec', 'Customer note', 'Meeting follow-up']

const sampleMoment =
  'Support found that three renewal customers will see invoice deltas they cannot explain. The launch note is drafted, but sending it now may create a billing-trust issue.'

const sampleDraft = `Rec: pause the launch note until Friday and send the corrected billing explanation first.

Why: Support cannot yet explain the invoice delta, and three renewal customers are affected.

Tradeoff: we lose one launch week, but avoid a customer note we may need to unwind.

Need @maya to approve the customer note by EOD and @devon to confirm the impacted list by 3pm.`

const sampleJudgment: JudgmentCheckpoint = {
  recommendation: 'Pause the launch note until Friday and send the corrected billing explanation first.',
  nonGoals: 'Do not send the current launch note or imply the invoice deltas are understood yet.',
  evidence: 'Support cannot explain the invoice delta, and three renewal customers are affected.',
  tradeoff: 'We lose one launch week, but avoid a customer note we may need to unwind.',
  ask: '@maya approves the customer note by EOD; @devon confirms the impacted list by 3pm.',
  changeMind: 'If Support can explain the deltas and Billing confirms the note is accurate, ship the launch note.',
}

export function InvokeScreen({ nav, tokens, ambientGlow, openLaneRound, submitPracticeDraft }: InvokeProps) {
  const [source, setSource] = useState<InvokeSource>('Slack thread')
  const [audience, setAudience] = useState('')
  const [moment, setMoment] = useState('')
  const [draft, setDraft] = useState('')
  const [noDraftYet, setNoDraftYet] = useState(false)
  const [recommendationText, setRecommendationText] = useState('')
  const [evidence, setEvidence] = useState('')
  const [tradeoff, setTradeoff] = useState('')
  const [ask, setAsk] = useState('')
  const [nonGoals, setNonGoals] = useState('')
  const [changeMind, setChangeMind] = useState('')
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [showDraftWarning, setShowDraftWarning] = useState(false)

  const judgment: JudgmentCheckpoint = {
    recommendation: recommendationText,
    nonGoals,
    evidence,
    tradeoff,
    ask,
    changeMind,
  }
  const input: InvokeInput = { source, audience, moment, draft }
  const recommendation = recommendInvoke(input)
  const contextReview = evaluatePracticeContext({
    artifact: recommendation.artifact,
    audience,
    situation: moment,
    draft: noDraftYet ? 'No draft yet. User is asking for a practice rep before writing.' : draft,
    judgment,
  })
  const hasDraft = draft.trim().length > 0
  const recommendedSources = getLaneLennySources(recommendation.laneId).slice(0, 2)

  const loadSample = () => {
    setSource('Slack thread')
    setAudience('VP Product, support lead, eng owner')
    setMoment(sampleMoment)
    setRecommendationText(sampleJudgment.recommendation)
    setEvidence(sampleJudgment.evidence)
    setTradeoff(sampleJudgment.tradeoff)
    setAsk(sampleJudgment.ask)
    setNonGoals(sampleJudgment.nonGoals)
    setChangeMind(sampleJudgment.changeMind)
    setDraft(sampleDraft)
    setNoDraftYet(false)
    setAdvancedOpen(true)
    setShowDraftWarning(false)
  }

  const runLane = () => {
    if (recommendation.laneId === '00') {
      nav('lanes')
      return
    }

    openLaneRound(recommendation.laneId)
  }

  const reviewBeforeSend = () => {
    setShowDraftWarning(false)

    if (noDraftYet) {
      runLane()
      return
    }

    if (!hasDraft) {
      setShowDraftWarning(true)
      return
    }

    submitPracticeDraft({
      artifact: recommendation.artifact,
      audience,
      situation: moment,
      draft,
      judgment,
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
        <>
          <div
            style={{
              position: 'absolute',
              top: -220,
              left: -180,
              width: 620,
              height: 620,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(94,242,176,.14), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: -240,
              bottom: -260,
              width: 680,
              height: 680,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,197,58,.12), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        </>
      ) : null}

      <Header nav={nav} tokens={tokens} active="invoke" />

      <div style={{ position: 'relative', maxWidth: 1320, margin: '0 auto', padding: '38px 48px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 38, fontWeight: 850, letterSpacing: -1, marginBottom: 8 }}>Review before send</div>
            <div style={{ fontSize: 15, color: tokens.dim, lineHeight: 1.6, maxWidth: 760 }}>
              Paste the thing you are about to send. PM Dojo checks whether the PM call is clear, evidence-backed, and
              ready for this reader, using Lenny-derived PM judgment principles.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Chip tokens={tokens} color={tokens.mint}>
              Lenny archive
            </Chip>
            <Chip tokens={tokens} color={tokens.gold}>
              real work first
            </Chip>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 18, alignItems: 'start' }}>
          <div style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: 22, borderBottom: `1px solid ${tokens.line}` }}>
              <StepHeader step="1" title="What are you about to send?" tokens={tokens} />
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14, marginTop: 14 }}>
                <div>
                  <FieldLabel tokens={tokens}>Artifact</FieldLabel>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {sources.map((option) => (
                      <button
                        key={option}
                        onClick={() => setSource(option)}
                        style={{
                          background: source === option ? withAlpha(tokens.gold, 0.16) : tokens.bg2,
                          color: source === option ? tokens.ink : tokens.dim,
                          border: `1px solid ${source === option ? tokens.gold : tokens.line}`,
                          borderRadius: 999,
                          padding: '9px 12px',
                          fontFamily: tokens.sans,
                          fontSize: 12,
                          fontWeight: source === option ? 800 : 600,
                          cursor: 'pointer',
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <FieldLabel tokens={tokens}>Audience</FieldLabel>
                  <input
                    value={audience}
                    onChange={(event) => setAudience(event.target.value)}
                    style={inputStyle(tokens)}
                    placeholder="Who needs to decide or act?"
                  />
                </div>
              </div>
            </div>

            <div style={{ padding: 22, borderBottom: `1px solid ${tokens.line}` }}>
              <StepHeader step="2" title="Paste the context" tokens={tokens} />
              <textarea
                value={moment}
                onChange={(event) => setMoment(event.target.value)}
                placeholder="What happened? Why does it matter? What are the stakes, facts, constraints, and timing?"
                style={textAreaStyle(tokens, 150)}
              />
            </div>

            <div style={{ padding: 22, borderBottom: `1px solid ${tokens.line}` }}>
              <StepHeader step="3" title="Paste your draft" tokens={tokens} />
              <textarea
                value={draft}
                disabled={noDraftYet}
                onChange={(event) => {
                  setDraft(event.target.value)
                  setShowDraftWarning(false)
                }}
                placeholder="Paste the Slack reply, exec memo section, PRD paragraph, customer note, or meeting follow-up..."
                style={{
                  ...textAreaStyle(tokens, 190),
                  opacity: noDraftYet ? 0.45 : 1,
                  cursor: noDraftYet ? 'not-allowed' : 'text',
                }}
              />
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  marginTop: 12,
                  color: tokens.dim,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                <input
                  checked={noDraftYet}
                  onChange={(event) => {
                    setNoDraftYet(event.target.checked)
                    setShowDraftWarning(false)
                  }}
                  type="checkbox"
                />
                I do not have a draft yet. Help me practice this situation instead.
              </label>
            </div>

            <div style={{ padding: 22, borderBottom: `1px solid ${tokens.line}` }}>
              <StepHeader step="4" title="State your PM call" tokens={tokens} />
              <textarea
                value={recommendationText}
                onChange={(event) => setRecommendationText(event.target.value)}
                placeholder="What are you recommending or asking for?"
                style={textAreaStyle(tokens, 82)}
              />
              <button
                onClick={() => setAdvancedOpen((current) => !current)}
                style={{
                  marginTop: 12,
                  background: 'transparent',
                  color: tokens.gold,
                  border: 'none',
                  padding: 0,
                  fontFamily: tokens.mono,
                  fontSize: 11,
                  letterSpacing: 0.7,
                  cursor: 'pointer',
                }}
              >
                {advancedOpen ? 'HIDE DETAIL' : 'ADD EVIDENCE / TRADEOFF / ASK'}
              </button>
              {advancedOpen ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, marginTop: 14 }}>
                  <MiniTextArea label="Evidence" value={evidence} onChange={setEvidence} placeholder="What fact makes this call reasonable?" tokens={tokens} />
                  <MiniTextArea label="Tradeoff" value={tradeoff} onChange={setTradeoff} placeholder="What cost or risk are you accepting?" tokens={tokens} />
                  <MiniTextArea label="Ask" value={ask} onChange={setAsk} placeholder="Who needs to decide or act by when?" tokens={tokens} />
                  <MiniTextArea label="Not doing" value={nonGoals} onChange={setNonGoals} placeholder="What are you not promising?" tokens={tokens} />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <MiniTextArea
                      label="Change mind"
                      value={changeMind}
                      onChange={setChangeMind}
                      placeholder="What would change the call?"
                      tokens={tokens}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div
              style={{
                padding: 22,
                background: tokens.bg2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 18,
              }}
            >
              <div style={{ minHeight: 36 }}>
                {showDraftWarning ? (
                  <div style={{ color: tokens.hot, fontSize: 13, lineHeight: 1.5 }}>
                    Paste the draft, or select "I do not have a draft yet" to practice the matching situation.
                  </div>
                ) : (
                  <div style={{ color: tokens.dim, fontSize: 13, lineHeight: 1.5 }}>
                    After review, you will get PM-call confidence, writing quality, missing context, and a senior PM rewrite.
                  </div>
                )}
                <button
                  onClick={loadSample}
                  style={{
                    marginTop: 8,
                    background: 'transparent',
                    color: tokens.sky,
                    border: 'none',
                    padding: 0,
                    fontFamily: tokens.mono,
                    fontSize: 10,
                    letterSpacing: 0.8,
                    cursor: 'pointer',
                  }}
                >
                  USE EXAMPLE
                </button>
              </div>
              <button
                onClick={reviewBeforeSend}
                style={{
                  background: tokens.gold,
                  color: tokens.bg,
                  border: 'none',
                  padding: '15px 26px',
                  borderRadius: 12,
                  fontFamily: tokens.sans,
                  fontSize: 14,
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: `0 10px 24px ${withAlpha(tokens.gold, 0.25)}`,
                  whiteSpace: 'nowrap',
                }}
              >
                {noDraftYet ? 'START MATCHING PRACTICE' : 'REVIEW BEFORE SEND'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            <ReadinessCard review={contextReview} tokens={tokens} />
            <div style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.gold, letterSpacing: 1.5, marginBottom: 10 }}>
                SOURCE BOUNDARY
              </div>
              <div style={{ fontSize: 13, color: tokens.dim, lineHeight: 1.55 }}>
                This review mode uses only {LENNY_DATASET.label} principles. Your private draft is not part of the
                dataset; it is checked against the local rubric.
              </div>
            </div>
            <div style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.mint, letterSpacing: 1.5, marginBottom: 12 }}>
                WHAT PM DOJO WILL CHECK
              </div>
              {[
                'Is the recommendation visible?',
                'Is the evidence concrete enough?',
                'Is the tradeoff named?',
                'Does the reader know what to do next?',
              ].map((item) => (
                <div key={item} style={{ fontSize: 13, color: tokens.dim, lineHeight: 1.55, marginBottom: 8 }}>
                  <span style={{ color: tokens.mint }}>-</span> {item}
                </div>
              ))}
            </div>
            <div style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 11, fontFamily: tokens.mono, color: laneColor(recommendation.laneId, tokens), letterSpacing: 1.5, marginBottom: 10 }}>
                {recommendation.laneId === '00' ? 'NO MATCHING LANE YET' : 'PRACTICE INSTEAD'}
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.3, marginBottom: 7 }}>{recommendation.laneTitle}</div>
              <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.55, marginBottom: 14 }}>{recommendation.why}</div>
              {recommendedSources.length > 0 ? (
                <div style={{ display: 'grid', gap: 6, marginBottom: 14 }}>
                  {recommendedSources.map((source) => (
                    <div key={source.id} style={{ fontSize: 11, color: tokens.dim, lineHeight: 1.4 }}>
                      <span style={{ color: tokens.mint, fontFamily: tokens.mono }}>{source.kind.toUpperCase()}</span> · {source.title}
                    </div>
                  ))}
                </div>
              ) : null}
              <button
                onClick={runLane}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: tokens.ink,
                  border: `1px solid ${tokens.lineStrong}`,
                  padding: '11px 14px',
                  borderRadius: 10,
                  fontFamily: tokens.sans,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {recommendation.laneId === '00' ? 'OPEN TRAIN' : 'PRACTICE THIS SITUATION'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function laneColor(laneId: string, tokens: Tokens) {
  if (laneId === '01') return tokens.hot
  if (laneId === '02') return tokens.gold
  if (laneId === '03') return tokens.sky
  if (laneId === '04') return tokens.orchid
  return tokens.mint
}

function StepHeader({ step, title, tokens }: { step: string; title: string; tokens: Tokens }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 999,
          background: withAlpha(tokens.gold, 0.16),
          color: tokens.gold,
          display: 'grid',
          placeItems: 'center',
          fontFamily: tokens.mono,
          fontSize: 11,
          fontWeight: 900,
        }}
      >
        {step}
      </div>
      <div style={{ fontSize: 16, fontWeight: 850, letterSpacing: -0.2 }}>{title}</div>
    </div>
  )
}

function FieldLabel({ children, tokens }: { children: string; tokens: Tokens }) {
  return (
    <div style={{ fontSize: 10, fontFamily: tokens.mono, color: tokens.dimmer, letterSpacing: 1.3, marginBottom: 8 }}>
      {children.toUpperCase()}
    </div>
  )
}

function ReadinessCard({ review, tokens }: { review: ContextReview; tokens: Tokens }) {
  const color = review.confidence === 'strong' ? tokens.mint : review.confidence === 'usable' ? tokens.gold : tokens.hot
  const title = review.confidence === 'strong' ? 'Ready to review' : review.confidence === 'usable' ? 'Reviewable, with caveats' : 'Needs more context'

  return (
    <div style={{ background: tokens.panel, border: `1px solid ${withAlpha(color, 0.34)}`, borderRadius: 14, padding: 18 }}>
      <div style={{ fontSize: 11, fontFamily: tokens.mono, color, letterSpacing: 1.5, marginBottom: 10 }}>
        READINESS · {review.score}/100
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, color, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: tokens.dim, lineHeight: 1.55 }}>{review.detail}</div>
      {review.missing.length > 0 ? (
        <div style={{ marginTop: 12, fontSize: 12, color: tokens.dimmer, lineHeight: 1.7 }}>
          Add: {review.missing.slice(0, 5).join(' · ')}
        </div>
      ) : null}
    </div>
  )
}

function MiniTextArea({
  label,
  value,
  onChange,
  placeholder,
  tokens,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  tokens: Tokens
}) {
  return (
    <div>
      <FieldLabel tokens={tokens}>{label}</FieldLabel>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} style={textAreaStyle(tokens, 74)} />
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
    borderRadius: 10,
    padding: '11px 12px',
    outline: 'none',
    fontFamily: tokens.sans,
    fontSize: 13,
  }
}

function textAreaStyle(tokens: Tokens, height: number) {
  return {
    width: '100%',
    height,
    boxSizing: 'border-box' as const,
    background: tokens.bg2,
    color: tokens.ink,
    border: `1px solid ${tokens.line}`,
    borderRadius: 10,
    outline: 'none',
    resize: 'vertical' as const,
    fontFamily: tokens.sans,
    fontSize: 14,
    lineHeight: 1.6,
    padding: 13,
    marginTop: 14,
    caretColor: tokens.gold,
  }
}
