import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import CountUp from '../common/CountUp'

export default function ByTheNumbers() {
  const { activeVariant } = useTheme()

  const metrics = [
    { label: 'Customers', value: '100+', icon: '👥' },
    { label: 'SaaS Products', value: '4', icon: '📦' },
    { label: 'Uptime', value: '99.9%', icon: '⚡' },
    { label: 'Years Building', value: '5+', icon: '🚀' },
  ]

  return (
    <section style={{
      padding: 'clamp(3rem, 8vw, 6rem) 2rem',
      background: activeVariant.id === 'editorial'
        ? 'color-mix(in srgb, var(--color-background) 98%, var(--sg-accent) 2%)'
        : 'var(--bg-soft)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <p style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--sg-accent)',
            marginBottom: '1rem'
          }}>By The Numbers</p>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--color-text-heading)',
            margin: 0,
            lineHeight: 1.2
          }}>
            Proven at scale
          </h2>
        </motion.div>

        {/* Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'clamp(1.5rem, 4vw, 2.5rem)',
          marginTop: '2rem'
        }}>
          {metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                textAlign: 'center',
                padding: '2rem 1.5rem',
                borderRadius: '20px',
                background: activeVariant.id === 'editorial'
                  ? 'color-mix(in srgb, var(--color-surface) 60%, var(--sg-accent) 1%)'
                  : 'color-mix(in srgb, var(--color-surface) 50%, transparent)',
                border: `1px solid color-mix(in srgb, var(--sg-accent) 15%, transparent)`,
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.borderColor = `color-mix(in srgb, var(--sg-accent) 35%, transparent)`
                e.currentTarget.style.boxShadow = `0 20px 40px -8px color-mix(in srgb, var(--sg-accent) 12%, transparent)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = `color-mix(in srgb, var(--sg-accent) 15%, transparent)`
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                lineHeight: 1,
                marginBottom: '0.5rem'
              }}>
                {metric.icon}
              </div>
              <div style={{
                fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                fontWeight: 700,
                color: 'var(--sg-accent)',
                lineHeight: 1,
                margin: 0
              }}>
                <CountUp value={metric.value} />
              </div>
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--color-text-secondary)',
                margin: 0,
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}>
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
