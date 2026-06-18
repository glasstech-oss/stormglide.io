import { motion } from 'framer-motion'
import { ArrowRight, Globe2, Building2, Brain, Users, ShoppingBag, Lightbulb, CheckCircle2, MoveUpRight, Stethoscope, MapPin, Cloud, Truck, CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import { services } from '../data/services'
import { Helmet } from 'react-helmet-async'

const ICONS = { Globe2, Building2, Brain, Users, ShoppingBag, Lightbulb, Stethoscope, Cloud, Truck, CreditCard }

const WHY_US = [
  'Every website includes a full admin backoffice — not an afterthought, built in from day one.',
  'We\'ve shipped and run real products — Nexus HRM, CargoScan, Nexus MFG — used by real businesses.',
  'Based in Accra. We understand African business constraints, infrastructure, and opportunity.',
  'One team from design to deployment. No handoffs. No finger-pointing.',
  'Every system you pay for is yours — documented, maintainable, source code included.',
  'Modern, production-grade tooling. No drag-and-drop builders, no templates.',
  'We don\'t disappear. If something breaks, we\'re there.',
]

const CLIENT_EXAMPLES = [
  { name: 'Lollarod Enterprise', url: 'https://lollarodgh.web.app', what: 'E-commerce + wholesale portal + admin backoffice', RegionIcon: MapPin,  region: 'Ghana' },
  { name: 'Westline Future',     url: 'https://westlinedecor.com',  what: 'Project management + client CRM + design vault + payments', RegionIcon: Globe2,  region: 'West Africa' },
]

export default function ServicesPage() {
  return (
    <PageLayout>
      <Helmet>
        <title>Custom Software Development & SaaS Services | StormGlide</title>
        <meta name="description" content="Custom software development services: SaaS platforms, ERP systems, HR management, logistics software, and web applications. Built for African businesses by StormGlide." />
        <meta name="keywords" content="custom software development, SaaS development, ERP software, HR management system, logistics software, business automation, custom web development" />
        <meta property="og:title" content="Custom Software & SaaS Development Services" />
        <meta property="og:description" content="We develop SaaS products, custom business software, and automation tools. From MVP to enterprise-scale platforms." />
        <meta property="og:image" content="https://stormglide.vercel.app/og-image.svg" />
        <meta property="og:url" content="https://stormglide.vercel.app/services" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://stormglide.vercel.app/og-image.svg" />
        <link rel="canonical" href="https://stormglide.vercel.app/services" />

        {/* Schema.org Service Provider markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "StormGlide Technologies",
            "description": "Custom software development and SaaS product company",
            "url": "https://stormglide.vercel.app/services",
            "areaServed": "Africa",
            "serviceType": ["Custom Software Development", "SaaS Product Development", "Business Automation", "Web Development"],
            "offers": {
              "@type": "Offer",
              "priceCurrency": "USD",
              "priceRange": "$$$$"
            }
          })}
        </script>
      </Helmet>

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
              Every product we deliver is two things in one: a polished, custom-built front end your customers see, and a powerful backoffice your team uses every day to run the business.
            </p>

            {/* Client examples strip */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {CLIENT_EXAMPLES.map(c => (
                <a key={c.name} href={c.url} target="_blank" rel="noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.4rem 0.875rem 0.4rem 0.625rem',
                  background: 'var(--bg-white)', border: '1.5px solid var(--ink-100)',
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

      {/* Services grid */}
      <div style={{ padding: '5rem 2rem', background: 'var(--bg-white)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(360px, 100%), 1fr))', gap: '1.25rem' }}>
            {services.map((s, i) => {
              const Icon = ICONS[s.icon] || Globe2
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    background: 'var(--bg-white)', border: '1.5px solid var(--ink-100)',
                    borderRadius: 'var(--radius-xl)', padding: '2rem',
                    boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* Top accent line */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2.5px', background: `linear-gradient(90deg, ${s.color}, transparent 60%)`, borderRadius: '99px 99px 0 0' }} />

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

                  {/* Tech tags */}
                  {s.tools && s.tools.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid var(--ink-100)' }}>
                      {s.tools.map(t => (
                        <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', padding: '0.18rem 0.5rem', borderRadius: '6px', background: `${s.color}08`, border: `1px solid ${s.color}18`, color: s.color, fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
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
                We started Stormglide because African businesses were being underserved — paying for imported tools that didn't fit, or settling for basic platforms that couldn't grow. We build the software we wish existed.
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
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem 1.125rem', background: 'var(--bg-white)', border: '1.5px solid var(--ink-100)', borderRadius: '12px', boxShadow: 'var(--shadow-xs)' }}
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
      <div style={{ padding: '5rem 2rem', background: 'var(--bg-white)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ letterSpacing: '-0.028em', marginBottom: '1rem' }}>Have a project in mind?</h2>
            <p style={{ color: 'var(--ink-400)', marginBottom: '2rem', lineHeight: 1.8 }}>
              Tell us what you need to build. We come back with a clear approach, a realistic timeline, and a fixed price.
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
