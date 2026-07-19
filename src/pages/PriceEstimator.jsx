import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Globe, Building2, ShoppingCart, CalendarClock, LayoutDashboard, Megaphone, Sparkles, Loader2 } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout'
import { submitLead } from '../lib/crm'

// Same category structure/pricing as our reference estimator (gotechpluz.com),
// adapted to how Stormglide actually scopes work — currency and ranges kept
// as-is per direct request, categories renamed/regrouped where they map more
// naturally onto our own product/service lines.
const PACKAGES = [
  {
    id: 'starter-web', name: 'Starter Web', icon: Globe, color: 'var(--sg-accent)',
    audience: 'Individuals & small businesses', min: 2100, max: 4200,
    tags: ['1–3 Pages', 'Mobile-Friendly', 'Contact Form', 'WhatsApp Integration'],
  },
  {
    id: 'standard-business', name: 'Standard Business', icon: Building2, color: 'var(--sg-accent-2)',
    audience: 'Growing businesses', min: 4900, max: 8400,
    tags: ['5–8 Pages', 'Blog', 'SEO Setup', 'Maps', 'Chat Integration'],
  },
  {
    id: 'premium-corporate', name: 'Premium Corporate', icon: Sparkles, color: 'var(--color-accent-violet)',
    audience: 'Established brands', min: 9800, max: 16800,
    tags: ['10+ Pages', 'Advanced UI/UX', 'Careers Page', 'SEO', 'Security'],
  },
  {
    id: 'ecommerce', name: 'Ecommerce Website', icon: ShoppingCart, color: 'var(--color-warning)',
    audience: 'Online stores', min: 8400, max: 21000,
    tags: ['Storefront', 'Product Pages', 'Admin Dashboard', 'Stock Tracking'],
  },
  {
    id: 'booking-system', name: 'Booking System Website', icon: CalendarClock, color: 'var(--color-danger)',
    audience: 'Service businesses', min: 7000, max: 14000,
    tags: ['Booking-ready structure', 'Admin Panel'],
  },
  {
    id: 'saas-mvp', name: 'SaaS MVP', icon: LayoutDashboard, color: 'var(--sg-accent)',
    audience: 'Startups & tech platforms', min: 14000, max: 56000,
    tags: ['Dashboards', 'Authentication', 'APIs', 'Scalable Architecture'],
  },
  {
    id: 'landing-page', name: 'Landing Page', icon: Megaphone, color: 'var(--sg-accent-2)',
    audience: 'Promotions & campaigns', min: 1500, max: 2800,
    tags: ['1-page design', 'CTA', 'Analytics'],
  },
]

const CUSTOM_APP = {
  id: 'custom-app', name: 'Custom App Development', icon: Sparkles, color: 'var(--color-accent-violet)',
  audience: "Something that doesn't fit a template", min: null, max: null,
  tags: ['Describe what you need', "We scope it", 'Fixed-price quote back within 48 hours'],
}

const ADD_ONS = [
  { id: 'rush', label: 'Priority / rush delivery', desc: 'Move to the front of the queue', price: 1200 },
  { id: 'branding', label: 'Logo & brand identity', desc: 'Logo, color system, brand guide', price: 800 },
  { id: 'copywriting', label: 'Content & copywriting', desc: 'We write the copy for every page', price: 600 },
  { id: 'payments', label: 'Payment gateway integration', desc: 'Paystack / Stripe / mobile money', price: 900 },
  { id: 'multilang', label: 'Multi-language support', desc: 'English + one additional language', price: 1200 },
  { id: 'support', label: '+3 months post-launch support', desc: 'Bug fixes & small tweaks included', price: 500 },
]

const TIMELINES = ['Urgent — under 1 month', 'Normal — 1–3 months', 'Planning ahead — 3–6 months', 'No fixed deadline']

const gh = (n) => `GH₵${Math.round(n).toLocaleString()}`

const STEPS = ['Package', 'Add-Ons', 'Details', 'Review']

export default function PriceEstimator() {
  const [step, setStep] = useState(0)
  const [pkgId, setPkgId] = useState(null)
  const [complexity, setComplexity] = useState(0.5)
  const [addOns, setAddOns] = useState(new Set())
  const [form, setForm] = useState({ name: '', email: '', phone: '', organization: '', timeline: TIMELINES[1], details: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const pkg = pkgId === CUSTOM_APP.id ? CUSTOM_APP : PACKAGES.find(p => p.id === pkgId)
  const isCustom = pkgId === CUSTOM_APP.id

  const basePrice = pkg && !isCustom ? pkg.min + (pkg.max - pkg.min) * complexity : null
  const addOnsTotal = useMemo(
    () => ADD_ONS.filter(a => addOns.has(a.id)).reduce((sum, a) => sum + a.price, 0),
    [addOns],
  )
  const total = basePrice !== null ? basePrice + addOnsTotal : null

  function toggleAddOn(id) {
    setAddOns(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function selectPackage(id) {
    setPkgId(id)
    setComplexity(0.5)
    setAddOns(new Set())
    setStep(1)
  }

  function goNext() {
    // Custom app skips the add-ons step — there's no base price to add onto.
    if (step === 0 && isCustom) return setStep(2)
    setStep(s => Math.min(s + 1, 3))
  }
  function goBack() {
    if (step === 2 && isCustom) return setStep(0)
    setStep(s => Math.max(s - 1, 0))
  }

  async function handleSubmit() {
    setStatus('sending')
    const addOnList = ADD_ONS.filter(a => addOns.has(a.id))
    try {
      await submitLead({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        organization: form.organization || null,
        missionScope: pkg.name,
        budget: isCustom ? 'Custom quote' : `${gh(total)} (est.)`,
        timeline: form.timeline,
        details: [
          form.details,
          !isCustom && addOnList.length ? `Add-ons: ${addOnList.map(a => a.label).join(', ')}` : null,
        ].filter(Boolean).join('\n\n'),
        source: 'price_estimator',
        product: pkg.id,
        configuratorSelections: {
          package: pkg.id,
          complexity: isCustom ? null : complexity,
          addOns: isCustom ? [] : addOnList.map(a => a.id),
          estimatedTotal: isCustom ? null : Math.round(total),
        },
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <PageLayout>
        <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '4rem 2rem' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: '480px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-success) 14%, transparent)', border: '1.5px solid color-mix(in srgb, var(--color-success) 30%, transparent)', display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem' }}>
              <Check size={28} color="var(--color-success)" />
            </div>
            <h1 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>Got it — we're on it.</h1>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              {isCustom
                ? "We've received your project description. We'll scope it and reply with a fixed-price quote within 48 hours."
                : `We've received your ${pkg.name} estimate request. We'll follow up shortly to confirm scope and next steps.`}
            </p>
          </motion.div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div style={{ borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface)', padding: '3.5rem 2rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="section-label">PRICE ESTIMATOR</div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            Get a real estimate in under a minute
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', maxWidth: '520px', marginBottom: '1.75rem' }}>
            Pick a project type, adjust it to your needs, and see a price range instantly.
          </p>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {STEPS.map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  color: i <= step ? 'var(--sg-accent)' : 'var(--color-text-secondary)',
                  fontWeight: i === step ? 700 : 500, fontSize: '0.85rem',
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center',
                    fontSize: '0.7rem', fontWeight: 700,
                    background: i <= step ? 'var(--sg-accent)' : 'var(--color-surface-alt)',
                    color: i <= step ? '#FFFFFF' : 'var(--color-text-secondary)',
                  }}>
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
            <motion.div key="package" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Choose your package</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {[...PACKAGES, CUSTOM_APP].map(p => {
                  const Icon = p.icon
                  return (
                    <button
                      key={p.id}
                      onClick={() => selectPackage(p.id)}
                      className="card"
                      style={{
                        textAlign: 'left', cursor: 'pointer', padding: '1.5rem',
                        borderColor: pkgId === p.id ? p.color : undefined,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '9px', background: `${p.color}14`, border: `1.5px solid ${p.color}28`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                          <Icon size={17} color={p.color} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{p.audience}</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: p.color, marginBottom: '0.75rem' }}>
                        {p.min === null ? 'Custom quote' : `${gh(p.min)} – ${gh(p.max)}`}
                      </div>
                      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                        {p.tags.map(t => (
                          <span key={t} style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem', borderRadius: '999px', background: 'var(--color-surface-alt)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)' }}>{t}</span>
                        ))}
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {step === 1 && pkg && !isCustom && (
            <motion.div key="addons" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>Adjust complexity — {pkg.name}</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Project scope & complexity</p>
              <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <input
                  type="range" min="0" max="1" step="0.01" value={complexity}
                  onChange={e => setComplexity(Number(e.target.value))}
                  style={{ width: '100%', accentColor: pkg.color }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                  <span>Basic ({gh(pkg.min)})</span>
                  <span>Advanced ({gh(pkg.max)})</span>
                </div>
              </div>

              <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Add-ons</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.875rem' }}>
                {ADD_ONS.map(a => {
                  const checked = addOns.has(a.id)
                  return (
                    <button
                      key={a.id}
                      onClick={() => toggleAddOn(a.id)}
                      className="card"
                      style={{ textAlign: 'left', cursor: 'pointer', padding: '1.1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', borderColor: checked ? 'var(--sg-accent)' : undefined }}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: '5px', flexShrink: 0, marginTop: '2px',
                        border: `1.5px solid ${checked ? 'var(--sg-accent)' : 'var(--color-border-subtle)'}`,
                        background: checked ? 'var(--sg-accent)' : 'transparent',
                        display: 'grid', placeItems: 'center',
                      }}>
                        {checked && <Check size={13} color="#FFFFFF" />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{a.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>{a.desc}</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sg-accent)' }}>+{gh(a.price)}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && pkg && (
            <motion.div key="details" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Your details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }} className="pe-form-grid">
                <input className="input" placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input className="input" type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <input className="input" placeholder="Phone / WhatsApp" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                <input className="input" placeholder="Business name (optional)" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>Timeline</label>
                <select className="input" value={form.timeline} onChange={e => setForm({ ...form, timeline: e.target.value })} style={{ width: '100%' }}>
                  {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                  {isCustom ? "Describe what you want built — the more detail, the better the quote" : 'Anything else we should know? (optional)'}
                </label>
                <textarea
                  className="input" rows={isCustom ? 7 : 3} style={{ width: '100%', resize: 'vertical' }}
                  placeholder={isCustom ? "e.g. an app that lets my drivers log deliveries and customers track them in real time..." : ''}
                  value={form.details} onChange={e => setForm({ ...form, details: e.target.value })}
                />
              </div>
            </motion.div>
          )}

          {step === 3 && pkg && (
            <motion.div key="review" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Review your estimate</h2>
              <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{pkg.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{pkg.audience}</div>
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--sg-accent)' }}>
                    {isCustom ? 'Custom quote' : gh(total)}
                  </div>
                </div>
                {!isCustom && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Base ({gh(pkg.min)}–{gh(pkg.max)} range) at chosen complexity</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.4rem' }}>
                      <span>Base estimate</span><span>{gh(basePrice)}</span>
                    </div>
                    {ADD_ONS.filter(a => addOns.has(a.id)).map(a => (
                      <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>
                        <span>{a.label}</span><span>+{gh(a.price)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                  {form.name} · {form.email}{form.phone ? ` · ${form.phone}` : ''}
                  <br />Timeline: {form.timeline}
                </div>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                This is an estimate, not a final invoice — we'll confirm exact scope and price with you before any work begins.
              </p>
              {status === 'error' && (
                <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Something went wrong sending your request — please try again.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav buttons */}
        {step > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
            <button className="btn-secondary" onClick={goBack} disabled={status === 'sending'}>
              <ArrowLeft size={15} /> Back
            </button>
            {step < 3 ? (
              <button
                className="btn-primary"
                onClick={goNext}
                disabled={step === 2 && (!form.name || !form.email || (isCustom && !form.details))}
              >
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button className="btn-primary" onClick={handleSubmit} disabled={status === 'sending'}>
                {status === 'sending' ? <><Loader2 size={15} className="pe-spin" /> Sending...</> : <>Submit request <ArrowRight size={15} /></>}
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        .pe-spin { animation: peSpin 0.8s linear infinite; }
        @keyframes peSpin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .pe-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PageLayout>
  )
}
