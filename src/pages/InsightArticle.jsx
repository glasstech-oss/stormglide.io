import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useParams, Navigate } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import { INSIGHTS } from '../data/insights'

function ArticleBlock({ block }) {
  if (block.type === 'h2') {
    return (
      <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text-heading)', margin: '2.25rem 0 1rem', letterSpacing: '-0.01em' }}>
        {block.text}
      </h2>
    )
  }
  if (block.type === 'list') {
    return (
      <ul style={{ margin: '0 0 1.25rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {block.items.map((item, i) => (
          <li key={i} style={{ color: 'var(--color-text-secondary)', fontSize: '1.02rem', lineHeight: 1.75 }}>{item}</li>
        ))}
      </ul>
    )
  }
  return (
    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.02rem', lineHeight: 1.85, marginBottom: '1.25rem' }}>
      {block.text}
    </p>
  )
}

export default function InsightArticle() {
  const { slug } = useParams()
  const article = INSIGHTS.find(a => a.slug === slug)
  if (!article) return <Navigate to="/insights" replace />

  return (
    <PageLayout>
      <div style={{ borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
          <Link to="/insights" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <ArrowLeft size={13} /> Insights
          </Link>
        </div>
      </div>

      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-subtle)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sg-accent)' }}>
              <span>{article.category}</span>
              <span style={{ color: 'var(--color-border-subtle)' }}>·</span>
              <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{article.readTime}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', letterSpacing: '-0.02em', lineHeight: 1.12, marginBottom: '1.25rem', color: 'var(--color-text-heading)' }}>{article.title}</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{article.dek}</p>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3.5rem 2rem 2rem' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {article.content.map((block, i) => <ArticleBlock key={i} block={block} />)}
        </motion.div>
      </div>

      <div style={{ padding: '3rem 2rem 5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Recognize this in how your business runs?</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Tell us how it actually works today — we'll tell you what a connected system would look like.</p>
          <Link to="/systems-audit" className="btn-primary">
            Request a systems audit <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}
