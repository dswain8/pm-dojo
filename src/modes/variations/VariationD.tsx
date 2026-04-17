import { Link } from 'react-router-dom'
import { getStreak, getTotalRounds } from '../../lib/storage'

/**
 * Variation D — "The Playbook"
 * Clean editorial / textbook feel. Centered layout with bold typography,
 * a "principle of the day" callout, and modes presented as chapters.
 * Feels premium and thoughtful — for PMs who take craft seriously.
 */

const PRINCIPLES = [
  { text: 'Front-load the point. If the reader has to dig for your conclusion, you\'ve failed.', source: 'Wes Kao' },
  { text: 'The harder you sell something, the more skeptical people become.', source: 'Wes Kao' },
  { text: 'What would need to be true for this to work?', source: 'Shreyas Doshi' },
  { text: 'Communication is strategy, not self-expression.', source: 'Wes Kao' },
  { text: 'The ceiling is far higher than you think.', source: 'Shreyas Doshi' },
  { text: 'Never bring a problem without a proposed path forward.', source: 'Wes Kao' },
]

const todaysPrinciple = PRINCIPLES[new Date().getDay() % PRINCIPLES.length]

const CHAPTERS = [
  {
    path: '/quick-draw',
    num: '01',
    name: 'Quick Draw',
    tagline: 'Write under pressure',
    desc: 'Real PM scenarios with a ticking clock. Write the Slack message, the email, the meeting response. Get scored on clarity, strategy, and substance.',
    accent: 'border-l-amber-500',
    badge: '4 difficulty levels',
  },
  {
    path: '/rewrite',
    num: '02',
    name: 'Rewrite Arena',
    tagline: 'Fix what\'s broken',
    desc: 'See real examples of bad PM writing — hedging, burying the lede, decision-avoiding. Rewrite them. Compare your version to the model.',
    accent: 'border-l-green-500',
    badge: '5 samples',
  },
  {
    path: '/concept-clinic',
    num: '03',
    name: 'Concept Clinic',
    tagline: 'Know the playbook',
    desc: 'Can you spot the principle at play? Situations from managing up, giving feedback, and navigating politics. Name it and explain how to apply it.',
    accent: 'border-l-blue-500',
    badge: '7 scenarios',
  },
  {
    path: '/scenario',
    num: '04',
    name: 'Scenario Replay',
    tagline: 'Navigate the room',
    desc: 'A VP just interrupted your presentation. What do you do? Multi-step branching scenarios that track trust and effectiveness.',
    accent: 'border-l-purple-500',
    badge: 'Interactive',
  },
]

export function VariationD() {
  const streak = getStreak()
  const total = getTotalRounds()

  return (
    <div className="space-y-12 max-w-2xl mx-auto">
      {/* Hero — editorial style */}
      <div className="text-center pt-12 space-y-6">
        <div className="inline-block">
          <div className="text-[10px] uppercase tracking-[0.3em] text-dojo-accent mb-3">
            A Training Ground for Product Managers
          </div>
          <h1 className="text-6xl font-bold tracking-tight leading-none">
            <span className="text-dojo-accent">PM</span>{' '}
            <span className="text-white">Dojo</span>
          </h1>
        </div>
        <p className="text-dojo-muted max-w-sm mx-auto leading-relaxed">
          Real scenarios. Timed challenges. Expert-level model answers.
          Built on the best PM thinking from Shreyas Doshi, Wes Kao, and April Dunford.
        </p>

        {/* Stats */}
        {total > 0 && (
          <div className="flex justify-center gap-8 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold text-dojo-accent">{total}</div>
              <div className="text-[10px] uppercase tracking-wider text-dojo-muted">rounds</div>
            </div>
            {streak > 0 && (
              <div className="text-center">
                <div className="text-xl font-bold text-orange-500">{streak}</div>
                <div className="text-[10px] uppercase tracking-wider text-dojo-muted">day streak</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Principle of the day */}
      <div className="relative">
        <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-dojo-accent via-dojo-accent/50 to-transparent" />
        <div className="pl-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-dojo-accent mb-2">
            Principle of the Day
          </div>
          <blockquote className="text-lg text-white/90 font-medium leading-relaxed">
            "{todaysPrinciple.text}"
          </blockquote>
          <cite className="text-xs text-dojo-muted mt-2 block not-italic">
            — {todaysPrinciple.source}
          </cite>
        </div>
      </div>

      {/* Chapters */}
      <div className="space-y-4">
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-dojo-muted">
          Choose Your Training
        </h2>
        {CHAPTERS.map((ch) => (
          <Link
            key={ch.path}
            to={ch.path}
            className={`group block rounded-xl border border-dojo-border border-l-2 ${ch.accent}
                       bg-dojo-card p-6 hover:bg-dojo-card/80 transition-all hover:shadow-lg`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-baseline gap-3">
                <span className="text-xs text-dojo-muted/30 font-mono">{ch.num}</span>
                <div>
                  <h3 className="font-bold text-base group-hover:text-dojo-accent transition-colors">
                    {ch.name}
                  </h3>
                  <span className="text-xs text-dojo-muted">{ch.tagline}</span>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-dojo-border text-dojo-muted shrink-0">
                {ch.badge}
              </span>
            </div>
            <p className="text-sm text-dojo-muted/70 leading-relaxed pl-7">
              {ch.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center pb-8">
        <Link
          to="/quick-draw"
          className="dojo-btn-primary inline-block"
        >
          Start with Quick Draw
        </Link>
        {total > 0 && (
          <div className="mt-4">
            <Link to="/progress" className="text-xs text-dojo-muted hover:text-dojo-accent transition-colors">
              View your progress →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
