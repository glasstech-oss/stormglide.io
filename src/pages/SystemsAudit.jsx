import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Loader2, ArrowUpRight } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout'
import { useTheme } from '../context/ThemeContext'
import { INDUSTRIES } from '../data/industries'
import { submitLead } from '../lib/crm'

// Same 6 verticals as /industries, plus a catch-all — keeps the audit's
// "what kind of business" question consistent with the Industries pages
// instead of inventing a second, different list.
const BUSINESS_TYPES = [...INDUSTRIES.map(i => i.name), 'Something else']

const TEAM_SIZES = ['Just me', '2–5 people', '6–15 people', '16–50 people', '50+ people']

// The brief's exact friction list — this is the diagnostic core of the
// flow, not a pricing input, so no dollar amounts attached (unlike
// PriceEstimator's SCOPE_FACTORS, which this page otherwise borrows its
// step-machine shape from).
const FRICTION_POINTS = [
  'Spreadsheets', 'Reporting', 'Customer communication', 'Inventory',
  'Staff management', 'Projects', 'Payments', 'Documents',
  'Disconnected software', 'Other',
]

const STEPS = ['Your Business', 'Team Size', 'Friction', 'Today', 'Contact']

export default function SystemsAudit() {
  const { theme } = useTheme()
  const whatsappPhone = theme.contactWhatsapp.replace(/[^0-9]/g, '').replace(/^0/, '233')
  const [step, setStep] = useState(0)
  const [businessType, setBusinessType] = useState(null)
  const [teamSize, setTeamSize] = useState(null)
  const [friction, setFriction] = useState(new Set())
  const [todayDetails, setTodayDetails] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', organization: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  function toggleFriction(label) {
    setFriction(prev => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })
  }

  function goNext() { setStep(s => Math.min(s + 1, STEPS.length - 1)) }
  function goBack() { setStep(s => Math.max(s - 1, 0)) }

  const canContinue = [
    !!businessType,
    !!teamSize,
    friction.size > 0,
    todayDetails.trim().length > 0,
    !!form.name && !!form.email,
  ]

  async function handleSubmit() {
    setStatus('sending')
    try {
      await submitLead({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        organization: form.organization || null,
        missionScope: 'Systems audit',
        budget: null,
        timeline: null,
        details: [
          `Business type: ${businessType}`,
          `Team size: ${teamSize}`,
          `Biggest friction: ${[...friction].join(', ')}`,
          `How it works today:\n${todayDetails}`,
        ].join('\n\n'),
        source: 'systems_audit',
        product: null,
        configuratorSelections: {
          businessType,
          teamSize,
          friction: [...friction],
        },
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    const waMessage = encodeURIComponent(
      `Hi Stormglide, I just requested a systems audit${form.name ? ` (${form.name})` : ''} — biggest friction: ${[...friction].join(', ')}.`,
    )
    return (
      <PageLayout>
        <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '4rem 2rem' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: '480px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-success) 14%, transparent)', border: '1.5px solid color-mix(in srgb, var(--color-success) 30%, transparent)', display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem' }}>
              <Check size={28} color="var(--color-success)" />
            </div>
            <h1 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>We're looking at it.</h1>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
              We've received your audit request. Expect a WhatsApp message or call within 24 hours — we'll come back with specific ideas for your business, not a generic pitch.
            </p>
            <a
              href={`https://wa.me/${whatsappPhone}?text=${waMessage}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-secondary"
              style={{ textDecoration: 'none', gap: '0.5rem', display: 'inline-flex' }}
            >
              Message us on WhatsApp now <ArrowUpRight size={15} />
            </a>
          </motion.div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div style={{ borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface)', padding: '3.5rem 2rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="section-label">SYSTEMS AUDIT</div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            Let's look at how your business works.
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', maxWidth: '560px', marginBottom: '1.75rem' }}>
            Five short questions. No generic pitch back — we'll tell you specifically what's slowing you down and what a connected system would look like.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {STEPS.map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: i <= step ? 'var(--sg-accent)' : 'var(--color-text-secondary)', fontWeight: i === step ? 700 : 500, fontSize: '0.85rem' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, background: i <= step ? 'var(--sg-accent)' : 'var(--color-surface-alt)', color: i <= step ? '#FFFFFF' : 'var(--color-text-secondary)' }}>
                    {i < step ? <Check size={12} /> : i + 1}
                  </span>
                  {label}
                </div>
                {i < STEPS.length - 1 && <div style={{ width: 24, height: 1, background: 'var(--color-border-subtle)' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 2rem 6rem' }}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="business" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>What kind of business do you run?</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                {BUSINESS_TYPES.map(t => {
                  const active = businessType === t
                  return (
                    <button key={t} type="button" onClick={() => setBusinessType(t)}
                      style={{ padding: '0.65rem 1.1rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, border: `1.5px solid ${active ? 'var(--sg-accent)' : 'var(--color-border-subtle)'}`, background: active ? 'var(--sg-accent)' : 'var(--color-surface)', color: active ? '#FFFFFF' : 'var(--color-text-primary)' }}
                    >
                      {t}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="team" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>How large is the team?</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                {TEAM_SIZES.map(t => {
                  const active = teamSize === t
                  return (
                    <button key={t} type="button" onClick={() => setTeamSize(t)}
                      style={{ padding: '0.65rem 1.1rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, border: `1.5px solid ${active ? 'var(--sg-accent)' : 'var(--color-border-subtle)'}`, background: active ? 'var(--sg-accent)' : 'var(--color-surface)', color: active ? '#FFFFFF' : 'var(--color-text-primary)' }}
                    >
                      {t}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="friction" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>What causes the most friction?</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Pick as many as apply.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {FRICTION_POINTS.map(f => {
                  const checked = friction.has(f)
                  return (
                    <button key={f} type="button" onClick={() => toggleFriction(f)} className="card"
                      style={{ textAlign: 'left', cursor: 'pointer', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderColor: checked ? 'var(--sg-accent)' : undefined }}
                    >
                      <div style={{ width: 20, height: 20, borderRadius: '5px', flexShrink: 0, border: `1.5px solid ${checked ? 'var(--sg-accent)' : 'var(--color-border-subtle)'}`, background: checked ? 'var(--sg-accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {checked && <Check size={13} color="#FFFFFF" />}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{f}</span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="today" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>Tell us what happens today.</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Walk us through the actual process — what tools, what steps, where it breaks down. The more specific, the better we can help.</p>
              <textarea
                className="input" rows={8} style={{ width: '100%', resize: 'vertical' }}
                placeholder="e.g. Orders come in over WhatsApp, we write them in a notebook, then someone re-enters them into Excel at the end of the day..."
                value={todayDetails} onChange={e => setTodayDetails(e.target.value)}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="contact" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Your details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }} className="sa-form-grid">
                <input className="input" placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input className="input" type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <input className="input" placeholder="Phone / WhatsApp" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                <input className="input" placeholder="Business name (optional)" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} />
              </div>
              {status === 'error' && (
                <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  Something went wrong sending your request — please try again.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
          {step > 0 ? (
            <button className="btn-secondary" onClick={goBack} disabled={status === 'sending'}>
              <ArrowLeft size={15} /> Back
            </button>
          ) : <span />}
          {step < STEPS.length - 1 ? (
            <button className="btn-primary" onClick={goNext} disabled={!canContinue[step]}>
              Continue <ArrowRight size={15} />
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} disabled={!canContinue[4] || status === 'sending'}>
              {status === 'sending' ? <><Loader2 size={15} className="sa-spin" /> Sending...</> : <>Request a systems audit <ArrowRight size={15} /></>}
            </button>
          )}
        </div>
      </div>

      <style>{`
        .sa-spin { animation: saSpin 0.8s linear infinite; }
        @keyframes saSpin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .sa-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PageLayout>
  )
}
