import { startTransition, useEffect, useState, type Dispatch, type SetStateAction } from 'react'

import { LanesScreen } from './screens/Lanes'
import { LandingScreen } from './screens/Landing'
import { RoundScreen } from './screens/Round'
import { CritiqueScreen } from './screens/Critique'
import { ProgressScreen } from './screens/Progress'
import { PracticeScreen } from './screens/Practice'
import { InvokeScreen } from './screens/Invoke'
import { ManualScreen } from './screens/Manual'
import { DemoScreen } from './screens/Demo'
import { OutcomeScreen } from './screens/Outcome'
import { createInitialState } from './seed'
import { ACCENTS, STORAGE_KEY, createTokens, syncTokenCssVars } from './tokens'
import { evaluatePracticeContext } from './context'
import { evaluateJudgmentCheckpoint, normalizeJudgmentCheckpoint } from './judgment'
import { buildOutcomeReplay, latestReplayableRun, type OutcomeDraft } from './outcome'
import { BUILDATHON_DEMO_INPUT } from './demo'
import {
  getActiveScenario,
  getQuickStartLaneId,
  getSuggestedLaneId,
  normalizeSavedState,
  pickScenarioForLane,
  syncStateFromHistory,
} from './game'
import { createPracticeScenario, type PracticeInput } from './practice'
import { createRunRecord } from './rubric'
import type { AccentKey, AppState, Screen, TweakState, Tokens } from './types'

const DEFAULT_TWEAKS: TweakState = {
  accent: 'gold',
  ambientGlow: true,
}

function screenFromPath(pathname: string): Screen | null {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'
  return normalizedPath === '/demo' ? 'demo' : null
}

function pathForScreen(screen: Screen) {
  return screen === 'demo' ? '/demo' : '/'
}

function pushPathForScreen(screen: Screen) {
  const nextPath = pathForScreen(screen)
  if (window.location.pathname !== nextPath) {
    window.history.pushState(null, '', nextPath)
  }
}

function stateWithRouteScreen(state: AppState) {
  const routeScreen = screenFromPath(window.location.pathname)
  return routeScreen ? { ...state, screen: routeScreen } : state
}

function commitLastRun(current: AppState, nextScreen: Screen) {
  const run = current.lastRun
  if (!run) {
    return syncStateFromHistory(
      {
        ...current,
        lastRun: null,
      },
      nextScreen,
    )
  }

  const alreadyCommitted = current.history.some(
    (entry) => entry.submittedAt === run.submittedAt && entry.scenarioId === run.scenarioId,
  )

  return syncStateFromHistory(
    {
      ...current,
      history: alreadyCommitted ? current.history : [...current.history, run],
      lastRun: null,
    },
    nextScreen,
  )
}

export function App() {
  const [state, setState] = useState<AppState>(() => {
    const fallback = createInitialState()

    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '')
      return stateWithRouteScreen(normalizeSavedState(saved, fallback))
    } catch {
      return stateWithRouteScreen(fallback)
    }
  })
  const [tweaks, setTweaks] = useState<TweakState>(DEFAULT_TWEAKS)
  const [tweakOpen, setTweakOpen] = useState(false)
  const [roundDraft, setRoundDraft] = useState('')
  const tokens = createTokens(tweaks.accent)
  const activeScenario = getActiveScenario(state)

  useEffect(() => {
    syncTokenCssVars(tokens)
  }, [tokens])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      return
    }
  }, [state])

  const nav = (screen: Screen) => {
    pushPathForScreen(screen)
    startTransition(() => {
      setState((current) => ({
        ...current,
        screen,
      }))
    })
    window.scrollTo(0, 0)
  }

  const openRound = (laneId: string) => {
    const scenario = pickScenarioForLane(laneId, state.history)
    if (!scenario) {
      return
    }

    pushPathForScreen('round')
    setRoundDraft('')
    startTransition(() => {
      setState((current) => ({
        ...current,
        screen: 'round',
        activeLaneId: laneId,
        activeScenarioId: scenario.id,
        customScenario: null,
        lastRun: null,
      }))
    })
    window.scrollTo(0, 0)
  }

  const startQuickRound = () => {
    openRound(getQuickStartLaneId())
  }

  const startSuggestedRound = () => {
    openRound(getSuggestedLaneId(state.history))
  }

  const rewriteRound = () => {
    setRoundDraft(state.lastRun?.draft ?? '')
    nav('round')
  }

  const submitPracticeDraft = (input: PracticeInput) => {
    const scenario = createPracticeScenario(input)
    const context = evaluatePracticeContext(input)
    const judgment = evaluateJudgmentCheckpoint(input.judgment)
    const run = createRunRecord(scenario, input.draft, 480, new Date().toISOString(), {
      contextConfidence: context.confidence,
      contextScore: context.score,
      contextNote: context.detail,
      judgmentCheckpoint: normalizeJudgmentCheckpoint(input.judgment),
      judgmentScore: judgment.score,
      judgmentNote: judgment.detail,
    })

    pushPathForScreen('critique')
    startTransition(() => {
      setState((current) => ({
        ...current,
        screen: 'critique',
        activeLaneId: scenario.laneId,
        activeScenarioId: scenario.id,
        customScenario: scenario,
        lastRun: run,
      }))
    })
    window.scrollTo(0, 0)
  }

  const runBuildathonDemoReview = () => {
    submitPracticeDraft(BUILDATHON_DEMO_INPUT)
  }

  const finishRound = (nextScreen: 'landing' | 'round' | 'practice') => {
    if (nextScreen === 'practice') {
      pushPathForScreen('practice')
      startTransition(() => {
        setState((current) => commitLastRun(current, 'practice'))
      })
      window.scrollTo(0, 0)
      return
    }

    if (nextScreen === 'round') {
      pushPathForScreen('round')
      setState((current) => {
        const committed = commitLastRun(current, 'landing')
        const laneId = committed.activeLaneId ?? current.lastRun?.laneId ?? getQuickStartLaneId()
        const nextScenario = pickScenarioForLane(laneId, committed.history)
        setRoundDraft('')

        return {
          ...committed,
          screen: 'round',
          activeLaneId: laneId,
          activeScenarioId: nextScenario?.id ?? null,
        }
      })
      window.scrollTo(0, 0)
      return
    }

    pushPathForScreen('landing')
    startTransition(() => {
      setState((current) => commitLastRun(current, 'landing'))
    })
    window.scrollTo(0, 0)
  }

  const saveOutcome = (draft: OutcomeDraft) => {
    const outcome = buildOutcomeReplay(draft, new Date().toISOString())

    pushPathForScreen('progress')
    startTransition(() => {
      setState((current) => {
        if (current.lastRun) {
          const updatedRun = {
            ...current.lastRun,
            outcome,
          }
          const alreadyCommitted = current.history.some(
            (entry) => entry.submittedAt === updatedRun.submittedAt && entry.scenarioId === updatedRun.scenarioId,
          )
          const history = alreadyCommitted
            ? current.history.map((entry) =>
                entry.submittedAt === updatedRun.submittedAt && entry.scenarioId === updatedRun.scenarioId ? updatedRun : entry,
              )
            : [...current.history, updatedRun]

          return syncStateFromHistory(
            {
              ...current,
              history,
              lastRun: null,
            },
            'progress',
          )
        }

        const replayableRun = latestReplayableRun(current.history)
        if (!replayableRun) {
          return {
            ...current,
            screen: 'progress',
          }
        }

        const history = current.history.map((entry) =>
          entry.submittedAt === replayableRun.submittedAt && entry.scenarioId === replayableRun.scenarioId
            ? {
                ...entry,
                outcome,
              }
            : entry,
        )

        return syncStateFromHistory(
          {
            ...current,
            history,
            lastRun: null,
          },
          'progress',
        )
      })
    })
    window.scrollTo(0, 0)
  }

  const skipOutcome = () => {
    pushPathForScreen('progress')
    startTransition(() => {
      setState((current) => {
        if (current.lastRun) {
          return commitLastRun(current, 'landing')
        }

        return {
          ...current,
          screen: 'progress',
        }
      })
    })
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    const onPopState = () => {
      const routeScreen = screenFromPath(window.location.pathname) ?? 'landing'
      startTransition(() => {
        setState((current) => ({
          ...current,
          screen: routeScreen,
        }))
      })
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping = target?.tagName === 'TEXTAREA' || target?.tagName === 'INPUT'
      const key = event.key.toLowerCase()

      if (state.screen === 'round' && (event.metaKey || event.ctrlKey) && key === 'enter') {
        event.preventDefault()
        document.querySelector<HTMLButtonElement>('[data-submit]')?.click()
        return
      }

      if (isTyping) {
        return
      }

      if ((event.code === 'Space' || event.key === ' ') && state.screen === 'landing') {
        event.preventDefault()
        nav('invoke')
        return
      }

      if (key === 'g' && state.screen !== 'round') {
        nav('progress')
        return
      }

      if (key === 'm' && state.screen !== 'round') {
        nav('manual')
        return
      }

      if (key === 'b' && state.screen !== 'round') {
        nav('demo')
        return
      }

      if (key === 'd' && state.screen !== 'round') {
        nav('invoke')
        return
      }

      if (key === 'i' && state.screen !== 'round') {
        nav('invoke')
        return
      }

      if (key === 'o' && state.screen !== 'round') {
        nav('outcome')
        return
      }

      if ((key === 'h' || key === 'escape') && state.screen !== 'round') {
        nav('landing')
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [state.screen, state.history, state.lastRun, activeScenario])

  return (
    <div key={tweaks.accent} style={{ minHeight: '100vh', background: tokens.bg }}>
      {state.screen === 'landing' ? (
        <LandingScreen
          nav={nav}
          tokens={tokens}
          ambientGlow={tweaks.ambientGlow}
        />
      ) : null}
      {state.screen === 'demo' ? (
        <DemoScreen nav={nav} tokens={tokens} ambientGlow={tweaks.ambientGlow} runDemoReview={runBuildathonDemoReview} />
      ) : null}
      {state.screen === 'lanes' ? (
        <LanesScreen nav={nav} state={state} tokens={tokens} ambientGlow={tweaks.ambientGlow} openLaneRound={openRound} />
      ) : null}
      {state.screen === 'invoke' ? (
        <InvokeScreen
          nav={nav}
          tokens={tokens}
          ambientGlow={tweaks.ambientGlow}
          openLaneRound={openRound}
          submitPracticeDraft={submitPracticeDraft}
        />
      ) : null}
      {state.screen === 'practice' ? (
        <PracticeScreen
          nav={nav}
          tokens={tokens}
          ambientGlow={tweaks.ambientGlow}
          submitPracticeDraft={submitPracticeDraft}
        />
      ) : null}
      {state.screen === 'round' && activeScenario ? (
        <RoundScreen
          nav={nav}
          state={state}
          setState={setState}
          tokens={tokens}
          initialDraft={roundDraft}
          scenario={activeScenario}
        />
      ) : null}
      {state.screen === 'critique' && activeScenario ? (
        <CritiqueScreen
          nav={nav}
          state={state}
          tokens={tokens}
          ambientGlow={tweaks.ambientGlow}
          tweakPanelInset={tweakOpen ? 300 : 0}
          rewriteRound={rewriteRound}
          finishRound={finishRound}
          scenario={activeScenario}
        />
      ) : null}
      {state.screen === 'outcome' ? (
        <OutcomeScreen
          nav={nav}
          state={state}
          tokens={tokens}
          ambientGlow={tweaks.ambientGlow}
          saveOutcome={saveOutcome}
          skipOutcome={skipOutcome}
        />
      ) : null}
      {state.screen === 'progress' ? (
        <ProgressScreen
          nav={nav}
          state={state}
          tokens={tokens}
          startSuggestedRound={startSuggestedRound}
          openLaneRound={openRound}
        />
      ) : null}
      {state.screen === 'manual' ? (
        <ManualScreen
          nav={nav}
          state={state}
          tokens={tokens}
          startSuggestedRound={startSuggestedRound}
        />
      ) : null}
      {tweakOpen ? (
        <TweakPanel
          tweaks={tweaks}
          setTweaks={setTweaks}
          nav={nav}
          onClose={() => setTweakOpen(false)}
          tokens={tokens}
          startQuickRound={startQuickRound}
        />
      ) : null}
      {!tweakOpen ? <TweakButton onClick={() => setTweakOpen(true)} tokens={tokens} /> : null}
    </div>
  )
}

function TweakButton({ onClick, tokens }: { onClick: () => void; tokens: Tokens }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: 18,
        right: 18,
        zIndex: 998,
        background: tokens.panel,
        color: tokens.dim,
        border: `1px solid ${tokens.lineStrong}`,
        borderRadius: 999,
        padding: '9px 12px',
        fontFamily: tokens.mono,
        fontSize: 10,
        letterSpacing: 1.2,
        cursor: 'pointer',
        boxShadow: '0 12px 35px rgba(0,0,0,.35)',
      }}
    >
      TWEAKS
    </button>
  )
}

function TweakPanel({
  tweaks,
  setTweaks,
  nav,
  onClose,
  tokens,
  startQuickRound,
}: {
  tweaks: TweakState
  setTweaks: Dispatch<SetStateAction<TweakState>>
  nav: (screen: Screen) => void
  onClose: () => void
  tokens: Tokens
  startQuickRound: () => void
}) {
  const setAccent = (accent: AccentKey) => {
    setTweaks((current) => ({
      ...current,
      accent,
    }))
  }

  const toggleAmbientGlow = () => {
    setTweaks((current) => ({
      ...current,
      ambientGlow: !current.ambientGlow,
    }))
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 280,
        background: tokens.panel,
        border: `1px solid ${tokens.lineStrong}`,
        borderRadius: 14,
        boxShadow: '0 20px 60px rgba(0,0,0,.5)',
        padding: 18,
        zIndex: 999,
        fontFamily: tokens.sans,
        color: tokens.ink,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.3 }}>Tweaks</div>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: tokens.dim, cursor: 'pointer', fontSize: 16 }}
        >
          ×
        </button>
      </div>

      <div style={{ fontSize: 10, fontFamily: tokens.mono, color: tokens.dim, letterSpacing: 1.5, marginBottom: 8 }}>
        ACCENT
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 16 }}>
        {Object.entries(ACCENTS).map(([key, accent]) => (
          <button
            key={key}
            onClick={() => setAccent(key as AccentKey)}
            style={{
              background: tweaks.accent === key ? accent.gold : 'transparent',
              color: tweaks.accent === key ? tokens.bg : tokens.dim,
              border: `1px solid ${tweaks.accent === key ? accent.gold : tokens.line}`,
              borderRadius: 8,
              padding: '8px 4px',
              fontSize: 11,
              fontFamily: tokens.sans,
              cursor: 'pointer',
              fontWeight: tweaks.accent === key ? 700 : 500,
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 3, background: accent.gold, margin: '0 auto 4px' }} />
            {accent.label}
          </button>
        ))}
      </div>

      <Toggle label="Ambient glow" value={tweaks.ambientGlow} onChange={toggleAmbientGlow} tokens={tokens} />

      <div
        style={{
          marginTop: 16,
          paddingTop: 14,
          borderTop: `1px solid ${tokens.line}`,
          fontSize: 11,
          color: tokens.dim,
          lineHeight: 1.5,
        }}
      >
        <div style={{ fontFamily: tokens.mono, color: tokens.dimmer, letterSpacing: 1, marginBottom: 6 }}>JUMP TO SCREEN</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {(['landing', 'demo', 'invoke', 'lanes', 'practice', 'round', 'critique', 'outcome', 'progress', 'manual'] as const).map((screen) => (
            <button
              key={screen}
              onClick={() => (screen === 'round' ? startQuickRound() : nav(screen))}
              style={{
                background: tokens.bg2,
                color: tokens.ink,
                border: `1px solid ${tokens.line}`,
                borderRadius: 6,
                padding: '6px 10px',
                fontSize: 11,
                fontFamily: tokens.mono,
                cursor: 'pointer',
              }}
            >
              {screen}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Toggle({
  label,
  value,
  onChange,
  tokens,
}: {
  label: string
  value: boolean
  onChange: () => void
  tokens: Tokens
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <span style={{ fontSize: 13 }}>{label}</span>
      <button
        onClick={onChange}
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          background: value ? tokens.gold : tokens.panel2,
          border: `1px solid ${tokens.line}`,
          position: 'relative',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 1,
            left: value ? 17 : 1,
            width: 16,
            height: 16,
            borderRadius: 8,
            background: tokens.ink,
            transition: 'left .15s',
          }}
        />
      </button>
    </div>
  )
}
