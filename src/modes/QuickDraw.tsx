import { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Timer } from '../components/Timer'
import { ScoreCard } from '../components/ScoreCard'
import { DifficultyPicker } from '../components/DifficultyPicker'
import {
  type Difficulty,
  type QuickDrawScenario,
  QUICK_DRAW_SCENARIOS,
  DIFFICULTY_TIME,
  DIFFICULTY_COLORS,
} from '../data/scenarios'
import { saveSession } from '../lib/storage'

type Phase = 'pick' | 'write' | 'self-grade' | 'results'

export function QuickDraw() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [phase, setPhase] = useState<Phase>('pick')
  const [scenario, setScenario] = useState<QuickDrawScenario | null>(null)
  const [response, setResponse] = useState('')
  const [timerRunning, setTimerRunning] = useState(false)
  const [scores, setScores] = useState({ clarity: 5, strategy: 5, substance: 5 })

  const filteredScenarios = useMemo(
    () => QUICK_DRAW_SCENARIOS.filter((s) => s.difficulty === difficulty),
    [difficulty]
  )

  const startRound = useCallback(() => {
    const pool = filteredScenarios
    const pick = pool[Math.floor(Math.random() * pool.length)]
    setScenario(pick)
    setResponse('')
    setScores({ clarity: 5, strategy: 5, substance: 5 })
    setPhase('write')
    setTimerRunning(true)
  }, [filteredScenarios])

  const submitResponse = useCallback(() => {
    setTimerRunning(false)
    setPhase('self-grade')
  }, [])

  const handleExpire = useCallback(() => {
    setTimerRunning(false)
    setPhase('self-grade')
  }, [])

  const finalizeScores = useCallback(() => {
    if (!scenario) return
    saveSession({
      mode: 'quick-draw',
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      difficulty: scenario.difficulty,
      scores,
      timestamp: Date.now(),
    })
    setPhase('results')
  }, [scenario, scores])

  const playAgain = useCallback(() => {
    setPhase('pick')
    setScenario(null)
  }, [])

  if (phase === 'pick') {
    return (
      <div className="space-y-8">
        <div>
          <Link to="/" className="text-dojo-muted text-sm hover:text-dojo-accent">
            ← Arena
          </Link>
          <h1 className="text-3xl font-bold mt-4">
            <span className="text-dojo-accent">⚡</span> Quick Draw
          </h1>
          <p className="text-dojo-muted mt-2">
            I give you a scenario. You write the response. Grade yourself honestly.
          </p>
        </div>

        <div className="dojo-card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted">
            Difficulty
          </h2>
          <DifficultyPicker value={difficulty} onChange={setDifficulty} />
          <p className="text-xs text-dojo-muted">
            {DIFFICULTY_TIME[difficulty]}s timer · {filteredScenarios.length} scenario
            {filteredScenarios.length !== 1 ? 's' : ''}
          </p>
        </div>

        <button onClick={startRound} className="dojo-btn-primary w-full">
          Draw!
        </button>
      </div>
    )
  }

  if (!scenario) return null

  if (phase === 'write') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${DIFFICULTY_COLORS[scenario.difficulty]}`}
            >
              {scenario.difficulty}
            </span>
            <h2 className="text-xl font-bold mt-1">{scenario.title}</h2>
          </div>
          <Timer
            seconds={DIFFICULTY_TIME[scenario.difficulty]}
            running={timerRunning}
            onExpire={handleExpire}
          />
        </div>

        <div className="dojo-card">
          <p className="text-sm text-dojo-text/80">{scenario.setup}</p>
        </div>

        <div className="dojo-card border-dojo-accent/30">
          <p className="text-sm font-semibold text-dojo-accent mb-3">
            YOUR TASK: {scenario.task}
          </p>
          <textarea
            rows={8}
            className="w-full"
            placeholder="Start writing..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            autoFocus
          />
        </div>

        <button
          onClick={submitResponse}
          disabled={response.trim().length < 10}
          className="dojo-btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Submit Response
        </button>
      </div>
    )
  }

  if (phase === 'self-grade') {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Grade Yourself</h2>
        <p className="text-sm text-dojo-muted">
          Be honest. Read the grading hints, then score each dimension 0-10.
        </p>

        {/* Show their response */}
        <div className="dojo-card">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-muted mb-2">
            Your Response
          </h3>
          <p className="text-sm whitespace-pre-wrap">{response}</p>
        </div>

        {/* Grading sliders */}
        {(
          [
            { key: 'clarity' as const, label: 'Clarity', hint: scenario.gradingHints.clarity },
            { key: 'strategy' as const, label: 'Strategy', hint: scenario.gradingHints.strategy },
            { key: 'substance' as const, label: 'Substance', hint: scenario.gradingHints.substance },
          ] as const
        ).map(({ key, label, hint }) => (
          <div key={key} className="dojo-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{label}</h3>
              <span className="text-2xl font-bold text-dojo-accent tabular-nums">
                {scores[key]}
              </span>
            </div>
            <p className="text-xs text-dojo-muted">{hint}</p>
            <input
              type="range"
              min={0}
              max={10}
              value={scores[key]}
              onChange={(e) =>
                setScores((s) => ({ ...s, [key]: parseInt(e.target.value) }))
              }
              className="w-full accent-dojo-accent"
            />
            <div className="flex justify-between text-xs text-dojo-muted">
              <span>0 — rough</span>
              <span>5 — decent</span>
              <span>10 — nailed it</span>
            </div>
          </div>
        ))}

        <button onClick={finalizeScores} className="dojo-btn-primary w-full">
          See Results
        </button>
      </div>
    )
  }

  // Results
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{scenario.title} — Results</h2>

      <ScoreCard
        scores={[
          {
            label: 'Clarity',
            value: scores.clarity,
            max: 10,
            color: 'dojo-green',
            feedback: scenario.gradingHints.clarity,
          },
          {
            label: 'Strategy',
            value: scores.strategy,
            max: 10,
            color: 'dojo-blue',
            feedback: scenario.gradingHints.strategy,
          },
          {
            label: 'Substance',
            value: scores.substance,
            max: 10,
            color: 'dojo-purple',
            feedback: scenario.gradingHints.substance,
          },
        ]}
        modelAnswer={scenario.modelAnswer}
        principles={scenario.principles}
      />

      <div className="flex gap-3">
        <button onClick={playAgain} className="dojo-btn flex-1">
          New Round
        </button>
        <Link to="/" className="dojo-btn flex-1 text-center">
          Back to Arena
        </Link>
      </div>
    </div>
  )
}
