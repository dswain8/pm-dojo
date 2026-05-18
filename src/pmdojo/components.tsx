import type { CSSProperties, ReactNode } from 'react'

import { withAlpha } from './tokens'
import type { Screen, Tokens } from './types'

type PillProps = {
  label: string
  value: string | number
  color: string
  tokens: Tokens
  hint?: string
  onClick?: () => void
}

export function Pill({ label, value, color, tokens, hint, onClick }: PillProps) {
  return (
    <div
      onClick={onClick}
      title={hint}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 14px',
        background: tokens.panel,
        border: `1px solid ${tokens.line}`,
        borderRadius: 100,
        fontFamily: tokens.mono,
        fontSize: 11,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <span style={{ color: tokens.dimmer, letterSpacing: 1 }}>{label}</span>
      <span style={{ color, fontWeight: 700 }}>{value}</span>
    </div>
  )
}

type ChipProps = {
  children: ReactNode
  tokens: Tokens
  color?: string
}

export function Chip({ children, tokens, color }: ChipProps) {
  return (
    <span
      style={{
        fontFamily: tokens.mono,
        fontSize: 10,
        padding: '4px 9px',
        border: `1px solid ${tokens.lineStrong}`,
        borderRadius: 100,
        color: color ?? 'rgba(245,243,238,.65)',
        letterSpacing: 0.5,
      }}
    >
      {children}
    </span>
  )
}

export function Logo({ size = 26, tokens }: { size?: number; tokens: Tokens }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 3.5,
        background: tokens.gold,
        color: tokens.bg,
        fontWeight: 900,
        fontFamily: tokens.mono,
        fontSize: size * 0.55,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      奥
    </div>
  )
}

export function TimerRing({
  sec,
  total = 480,
  size = 42,
  tokens,
}: {
  sec: number
  total?: number
  size?: number
  tokens: Tokens
}) {
  const minutes = String(Math.floor(sec / 60)).padStart(2, '0')
  const seconds = String(sec % 60).padStart(2, '0')
  const pct = Math.max(0, Math.min(1, sec / total))
  const radius = size / 2.6
  const circumference = 2 * Math.PI * radius
  const warn = sec < 60

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,.08)"
          strokeWidth="3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={warn ? tokens.hot : tokens.gold}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: tokens.mono,
          fontSize: size * 0.22,
          fontWeight: 700,
          color: tokens.ink,
          letterSpacing: 0.5,
        }}
      >
        {minutes}:{seconds}
      </div>
    </div>
  )
}

export function Radar({
  values,
  baseline,
  tokens,
}: {
  values: [number, number, number, number, number]
  baseline?: [number, number, number, number, number]
  tokens: Tokens
}) {
  const cx = 160
  const cy = 135
  const radius = 92
  const labels = ['COMMS', 'ESCAL', 'PRIO', 'DISCO', 'NARR']
  const pointsAt = (currentRadius: number) =>
    labels.map((_, index) => {
      const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 5
      return [cx + Math.cos(angle) * currentRadius, cy + Math.sin(angle) * currentRadius] as const
    })

  const valuePolygon = values
    .map((value, index) => {
      const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 5
      return [cx + Math.cos(angle) * radius * value, cy + Math.sin(angle) * radius * value].join(',')
    })
    .join(' ')

  const basePolygon = baseline
    ? baseline
        .map((value, index) => {
          const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 5
          return [cx + Math.cos(angle) * radius * value, cy + Math.sin(angle) * radius * value].join(',')
        })
        .join(' ')
    : null

  return (
    <svg viewBox="0 0 320 230" style={{ width: '100%', display: 'block' }}>
      {[0.25, 0.5, 0.75, 1].map((factor) => (
        <polygon
          key={factor}
          points={pointsAt(radius * factor)
            .map((point) => point.join(','))
            .join(' ')}
          fill="none"
          stroke="rgba(255,255,255,.07)"
          strokeWidth="1"
        />
      ))}
      {pointsAt(radius).map(([x, y], index) => (
        <line
          key={index}
          x1={cx}
          y1={cy}
          x2={x}
          y2={y}
          stroke="rgba(255,255,255,.05)"
          strokeWidth="1"
        />
      ))}
      {basePolygon ? (
        <polygon
          points={basePolygon}
          fill="rgba(110,170,255,.1)"
          stroke="rgba(110,170,255,.4)"
          strokeWidth="1"
          strokeDasharray="3,3"
        />
      ) : null}
      <polygon points={valuePolygon} fill={withAlpha(tokens.gold, 0.18)} stroke={tokens.gold} strokeWidth="1.5" />
      {values.map((value, index) => {
        const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 5
        const x = cx + Math.cos(angle) * radius * value
        const y = cy + Math.sin(angle) * radius * value
        return <circle key={index} cx={x} cy={y} r="3" fill={tokens.gold} />
      })}
      {pointsAt(radius).map((_, index) => {
        const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 5
        const labelX = cx + Math.cos(angle) * (radius + 20)
        const labelY = cy + Math.sin(angle) * (radius + 20)
        return (
          <text
            key={index}
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fontFamily={tokens.mono}
            fill="rgba(245,243,238,.55)"
            letterSpacing="1"
          >
            {labels[index]}
          </text>
        )
      })}
    </svg>
  )
}

export function PhasePip({
  label,
  state,
  tokens,
}: {
  label: string
  state: 'done' | 'active' | 'pending'
  tokens: Tokens
}) {
  const color = state === 'active' ? tokens.gold : state === 'done' ? tokens.mint : tokens.dim
  const background = state === 'active' ? tokens.gold : 'transparent'
  const foreground = state === 'active' ? tokens.bg : color

  return (
    <div
      style={{
        padding: '5px 10px',
        borderRadius: 100,
        fontFamily: tokens.mono,
        fontSize: 10,
        letterSpacing: 1,
        border: `1px solid ${state === 'active' ? color : tokens.line}`,
        color: foreground,
        background,
        fontWeight: state === 'active' ? 800 : 500,
      }}
    >
      {state === 'done' ? '✓ ' : ''}
      {label}
    </div>
  )
}

const keyStyle = (tokens: Tokens): CSSProperties => ({
  background: tokens.panel,
  padding: '1px 6px',
  borderRadius: 4,
  border: `1px solid ${tokens.line}`,
  fontFamily: tokens.mono,
  color: tokens.dim,
  fontSize: 10,
})

export function Header({
  nav,
  tokens,
  active,
}: {
  nav: (screen: Screen) => void
  tokens: Tokens
  active: 'home' | 'progress' | 'lanes' | 'invoke' | 'manual'
}) {
  const activeNav = active === 'invoke' ? 'home' : active

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '20px 48px',
        borderBottom: `1px solid ${tokens.line}`,
        maxWidth: 1440,
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => nav('landing')}
          title="Go home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'transparent',
            border: 'none',
            padding: 0,
            color: tokens.ink,
            cursor: 'pointer',
            fontFamily: tokens.sans,
            textAlign: 'left',
          }}
        >
          <Logo size={32} tokens={tokens} />
          <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 0.3 }}>PM DOJO</div>
        </button>
        <div style={{ display: 'flex', gap: 2, marginLeft: 28 }}>
          {[
            ['home', 'Home'],
            ['lanes', 'Train'],
            ['progress', 'Progress'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => {
                if (id === 'lanes') {
                  nav('lanes')
                  return
                }

                if (id === 'invoke') {
                  nav('invoke')
                  return
                }

                if (id === 'progress') {
                  nav('progress')
                  return
                }

                nav('landing')
              }}
              style={{
                background: activeNav === id ? tokens.panel : 'transparent',
                color: activeNav === id ? tokens.ink : tokens.dim,
                border: 'none',
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontFamily: tokens.sans,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function NavHintKeys({ tokens }: { tokens: Tokens }) {
  return (
    <span>
      <kbd style={keyStyle(tokens)}>I</kbd> review · <kbd style={keyStyle(tokens)}>G</kbd> progress ·{' '}
      <kbd style={keyStyle(tokens)}>M</kbd> manual
    </span>
  )
}
