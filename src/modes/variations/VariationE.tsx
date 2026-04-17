import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStreak, getTotalRounds } from '../../lib/storage'

/**
 * Variation E — Hybrid: War Room header + Arcade cards
 * Terminal briefing up top (typewriter, ASCII, status line),
 * then arcade-style glowing mode cards below.
 * Supports 3 color palette themes.
 */

const SITUATIONS = [
  'Your VP just blindsided you in a meeting.',
  'The CEO wants to pivot. Your roadmap says no.',
  'You shipped a bug. 200 customers double-charged.',
  'Sales promised a feature you killed last quarter.',
  'Your project is behind. Leadership review is Thursday.',
  'Two VPs disagree. You\'re caught in the middle.',
  'A customer success rep says CSV export is a "dealbreaker."',
  'Your manager asks: "What\'s our AI story?"',
]

export type Palette = 'himalayan' | 'amber' | 'cyan' | 'rose'

const PALETTES: Record<Palette, {
  accent: string; accentBg: string; accentBorder: string; accentGlow: string
  termGreen: string; termLabel: string
  cards: { border: string; glow: string; iconBg: string }[]
}> = {
  amber: {
    accent: 'text-amber-400', accentBg: 'bg-amber-400', accentBorder: 'border-amber-500/30',
    accentGlow: 'shadow-amber-500/20', termGreen: 'text-emerald-400', termLabel: 'text-amber-400',
    cards: [
      { border: 'border-amber-500/30 hover:border-amber-400', glow: 'hover:shadow-amber-500/20', iconBg: 'bg-amber-500/10' },
      { border: 'border-emerald-500/30 hover:border-emerald-400', glow: 'hover:shadow-emerald-500/20', iconBg: 'bg-emerald-500/10' },
      { border: 'border-blue-500/30 hover:border-blue-400', glow: 'hover:shadow-blue-500/20', iconBg: 'bg-blue-500/10' },
      { border: 'border-purple-500/30 hover:border-purple-400', glow: 'hover:shadow-purple-500/20', iconBg: 'bg-purple-500/10' },
    ],
  },
  cyan: {
    accent: 'text-cyan-400', accentBg: 'bg-cyan-400', accentBorder: 'border-cyan-500/30',
    accentGlow: 'shadow-cyan-500/20', termGreen: 'text-cyan-400', termLabel: 'text-cyan-400',
    cards: [
      { border: 'border-cyan-500/30 hover:border-cyan-400', glow: 'hover:shadow-cyan-500/20', iconBg: 'bg-cyan-500/10' },
      { border: 'border-teal-500/30 hover:border-teal-400', glow: 'hover:shadow-teal-500/20', iconBg: 'bg-teal-500/10' },
      { border: 'border-indigo-500/30 hover:border-indigo-400', glow: 'hover:shadow-indigo-500/20', iconBg: 'bg-indigo-500/10' },
      { border: 'border-violet-500/30 hover:border-violet-400', glow: 'hover:shadow-violet-500/20', iconBg: 'bg-violet-500/10' },
    ],
  },
  rose: {
    accent: 'text-rose-400', accentBg: 'bg-rose-400', accentBorder: 'border-rose-500/30',
    accentGlow: 'shadow-rose-500/20', termGreen: 'text-lime-400', termLabel: 'text-rose-400',
    cards: [
      { border: 'border-rose-500/30 hover:border-rose-400', glow: 'hover:shadow-rose-500/20', iconBg: 'bg-rose-500/10' },
      { border: 'border-orange-500/30 hover:border-orange-400', glow: 'hover:shadow-orange-500/20', iconBg: 'bg-orange-500/10' },
      { border: 'border-fuchsia-500/30 hover:border-fuchsia-400', glow: 'hover:shadow-fuchsia-500/20', iconBg: 'bg-fuchsia-500/10' },
      { border: 'border-pink-500/30 hover:border-pink-400', glow: 'hover:shadow-pink-500/20', iconBg: 'bg-pink-500/10' },
    ],
  },
  himalayan: {
    accent: 'text-blue-400', accentBg: 'bg-blue-400', accentBorder: 'border-blue-500/30',
    accentGlow: 'shadow-blue-500/20', termGreen: 'text-emerald-400', termLabel: 'text-blue-400',
    cards: [
      { border: 'border-blue-500/30 hover:border-blue-400', glow: 'hover:shadow-blue-500/20', iconBg: 'bg-blue-500/10' },
      { border: 'border-emerald-500/30 hover:border-emerald-400', glow: 'hover:shadow-emerald-500/20', iconBg: 'bg-emerald-500/10' },
      { border: 'border-indigo-500/30 hover:border-indigo-400', glow: 'hover:shadow-indigo-500/20', iconBg: 'bg-indigo-500/10' },
      { border: 'border-slate-500/30 hover:border-slate-400', glow: 'hover:shadow-slate-500/20', iconBg: 'bg-slate-500/10' },
    ],
  },
}

const MODES = [
  { path: '/inbox-fire', key: '1', name: 'INBOX FIRE', desc: 'You just got tagged. React.', icon: '🔥' },
  { path: '/the-room', key: '2', name: 'THE ROOM', desc: "You're in a meeting. Navigate it.", icon: '🚪' },
  { path: '/red-pen', key: '3', name: 'RED PEN', desc: 'Bad PM writing. Fix it.', icon: '✂️' },
  { path: '/first-principles', key: '4', name: 'FIRST PRINCIPLES', desc: 'Messy problem. Think it through.', icon: '🧠' },
]

interface Props {
  palette?: Palette
}

export function VariationE({ palette = 'amber' }: Props) {
  const streak = getStreak()
  const total = getTotalRounds()
  const p = PALETTES[palette]

  const [situationIdx, setSituationIdx] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [typing, setTyping] = useState(true)

  // Typewriter effect
  useEffect(() => {
    const target = SITUATIONS[situationIdx]
    if (typing) {
      if (displayText.length < target.length) {
        const timer = setTimeout(() => setDisplayText(target.slice(0, displayText.length + 1)), 30)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => setTyping(false), 2500)
        return () => clearTimeout(timer)
      }
    } else {
      setDisplayText('')
      setSituationIdx((i) => (i + 1) % SITUATIONS.length)
      setTyping(true)
    }
  }, [displayText, typing, situationIdx])

  return (
    <div className="space-y-8">
      {/* === WAR ROOM TERMINAL HEADER === */}
      <div className="border border-dojo-border rounded-xl overflow-hidden">
        {/* Title bar */}
        <div className="bg-dojo-border/50 px-4 py-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="text-xs text-dojo-muted ml-2 font-mono">pm-dojo v1.0.0</span>
          {/* Stats in title bar */}
          <div className="ml-auto flex gap-4 text-xs font-mono">
            <span className="text-dojo-muted/50">sessions: <span className={p.accent}>{total}</span></span>
            {streak > 0 && (
              <span className="text-dojo-muted/50">streak: <span className="text-orange-400">{streak}d 🔥</span></span>
            )}
          </div>
        </div>

        {/* Terminal body */}
        <div className="p-6 font-mono space-y-3">
          <div className="text-xs text-dojo-muted">
            <span className={p.termGreen}>system</span>
            <span className="text-dojo-muted/50"> :: </span>
            training module loaded
          </div>

          {/* ASCII title */}
          <div className="py-2">
            <pre className={`${p.accent} text-xs leading-tight select-none text-center`}>{`
 ██████╗ ███╗   ███╗    ██████╗  ██████╗      ██╗ ██████╗
 ██╔══██╗████╗ ████║    ██╔══██╗██╔═══██╗     ██║██╔═══██╗
 ██████╔╝██╔████╔██║    ██║  ██║██║   ██║     ██║██║   ██║
 ██╔═══╝ ██║╚██╔╝██║    ██║  ██║██║   ██║██   ██║██║   ██║
 ██║     ██║ ╚═╝ ██║    ██████╔╝╚██████╔╝╚█████╔╝╚██████╔╝
 ╚═╝     ╚═╝     ╚═╝    ╚═════╝  ╚═════╝  ╚════╝  ╚═════╝ `}</pre>
          </div>

          {/* Situation typewriter */}
          <div className="pt-1">
            <span className={p.termGreen}>situation</span>
            <span className="text-dojo-muted/50"> :: </span>
            <span className="text-white">{displayText}</span>
            <span className={`inline-block w-2 h-4 ${p.accentBg} ml-0.5 animate-pulse`} />
          </div>

          <div className="text-xs text-dojo-muted">
            <span className={p.termGreen}>prompt</span>
            <span className="text-dojo-muted/50"> :: </span>
            what do you do?
          </div>
        </div>
      </div>

      {/* === ARCADE MODE CARDS === */}
      <div className="grid grid-cols-2 gap-3">
        {MODES.map((mode, i) => {
          const card = p.cards[i]
          return (
            <Link
              key={mode.path}
              to={mode.path}
              className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br from-white/[0.03] to-transparent
                         p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
                         ${card.border} ${card.glow}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center text-xl
                                border border-white/[0.05]`}>
                  {mode.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-dojo-muted/40 font-mono">[{mode.key}]</span>
                    <h2 className="font-bold text-sm tracking-wider">{mode.name}</h2>
                  </div>
                  <p className="text-xs text-dojo-muted mt-0.5">{mode.desc}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Start CTA */}
      <div className="text-center">
        <Link
          to="/inbox-fire"
          className={`group inline-flex items-center gap-2 font-mono text-sm ${p.accent} hover:text-white transition-colors`}
        >
          <span className={p.termGreen}>$</span>
          <span className="uppercase tracking-widest font-semibold">start training</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] font-mono text-dojo-muted/20 pt-4">
        knowledge_base: shreyas_doshi, wes_kao, april_dunford | modules: 4 | scenarios: 12+
      </div>
    </div>
  )
}
