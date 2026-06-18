import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { problems } from '../../data/problems'
import SectionHeader from '../common/SectionHeader'
import { useRef, useState, useEffect } from 'react'

function ProblemCard({ item, idx, IconComponent }) {
  const cardRef = useRef(null)
  const [isCentered, setIsCentered] = useState(false)

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches
    if (!isMobile || !cardRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCentered(entry.isIntersecting)
      },
      {
        root: null,
        rootMargin: '-30% -30% -30% -30%',
        threshold: 0
      }
    )

    observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`sg-problem-card ${isCentered ? 'is-active' : ''}`}
      style={{
        background: 'color-mix(in srgb, var(--color-surface) 80%, transparent)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: '24px',
        padding: '1.75rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'default'
      }}
    >
      <div
        className="sg-problem-icon-wrap"
        style={{
          width: 48,
          height: 48,
          borderRadius: '14px',
          background: 'color-mix(in srgb, var(--sg-accent) 10%, transparent)',
          border: '1px solid color-mix(in srgb, var(--sg-accent) 20%, transparent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          color: 'var(--sg-accent)'
        }}
      >
        <IconComponent size={22} strokeWidth={1.75} className="sg-problem-icon" />
      </div>
      <div style={{ flex: 1, marginTop: '0.2rem' }}>
        <p
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--color-text-heading)',
            lineHeight: 1.5,
            margin: 0
          }}
        >
          {item.problem}
        </p>
      </div>
    </motion.div>
  )
}

/**
 * ProblemRecognition - Premium redesign of the problem statement section
 */
export default function ProblemRecognition() {
  return (
    <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height: '40vw',
        background: 'radial-gradient(ellipse at center, color-mix(in srgb, var(--sg-accent) 6%, transparent) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionHeader
          label="THE CHALLENGE"
          title="Many African businesses still run operations on paper, Excel, WhatsApp and scattered records."
          description="Do any of these operational bottlenecks sound familiar?"
          alignment="center"
          maxWidth="750px"
        />

        <div className="sg-problem-grid" style={{ marginTop: '5rem' }}>
          {problems.map((item, idx) => {
            const IconComponent = Icons[item.icon] || Icons.CheckCircle2
            return (
              <ProblemCard key={idx} item={item} idx={idx} IconComponent={IconComponent} />
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="sg-solution-banner"
          style={{
            marginTop: '4rem',
            textAlign: 'center',
            padding: '3.5rem 2rem',
            borderRadius: '32px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem'
          }}
        >
          {/* Banner inner glow */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--sg-accent) 15%, transparent) 0%, transparent 100%)',
            zIndex: 0
          }} />
          
          <h3
            style={{
              position: 'relative', zIndex: 1,
              color: 'var(--color-text-heading)',
              fontSize: '1.5rem',
              fontWeight: 700,
              maxWidth: '700px',
              margin: 0,
              lineHeight: 1.4,
              letterSpacing: '-0.02em'
            }}
          >
            StormGlide converts these scattered, manual processes into connected digital systems that give you <span style={{ color: 'var(--sg-accent)' }}>visibility, speed, and control.</span>
          </h3>
          
          <a
            href="/solutions"
            className="sg-solution-btn"
            style={{
              position: 'relative', zIndex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.75rem',
              background: 'var(--color-text-heading)',
              color: 'var(--color-background)',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 8px 24px color-mix(in srgb, var(--color-background) 30%, transparent)'
            }}
          >
            Explore solutions for your business <Icons.ArrowRight size={18} />
          </a>
        </motion.div>
      </div>

      <style>{`
        .sg-problem-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        @media (max-width: 920px) {
          .sg-problem-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-padding: 0 2rem;
            gap: 1rem;
            padding-bottom: 2rem;
            margin: 0 -2rem;
            padding-left: 2rem;
            padding-right: 2rem;
            scrollbar-width: none; 
          }
          .sg-problem-grid::-webkit-scrollbar {
            display: none;
          }
          .sg-problem-grid > * {
            scroll-snap-align: center;
            flex: 0 0 85%;
            min-width: 0;
          }
        }

        .sg-problem-card:hover, .sg-problem-card.is-active {
          transform: translateY(-6px) scale(1.01) !important;
          box-shadow: 0 20px 40px -10px color-mix(in srgb, var(--sg-accent) 15%, transparent);
          border-color: color-mix(in srgb, var(--sg-accent) 30%, transparent) !important;
        }
        .sg-problem-card:hover .sg-problem-icon-wrap, .sg-problem-card.is-active .sg-problem-icon-wrap {
          background: var(--sg-accent) !important;
          color: var(--color-background) !important;
          transform: scale(1.1) rotate(-5deg);
          box-shadow: 0 8px 16px color-mix(in srgb, var(--sg-accent) 30%, transparent);
        }
        .sg-solution-banner {
          background: color-mix(in srgb, var(--color-surface) 90%, transparent);
          border: 1px solid color-mix(in srgb, var(--sg-accent) 25%, transparent);
          box-shadow: 0 24px 48px -12px color-mix(in srgb, var(--sg-accent) 10%, transparent);
        }
        .sg-solution-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px color-mix(in srgb, var(--color-background) 40%, transparent);
          gap: 0.75rem !important;
        }
      `}</style>
    </section>
  )
}
