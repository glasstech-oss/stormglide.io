import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, CheckCircle2, Users, Heart, Package, Factory, Layers, ExternalLink } from 'lucide-react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { products } from '../data/products'
import { useAdmin } from '../context/AdminContext'
import NexusHRMDemo from '../components/demos/NexusHRMDemo'
import SANODemo from '../components/demos/SANODemo'
import CargoScanDemo from '../components/demos/CargoScanDemo'
import NexusMFGDemo from '../components/demos/NexusMFGDemo'
import GlasstechDemo from '../components/demos/GlasstechDemo'

const ICONS = { Users, Heart, Package, Factory, Layers }

const DEMO_COMPONENTS = {
  'nexus-hrm': NexusHRMDemo,
  'sano': SANODemo,
  'cargoscan': CargoScanDemo,
  'nexus-mfg': NexusMFGDemo,
  'glasstech': GlasstechDemo,
}

function DemoRequest({ productName, color }) {
  const { addDemoRequest } = useAdmin()
  const [form, setForm] = useState({ name: '', email: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    addDemoRequest({ ...form, product: productName, source: 'Product Page', configuratorSelections: null })
    setSent(true)
  }

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', background: 'color-mix(in srgb, var(--color-success) 5%, transparent)', border: '1.5px solid color-mix(in srgb, var(--color-success) 20%, transparent)', borderRadius: 'var(--border-radius-lg)' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✓</div>
        <p style={{ color: 'var(--color-success)', fontWeight: 500 }}>Request received. We'll be in touch within 24 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
      <input className="input" type="email" placeholder="Email address" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
      <button type="submit" className="btn-primary" style={{ justifyContent: 'center', gap: '0.5rem', background: color, boxShadow: `0 4px 16px ${color}40` }}>
        Request Full Demo <ArrowRight size={15} />
      </button>
    </form>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const product = products.find(p => p.id === slug)

  if (!product) return <Navigate to="/products" replace />

  const Icon = ICONS[product.icon]
  const DemoComponent = DEMO_COMPONENTS[product.id]

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
          <Link to="/products" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.375rem', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-heading)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            <ArrowLeft size={13} /> Products
          </Link>
          <span style={{ color: 'var(--color-border-subtle)' }}>/</span>
          <span style={{ color: 'var(--color-text-heading)', fontWeight: 500 }}>{product.name}</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-subtle)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 480px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '16px', background: `${product.color}14`, border: `2px solid ${product.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={26} color={product.color} />
                  </div>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', padding: '0.25rem 0.625rem', borderRadius: '99px', background: product.status === 'live' ? 'color-mix(in srgb, var(--color-success) 10%, transparent)' : 'color-mix(in srgb, var(--color-warning) 10%, transparent)', color: product.status === 'live' ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', border: `1px solid ${product.status === 'live' ? 'color-mix(in srgb, var(--color-success) 25%, transparent)' : 'color-mix(in srgb, var(--color-warning) 25%, transparent)'}` }}>{product.status}</span>
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>{product.name}</h1>
                <p style={{ fontSize: '1.15rem', color: product.color, fontWeight: 500, marginBottom: '1.25rem' }}>{product.tagline}</p>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '520px', marginBottom: '2rem' }}>{product.description}</p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a href="#demo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: product.color, color: 'var(--color-text-heading)', fontWeight: 700, fontSize: '0.9rem', borderRadius: 'var(--border-radius)', textDecoration: 'none', boxShadow: `0 4px 16px ${product.color}40`, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 28px ${product.color}50` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 16px ${product.color}40` }}
                  >
                    Try the demo <ExternalLink size={14} />
                  </a>
                  <a href="#request" className="btn-secondary" style={{ textDecoration: 'none' }}>Request full access</a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3rem', alignItems: 'start' }} className="product-detail-grid">

          {/* Left: features + demo */}
          <div>
            {/* Features */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.4rem', letterSpacing: '-0.01em', marginBottom: '1.5rem' }}>What's included</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {product.features.map((f, i) => (
                  <motion.div
                    key={f}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem 1.25rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)' }}
                  >
                    <CheckCircle2 size={16} color={product.color} style={{ marginTop: '1px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>{f}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Tech stack */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '3rem', padding: '1.75rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>Built with</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.tech.map(t => (
                  <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', padding: '0.35rem 0.75rem', borderRadius: '8px', background: 'var(--color-background)', border: '1.5px solid var(--color-border-subtle)', color: 'var(--color-text-primary)', fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </motion.div>

            {/* Live demo */}
            {DemoComponent && (
              <motion.div id="demo" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 style={{ fontSize: '1.4rem', letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>Live demo</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>This is a working version of the product. Click around and explore.</p>
                <div style={{ border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', boxShadow: '0 4px 24px rgba(15,23,42,0.07)' }}>
                  <div style={{ background: 'var(--color-surface)', padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--color-danger)' }} />
                    <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--color-warning)' }} />
                    <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--color-success)' }} />
                    <div style={{ flex: 1, background: 'var(--color-surface-alt)', border: '1px solid var(--color-border-subtle)', borderRadius: '6px', padding: '0.25rem 0.75rem', marginLeft: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>
                      app.stormglide.io/demo/{product.id}
                    </div>
                  </div>
                  <DemoComponent />
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: request demo sidebar */}
          <div style={{ position: 'sticky', top: '88px' }} id="request">
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={{ background: 'var(--color-background)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', boxShadow: '0 4px 24px rgba(15,23,42,0.07)' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border-subtle)', background: `${product.color}08` }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Request full access</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>Get a personalized demo and pricing for {product.name}.</p>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <DemoRequest productName={product.name} color={product.color} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginTop: '1.25rem', padding: '1.25rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>Also from Stormglide</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {products.filter(p => p.id !== product.id).slice(0, 3).map(p => {
                  const OtherIcon = ICONS[p.icon]
                  return (
                    <Link key={p.id} to={`/products/${p.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', padding: '0.5rem', borderRadius: '8px', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-alt)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: 30, height: 30, borderRadius: '8px', background: `${p.color}12`, border: `1px solid ${p.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <OtherIcon size={14} color={p.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>{p.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{p.tagline}</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .product-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PageLayout>
  )
}

