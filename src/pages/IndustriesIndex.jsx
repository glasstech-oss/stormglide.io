import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import { INDUSTRIES, getIndustryPath } from '../data/industries'

export default function IndustriesIndex() {
  return (
    <PageLayout>
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-subtle)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="section-label">Industries</div>
            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', letterSpacing: '-0.02em', lineHeight: 1.05, margin: '1.25rem 0 1.25rem', color: 'var(--color-text-heading)', textTransform: 'uppercase' }}>
              We understand how businesses operate.
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, maxWidth: '620px' }}>
              Every industry runs on its own repeated processes — the same problem shows up differently in a logistics yard, a dental clinic, and a wholesale warehouse. Here's what we've built and what we'd build for each.
            </p>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {INDUSTRIES.map((industry, i) => {
            const Icon = industry.icon
            return (
              <motion.div key={industry.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link to={getIndustryPath(industry.slug)} style={{ display: 'block', height: '100%', padding: '2rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,23,42,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${industry.color}14`, border: `1px solid ${industry.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Icon size={20} color={industry.color} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '0.625rem' }}>{industry.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>{industry.tagline}</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: industry.color }}>
                    {industry.anchor ? 'See the system' : 'See what we\'d build'} <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </PageLayout>
  )
}
