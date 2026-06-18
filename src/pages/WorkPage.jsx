import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Users, Heart, Package, Factory, Layers, MoveUpRight, CheckCircle2, Globe2, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import NexusHRMDemo from '../components/demos/NexusHRMDemo'
import SANODemo from '../components/demos/SANODemo'
import CargoScanDemo from '../components/demos/CargoScanDemo'
import NexusMFGDemo from '../components/demos/NexusMFGDemo'
import GlasstechDemo from '../components/demos/GlasstechDemo'
import { Helmet } from 'react-helmet-async'

const TABS = [
  { id: 'nexus-hrm', label: 'Nexus HRM',   icon: Users,   color: 'var(--color-accent-blue)', component: NexusHRMDemo,  tagline: 'HR & payroll management' },
  { id: 'sano',      label: 'SANO Health', icon: Heart,   color: 'var(--color-success)', component: SANODemo,      tagline: 'AI health monitoring' },
  { id: 'cargoscan', label: 'CargoScan',   icon: Package, color: 'var(--color-warning)', component: CargoScanDemo, tagline: 'Freight & CBM tools' },
  { id: 'nexus-mfg', label: 'Nexus MFG',  icon: Factory, color: 'var(--color-success)', component: NexusMFGDemo,  tagline: 'Production management' },
  { id: 'glasstech', label: 'Glasstech',  icon: Layers,  color: 'var(--color-accent-violet)', component: GlasstechDemo, tagline: 'Product catalog & quoting' },
]

const CLIENT_WORK = [
  {
    name: 'Lollarod Enterprise',
    category: 'Fine Home & Interior Products',
    url: 'https://lollarodgh.web.app',
    RegionIcon: MapPin, region: 'Ghana',
    color: 'var(--color-success)',
    year: '2023',
    scope: 'E-commerce platform + full admin backoffice',
    desc: 'A complete digital commerce solution for one of Ghana\'s premium interior product companies — 3 showroom locations, wholesale pricing, and a full operations backoffice built for their team.',
    what: [
      'Custom-designed product catalog with 200+ SKUs',
      'Wholesale & retail pricing tiers',
      'Cart, checkout & Paystack integration',
      'Order and delivery management',
      'Admin dashboard with sales analytics',
      'Staff accounts & inventory tracking',
    ],
    stack: ['React', 'Firebase', 'Paystack', 'Firestore'],
  },
  {
    name: 'Westline Future',
    category: 'Interior Design & Trading',
    url: 'https://westlinedecor.com',
    RegionIcon: Globe2, region: 'West Africa',
    color: 'var(--sg-accent)',
    year: '2023',
    scope: 'Full business management + client portal',
    desc: 'A global interior design firm\'s complete operating system — from the public-facing website and project portfolio to a private admin system used daily by their management team across 3 countries.',
    what: [
      'Company website with project portfolio',
      'Client project management portal',
      'Design vault with payment-gated access',
      'Invoicing & payment tracking',
      'Staff accounts with role-based access',
      'Business analytics dashboard',
    ],
    stack: ['React', 'Firebase', 'Firestore', 'Paystack'],
  },
]

export default function WorkPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id)

  const active = TABS.find(t => t.id === activeTab)
  const ActiveIcon = active.icon
  const ActiveComponent = active.component

  return (
    <PageLayout>
      <Helmet>
        <title>Our Work — Stormglide Technologies</title>
        <meta name="description" content="Live demos and real client systems built by Stormglide — HR software, freight tools, e-commerce platforms, and custom business backoffices." />
        <meta property="og:title" content="Our Work — Stormglide Technologies" />
        <meta property="og:description" content="Real client systems and live products built by Stormglide. See what we've shipped across Africa." />
        <meta property="og:image" content="https://stormglide.vercel.app/og-image.svg" />
        <meta property="og:url" content="https://stormglide.vercel.app/work" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://stormglide.vercel.app/og-image.svg" />
        <link rel="canonical" href="https://stormglide.vercel.app/work" />
      </Helmet>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--ink-100)', background: 'var(--bg-soft)', padding: '5rem 2rem 3.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-label">OUR WORK</div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.04em', marginBottom: '1rem', maxWidth: '580px' }}>
              Live demos. Real client systems.
            </h1>
            <p style={{ color: 'var(--ink-400)', fontSize: '1.05rem', maxWidth: '520px', lineHeight: 1.8 }}>
              Click around the demos — these are working versions of our actual products. Then see the real client sites we've shipped for paying customers.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Product demos */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="section-label">INTERACTIVE DEMOS</div>
            <h2 style={{ fontSize: '1.4rem', letterSpacing: '-0.028em', marginBottom: 0 }}>Our own products — try them live</h2>
          </div>
          <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--blue)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
            View all 5 products <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', alignItems: 'start' }} className="work-grid">
          {/* Sidebar tabs */}
          <div style={{ position: 'sticky', top: '88px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {TABS.map(tab => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.75rem 1rem', borderRadius: '10px', cursor: 'pointer',
                      border: isActive ? `1.5px solid ${tab.color}40` : '1.5px solid transparent',
                      background: isActive ? `${tab.color}08` : 'none',
                      textAlign: 'left', transition: 'all 0.15s',
                      fontFamily: 'var(--font-body)',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-soft)' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'none' }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: '8px', background: `${tab.color}14`, border: `1px solid ${tab.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color={tab.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 500, color: isActive ? 'var(--ink-900)' : 'var(--ink-400)' }}>{tab.label}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--ink-300)', marginTop: '0.1rem' }}>{tab.tagline}</div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'var(--bg-soft)', border: '1.5px solid var(--ink-100)', borderRadius: 'var(--radius-lg)' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--ink-400)', lineHeight: 1.65, marginBottom: '0.875rem' }}>
                Want the full version with your data and branding?
              </p>
              <Link to={`/products/${activeTab}`} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: active.color, fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
                View {active.label} <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Demo panel */}
          <div>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '9px', background: `${active.color}14`, border: `1.5px solid ${active.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ActiveIcon size={17} color={active.color} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '0.1rem' }}>{active.label}</h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--ink-400)' }}>{active.tagline}</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ border: '1.5px solid var(--ink-100)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ background: 'var(--bg-soft)', padding: '0.75rem 1rem', borderBottom: '1px solid var(--ink-100)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--color-danger)' }} />
                    <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--color-warning)' }} />
                    <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--color-success)' }} />
                    <div style={{ flex: 1, background: 'var(--bg-subtle)', border: '1px solid var(--ink-100)', borderRadius: '6px', padding: '0.25rem 0.75rem', marginLeft: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--ink-300)' }}>
                      app.stormglide.io/demo/{activeTab}
                    </div>
                  </div>
                  <ActiveComponent />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Client Work Showcase */}
      <div style={{ padding: '4rem 2rem 6rem', background: 'var(--bg-dark)', position: 'relative', overflow: 'hidden', marginTop: '3rem' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '-20%', left: '20%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, color-mix(in srgb, var(--sg-accent) 10%, transparent) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '3rem' }}>
            <div className="section-label" style={{ background: 'color-mix(in srgb, var(--sg-accent) 15%, transparent)', borderColor: 'color-mix(in srgb, var(--sg-accent) 30%, transparent)', color: 'color-mix(in srgb, var(--color-success) 90%, transparent)' }}>LIVE CLIENT WORK</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', letterSpacing: '-0.028em', color: 'var(--color-text-heading)', maxWidth: '580px', marginBottom: '0.75rem' }}>
              Real systems built for real businesses
            </h2>
            <p style={{ color: 'color-mix(in srgb, var(--color-text-heading) 45%, transparent)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '480px' }}>
              These are live. Click the links, explore the sites, and see exactly the kind of work we deliver for clients.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(440px, 100%), 1fr))', gap: '1.5rem' }} className="client-grid">
            {CLIENT_WORK.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'var(--color-surface)',
                  border: '1.5px solid color-mix(in srgb, var(--color-text-heading) 7%, transparent)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.color}40`; e.currentTarget.style.boxShadow = `0 16px 48px ${c.color}18` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-text-heading) 7%, transparent)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {/* Card top accent */}
                <div style={{ height: '3px', background: `linear-gradient(90deg, ${c.color}, transparent 70%)` }} />

                <div style={{ padding: '2rem' }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'color-mix(in srgb, var(--color-text-heading) 30%, transparent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        <c.RegionIcon size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />{c.region} · {c.category} · {c.year}
                      </div>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-heading)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{c.name}</h3>
                      <div style={{ fontSize: '0.75rem', color: c.color, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{c.scope}</div>
                    </div>
                    <a href={c.url} target="_blank" rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.875rem', background: `${c.color}18`, border: `1.5px solid ${c.color}35`, borderRadius: '99px', textDecoration: 'none', color: c.color, fontSize: '0.78rem', fontWeight: 600, flexShrink: 0, transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = c.color; e.currentTarget.style.color = 'var(--color-text-heading)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = `${c.color}18`; e.currentTarget.style.color = c.color }}
                    >
                      Visit site <MoveUpRight size={12} />
                    </a>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'color-mix(in srgb, var(--color-text-heading) 45%, transparent)', lineHeight: 1.75, marginBottom: '1.5rem' }}>{c.desc}</p>

                  {/* What was built */}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'color-mix(in srgb, var(--color-text-heading) 25%, transparent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.875rem', fontWeight: 600 }}>
                    What's inside
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {c.what.map(w => (
                      <div key={w} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.425rem', fontSize: '0.8rem' }}>
                        <CheckCircle2 size={12} color={c.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span style={{ color: 'color-mix(in srgb, var(--color-text-heading) 55%, transparent)', lineHeight: 1.4 }}>{w}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stack */}
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid color-mix(in srgb, var(--color-text-heading) 7%, transparent)' }}>
                    {c.stack.map(t => (
                      <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', padding: '0.2rem 0.55rem', borderRadius: '6px', background: 'color-mix(in srgb, var(--color-text-heading) 5%, transparent)', border: '1px solid color-mix(in srgb, var(--color-text-heading) 10%, transparent)', color: 'color-mix(in srgb, var(--color-text-heading) 40%, transparent)', fontWeight: 500 }}>{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <p style={{ color: 'color-mix(in srgb, var(--color-text-heading) 30%, transparent)', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>
              + many more client systems across Ghana, Guinea, and West Africa
            </p>
            <Link to="/contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', background: 'color-mix(in srgb, var(--color-text-heading) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--color-text-heading) 15%, transparent)', borderRadius: 'var(--radius)', color: 'var(--color-text-heading)', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--color-text-heading) 14%, transparent)'}
              onMouseLeave={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--color-text-heading) 8%, transparent)'}
            >
              Let's build yours <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .work-grid { grid-template-columns: 1fr !important; }
          .client-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PageLayout>
  )
}
