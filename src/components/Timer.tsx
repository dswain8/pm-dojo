import { useState, useEffect } from 'react'

interface TimerProps {
  seconds: number
  running: boolean
  onExpire: () => void
}

export function Timer({ seconds, running, onExpire }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    setRemaining(seconds)
  }, [seconds])

  useEffect(() => {
    if (!running) return
    if (remaining <= 0) {
      onExpire()
      return
    }
    const id = setInterval(() => setRemaining((r) => r - 1), 1000)
    return () => clearInterval(id)
  }, [running, remaining, onExpire])

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const pct = (remaining / seconds) * 100
  const urgent = remaining <= 15

  return (
    <div className="flex items-center gap-3">
      <div className="w-32 h-2 bg-dojo-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            urgent ? 'bg-dojo-red animate-pulse' : pct > 50 ? 'bg-dojo-green' : 'bg-dojo-accent'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={`text-lg font-bold tabular-nums ${
          urgent ? 'text-dojo-red animate-timer-tick' : 'text-dojo-muted'
        }`}
      >
        {mins}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  )
}
