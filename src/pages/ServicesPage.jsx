import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Globe2, Building2, Brain, Users, ShoppingBag, Lightbulb, CheckCircle2, MoveUpRight, Stethoscope, MapPin, Cloud, Truck, CreditCard, Cpu, Rocket } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import { services } from '../data/services'
import { useLenis } from '../lib/useLenis'
import GyroCard from '../components/common/GyroCard'

const ICONS = { Globe2, Building2, Brain, Users, ShoppingBag, Lightbulb, Stethoscope, Cloud, Truck, CreditCard, Cpu, Rocket }

const WHY_US = [
  'Every website ships with a full admin backoffice, built in from day one.',
  'We run real products ourselves — Nexus HRM, CargoScan, SANO Health.',
  'Based in Accra. We build for African infrastructure, not around it.',
  'Your system, your source code. No lock-in.',
]

const CLIENT_EXAMPLES = [
  { name: 'Lollarod Enterprise', url: 'https://lollarodenterprisenew.com', what: 'Multi-branch e-commerce + per-branch inventory portals', RegionIcon: MapPin,  region: 'Ghana' },
  { name: 'Westline Future',     url: 'https://westlinedecor.com',  what: 'Project management + OTP client login + design vault', RegionIcon: Globe2,  region: 'West Africa' },
  { name: 'Green Gold Gardens',  url: 'https://greengoldgardensgh.com', what: 'Catalog, payroll & CRM behind an e-commerce storefront', RegionIcon: MapPin, region: 'Ghana' },
  { name: 'Jaybesin Logistics',  url: 'https://jaybesinlogistics.com', what: 'Live shipment tracking, rates & sourcing dashboard', RegionIcon: Truck, region: 'Ghana' },
  { name: 'Kyekye Cuisine',      url: 'https://kyekyecuisine.web.app', what: 'QR table ordering — dine-in, delivery & pickup', RegionIcon: ShoppingBag, region: 'Ghana' },
  { name: 'BarberManager',       url: 'https://barberingsalonmanager.web.app', what: 'Phone-login booking with SMS confirmation & reminders', RegionIcon: Users, region: 'Ghana' },
]

// Matches the tier comments in src/data/services.js — used as the pinned
// category label per section as you scroll down the grid.
const TIER_ORDER = ['primary', 'secondary', 'tertiary']
const TIER_META = {
  primary: { label: 'PROVEN SYSTEMS' },
  secondary: { label: 'FULL BUSINESS PLATFORM' },
  tertiary: { label: 'SPECIALIZED & EXTENSIONS' },
}

function ServiceCard({ s }) {
  const Icon = ICONS[s.icon] || Globe2
  return (
    <GyroCard
      className="service-card sg-cursor-hover"
      whileHover={{ y: -4 }}
      style={{
        background: 'transparent', border: 'none',
        padding: '0 0 2rem 0',
        position: 'relative', overflow: 'visible',
        height: '100%',
      }}
    >
      {/* Top accent line removed for editorial design */}

      {/* Icon + badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ width: 46, height: 46, borderRadius: '13px', background: `${s.color}10`, border: `1.5px solid ${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={s.color} />
        </div>
        {s.badge && (
          <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', padding: '0.2rem 0.55rem', borderRadius: '99px', background: `${s.color}10`, border: `1px solid ${s.color}25`, color: s.color, fontWeight: 600, letterSpacing: '0.04em' }}>
            {s.badge}
          </span>
        )}
      </div>

      <h3 style={{ fontSize: '1.05rem', letterSpacing: '-0.018em', marginBottom: '0.625rem' }}>{s.title}</h3>
      <p style={{ color: 'var(--ink-400)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '1.375rem' }}>{s.description}</p>

      {/* Features checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.375rem' }}>
        {s.features.slice(0, 5).map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem' }}>
            <CheckCircle2 size={13} color={s.color} style={{ marginTop: '2px', flexShrink: 0 }} />
            <span style={{ color: 'var(--ink-500)', lineHeight: 1.4 }}>{f}</span>
          </div>
        ))}
        {s.features.length > 5 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--ink-300)', paddingLeft: '1.375rem' }}>+ {s.features.length - 5} more</span>
        )}
      </div>
    </GyroCard>
  )
}

export default function ServicesPage() {
  const tiers = useMemo(
    () => TIER_ORDER
      .map(tier => ({ tier, items: services.filter(s => s.tier === tier) }))
      .filter(t => t.items.length > 0),
    [],
  )

  useLenis('/services', (scroller, { gsap, ScrollTrigger }) =>
    gsap.context(() => {
      // Pin/scrub is a desktop-board feature — pins assume a tall scroll
      // runway and don't degrade gracefully on narrow viewports, so this
      // whole mechanic is scoped off below the board breakpoint (mirrors
      // App.jsx's DESKTOP_BOARD_QUERY). Mobile falls back to a plain stack.
      const mm = gsap.matchMedia()
      mm.add('(min-width: 920px)', () => {
        gsap.utils.toArray('.tier-section').forEach(section => {
          ScrollTrigger.create({
            trigger: section,
            scroller,
            start: 'top 84px',
            // 'bottom top' — unpin once the section has fully scrolled past
            // (its bottom clears the viewport's top). 'bottom bottom' looked
            // equivalent but actually means "the section's bottom reaches the
            // viewport's bottom", which for any section shorter than the
            // viewport itself is satisfied almost immediately after 'start'
            // — collapsing the pin to a near-zero scroll range.
            end: 'bottom top',
            pin: section.querySelector('.tier-label'),
            pinSpacing: false,
          })
        })

        gsap.utils.toArray('.service-card').forEach(card => {
          gsap.from(card, {
            opacity: 0,
            y: 28,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              scroller,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          })
        })
      })

      // Mobile/narrow: no pin, but cards should still reveal as they scroll in.
      mm.add('(max-width: 919px)', () => {
        gsap.utils.toArray('.service-card').forEach(card => {
          gsap.from(card, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              scroller,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          })
        })
      })
    }),
  )

  return (
    <PageLayout>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--ink-100)', background: 'var(--bg-soft)', padding: '5rem 2rem 3.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-label">SERVICES</div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', letterSpacing: '-0.04em', marginBottom: '1.25rem', maxWidth: '640px' }}>
              We build the website.<br />
              <span style={{ background: 'linear-gradient(135deg, var(--blue) 0%, var(--violet) 60%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                We build the system behind it too.
              </span>
            </h1>
            <p style={{ color: 'var(--ink-400)', fontSize: '1.05rem', maxWidth: '520px', lineHeight: 1.8 }}>
              A front end your customers see. A backoffice your team runs the business on.
            </p>

            {/* Client examples strip */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {CLIENT_EXAMPLES.map(c => (
                <a key={c.name} href={c.url} target="_blank" rel="noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.4rem 0.875rem 0.4rem 0.625rem',
                  background: 'var(--glass-bg)', border: '1.5px solid var(--ink-100)',
                  borderRadius: '99px', textDecoration: 'none',
                  fontSize: '0.8rem', color: 'var(--ink-500)', fontWeight: 500,
                  transition: 'all 0.15s', boxShadow: 'var(--shadow-xs)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ink-100)'; e.currentTarget.style.color = 'var(--ink-500)' }}
                >
                  <c.RegionIcon size={11} />
                  <span>{c.name}</span>
                  <MoveUpRight size={12} />
                </a>
              ))}
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.4rem 0.875rem', color: 'var(--ink-300)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                + more
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Services grid — one section per tier, its label pins while that
          tier's cards scroll past (desktop only, see useLenis above). */}
      <div style={{ padding: '5rem 2rem 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {tiers.map(({ tier, items }) => (
            <section key={tier} className="tier-section" data-tier={tier} style={{ paddingBottom: '3.5rem' }}>
              <div className="tier-label" style={{ marginBottom: '1.25rem' }}>
                <span
                  className="section-label"
                  style={{
                    display: 'inline-flex',
                    background: 'var(--glass-bg-strong)',
                    border: '1px solid var(--glass-border)',
                    backdropFilter: 'var(--glass-blur-soft)',
                    WebkitBackdropFilter: 'var(--glass-blur-soft)',
                    borderRadius: '99px',
                    padding: '0.4rem 0.9rem',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  {TIER_META[tier].label}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(360px, 100%), 1fr))', gap: '1.25rem' }}>
                {items.map(s => <ServiceCard key={s.id} s={s} />)}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Why Stormglide */}
      <div style={{ padding: '5rem 2rem', background: 'var(--bg-soft)', borderTop: '1px solid var(--ink-100)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }} className="why-grid">
            <div style={{ position: 'sticky', top: '100px' }}>
              <div className="section-label">WHY STORMGLIDE</div>
              <h2 style={{ letterSpacing: '-0.028em', marginBottom: '1.5rem' }}>
                We're not a vendor.{' '}
                <span style={{ background: 'linear-gradient(135deg, var(--blue), var(--violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>We're a partner.</span>
              </h2>
              <p style={{ color: 'var(--ink-400)', lineHeight: 1.8, fontSize: '0.975rem', marginBottom: '2rem' }}>
                We build the software we wish existed when we were running our own business.
              </p>
              <Link to="/contact" className="btn-primary" style={{ textDecoration: 'none', gap: '0.5rem' }}>
                Talk to us <ArrowRight size={15} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {WHY_US.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem 1.125rem', background: 'var(--glass-bg)', border: '1.5px solid var(--ink-100)', borderRadius: '12px', boxShadow: 'var(--shadow-xs)' }}
                >
                  <CheckCircle2 size={15} color="var(--blue)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--ink-500)', lineHeight: 1.6 }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '5rem 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ letterSpacing: '-0.028em', marginBottom: '1rem' }}>Have a project in mind?</h2>
            <p style={{ color: 'var(--ink-400)', marginBottom: '2rem', lineHeight: 1.8 }}>
              We come back with a clear scope, a timeline, and a fixed price.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-primary" style={{ textDecoration: 'none', gap: '0.5rem' }}>
                Start a conversation <ArrowRight size={15} />
              </Link>
              <Link to="/pricing" className="btn-secondary" style={{ textDecoration: 'none' }}>
                See pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`@media (max-width: 860px) { .why-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; } }`}</style>
    </PageLayout>
  )
}
