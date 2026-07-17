import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react'
import { Link, useParams, Navigate } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import { CLIENT_WORK, getWorkPath } from '../data/clientWork'
import { handleViewTransitionClick, useViewTransitionNavigate } from '../lib/viewTransition'

export default function WorkDetail() {
  const { slug } = useParams()
  const study = CLIENT_WORK.find(c => c.slug === slug)
  const vtNavigate = useViewTransitionNavigate()

  if (!study) return <Navigate to="/work" replace />

  const others = CLIENT_WORK.filter(c => c.slug !== study.slug).slice(0, 3)

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
          <Link to="/work" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.375rem', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-heading)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            <ArrowLeft size={13} /> Work
          </Link>
          <span style={{ color: 'var(--color-border-subtle)' }}>/</span>
          <span style={{ color: 'var(--color-text-heading)', fontWeight: 500 }}>{study.name}</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-subtle)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <study.RegionIcon size={13} color={study.color} />
              {study.region} · {study.category} · {study.year}
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>{study.name}</h1>
            <p style={{ fontSize: '1.05rem', color: study.color, fontWeight: 500, marginBottom: '1.25rem' }}>{study.scope}</p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '620px', marginBottom: '2rem' }}>{study.desc}</p>
            <a href={study.url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: study.color, color: 'var(--color-text-heading)', fontWeight: 700, fontSize: '0.9rem', borderRadius: 'var(--border-radius)', textDecoration: 'none', boxShadow: `0 4px 16px ${study.color}40`, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 28px ${study.color}50` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 16px ${study.color}40` }}
            >
              Visit site <ExternalLink size={14} />
            </a>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3rem', alignItems: 'start' }} className="work-detail-grid">

          {/* Left: what was built + stack */}
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.4rem', letterSpacing: '-0.01em', marginBottom: '1.5rem' }}>What we built</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {study.what.map((w, i) => (
                  <motion.div
                    key={w}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem 1.25rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)' }}
                  >
                    <CheckCircle2 size={16} color={study.color} style={{ marginTop: '1px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>{w}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ padding: '1.75rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>Built with</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {study.stack.map(t => (
                  <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', padding: '0.35rem 0.75rem', borderRadius: '8px', background: 'var(--color-background)', border: '1.5px solid var(--color-border-subtle)', color: 'var(--color-text-primary)', fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: illustrative snapshot panel + cross-links */}
          <div style={{ position: 'sticky', top: '88px' }}>
            {/* This is an illustrative summary of real project facts (year,
                region, category, stack size) — not a screenshot or a claimed
                business metric, since neither exists for this case study yet. */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={{ background: 'var(--color-background)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', boxShadow: '0 4px 24px rgba(15,23,42,0.07)' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border-subtle)', background: `${study.color}08`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Case snapshot</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', padding: '0.15rem 0.5rem', borderRadius: '99px', background: `${study.color}18`, color: study.color, fontWeight: 700, letterSpacing: '0.06em' }}>LIVE</span>
              </div>
              <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Shipped</div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-heading)' }}>{study.year}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Region</div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-heading)' }}>{study.region}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Stack</div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-heading)' }}>{study.stack.length} tools</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Category</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-heading)', lineHeight: 1.3 }}>{study.category}</div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginTop: '1.25rem', padding: '1.25rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>More client work</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {others.map(o => (
                  <Link key={o.slug} to={getWorkPath(o.slug)}
                    onClick={e => handleViewTransitionClick(e, vtNavigate, getWorkPath(o.slug), { name: 'work-flip' })}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', padding: '0.5rem', borderRadius: '8px', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-alt)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: '8px', background: `${o.color}12`, border: `1px solid ${o.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <o.RegionIcon size={14} color={o.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>{o.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{o.category}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .work-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PageLayout>
  )
}
