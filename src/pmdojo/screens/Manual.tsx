import { useState } from 'react'

import { Header } from '../components'
import { LENNY_DATASET, getLaneLennySources, getPrincipleLennySources } from '../lenny'
import { DOJO_PRINCIPLES } from '../principles'
import { DAILY_REP_TARGET, RANK_LADDER, getNextRankProgress } from '../progression'
import { TARGET_SCENARIOS_PER_LANE, getRepositoryStats, getScenarioInventory } from '../repository'
import { withAlpha } from '../tokens'
import type { AppState, Screen, Tokens } from '../types'

type ManualProps = {
  nav: (screen: Screen) => void
  state: AppState
  tokens: Tokens
  startSuggestedRound: () => void
}

export function ManualScreen({ nav, state, tokens, startSuggestedRound }: ManualProps) {
  const repository = getRepositoryStats()
  const inventory = getScenarioInventory()
  const rankProgress = getNextRankProgress(state.stats.xp)
  const [copied, setCopied] = useState<'codex' | 'project' | null>(null)

  const copyText = (kind: 'codex' | 'project', value: string) => {
    if (!navigator.clipboard) {
      return
    }

    void navigator.clipboard.writeText(value).then(() => {
      setCopied(kind)
      window.setTimeout(() => setCopied(null), 1600)
    })
  }

  return (
    <div style={{ width: '100%', minHeight: '100%', background: tokens.bg, color: tokens.ink, fontFamily: tokens.sans }}>
      <Header nav={nav} tokens={tokens} active="manual" />

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '42px 48px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 360px', gap: 24, alignItems: 'stretch', marginBottom: 22 }}>
          <section
            style={{
              background: `linear-gradient(135deg, ${withAlpha(tokens.gold, 0.16)}, ${tokens.panel})`,
              border: `1px solid ${tokens.lineStrong}`,
              borderRadius: 18,
              padding: 28,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ fontFamily: tokens.mono, fontSize: 11, color: tokens.gold, letterSpacing: 2, marginBottom: 12 }}>
              LENNY SOURCE MANUAL
            </div>
            <h1 style={{ fontSize: 52, lineHeight: 1, letterSpacing: -1.8, margin: '0 0 16px', maxWidth: 760 }}>
              How Lenny's archive becomes reps.
            </h1>
            <p style={{ fontSize: 15, color: tokens.dim, lineHeight: 1.65, margin: 0, maxWidth: 760 }}>
              PM Dojo is an authored simulator, not a chatbot. For the Buildathon, the visible product loop is grounded
              only in Lenny newsletter and podcast-derived material: source-linked principles, lanes, scenarios, rubrics,
              and suggested rewrites.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button
                onClick={startSuggestedRound}
                style={{
                  background: tokens.gold,
                  color: tokens.bg,
                  border: 'none',
                  padding: '12px 18px',
                  fontSize: 13,
                  fontWeight: 800,
                  borderRadius: 10,
                  fontFamily: tokens.sans,
                  cursor: 'pointer',
                }}
              >
                START SUGGESTED REP
              </button>
              <button
                onClick={() => nav('lanes')}
                style={{
                  background: 'transparent',
                  color: tokens.ink,
                  border: `1px solid ${tokens.lineStrong}`,
                  padding: '12px 18px',
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 10,
                  fontFamily: tokens.sans,
                  cursor: 'pointer',
                }}
              >
                OPEN REPOSITORY
              </button>
              <button
                onClick={() => nav('demo')}
                style={{
                  background: 'transparent',
                  color: tokens.mint,
                  border: `1px solid ${withAlpha(tokens.mint, 0.38)}`,
                  padding: '12px 18px',
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 10,
                  fontFamily: tokens.sans,
                  cursor: 'pointer',
                }}
              >
                BUILDATHON DEMO
              </button>
            </div>
          </section>

          <section style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 18, padding: 22 }}>
            <div style={{ fontFamily: tokens.mono, fontSize: 11, color: tokens.mint, letterSpacing: 2, marginBottom: 16 }}>
              LENNY-ONLY ENGINE
            </div>
            <Metric label="SOURCE" value="Lenny archive" tokens={tokens} />
            <Metric
              label="NEWSLETTERS"
              value="source-indexed"
              tokens={tokens}
            />
            <Metric
              label="PODCASTS"
              value="source-indexed"
              tokens={tokens}
            />
            <Metric label="LANES" value={repository.laneCount} tokens={tokens} />
            <Metric label="SCENARIOS" value={`${repository.authoredScenarios}/${repository.targetScenarios}`} tokens={tokens} />
            <Metric label="RUBRIC CHECKS" value={repository.authoredRubricChecks} tokens={tokens} />
            <Metric label="PRINCIPLES" value={repository.principleCount} tokens={tokens} />
            <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.55, marginTop: 14 }}>
              Source boundary: use {LENNY_DATASET.label} only. Broader PM canon can inform private notes, but should not
              appear as Buildathon product grounding.
            </div>
          </section>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 26 }}>
          <ExplainerCard
            eyebrow="DATASET"
            title="Not a generic PM coach."
            body={`The Buildathon version turns ${LENNY_DATASET.label} into deliberate practice. Source lineage should be visible on Home, Train, Manual, Round, and Critique.`}
            tokens={tokens}
            color={tokens.gold}
          />
          <ExplainerCard
            eyebrow="SENSEI"
            title="A routing layer, not a mascot."
            body={`Sensei reads your local history, finds the weakest radar axis, and suggests the next Lenny-derived lane. It is intentionally opinionated: train the shortest axis, not the easiest rep.`}
            tokens={tokens}
            color={tokens.sky}
          />
          <ExplainerCard
            eyebrow="XP"
            title="Reward the move, not the vibe."
            body={`Every rubric hit earns XP. Partial hits earn half. The daily target is ${DAILY_REP_TARGET} reps, enough to build cadence without turning PM practice into a chore loop.`}
            tokens={tokens}
            color={tokens.mint}
          />
        </div>

        <section
          style={{
            background: tokens.panel,
            border: `1px solid ${withAlpha(tokens.mint, 0.25)}`,
            borderRadius: 14,
            padding: 22,
            marginBottom: 26,
          }}
        >
          <div style={{ fontFamily: tokens.mono, fontSize: 11, color: tokens.mint, letterSpacing: 2, marginBottom: 12 }}>
            LENNY SOURCE BOUNDARY
          </div>
          <div style={{ fontSize: 22, fontWeight: 850, letterSpacing: -0.4, marginBottom: 8 }}>
            The app should prove its work.
          </div>
          <div style={{ fontSize: 13, color: tokens.dim, lineHeight: 1.65, maxWidth: 900, marginBottom: 16 }}>
            The local wiki includes broader PM material, but the Buildathon experience should isolate to Lenny-derived
            newsletter and podcast sources. Every lane and principle below now carries a visible source lineage.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <BoundaryItem label="Raw archive" value={LENNY_DATASET.rawArchivePath} tokens={tokens} />
            <BoundaryItem label="Wiki index" value={LENNY_DATASET.wikiIndexPath} tokens={tokens} />
            <BoundaryItem label="Rule" value="No non-Lenny canon in visible Buildathon grounding" tokens={tokens} />
          </div>
        </section>

        <section style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 14, padding: 22, marginBottom: 26 }}>
          <div style={{ fontFamily: tokens.mono, fontSize: 11, color: tokens.mint, letterSpacing: 2, marginBottom: 14 }}>
            INVOKE ANYWHERE
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <InvocationCard
              title="Codex skill"
              body="Use this inside Codex sessions when you want the same preflight ritual without opening the web app."
              command="Use $debjeet-pm-dojo-preflight to review this PM artifact before I send it."
              copied={copied === 'codex'}
              onCopy={() =>
                copyText('codex', 'Use $debjeet-pm-dojo-preflight to review this PM artifact before I send it.')
              }
              tokens={tokens}
            />
            <InvocationCard
              title="Project prompt"
              body="Use this for Claude Projects, ChatGPT Projects/GPTs, Plot-style sessions, or any place Codex skills are unavailable."
              command="You are PM Dojo, grounded only in Lenny's newsletter and podcast-derived PM judgment principles. Separate PM judgment from prose quality. Ask for recommendation, non-goals, evidence, tradeoff, ask, and change-mind condition. Return Verdict, What landed, What missed, Suggested rewrite, and Why this works."
              copied={copied === 'project'}
              onCopy={() =>
                copyText(
                  'project',
                  "You are PM Dojo: a preflight reviewer for real product management judgment, grounded only in Lenny's newsletter and podcast-derived PM judgment principles. Separate PM judgment from prose quality. For every artifact, capture recommendation, non-goals, evidence, tradeoff, ask, and what would change the call. Review against: front-load the point, make the call, name the tradeoff, give the reader a job, use evidence not vibes, write for the room, and keep trust under pressure. Output Verdict, What landed, What missed, Suggested rewrite, and Why this works. Be direct and do not give generic advice.",
                )
              }
              tokens={tokens}
            />
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 26 }}>
          <section style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 14, padding: 22 }}>
            <div style={{ fontFamily: tokens.mono, fontSize: 11, color: tokens.gold, letterSpacing: 2, marginBottom: 14 }}>
              SCORING CONTRACT
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {DOJO_PRINCIPLES.map((principle) => (
                <div key={principle.id} style={{ background: tokens.bg2, border: `1px solid ${tokens.line}`, borderRadius: 10, padding: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 750 }}>{principle.label}</div>
                    <div style={{ fontFamily: tokens.mono, fontSize: 10, color: tokens.dimmer }}>{principle.source}</div>
                  </div>
                  <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.5, marginBottom: 6 }}>{principle.description}</div>
                  <div style={{ fontSize: 11, color: tokens.gold, lineHeight: 1.45 }}>{principle.scoringQuestion}</div>
                  <div style={{ display: 'grid', gap: 5, marginTop: 10 }}>
                    {getPrincipleLennySources(principle.id)
                      .slice(0, 2)
                      .map((source) => (
                        <SourceLine key={source.id} source={source.title} detail={`${source.kind} · ${source.topicFile}`} tokens={tokens} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 14, padding: 22 }}>
            <div style={{ fontFamily: tokens.mono, fontSize: 11, color: tokens.mint, letterSpacing: 2, marginBottom: 14 }}>
              RANK LADDER
            </div>
            <div style={{ height: 8, background: tokens.panel2, borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.round(rankProgress.progress * 100)}%`,
                  background: tokens.mint,
                  boxShadow: `0 0 12px ${tokens.mint}`,
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: tokens.dim, fontSize: 12, marginBottom: 14 }}>
              <span>Current: {rankProgress.current.rank}</span>
              <span>{rankProgress.next ? `${rankProgress.xpToNext} XP to ${rankProgress.next.rank}` : 'top rank reached'}</span>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {RANK_LADDER.map((rank) => (
                <div
                  key={rank.rank}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '70px 70px 1fr',
                    gap: 10,
                    alignItems: 'baseline',
                    padding: '9px 0',
                    borderTop: `1px solid ${tokens.line}`,
                    fontSize: 12,
                  }}
                >
                  <span style={{ fontFamily: tokens.mono, color: rank.rank === state.stats.rank ? tokens.mint : tokens.ink, fontWeight: 800 }}>
                    {rank.rank}
                  </span>
                  <span style={{ fontFamily: tokens.mono, color: tokens.dimmer }}>{rank.minXp}+ XP</span>
                  <span style={{ color: tokens.dim, lineHeight: 1.45 }}>{rank.meaning}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 14, padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: tokens.mono, fontSize: 11, color: tokens.sky, letterSpacing: 2, marginBottom: 8 }}>
                SCENARIO REPOSITORY
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>What exists today, and what still needs authoring.</div>
            </div>
            <div style={{ fontFamily: tokens.mono, fontSize: 11, color: tokens.dimmer }}>{repository.version}</div>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {inventory.map((lane) => (
              <div
                key={lane.laneId}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '210px 120px 260px 1fr',
                  gap: 16,
                  padding: 14,
                  border: `1px solid ${tokens.line}`,
                  borderRadius: 10,
                  background: tokens.bg2,
                }}
              >
                <div>
                  <div style={{ fontFamily: tokens.mono, fontSize: 10, color: lane.rail, letterSpacing: 1.5, marginBottom: 6 }}>
                    LANE {lane.laneId} · {lane.tag}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{lane.title}</div>
                  <div style={{ fontSize: 11, color: tokens.dim, marginTop: 4 }}>{lane.artifact}</div>
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: lane.isPracticeLane ? tokens.mint : tokens.gold, lineHeight: 1 }}>
                    {lane.isPracticeLane ? 'LIVE' : lane.scenarios.length}
                  </div>
                  <div style={{ fontFamily: tokens.mono, fontSize: 10, color: tokens.dimmer, marginTop: 5 }}>
                    {lane.isPracticeLane ? 'USER DRAFTS' : `OF ${TARGET_SCENARIOS_PER_LANE} TARGET`}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: tokens.mono, fontSize: 10, color: tokens.dimmer, letterSpacing: 1.3, marginBottom: 7 }}>
                    LENNY LINEAGE
                  </div>
                  <div style={{ display: 'grid', gap: 6 }}>
                    {getLaneLennySources(lane.laneId)
                      .slice(0, 2)
                      .map((source) => (
                        <SourceLine key={source.id} source={source.title} detail={source.kind} tokens={tokens} />
                      ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignContent: 'flex-start' }}>
                  {lane.isPracticeLane ? (
                    <RepositoryChip label="unbounded private drafts" tokens={tokens} />
                  ) : (
                    lane.scenarios.map((scenario) => (
                      <RepositoryChip
                        key={scenario.id}
                        label={`${scenario.id} · ${scenario.rubricChecks} checks · ${scenario.channelLabel}`}
                        tokens={tokens}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function Metric({ label, value, tokens }: { label: string; value: string | number; tokens: Tokens }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${tokens.line}` }}>
      <span style={{ fontFamily: tokens.mono, fontSize: 11, color: tokens.dimmer, letterSpacing: 1 }}>{label}</span>
      <span style={{ fontFamily: tokens.mono, fontSize: 14, color: tokens.ink, fontWeight: 800 }}>{value}</span>
    </div>
  )
}

function BoundaryItem({ label, value, tokens }: { label: string; value: string; tokens: Tokens }) {
  return (
    <div style={{ background: tokens.bg2, border: `1px solid ${tokens.line}`, borderRadius: 10, padding: 13 }}>
      <div style={{ fontFamily: tokens.mono, fontSize: 10, color: tokens.dimmer, letterSpacing: 1.2, marginBottom: 7 }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontSize: 12, color: tokens.ink, lineHeight: 1.5 }}>{value}</div>
    </div>
  )
}

function SourceLine({ source, detail, tokens }: { source: string; detail: string; tokens: Tokens }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'baseline' }}>
      <div style={{ fontSize: 11, color: tokens.dim, lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis' }}>{source}</div>
      <div style={{ fontFamily: tokens.mono, fontSize: 9, color: tokens.dimmer, whiteSpace: 'nowrap' }}>{detail}</div>
    </div>
  )
}

function ExplainerCard({
  eyebrow,
  title,
  body,
  tokens,
  color,
}: {
  eyebrow: string
  title: string
  body: string
  tokens: Tokens
  color: string
}) {
  return (
    <section style={{ background: tokens.panel, border: `1px solid ${tokens.line}`, borderRadius: 14, padding: 20 }}>
      <div style={{ fontFamily: tokens.mono, fontSize: 11, color, letterSpacing: 2, marginBottom: 12 }}>{eyebrow}</div>
      <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.2, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: tokens.dim, lineHeight: 1.6 }}>{body}</div>
    </section>
  )
}

function InvocationCard({
  title,
  body,
  command,
  copied,
  onCopy,
  tokens,
}: {
  title: string
  body: string
  command: string
  copied: boolean
  onCopy: () => void
  tokens: Tokens
}) {
  return (
    <div style={{ background: tokens.bg2, border: `1px solid ${tokens.line}`, borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 17, fontWeight: 850, letterSpacing: -0.2, marginBottom: 7 }}>{title}</div>
      <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.55, marginBottom: 12 }}>{body}</div>
      <div
        style={{
          background: tokens.bg,
          border: `1px solid ${tokens.line}`,
          borderRadius: 9,
          padding: 12,
          color: tokens.dim,
          fontFamily: tokens.mono,
          fontSize: 11,
          lineHeight: 1.55,
          minHeight: 76,
          marginBottom: 12,
        }}
      >
        {command}
      </div>
      <button
        onClick={onCopy}
        style={{
          background: copied ? tokens.mint : 'transparent',
          color: copied ? tokens.bg : tokens.mint,
          border: `1px solid ${copied ? tokens.mint : tokens.lineStrong}`,
          padding: '9px 12px',
          borderRadius: 9,
          fontFamily: tokens.mono,
          fontSize: 11,
          fontWeight: 800,
          cursor: 'pointer',
          letterSpacing: 0.7,
        }}
      >
        {copied ? 'COPIED' : 'COPY INVOCATION'}
      </button>
    </div>
  )
}

function RepositoryChip({ label, tokens }: { label: string; tokens: Tokens }) {
  return (
    <span
      style={{
        fontFamily: tokens.mono,
        fontSize: 10,
        color: tokens.dim,
        border: `1px solid ${tokens.line}`,
        background: tokens.panel,
        borderRadius: 100,
        padding: '5px 8px',
        maxWidth: 360,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
      title={label}
    >
      {label}
    </span>
  )
}
