import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStreak, getTotalRounds } from '../../lib/storage'

/**
 * Variation C — "The War Room"
 * Dark, intense, mission-briefing aesthetic. The home page feels like
 * you're about to enter a high-stakes situation. Monospace everything,
 * terminal-inspired UI, blinking cursors, status indicators.
 */

const SITUATIONS = [
  'Your VP just blindsided you in a meeting.',
  'The CEO wants to pivot. Your roadmap says no.',
  'You shipped a bug. 200 customers double-charged.',
  'Sales promised a feature you killed last quarter.',
  'Your project is behind. Leadership review is Thursday.',
  'Two VPs disagree. You\'re caught in the middle.',
]

export function VariationC() {
  const streak = getStreak()
  const total = getTotalRounds()
  const [situationIdx, setSituationIdx] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [typing, setTyping] = useState(true)

  // Typewriter effect
  useEffect(() => {
    const target = SITUATIONS[situationIdx]
    if (typing) {
      if (displayText.length < target.length) {
        const timer = setTimeout(() => setDisplayText(target.slice(0, displayText.length + 1)), 35)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => setTyping(false), 2000)
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
      {/* Terminal header */}
      <div className="border border-dojo-border rounded-xl overflow-hidden">
        {/* Title bar */}
        <div className="bg-dojo-border/50 px-4 py-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="text-xs text-dojo-muted ml-2 font-mono">pm-dojo v1.0.0</span>
        </div>

        {/* Terminal body */}
        <div className="p-6 font-mono space-y-4">
          <div className="text-xs text-dojo-muted">
            <span className="text-dojo-green">system</span>
            <span className="text-dojo-muted/50"> :: </span>
            training module loaded
          </div>

          {/* Big title */}
          <div>
            <pre className="text-dojo-accent text-xs leading-tight select-none">{`
 ██████╗ ███╗   ███╗    ██████╗  ██████╗      ██╗ ██████╗
 ██╔══██╗████╗ ████║    ██╔══██╗██╔═══██╗     ██║██╔═══██╗
 ██████╔╝██╔████╔██║    ██║  ██║██║   ██║     ██║██║   ██║
 ██╔═══╝ ██║╚██╔╝██║    ██║  ██║██║   ██║██   ██║██║   ██║
 ██║     ██║ ╚═╝ ██║    ██████╔╝╚██████╔╝╚█████╔╝╚██████╔╝
 ╚═╝     ╚═╝     ╚═╝    ╚═════╝  ╚═════╝  ╚════╝  ╚═════╝ `}</pre>
          </div>

          {/* Situation prompt */}
          <div className="pt-2">
            <span className="text-dojo-green">situation</span>
            <span className="text-dojo-muted/50"> :: </span>
            <span className="text-white">{displayText}</span>
            <span className="inline-block w-2 h-4 bg-dojo-accent ml-0.5 animate-pulse" />
          </div>

          <div className="text-xs text-dojo-muted">
            <span className="text-dojo-green">prompt</span>
            <span className="text-dojo-muted/50"> :: </span>
            what do you do?
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-xs pt-2 border-t border-dojo-border">
            <div>
              <span className="text-dojo-muted/50">sessions:</span>{' '}
              <span className="text-dojo-accent">{total}</span>
            </div>
            <div>
              <span className="text-dojo-muted/50">streak:</span>{' '}
              <span className={streak > 0 ? 'text-orange-500' : 'text-dojo-muted/30'}>{streak}d</span>
            </div>
            <div>
              <span className="text-dojo-muted/50">status:</span>{' '}
              <span className="text-dojo-green">ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission select */}
      <div>
        <div className="text-xs font-mono text-dojo-muted mb-3 flex items-center gap-2">
          <span className="text-dojo-green">$</span> select training_module
        </div>

        <div className="grid grid-cols-1 gap-2">
          {[
            { path: '/quick-draw', key: '01', name: 'QUICK_DRAW', desc: 'Timed response writing — scored on clarity, strategy, substance', status: 'active', color: 'text-amber-500' },
            { path: '/rewrite', key: '02', name: 'REWRITE_ARENA', desc: 'Identify and fix bad PM writing patterns', status: 'active', color: 'text-green-500' },
            { path: '/concept-clinic', key: '03', name: 'CONCEPT_CLINIC', desc: 'Pattern recognition — name the principle at play', status: 'active', color: 'text-blue-500' },
            { path: '/scenario', key: '04', name: 'SCENARIO_REPLAY', desc: 'Branching narrative — trust and effectiveness tracked', status: 'active', color: 'text-purple-500' },
          ].map((mode) => (
            <Link
              key={mode.path}
              to={mode.path}
              className="group flex items-center gap-4 rounded-lg border border-dojo-border bg-dojo-card
                         px-4 py-3 hover:border-dojo-accent/40 transition-all font-mono"
            >
              <span className="text-dojo-muted/30 text-xs">[{mode.key}]</span>
              <span className={`font-bold text-sm ${mode.color}`}>{mode.name}</span>
              <span className="text-xs text-dojo-muted/50 flex-1 truncate">{mode.desc}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-dojo-green animate-pulse" />
                <span className="text-[10px] text-dojo-green">{mode.status}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick start */}
      <div className="text-center">
        <Link
          to="/quick-draw"
          className="inline-flex items-center gap-2 font-mono text-sm text-dojo-accent hover:text-white transition-colors"
        >
          <span className="text-dojo-green">$</span> start --mode quick_draw
          <span className="animate-pulse">_</span>
        </Link>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] font-mono text-dojo-muted/20 pt-4">
        knowledge_base: shreyas_doshi, wes_kao, april_dunford | modules: 4 | scenarios: 12+
      </div>
    </div>
  )
}
