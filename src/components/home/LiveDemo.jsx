import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import NexusHRMDemo from '../demos/NexusHRMDemo'
import SANODemo from '../demos/SANODemo'
import CargoScanDemo from '../demos/CargoScanDemo'
import NexusMFGDemo from '../demos/NexusMFGDemo'
import GlasstechDemo from '../demos/GlasstechDemo'
import { useAdmin } from '../../context/AdminContext'

const TABS = [
  { id: 'nexus-hrm', label: 'Nexus HRM', component: NexusHRMDemo },
  { id: 'sano', label: 'SANO', component: SANODemo },
  { id: 'cargoscan', label: 'CargoScan', component: CargoScanDemo },
  { id: 'nexus-mfg', label: 'Nexus MFG', component: NexusMFGDemo },
  { id: 'glasstech', label: 'Glasstech', component: GlasstechDemo },
]

function DemoRequestModal({ onClose }) {
  const { addDemoRequest } = useAdmin()
  const [form, setForm] = useState({ name: '', email: '', product: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    addDemoRequest({ ...form, source: 'Demo Section', configuratorSelections: null })
    setSent(true)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(8px)' }}
    >
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}
        style={{ background: 'var(--color-background)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', padding: '2.5rem', maxWidth: '420px', width: '100%', position: 'relative', boxShadow: '0 24px 80px rgba(15,23,42,0.16)' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><X size={18} /></button>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✓</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Request Sent!</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>We'll be in touch within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: '0.5rem' }}>Request Full Demo</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Get access to the complete version of any product.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              <input className="input" type="email" placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
              <select className="input" value={form.product} onChange={e => setForm(p => ({ ...p, product: e.target.value }))} required>
                <option value="">Select product...</option>
                {TABS.map(t => <option key={t.id} value={t.label}>{t.label}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Request Demo</button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function LiveDemo() {
  const [activeTab, setActiveTab] = useState(TABS[0].id)
  const [showModal, setShowModal] = useState(false)

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component

  return (
    <section id="demos" style={{ padding: 'var(--section-padding) 2rem', background: 'var(--color-surface)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>LIVE DEMOS</div>
          <h2 style={{ marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            See it{' '}
            <span style={{ background: 'linear-gradient(120deg, var(--color-accent-blue), var(--color-accent-violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>working. Right now.</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto' }}>These are real working tools. Click around, explore, and see what we build.</p>
        </motion.div>

        {/* Browser frame */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ background: 'var(--color-background)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', boxShadow: '0 8px 40px rgba(15,23,42,0.1)' }}
        >
          {/* Browser chrome */}
          <div style={{ background: 'var(--color-surface)', padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--color-danger)' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--color-warning)' }} />
              <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--color-success)' }} />
              <div style={{ flex: 1, background: 'var(--color-surface-alt)', border: '1px solid var(--color-border-subtle)', borderRadius: '6px', padding: '0.3rem 0.75rem', marginLeft: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                app.stormglide.io/demo/{activeTab}
              </div>
            </div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto' }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{ padding: '0.375rem 0.875rem', background: activeTab === tab.id ? 'var(--color-background)' : 'none', border: 'none', borderRadius: '6px 6px 0 0', borderBottom: `2px solid ${activeTab === tab.id ? 'var(--color-accent-blue)' : 'transparent'}`, color: activeTab === tab.id ? 'var(--color-accent-blue)' : 'var(--color-text-secondary)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: activeTab === tab.id ? 600 : 400, whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Demo content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* CTA below frame */}
        <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>Want the full version?</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>Request a Demo</button>
        </div>
      </div>

      <AnimatePresence>
        {showModal && <DemoRequestModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </section>
  )
}
