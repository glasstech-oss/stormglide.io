import { motion } from 'framer-motion'
import { ArrowRight, Building2, Layers, Brain, Shield, MapPin, Globe2, Zap, Wrench, Phone, Monitor, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import { useTheme } from '../context/ThemeContext'
import { Helmet } from 'react-helmet-async'

const PILLARS = [
  { icon: Building2, title: 'Built in Africa', desc: "We understand the market, the infrastructure, the constraints, and the opportunity. We don't build for Africa from the outside — we are inside it.", color: 'var(--color-accent-blue)', bg: 'color-mix(in srgb, var(--sg-accent) 7%, transparent)', border: 'color-mix(in srgb, var(--sg-accent) 15%, transparent)' },
  { icon: Layers, title: 'Full-Stack Delivery', desc: 'Design, build, deploy, support — one team handles it all. No handoffs, no excuses, no disappearing after launch.', color: 'var(--color-accent-violet)', bg: 'color-mix(in srgb, var(--color-success) 7%, transparent)', border: 'color-mix(in srgb, var(--color-success) 15%, transparent)' },
  { icon: Brain, title: 'AI-Native by Default', desc: 'Every system we build considers artificial intelligence from day one. Not as a gimmick — as a genuine tool for doing more with less.', color: 'var(--color-accent-coral)', bg: 'color-mix(in srgb, var(--color-accent-coral) 7%, transparent)', border: 'color-mix(in srgb, var(--color-accent-coral) 15%, transparent)' },
  { icon: Shield, title: 'Enterprise-Grade Security', desc: 'Multi-tenant architecture, role-based access control, audit trails, and data encryption. Built right from the start.', color: 'var(--color-success)', bg: 'color-mix(in srgb, var(--color-success) 7%, transparent)', border: 'color-mix(in srgb, var(--color-success) 18%, transparent)' },
  { icon: Zap, title: 'Speed Without Shortcuts', desc: "We scope in 48 hours, demo in week one, and ship on the exact date we commit to. No 6-month timelines, no excuses, no disappearing developers. Fast is how we work.", color: 'var(--color-warning)', bg: 'color-mix(in srgb, var(--color-warning) 7%, transparent)', border: 'color-mix(in srgb, var(--color-warning) 18%, transparent)' },
]

const STATS = [
  { value: '5',    label: 'Products live'      },
  { value: '3+',   label: 'Countries served'   },
  { value: '10+',  label: 'Systems shipped'    },
  { value: '4 wk', label: 'Avg. delivery time' },
]

export default function AboutPage() {
  const { theme } = useTheme()

  return (
    <PageLayout>
      <Helmet>
        <title>About — Stormglide Technologies</title>
        <meta name="description" content="Stormglide is a software company built in Accra, Ghana. We build enterprise systems, SaaS products, and AI tools for African businesses." />
        <meta property="og:title" content="About Stormglide Technologies" />
        <meta property="og:description" content="Built in Accra, Ghana. We build enterprise systems for African businesses — fast, full-stack, and no excuses." />
        <meta property="og:image" content="https://stormglide.vercel.app/og-image.svg" />
        <meta property="og:url" content="https://stormglide.vercel.app/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://stormglide.vercel.app/og-image.svg" />
        <link rel="canonical" href="https://stormglide.vercel.app/about" />
      </Helmet>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface)', padding: '4rem 2rem 3rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-label">WHO WE ARE</div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '1rem', maxWidth: '640px' }}>
              A software company built by people who understand the African market
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              <MapPin size={14} />
              <span>Accra, Ghana — operating in 3+ countries</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mission + about text */}
      <div style={{ padding: '5rem 2rem', background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }} className="about-grid">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: '1.6rem', letterSpacing: '-0.02em', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              We build the technology African businesses deserve — not the watered-down version
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '0.975rem', marginBottom: '1.5rem' }}>{theme.siteAboutText}</p>
            <blockquote style={{ borderLeft: '3px solid var(--color-accent-blue)', paddingLeft: '1.25rem', fontFamily: 'var(--font-display)', fontSize: '1rem', fontStyle: 'italic', color: 'var(--color-text-heading)', background: 'color-mix(in srgb, var(--sg-accent) 4%, transparent)', borderRadius: '0 10px 10px 0', padding: '1rem 1.25rem' }}>
              "{theme.siteMission}"
            </blockquote>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', border: '1.5px solid var(--color-border-subtle)', marginBottom: '2rem' }}>
              {STATS.map((s, i) => (
                <div key={s.label} style={{ background: 'var(--color-background)', padding: '1.75rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(120deg, var(--color-accent-blue), var(--color-accent-violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.25rem' }}>{s.value}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', background: 'color-mix(in srgb, var(--color-success) 6%, transparent)', border: '1.5px solid color-mix(in srgb, var(--color-success) 20%, transparent)', borderRadius: 'var(--border-radius)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)', flexShrink: 0 }} />
              <span style={{ color: 'var(--color-success)', fontSize: '0.875rem', fontWeight: 500 }}>Currently accepting new projects</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pillars */}
      <div style={{ padding: '0 2rem 5rem', background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>HOW WE OPERATE</div>
            <h2 style={{ letterSpacing: '-0.02em' }}>Four principles we don't compromise on</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {PILLARS.map((p, i) => {
              const Icon = p.icon
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{ background: 'var(--color-background)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', padding: '2rem', position: 'relative', overflow: 'hidden', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${p.color}, transparent)` }} />
                  <div style={{ width: 44, height: 44, borderRadius: '12px', background: p.bg, border: `1.5px solid ${p.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Icon size={20} color={p.color} />
                  </div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>{p.title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.72, fontSize: '0.875rem' }}>{p.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Founder section */}
      <div style={{ padding: '5rem 2rem', background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '3rem' }}>
            <div className="section-label">WHO'S BEHIND THIS</div>
            <h2 style={{ letterSpacing: '-0.028em', maxWidth: '480px' }}>Built by engineers who know what broken software costs.</h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }} className="founder-grid">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div style={{ background: 'linear-gradient(135deg, var(--sg-accent)08 0%, var(--color-success)08 100%)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', padding: '2.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-violet))', borderRadius: '99px 99px 0 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, var(--sg-accent), var(--color-success))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={26} color="var(--color-text-heading)" fill="var(--color-text-heading)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-heading)' }}>The Founding Team</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.15rem' }}>Accra, Ghana</div>
                  </div>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                  Stormglide started because we kept watching African businesses get burned — paying for expensive imported software that didn't fit how they work, or getting burned by developers who disappeared after launch.
                </p>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                  We are engineers, designers, and product builders — all from Ghana — who decided the solution was simple: build the software ourselves, for clients who deserve the same quality as any Fortune 500 company.
                </p>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '0.95rem' }}>
                  Every system we've shipped is live, running real businesses, and maintained by us today. We don't move on. We stay in.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { Icon: Wrench,       color: 'var(--sg-accent)', bg: 'color-mix(in srgb, var(--sg-accent) 8%, transparent)',  title: 'We build what we promise', desc: 'Every feature we scope, we deliver. Every timeline we give, we hit. If something changes, you hear it from us first — not after the fact.' },
                  { Icon: Phone,        color: 'var(--color-success)', bg: 'color-mix(in srgb, var(--color-success) 8%, transparent)',  title: "We don't disappear",       desc: 'Our WhatsApp is always open. Every system we\'ve ever shipped still has our support. Clients call us two years after launch — and we answer.' },
                  { Icon: Globe2,       color: 'var(--color-success)', bg: 'color-mix(in srgb, var(--color-success) 8%, transparent)', title: 'We understand Africa first', desc: "We've built for Paystack, MTN MoMo, SSNIT, NHIS, and GES. We know how Ghanaian businesses actually operate — and we design for that reality." },
                  { Icon: Monitor,      color: 'var(--color-accent-blue)', bg: 'color-mix(in srgb, var(--color-accent-blue) 8%, transparent)',  title: 'No outsourcing, ever',      desc: 'Every line of code is written by our in-house team. No freelancers, no handoffs to unknown developers, no AI-generated junk. Just our engineers.' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    style={{ display: 'flex', gap: '1rem', padding: '1.25rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', alignItems: 'flex-start' }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: '10px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <item.Icon size={16} color={item.color} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-heading)', marginBottom: '0.375rem' }}>{item.title}</div>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.83rem', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Operating regions */}
      <div style={{ padding: '5rem 2rem', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-subtle)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Globe2 size={32} color="var(--color-accent-blue)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Where we operate</h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '0.975rem' }}>
              Headquartered in Accra, Ghana — with systems running for clients in Ghana, Guinea, and growing across West Africa. We build with African infrastructure in mind: variable connectivity, mobile-first users, and local compliance requirements.
            </p>
            <Link to="/contact" className="btn-primary" style={{ textDecoration: 'none', gap: '0.5rem' }}>
              Work with us <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .founder-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </PageLayout>
  )
}
