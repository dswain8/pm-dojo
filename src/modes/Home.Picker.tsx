import { useState } from 'react'
import { VariationE, type Palette } from './variations/VariationE'

const THEMES: { key: string; palette: Palette; label: string; swatch: string }[] = [
  { key: 'himalayan', palette: 'himalayan', label: 'Himalayan Morning', swatch: '#2B6CB0' },
  { key: 'amber', palette: 'amber', label: 'Gold & Emerald', swatch: '#f59e0b' },
  { key: 'cyan', palette: 'cyan', label: 'Cyan & Indigo', swatch: '#22d3ee' },
  { key: 'rose', palette: 'rose', label: 'Rose & Fuchsia', swatch: '#fb7185' },
]

export function DesignPicker() {
  const [selected, setSelected] = useState('himalayan')
  const theme = THEMES.find(t => t.key === selected)!

  return (
    <div>
      {/* Floating picker — DELETE THIS ENTIRE BLOCK after choosing */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        background: '#18181b', color: '#fff', padding: '12px 24px',
        fontFamily: 'system-ui', fontSize: 14, fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        borderBottom: `2px solid ${theme.swatch}`,
      }}>
        <span style={{ opacity: 0.6 }}>🎨 Color palette:</span>
        {THEMES.map(t => (
          <button
            key={t.key}
            onClick={() => setSelected(t.key)}
            style={{
              background: selected === t.key ? t.swatch : 'rgba(255,255,255,0.08)',
              color: selected === t.key ? '#000' : '#fff',
              border: `2px solid ${selected === t.key ? t.swatch : 'rgba(255,255,255,0.15)'}`,
              borderRadius: 8, padding: '6px 16px', cursor: 'pointer',
              fontWeight: 700, fontSize: 13, fontFamily: 'system-ui',
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <span style={{
              width: 12, height: 12, borderRadius: '50%',
              background: t.swatch,
              border: selected === t.key ? '2px solid #000' : '2px solid transparent',
            }} />
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ height: 56 }} />
      <VariationE palette={theme.palette} />
    </div>
  )
}
