import type { AccentKey, Tokens } from './types'

export const STORAGE_KEY = 'pmdojo-state'

export const ACCENTS: Record<AccentKey, { gold: string; label: string }> = {
  gold: { gold: '#ffc53a', label: 'Gold' },
  amber: { gold: '#ff9b3a', label: 'Amber' },
  mint: { gold: '#5ef2b0', label: 'Mint' },
  orchid: { gold: '#c888ff', label: 'Orchid' },
}

const baseTokens = {
  sans: '"Geist","Inter",system-ui,sans-serif',
  mono: '"Geist Mono",ui-monospace,monospace',
  bg: '#0e0f14',
  bg2: '#14161d',
  panel: '#1a1d26',
  panel2: '#20232e',
  line: 'rgba(255,255,255,.08)',
  lineStrong: 'rgba(255,255,255,.14)',
  ink: '#f5f3ee',
  dim: 'rgba(245,243,238,.55)',
  dimmer: 'rgba(245,243,238,.32)',
  hot: '#ff5b3a',
  mint: '#5ef2b0',
  sky: '#6eaaff',
  orchid: '#c888ff',
} as const

export function createTokens(accent: AccentKey): Tokens {
  return {
    ...baseTokens,
    gold: ACCENTS[accent].gold,
  }
}

function hexToRgbString(hex: string) {
  const normalized = hex.replace('#', '')
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((value) => value + value)
          .join('')
      : normalized
  const intValue = Number.parseInt(expanded, 16)
  const red = (intValue >> 16) & 255
  const green = (intValue >> 8) & 255
  const blue = intValue & 255

  return `${red}, ${green}, ${blue}`
}

export function withAlpha(hex: string, alpha: number) {
  return `rgba(${hexToRgbString(hex)}, ${alpha})`
}

export function syncTokenCssVars(tokens: Tokens) {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  root.style.setProperty('--bg', tokens.bg)
  root.style.setProperty('--bg2', tokens.bg2)
  root.style.setProperty('--panel', tokens.panel)
  root.style.setProperty('--panel2', tokens.panel2)
  root.style.setProperty('--line', tokens.line)
  root.style.setProperty('--line-strong', tokens.lineStrong)
  root.style.setProperty('--ink', tokens.ink)
  root.style.setProperty('--dim', tokens.dim)
  root.style.setProperty('--dimmer', tokens.dimmer)
  root.style.setProperty('--hot', tokens.hot)
  root.style.setProperty('--gold', tokens.gold)
  root.style.setProperty('--mint', tokens.mint)
  root.style.setProperty('--sky', tokens.sky)
  root.style.setProperty('--orchid', tokens.orchid)
  root.style.setProperty('--gold-rgb', hexToRgbString(tokens.gold))
}
