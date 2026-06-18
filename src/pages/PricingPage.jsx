import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Zap, Code2, Building2, HelpCircle, ChevronDown, ChevronUp, Users, Package, Factory, Heart, Layers, GraduationCap, UtensilsCrossed, Home, Truck, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import { Helmet } from 'react-helmet-async'

const PLANS = [
  {
    id: 'deploy',
    name: 'Deploy',
    tagline: 'Start fast with a proven product',
    badge: null,
    price: 'From $800',
    period: 'one-time setup',
    desc: 'Get one of our existing products — Nexus HRM, CargoScan, or Nexus MFG — deployed, branded, and configured for your business within days.',
    color: 'var(--color-accent-blue)',
    icon: Zap,
    cta: 'Get started',
    ctaLink: '/contact',
    features: [
      'One Stormglide product deployment',
      'Custom branding & domain setup',
      'Data migration assistance',
      'Staff training (up to 5 users)',
      '3 months post-launch support',
      'Bug fixes included',
    ],
    products: ['Nexus HRM', 'CargoScan', 'Nexus MFG', 'Glasstech'],
    notIncluded: ['Custom feature development', 'SLA guarantee', 'Dedicated account manager'],
  },
  {
    id: 'build',
    name: 'Build',
    tagline: 'Custom software for your exact workflow',
    badge: 'Most popular',
    price: 'From $3,000',
    period: 'per project',
    desc: "We design and build a system from scratch — tailored to how your business actually operates. Not a template. Not a SaaS subscription. Yours.",
    color: 'var(--sg-accent)',
    icon: Code2,
    cta: 'Start a project',
    ctaLink: '/contact',
    features: [
      'Full custom development',
      'System design & architecture',
      'Web + mobile delivery',
      'Database design & API layer',
      'Testing & QA included',
      'Staff training & documentation',
      '6 months post-launch support',
      'Source code handover',
    ],
    notIncluded: ['Multi-system integrations (quoted separately)', 'SLA guarantee'],
    highlight: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    tagline: 'Enterprise systems with a dedicated team',
    badge: null,
    price: 'Custom',
    period: 'contact for quote',
    desc: 'For organizations that need multi-system builds, third-party integrations, strict SLAs, and a dedicated team managing their technology stack.',
    color: 'var(--color-success)',
    icon: Building2,
    cta: 'Talk to us',
    ctaLink: '/contact',
    features: [
      'Everything in Build',
      'Multi-system integration',
      'Dedicated project manager',
      'Priority support & SLA guarantee',
      'Security audit & compliance review',
      'Ongoing feature development retainer',
      'NDA & custom contract',
      'Quarterly business reviews',
    ],
    notIncluded: [],
  },
]

const FAQS = [
  {
    q: 'Do I own the software you build for me?',
    a: 'Yes. On all Build and Scale projects, you receive full source code ownership at project completion. We sign a handover agreement. You can host it anywhere, modify it, or give it to another developer.',
  },
  {
    q: 'What happens if I need changes after the project ends?',
    a: "All projects include 3–6 months of support. After that, we offer a monthly maintenance retainer (usually $200–$600/month depending on system complexity). Bug fixes within the support window are always free.",
  },
  {
    q: 'How accurate are your project timelines?',
    a: "We scope every project in detail before we start — and our estimates are conservative, not optimistic. Simple apps take 3–5 weeks. Medium systems take 8–14 weeks. We tell you the real number upfront and we hit it.",
  },
  {
    q: 'Can you integrate with software we already use?',
    a: 'Yes. We regularly integrate with accounting platforms (QuickBooks, Sage), payment gateways (Paystack, MTN MoMo), HR tools, and external APIs. Integration scope is quoted as part of your project.',
  },
  {
    q: 'Do you work with clients outside Ghana?',
    a: "Yes. We currently have clients in Ghana and Guinea, and work remotely with anyone. We communicate over WhatsApp, email, and video — and we're available across West African time zones.",
  },
  {
    q: 'What if I already have an existing system I want improved?',
    a: "We can audit, refactor, or extend existing systems. We start with a paid technical audit ($300–$500) that gives you a clear picture of what's there, what's risky, and what needs to change — before we commit to a build scope.",
  },
]

const PRODUCTS_BRIEF = [
  { slug: 'nexus-hrm', name: 'Nexus HRM', icon: Users, color: 'var(--color-accent-blue)', desc: 'HR & payroll' },
  { slug: 'cargoscan', name: 'CargoScan', icon: Package, color: 'var(--color-warning)', desc: 'Freight tools' },
  { slug: 'nexus-mfg', name: 'Nexus MFG', icon: Factory, color: 'var(--color-success)', desc: 'Production mgmt' },
  { slug: 'sano', name: 'SANO Health', icon: Heart, color: 'var(--color-success)', desc: 'Health monitoring' },
  { slug: 'glasstech', name: 'Glasstech', icon: Layers, color: 'var(--color-accent-violet)', desc: 'Product catalog' },
]

const INDUSTRY_EXAMPLES = [
  {
    icon: Users, color: 'var(--color-accent-blue)',
    industry: 'Retail / Wholesale',
    system: 'E-commerce site + inventory + wholesale portal',
    tier: 'Build', price: '$4,000–$8,000', weeks: '8–12 wks',
    example: 'Lollarod Enterprise (live)',
  },
  {
    icon: GraduationCap, color: 'var(--sg-accent)',
    industry: 'Schools & Education',
    system: 'Admissions + student records + fee management',
    tier: 'Build', price: '$3,500–$6,000', weeks: '8–10 wks',
    example: 'Multi-school deployment ready',
  },
  {
    icon: UtensilsCrossed, color: 'var(--color-danger)',
    industry: 'Restaurants & Food',
    system: 'POS + kitchen orders + inventory + reports',
    tier: 'Build', price: '$3,000–$5,500', weeks: '6–9 wks',
    example: 'Works offline, no monthly fees',
  },
  {
    icon: Stethoscope, color: 'var(--color-success)',
    industry: 'Clinics & Pharmacy',
    system: 'Patient records + dispensing + NHIS billing',
    tier: 'Build', price: '$4,500–$9,000', weeks: '10–14 wks',
    example: 'NHIS-compatible out of the box',
  },
  {
    icon: Truck, color: 'var(--color-warning)',
    industry: 'Logistics & Delivery',
    system: 'Order dispatch + driver tracking + COD reconciliation',
    tier: 'Build', price: '$4,000–$7,000', weeks: '8–12 wks',
    example: 'Includes driver mobile app',
  },
  {
    icon: Home, color: 'var(--color-success)',
    industry: 'Interior Design / Real Estate',
    system: 'Portfolio site + project CRM + invoicing + client portal',
    tier: 'Build', price: '$3,500–$7,000', weeks: '8–12 wks',
    example: 'Westline Future (live)',
  },
]

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      style={{
        border: '1.5px solid var(--color-border-subtle)',
        borderRadius: 'var(--border-radius-lg)',
        background: 'var(--color-background)',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
        ...(open && { borderColor: 'color-mix(in srgb, var(--sg-accent) 25%, transparent)' }),
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-body)', textAlign: 'left', gap: '1rem',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-heading)', lineHeight: 1.45 }}>{faq.q}</span>
        {open
          ? <ChevronUp size={17} color="var(--color-accent-blue)" style={{ flexShrink: 0 }} />
          : <ChevronDown size={17} color="var(--color-text-secondary)" style={{ flexShrink: 0 }} />
        }
      </button>
      {open && (
        <div style={{ padding: '0 1.5rem 1.25rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.75 }}>
          {faq.a}
        </div>
      )}
    </motion.div>
  )
}

export default function PricingPage() {
  return (
    <PageLayout>
      <Helmet>
        <title>Pricing — Stormglide Technologies</title>
        <meta name="description" content="Simple, transparent pricing for custom software development in Africa. Deploy a product, build something custom, or go enterprise." />
        <meta property="og:title" content="Pricing — Stormglide Technologies" />
        <meta property="og:description" content="Fixed price, no surprises. Custom software development in Africa. Scope delivered in 48 hours." />
        <meta property="og:image" content="https://stormglide.vercel.app/og-image.svg" />
        <meta property="og:url" content="https://stormglide.vercel.app/pricing" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://stormglide.vercel.app/og-image.svg" />
        <link rel="canonical" href="https://stormglide.vercel.app/pricing" />
      </Helmet>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface)', padding: '5rem 2rem 4rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>PRICING</div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em', marginBottom: '1.25rem', maxWidth: '620px', margin: '0 auto 1.25rem' }}>
              Transparent pricing. No surprises.
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', lineHeight: 1.75, maxWidth: '520px', margin: '0 auto 2rem' }}>
              Whether you need to deploy a proven product or build something from the ground up — we give you a real scope, a real timeline, and a real price before any work begins.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'color-mix(in srgb, var(--color-success) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--color-success) 20%, transparent)', borderRadius: '99px', padding: '0.375rem 1rem', fontSize: '0.82rem', color: 'var(--color-success)', fontWeight: 500 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
                All projects start with a free 30-min discovery call
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'color-mix(in srgb, var(--color-warning) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--color-warning) 20%, transparent)', borderRadius: '99px', padding: '0.375rem 1rem', fontSize: '0.82rem', color: 'var(--color-warning)', fontWeight: 500 }}>
                <Zap size={13} color="var(--color-warning)" fill="var(--color-warning)" />
                Scope + fixed price delivered within 48 hours
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pricing cards */}
      <section style={{ padding: '5rem 2rem 4rem', background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '1.5rem', alignItems: 'start' }}>
            {PLANS.map((plan, i) => {
              const Icon = plan.icon
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    position: 'relative',
                    background: plan.highlight ? plan.color : 'var(--color-background)',
                    border: plan.highlight ? `2px solid ${plan.color}` : '1.5px solid var(--color-border-subtle)',
                    borderRadius: 'var(--border-radius-lg)',
                    overflow: 'hidden',
                    boxShadow: plan.highlight
                      ? `0 16px 48px ${plan.color}30`
                      : '0 2px 8px rgba(15,23,42,0.06)',
                  }}
                >
                  {plan.badge && (
                    <div style={{
                      position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                      background: 'var(--color-text-heading)', color: plan.color, fontWeight: 700, fontSize: '0.7rem',
                      padding: '0.25rem 1rem', borderRadius: '0 0 12px 12px',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)', boxShadow: '0 2px 8px color-mix(in srgb, var(--sg-accent) 20%, transparent)',
                    }}>
                      {plan.badge}
                    </div>
                  )}

                  <div style={{ padding: '2.25rem 2rem 1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: '11px',
                        background: plan.highlight ? 'color-mix(in srgb, var(--color-text-heading) 18%, transparent)' : `${plan.color}12`,
                        border: `1.5px solid ${plan.highlight ? 'color-mix(in srgb, var(--color-text-heading) 25%, transparent)' : plan.color + '28'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={18} color={plan.highlight ? 'var(--color-text-heading)' : plan.color} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: plan.highlight ? 'var(--color-text-heading)' : 'var(--color-text-heading)' }}>{plan.name}</div>
                        <div style={{ fontSize: '0.78rem', color: plan.highlight ? 'color-mix(in srgb, var(--color-text-heading) 70%, transparent)' : 'var(--color-text-secondary)' }}>{plan.tagline}</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: plan.highlight ? 'var(--color-text-heading)' : 'var(--color-text-heading)', lineHeight: 1 }}>{plan.price}</div>
                      <div style={{ fontSize: '0.78rem', color: plan.highlight ? 'color-mix(in srgb, var(--color-text-heading) 65%, transparent)' : 'var(--color-text-secondary)', marginTop: '0.25rem' }}>{plan.period}</div>
                    </div>

                    <p style={{ color: plan.highlight ? 'color-mix(in srgb, var(--color-text-heading) 80%, transparent)' : 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                      {plan.desc}
                    </p>

                    <Link
                      to={plan.ctaLink}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        padding: '0.8rem 1.5rem', borderRadius: 'var(--border-radius)',
                        background: plan.highlight ? 'var(--color-text-heading)' : plan.color,
                        color: plan.highlight ? plan.color : 'var(--color-text-heading)',
                        fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
                        transition: 'all 0.2s',
                        boxShadow: plan.highlight ? '0 4px 16px rgba(0,0,0,0.15)' : `0 4px 12px ${plan.color}30`,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = plan.highlight ? '0 8px 24px rgba(0,0,0,0.2)' : `0 8px 20px ${plan.color}40` }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = plan.highlight ? '0 4px 16px rgba(0,0,0,0.15)' : `0 4px 12px ${plan.color}30` }}
                    >
                      {plan.cta} <ArrowRight size={15} />
                    </Link>
                  </div>

                  <div style={{ padding: '0 2rem 2rem', borderTop: `1px solid ${plan.highlight ? 'color-mix(in srgb, var(--color-text-heading) 15%, transparent)' : 'var(--color-border-subtle)'}`, paddingTop: '1.5rem' }}>
                    <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: plan.highlight ? 'color-mix(in srgb, var(--color-text-heading) 50%, transparent)' : 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', fontWeight: 500 }}>What's included</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {plan.features.map(f => (
                        <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem' }}>
                          <Check size={14} color={plan.highlight ? 'color-mix(in srgb, var(--color-text-heading) 80%, transparent)' : plan.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span style={{ color: plan.highlight ? 'color-mix(in srgb, var(--color-text-heading) 85%, transparent)' : 'var(--color-text-primary)', lineHeight: 1.45 }}>{f}</span>
                        </div>
                      ))}
                      {plan.notIncluded && plan.notIncluded.length > 0 && plan.notIncluded.map(f => (
                        <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', opacity: 0.45 }}>
                          <span style={{ width: 14, height: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px', fontSize: '0.7rem', color: plan.highlight ? 'color-mix(in srgb, var(--color-text-heading) 60%, transparent)' : 'var(--color-text-secondary)' }}>—</span>
                          <span style={{ color: plan.highlight ? 'color-mix(in srgb, var(--color-text-heading) 60%, transparent)' : 'var(--color-text-secondary)', lineHeight: 1.45, textDecoration: 'line-through' }}>{f}</span>
                        </div>
                      ))}
                    </div>

                    {plan.products && (
                      <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: `1px solid ${plan.highlight ? 'color-mix(in srgb, var(--color-text-heading) 10%, transparent)' : 'var(--color-border-subtle)'}` }}>
                        <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: plan.highlight ? 'color-mix(in srgb, var(--color-text-heading) 50%, transparent)' : 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', fontWeight: 500 }}>Available products</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                          {plan.products.map(p => (
                            <span key={p} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '99px', background: plan.highlight ? 'color-mix(in srgb, var(--color-text-heading) 12%, transparent)' : 'var(--color-surface)', border: `1px solid ${plan.highlight ? 'color-mix(in srgb, var(--color-text-heading) 20%, transparent)' : 'var(--color-border-subtle)'}`, color: plan.highlight ? 'color-mix(in srgb, var(--color-text-heading) 80%, transparent)' : 'var(--color-text-secondary)', fontWeight: 500 }}>{p}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products available to deploy */}
      <section style={{ padding: '2rem 2rem 5rem', background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', padding: '2.5rem', display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 280px' }}>
              <div className="section-label">READY TO DEPLOY</div>
              <h3 style={{ fontSize: '1.3rem', letterSpacing: '-0.01em', marginBottom: '0.625rem' }}>5 products. Ready in days.</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                Each of these products is already built, tested, and running in real businesses. Choose one, we configure it for you, and you're live within the week.
              </p>
            </div>
            <div style={{ flex: '2 1 400px', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {PRODUCTS_BRIEF.map(p => {
                const Icon = p.icon
                return (
                  <Link key={p.slug} to={`/products/${p.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.75rem 1.125rem', background: 'var(--color-background)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)', textDecoration: 'none', transition: 'all 0.2s', flex: '1 1 160px' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + '50'; e.currentTarget.style.boxShadow = `0 4px 16px ${p.color}14` }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: '8px', background: `${p.color}12`, border: `1px solid ${p.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} color={p.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>{p.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{p.desc}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industry examples */}
      <section style={{ padding: '1rem 2rem 5rem', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-subtle)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>REAL EXAMPLES</div>
            <h2 style={{ letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>What does your project actually cost?</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.975rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.75 }}>
              Here's what typical projects in each industry look like — scope, timeline, and ballpark cost.
            </p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1.25rem' }}>
            {INDUSTRY_EXAMPLES.map((ex, i) => {
              const Icon = ex.icon
              return (
                <motion.div
                  key={ex.industry}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  style={{ background: 'var(--color-background)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', padding: '1.75rem', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2.5px', background: `linear-gradient(90deg, ${ex.color}, transparent 60%)` }} />
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '11px', background: `${ex.color}12`, border: `1.5px solid ${ex.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={17} color={ex.color} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{ex.industry}</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-heading)', lineHeight: 1.35 }}>{ex.system}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', padding: '0.625rem 0.875rem', background: `${ex.color}08`, border: `1px solid ${ex.color}18`, borderRadius: '10px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: ex.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Estimate</div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: ex.color, fontFamily: 'var(--font-display)' }}>{ex.price}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', padding: '0.625rem 0.875rem', background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: '10px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--color-text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Timeline</div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-heading)', fontFamily: 'var(--font-display)' }}>{ex.weeks}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                    <Check size={12} color={ex.color} />
                    {ex.example}
                  </div>
                </motion.div>
              )
            })}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              These are starting estimates. Final cost depends on feature scope, integrations, and user count. We give you a fixed price before we start.
            </p>
            <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent-blue)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
              Get a quote for your project <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '2rem 2rem 6rem', background: 'var(--color-surface)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>
              <HelpCircle size={12} /> FAQ
            </div>
            <h2 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Questions we get asked a lot</h2>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} index={i} />)}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, var(--sg-accent) 0%, var(--color-success) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'color-mix(in srgb, var(--color-text-heading) 4%, transparent)' }} />
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ color: 'var(--color-text-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              Not sure which option fits?
            </h2>
            <p style={{ color: 'color-mix(in srgb, var(--color-text-heading) 75%, transparent)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.25rem' }}>
              Tell us what you're trying to build. We'll give you an honest recommendation — no sales pressure, no commitment required.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', background: 'var(--color-text-heading)', color: 'var(--color-accent-blue)', fontWeight: 700, fontSize: '0.9rem', borderRadius: 'var(--border-radius)', textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)' }}
              >
                Let's talk <ArrowRight size={15} />
              </Link>
              <Link to="/work" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', background: 'color-mix(in srgb, var(--color-text-heading) 10%, transparent)', color: 'var(--color-text-heading)', fontWeight: 600, fontSize: '0.9rem', borderRadius: 'var(--border-radius)', border: '1px solid color-mix(in srgb, var(--color-text-heading) 20%, transparent)', textDecoration: 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--color-text-heading) 18%, transparent)'}
                onMouseLeave={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--color-text-heading) 10%, transparent)'}
              >
                See our work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  )
}
