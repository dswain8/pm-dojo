import type { ReactNode } from 'react'

import { Header } from '../components'
import { BUILDATHON_DEMO_INPUT, BUILDATHON_DEMO_REWRITE_PREVIEW, BUILDATHON_DEMO_SOURCE_IDS } from '../demo'
import { LENNY_DATASET, getLennySourceRefs } from '../lenny'
import { DOJO_PRINCIPLES } from '../principles'
import { withAlpha } from '../tokens'
import type { Screen, Tokens } from '../types'

type DemoProps = {
  nav: (screen: Screen) => void
  tokens: Tokens
  ambientGlow: boolean
  runDemoReview: () => void
}

const sourceRefs = getLennySourceRefs(BUILDATHON_DEMO_SOURCE_IDS)
const shownPrinciples = DOJO_PRINCIPLES.filter((principle) =>
  ['front-load', 'recommendation', 'tradeoff', 'ask', 'evidence'].includes(principle.id),
)

export function DemoScreen({ nav, tokens, ambientGlow, runDemoReview }: DemoProps) {
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
              top: -240,
              left: -220,
              width: 620,
              height: 620,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,197,58,.14), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: -220,
              bottom: -260,
              width: 680,
              height: 680,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(94,242,176,.12), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        </>
      ) : null}

      <Header nav={nav} tokens={tokens} active="manual" />

      <main style={{ position: 'relative', maxWidth: 1360, margin: '0 auto', padding: '42px 48px 70px' }}>
        <section style={{ display: 'grid', gridTemplateColumns: '1.08fr 420px', gap: 28, alignItems: 'stretch', marginBottom: 24 }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${withAlpha(tokens.gold, 0.16)}, ${tokens.panel} 62%)`,
              border: `1px solid ${tokens.lineStrong}`,
              borderRadius: 20,
              padding: 30,
              boxShadow: '0 24px 70px rgba(0,0,0,.24)',
            }}
          >
            <div style={{ fontFamily: tokens.mono, fontSize: 11, color: tokens.gold, letterSpacing: 2, marginBottom: 16 }}>
              BUILDATHON DEMO MODE
            </div>
            <h1 style={{ margin: 0, fontSize: 58, lineHeight: 0.98, letterSpacing: -2.1, maxWidth: 760 }}>
              From Lenny's archive to PM judgment reps.
            </h1>
            <p style={{ fontSize: 16, color: tokens.dim, lineHeight: 1.65, maxWidth: 760, margin: '22px 0 0' }}>
              This is the judge path. It shows how {LENNY_DATASET.label} becomes source-linked principles, a realistic PM
              moment, a deterministic critique, and a revised artifact.
            </p>
            <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginTop: 24 }}>
              <DemoChip label="creative dataset use" color={tokens.gold} tokens={tokens} />
              <DemoChip label="real PM usefulness" color={tokens.mint} tokens={tokens} />
              <DemoChip label="working local app" color={tokens.sky} tokens={tokens} />
            </div>
          </div>

          <div style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 20, padding: 24 }}>
            <div style={{ fontFamily: tokens.mono, fontSize: 11, color: tokens.mint, letterSpacing: 2, marginBottom: 14 }}>
              60-SECOND JUDGE SCRIPT
            </div>
            <JudgeStep step="1" title="Point to the source" body="Newsletter and podcast ideas are mapped to each principle and lane." tokens={tokens} />
            <JudgeStep step="2" title="Show the rep" body="A messy PM situation becomes an artifact-shaped exercise." tokens={tokens} />
            <JudgeStep step="3" title="Run critique" body="The app separates PM call, evidence, tradeoff, ask, and writing quality." tokens={tokens} />
            <button
              onClick={runDemoReview}
              style={{
                width: '100%',
                background: tokens.gold,
                color: tokens.bg,
                border: 'none',
                borderRadius: 12,
                padding: '15px 16px',
                marginTop: 18,
                fontFamily: tokens.sans,
                fontSize: 14,
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: `0 10px 26px ${withAlpha(tokens.gold, 0.26)}`,
              }}
            >
              RUN DEMO CRITIQUE
            </button>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          <DemoPanel eyebrow="1 · SOURCE" title="Lenny material used" tokens={tokens} color={tokens.gold}>
            <div style={{ display: 'grid', gap: 10 }}>
              {sourceRefs.map((source) => (
                <SourceRow key={source.id} title={source.title} detail={`${source.kind} · ${source.takeaway}`} tokens={tokens} />
              ))}
            </div>
          </DemoPanel>

          <DemoPanel eyebrow="2 · PRINCIPLES" title="Distilled into checks" tokens={tokens} color={tokens.mint}>
            <div style={{ display: 'grid', gap: 8 }}>
              {shownPrinciples.map((principle) => (
                <div key={principle.id} style={{ background: tokens.bg2, border: `1px solid ${tokens.line}`, borderRadius: 9, padding: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 850, marginBottom: 4 }}>{principle.label}</div>
                  <div style={{ fontSize: 11, color: tokens.dim, lineHeight: 1.45 }}>{principle.scoringQuestion}</div>
                </div>
              ))}
            </div>
          </DemoPanel>

          <DemoPanel eyebrow="3 · REP" title="Turned into live work" tokens={tokens} color={tokens.sky}>
            <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.6, marginBottom: 12 }}>{BUILDATHON_DEMO_INPUT.situation}</div>
            <div style={{ background: tokens.bg2, border: `1px solid ${tokens.line}`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontFamily: tokens.mono, fontSize: 10, color: tokens.dimmer, letterSpacing: 1, marginBottom: 8 }}>
                USER DRAFT
              </div>
              <div style={{ fontSize: 12, color: tokens.ink, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{BUILDATHON_DEMO_INPUT.draft}</div>
            </div>
          </DemoPanel>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 16 }}>
          <DemoPanel eyebrow="4 · OUTPUT" title="Critique becomes a rewrite" tokens={tokens} color={tokens.orchid}>
            <div style={{ fontSize: 13, color: tokens.dim, lineHeight: 1.6, marginBottom: 12 }}>
              The actual critique screen shows what landed, what missed, source lineage, and a copyable revised draft.
            </div>
            <div style={{ background: tokens.bg2, border: `1px solid ${tokens.line}`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontFamily: tokens.mono, fontSize: 10, color: tokens.dimmer, letterSpacing: 1, marginBottom: 8 }}>
                REWRITE PREVIEW
              </div>
              <div style={{ fontSize: 12, color: tokens.ink, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {BUILDATHON_DEMO_REWRITE_PREVIEW}
              </div>
            </div>
          </DemoPanel>

          <DemoPanel eyebrow="BUILDATHON READINESS" title="Why this is not just a chatbot" tokens={tokens} color={tokens.mint}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <ScoreBox
                title="Creative use"
                body="Archive content becomes exercises, rubrics, and rewrite logic instead of another search surface."
                tokens={tokens}
              />
              <ScoreBox
                title="Useful"
                body="The main loop fits real PM work: preflight a Slack post, memo, PRD section, or customer note."
                tokens={tokens}
              />
              <ScoreBox
                title="Polished"
                body="Local persistence, training lanes, source lineage, critique output, tests, and Replit wiring are in place."
                tokens={tokens}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
              <button onClick={() => nav('invoke')} style={secondaryButton(tokens)}>
                REVIEW REAL WORK
              </button>
              <button onClick={() => nav('lanes')} style={secondaryButton(tokens)}>
                TRAIN A LANE
              </button>
              <button onClick={() => nav('manual')} style={secondaryButton(tokens)}>
                SOURCE MANUAL
              </button>
            </div>
          </DemoPanel>
        </section>
      </main>
    </div>
  )
}

function JudgeStep({ step, title, body, tokens }: { step: string; title: string; body: string; tokens: Tokens }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 11, padding: '12px 0', borderBottom: `1px solid ${tokens.line}` }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          display: 'grid',
          placeItems: 'center',
          background: withAlpha(tokens.gold, 0.14),
          color: tokens.gold,
          fontFamily: tokens.mono,
          fontSize: 11,
          fontWeight: 900,
        }}
      >
        {step}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 850, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.5 }}>{body}</div>
      </div>
    </div>
  )
}

function DemoPanel({
  eyebrow,
  title,
  tokens,
  color,
  children,
}: {
  eyebrow: string
  title: string
  tokens: Tokens
  color: string
  children: ReactNode
}) {
  return (
    <section style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderTop: `3px solid ${color}`, borderRadius: 16, padding: 20 }}>
      <div style={{ fontFamily: tokens.mono, fontSize: 10, color, letterSpacing: 1.8, marginBottom: 10 }}>{eyebrow}</div>
      <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.4, marginBottom: 14 }}>{title}</div>
      {children}
    </section>
  )
}

function SourceRow({ title, detail, tokens }: { title: string; detail: string; tokens: Tokens }) {
  return (
    <div style={{ background: tokens.bg2, border: `1px solid ${tokens.line}`, borderRadius: 10, padding: 11 }}>
      <div style={{ fontSize: 13, fontWeight: 850, marginBottom: 5 }}>{title}</div>
      <div style={{ fontSize: 11, color: tokens.dim, lineHeight: 1.45 }}>{detail}</div>
    </div>
  )
}

function DemoChip({ label, color, tokens }: { label: string; color: string; tokens: Tokens }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        color,
        border: `1px solid ${withAlpha(color, 0.36)}`,
        background: withAlpha(color, 0.08),
        borderRadius: 999,
        padding: '6px 9px',
        fontFamily: tokens.mono,
        fontSize: 10,
        letterSpacing: 0.8,
      }}
    >
      {label}
    </span>
  )
}

function ScoreBox({ title, body, tokens }: { title: string; body: string; tokens: Tokens }) {
  return (
    <div style={{ background: tokens.bg2, border: `1px solid ${tokens.line}`, borderRadius: 10, padding: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 850, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.5 }}>{body}</div>
    </div>
  )
}

function secondaryButton(tokens: Tokens) {
  return {
    background: 'transparent',
    color: tokens.ink,
    border: `1px solid ${tokens.lineStrong}`,
    padding: '10px 13px',
    borderRadius: 10,
    fontFamily: tokens.sans,
    fontSize: 12,
    fontWeight: 850,
    cursor: 'pointer',
  }
}
