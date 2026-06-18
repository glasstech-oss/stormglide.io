import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'

const COLOR_FIELDS = [
  { key: 'colorBackground', label: 'Background Color' },
  { key: 'colorSurface', label: 'Card/Surface Color' },
  { key: 'colorSurfaceAlt', label: 'Alt Surface Color' },
  { key: 'colorAccentCyan', label: 'Primary Accent (Cyan)' },
  { key: 'colorAccentViolet', label: 'Secondary Accent (Violet)' },
  { key: 'colorAccentGold', label: 'Highlight Color (Gold)' },
  { key: 'colorTextHeading', label: 'Heading Text Color' },
  { key: 'colorTextPrimary', label: 'Body Text Color' },
  { key: 'colorTextSecondary', label: 'Subtle Text Color' },
]

const TABS = ['Colors', 'Typography', 'Site Text', 'Trust Stats', 'Contact Info']

function Toast({ msg, onDone }) {
  setTimeout(onDone, 2500)
  return <div className="toast">{msg}</div>
}

export default function SiteCustomizer() {
  const { theme, updateTheme, resetTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('Colors')
  const [toast, setToast] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const save = () => setToast('Saved ✓')

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Site Customizer</h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }} onClick={() => setConfirmReset(true)}>Reset to Defaults</button>
          <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }} onClick={save}>Save Changes</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0', overflowX: 'auto' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab ? 'var(--color-accent-cyan)' : 'transparent'}`, color: activeTab === tab ? 'var(--color-accent-cyan)' : 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'var(--font-body)', fontWeight: activeTab === tab ? 600 : 400, whiteSpace: 'nowrap', transition: 'all 0.2s', marginBottom: '-1px' }}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Colors' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {COLOR_FIELDS.map(({ key, label }) => (
            <div key={key} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: '8px', background: theme[key], border: '2px solid var(--color-border-subtle)', cursor: 'pointer' }} />
                <input type="color" value={theme[key]} onChange={e => updateTheme(key, e.target.value)}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                  aria-label={label}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.375rem' }}>{label}</div>
                <input
                  value={theme[key]}
                  onChange={e => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) updateTheme(key, e.target.value) }}
                  style={{ width: '100%', background: 'var(--color-surface-alt)', border: '1px solid var(--color-border-subtle)', borderRadius: '6px', padding: '0.3rem 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-primary)', outline: 'none' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Typography' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '600px' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', padding: '0.875rem 1rem', background: 'color-mix(in srgb, var(--color-accent-blue) 5%, transparent)', border: '1px solid color-mix(in srgb, var(--color-accent-blue) 15%, transparent)', borderRadius: 'var(--border-radius)' }}>
            Font changes load from Google Fonts. Make sure the font name is exactly correct.
          </p>
          {[
            { key: 'fontDisplay', label: 'Headlines Font' },
            { key: 'fontBody', label: 'Body Text Font' },
            { key: 'fontMono', label: 'Code/Terminal Font' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>{label}</label>
              <input className="input" value={theme[key]} onChange={e => updateTheme(key, e.target.value)} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Base Font Size: {theme.fontSizeBase}</label>
            <input type="range" min={14} max={20} value={parseInt(theme.fontSizeBase)} onChange={e => updateTheme('fontSizeBase', `${e.target.value}px`)} style={{ width: '100%', accentColor: 'var(--color-accent-cyan)' }} />
          </div>
        </div>
      )}

      {activeTab === 'Site Text' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '700px' }}>
          {[
            { key: 'siteTagline', label: 'Site Tagline (H1)', multi: false },
            { key: 'siteSubTagline', label: 'Sub-tagline', multi: true },
            { key: 'siteCtaPrimary', label: 'Primary CTA Button', multi: false },
            { key: 'siteCtaSecondary', label: 'Secondary CTA Button', multi: false },
            { key: 'siteAboutText', label: 'About Paragraph', multi: true },
            { key: 'siteMission', label: 'Mission Statement', multi: false },
            { key: 'trustBarText', label: 'Trust Bar Text', multi: false },
          ].map(({ key, label, multi }) => (
            <div key={key}>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>{label}</label>
              {multi
                ? <textarea className="input" rows={3} value={theme[key]} onChange={e => updateTheme(key, e.target.value)} style={{ resize: 'vertical' }} />
                : <input className="input" value={theme[key]} onChange={e => updateTheme(key, e.target.value)} />
              }
            </div>
          ))}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Currently Accepting Projects</label>
            <button
              onClick={() => updateTheme('siteCurrentlyAccepting', !theme.siteCurrentlyAccepting)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: theme.siteCurrentlyAccepting ? 'rgba(0,200,150,0.1)' : 'var(--color-surface-alt)', border: `1px solid ${theme.siteCurrentlyAccepting ? 'rgba(0,200,150,0.4)' : 'var(--color-border-subtle)'}`, borderRadius: 'var(--border-radius)', cursor: 'pointer', width: '100%', fontFamily: 'var(--font-body)' }}
            >
              <div style={{ width: 36, height: 20, borderRadius: 10, background: theme.siteCurrentlyAccepting ? 'var(--color-success)' : 'var(--color-border-subtle)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 2, left: theme.siteCurrentlyAccepting ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
              </div>
              <span style={{ fontSize: '0.875rem', color: theme.siteCurrentlyAccepting ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
                {theme.siteCurrentlyAccepting ? 'Enabled — badge visible in hero' : 'Disabled — badge hidden'}
              </span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Trust Stats' && (
        <div style={{ maxWidth: '500px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {theme.trustStats.map((stat, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.75rem', alignItems: 'center' }}>
                <input className="input" placeholder="Value" value={stat.value} onChange={e => {
                  const next = [...theme.trustStats]
                  next[i] = { ...next[i], value: e.target.value }
                  updateTheme('trustStats', next)
                }} />
                <input className="input" placeholder="Label" value={stat.label} onChange={e => {
                  const next = [...theme.trustStats]
                  next[i] = { ...next[i], label: e.target.value }
                  updateTheme('trustStats', next)
                }} />
                <button onClick={() => updateTheme('trustStats', theme.trustStats.filter((_, j) => j !== i))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', padding: '0.5rem' }}>✕</button>
              </div>
            ))}
            <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', alignSelf: 'flex-start' }}
              onClick={() => updateTheme('trustStats', [...theme.trustStats, { value: '0', label: 'New Stat' }])}>
              + Add Stat
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Contact Info' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '500px' }}>
          {[
            { key: 'contactWhatsapp', label: 'WhatsApp Number', placeholder: '0530828898' },
            { key: 'contactEmail', label: 'Email Address', placeholder: 'hello@stormglide.io' },
            { key: 'contactLinkedIn', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/...' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>{label}</label>
              <input className="input" value={theme[key]} placeholder={placeholder} onChange={e => updateTheme(key, e.target.value)} />
            </div>
          ))}
        </div>
      )}

      {confirmReset && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,10,24,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', padding: '2rem', maxWidth: '380px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>Reset to Defaults?</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>This will restore all colors, fonts, and text to their original values.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn-secondary" onClick={() => setConfirmReset(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => { resetTheme(); setConfirmReset(false); setToast('Reset to defaults ✓') }}>Yes, Reset</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
