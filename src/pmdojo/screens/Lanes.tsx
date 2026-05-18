import { useState } from 'react'

import { Header } from '../components'
import { MY_DRAFT_LANE_ID } from '../content'
import { getSuggestedLaneId } from '../game'
import { getLaneLennySources } from '../lenny'
import { withAlpha } from '../tokens'
import type { AppState, Lane, Screen, Tokens } from '../types'

type LanesProps = {
  nav: (screen: Screen) => void
  state: AppState
  tokens: Tokens
  ambientGlow: boolean
  openLaneRound: (laneId: string) => void
}

export function LanesScreen({ nav, state, tokens, ambientGlow, openLaneRound }: LanesProps) {
  const suggestedLaneId = getSuggestedLaneId(state.history)
  const trainLanes = state.lanes.filter((lane) => lane.id !== MY_DRAFT_LANE_ID)
  const suggestedLane = trainLanes.find((lane) => lane.id === suggestedLaneId) ?? trainLanes[0]
  const scenarioCount = trainLanes.reduce((total, lane) => total + lane.scenarioCount, 0)

  const startLane = (lane: Lane) => {
    if (lane.locked) {
      return
    }

    openLaneRound(lane.id)
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
            top: -160,
            right: -220,
            width: 580,
            height: 580,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,136,255,.15), transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      ) : null}

      <Header nav={nav} tokens={tokens} active="lanes" />

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '42px 48px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, marginBottom: 6 }}>Train</div>
            <div style={{ fontSize: 14, color: tokens.dim, maxWidth: 620 }}>
              Each lane is a different PM failure mode derived from Lenny's newsletter and podcast archive. Pick the artifact
              you need reps on; use Preflight when the artifact is real and about to ship.
            </div>
          </div>
          <div style={{ fontSize: 11, fontFamily: tokens.mono, color: tokens.dimmer, letterSpacing: 1.2 }}>
            {trainLanes.length} LANES · {scenarioCount} SCENARIOS · {trainLanes.filter((lane) => lane.diff === 'BOSS').length} BOSS
          </div>
        </div>

        {suggestedLane ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 18,
              alignItems: 'center',
              background: withAlpha(suggestedLane.rail, 0.08),
              border: `1px solid ${withAlpha(suggestedLane.rail, 0.45)}`,
              borderRadius: 14,
              padding: 18,
              marginBottom: 18,
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontFamily: tokens.mono, color: suggestedLane.rail, letterSpacing: 1.5, marginBottom: 6 }}>
                SUGGESTED NEXT REP
              </div>
              <div style={{ fontSize: 20, fontWeight: 850, letterSpacing: -0.3, marginBottom: 6 }}>{suggestedLane.title}</div>
              <div style={{ fontSize: 13, color: tokens.dim, lineHeight: 1.55, maxWidth: 680 }}>{suggestedLane.hook}</div>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 10 }}>
                {getLaneLennySources(suggestedLane.id)
                  .slice(0, 2)
                  .map((source) => (
                    <SourcePill key={source.id} label={source.title} tokens={tokens} />
                  ))}
              </div>
            </div>
            <button
              onClick={() => startLane(suggestedLane)}
              style={{
                background: 'transparent',
                color: tokens.ink,
                border: `1px solid ${withAlpha(suggestedLane.rail, 0.65)}`,
                padding: '12px 18px',
                borderRadius: 10,
                fontFamily: tokens.sans,
                fontSize: 13,
                fontWeight: 850,
                cursor: 'pointer',
              }}
            >
              START REP
            </button>
          </div>
        ) : null}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
          {trainLanes.map((lane) => (
            <LaneCard
              key={lane.id}
              lane={lane}
              tokens={tokens}
              suggested={lane.id === suggestedLaneId}
              sourceTitles={getLaneLennySources(lane.id)
                .slice(0, 2)
                .map((source) => source.title)}
              onClick={() => startLane(lane)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function LaneCard({
  lane,
  tokens,
  suggested,
  sourceTitles,
  onClick,
}: {
  lane: Lane
  tokens: Tokens
  suggested: boolean
  sourceTitles: string[]
  onClick: () => void
}) {
  const [hover, setHover] = useState(false)
  const diffColor = { NORMAL: tokens.sky, HARD: tokens.gold, BOSS: tokens.hot }[lane.diff]

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={lane.locked}
      style={{
        background: tokens.panel,
        borderStyle: 'solid',
        borderWidth: '3px 1px 1px',
        borderColor: `${lane.rail} ${hover && !lane.locked ? lane.rail : suggested ? lane.rail : tokens.line} ${
          hover && !lane.locked ? lane.rail : suggested ? lane.rail : tokens.line
        }`,
        borderRadius: 12,
        padding: 16,
        position: 'relative',
        cursor: lane.locked ? 'default' : 'pointer',
        opacity: lane.locked ? 0.55 : 1,
        overflow: 'hidden',
        transition: 'transform .15s, border-color .15s',
        transform: hover && !lane.locked ? 'translateY(-3px)' : 'translateY(0)',
        textAlign: 'left',
        color: tokens.ink,
        fontFamily: tokens.sans,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: tokens.mono,
          fontSize: 10,
          color: tokens.dimmer,
          letterSpacing: 1,
          marginBottom: 14,
        }}
      >
        <span>LANE {lane.id}</span>
        <span style={{ color: diffColor }}>{lane.diff}</span>
      </div>
      <div style={{ fontSize: 11, fontFamily: tokens.mono, color: lane.rail, letterSpacing: 1, marginBottom: 6 }}>
        {lane.tag}
      </div>
      <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2, marginBottom: 12 }}>{lane.title}</div>
      <div style={{ fontSize: 12, color: tokens.dim, lineHeight: 1.5, marginBottom: 16, minHeight: 54 }}>{lane.hook}</div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: tokens.mono, fontSize: 9, color: tokens.dimmer, letterSpacing: 1, marginBottom: 6 }}>
          LENNY SOURCE
        </div>
        <div style={{ display: 'grid', gap: 5 }}>
          {sourceTitles.map((title) => (
            <div key={title} style={{ fontSize: 10, color: tokens.dim, lineHeight: 1.35 }}>
              {title}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        <span
          style={{
            fontFamily: tokens.mono,
            fontSize: 10,
            padding: '4px 8px',
            borderRadius: 100,
            border: `1px solid ${tokens.lineStrong}`,
            color: tokens.dim,
          }}
        >
          {lane.artifact}
        </span>
        <span
          style={{
            fontFamily: tokens.mono,
            fontSize: 10,
            padding: '4px 8px',
            borderRadius: 100,
            border: `1px solid ${tokens.lineStrong}`,
            color: tokens.dim,
          }}
        >
          {lane.reps} reps
        </span>
        <span
          style={{
            fontFamily: tokens.mono,
            fontSize: 10,
            padding: '4px 8px',
            borderRadius: 100,
            border: `1px solid ${tokens.lineStrong}`,
            color: tokens.dim,
          }}
        >
          {lane.scenarioCount > 0 ? `${lane.scenarioCount} scenarios` : 'live drafts'}
        </span>
      </div>
      <div style={{ fontSize: 11, fontFamily: tokens.mono, color: suggested ? tokens.gold : tokens.dimmer }}>
        {suggested ? 'SENSEI PICK' : lane.diff === 'BOSS' ? 'ADVANCED' : 'LIVE'}
      </div>
      {lane.locked ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: 11,
            fontFamily: tokens.mono,
            color: tokens.dim,
            letterSpacing: 1.5,
            background: 'rgba(14,15,20,.7)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <div>LOCKED</div>
          <div style={{ color: tokens.gold }}>{lane.unlock}</div>
        </div>
      ) : null}
    </button>
  )
}

function SourcePill({ label, tokens }: { label: string; tokens: Tokens }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        border: `1px solid ${withAlpha(tokens.mint, 0.28)}`,
        color: tokens.mint,
        background: withAlpha(tokens.mint, 0.06),
        borderRadius: 999,
        padding: '4px 8px',
        fontFamily: tokens.mono,
        fontSize: 9,
        letterSpacing: 0.4,
      }}
    >
      {label}
    </span>
  )
}
