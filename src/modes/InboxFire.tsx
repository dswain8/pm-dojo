import { useState, useCallback, useMemo, useRef } from 'react'
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

type Phase = 'pick' | 'write' | 'grading' | 'results'

interface GradeResult {
  clarity: number
  strategy: number
  substance: number
  feedback: {
    clarity: string
    strategy: string
    substance: string
  }
  takeaway: string
}

export function InboxFire() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [phase, setPhase] = useState<Phase>('pick')
  const [scenario, setScenario] = useState<QuickDrawScenario | null>(null)
  const [response, setResponse] = useState('')
  const [timerRunning, setTimerRunning] = useState(false)
  const [grade, setGrade] = useState<GradeResult | null>(null)
  const [gradeError, setGradeError] = useState<string | null>(null)
  const responseRef = useRef('')
  const gradingLock = useRef(false)

  const filteredScenarios = useMemo(
    () => QUICK_DRAW_SCENARIOS.filter((s) => s.difficulty === difficulty),
    [difficulty]
  )

  const startRound = useCallback(() => {
    const pool = filteredScenarios
    const pick = pool[Math.floor(Math.random() * pool.length)]
    setScenario(pick)
    setResponse('')
    responseRef.current = ''
    setGrade(null)
    setGradeError(null)
    gradingLock.current = false
    setPhase('write')
    setTimerRunning(true)
  }, [filteredScenarios])

  const runGrading = useCallback(async (answer: string, scen: QuickDrawScenario) => {
    if (gradingLock.current) return
    gradingLock.current = true
    setTimerRunning(false)
    setPhase('grading')
    setGradeError(null)

    try {
      const res = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: {
            title: scen.title,
            setup: scen.setup,
            task: scen.task,
            principles: scen.principles,
            modelAnswer: scen.modelAnswer,
            gradingHints: scen.gradingHints,
          },
          userAnswer: answer,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Grading failed')
      }

      const result = data as GradeResult
      setGrade(result)
      saveSession({
        mode: 'inbox-fire',
        scenarioId: scen.id,
        scenarioTitle: scen.title,
        difficulty: scen.difficulty,
        scores: {
          clarity: result.clarity,
          strategy: result.strategy,
          substance: result.substance,
        },
        timestamp: Date.now(),
      })
      setPhase('results')
    } catch (err) {
      gradingLock.current = false
      setGradeError(err instanceof Error ? err.message : 'Grading failed')
      setPhase('grading')
    }
  }, [])

  const submitResponse = useCallback(() => {
    if (!scenario) return
    void runGrading(responseRef.current, scenario)
  }, [scenario, runGrading])

  const handleExpire = useCallback(() => {
    if (!scenario) return
    void runGrading(responseRef.current, scenario)
  }, [scenario, runGrading])

  const playAgain = useCallback(() => {
    setPhase('pick')
    setScenario(null)
    setGrade(null)
    setGradeError(null)
    gradingLock.current = false
  }, [])

  if (phase === 'pick') {
    return (
      <div className="space-y-8">
        <div>
          <Link to="/" className="text-dojo-muted text-sm hover:text-dojo-accent">
            ← Arena
          </Link>
          <h1 className="text-3xl font-bold mt-4">
            <span className="text-dojo-accent">🔥</span> Inbox Fire
          </h1>
          <p className="text-dojo-muted mt-2">
            You just got tagged. Write fast — then get scored on clarity, strategy, and
            substance.
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
            onChange={(e) => {
              setResponse(e.target.value)
              responseRef.current = e.target.value
            }}
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

  if (phase === 'grading') {
    return (
      <div className="space-y-6 text-center pt-12">
        {gradeError ? (
          <>
            <h2 className="text-xl font-bold">Couldn’t grade that round</h2>
            <p className="text-sm text-dojo-muted max-w-md mx-auto">{gradeError}</p>
            <div className="flex gap-3 justify-center max-w-md mx-auto">
              <button
                onClick={() => {
                  gradingLock.current = false
                  if (scenario) void runGrading(responseRef.current, scenario)
                }}
                className="dojo-btn-primary flex-1"
              >
                Retry
              </button>
              <button onClick={playAgain} className="dojo-btn flex-1">
                New Round
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-4xl animate-pulse">⚔️</div>
            <h2 className="text-xl font-bold">Grading your response…</h2>
            <p className="text-sm text-dojo-muted">
              Scoring clarity, strategy, and substance. If free-tier is busy this can take up to a minute.
            </p>
          </>
        )}
      </div>
    )
  }

  if (!grade) return null

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{scenario.title} — Results</h2>

      <ScoreCard
        scores={[
          {
            label: 'Clarity',
            value: grade.clarity,
            max: 10,
            color: 'dojo-green',
            feedback: grade.feedback.clarity,
          },
          {
            label: 'Strategy',
            value: grade.strategy,
            max: 10,
            color: 'dojo-blue',
            feedback: grade.feedback.strategy,
          },
          {
            label: 'Substance',
            value: grade.substance,
            max: 10,
            color: 'dojo-purple',
            feedback: grade.feedback.substance,
          },
        ]}
        takeaway={grade.takeaway}
        yourResponse={response}
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
