import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

/**
 * VisualProblems - Icon grid showing challenges visually
 * Minimal text, maximum impact across all three theme layers
 */
export default function VisualProblems() {
  const { activeVariant } = useTheme()

  const problems = [
    { icon: 'FileText', label: 'Paper records' },
    { icon: 'MessageCircle', label: 'Scattered data' },
    { icon: 'Database', label: 'No visibility' },
    { icon: 'BarChart3', label: 'Manual reports' },
    { icon: 'Users', label: 'Coordination chaos' },
    { icon: 'AlertCircle', label: 'Error-prone' },
    { icon: 'Clock', label: 'Slow processes' },
    { icon: 'Zap', label: 'Low efficiency' },
  ]

  return (
    <section style={{
      padding: 'var(--section-padding) 2rem',
      background: activeVariant.id === 'editorial'
        ? 'color-mix(in srgb, var(--color-background) 98%, var(--sg-accent) 2%)'
        : 'var(--bg-soft)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Minimal section intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <p style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--sg-accent)',
            marginBottom: '1rem'
          }}>The Reality</p>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--color-text-heading)',
            margin: '0 0 1rem 0',
            lineHeight: 1.2
          }}>
            Most African businesses still operate manually
          </h2>
        </motion.div>

        {/* Visual icon grid - NO descriptions, just icons + labels */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 'clamp(1.5rem, 4vw, 2rem)',
          marginBottom: '4rem'
        }}>
          {problems.map((item, idx) => {
            const IconComponent = Icons[item.icon] || Icons.AlertCircle
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.5 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  borderRadius: '20px',
                  background: activeVariant.id === 'editorial'
                    ? 'color-mix(in srgb, var(--color-surface) 60%, var(--sg-accent) 1%)'
                    : 'color-mix(in srgb, var(--color-surface) 50%, transparent)',
                  border: `1px solid color-mix(in srgb, var(--sg-accent) 15%, transparent)`,
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)'
                  e.currentTarget.style.borderColor = `color-mix(in srgb, var(--sg-accent) 35%, transparent)`
                  e.currentTarget.style.boxShadow = `0 20px 40px -8px color-mix(in srgb, var(--sg-accent) 12%, transparent)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.borderColor = `color-mix(in srgb, var(--sg-accent) 15%, transparent)`
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  background: `color-mix(in srgb, var(--sg-accent) 12%, transparent)`,
                  border: `2px solid color-mix(in srgb, var(--sg-accent) 25%, transparent)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sg-accent)',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  <IconComponent size={32} strokeWidth={1.5} />
                </div>
                <p style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--color-text-heading)',
                  margin: 0,
                  lineHeight: 1.4
                }}>
                  {item.label}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* CTA - minimal, visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ textAlign: 'center' }}
        >
          <a href="/solutions" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 2rem',
            background: 'var(--sg-accent)',
            color: 'var(--color-background)',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '0.95rem',
            textDecoration: 'none',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 12px 32px -6px color-mix(in srgb, var(--sg-accent) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 24px 56px -8px color-mix(in srgb, var(--sg-accent) 50%, transparent), inset 0 1px 0 rgba(255,255,255,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 12px 32px -6px color-mix(in srgb, var(--sg-accent) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}>
            Get Solutions <Icons.ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
