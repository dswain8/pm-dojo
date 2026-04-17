import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { REPLAY_SCENARIOS } from '../data/scenarios'
import { saveSession } from '../lib/storage'

type Phase = 'intro' | 'playing' | 'debrief'

export function ScenarioReplay() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [scenarioIdx] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const [trust, setTrust] = useState(50)
  const [effectiveness, setEffectiveness] = useState(50)
  const [choiceHistory, setChoiceHistory] = useState<{ step: number; label: string; outcome: string; principle: string }[]>([])

  const scenario = REPLAY_SCENARIOS[scenarioIdx]
  const step = scenario.steps[stepIdx]

  const startGame = useCallback(() => {
    setPhase('playing')
    setStepIdx(0)
    setTrust(50)
    setEffectiveness(50)
    setChoiceHistory([])
  }, [])

  const makeChoice = useCallback(
    (choiceIdx: number) => {
      const choice = step.choices[choiceIdx]
      const newTrust = Math.max(0, Math.min(100, trust + choice.trustDelta))
      const newEff = Math.max(0, Math.min(100, effectiveness + choice.effectivenessDelta))

      setTrust(newTrust)
      setEffectiveness(newEff)
      setChoiceHistory((h) => [
        ...h,
        { step: stepIdx + 1, label: choice.label, outcome: choice.outcome, principle: choice.principle },
      ])

      if (stepIdx + 1 < scenario.steps.length) {
        setStepIdx(stepIdx + 1)
      } else {
        saveSession({
          mode: 'scenario',
          scenarioId: scenario.id,
          scenarioTitle: scenario.title,
          difficulty: scenario.difficulty,
          scores: { trust: newTrust, effectiveness: newEff },
          timestamp: Date.now(),
        })
        setPhase('debrief')
      }
    },
    [step, stepIdx, trust, effectiveness, scenario]
  )

  if (phase === 'intro') {
    return (
      <div className="space-y-8">
        <div>
          <Link to="/" className="text-dojo-muted text-sm hover:text-dojo-accent">← Arena</Link>
          <h1 className="text-3xl font-bold mt-4">
            <span className="text-dojo-purple">🎭</span> Scenario Replay
          </h1>
        </div>

        <div className="dojo-card border-dojo-purple/30 space-y-4">
          <h2 className="text-xl font-bold">{scenario.title}</h2>
          <span className="text-xs font-semibold uppercase tracking-wider text-dojo-purple">{scenario.difficulty}</span>
          <p className="text-sm leading-relaxed text-dojo-text/80">{scenario.premise}</p>
          <div className="flex gap-6 text-sm text-dojo-muted">
            <span>{scenario.steps.length} decision points</span>
            <span>Trust + Effectiveness tracked</span>
          </div>
        </div>

        <button onClick={startGame} className="dojo-btn-primary w-full">Begin Scenario</button>
      </div>
    )
  }

  if (phase === 'playing') {
    // Show last outcome if not the first step
    const lastChoice = choiceHistory[choiceHistory.length - 1]

    return (
      <div className="space-y-6">
        {/* Score bar */}
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-dojo-blue">Trust</span>
              <span className="text-dojo-blue font-bold">{trust}</span>
            </div>
            <div className="w-full h-2 bg-dojo-border rounded-full overflow-hidden">
              <div className="h-full bg-dojo-blue rounded-full transition-all duration-500" style={{ width: `${trust}%` }} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-dojo-green">Effectiveness</span>
              <span className="text-dojo-green font-bold">{effectiveness}</span>
            </div>
            <div className="w-full h-2 bg-dojo-border rounded-full overflow-hidden">
              <div className="h-full bg-dojo-green rounded-full transition-all duration-500" style={{ width: `${effectiveness}%` }} />
            </div>
          </div>
        </div>

        {/* Last outcome */}
        {lastChoice && (
          <div className="dojo-card border-dojo-accent/20 animate-slide-up">
            <p className="text-sm text-dojo-text/80 mb-2">{lastChoice.outcome}</p>
            <p className="text-xs text-dojo-accent italic">{lastChoice.principle}</p>
          </div>
        )}

        {/* Step */}
        <div className="text-xs text-dojo-muted uppercase tracking-wider">
          Decision {stepIdx + 1} of {scenario.steps.length}
        </div>

        <div className="dojo-card">
          <p className="text-sm leading-relaxed">{step.narration}</p>
        </div>

        {/* Choices */}
        <div className="space-y-3">
          {step.choices.map((choice, i) => (
            <button
              key={choice.label}
              onClick={() => makeChoice(i)}
              className="w-full text-left dojo-card border-dojo-border hover:border-dojo-purple/50 transition-all cursor-pointer group"
            >
              <span className="text-dojo-purple font-bold mr-2 group-hover:text-dojo-accent transition-colors">
                {choice.label})
              </span>
              <span className="text-sm">{choice.text}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Debrief
  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-xl font-bold">{scenario.title} — Debrief</h2>

      {/* Final scores */}
      <div className="grid grid-cols-2 gap-4">
        <div className="dojo-card text-center">
          <div className={`text-4xl font-bold ${trust >= 60 ? 'text-dojo-blue' : 'text-dojo-red'}`}>{trust}</div>
          <div className="text-xs text-dojo-muted mt-1">Trust Score</div>
        </div>
        <div className="dojo-card text-center">
          <div className={`text-4xl font-bold ${effectiveness >= 60 ? 'text-dojo-green' : 'text-dojo-red'}`}>{effectiveness}</div>
          <div className="text-xs text-dojo-muted mt-1">Effectiveness</div>
        </div>
      </div>

      {/* Choice history */}
      <div className="dojo-card space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-dojo-muted">Your Choices</h3>
        {choiceHistory.map((ch) => (
          <div key={ch.step} className="border-l-2 border-dojo-purple/30 pl-4 space-y-1">
            <div className="text-xs text-dojo-purple">Decision {ch.step} — chose {ch.label}</div>
            <p className="text-sm text-dojo-text/70">{ch.outcome}</p>
            <p className="text-xs text-dojo-accent italic">{ch.principle}</p>
          </div>
        ))}
      </div>

      {/* Debrief text */}
      <div className="dojo-card border-dojo-accent/30">
        <h3 className="text-sm font-semibold text-dojo-accent uppercase tracking-wider mb-2">Takeaway</h3>
        <p className="text-sm text-dojo-text/80 leading-relaxed">{scenario.debrief}</p>
      </div>

      <div className="flex gap-3">
        <button onClick={startGame} className="dojo-btn flex-1">Replay</button>
        <Link to="/" className="dojo-btn flex-1 text-center">Back to Arena</Link>
      </div>
    </div>
  )
}
