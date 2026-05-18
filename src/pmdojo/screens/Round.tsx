import { useDeferredValue, useEffect, useState, type Dispatch, type SetStateAction } from 'react'

import { Chip, Logo, PhasePip, TimerRing } from '../components'
import { getLaneLennySources } from '../lenny'
import { countWords, createRunRecord, evaluateDraft } from '../rubric'
import { withAlpha } from '../tokens'
import type { AppState, Scenario, Screen, Tokens } from '../types'

type RoundProps = {
  nav: (screen: Screen) => void
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
  tokens: Tokens
  initialDraft: string
  scenario: Scenario
}

export function RoundScreen({ nav, state, setState, tokens, initialDraft, scenario }: RoundProps) {
  const [draft, setDraft] = useState(initialDraft)
  const [sec, setSec] = useState(480)
  const deferredDraft = useDeferredValue(draft)
  const evaluation = evaluateDraft(scenario, deferredDraft)
  const checks = evaluation.checks
  const hitCount = checks.filter((check) => check.hit).length
  const projectedXp = evaluation.xp
  const words = countWords(draft)
  const overLimit = words > scenario.wordLimit
  const canSubmit = draft.trim().length > 0
  const diffColor = scenario.diff === 'BOSS' ? tokens.hot : scenario.diff === 'HARD' ? tokens.gold : tokens.sky
  const lennySources = getLaneLennySources(scenario.laneId).slice(0, 3)

  useEffect(() => {
    setDraft(initialDraft)
    setSec(480)
  }, [initialDraft, scenario.id])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSec((current) => Math.max(0, current - 1))
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const submit = () => {
    if (!canSubmit) {
      return
    }

    setState((current) => ({
      ...current,
      lastRun: createRunRecord(scenario, draft, sec, new Date().toISOString()),
    }))
    nav('critique')
  }

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        background: tokens.bg,
        color: tokens.ink,
        fontFamily: tokens.sans,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 28px',
          borderBottom: `1px solid ${tokens.line}`,
          background: tokens.bg,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => nav('landing')}
            style={{
              background: 'transparent',
              border: `1px solid ${tokens.line}`,
              color: tokens.dim,
              padding: '6px 10px',
              borderRadius: 8,
              fontFamily: tokens.mono,
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            ← exit
          </button>
          <Logo size={26} tokens={tokens} />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>
            ROUND {String(state.stats.rounds + 1).padStart(3, '0')}
          </span>
          <span style={{ fontSize: 11, color: tokens.dim, fontFamily: tokens.mono, letterSpacing: 1 }}>
            · {scenario.code} · {scenario.title.toUpperCase()}
          </span>
          <Chip color={diffColor} tokens={tokens}>
            ● {scenario.diff}
          </Chip>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <TimerRing sec={sec} total={480} size={46} tokens={tokens} />
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              ['BRIEF', 'done'],
              ['WRITE', 'active'],
              ['CRIT', 'pending'],
              ['RWR', 'pending'],
              ['CMP', 'pending'],
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
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr 320px', flex: 1, minHeight: 0 }}>
        <div
          style={{
            padding: 20,
            borderRight: `1px solid ${tokens.line}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            overflow: 'auto',
          }}
        >
          <div
            style={{
              background: tokens.panel,
              border: `1px solid ${tokens.line}`,
              borderTop: `3px solid ${scenario.rail}`,
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div style={{ fontFamily: tokens.mono, fontSize: 10, color: scenario.rail, letterSpacing: 2, marginBottom: 10 }}>
              ● {scenario.pressure}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: tokens.ink, marginBottom: 12 }}>{scenario.brief}</div>
            <div
              style={{
                fontSize: 12,
                color: tokens.dim,
                lineHeight: 1.6,
                paddingTop: 12,
                borderTop: `1px solid ${tokens.line}`,
                fontStyle: 'italic',
              }}
            >
              {scenario.quote}
              <div style={{ color: tokens.dimmer, fontSize: 11, marginTop: 4, fontStyle: 'normal' }}>
                — {scenario.quoteAttribution}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.dim, letterSpacing: 1.5, marginTop: 4 }}>
            CUES
          </div>
          <div
            style={{
              background: tokens.bg2,
              border: `1px solid ${tokens.line}`,
              borderRadius: 10,
              padding: 14,
              fontSize: 12,
              color: tokens.ink,
              lineHeight: 1.85,
            }}
          >
            {scenario.cues.map((cue) => (
              <div key={cue.text}>
                <span style={{ color: tokens[cue.color] }}>●</span> {cue.text}
              </div>
            ))}
          </div>

          <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.dim, letterSpacing: 1.5 }}>OBJECTIVE</div>
          <div style={{ background: tokens.bg2, border: `1px solid ${tokens.line}`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{scenario.objectiveTitle}</div>
            <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.55, marginBottom: 12 }}>{scenario.objectiveCopy}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {scenario.chips.map((chip) => (
                <Chip key={chip} tokens={tokens}>
                  {chip}
                </Chip>
              ))}
            </div>
          </div>

          <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.dim, letterSpacing: 1.5 }}>LENNY SOURCES</div>
          <div style={{ background: tokens.bg2, border: `1px solid ${withAlpha(tokens.mint, 0.22)}`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.55, marginBottom: 10 }}>
              This rep is scored against principles derived from Lenny's newsletter and podcast archive.
            </div>
            <div style={{ display: 'grid', gap: 9 }}>
              {lennySources.map((source) => (
                <div key={source.id}>
                  <div style={{ fontSize: 12, color: tokens.ink, lineHeight: 1.35 }}>{source.title}</div>
                  <div style={{ fontFamily: tokens.mono, fontSize: 9, color: tokens.dimmer, marginTop: 3 }}>
                    {source.kind.toUpperCase()} · {source.topicFile}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div
            style={{
              padding: '10px 26px',
              borderBottom: `1px solid ${tokens.line}`,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              fontFamily: tokens.mono,
              color: tokens.dim,
            }}
          >
            <span>{scenario.channelLabel}</span>
            <span>
              <span style={{ color: overLimit ? tokens.hot : tokens.ink, fontWeight: 700 }}>{words}</span>
              <span style={{ color: tokens.dimmer }}> / {scenario.wordLimit} words</span>
            </span>
          </div>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                event.preventDefault()
                submit()
              }
            }}
            placeholder={`Start blank. Write the ${scenario.objectiveTitle.toLowerCase()} you would actually send...`}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              color: tokens.ink,
              fontFamily: tokens.sans,
              fontSize: 15,
              lineHeight: 1.75,
              padding: '24px 28px',
              caretColor: tokens.gold,
            }}
          />
          <div
            style={{
              padding: '12px 26px',
              borderTop: `1px solid ${tokens.line}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: 11, color: tokens.dim, fontFamily: tokens.mono }}>
              <span style={{ color: tokens.mint }}>●</span> blank by design · starter optional
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setDraft(scenario.defaultDraft)}
                style={{
                  background: withAlpha(tokens.sky, 0.1),
                  color: tokens.sky,
                  border: `1px solid ${withAlpha(tokens.sky, 0.35)}`,
                  padding: '10px 14px',
                  fontSize: 12,
                  borderRadius: 10,
                  fontFamily: tokens.sans,
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                USE STARTER DRAFT
              </button>
              <button
                onClick={() => nav('landing')}
                style={{
                  background: 'transparent',
                  color: tokens.dim,
                  border: `1px solid ${tokens.line}`,
                  padding: '10px 16px',
                  fontSize: 12,
                  borderRadius: 10,
                  fontFamily: tokens.sans,
                  cursor: 'pointer',
                }}
              >
                SAVE & EXIT
              </button>
              <button
                data-submit
                onClick={submit}
                disabled={!canSubmit}
                style={{
                  background: canSubmit ? tokens.gold : tokens.panel2,
                  color: canSubmit ? tokens.bg : tokens.dimmer,
                  border: 'none',
                  padding: '10px 22px',
                  fontSize: 13,
                  fontWeight: 800,
                  borderRadius: 10,
                  fontFamily: tokens.sans,
                  cursor: canSubmit ? 'pointer' : 'default',
                  boxShadow: canSubmit ? `0 6px 16px ${withAlpha(tokens.gold, 0.3)}` : 'none',
                  letterSpacing: 0.3,
                }}
              >
                SUBMIT &nbsp;⌘↵
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: 20, borderLeft: `1px solid ${tokens.line}`, overflow: 'auto', background: tokens.bg2 }}>
          <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.dim, letterSpacing: 2, marginBottom: 14 }}>
            LIVE SCORE
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
            <div
              style={{
                fontSize: 44,
                fontWeight: 900,
                color: tokens.gold,
                letterSpacing: -1,
                lineHeight: 1,
                transition: 'color .2s',
              }}
            >
              +{projectedXp}
            </div>
            <div style={{ fontSize: 12, color: tokens.dim, fontFamily: tokens.mono }}>xp projected</div>
          </div>
          <div style={{ fontSize: 11, color: tokens.dimmer, marginBottom: 18, fontFamily: tokens.mono }}>
            {hitCount} / {checks.length} beats hit · Lenny-derived local score
          </div>
          {checks.map((check) => {
            const stateLabel = check.hit ? 'hit' : check.partial ? 'partial' : 'miss'
            const color = { hit: tokens.mint, partial: tokens.gold, miss: tokens.hot }[stateLabel]
            const shown = check.hit ? check.pts : check.partial ? Math.floor(check.pts / 2) : 0

            return (
              <div
                key={check.id}
                style={{
                  marginBottom: 14,
                  fontSize: 12,
                  padding: 10,
                  borderRadius: 8,
                  background: check.hit ? 'rgba(94,242,176,.04)' : 'transparent',
                  border: `1px solid ${check.hit ? 'rgba(94,242,176,.12)' : 'transparent'}`,
                  transition: 'all .2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ color: tokens.ink, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color }}>
                      {stateLabel === 'hit' ? '✓' : stateLabel === 'partial' ? '◐' : '○'}
                    </span>
                    {check.label}
                  </span>
                  <span style={{ color, fontFamily: tokens.mono, fontWeight: 700, fontSize: 11 }}>
                    {shown > 0 ? `+${shown}` : stateLabel === 'miss' ? 'miss' : '—'}
                  </span>
                </div>
                <div style={{ fontFamily: tokens.mono, fontSize: 10, color: tokens.gold, marginBottom: 6, letterSpacing: 0.5 }}>
                  {check.principleLabel ?? 'PM'} · {check.principleSource ?? 'local rubric'}
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(shown / check.pts) * 100}%`,
                      background: color,
                      transition: 'width .3s',
                    }}
                  />
                </div>
                {!check.hit ? (
                  <div style={{ fontSize: 11, color: tokens.dim, marginTop: 5, lineHeight: 1.4 }}>{check.detail}</div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
