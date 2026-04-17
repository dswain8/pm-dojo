import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStreak, getTotalRounds } from '../../lib/storage'

/**
 * Variation A — "The Arcade"
 * Full-screen retro game feel. Big animated title, pulsing "INSERT COIN" CTA,
 * modes laid out as arcade cabinet buttons with glow effects.
 * Feels like entering a game — not a tool.
 */

const TAGLINES = [
  'Your manager just asked for a status update. You have 90 seconds.',
  'The CEO wants an "AI story." You don\'t have one.',
  'A VP interrupted your roadmap presentation. The room is watching.',
  'Your project is 2 weeks late. Your manager doesn\'t know yet.',
  'Sales promised a feature you deprioritized. They\'re angry.',
]

const MODES = [
  {
    path: '/quick-draw',
    key: '1',
    name: 'QUICK DRAW',
    desc: 'Write under pressure. Get scored.',
    color: 'from-amber-500/20 to-transparent border-amber-500/30 hover:border-amber-500 hover:shadow-amber-500/20',
    iconBg: 'bg-amber-500/10',
    icon: '⚡',
  },
  {
    path: '/rewrite',
    key: '2',
    name: 'REWRITE',
    desc: 'Fix bad writing. Beat the model.',
    color: 'from-green-500/20 to-transparent border-green-500/30 hover:border-green-500 hover:shadow-green-500/20',
    iconBg: 'bg-green-500/10',
    icon: '✂️',
  },
  {
    path: '/concept-clinic',
    key: '3',
    name: 'CLINIC',
    desc: 'Name the principle. Apply it.',
    color: 'from-blue-500/20 to-transparent border-blue-500/30 hover:border-blue-500 hover:shadow-blue-500/20',
    iconBg: 'bg-blue-500/10',
    icon: '🧠',
  },
  {
    path: '/scenario',
    key: '4',
    name: 'SCENARIO',
    desc: 'Choose your path. Trust tracked.',
    color: 'from-purple-500/20 to-transparent border-purple-500/30 hover:border-purple-500 hover:shadow-purple-500/20',
    iconBg: 'bg-purple-500/10',
    icon: '🎭',
  },
]

export function VariationA() {
  const streak = getStreak()
  const total = getTotalRounds()
  const [taglineIdx, setTaglineIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setTaglineIdx((i) => (i + 1) % TAGLINES.length)
        setVisible(true)
      }, 400)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center -mt-8">
      {/* Title */}
      <div className="text-center mb-2">
        <div className="text-7xl font-bold tracking-tighter">
          <span className="text-dojo-accent">PM</span>{' '}
          <span className="text-white">DOJO</span>
        </div>
      </div>

      {/* Rotating scenario hook */}
      <div className="h-12 flex items-center justify-center mb-10">
        <p
          className={`text-dojo-muted text-sm max-w-lg text-center italic transition-all duration-400 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          "{TAGLINES[taglineIdx]}"
        </p>
      </div>

      {/* Stats row */}
      {total > 0 && (
        <div className="flex gap-6 mb-8 text-xs uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-dojo-accent animate-pulse" />
            <span className="text-dojo-muted">{total} rounds</span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-dojo-muted">{streak} day streak</span>
            </div>
          )}
        </div>
      )}

      {/* Mode buttons — arcade style */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-2xl mb-8">
        {MODES.map((mode) => (
          <Link
            key={mode.path}
            to={mode.path}
            className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br p-5
                       transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${mode.color}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg ${mode.iconBg} flex items-center justify-center text-xl`}>
                {mode.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-dojo-muted/50 font-mono">[{mode.key}]</span>
                  <h2 className="font-bold text-sm tracking-wider">{mode.name}</h2>
                </div>
                <p className="text-xs text-dojo-muted">{mode.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Link
        to="/quick-draw"
        className="group flex items-center gap-2 text-dojo-accent hover:text-white transition-colors"
      >
        <span className="text-sm uppercase tracking-widest font-semibold animate-pulse">
          Start Training
        </span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </Link>

      {/* Footer */}
      <div className="mt-16 text-center text-xs text-dojo-muted/30">
        Built on wisdom from Shreyas Doshi, Wes Kao, April Dunford & more
      </div>
    </div>
  )
}
