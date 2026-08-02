import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

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

const MODES = [
  { path: '/inbox-fire', key: '1', name: 'INBOX FIRE', desc: 'You just got tagged. React.', icon: '🔥', border: 'border-blue-500/30 hover:border-blue-400', glow: 'hover:shadow-blue-500/20', iconBg: 'bg-blue-500/10' },
  { path: '/the-room', key: '2', name: 'THE ROOM', desc: "You're in a meeting. Navigate it.", icon: '🚪', border: 'border-emerald-500/30 hover:border-emerald-400', glow: 'hover:shadow-emerald-500/20', iconBg: 'bg-emerald-500/10' },
  { path: '/red-pen', key: '3', name: 'RED PEN', desc: 'Bad PM writing. Fix it.', icon: '✂️', border: 'border-indigo-500/30 hover:border-indigo-400', glow: 'hover:shadow-indigo-500/20', iconBg: 'bg-indigo-500/10' },
  { path: '/first-principles', key: '4', name: 'FIRST PRINCIPLES', desc: 'Messy problem. Think it through.', icon: '🧠', border: 'border-slate-500/30 hover:border-slate-400', glow: 'hover:shadow-slate-500/20', iconBg: 'bg-slate-500/10' },
]

const BELT_DISPLAY: Record<string, { emoji: string; color: string }> = {
  white: { emoji: '⬜', color: 'text-gray-300' },
  yellow: { emoji: '🟡', color: 'text-yellow-400' },
  orange: { emoji: '🟠', color: 'text-orange-400' },
  green: { emoji: '🟢', color: 'text-green-400' },
  blue: { emoji: '🔵', color: 'text-blue-400' },
  purple: { emoji: '🟣', color: 'text-purple-400' },
  brown: { emoji: '🟤', color: 'text-amber-700' },
  black: { emoji: '⬛', color: 'text-gray-100' },
}

interface Profile {
  clutch_rating: number
  streak: { current: number; longest: number; last_session_date: string }
  belt: { current: string; sessions_total: number; sessions_to_next: number }
  boss_fights_completed: number
  next_boss_at: number
  titles: string[]
  pattern_watch: { recurring_miss: string | null }
  lifetime_stats: { total_sessions: number; avg_score: number; best_score: number }
}

export function Home() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [situationIdx, setSituationIdx] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [typing, setTyping] = useState(true)

  // Load profile
  useEffect(() => {
    fetch('/progress/profile.json')
      .then(r => r.json())
      .then(setProfile)
      .catch(() => setProfile(null))
  }, [])

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

  const belt = profile ? BELT_DISPLAY[profile.belt.current] || BELT_DISPLAY.white : BELT_DISPLAY.white

  return (
    <div className="space-y-8">
      {/* === TERMINAL HEADER === */}
      <div className="border border-dojo-border rounded-xl overflow-hidden">
        <div className="bg-dojo-border/50 px-4 py-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="text-xs text-dojo-muted ml-2 font-mono">pm-dojo v2.0.0</span>
          {profile && (
            <div className="ml-auto flex gap-4 text-xs font-mono">
              <span className="text-dojo-muted/50">sessions: <span className="text-blue-400">{profile.lifetime_stats.total_sessions}</span></span>
              {profile.streak.current > 0 && (
                <span className="text-dojo-muted/50">streak: <span className="text-orange-400">{profile.streak.current}d 🔥</span></span>
              )}
            </div>
          )}
        </div>

        <div className="p-6 font-mono space-y-3">
          {/* Profile dashboard */}
          {profile && (
            <div className="space-y-1 mb-4 pb-4 border-b border-dojo-border">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-dojo-muted">clutch_rating</span>
                  <span className="text-dojo-muted/50"> :: </span>
                  <span className="text-blue-400 font-bold text-lg">{profile.clutch_rating.toLocaleString()}</span>
                </div>
                <div className="text-sm">
                  <span className={belt.color}>{belt.emoji} {profile.belt.current.toUpperCase()}</span>
                  <span className="text-dojo-muted/40 text-xs ml-2">
                    ({profile.belt.sessions_total}/{profile.belt.sessions_total + profile.belt.sessions_to_next} to next)
                  </span>
                </div>
              </div>

              <div className="h-1 bg-dojo-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${(profile.belt.sessions_total / (profile.belt.sessions_total + profile.belt.sessions_to_next)) * 100}%`
                  }}
                />
              </div>

              {profile.pattern_watch.recurring_miss && (
                <div className="text-xs mt-2">
                  <span className="text-amber-400">pattern_watch</span>
                  <span className="text-dojo-muted/50"> :: </span>
                  <span className="text-dojo-muted">{profile.pattern_watch.recurring_miss.replace(/-/g, ' ')}</span>
                </div>
              )}

              {profile.titles.length > 0 && (
                <div className="text-xs mt-1">
                  <span className="text-purple-400">titles</span>
                  <span className="text-dojo-muted/50"> :: </span>
                  <span className="text-dojo-muted">{profile.titles.join(' | ')}</span>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-dojo-muted">
            <span className="text-emerald-400">system</span>
            <span className="text-dojo-muted/50"> :: </span>
            training module loaded
          </div>

          <div className="py-2">
            <pre className="text-blue-400 text-xs leading-tight select-none text-center">{`
 ██████╗ ███╗   ███╗    ██████╗  ██████╗      ██╗ ██████╗
 ██╔══██╗████╗ ████║    ██╔══██╗██╔═══██╗     ██║██╔═══██╗
 ██████╔╝██╔████╔██║    ██║  ██║██║   ██║     ██║██║   ██║
 ██╔═══╝ ██║╚██╔╝██║    ██║  ██║██║   ██║██   ██║██║   ██║
 ██║     ██║ ╚═╝ ██║    ██████╔╝╚██████╔╝╚█████╔╝╚██████╔╝
 ╚═╝     ╚═╝     ╚═╝    ╚═════╝  ╚═════╝  ╚════╝  ╚═════╝ `}</pre>
          </div>

          <div className="pt-1">
            <span className="text-emerald-400">situation</span>
            <span className="text-dojo-muted/50"> :: </span>
            <span className="text-white">{displayText}</span>
            <span className="inline-block w-2 h-4 bg-blue-400 ml-0.5 animate-pulse" />
          </div>

          <div className="text-xs text-dojo-muted">
            <span className="text-emerald-400">prompt</span>
            <span className="text-dojo-muted/50"> :: </span>
            what do you do?
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-dojo-muted font-mono">
        Timed PM writing drills · AI-graded Inbox Fire · no login
      </p>

      {/* === MODE CARDS === */}
      <div className="grid grid-cols-2 gap-3">
        {MODES.map((mode) => (
          <Link
            key={mode.path}
            to={mode.path}
            className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br from-white/[0.03] to-transparent
                       p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
                       ${mode.border} ${mode.glow}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg ${mode.iconBg} flex items-center justify-center text-xl border border-white/[0.05]`}>
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
        ))}
      </div>

      <div className="flex justify-center">
        <Link
          to="/progress"
          className="group inline-flex items-center gap-2 font-mono text-sm text-dojo-muted hover:text-white transition-colors"
        >
          <span className="text-emerald-400">$</span>
          <span className="uppercase tracking-widest font-semibold">history</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      <div className="text-center text-[10px] font-mono text-dojo-muted/30 pt-4">
        inspired by shreyas doshi · wes kao · april dunford
      </div>
    </div>
  )
}
