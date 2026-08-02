import { useState, useCallback, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { DifficultyPicker } from '../components/DifficultyPicker'
import { ScoreCard } from '../components/ScoreCard'
import {
  type Difficulty,
  type RewriteScenario,
  REWRITE_SCENARIOS,
  DIFFICULTY_COLORS,
} from '../data/scenarios'
import { saveSession } from '../lib/storage'
import { requestGrade, scoresRecord, type GradeResult } from '../lib/gradeApi'

type Phase = 'pick' | 'rewrite' | 'grading' | 'results'

export function RedPen() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [phase, setPhase] = useState<Phase>('pick')
  const [scenario, setScenario] = useState<RewriteScenario | null>(null)
  const [rewrite, setRewrite] = useState('')
  const [grade, setGrade] = useState<GradeResult | null>(null)
  const [gradeError, setGradeError] = useState<string | null>(null)
  const rewriteRef = useRef('')
  const gradingLock = useRef(false)

  const filtered = useMemo(
    () => REWRITE_SCENARIOS.filter((s) => s.difficulty === difficulty),
    [difficulty]
  )

  const startRound = useCallback(() => {
    const pick = filtered[Math.floor(Math.random() * filtered.length)]
    setScenario(pick)
    setRewrite('')
    rewriteRef.current = ''
    setGrade(null)
    setGradeError(null)
    gradingLock.current = false
    setPhase('rewrite')
  }, [filtered])

  const runGrading = useCallback(async (scen: RewriteScenario) => {
    if (gradingLock.current) return
    gradingLock.current = true
    setPhase('grading')
    setGradeError(null)

    try {
      const result = await requestGrade({
        mode: 'red-pen',
        payload: {
          title: scen.title,
          original: scen.original,
          flaws: scen.flaws,
          modelRewrite: scen.modelRewrite,
          rewrite: rewriteRef.current,
        },
      })
      setGrade(result)

      const origWords = scen.original.split(/\s+/).length
      const newWords = rewriteRef.current.split(/\s+/).filter(Boolean).length
      const cutPct = Math.round(((origWords - newWords) / origWords) * 100)

      saveSession({
        mode: 'red-pen',
        scenarioId: scen.id,
        scenarioTitle: scen.title,
        difficulty: scen.difficulty,
        scores: { ...scoresRecord(result), wordsCut: cutPct },
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
            <span className="text-dojo-green">✂️</span> Red Pen
          </h1>
          <p className="text-dojo-muted mt-2">
            Bad PM writing. Fix it — then get scored on clarity, conciseness, and flaws
            fixed.
          </p>
        </div>
        <div className="dojo-card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted">
            Difficulty
          </h2>
          <DifficultyPicker value={difficulty} onChange={setDifficulty} />
          <p className="text-xs text-dojo-muted">
            {filtered.length} scenario{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={startRound} className="dojo-btn-primary w-full">
          Enter the Arena
        </button>
      </div>
    )
  }

  if (!scenario) return null

  if (phase === 'rewrite') {
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

        <div className="dojo-card border-dojo-red/30">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-red mb-2">
            Original ({scenario.original.split(/\s+/).length} words)
          </h3>
          <p className="text-sm text-dojo-text/70 italic leading-relaxed">
            {scenario.original}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {scenario.flaws.map((f) => (
              <span
                key={f.tag}
                className="text-xs px-2 py-1 rounded-full bg-dojo-red/10 text-dojo-red border border-dojo-red/20"
              >
                {f.tag}
              </span>
            ))}
          </div>
        </div>

        <div className="dojo-card border-dojo-green/30">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-green mb-2">
            Your Rewrite
          </h3>
          <textarea
            rows={8}
            className="w-full"
            placeholder="Rewrite it. Make every word earn its place."
            value={rewrite}
            onChange={(e) => {
              setRewrite(e.target.value)
              rewriteRef.current = e.target.value
            }}
            autoFocus
          />
          {rewrite.trim() && (
            <p className="text-xs text-dojo-muted mt-2">
              {rewrite.split(/\s+/).filter(Boolean).length} words
              {' · '}
              {Math.round(
                ((scenario.original.split(/\s+/).length -
                  rewrite.split(/\s+/).filter(Boolean).length) /
                  scenario.original.split(/\s+/).length) *
                  100
              )}
              % shorter
            </p>
          )}
        </div>

        <button
          onClick={() => void runGrading(scenario)}
          disabled={rewrite.trim().length < 10}
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
            <div className="text-4xl animate-pulse">✂️</div>
            <h2 className="text-xl font-bold">Grading your rewrite…</h2>
            <p className="text-sm text-dojo-muted">
              Scoring clarity, conciseness, and how well you fixed the flaws.
            </p>
          </>
        )}
      </div>
    )
  }

  if (!grade) return null

  const origWords = scenario.original.split(/\s+/).length
  const rewriteWords = rewrite.split(/\s+/).filter(Boolean).length
  const modelWords = scenario.modelRewrite.split(/\s+/).length
  const yourCut = Math.round(((origWords - rewriteWords) / origWords) * 100)
  const modelCut = Math.round(((origWords - modelWords) / origWords) * 100)

  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-xl font-bold">{scenario.title} — Results</h2>

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

      <ScoreCard
        scores={grade.dimensions.map((d) => ({
          label: d.label,
          value: d.value,
          max: d.max,
          color: 'dojo-green',
          feedback: d.feedback,
        }))}
        takeaway={grade.takeaway}
        yourResponse={rewrite}
        modelAnswer={scenario.modelRewrite}
        principles={scenario.flaws.map((f) => f.tag)}
      />

      <div className="dojo-card">
        <h3 className="text-sm font-semibold text-dojo-red uppercase tracking-wider mb-3">
          Flaws in the Original
        </h3>
        <div className="space-y-2">
          {scenario.flaws.map((f) => (
            <div key={f.tag} className="flex gap-2 text-sm">
              <span className="text-dojo-red font-semibold shrink-0">[{f.tag}]</span>
              <span className="text-dojo-text/70">{f.description}</span>
            </div>
          ))}
        </div>
      </div>

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
