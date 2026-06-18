import { motion } from 'framer-motion'
import { Building2, Layers, Brain, Shield, MapPin } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const PILLARS = [
  { icon: Building2, title: 'Built in Africa', desc: "We understand the market, the infrastructure, the constraints, and the opportunity. We don't build for Africa from the outside — we are inside it.", color: 'var(--color-accent-blue)', bg: 'color-mix(in srgb, var(--sg-accent) 7%, transparent)', border: 'color-mix(in srgb, var(--sg-accent) 15%, transparent)' },
  { icon: Layers, title: 'Full-Stack Delivery', desc: 'Design, build, deploy, support — one team handles it all. No handoffs, no excuses, no disappearing after launch.', color: 'var(--color-accent-violet)', bg: 'color-mix(in srgb, var(--color-success) 7%, transparent)', border: 'color-mix(in srgb, var(--color-success) 15%, transparent)' },
  { icon: Brain, title: 'AI-Native by Default', desc: 'Every system we build considers artificial intelligence from day one. Not as a gimmick — as a genuine tool for doing more with less.', color: 'var(--color-accent-coral)', bg: 'color-mix(in srgb, var(--color-accent-coral) 7%, transparent)', border: 'color-mix(in srgb, var(--color-accent-coral) 15%, transparent)' },
  { icon: Shield, title: 'Enterprise-Grade Security', desc: 'Multi-tenant architecture, role-based access control, audit trails, and data encryption. Built right from the start.', color: 'var(--color-success)', bg: 'color-mix(in srgb, var(--color-success) 7%, transparent)', border: 'color-mix(in srgb, var(--color-success) 18%, transparent)' },
]

export default function About() {
  const { theme } = useTheme()

  return (
    <section id="about" style={{ padding: 'var(--section-padding) 2rem', background: 'var(--color-background)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, color-mix(in srgb, var(--color-success) 4%, transparent) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>WHO WE ARE</div>
          <h2 style={{ marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Technology built for Africa.<br />
            <span style={{ background: 'linear-gradient(120deg, var(--color-accent-blue), var(--color-accent-violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Standards built for the world.</span>
          </h2>
        </motion.div>

        {/* Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '5rem' }}>
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: 'var(--color-background)',
                border: '1.5px solid var(--color-border-subtle)',
                borderRadius: 'var(--border-radius-lg)',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(15,23,42,0.04)',
                transition: 'box-shadow 0.25s, border-color 0.25s, transform 0.25s',
              }}
              whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(15,23,42,0.08)' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${pillar.color}, transparent)`, borderRadius: '20px 20px 0 0' }} />
              <div style={{
                width: 44, height: 44, borderRadius: '12px',
                background: pillar.bg,
                border: `1.5px solid ${pillar.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem',
              }}>
                <pillar.icon size={20} color={pillar.color} />
              </div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--color-text-heading)' }}>{pillar.title}</h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.875rem' }}>{pillar.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bio */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '1rem', marginBottom: '2rem' }}>{theme.siteAboutText}</p>
          <blockquote style={{
            borderLeft: '3px solid var(--color-accent-blue)',
            paddingLeft: '1.5rem', textAlign: 'left',
            fontFamily: 'var(--font-display)', fontSize: '1.05rem',
            color: 'var(--color-text-heading)', fontStyle: 'italic',
            background: 'color-mix(in srgb, var(--sg-accent) 4%, transparent)',
            borderRadius: '0 12px 12px 0',
            padding: '1rem 1.5rem',
          }}>
            "{theme.siteMission}"
          </blockquote>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ display: 'flex', justifyContent: 'center', gap: '0', flexWrap: 'wrap', background: 'var(--color-surface)', borderRadius: 'var(--border-radius-lg)', border: '1.5px solid var(--color-border-subtle)', overflow: 'hidden' }}
        >
          {[
            { value: <MapPin size={22} color="var(--color-accent-blue)" />, label: 'Founded in Accra, Ghana' },
            { value: '5', label: 'Products in market' },
            { value: '3+', label: 'Countries served' },
            { value: '100%', label: 'Custom-built systems' },
          ].map((s, i) => (
            <div key={s.label} style={{ flex: '1 1 180px', padding: '2rem', textAlign: 'center', borderRight: i < 3 ? '1px solid var(--color-border-subtle)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-heading)', marginBottom: '0.375rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{s.value}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--color-text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
