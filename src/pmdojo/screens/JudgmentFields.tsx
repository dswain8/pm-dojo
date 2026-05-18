import { EMPTY_JUDGMENT_CHECKPOINT } from '../judgment'
import { withAlpha } from '../tokens'
import type { JudgmentCheckpoint, Tokens } from '../types'

type JudgmentFieldsProps = {
  value: JudgmentCheckpoint
  onChange: (next: JudgmentCheckpoint) => void
  tokens: Tokens
  compact?: boolean
}

const fields: Array<{ key: keyof JudgmentCheckpoint; label: string; placeholder: string }> = [
  {
    key: 'recommendation',
    label: 'Recommendation',
    placeholder: 'What is the call?',
  },
  {
    key: 'nonGoals',
    label: 'Not doing',
    placeholder: 'What are you explicitly not promising?',
  },
  {
    key: 'evidence',
    label: 'Evidence',
    placeholder: 'What fact makes this call reasonable?',
  },
  {
    key: 'tradeoff',
    label: 'Tradeoff',
    placeholder: 'What cost or risk are you accepting?',
  },
  {
    key: 'ask',
    label: 'Ask',
    placeholder: 'Who needs to decide or act by when?',
  },
  {
    key: 'changeMind',
    label: 'Change mind',
    placeholder: 'What would change the call?',
  },
]

export function JudgmentFields({ value, onChange, tokens, compact = false }: JudgmentFieldsProps) {
  const updateField = (key: keyof JudgmentCheckpoint, fieldValue: string) => {
    onChange({
      ...EMPTY_JUDGMENT_CHECKPOINT,
      ...value,
      [key]: fieldValue,
    })
  }

  return (
    <div
      style={{
        background: compact ? 'transparent' : tokens.bg2,
        border: compact ? 'none' : `1px solid ${withAlpha(tokens.gold, 0.22)}`,
        borderRadius: compact ? 0 : 10,
        padding: compact ? 0 : 12,
      }}
    >
      <div style={{ fontSize: 10, fontFamily: tokens.mono, color: tokens.gold, letterSpacing: 1.5, marginBottom: 8 }}>
        JUDGMENT CHECKPOINT
      </div>
      <div style={{ fontSize: 11, color: tokens.dim, lineHeight: 1.45, marginBottom: 10 }}>
        Write the PM call before polishing the prose. Dojo checks whether the draft carries this through.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr 1fr' : '1fr', gap: 8 }}>
        {fields.map((field) => (
          <label key={field.key} style={{ display: 'grid', gap: 5 }}>
            <span style={{ fontSize: 9, fontFamily: tokens.mono, color: tokens.dimmer, letterSpacing: 1 }}>
              {field.label.toUpperCase()}
            </span>
            <textarea
              value={value[field.key]}
              onChange={(event) => updateField(field.key, event.target.value)}
              placeholder={field.placeholder}
              style={{
                width: '100%',
                minHeight: compact ? 52 : 58,
                background: tokens.panel,
                color: tokens.ink,
                border: `1px solid ${tokens.line}`,
                borderRadius: 8,
                outline: 'none',
                resize: 'vertical',
                padding: '9px 10px',
                fontFamily: tokens.sans,
                fontSize: 12,
                lineHeight: 1.4,
                caretColor: tokens.gold,
              }}
            />
          </label>
        ))}
      </div>
    </div>
  )
}
