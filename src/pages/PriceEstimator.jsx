import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Globe, Building2, ShoppingCart, CalendarClock, Package, Zap, Sparkles, Loader2, ArrowUpRight } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout'
import { useTheme } from '../context/ThemeContext'
import SystemBuilderCanvas from '../components/estimator/SystemBuilderCanvas'
import { Eye, List } from 'lucide-react'
import { submitLead } from '../lib/crm'

// Grounded in what we've actually delivered (see src/data/clientWork.js) and
// realistic Ghana SME software-project pricing — not a copied rate card.
// Categories map to real project shapes, and each links to a live example
// where we have one, so a visitor can see exactly what that price bought.
const PACKAGES = [
  {
    id: 'website', name: 'Business Website', icon: Globe, color: 'var(--sg-accent)',
    audience: 'Get found online, take enquiries', min: 7000, max: 18000,
    example: 'Like Westline Future\'s site',
    note: 'Basic sites start at GH₵7,000 — the final number depends entirely on what you actually need.',
    tags: ['5–8 pages', 'Mobile-friendly', 'WhatsApp button', 'Contact form'],
  },
  {
    id: 'ecommerce', name: 'Online Store', icon: ShoppingCart, color: 'var(--color-warning)',
    audience: 'Sell online, accept MoMo & card payments', min: 8500, max: 25000,
    example: 'Like Lollarod Enterprise',
    note: 'Large-scale or highly custom stores (multi-warehouse, ERP/API integration, marketplace-scale) run well beyond this — up to GH₵400,000+, scoped individually.',
    tags: ['Product catalog', 'Paystack / MoMo checkout', 'Admin dashboard'],
  },
  {
    id: 'booking', name: 'Booking & Scheduling System', icon: CalendarClock, color: 'var(--color-danger)',
    audience: 'Salons, clinics, consultants, service businesses', min: 9000, max: 20000,
    example: 'Like BarberManager',
    tags: ['Live time-slot booking', 'SMS confirmations', 'Staff portal'],
  },
  {
    id: 'pos-inventory', name: 'Sales & Inventory System', icon: Package, color: 'var(--color-accent-violet)',
    audience: 'Restaurants, retail, wholesale', min: 14000, max: 32000,
    example: 'Like Kyekye Cuisine',
    tags: ['POS / order flow', 'Kitchen or stock dashboard', 'Multi-role staff access'],
  },
  {
    id: 'custom-system', name: 'Custom Business System', icon: Building2, color: 'var(--sg-accent-2)',
    audience: 'HR, payroll, logistics, health records — built from scratch', min: 22000, max: 60000,
    example: 'Like Nexus HRM',
    tags: ['Fully bespoke', 'Multi-branch ready', 'Reports & dashboards'],
  },
  {
    id: 'deploy-product', name: 'Deploy an Existing Product', icon: Zap, color: 'var(--color-success)',
    audience: 'Nexus HRM, CargoScan, LOÙ Beauty Hub — live in days, not months', min: 6000, max: 14000,
    tags: ['Branded & configured for you', 'Staff training included', 'Fastest way to go live'],
  },
]

const CUSTOM_APP = {
  id: 'custom-app', name: 'Something Else', icon: Sparkles, color: 'var(--color-accent-coral)',
  audience: "Doesn't fit a template? Tell us what you need", min: null, max: null,
  tags: ['Describe what you need', 'We scope it', 'Fixed-price quote back within 48 hours'],
}

// What actually drives cost on a Ghanaian SME project, beyond the base
// build — each one is a real capability we've shipped before (see
// clientWork.js), not a generic web-agency upsell.
const SCOPE_FACTORS = [
  { id: 'multi-branch', label: 'Multiple branches or locations', desc: 'One system, several sites — like Westline Future\'s 3-country setup', price: 2500 },
  { id: 'payments', label: 'Mobile Money / card payments', desc: 'Paystack, MTN MoMo, or both, built into checkout or invoicing', price: 1200 },
  { id: 'offline', label: 'Needs to work without steady internet', desc: 'Keeps running when the connection drops, syncs when it\'s back', price: 1800 },
  { id: 'whatsapp', label: 'WhatsApp order / booking alerts', desc: 'Customers and staff notified automatically, no app required', price: 900 },
  { id: 'staff-roles', label: 'Multiple staff logins with different access levels', desc: 'Admin, staff, and manager views — everyone sees only what they need', price: 1500 },
  { id: 'reports', label: 'Sales / performance reports dashboard', desc: 'Real numbers on demand, not a manual month-end spreadsheet', price: 1400 },
]

const ADD_ONS = [
  { id: 'rush', label: 'Priority / rush delivery', desc: 'Move to the front of the queue', price: 1500 },
  { id: 'branding', label: 'Logo & brand identity', desc: 'Logo, color system, brand guide', price: 1000 },
  { id: 'copywriting', label: 'Content & copywriting', desc: 'We write the copy for every page', price: 700 },
  { id: 'multilang', label: 'Multi-language support', desc: 'English + one additional language (e.g. Twi, Ewe, Ga)', price: 1200 },
  { id: 'support', label: '+3 months post-launch support', desc: 'Bug fixes & small tweaks included', price: 600 },
]

const TIMELINES = ['Urgent — under 1 month', 'Normal — 1–3 months', 'Planning ahead — 3–6 months', 'No fixed deadline']

// Same chaos the rest of the site names by name (see HomeWorld's debris:
// WhatsApp, Excel, paper, notebooks) — asking it here instead of a generic
// "tell us about your business" box gives our team something concrete to
// work from, and shows the visitor we already know their situation.
const CURRENT_SETUPS = [
  'WhatsApp & phone calls',
  'Excel / spreadsheets',
  'Paper & notebooks',
  'An existing system that isn\'t working well',
  'Nothing formal yet',
]

const gh = (n) => `GH₵${Math.round(n).toLocaleString()}`

const STEPS = ['Package', 'What You Need', 'Details', 'Review']

export default function PriceEstimator() {
  const { theme } = useTheme()
  const whatsappPhone = theme.contactWhatsapp.replace(/[^0-9]/g, '').replace(/^0/, '233')
  const [step, setStep] = useState(0)
  const [pkgId, setPkgId] = useState(null)
  const [scopeFactors, setScopeFactors] = useState(new Set())
  const [addOns, setAddOns] = useState(new Set())
  const [form, setForm] = useState({ name: '', email: '', phone: '', organization: '', currentSetup: '', timeline: TIMELINES[1], details: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [viewMode, setViewMode] = useState('list') // 'list' | 'canvas'

  const pkg = pkgId === CUSTOM_APP.id ? CUSTOM_APP : PACKAGES.find(p => p.id === pkgId)
  const isCustom = pkgId === CUSTOM_APP.id

  const scopeFactorsTotal = useMemo(
    () => SCOPE_FACTORS.filter(f => scopeFactors.has(f.id)).reduce((sum, f) => sum + f.price, 0),
    [scopeFactors],
  )
  const addOnsTotal = useMemo(
    () => ADD_ONS.filter(a => addOns.has(a.id)).reduce((sum, a) => sum + a.price, 0),
    [addOns],
  )
  // A plain, explainable build-up from what you actually picked — not an
  // abstract slider between "basic" and "advanced" with no visible logic.
  const basePrice = pkg && !isCustom ? pkg.min + scopeFactorsTotal : null
  const total = basePrice !== null ? basePrice + addOnsTotal : null

  function toggleScopeFactor(id) {
    setScopeFactors(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAddOn(id) {
    setAddOns(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function selectPackage(id) {
    setPkgId(id)
    setScopeFactors(new Set())
    setAddOns(new Set())
    setStep(1)
  }

  function goNext() {
    // Custom app skips the scope/add-ons step — there's no base price to add onto.
    if (step === 0 && isCustom) return setStep(2)
    setStep(s => Math.min(s + 1, 3))
  }
  function goBack() {
    if (step === 2 && isCustom) return setStep(0)
    setStep(s => Math.max(s - 1, 0))
  }

  async function handleSubmit() {
    setStatus('sending')
    const factorList = SCOPE_FACTORS.filter(f => scopeFactors.has(f.id))
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
          form.currentSetup ? `Currently running this on: ${form.currentSetup}` : null,
          form.details,
          !isCustom && factorList.length ? `Needs: ${factorList.map(f => f.label).join(', ')}` : null,
          !isCustom && addOnList.length ? `Add-ons: ${addOnList.map(a => a.label).join(', ')}` : null,
        ].filter(Boolean).join('\n\n'),
        source: 'price_estimator',
        product: pkg.id,
        configuratorSelections: {
          package: pkg.id,
          currentSetup: form.currentSetup || null,
          scopeFactors: isCustom ? [] : factorList.map(f => f.id),
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
    const waMessage = encodeURIComponent(
      isCustom
        ? `Hi Stormglide, I just submitted a custom project request${form.name ? ` (${form.name})` : ''}. Looking forward to your quote.`
        : `Hi Stormglide, I just submitted a price estimate for ${pkg.name} (~${gh(total)})${form.name ? ` — ${form.name}` : ''}.`,
    )
    return (
      <PageLayout>
        <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '4rem 2rem' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: '480px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-success) 14%, transparent)', border: '1.5px solid color-mix(in srgb, var(--color-success) 30%, transparent)', display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem' }}>
              <Check size={28} color="var(--color-success)" />
            </div>
            <h1 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>Got it — we're on it.</h1>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
              {isCustom
                ? "We've received your project description. Expect a WhatsApp message or call from our team within 48 hours with a fixed-price quote."
                : `We've received your ${pkg.name} estimate — around ${gh(total)} based on what you told us. Expect a WhatsApp message or call within 24 hours to confirm scope and lock in a final price.`}
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
          <div className="section-label">PRICE ESTIMATOR</div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            Get a real estimate in under a minute
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', maxWidth: '560px', marginBottom: '1.75rem' }}>
            Pick a project type, tell us what you actually need it to do, and see a price build up in front of you — no hidden slider, no guesswork.
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
                    width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
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
              <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>What are you trying to build?</h2>
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
                        <div style={{ width: 36, height: 36, borderRadius: '9px', background: `${p.color}14`, border: `1.5px solid ${p.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={17} color={p.color} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{p.audience}</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: p.color, marginBottom: '0.15rem' }}>
                        {p.min === null ? 'Custom quote' : `${gh(p.min)} – ${gh(p.max)}`}
                      </div>
                      {p.example && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', marginBottom: p.note ? '0.4rem' : '0.75rem' }}>{p.example}</div>
                      )}
                      {p.note && (
                        <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', lineHeight: 1.45, marginBottom: '0.75rem' }}>{p.note}</div>
                      )}
                      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginTop: (p.example || p.note) ? 0 : '0.75rem' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>What does your {pkg.name.toLowerCase()} actually need to do?</h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                    Base price starts at {gh(pkg.min)}. Tick what applies — the price below updates as you go.
                  </p>
                </div>
                <div style={{ display: 'flex', background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: '99px', padding: '0.25rem' }}>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, background: viewMode === 'list' ? 'var(--color-surface-alt)' : 'transparent', color: viewMode === 'list' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', border: 'none', cursor: 'pointer' }}
                  >
                    <List size={14} /> List
                  </button>
                  <button
                    onClick={() => setViewMode('canvas')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, background: viewMode === 'canvas' ? 'var(--color-surface-alt)' : 'transparent', color: viewMode === 'canvas' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', border: 'none', cursor: 'pointer' }}
                  >
                    <Eye size={14} /> Visual Builder
                  </button>
                </div>
              </div>

              {viewMode === 'canvas' ? (
                <div style={{ marginBottom: '2rem' }}>
                  <SystemBuilderCanvas
                    pkg={pkg}
                    scopeFactors={scopeFactors}
                    addOns={addOns}
                    allScopeFactors={SCOPE_FACTORS}
                    allAddOns={ADD_ONS}
                    onToggleScopeFactor={toggleScopeFactor}
                    onToggleAddOn={toggleAddOn}
                  />
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.875rem', marginBottom: '2.25rem' }}>
                    {SCOPE_FACTORS.map(f => {
                      const checked = scopeFactors.has(f.id)
                      return (
                        <button
                      key={f.id}
                      onClick={() => toggleScopeFactor(f.id)}
                      className="card"
                      style={{ textAlign: 'left', cursor: 'pointer', padding: '1.1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', borderColor: checked ? pkg.color : undefined }}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: '5px', flexShrink: 0, marginTop: '2px',
                        border: `1.5px solid ${checked ? pkg.color : 'var(--color-border-subtle)'}`,
                        background: checked ? pkg.color : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {checked && <Check size={13} color="#FFFFFF" />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{f.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>{f.desc}</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: pkg.color }}>+{gh(f.price)}</div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="card" style={{ padding: '1.1rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `${pkg.color}0A` }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Running estimate</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: pkg.color }}>{gh(basePrice)}</span>
              </div>

              <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Optional extras</h2>
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
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
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
                </>
              )}
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
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>How are you running this today?</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {CURRENT_SETUPS.map(s => {
                    const active = form.currentSetup === s
                    return (
                      <button
                        key={s} type="button"
                        onClick={() => setForm({ ...form, currentSetup: active ? '' : s })}
                        style={{
                          padding: '0.5rem 0.9rem', borderRadius: '999px', cursor: 'pointer',
                          fontSize: '0.82rem', fontWeight: 600,
                          border: `1.5px solid ${active ? 'var(--sg-accent)' : 'var(--color-border-subtle)'}`,
                          background: active ? 'var(--sg-accent)' : 'var(--color-surface)',
                          color: active ? '#FFFFFF' : 'var(--color-text-primary)',
                        }}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.4rem' }}>
                      <span>Base ({pkg.name})</span><span>{gh(pkg.min)}</span>
                    </div>
                    {SCOPE_FACTORS.filter(f => scopeFactors.has(f.id)).map(f => (
                      <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>
                        <span>{f.label}</span><span>+{gh(f.price)}</span>
                      </div>
                    ))}
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
                  {form.currentSetup && <><br />Currently on: {form.currentSetup}</>}
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
