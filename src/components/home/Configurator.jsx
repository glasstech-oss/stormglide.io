import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Factory, Heart, Package, ShoppingCart, Monitor, Check } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

const STEP1 = [
  { id: 'hr', label: 'HR & Payroll Management', icon: Users },
  { id: 'production', label: 'Production & Manufacturing', icon: Factory },
  { id: 'health', label: 'Health & Patient Management', icon: Heart },
  { id: 'logistics', label: 'Logistics & Freight', icon: Package },
  { id: 'ecommerce', label: 'E-commerce & Sales', icon: ShoppingCart },
  { id: 'custom', label: 'Custom Web or Mobile App', icon: Monitor },
]

const STEP2 = [
  { id: '1', label: 'Just me', sub: '1 person' },
  { id: '2-10', label: 'Small team', sub: '2–10 people' },
  { id: '10-50', label: 'Growing business', sub: '10–50 people' },
  { id: '50+', label: 'Established company', sub: '50+ people' },
]

const STEP3 = [
  { id: 'urgent', label: 'I need this urgently', sub: '< 1 month' },
  { id: 'normal', label: 'Normal pace', sub: '1–3 months' },
  { id: 'planning', label: 'Planning ahead', sub: '3–6 months' },
  { id: 'exploring', label: 'Just exploring for now', sub: 'No deadline' },
]

function getRecommendation(needs, timeline) {
  if (needs.includes('hr')) return { name: 'Nexus HRM', desc: 'Nexus HRM is the perfect fit — it covers payroll, leave, and performance tracking for businesses your size. We can customize it to your exact workflow.' }
  if (needs.includes('production')) return { name: 'Nexus MFG', desc: 'Nexus MFG will give your production floor real-time visibility and control. Built for African manufacturers, deployed and working.' }
  if (needs.includes('health')) return { name: 'SANO Health', desc: 'SANO is built for African healthcare contexts. Offline-first, mobile-first, and designed around how community health actually works.' }
  if (needs.includes('logistics')) return { name: 'CargoScan', desc: 'CargoScan will solve your freight calculation and shipment tracking immediately. Start using it within days, not months.' }
  if (needs.length > 1) return { name: 'Custom Integrated Solution', desc: "Your needs span multiple areas — we'd build a custom integrated system that connects all these workflows in one platform. This is exactly what we do." }
  return { name: 'Custom Web or Mobile App', desc: 'We\'ll design and build exactly what you need from scratch. No compromises, no templates — a system built around how you actually work.' }
}

const getTimeline = (tid) => ({ urgent: '2–4 weeks', normal: '4–10 weeks', planning: '2–4 months', exploring: 'When you\'re ready — we\'ll be here.' }[tid] || '4–8 weeks')

export default function Configurator() {
  const { addDemoRequest } = useAdmin()
  const [step, setStep] = useState(1)
  const [needs, setNeeds] = useState([])
  const [team, setTeam] = useState(null)
  const [timeline, setTimeline] = useState(null)
  const [form, setForm] = useState({ name: '', email: '' })
  const [submitted, setSubmitted] = useState(false)

  const toggleNeed = (id) => setNeeds(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id])

  const handleSubmit = (e) => {
    e.preventDefault()
    const rec = getRecommendation(needs, timeline)
    addDemoRequest({
      ...form,
      product: rec.name,
      source: 'Configurator',
      configuratorSelections: { needs, team, timeline },
    })
    setSubmitted(true)
  }

  const slideVariants = {
    enter: { x: 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -40, opacity: 0 },
  }

  const rec = getRecommendation(needs, timeline)

  return (
    <section id="configurator" style={{ padding: 'var(--section-padding) 2rem', background: 'var(--color-background)' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>GET STARTED</div>
          <h2 style={{ marginBottom: '1rem', letterSpacing: '-0.02em' }}>Not sure where to start?</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>Answer 3 quick questions and we'll tell you exactly what to build.</p>
        </motion.div>

        {step <= 3 && (
          <>
            {/* Progress bar */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? 'var(--color-accent-blue)' : 'var(--color-border-subtle)', transition: 'background 0.3s' }} />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>What does your business need?</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Select all that apply</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                    {STEP1.map(({ id, label, icon: Icon }) => (
                      <button key={id} onClick={() => toggleNeed(id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: needs.includes(id) ? 'color-mix(in srgb, var(--sg-accent) 6%, transparent)' : 'var(--color-background)', border: `1.5px solid ${needs.includes(id) ? 'var(--color-accent-blue)' : 'var(--color-border-subtle)'}`, borderRadius: 'var(--border-radius)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }}
                      >
                        <Icon size={18} color={needs.includes(id) ? 'var(--color-accent-blue)' : 'var(--color-text-secondary)'} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: needs.includes(id) ? 'var(--color-accent-blue)' : 'var(--color-text-secondary)' }}>{label}</span>
                      </button>
                    ))}
                  </div>
                  <button className="btn-primary" disabled={needs.length === 0} onClick={() => setStep(2)} style={{ opacity: needs.length === 0 ? 0.5 : 1 }}>Next →</button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                  <h3 style={{ marginBottom: '1.5rem' }}>How big is your team?</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                    {STEP2.map(opt => (
                      <button key={opt.id} onClick={() => setTeam(opt.id)}
                        style={{ padding: '1rem', background: team === opt.id ? 'color-mix(in srgb, var(--sg-accent) 6%, transparent)' : 'var(--color-background)', border: `1.5px solid ${team === opt.id ? 'var(--color-accent-blue)' : 'var(--color-border-subtle)'}`, borderRadius: 'var(--border-radius)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }}
                      >
                        <div style={{ fontWeight: 600, color: team === opt.id ? 'var(--color-accent-blue)' : 'var(--color-text-heading)', marginBottom: '0.25rem', fontSize: '0.9rem' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
                    <button className="btn-primary" disabled={!team} onClick={() => setStep(3)} style={{ opacity: !team ? 0.5 : 1 }}>Next →</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                  <h3 style={{ marginBottom: '1.5rem' }}>What's your timeline?</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                    {STEP3.map(opt => (
                      <button key={opt.id} onClick={() => setTimeline(opt.id)}
                        style={{ padding: '1rem', background: timeline === opt.id ? 'color-mix(in srgb, var(--sg-accent) 6%, transparent)' : 'var(--color-background)', border: `1.5px solid ${timeline === opt.id ? 'var(--color-accent-blue)' : 'var(--color-border-subtle)'}`, borderRadius: 'var(--border-radius)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }}
                      >
                        <div style={{ fontWeight: 600, color: timeline === opt.id ? 'var(--color-accent-blue)' : 'var(--color-text-heading)', marginBottom: '0.25rem', fontSize: '0.9rem' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
                    <button className="btn-primary" disabled={!timeline} onClick={() => setStep(4)} style={{ opacity: !timeline ? 0.5 : 1 }}>See Recommendation →</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {step === 4 && (
          <AnimatePresence>
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ background: 'color-mix(in srgb, var(--sg-accent) 4%, transparent)', border: '1.5px solid color-mix(in srgb, var(--sg-accent) 20%, transparent)', borderRadius: 'var(--border-radius-lg)', padding: '2rem', marginBottom: '2rem' }}>
                <div className="section-label" style={{ marginBottom: '0.5rem' }}>Our Recommendation</div>
                <h3 style={{ color: 'var(--color-accent-blue)', marginBottom: '1rem' }}>{rec.name}</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>{rec.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  <Check size={14} color="var(--color-success)" />
                  Estimated delivery: {getTimeline(timeline)}
                </div>
              </div>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem', background: 'color-mix(in srgb, var(--color-success) 5%, transparent)', borderRadius: 'var(--border-radius)', border: '1.5px solid color-mix(in srgb, var(--color-success) 20%, transparent)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✓</div>
                  <p style={{ color: 'var(--color-success)' }}>We'll be in touch within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>Send me this recommendation</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                    <input className="input" type="email" placeholder="Email address" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="button" className="btn-secondary" onClick={() => { setStep(1); setNeeds([]); setTeam(null); setTimeline(null) }}>Start Over</button>
                    <button type="submit" className="btn-primary">Send me this recommendation →</button>
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}
