import { Header, NavHintKeys } from '../components'
import { LENNY_DATASET } from '../lenny'
import { withAlpha } from '../tokens'
import type { Screen, Tokens } from '../types'

type LandingProps = {
  nav: (screen: Screen) => void
  tokens: Tokens
  ambientGlow: boolean
}

export function LandingScreen({ nav, tokens, ambientGlow }: LandingProps) {
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
              right: -240,
              width: 640,
              height: 640,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,197,58,.16), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -260,
              left: -180,
              width: 520,
              height: 520,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(94,242,176,.12), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        </>
      ) : null}

      <Header nav={nav} tokens={tokens} active="home" />

      <main
        style={{
          position: 'relative',
          padding: '40px 48px 60px',
          maxWidth: 1440,
          margin: '0 auto',
        }}
      >
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.08fr) 420px',
            gap: 52,
            alignItems: 'center',
            minHeight: 'calc(100vh - 210px)',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: `1px solid ${withAlpha(tokens.gold, 0.34)}`,
                background: withAlpha(tokens.gold, 0.08),
                color: tokens.gold,
                borderRadius: 999,
                padding: '7px 11px',
                fontFamily: tokens.mono,
                fontSize: 10,
                fontWeight: 850,
                letterSpacing: 1.2,
                marginBottom: 22,
              }}
            >
              LENNY DATASET BUILD
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 78,
                fontWeight: 900,
                letterSpacing: -3,
                lineHeight: 0.94,
                maxWidth: 760,
              }}
            >
              Review real work before you send.
            </h1>
            <p style={{ fontSize: 17, color: tokens.dim, maxWidth: 620, lineHeight: 1.65, margin: '28px 0 0' }}>
              Paste the Slack post, exec memo, PRD section, customer reply, or meeting follow-up. PM Dojo checks the
              call, the evidence, the tradeoff, and the ask before it leaves your hands.
            </p>
            <p style={{ fontSize: 13, color: tokens.dimmer, maxWidth: 620, lineHeight: 1.65, margin: '14px 0 0' }}>
              Built from {LENNY_DATASET.label}: the archive is turned into source-linked PM judgment reps, not generic
              writing advice.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
              <button
                onClick={() => nav('invoke')}
                style={{
                  background: tokens.gold,
                  color: tokens.bg,
                  border: 'none',
                  padding: '20px 34px',
                  fontSize: 17,
                  fontWeight: 900,
                  fontFamily: tokens.sans,
                  cursor: 'pointer',
                  borderRadius: 14,
                  letterSpacing: 0.2,
                  boxShadow: `0 10px 30px ${withAlpha(tokens.gold, 0.32)}, inset 0 -3px 0 rgba(0,0,0,.22)`,
                  animation: 'glow 3s ease-in-out infinite',
                  transition: 'transform .15s',
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                REVIEW REAL WORK
              </button>
              <button
                onClick={() => nav('lanes')}
                style={{
                  background: 'transparent',
                  color: tokens.ink,
                  border: `1px solid ${tokens.lineStrong}`,
                  padding: '18px 24px',
                  fontSize: 14,
                  fontWeight: 800,
                  fontFamily: tokens.sans,
                  cursor: 'pointer',
                  borderRadius: 14,
                  letterSpacing: 0.2,
                }}
              >
                TRAIN A LANE
              </button>
            </div>
          </div>

          <div
            style={{
              background: tokens.panel,
              border: `1px solid ${tokens.line}`,
              borderRadius: 18,
              padding: 24,
              boxShadow: '0 24px 70px rgba(0,0,0,.28)',
            }}
          >
            <div
              style={{
                background: tokens.bg2,
                border: `1px solid ${withAlpha(tokens.mint, 0.26)}`,
                borderRadius: 13,
                padding: 14,
                marginBottom: 18,
              }}
            >
              <div style={{ fontSize: 10, fontFamily: tokens.mono, color: tokens.mint, letterSpacing: 1.5, marginBottom: 7 }}>
                SOURCE BOUNDARY
              </div>
              <div style={{ fontSize: 13, color: tokens.dim, lineHeight: 1.55 }}>
                Buildathon mode uses only Lenny newsletter and podcast-derived material from the local wiki.
              </div>
              <button
                onClick={() => nav('demo')}
                style={{
                  marginTop: 10,
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  color: tokens.gold,
                  fontFamily: tokens.mono,
                  fontSize: 10,
                  fontWeight: 850,
                  letterSpacing: 1,
                  cursor: 'pointer',
                }}
              >
                VIEW BUILDATHON DEMO
              </button>
            </div>
            <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.gold, letterSpacing: 1.6, marginBottom: 18 }}>WHAT HAPPENS</div>
            <HomeStep
              step="1"
              title="Bring the real moment"
              body="Audience, stakes, and the draft or notes you are about to use."
              tokens={tokens}
            />
            <HomeStep
              step="2"
              title="State the PM call"
              body="Recommendation, evidence, tradeoff, ask, and what would change your mind."
              tokens={tokens}
            />
            <HomeStep
              step="3"
              title="Leave with a sharper send"
              body="What landed, what missed, and a revised draft shaped like the artifact."
              tokens={tokens}
              last
            />
          </div>
        </section>
      </main>

      <footer
        style={{
          position: 'relative',
          padding: '0 48px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 18,
          fontSize: 11,
          fontFamily: tokens.mono,
          color: tokens.dimmer,
          maxWidth: 1440,
          margin: '0 auto',
        }}
      >
        <span>Use Train when you do not have live work yet. Use Progress when you want the scoreboard.</span>
        <NavHintKeys tokens={tokens} />
      </footer>
    </div>
  )
}

function HomeStep({
  step,
  title,
  body,
  tokens,
  last = false,
}: {
  step: string
  title: string
  body: string
  tokens: Tokens
  last?: boolean
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '34px 1fr',
        gap: 14,
        paddingBottom: last ? 0 : 18,
        marginBottom: last ? 0 : 18,
        borderBottom: last ? 'none' : `1px solid ${tokens.line}`,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 999,
          background: withAlpha(tokens.gold, 0.14),
          color: tokens.gold,
          display: 'grid',
          placeItems: 'center',
          fontFamily: tokens.mono,
          fontSize: 12,
          fontWeight: 900,
        }}
      >
        {step}
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 850, letterSpacing: -0.2, marginBottom: 5 }}>{title}</div>
        <div style={{ fontSize: 13, color: tokens.dim, lineHeight: 1.55 }}>{body}</div>
      </div>
    </div>
  )
}
