import { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { DifficultyPicker } from '../components/DifficultyPicker'
import { type Difficulty, CONCEPT_SCENARIOS, DIFFICULTY_COLORS } from '../data/scenarios'
import { saveSession } from '../lib/storage'

type Phase = 'pick' | 'think' | 'answer' | 'reveal'

export function FirstPrinciples() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [phase, setPhase] = useState<Phase>('pick')
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [principle, setPrinciple] = useState('')
  const [application, setApplication] = useState('')
  const [selfScore, setSelfScore] = useState({ identification: 3, application: 3 })

  const filtered = useMemo(
    () => CONCEPT_SCENARIOS.filter((s) => s.difficulty === difficulty),
    [difficulty]
  )

  const scenario = filtered[scenarioIdx] ?? null

  const startRound = useCallback(() => {
    setScenarioIdx(Math.floor(Math.random() * filtered.length))
    setPrinciple('')
    setApplication('')
    setSelfScore({ identification: 3, application: 3 })
    setPhase('think')
  }, [filtered])

  const submitAnswer = useCallback(() => {
    setPhase('reveal')
  }, [])

  const saveAndNext = useCallback(() => {
    if (!scenario) return
    saveSession({
      mode: 'first-principles',
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      difficulty: scenario.difficulty,
      scores: selfScore,
      timestamp: Date.now(),
    })
    setPhase('pick')
  }, [scenario, selfScore])

  if (phase === 'pick') {
    return (
      <div className="space-y-8">
        <div>
          <Link to="/" className="text-dojo-muted text-sm hover:text-dojo-accent">← Arena</Link>
          <h1 className="text-3xl font-bold mt-4">
            <span className="text-dojo-blue">🧠</span> First Principles
          </h1>
          <p className="text-dojo-muted mt-2">Messy problem. No frameworks to name — just think it through.</p>
        </div>
        <div className="dojo-card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted">Difficulty</h2>
          <DifficultyPicker value={difficulty} onChange={setDifficulty} />
        </div>
        <button onClick={startRound} className="dojo-btn-primary w-full">Start</button>
      </div>
    )
  }

  if (!scenario) return null

  if (phase === 'think') {
    return (
      <div className="space-y-6">
        <div>
          <span className={`text-xs font-semibold uppercase tracking-wider ${DIFFICULTY_COLORS[scenario.difficulty]}`}>
            {scenario.difficulty}
          </span>
          <h2 className="text-xl font-bold mt-1">{scenario.title}</h2>
        </div>

        <div className="dojo-card border-dojo-blue/30">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-blue mb-3">Situation</h3>
          <p className="text-sm leading-relaxed">{scenario.situation}</p>
        </div>

        <div className="dojo-card space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-dojo-muted block mb-2">
              What principle is at play?
            </label>
            <input
              type="text"
              className="w-full bg-dojo-card border border-dojo-border rounded-lg px-4 py-3 text-sm
                         focus:outline-none focus:border-dojo-accent/50 focus:ring-1 focus:ring-dojo-accent/30"
              placeholder="Name the principle..."
              value={principle}
              onChange={(e) => setPrinciple(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-dojo-muted block mb-2">
              How would you apply it here?
            </label>
            <textarea
              rows={4}
              className="w-full"
              placeholder="Explain what the PM should do differently and why..."
              value={application}
              onChange={(e) => setApplication(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={submitAnswer}
          disabled={principle.trim().length < 3 || application.trim().length < 10}
          className="dojo-btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Reveal Answer
        </button>
      </div>
    )
  }

  // Reveal
  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-xl font-bold">{scenario.title} — Answer</h2>

      {/* Side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="dojo-card border-dojo-accent/30">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-accent mb-2">Your Answer</h3>
          <p className="text-sm font-semibold mb-2">{principle}</p>
          <p className="text-sm text-dojo-text/70">{application}</p>
        </div>
        <div className="dojo-card border-dojo-green/30">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-green mb-2">Best Answer</h3>
          <p className="text-sm font-semibold mb-1">{scenario.bestAnswer.principle}</p>
          <p className="text-xs text-dojo-muted mb-2">Source: {scenario.bestAnswer.source}</p>
          <p className="text-sm text-dojo-text/70">{scenario.bestAnswer.explanation}</p>
        </div>
      </div>

      {/* Related principles */}
      <div className="flex flex-wrap gap-2">
        {scenario.relatedPrinciples.map((p) => (
          <span key={p} className="text-xs px-2 py-1 rounded-full border border-dojo-border text-dojo-muted">{p}</span>
        ))}
      </div>

      {/* Self-scoring */}
      <div className="dojo-card space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted">Score Yourself</h3>
        {([
          { key: 'identification' as const, label: 'Identification (0-5)', hint: 'Did you name the right principle?' },
          { key: 'application' as const, label: 'Application (0-5)', hint: 'Was your application specific and actionable?' },
        ]).map(({ key, label, hint }) => (
          <div key={key}>
            <div className="flex justify-between items-center">
              <span className="text-sm">{label}</span>
              <span className="text-xl font-bold text-dojo-accent">{selfScore[key]}</span>
            </div>
            <p className="text-xs text-dojo-muted mb-1">{hint}</p>
            <input
              type="range" min={0} max={5}
              value={selfScore[key]}
              onChange={(e) => setSelfScore((s) => ({ ...s, [key]: parseInt(e.target.value) }))}
              className="w-full accent-dojo-accent"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={saveAndNext} className="dojo-btn-primary flex-1">Save & New Round</button>
        <Link to="/" className="dojo-btn flex-1 text-center">Back to Arena</Link>
      </div>
    </div>
  )
}
