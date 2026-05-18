import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MOMENT_CARDS, SKILL_META } from '../data/game'
import { getSessions, getSkillSummary, getStreak } from '../lib/storage'

const SITUATIONS = [
  'Your VP just learned about the slip from someone else.',
  'Sales wants SSO. Your roadmap says no.',
  'The team wants an AI story. The customer problem is still deterministic.',
  'A feature with 3% usage is blocking the migration everyone else needs.',
  'A customer escalation is now political, not just urgent.',
  'The room has turned. You still need to make the recommendation.',
]

export function Home() {
  const [situationIdx, setSituationIdx] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [typing, setTyping] = useState(true)

  const sessions = getSessions()
  const streak = getStreak()
  const skillSummary = getSkillSummary()

  const totalRounds = sessions.length
  const practicedSkills = skillSummary.filter((skill) => skill.rounds > 0).length

  const topSkill = useMemo(() => {
    return [...skillSummary].sort((a, b) => b.rounds - a.rounds)[0] ?? null
  }, [skillSummary])

  useEffect(() => {
    const target = SITUATIONS[situationIdx]
    if (typing) {
      if (displayText.length < target.length) {
        const timer = setTimeout(() => {
          setDisplayText(target.slice(0, displayText.length + 1))
        }, 28)
        return () => clearTimeout(timer)
      }

      const timer = setTimeout(() => setTyping(false), 2200)
      return () => clearTimeout(timer)
    }

    setDisplayText('')
    setSituationIdx((index) => (index + 1) % SITUATIONS.length)
    setTyping(true)
  }, [displayText, situationIdx, typing])

  return (
    <div className="space-y-8">
      <div className="border border-dojo-border rounded-xl overflow-hidden">
        <div className="bg-dojo-border/50 px-4 py-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="text-xs text-dojo-muted ml-2 font-mono">
            pm-dojo flight-sim / isolated branch
          </span>
          <div className="ml-auto flex gap-4 text-xs font-mono">
            <span className="text-dojo-muted/50">
              rounds: <span className="text-blue-400">{totalRounds}</span>
            </span>
            <span className="text-dojo-muted/50">
              streak: <span className="text-orange-400">{streak}d</span>
            </span>
            <span className="text-dojo-muted/50">
              skills: <span className="text-emerald-400">{practicedSkills}/5</span>
            </span>
          </div>
        </div>

        <div className="p-6 font-mono space-y-4">
          <div className="text-xs text-dojo-muted">
            <span className="text-emerald-400">system</span>
            <span className="text-dojo-muted/50"> :: </span>
            train the moment, not the trivia
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

          <div className="space-y-2">
            <div className="text-xs text-dojo-muted">
              <span className="text-emerald-400">situation</span>
              <span className="text-dojo-muted/50"> :: </span>
              <span className="text-white">{displayText}</span>
              <span className="inline-block w-2 h-4 bg-blue-400 ml-0.5 animate-pulse" />
            </div>
            <div className="text-xs text-dojo-muted">
              <span className="text-emerald-400">loop</span>
              <span className="text-dojo-muted/50"> :: </span>
              submit → critique → rewrite → compare
            </div>
            <div className="text-xs text-dojo-muted">
              <span className="text-emerald-400">top_skill</span>
              <span className="text-dojo-muted/50"> :: </span>
              <span className="text-white">
                {topSkill && topSkill.rounds > 0 ? topSkill.label : 'none yet'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-6">
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">PM Moments</h1>
              <p className="text-dojo-muted mt-2">
                Each lane is a live PM moment with a concrete artifact at the end.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOMENT_CARDS.map((card) => (
              <Link
                key={card.path}
                to={card.path}
                className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br from-white/[0.03] to-transparent p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${card.border} ${card.glow}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center text-xl border border-white/[0.05] shrink-0`}
                  >
                    {card.icon}
                  </div>
                  <div className="min-w-0 space-y-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-dojo-muted/40 font-mono">[{card.key}]</span>
                        <h2 className="font-bold text-base">{card.title}</h2>
                      </div>
                      <p className="text-sm text-dojo-muted mt-1">{card.subtitle}</p>
                    </div>

                    <p className="text-sm text-dojo-text/80 leading-relaxed">
                      {card.description}
                    </p>

                    <div className="space-y-1 text-xs text-dojo-muted">
                      <div>
                        <span className="text-dojo-text/90 font-semibold">Cue:</span> {card.cue}
                      </div>
                      <div>
                        <span className="text-dojo-text/90 font-semibold">Artifact:</span> {card.artifact}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {card.skills.map((skill) => (
                        <span
                          key={skill}
                          className={`text-[11px] px-2 py-1 rounded-full border border-white/10 ${SKILL_META[skill].bg} ${SKILL_META[skill].color}`}
                        >
                          {SKILL_META[skill].label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="dojo-card space-y-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted">
              Skill Map
            </h2>
            <p className="text-xs text-dojo-muted mt-2">
              Progress should show what kind of PM reps you are getting, not just which mode you clicked.
            </p>
          </div>

          <div className="space-y-4">
            {skillSummary.map((skill) => (
              <div key={skill.key} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className={`text-sm font-semibold ${SKILL_META[skill.key].color}`}>
                      {skill.label}
                    </div>
                    <div className="text-[11px] text-dojo-muted leading-relaxed">
                      {skill.description}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-dojo-text">{skill.rounds}</div>
                    <div className="text-[11px] text-dojo-muted">reps</div>
                  </div>
                </div>

                <div className="w-full h-2 bg-dojo-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-dojo-accent rounded-full transition-all duration-500"
                    style={{
                      width: `${totalRounds > 0 ? (skill.rounds / totalRounds) * 100 : 0}%`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-dojo-muted">
                  <span>recent: {skill.recentRounds}/10</span>
                  <span>
                    {skill.averagePct !== null
                      ? `avg scored reps: ${Math.round(skill.averagePct * 100)}%`
                      : 'score baseline pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/progress"
            className="group inline-flex items-center gap-2 font-mono text-sm text-dojo-muted hover:text-white transition-colors"
          >
            <span className="text-emerald-400">$</span>
            <span className="uppercase tracking-widest font-semibold">open progress</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>

      <div className="text-center text-[10px] font-mono text-dojo-muted/25 pt-2">
        product_shape: pm moments → artifact reps → skill map | isolated branch: codex/pm-dojo-game-redesign
      </div>
    </div>
  )
}
