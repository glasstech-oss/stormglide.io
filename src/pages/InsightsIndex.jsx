import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import { INSIGHTS, getInsightPath } from '../data/insights'

export default function InsightsIndex() {
  return (
    <PageLayout>
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-subtle)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="section-label">Insights</div>
            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', letterSpacing: '-0.02em', lineHeight: 1.05, margin: '1.25rem 0 1.25rem', color: 'var(--color-text-heading)', textTransform: 'uppercase' }}>
              Notes from building business systems.
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, maxWidth: '620px' }}>
              What we've actually learned scoping and building software for growing businesses — not generic advice, just what shows up repeatedly in the work.
            </p>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4.5rem 2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {INSIGHTS.map((article, i) => (
            <motion.div key={article.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <Link to={getInsightPath(article.slug)} style={{ display: 'block', padding: '2rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--radius-lg)', textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,23,42,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sg-accent)' }}>
                  <span>{article.category}</span>
                  <span style={{ color: 'var(--color-border-subtle)' }}>·</span>
                  <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{article.readTime}</span>
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '0.625rem', lineHeight: 1.3 }}>{article.title}</h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: '1.25rem', maxWidth: '680px' }}>{article.dek}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--sg-accent)' }}>
                  Read <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
