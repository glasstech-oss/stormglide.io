import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import gsap from 'gsap'
import { ArrowRight, Users, Heart, Package, Factory, Layers, MoveUpRight, CheckCircle2, Globe2, MonitorPlay } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import { SITE_URL } from '../data/seo'
import NexusHRMDemo from '../components/demos/NexusHRMDemo'
import SANODemo from '../components/demos/SANODemo'
import CargoScanDemo from '../components/demos/CargoScanDemo'
import NexusMFGDemo from '../components/demos/NexusMFGDemo'
import GlasstechDemo from '../components/demos/GlasstechDemo'
import { getProductPath } from '../data/products'
import { CLIENT_WORK, getWorkPath } from '../data/clientWork'
import { useLenis } from '../lib/useLenis'
import { handleViewTransitionClick, useViewTransitionNavigate } from '../lib/viewTransition'

const TABS = [
  { id: 'nexus-hrm', label: 'Nexus HRM',   icon: Users,   color: 'var(--color-accent-blue)', component: NexusHRMDemo,  tagline: 'HR & payroll management' },
  { id: 'sano',      label: 'SANO Health', icon: Heart,   color: 'var(--color-success)', component: SANODemo,      tagline: 'AI health monitoring' },
  { id: 'cargoscan', label: 'CargoScan',   icon: Package, color: 'var(--color-warning)', component: CargoScanDemo, tagline: 'Freight & CBM tools' },
  { id: 'nexus-mfg', label: 'Nexus MFG',  icon: Factory, color: 'var(--color-success)', component: NexusMFGDemo,  tagline: 'Production management' },
  { id: 'glasstech', label: 'Glasstech',  icon: Layers,  color: 'var(--color-accent-violet)', component: GlasstechDemo, tagline: 'Product catalog & quoting' },
]

const LIVE_SYSTEMS = [
  {
    id: 'nexus-dental-live',
    name: 'Nexus Dental System',
    industry: 'Healthcare',
    type: 'Dental operations platform',
    url: 'https://nexuspharmasystem.web.app',
    color: 'var(--color-success)',
    status: 'Live system',
    desc: 'A practice-management system visitors can open inside Stormglide to see patient, appointment, inventory, and operations thinking in action.',
    highlights: ['Clinic operations', 'Patient workflow', 'Inventory logic'],
  },
  {
    id: 'barber-manager-live',
    name: 'Barber Shop Management System',
    industry: 'Beauty & Personal Care',
    type: 'Booking and staff portal',
    url: 'https://barberingsalonmanager.web.app/login',
    color: 'var(--color-warning)',
    status: 'Live login preview',
    desc: 'A booking system built for shops that need clients, staff, services, slots, reminders, and daily operations in one place.',
    highlights: ['Client booking', 'Staff portal', 'Service catalog'],
  },
  {
    id: 'cosmetology-live',
    name: 'Cosmetology & Spa Management System',
    industry: 'Beauty & Personal Care',
    type: 'Spa operations platform',
    url: 'https://cosmetology--cosmetologysystem.us-east4.hosted.app',
    color: 'var(--color-accent-violet)',
    status: 'Live system',
    desc: 'A modern spa and cosmetology management platform for appointment flow, customer care, services, and operational control.',
    highlights: ['Spa scheduling', 'Customer records', 'Service workflow'],
  },
  {
    id: 'lollarod-live',
    name: 'Lollarod Enterprise',
    industry: 'Retail & E-commerce',
    type: 'Commerce and backoffice',
    url: 'https://lollarodenterprisenew.com',
    color: 'var(--color-success)',
    status: 'Client site',
    desc: 'A public storefront and operations system for interior products, wholesale pricing, orders, and internal sales workflows.',
    highlights: ['Product catalog', 'Checkout', 'Admin backoffice'],
  },
  {
    id: 'westline-live',
    name: 'Westline Future',
    industry: 'Interior Design',
    type: 'Website and client portal',
    url: 'https://westlinedecor.com',
    color: 'var(--sg-accent)',
    status: 'Client site',
    desc: 'A design-company platform combining portfolio presentation, client project access, invoicing, and operational management.',
    highlights: ['Project portfolio', 'Client portal', 'Payments'],
  },
  {
    id: 'green-gold-live',
    name: 'Green Gold Gardens',
    industry: 'Landscaping',
    type: 'Catalog, CRM, and payroll',
    url: 'https://greengoldgardensgh.com',
    color: 'var(--sg-accent)',
    status: 'Client site',
    desc: 'A plant, landscaping, and services platform for customers and internal teams moving beyond WhatsApp-based operations.',
    highlights: ['Live catalog', 'CRM', 'Payroll'],
  },
  {
    id: 'jaybesin-live',
    name: 'Jaybesin Logistics',
    industry: 'Logistics',
    type: 'Tracking and sourcing portal',
    url: 'https://jaybesinlogistics.com',
    color: 'var(--color-accent-blue)',
    status: 'Client site',
    desc: 'A logistics platform with shipment tracking, live rates, sourcing marketplace, and agent-management workflows.',
    highlights: ['Shipment tracking', 'Rates', 'Marketplace'],
  },
  {
    id: 'kyekye-live',
    name: 'Kyekye Cuisine',
    industry: 'Hospitality',
    type: 'Restaurant operations system',
    url: 'https://kyekyecuisine.web.app',
    color: 'var(--color-danger)',
    status: 'Client site',
    desc: 'A restaurant platform with QR ordering, kitchen queue, payment, delivery, pickup, and staff dashboards.',
    highlights: ['QR ordering', 'Kitchen queue', 'Paystack'],
  },
]

const SYSTEM_INDUSTRIES = ['All industries', ...Array.from(new Set(LIVE_SYSTEMS.map(system => system.industry)))]

const clientWorkSchema = {
  '@context': 'https://schema.org',
  '@graph': [...CLIENT_WORK, ...LIVE_SYSTEMS].map(item => ({
    '@type': 'Product',
    '@id': `${item.url}#${item.id || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: item.name,
    description: item.desc,
    category: item.category,
    url: item.url,
    brand: { '@id': `${SITE_URL}/#organization` },
    areaServed: item.region,
  })),
}

export default function WorkPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id)
  const [activeIndustry, setActiveIndustry] = useState(SYSTEM_INDUSTRIES[0])
  const [activeSystemId, setActiveSystemId] = useState(LIVE_SYSTEMS[0].id)
  const vtNavigate = useViewTransitionNavigate()

  const active = TABS.find(t => t.id === activeTab)
  const ActiveIcon = active.icon
  const ActiveComponent = active.component
  const visibleSystems = activeIndustry === SYSTEM_INDUSTRIES[0]
    ? LIVE_SYSTEMS
    : LIVE_SYSTEMS.filter(system => system.industry === activeIndustry)
  const activeSystem = visibleSystems.find(system => system.id === activeSystemId) || visibleSystems[0] || LIVE_SYSTEMS[0]
  const ActiveRegionIcon = activeSystem.industry === 'Healthcare' ? Heart : activeSystem.industry === 'Logistics' ? Package : activeSystem.industry === 'Interior Design' ? Layers : activeSystem.industry === 'Hospitality' ? Globe2 : Factory

  const selectIndustry = industry => {
    setActiveIndustry(industry)
    const firstSystem = industry === SYSTEM_INDUSTRIES[0]
      ? LIVE_SYSTEMS[0]
      : LIVE_SYSTEMS.find(system => system.industry === industry)
    if (firstSystem) setActiveSystemId(firstSystem.id)
  }

  useLenis('/work', scroller =>
    gsap.context(() => {
      // Desktop only (see useLenis.js) — each case-study card pins briefly
      // while its real "what we built" bullets and stack tags stagger in.
      // Mobile/narrow keeps the plain whileInView fade already on the cards.
      const mm = gsap.matchMedia()
      mm.add('(min-width: 920px)', () => {
        gsap.utils.toArray('.sg-client-card').forEach(card => {
          const bullets = card.querySelectorAll('.sg-client-built-list > div')
          const tags = card.querySelectorAll('.sg-client-stack-tag')
          if (!bullets.length) return

          gsap.timeline({
            scrollTrigger: {
              trigger: card,
              scroller,
              pin: true,
              scrub: 0.6,
              start: 'top top',
              end: `+=${60 + bullets.length * 40}%`,
            },
          })
            .from(bullets, { opacity: 0, x: -12, stagger: 0.15 })
            .from(tags, { opacity: 0, y: 8, stagger: 0.08 }, '-=0.3')
        })
      })
    }),
  )

  return (
    <PageLayout>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(clientWorkSchema)}</script>
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
      <div className="sg-work-demo-section" style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem 2rem' }}>
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
          <div className="sg-work-demo-sidebar" style={{ position: 'sticky', top: '88px' }}>
            <div className="sg-work-demo-tabs" style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
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

            <div className="sg-work-demo-cta-card" style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'var(--bg-soft)', border: '1.5px solid var(--ink-100)', borderRadius: 'var(--radius-lg)' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--ink-400)', lineHeight: 1.65, marginBottom: '0.875rem' }}>
                Want the full version with your data and branding?
              </p>
              <Link to={getProductPath(activeTab)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: active.color, fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
                View {active.label} <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Demo panel */}
          <div className="sg-work-demo-panel">
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
                <div className="sg-demo-frame" style={{ border: '1.5px solid var(--ink-100)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ background: 'var(--bg-soft)', padding: '0.75rem 1rem', borderBottom: '1px solid var(--ink-100)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--color-danger)' }} />
                    <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--color-warning)' }} />
                    <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--color-success)' }} />
                    <div style={{ flex: 1, background: 'var(--bg-subtle)', border: '1px solid var(--ink-100)', borderRadius: '6px', padding: '0.25rem 0.75rem', marginLeft: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--ink-300)' }}>
                      app.stormglide.io/demo/{activeTab}
                    </div>
                  </div>
                  <div className="sg-demo-frame-body">
                    <ActiveComponent />
                  </div>
                  <div className="sg-mobile-demo-summary">
                    <div className="sg-mobile-demo-icon" style={{ '--demo-color': active.color }}>
                      <ActiveIcon size={22} />
                    </div>
                    <span>{active.tagline}</span>
                    <h3>{active.label}</h3>
                    <p>Mobile visitors get the clean product story first. Open the full product page for details, pricing context, and next steps.</p>
                    <Link to={getProductPath(activeTab)}>
                      View {active.label} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Live systems browser */}
      <section className="sg-live-browser-section">
        <div className="sg-live-browser-shell">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="sg-live-browser-heading"
          >
            <div>
              <div className="section-label">LIVE SYSTEMS BROWSER</div>
              <h2>Test real systems by industry</h2>
            </div>
            <p>
              Browse live work inside Stormglide. We load one system at a time so the page stays fast, and visitors can still open the full app when they want the native experience.
            </p>
          </motion.div>

          <div className="sg-industry-filters" aria-label="Filter live systems by industry">
            {SYSTEM_INDUSTRIES.map(industry => (
              <button
                key={industry}
                type="button"
                className={activeIndustry === industry ? 'is-active' : ''}
                onClick={() => selectIndustry(industry)}
              >
                {industry}
              </button>
            ))}
          </div>

          <div className="sg-live-browser-grid">
            <aside className="sg-system-list" aria-label="Live systems">
              {visibleSystems.map(system => {
                const isActive = system.id === activeSystem.id
                return (
                  <button
                    key={system.id}
                    type="button"
                    className={isActive ? 'is-active' : ''}
                    style={{ '--system-color': system.color }}
                    onClick={() => setActiveSystemId(system.id)}
                  >
                    <span className="sg-system-list-kicker">{system.industry}</span>
                    <span className="sg-system-list-name">{system.name}</span>
                    <span className="sg-system-list-type">{system.type}</span>
                  </button>
                )
              })}
            </aside>

            <div className="sg-system-browser-card card" style={{ '--system-color': activeSystem.color }}>
              <div className="sg-browser-topbar">
                <div className="sg-browser-lights" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="sg-browser-address">
                  <MonitorPlay size={14} />
                  <span>{activeSystem.url.replace(/^https?:\/\//, '')}</span>
                </div>
                <a href={activeSystem.url} target="_blank" rel="noreferrer">
                  Open full site <MoveUpRight size={13} />
                </a>
              </div>

              <div className="sg-system-summary">
                <div className="sg-system-icon">
                  <ActiveRegionIcon size={20} />
                </div>
                <div>
                  <span>{activeSystem.status}</span>
                  <h3>{activeSystem.name}</h3>
                  <p>{activeSystem.desc}</p>
                  <div className="sg-system-tags">
                    {activeSystem.highlights.map(item => <em key={item}>{item}</em>)}
                  </div>
                </div>
              </div>

              <div className="sg-iframe-wrap">
                <iframe
                  key={activeSystem.id}
                  title={`${activeSystem.name} live preview`}
                  src={activeSystem.url}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                />
              </div>
              <div className="sg-mobile-browser-fallback">
                <span>Mobile system preview</span>
                <p>These systems are real apps. For the best mobile experience, launch the selected system full-screen.</p>
                <a href={activeSystem.url} target="_blank" rel="noreferrer">
                  Launch {activeSystem.name} <MoveUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Work Showcase */}
      <div style={{ padding: '4rem 2rem 6rem', background: 'var(--glass-bg)', position: 'relative', overflow: 'hidden', marginTop: '3rem' }}>
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
                className="sg-client-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  position: 'relative',
                  background: 'var(--color-surface)',
                  border: '1.5px solid color-mix(in srgb, var(--color-text-heading) 7%, transparent)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.color}40`; e.currentTarget.style.boxShadow = `0 16px 48px ${c.color}18` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-text-heading) 7%, transparent)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {/* Stretched link — the whole card opens the case study;
                    "Visit site" below sits above this (z-index) so it still
                    opens the external site directly, without nesting an <a>
                    inside another <a>. */}
                <Link
                  to={getWorkPath(c.slug)}
                  onClick={e => handleViewTransitionClick(e, vtNavigate, getWorkPath(c.slug), { name: 'work-flip' })}
                  aria-label={`View the ${c.name} case study`}
                  style={{ position: 'absolute', inset: 0, zIndex: 1 }}
                />

                {/* Card top accent */}
                <div style={{ height: '3px', background: `linear-gradient(90deg, ${c.color}, transparent 70%)` }} />

                <div className="sg-client-card-body" style={{ padding: '2rem', position: 'relative' }}>
                  {/* Header row */}
                  <div className="sg-client-card-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'color-mix(in srgb, var(--color-text-heading) 30%, transparent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        <c.RegionIcon size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />{c.region} · {c.category} · {c.year}
                      </div>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-heading)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{c.name}</h3>
                      <div style={{ fontSize: '0.75rem', color: c.color, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{c.scope}</div>
                    </div>
                    <a className="sg-client-card-link" href={c.url} target="_blank" rel="noreferrer"
                      style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.875rem', background: `${c.color}18`, border: `1.5px solid ${c.color}35`, borderRadius: '99px', textDecoration: 'none', color: c.color, fontSize: '0.78rem', fontWeight: 600, flexShrink: 0, transition: 'all 0.15s' }}
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
                  <div className="sg-client-built-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
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
                      <span key={t} className="sg-client-stack-tag" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', padding: '0.2rem 0.55rem', borderRadius: '6px', background: 'color-mix(in srgb, var(--color-text-heading) 5%, transparent)', border: '1px solid color-mix(in srgb, var(--color-text-heading) 10%, transparent)', color: 'color-mix(in srgb, var(--color-text-heading) 40%, transparent)', fontWeight: 500 }}>{t}</span>
                    ))}
                  </div>

                  <div className="sg-client-view-case" style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem', color: c.color, fontSize: '0.82rem', fontWeight: 600 }}>
                    View case study <ArrowRight size={13} />
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
        .sg-live-browser-section {
          padding: 4rem 2rem 1rem;
        }

        .sg-live-browser-shell {
          max-width: 1280px;
          margin: 0 auto;
        }

        .sg-live-browser-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .sg-live-browser-heading h2 {
          font-size: clamp(1.75rem, 3.4vw, 2.5rem);
          margin-top: 0.8rem;
          max-width: 520px;
        }

        .sg-live-browser-heading p {
          color: var(--color-text-secondary);
          line-height: 1.75;
          max-width: 470px;
        }

        .sg-industry-filters {
          display: flex;
          gap: 0.65rem;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
        }

        .sg-industry-filters button {
          border: 1px solid var(--glass-border);
          border-radius: 999px;
          background: color-mix(in srgb, var(--glass-bg), var(--sg-local-tint) 5%);
          color: var(--color-text-secondary);
          padding: 0.58rem 0.9rem;
          cursor: pointer;
          backdrop-filter: var(--glass-blur-soft);
          -webkit-backdrop-filter: var(--glass-blur-soft);
          transition: color 180ms ease, border-color 180ms ease, background 180ms ease, transform 180ms ease;
        }

        .sg-industry-filters button:hover,
        .sg-industry-filters button.is-active {
          color: var(--color-text-heading);
          border-color: color-mix(in srgb, var(--sg-accent) 48%, var(--glass-border));
          background: color-mix(in srgb, var(--glass-bg-strong), var(--sg-accent) 10%);
          transform: translateY(-1px);
        }

        .sg-live-browser-grid {
          display: grid;
          grid-template-columns: minmax(240px, 0.31fr) minmax(0, 1fr);
          gap: 1.25rem;
          align-items: stretch;
        }

        .sg-system-list {
          display: grid;
          gap: 0.75rem;
          align-content: start;
        }

        .sg-system-list button {
          border: 1px solid color-mix(in srgb, var(--system-color) 18%, var(--glass-border));
          border-radius: 20px;
          background: color-mix(in srgb, var(--glass-bg), var(--system-color) 4%);
          color: var(--color-text-primary);
          padding: 1rem;
          text-align: left;
          cursor: pointer;
          box-shadow: inset 0 1px 0 var(--glass-highlight);
          backdrop-filter: var(--glass-blur-soft);
          -webkit-backdrop-filter: var(--glass-blur-soft);
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
        }

        .sg-system-list button:hover,
        .sg-system-list button.is-active {
          transform: translateX(4px);
          border-color: color-mix(in srgb, var(--system-color) 60%, var(--glass-border-bright));
          background: color-mix(in srgb, var(--glass-bg-strong), var(--system-color) 10%);
        }

        .sg-system-list-kicker,
        .sg-system-list-type {
          display: block;
          color: color-mix(in srgb, var(--color-text-heading) 38%, transparent);
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .sg-system-list-name {
          display: block;
          color: var(--color-text-heading);
          font-weight: 800;
          line-height: 1.2;
          margin: 0.38rem 0 0.26rem;
        }

        .sg-system-browser-card {
          --sg-local-tint: var(--system-color);
          min-width: 0;
          padding: 0;
          border-radius: 30px;
          clip-path: none;
        }

        .sg-browser-topbar {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.85rem;
          border-bottom: 1px solid color-mix(in srgb, var(--system-color) 20%, var(--glass-border));
          padding: 0.9rem 1rem;
          background: color-mix(in srgb, var(--glass-bg-strong), var(--system-color) 7%);
        }

        .sg-browser-lights {
          display: inline-flex;
          gap: 0.42rem;
        }

        .sg-browser-lights span {
          width: 0.68rem;
          height: 0.68rem;
          border-radius: 999px;
          background: var(--color-danger);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.5);
        }

        .sg-browser-lights span:nth-child(2) { background: var(--color-warning); }
        .sg-browser-lights span:nth-child(3) { background: var(--color-success); }

        .sg-browser-address {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          border: 1px solid color-mix(in srgb, var(--color-text-heading) 10%, transparent);
          border-radius: 999px;
          background: color-mix(in srgb, var(--color-background) 58%, transparent);
          color: color-mix(in srgb, var(--color-text-heading) 54%, transparent);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          padding: 0.46rem 0.75rem;
        }

        .sg-browser-address span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sg-browser-topbar a {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--system-color);
          font-weight: 800;
          font-size: 0.78rem;
          text-decoration: none;
          white-space: nowrap;
        }

        .sg-system-summary {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 1rem;
          padding: 1.25rem;
          border-bottom: 1px solid color-mix(in srgb, var(--system-color) 18%, var(--glass-border));
        }

        .sg-system-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          color: var(--system-color);
          background: color-mix(in srgb, var(--system-color) 14%, transparent);
          border: 1px solid color-mix(in srgb, var(--system-color) 28%, transparent);
        }

        .sg-system-summary span {
          color: var(--system-color);
          font-family: var(--font-mono);
          font-size: 0.66rem;
          font-weight: 800;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .sg-system-summary h3 {
          margin: 0.28rem 0 0.48rem;
          font-size: clamp(1.25rem, 2.4vw, 1.75rem);
        }

        .sg-system-summary p {
          color: var(--color-text-secondary);
          line-height: 1.7;
          max-width: 760px;
        }

        .sg-system-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.9rem;
        }

        .sg-system-tags em {
          border: 1px solid color-mix(in srgb, var(--system-color) 25%, var(--glass-border));
          border-radius: 999px;
          background: color-mix(in srgb, var(--system-color) 9%, transparent);
          color: color-mix(in srgb, var(--color-text-heading) 72%, transparent);
          font-style: normal;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.28rem 0.62rem;
        }

        .sg-iframe-wrap {
          position: relative;
          overflow: hidden;
          background: color-mix(in srgb, var(--color-background) 84%, #000 16%);
          min-height: 620px;
        }

        .sg-iframe-wrap iframe {
          display: block;
          width: 100%;
          height: min(72vh, 720px);
          min-height: 620px;
          border: 0;
          background: #fff;
        }

        .sg-mobile-demo-summary,
        .sg-mobile-browser-fallback {
          display: none;
        }

        @media (max-width: 860px) {
          .sg-work-demo-section {
            padding: 3rem 1rem 1rem !important;
            max-width: 100% !important;
          }

          .work-grid {
            display: block !important;
            grid-template-columns: 1fr !important;
            min-width: 0;
          }

          .work-grid > *,
          .sg-work-demo-panel,
          .sg-demo-frame {
            min-width: 0;
            max-width: 100%;
          }

          .sg-work-demo-sidebar {
            position: static !important;
            top: auto !important;
            margin-bottom: 1rem;
          }

          .sg-work-demo-tabs {
            flex-direction: row !important;
            gap: 0.75rem !important;
            overflow-x: auto;
            padding: 0 0 0.5rem;
            margin: 0 -1rem;
            padding-left: 1rem;
            padding-right: 1rem;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }

          .sg-work-demo-tabs button {
            width: auto !important;
            min-width: min(72vw, 245px);
            flex: 0 0 auto;
            scroll-snap-align: start;
            border: 1px solid var(--glass-border) !important;
            background: color-mix(in srgb, var(--glass-bg), var(--sg-local-tint) 6%) !important;
            border-radius: 18px !important;
          }

          .sg-work-demo-cta-card {
            display: none;
          }

          .sg-work-demo-panel {
            margin-top: 0.5rem;
          }

          .sg-demo-frame {
            border-radius: 24px !important;
            box-shadow: var(--shadow-sm) !important;
          }

          .sg-demo-frame-body {
            display: none;
          }

          .sg-mobile-demo-summary {
            display: grid;
            gap: 0.72rem;
            padding: 1.3rem;
            min-height: 280px;
            background:
              radial-gradient(circle at 15% 10%, color-mix(in srgb, var(--demo-color, var(--sg-accent)) 18%, transparent), transparent 42%),
              color-mix(in srgb, var(--glass-bg), var(--sg-local-tint) 7%);
          }

          .sg-mobile-demo-icon {
            width: 52px;
            height: 52px;
            display: grid;
            place-items: center;
            border-radius: 18px;
            color: var(--demo-color, var(--sg-accent));
            background: color-mix(in srgb, var(--demo-color, var(--sg-accent)) 14%, transparent);
            border: 1px solid color-mix(in srgb, var(--demo-color, var(--sg-accent)) 28%, var(--glass-border));
          }

          .sg-mobile-demo-summary span {
            color: var(--sg-accent);
            font-family: var(--font-mono);
            font-size: 0.68rem;
            font-weight: 800;
            letter-spacing: 0.1em;
            text-transform: uppercase;
          }

          .sg-mobile-demo-summary h3 {
            font-size: clamp(1.55rem, 8vw, 2.05rem);
          }

          .sg-mobile-demo-summary p {
            color: var(--color-text-secondary);
            line-height: 1.7;
          }

          .sg-mobile-demo-summary a,
          .sg-mobile-browser-fallback a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.45rem;
            min-height: 46px;
            width: fit-content;
            border: 1px solid color-mix(in srgb, var(--sg-accent) 36%, var(--glass-border));
            border-radius: 999px;
            background: color-mix(in srgb, var(--sg-accent) 13%, transparent);
            color: var(--color-text-heading);
            font-weight: 800;
            text-decoration: none;
            padding: 0.72rem 1rem;
          }

          .client-grid { grid-template-columns: 1fr !important; }
          .sg-live-browser-section { padding: 3rem 1rem 0; }
          .sg-live-browser-heading { display: block; }
          .sg-live-browser-heading p { margin-top: 1rem; }
          .sg-live-browser-grid { grid-template-columns: 1fr; }
          .sg-system-list {
            display: flex;
            overflow-x: auto;
            padding-bottom: 0.35rem;
            scroll-snap-type: x mandatory;
          }
          .sg-system-list button {
            min-width: min(78vw, 310px);
            scroll-snap-align: start;
          }
          .sg-system-list button:hover,
          .sg-system-list button.is-active {
            transform: translateY(-2px);
          }
          .sg-browser-topbar {
            grid-template-columns: auto 1fr;
          }
          .sg-browser-topbar a {
            grid-column: 1 / -1;
            justify-content: center;
            min-height: 42px;
            border: 1px solid color-mix(in srgb, var(--system-color) 32%, var(--glass-border));
            border-radius: 999px;
            background: color-mix(in srgb, var(--system-color) 12%, transparent);
          }
          .sg-system-summary {
            grid-template-columns: 1fr;
            padding: 1.15rem;
          }

          .sg-iframe-wrap {
            display: none;
          }

          .sg-mobile-browser-fallback {
            display: grid;
            gap: 0.8rem;
            padding: 1.15rem;
            border-top: 1px solid color-mix(in srgb, var(--system-color) 18%, var(--glass-border));
            background: color-mix(in srgb, var(--color-background) 62%, transparent);
          }

          .sg-mobile-browser-fallback span {
            color: var(--system-color);
            font-family: var(--font-mono);
            font-size: 0.66rem;
            font-weight: 800;
            letter-spacing: 0.1em;
            text-transform: uppercase;
          }

          .sg-mobile-browser-fallback p {
            color: var(--color-text-secondary);
            line-height: 1.65;
          }

          .sg-mobile-browser-fallback a {
            --sg-accent: var(--system-color);
            width: 100%;
          }

          .sg-client-card-body {
            padding: 1.25rem !important;
          }

          .sg-client-card-header {
            display: grid !important;
            gap: 1rem;
          }

          .sg-client-card-link {
            width: 100%;
            justify-content: center;
            min-height: 44px;
          }

          .sg-client-built-list {
            grid-template-columns: 1fr !important;
            gap: 0.7rem !important;
          }
        }

        @media (max-width: 480px) {
          .sg-live-browser-heading h2 {
            font-size: clamp(1.55rem, 9vw, 2.1rem);
          }

          .sg-industry-filters {
            flex-wrap: nowrap;
            overflow-x: auto;
            margin-left: -1rem;
            margin-right: -1rem;
            padding: 0 1rem 0.5rem;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }

          .sg-industry-filters button {
            flex: 0 0 auto;
            scroll-snap-align: start;
          }

          .sg-system-browser-card {
            border-radius: 24px;
          }

          .sg-browser-topbar {
            padding: 0.8rem;
            gap: 0.6rem;
          }

          .sg-browser-address {
            font-size: 0.64rem;
            padding: 0.42rem 0.58rem;
          }
        }
      `}</style>
    </PageLayout>
  )
}
