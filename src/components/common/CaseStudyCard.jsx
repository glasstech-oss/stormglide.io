import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, CheckCircle2, ChevronRight, Zap } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

/**
 * CaseStudyCard - Premium dedicated card for showcasing case studies
 */
export default function CaseStudyCard({
  title,
  industry,
  problem,
  solution,
  outcome,
  features = [],
  technologies = [],
  demoUrl,
  caseStudyUrl,
  color = 'var(--sg-accent)',
  delay = 0,
  badge,
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isCentered, setIsCentered] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches
    if (!isMobile || !cardRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCentered(entry.isIntersecting)
      },
      {
        root: null,
        // Active when card is within the center 40% of the viewport (horizontal & vertical)
        rootMargin: '-30% -30% -30% -30%',
        threshold: 0
      }
    )

    observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  const isActive = isHovered || isCentered

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--card-accent': color,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--color-surface)',
        borderRadius: '24px',
        border: '1px solid var(--color-border-subtle)',
        padding: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isActive ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isActive 
          ? `0 24px 48px -12px color-mix(in srgb, var(--card-accent) 30%, transparent)`
          : `0 8px 24px color-mix(in srgb, var(--color-background) 50%, transparent)`,
      }}
    >
      {/* Top Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '1px',
        background: `linear-gradient(90deg, transparent, var(--card-accent), transparent)`,
        opacity: isActive ? 1 : 0.3,
        transition: 'opacity 0.4s ease',
        boxShadow: `0 2px 20px var(--card-accent)`
      }} />

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.4rem 1rem',
            background: `color-mix(in srgb, var(--card-accent) 12%, transparent)`,
            border: `1px solid color-mix(in srgb, var(--card-accent) 25%, transparent)`,
            borderRadius: '999px',
          }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--card-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {industry}
            </span>
          </div>
          {badge && (
            <span style={{ 
              fontSize: '0.65rem', fontWeight: 800, background: 'var(--card-accent)', 
              color: 'var(--color-background)', padding: '0.4rem 0.85rem', 
              borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.08em',
              boxShadow: `0 4px 12px color-mix(in srgb, var(--card-accent) 30%, transparent)`
            }}>
              {badge}
            </span>
          )}
        </div>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.75rem',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'var(--color-text-heading)',
          lineHeight: 1.2,
          margin: 0,
        }}>
          {title}
        </h3>
      </div>

      {/* Outcome Highlight (Moved up for impact) */}
      {outcome && (
        <div style={{ 
          marginBottom: '2rem', 
          padding: '1.25rem', 
          background: `linear-gradient(135deg, color-mix(in srgb, var(--card-accent) 12%, transparent) 0%, transparent 100%)`, 
          borderRadius: '12px', 
          border: `1px solid color-mix(in srgb, var(--card-accent) 20%, transparent)`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            width: '32px', height: '32px', borderRadius: '50%', 
            background: 'var(--card-accent)', color: 'var(--color-background)', flexShrink: 0 
          }}>
            <Zap size={16} fill="currentColor" />
          </div>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-heading)', margin: 0, lineHeight: 1.5 }}>
            {outcome}
          </p>
        </div>
      )}

      {/* Problem & Solution */}
      <div style={{ marginBottom: '2rem', flex: 1 }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--card-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            The Challenge
          </h4>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {problem}
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            The Solution
          </h4>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {solution}
          </p>
        </div>
      </div>

      {/* Features */}
      {features.length > 0 && (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'color-mix(in srgb, var(--color-surface-alt) 50%, transparent)', borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-heading)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            Key Capabilities
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {features.map((feature, idx) => (
              <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontWeight: 500 }}>
                <CheckCircle2 size={16} color="var(--card-accent)" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                <span style={{ lineHeight: 1.5 }}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Technologies */}
      {technologies.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            Built With
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {technologies.map((tech, idx) => (
              <span key={idx} style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '0.35rem 0.8rem',
                background: 'color-mix(in srgb, var(--color-surface-alt) 80%, transparent)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: '8px',
                fontSize: '0.75rem', fontWeight: 600,
                color: 'var(--color-text-primary)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-subtle)' }}>
        {caseStudyUrl && (
          <a
            href={caseStudyUrl}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flex: 1,
              padding: '0.85rem 1.25rem', background: 'var(--color-text-heading)', color: 'var(--color-background)',
              textDecoration: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.875rem',
              textAlign: 'center', justifyContent: 'center', transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            Read Full Study <ArrowRight size={16} />
          </a>
        )}
        {demoUrl && (
          <a
            href={demoUrl}
            target={demoUrl.startsWith('#') ? undefined : "_blank"}
            rel="noreferrer"
            onClick={(e) => {
              if (demoUrl.startsWith('#')) e.preventDefault()
            }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flex: caseStudyUrl ? 'none' : 1,
              padding: '0.85rem 1.25rem', background: 'transparent',
              border: `2px solid color-mix(in srgb, var(--card-accent) 30%, transparent)`,
              color: 'var(--color-text-heading)', textDecoration: 'none',
              borderRadius: '12px', fontWeight: 700, fontSize: '0.875rem',
              textAlign: 'center', justifyContent: 'center', transition: 'all 0.2s',
              opacity: demoUrl.startsWith('#') ? 0.6 : 1,
              cursor: demoUrl.startsWith('#') ? 'default' : 'pointer',
            }}
            onMouseEnter={e => {
              if (demoUrl.startsWith('#')) return
              e.currentTarget.style.borderColor = 'var(--card-accent)'
              e.currentTarget.style.background = `color-mix(in srgb, var(--card-accent) 10%, transparent)`
            }}
            onMouseLeave={e => {
              if (demoUrl.startsWith('#')) return
              e.currentTarget.style.borderColor = `color-mix(in srgb, var(--card-accent) 30%, transparent)`
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {demoUrl.startsWith('#') ? 'Coming Soon' : 'Visit Live Site'} <ExternalLink size={16} />
          </a>
        )}
      </div>
    </motion.div>
  )
}
