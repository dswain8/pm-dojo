import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ScoreCard } from '../components/ScoreCard'
import { DifficultyPicker } from '../components/DifficultyPicker'
import { DECISION_DRILL_SCENARIOS, type DecisionDrillScenario } from '../data/game'
import { type Difficulty, DIFFICULTY_COLORS } from '../data/scenarios'
import { saveSession } from '../lib/storage'

type DraftKey = 'decision' | 'outcome' | 'assumptions' | 'tradeoffs' | 'recommendation'
type Phase = 'pick' | 'write' | 'score' | 'results'

type DraftState = Record<DraftKey, string>
type ScoreState = Record<DraftKey, number>

const SECTION_META: Array<{
  key: DraftKey
  label: string
  hint: string
  placeholder: string
}> = [
  {
    key: 'decision',
    label: '1. What decision are you making?',
    hint: 'State the actual call. Do not write a topic sentence.',
    placeholder: 'Example: Do not pull SSO into the next release yet.',
  },
  {
    key: 'outcome',
    label: '2. What outcome matters most?',
    hint: 'Anchor the decision to business impact, not to a loud stakeholder.',
    placeholder: 'Example: Protect self-serve activation because it has broader product leverage.',
  },
  {
    key: 'assumptions',
    label: '3. What would need to be true?',
    hint: 'List the load-bearing assumptions that would justify changing your mind.',
    placeholder: 'Example: The deals are real, time-bound, and large enough to outweigh the roadmap cost.',
  },
  {
    key: 'tradeoffs',
    label: '4. What are the tradeoffs?',
    hint: 'Name what gets worse if you choose this path.',
    placeholder: 'Example: We may take near-term enterprise pain to protect the broader activation bet.',
  },
  {
    key: 'recommendation',
    label: '5. What is the next move?',
    hint: 'End with an executable recommendation and follow-up path.',
    placeholder: 'Example: Validate the deal data in 48 hours, then decide in exec review with explicit cutline.',
  },
]

function emptyDraft(): DraftState {
  return {
    decision: '',
    outcome: '',
    assumptions: '',
    tradeoffs: '',
    recommendation: '',
  }
}

function emptyScores(): ScoreState {
  return {
    decision: 3,
    outcome: 3,
    assumptions: 3,
    tradeoffs: 3,
    recommendation: 3,
  }
}

function renderAnswer(answer: DraftState | DecisionDrillScenario['modelAnswer']) {
  return SECTION_META.map((section) => (
    <div key={section.key} className="space-y-1">
      <h4 className="text-xs uppercase tracking-wider text-dojo-muted">{section.label}</h4>
      <p className="text-sm text-dojo-text/80 whitespace-pre-wrap">
        {answer[section.key] || '—'}
      </p>
    </div>
  ))
}

export function FirstPrinciples() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [phase, setPhase] = useState<Phase>('pick')
  const [scenario, setScenario] = useState<DecisionDrillScenario | null>(null)
  const [draft, setDraft] = useState<DraftState>(emptyDraft)
  const [scores, setScores] = useState<ScoreState>(emptyScores)

  const filtered = useMemo(
    () => DECISION_DRILL_SCENARIOS.filter((item) => item.difficulty === difficulty),
    [difficulty]
  )

  const startRound = useCallback(() => {
    const pick = filtered[Math.floor(Math.random() * filtered.length)]
    setScenario(pick)
    setDraft(emptyDraft())
    setScores(emptyScores())
    setPhase('write')
  }, [filtered])

  const submitDraft = useCallback(() => {
    setPhase('score')
  }, [])

  const finalizeRound = useCallback(() => {
    if (!scenario) return

    saveSession({
      mode: 'first-principles',
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      difficulty: scenario.difficulty,
      scores,
      scoreMax: {
        decision: 5,
        outcome: 5,
        assumptions: 5,
        tradeoffs: 5,
        recommendation: 5,
      },
      skills: scenario.skills,
      timestamp: Date.now(),
    })

    setPhase('results')
  }, [scenario, scores])

  const playAgain = useCallback(() => {
    setScenario(null)
    setPhase('pick')
  }, [])

  if (phase === 'pick') {
    return (
      <div className="space-y-8">
        <div>
          <Link to="/" className="text-dojo-muted text-sm hover:text-dojo-accent">
            ← Arena
          </Link>
          <h1 className="text-3xl font-bold mt-4">
            <span className="text-dojo-blue">🧠</span> Decision Lab
          </h1>
          <p className="text-dojo-muted mt-2">
            Messy problem. Make the call. This mode now trains judgment, not concept recall.
          </p>
        </div>

        <div className="dojo-card space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted">
            Difficulty
          </h2>
          <DifficultyPicker value={difficulty} onChange={setDifficulty} />
          <p className="text-xs text-dojo-muted">
            Structured drill: decision → outcome → assumptions → tradeoffs → next move
          </p>
        </div>

        <button onClick={startRound} className="dojo-btn-primary w-full">
          Start Decision Drill
        </button>
      </div>
    )
  }

  if (!scenario) return null

  if (phase === 'write') {
    const ready = SECTION_META.every((section) => draft[section.key].trim().length >= 10)

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

        <div className="dojo-card border-dojo-blue/30 space-y-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-blue mb-2">
              Prompt
            </h3>
            <p className="text-sm leading-relaxed">{scenario.prompt}</p>
          </div>
          <div className="pt-3 border-t border-dojo-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-muted mb-2">
              Stakes
            </h3>
            <p className="text-sm text-dojo-text/80">{scenario.stakes}</p>
            <p className="text-xs text-dojo-muted mt-2">Artifact: {scenario.artifact}</p>
          </div>
        </div>

        <div className="space-y-4">
          {SECTION_META.map((section) => (
            <div key={section.key} className="dojo-card space-y-3">
              <div>
                <h3 className="text-sm font-semibold">{section.label}</h3>
                <p className="text-xs text-dojo-muted mt-1">{section.hint}</p>
              </div>
              <textarea
                rows={section.key === 'assumptions' || section.key === 'tradeoffs' ? 4 : 3}
                className="w-full"
                placeholder={section.placeholder}
                value={draft[section.key]}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    [section.key]: event.target.value,
                  }))
                }
                autoFocus={section.key === 'decision'}
              />
            </div>
          ))}
        </div>

        <button
          onClick={submitDraft}
          disabled={!ready}
          className="dojo-btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Review Against Model
        </button>
      </div>
    )
  }

  if (phase === 'score') {
    return (
      <div className="space-y-6 animate-slide-up">
        <h2 className="text-xl font-bold">{scenario.title} — Review</h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="dojo-card border-dojo-accent/30 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-accent">
              Your Decision Memo
            </h3>
            {renderAnswer(draft)}
          </div>

          <div className="dojo-card border-dojo-green/30 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-dojo-green">
              Model Decision Memo
            </h3>
            {renderAnswer(scenario.modelAnswer)}
          </div>
        </div>

        <div className="dojo-card">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted mb-3">
            Principles Under Test
          </h3>
          <div className="flex flex-wrap gap-2">
            {scenario.principles.map((principle) => (
              <span
                key={principle}
                className="text-xs px-2 py-1 rounded-full border border-dojo-border text-dojo-muted"
              >
                {principle}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {SECTION_META.map((section) => (
            <div key={section.key} className="dojo-card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{section.label}</h3>
                <span className="text-2xl font-bold text-dojo-accent tabular-nums">
                  {scores[section.key]}
                </span>
              </div>
              <p className="text-xs text-dojo-muted">{scenario.rubric[section.key]}</p>
              <input
                type="range"
                min={0}
                max={5}
                value={scores[section.key]}
                onChange={(event) =>
                  setScores((current) => ({
                    ...current,
                    [section.key]: parseInt(event.target.value, 10),
                  }))
                }
                className="w-full accent-dojo-accent"
              />
              <div className="flex justify-between text-xs text-dojo-muted">
                <span>0 — weak</span>
                <span>3 — decent</span>
                <span>5 — strong</span>
              </div>
            </div>
          ))}
        </div>

        <button onClick={finalizeRound} className="dojo-btn-primary w-full">
          Save Results
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{scenario.title} — Results</h2>

      <ScoreCard
        scores={[
          {
            label: 'Decision',
            value: scores.decision,
            max: 5,
            color: 'dojo-blue',
            feedback: scenario.rubric.decision,
          },
          {
            label: 'Outcome',
            value: scores.outcome,
            max: 5,
            color: 'dojo-green',
            feedback: scenario.rubric.outcome,
          },
          {
            label: 'Assumptions',
            value: scores.assumptions,
            max: 5,
            color: 'dojo-purple',
            feedback: scenario.rubric.assumptions,
          },
          {
            label: 'Tradeoffs',
            value: scores.tradeoffs,
            max: 5,
            color: 'dojo-accent',
            feedback: scenario.rubric.tradeoffs,
          },
          {
            label: 'Next Move',
            value: scores.recommendation,
            max: 5,
            color: 'dojo-red',
            feedback: scenario.rubric.recommendation,
          },
        ]}
        principles={scenario.principles}
      />

      <div className="flex gap-3">
        <button onClick={playAgain} className="dojo-btn flex-1">
          New Drill
        </button>
        <Link to="/" className="dojo-btn flex-1 text-center">
          Back to Arena
        </Link>
      </div>
    </div>
  )
}
