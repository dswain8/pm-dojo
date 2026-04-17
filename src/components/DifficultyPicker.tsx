import { type Difficulty, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../data/scenarios'

interface DifficultyPickerProps {
  value: Difficulty
  onChange: (d: Difficulty) => void
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'nightmare']

export function DifficultyPicker({ value, onChange }: DifficultyPickerProps) {
  return (
    <div className="flex gap-2">
      {DIFFICULTIES.map((d) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all
            ${
              value === d
                ? `${DIFFICULTY_COLORS[d]} border-current bg-current/10`
                : 'border-dojo-border text-dojo-muted hover:border-dojo-accent/30'
            }`}
        >
          {DIFFICULTY_LABELS[d]}
        </button>
      ))}
    </div>
  )
}
