import { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { DifficultyPicker } from '../components/DifficultyPicker'
import {
  type Difficulty,
  type RewriteScenario,
  REWRITE_SCENARIOS,
  DIFFICULTY_COLORS,
} from '../data/scenarios'
import { saveSession } from '../lib/storage'

type Phase = 'pick' | 'rewrite' | 'compare'

export function RewriteArena() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [phase, setPhase] = useState<Phase>('pick')
  const [scenario, setScenario] = useState<RewriteScenario | null>(null)
  const [rewrite, setRewrite] = useState('')

  const filtered = useMemo(
    () => REWRITE_SCENARIOS.filter((s) => s.difficulty === difficulty),
    [difficulty]
  )

  const startRound = useCallback(() => {
    const pick = filtered[Math.floor(Math.random() * filtered.length)]
    setScenario(pick)
    setRewrite('')
    setPhase('rewrite')
  }, [filtered])

  const submit = useCallback(() => {
    if (!scenario) return
    const origWords = scenario.original.split(/\s+/).length
    const newWords = rewrite.split(/\s+/).length
    const cutPct = Math.round(((origWords - newWords) / origWords) * 100)

    saveSession({
      mode: 'rewrite',
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      difficulty: scenario.difficulty,
      scores: { wordsCut: cutPct, flawsTagged: scenario.flaws.length },
      timestamp: Date.now(),
    })
    setPhase('compare')
  }, [scenario, rewrite])

  if (phase === 'pick') {
    return (
      <div className="space-y-8">
        <div>
          <Link to="/" className="text-dojo-muted text-sm hover:text-dojo-accent">← Arena</Link>
          <h1 className="text-3xl font-bold mt-4">
            <span className="text-dojo-green">✏️</span> Rewrite Arena
          </h1>
          <p className="text-dojo-muted mt-2">Bad PM writing. You fix it. Compare against the model.</p>
        </div>
        <div className="dojo-card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted">Difficulty</h2>
          <DifficultyPicker value={difficulty} onChange={setDifficulty} />
          <p className="text-xs text-dojo-muted">{filtered.length} scenario{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={startRound} className="dojo-btn-primary w-full">Enter the Arena</button>
      </div>
    )
  }

  if (!scenario) return null

  if (phase === 'rewrite') {
    return (
      <div className="space-y-6">
        <div>
          <span className={`text-xs font-semibold uppercase tracking-wider ${DIFFICULTY_COLORS[scenario.difficulty]}`}>
            {scenario.difficulty}
          </span>
          <h2 className="text-xl font-bold mt-1">{scenario.title}</h2>
        </div>

        {/* Original */}
        <div className="dojo-card border-dojo-red/30">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-red mb-2">Original ({scenario.original.split(/\s+/).length} words)</h3>
          <p className="text-sm text-dojo-text/70 italic leading-relaxed">{scenario.original}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {scenario.flaws.map((f) => (
              <span key={f.tag} className="text-xs px-2 py-1 rounded-full bg-dojo-red/10 text-dojo-red border border-dojo-red/20">
                {f.tag}
              </span>
            ))}
          </div>
        </div>

        {/* Rewrite area */}
        <div className="dojo-card border-dojo-green/30">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-green mb-2">
            Your Rewrite
          </h3>
          <textarea
            rows={8}
            className="w-full"
            placeholder="Rewrite it. Make every word earn its place."
            value={rewrite}
            onChange={(e) => setRewrite(e.target.value)}
            autoFocus
          />
          {rewrite.trim() && (
            <p className="text-xs text-dojo-muted mt-2">
              {rewrite.split(/\s+/).length} words
              {' · '}
              {Math.round(((scenario.original.split(/\s+/).length - rewrite.split(/\s+/).length) / scenario.original.split(/\s+/).length) * 100)}% shorter
            </p>
          )}
        </div>

        <button
          onClick={submit}
          disabled={rewrite.trim().length < 10}
          className="dojo-btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Compare
        </button>
      </div>
    )
  }

  // Compare phase
  const origWords = scenario.original.split(/\s+/).length
  const rewriteWords = rewrite.split(/\s+/).length
  const modelWords = scenario.modelRewrite.split(/\s+/).length
  const yourCut = Math.round(((origWords - rewriteWords) / origWords) * 100)
  const modelCut = Math.round(((origWords - modelWords) / origWords) * 100)

  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-xl font-bold">{scenario.title} — Comparison</h2>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="dojo-card">
          <div className="text-2xl font-bold text-dojo-red">{origWords}</div>
          <div className="text-xs text-dojo-muted">Original words</div>
        </div>
        <div className="dojo-card">
          <div className="text-2xl font-bold text-dojo-accent">{rewriteWords}</div>
          <div className="text-xs text-dojo-muted">Your words ({yourCut}% cut)</div>
        </div>
        <div className="dojo-card">
          <div className="text-2xl font-bold text-dojo-green">{modelWords}</div>
          <div className="text-xs text-dojo-muted">Model words ({modelCut}% cut)</div>
        </div>
      </div>

      {/* Flaws */}
      <div className="dojo-card">
        <h3 className="text-sm font-semibold text-dojo-red uppercase tracking-wider mb-3">Flaws in the Original</h3>
        <div className="space-y-2">
          {scenario.flaws.map((f) => (
            <div key={f.tag} className="flex gap-2 text-sm">
              <span className="text-dojo-red font-semibold shrink-0">[{f.tag}]</span>
              <span className="text-dojo-text/70">{f.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="dojo-card border-dojo-accent/30">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-accent mb-2">Your Rewrite</h3>
          <p className="text-sm whitespace-pre-wrap">{rewrite}</p>
        </div>
        <div className="dojo-card border-dojo-green/30">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-green mb-2">Model Rewrite</h3>
          <p className="text-sm whitespace-pre-wrap">{scenario.modelRewrite}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => { setPhase('pick'); setScenario(null) }} className="dojo-btn flex-1">New Round</button>
        <Link to="/" className="dojo-btn flex-1 text-center">Back to Arena</Link>
      </div>
    </div>
  )
}
