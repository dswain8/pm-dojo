import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getStreak, getTotalRounds } from '../../lib/storage'

/**
 * Variation B — "The Challenge Board"
 * Inspired by Duolingo / fitness apps. Each mode is a "challenge" with
 * difficulty tiers shown, completion rings, and a daily challenge prompt
 * front and center. Gamification-forward.
 */

const DAILY_CHALLENGES = [
  { text: 'Rewrite a Slack message in under 40 words', mode: '/rewrite', label: 'Rewrite Arena' },
  { text: 'Survive the Roadmap Ambush scenario', mode: '/scenario', label: 'Scenario Replay' },
  { text: 'Name the principle: The Overseller', mode: '/concept-clinic', label: 'Concept Clinic' },
  { text: 'Draft a status update in 90 seconds', mode: '/quick-draw', label: 'Quick Draw' },
]

const MODES = [
  {
    path: '/quick-draw',
    name: 'Quick Draw',
    desc: 'Timed writing challenges. Graded on clarity, strategy, substance.',
    icon: '⚡',
    levels: ['Intern', 'Mid-Level', 'Senior', 'VP'],
    accent: 'amber',
  },
  {
    path: '/rewrite',
    name: 'Rewrite Arena',
    desc: 'Transform bad PM writing. Compare against expert rewrites.',
    icon: '✂️',
    levels: ['Easy', 'Medium', 'Hard'],
    accent: 'green',
  },
  {
    path: '/concept-clinic',
    name: 'Concept Clinic',
    desc: 'Identify principles from real scenarios. Test your knowledge.',
    icon: '🧠',
    levels: ['Easy', 'Medium', 'Hard', 'Nightmare'],
    accent: 'blue',
  },
  {
    path: '/scenario',
    name: 'Scenario Replay',
    desc: 'Navigate realistic PM situations. Every choice has consequences.',
    icon: '🎭',
    levels: ['The Roadmap Ambush'],
    accent: 'purple',
  },
]

export function VariationB() {
  const streak = getStreak()
  const total = getTotalRounds()
  const [dailyIdx] = useState(Math.floor(Math.random() * DAILY_CHALLENGES.length))
  const daily = DAILY_CHALLENGES[dailyIdx]

  return (
    <div className="space-y-8">
      {/* Header with stats */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-dojo-accent">PM</span> DOJO
          </h1>
          <p className="text-dojo-muted text-sm mt-1">
            Product instincts, sharpened daily.
          </p>
        </div>
        <div className="flex gap-4 items-center">
          {streak > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{streak}</div>
              <div className="text-[10px] uppercase tracking-wider text-dojo-muted">streak</div>
            </div>
          )}
          <div className="text-center">
            <div className="text-2xl font-bold text-dojo-accent">{total}</div>
            <div className="text-[10px] uppercase tracking-wider text-dojo-muted">rounds</div>
          </div>
          <Link
            to="/progress"
            className="w-10 h-10 rounded-full border border-dojo-border flex items-center justify-center
                       hover:border-dojo-accent transition-colors text-dojo-muted hover:text-dojo-accent"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 12L5 6L8 9L14 3" />
              <path d="M10 3H14V7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Daily Challenge — hero card */}
      <Link
        to={daily.mode}
        className="block relative overflow-hidden rounded-2xl border border-dojo-accent/30
                   bg-gradient-to-br from-dojo-accent/10 via-dojo-card to-dojo-card
                   p-6 hover:border-dojo-accent/60 transition-all group"
      >
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-dojo-accent mb-3">
          <div className="w-2 h-2 rounded-full bg-dojo-accent animate-pulse" />
          Daily Challenge
        </div>
        <p className="text-xl font-bold text-white mb-2">
          {daily.text}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-dojo-muted">{daily.label}</span>
          <span className="text-dojo-accent group-hover:translate-x-1 transition-transform text-lg">→</span>
        </div>
        {/* Decorative glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-dojo-accent/5 rounded-full blur-3xl" />
      </Link>

      {/* Mode cards — challenge board style */}
      <div>
        <h2 className="text-xs uppercase tracking-widest text-dojo-muted mb-4">Training Modes</h2>
        <div className="space-y-3">
          {MODES.map((mode) => (
            <Link
              key={mode.path}
              to={mode.path}
              className="group flex items-center gap-4 rounded-xl border border-dojo-border bg-dojo-card
                         p-4 hover:border-dojo-accent/40 transition-all hover:shadow-lg hover:shadow-dojo-accent/5"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-dojo-bg flex items-center justify-center text-2xl shrink-0">
                {mode.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm">{mode.name}</h3>
                <p className="text-xs text-dojo-muted mt-0.5 truncate">{mode.desc}</p>
                {/* Level pills */}
                <div className="flex gap-1.5 mt-2">
                  {mode.levels.map((level, i) => (
                    <span
                      key={level}
                      className={`text-[10px] px-2 py-0.5 rounded-full border
                        ${i === 0 ? 'border-dojo-accent/30 text-dojo-accent' : 'border-dojo-border text-dojo-muted/50'}`}
                    >
                      {level}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <span className="text-dojo-muted group-hover:text-dojo-accent group-hover:translate-x-1 transition-all text-lg shrink-0">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Wisdom quote */}
      <div className="text-center py-6 border-t border-dojo-border">
        <p className="text-xs text-dojo-muted/40 italic">
          "The harder you sell something, the more skeptical people become."
        </p>
        <p className="text-[10px] text-dojo-muted/30 mt-1">— Wes Kao, The Genuine Anti-Sell</p>
      </div>
    </div>
  )
}
