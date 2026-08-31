import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react'
import { Link, useParams, Navigate } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import SectionHeader from '../components/common/SectionHeader'
import { INDUSTRIES } from '../data/industries'
import { CLIENT_WORK, getWorkPath } from '../data/clientWork'

export default function IndustryLanding() {
  const { slug } = useParams()
  const industry = INDUSTRIES.find(i => i.slug === slug)
  if (!industry) return <Navigate to="/industries" replace />

  const anchorCase = industry.anchor ? CLIENT_WORK.find(c => c.slug === industry.anchor) : null
  const Icon = industry.icon

  return (
    <PageLayout>
      <div style={{ borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
          <Link to="/industries" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <ArrowLeft size={13} /> Industries
          </Link>
          <span style={{ color: 'var(--color-border-subtle)' }}>/</span>
          <span style={{ color: 'var(--color-text-heading)', fontWeight: 500 }}>{industry.name}</span>
        </div>
      </div>

      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-subtle)', padding: '4.5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: '0.5rem 1rem', borderRadius: '999px', background: `${industry.color}12`, border: `1px solid ${industry.color}30` }}>
              <Icon size={15} color={industry.color} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: industry.color }}>{industry.name}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', letterSpacing: '-0.02em', lineHeight: 1.08, marginBottom: '1.25rem', color: 'var(--color-text-heading)' }}>{industry.tagline}</h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, maxWidth: '680px' }}>{industry.description}</p>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4.5rem 2rem' }}>
        <SectionHeader label="What we'd build" title="Systems for this industry" alignment="left" maxWidth="640px" />
        <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {industry.systems.map((s, i) => (
            <motion.div key={s} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1.25rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--radius)' }}>
              <CheckCircle2 size={16} color={industry.color} style={{ marginTop: '1px', flexShrink: 0 }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>{s}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {anchorCase ? (
        <div style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-subtle)', padding: '4.5rem 2rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <SectionHeader label="Real client work" title={`How this looks in practice — ${anchorCase.name}`} alignment="left" maxWidth="640px" />
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ marginTop: '2.5rem', padding: '2rem', background: 'var(--color-background)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <anchorCase.RegionIcon size={13} color={anchorCase.color} />
                {anchorCase.region} · {anchorCase.category} · {anchorCase.year}
              </div>
              <p style={{ fontSize: '1rem', color: anchorCase.color, fontWeight: 600, marginBottom: '1rem' }}>{anchorCase.scope}</p>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '1.5rem', maxWidth: '680px' }}>{anchorCase.desc}</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to={getWorkPath(anchorCase.slug)} className="btn-primary">
                  View case study <ArrowRight size={16} />
                </Link>
                <a href={anchorCase.url} target="_blank" rel="noopener noreferrer" className="sg-home-text-link">
                  Visit site <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      ) : null}

      <div style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.7rem', marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Tell us how {industry.name.toLowerCase()} works at your business.</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>We'll tell you what a connected system would actually look like — no generic pitch, no rigid template.</p>
          <Link to="/systems-audit" className="btn-primary">
            Request a systems audit <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}
