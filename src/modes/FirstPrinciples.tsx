import { useState, useCallback, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { DifficultyPicker } from '../components/DifficultyPicker'
import { ScoreCard } from '../components/ScoreCard'
import {
  type Difficulty,
  type ConceptScenario,
  CONCEPT_SCENARIOS,
  DIFFICULTY_COLORS,
} from '../data/scenarios'
import { saveSession } from '../lib/storage'
import { requestGrade, scoresRecord, type GradeResult } from '../lib/gradeApi'

type Phase = 'pick' | 'think' | 'grading' | 'results'

export function FirstPrinciples() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [phase, setPhase] = useState<Phase>('pick')
  const [scenario, setScenario] = useState<ConceptScenario | null>(null)
  const [principle, setPrinciple] = useState('')
  const [application, setApplication] = useState('')
  const [grade, setGrade] = useState<GradeResult | null>(null)
  const [gradeError, setGradeError] = useState<string | null>(null)
  const gradingLock = useRef(false)
  const principleRef = useRef('')
  const applicationRef = useRef('')

  const filtered = useMemo(
    () => CONCEPT_SCENARIOS.filter((s) => s.difficulty === difficulty),
    [difficulty]
  )

  const startRound = useCallback(() => {
    const pick = filtered[Math.floor(Math.random() * filtered.length)]
    setScenario(pick)
    setPrinciple('')
    setApplication('')
    principleRef.current = ''
    applicationRef.current = ''
    setGrade(null)
    setGradeError(null)
    gradingLock.current = false
    setPhase('think')
  }, [filtered])

  const runGrading = useCallback(async (scen: ConceptScenario) => {
    if (gradingLock.current) return
    gradingLock.current = true
    setPhase('grading')
    setGradeError(null)

    try {
      const result = await requestGrade({
        mode: 'first-principles',
        payload: {
          title: scen.title,
          situation: scen.situation,
          bestAnswer: scen.bestAnswer,
          relatedPrinciples: scen.relatedPrinciples,
          principle: principleRef.current,
          application: applicationRef.current,
        },
      })
      setGrade(result)
      saveSession({
        mode: 'first-principles',
        scenarioId: scen.id,
        scenarioTitle: scen.title,
        difficulty: scen.difficulty,
        scores: scoresRecord(result),
        timestamp: Date.now(),
      })
      setPhase('results')
    } catch (err) {
      gradingLock.current = false
      setGradeError(err instanceof Error ? err.message : 'Grading failed')
      setPhase('grading')
    }
  }, [])

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
            <span className="text-dojo-blue">🧠</span> First Principles
          </h1>
          <p className="text-dojo-muted mt-2">
            Messy problem. Name the principle, apply it — then get AI-scored.
          </p>
        </div>
        <div className="dojo-card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted">
            Difficulty
          </h2>
          <DifficultyPicker value={difficulty} onChange={setDifficulty} />
        </div>
        <button onClick={startRound} className="dojo-btn-primary w-full">
          Start
        </button>
      </div>
    )
  }

  if (!scenario) return null

  if (phase === 'think') {
    return (
      <div className="space-y-6">
        <div>
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${DIFFICULTY_COLORS[scenario.difficulty]}`}
          >
            {scenario.difficulty}
          </span>
          <h2 className="text-xl font-bold mt-1">{scenario.title}</h2>
        </div>

        <div className="dojo-card border-dojo-blue/30">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-blue mb-3">
            Situation
          </h3>
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
              onChange={(e) => {
                setPrinciple(e.target.value)
                principleRef.current = e.target.value
              }}
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
              onChange={(e) => {
                setApplication(e.target.value)
                applicationRef.current = e.target.value
              }}
            />
          </div>
        </div>

        <button
          onClick={() => void runGrading(scenario)}
          disabled={principle.trim().length < 3 || application.trim().length < 10}
          className="dojo-btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Submit for Grading
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
                  void runGrading(scenario)
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
            <div className="text-4xl animate-pulse">🧠</div>
            <h2 className="text-xl font-bold">Grading your thinking…</h2>
            <p className="text-sm text-dojo-muted">
              Scoring identification and application against the best answer.
            </p>
          </>
        )}
      </div>
    )
  }

  if (!grade) return null

  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-xl font-bold">{scenario.title} — Results</h2>

      <ScoreCard
        scores={grade.dimensions.map((d) => ({
          label: d.label,
          value: d.value,
          max: d.max,
          color: 'dojo-blue',
          feedback: d.feedback,
        }))}
        takeaway={grade.takeaway}
        yourResponse={`${principle}\n\n${application}`}
        modelAnswer={`${scenario.bestAnswer.principle}\n\n${scenario.bestAnswer.explanation}`}
        principles={scenario.relatedPrinciples}
      />

      <div className="dojo-card border-dojo-green/30">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-green mb-2">
          Best Answer Source
        </h3>
        <p className="text-sm text-dojo-muted">{scenario.bestAnswer.source}</p>
      </div>

      <div className="flex gap-3">
        <button onClick={playAgain} className="dojo-btn-primary flex-1">
          New Round
        </button>
        <Link to="/" className="dojo-btn flex-1 text-center">
          Back to Arena
        </Link>
      </div>
    </div>
  )
}
