import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Heart, Package, Factory, Layers, X, Check } from 'lucide-react'
import { products } from '../../data/products'
import { useAdmin } from '../../context/AdminContext'

const ICONS = { Users, Heart, Package, Factory, Layers }

function OrbitCard({ product, angle, paused, onClick }) {
  const radius = 220
  const rad = (angle * Math.PI) / 180
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius
  const Icon = ICONS[product.icon]

  return (
    <motion.button
      onClick={onClick}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        width: 120,
        height: 80,
        background: 'var(--color-background)',
        border: `1.5px solid var(--color-border-subtle)`,
        borderRadius: 'var(--border-radius)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem',
        padding: '0.75rem',
        boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
      }}
      whileHover={{ scale: 1.12, borderColor: product.color, boxShadow: `0 4px 24px ${product.color}30` }}
    >
      <Icon size={18} color={product.color} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-text-heading)', whiteSpace: 'nowrap' }}>{product.name}</span>
      <span className={`badge badge-${product.status}`} style={{ fontSize: '0.55rem', padding: '0.15rem 0.4rem' }}>{product.status}</span>
    </motion.button>
  )
}

function ProductModal({ product, onClose, onDemo }) {
  const Icon = ICONS[product.icon]
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--color-background)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', padding: '2.5rem', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 24px 80px rgba(15,23,42,0.16)' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><X size={20} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${product.color}20`, border: `1px solid ${product.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={22} color={product.color} />
          </div>
          <div>
            <h3 style={{ marginBottom: '0.25rem' }}>{product.name}</h3>
            <span className={`badge badge-${product.status}`}>{product.status}</span>
          </div>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{product.description}</p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {product.features.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
              <Check size={14} color="var(--color-success)" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
              {f}
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
          {product.tech.map(t => (
            <span key={t} style={{ background: 'var(--color-surface-alt)', border: '1px solid var(--color-border-subtle)', borderRadius: '6px', padding: '0.25rem 0.625rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>{t}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => onDemo(product.name)}>Request Demo</button>
          <button className="btn-secondary">Learn More</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function DemoRequestModal({ productName, onClose }) {
  const { addDemoRequest } = useAdmin()
  const [form, setForm] = useState({ name: '', email: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    addDemoRequest({ ...form, product: productName, source: 'Products Section', configuratorSelections: null })
    setSubmitted(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--color-background)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', padding: '2.5rem', maxWidth: '400px', width: '100%', boxShadow: '0 24px 80px rgba(15,23,42,0.16)' }}
      >
        <button onClick={onClose} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><X size={18} /></button>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✓</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Request Sent!</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>We'll be in touch within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: '0.25rem' }}>Request a Demo</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{productName}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              <input className="input" type="email" placeholder="Email address" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Send Request</button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Products() {
  const [rotation, setRotation] = useState(0)
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState(null)
  const [demoProduct, setDemoProduct] = useState(null)
  const reqRef = useRef(null)

  useEffect(() => {
    let last = null
    const tick = (ts) => {
      if (!paused) {
        if (last !== null) {
          setRotation(r => (r + (ts - last) * 0.003) % 360)
        }
        last = ts
      } else {
        last = null
      }
      reqRef.current = requestAnimationFrame(tick)
    }
    reqRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(reqRef.current)
  }, [paused])

  const baseAngles = products.map((_, i) => (i / products.length) * 360)

  return (
    <section id="products" style={{ padding: 'var(--section-padding) 2rem', background: 'var(--color-background)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,200,240,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>OUR PRODUCTS</div>
          <h2 style={{ marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Built systems.{' '}
            <span style={{ background: 'linear-gradient(120deg, var(--color-accent-blue), var(--color-accent-violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>In market. Working now.</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto' }}>Five products across HR, health, logistics, and manufacturing. Each one solving a real African business problem.</p>
        </motion.div>

        {/* Orbit — desktop */}
        <div className="hidden md:block" style={{ position: 'relative', height: '560px', width: '100%' }}>
          {/* Center */}
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 68, height: 68, borderRadius: '50%', background: 'var(--color-accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'gentlePulse 3s ease-in-out infinite', zIndex: 2, boxShadow: '0 4px 20px color-mix(in srgb, var(--sg-accent) 30%, transparent)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>S/</span>
          </div>
          {/* Orbit rings */}
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 480, height: 480, transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '1.5px solid var(--color-border-subtle)' }} />
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 300, height: 300, transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '1px dashed rgba(200,210,230,0.6)' }} />

          {products.map((product, i) => (
            <OrbitCard
              key={product.id}
              product={product}
              angle={baseAngles[i] + rotation}
              paused={paused}
              onClick={() => { setSelected(product); setPaused(true) }}
            />
          ))}
        </div>

        {/* Card stack — mobile */}
        <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {products.map(product => {
            const Icon = ICONS[product.icon]
            return (
              <button key={product.id} onClick={() => setSelected(product)} className="card" style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--color-surface-alt)', width: '100%' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${product.color}15`, border: `1px solid ${product.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={product.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>{product.name}</span>
                    <span className={`badge badge-${product.status}`}>{product.status}</span>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{product.tagline}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <ProductModal
            product={selected}
            onClose={() => { setSelected(null); setPaused(false) }}
            onDemo={(name) => { setSelected(null); setDemoProduct(name) }}
          />
        )}
        {demoProduct && (
          <DemoRequestModal productName={demoProduct} onClose={() => setDemoProduct(null)} />
        )}
      </AnimatePresence>

      <style>{`@keyframes gentlePulse { 0%,100%{box-shadow:0 0 0 0 color-mix(in srgb, var(--color-accent-blue) 20%, transparent)} 50%{box-shadow:0 0 0 12px color-mix(in srgb, var(--color-accent-blue) 0%, transparent)} }`}</style>
    </section>
  )
}
