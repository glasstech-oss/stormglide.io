import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

/**
 * VisualProcess - Visual flow diagram showing our workflow
 * Minimal text, maximum visual clarity
 */
export default function VisualProcess() {
  const { activeVariant } = useTheme()

  const steps = [
    { icon: 'MessageSquare', title: 'Discover', desc: 'Understand your needs' },
    { icon: 'Lightbulb', title: 'Design', desc: 'Build the blueprint' },
    { icon: 'Code', title: 'Build', desc: 'Create the system' },
    { icon: 'CheckCircle', title: 'Launch', desc: 'Go live' },
    { icon: 'TrendingUp', title: 'Support', desc: 'Grow together' },
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
        {/* Header */}
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
          }}>Our Process</p>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--color-text-heading)',
            margin: 0,
            lineHeight: 1.2
          }}>
            From concept to live product
          </h2>
        </motion.div>

        {/* Process flow */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          '@media (max-width: 768px)': {
            flexDirection: 'column'
          }
        }}>
          {/* Desktop: Horizontal flow with connectors */}
          <div style={{
            display: 'none',
            '@media (min-width: 769px)': {
              display: 'flex'
            }
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              width: '100%'
            }}>
              {steps.map((step, idx) => {
                const IconComponent = Icons[step.icon] || Icons.Circle
                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    {/* Step */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        flex: 1
                      }}
                    >
                      <div style={{
                        width: 72,
                        height: 72,
                        borderRadius: '18px',
                        background: `color-mix(in srgb, var(--sg-accent) 15%, transparent)`,
                        border: `2px solid color-mix(in srgb, var(--sg-accent) 30%, transparent)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--sg-accent)',
                        flexShrink: 0,
                        position: 'relative',
                        zIndex: 2
                      }}>
                        <IconComponent size={36} strokeWidth={1.5} />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <h3 style={{
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: 'var(--color-text-heading)',
                          margin: '0 0 0.4rem 0'
                        }}>
                          {step.title}
                        </h3>
                        <p style={{
                          fontSize: '0.85rem',
                          color: 'var(--color-text-secondary)',
                          margin: 0
                        }}>
                          {step.desc}
                        </p>
                      </div>
                    </motion.div>

                    {/* Connector arrow */}
                    {idx < steps.length - 1 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '1.5rem',
                        color: 'var(--sg-accent)',
                        opacity: 0.4
                      }}>
                        <Icons.ArrowRight size={24} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mobile: Vertical flow */}
          <div style={{
            display: 'flex',
            '@media (min-width: 769px)': {
              display: 'none'
            }
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              position: 'relative'
            }}>
              {/* Vertical connector line */}
              <div style={{
                position: 'absolute',
                left: 35,
                top: 0,
                bottom: 0,
                width: '2px',
                background: `color-mix(in srgb, var(--sg-accent) 20%, transparent)`,
                zIndex: 0
              }} />

              {steps.map((step, idx) => {
                const IconComponent = Icons[step.icon] || Icons.Circle
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    style={{
                      display: 'flex',
                      gap: '1.5rem',
                      marginBottom: '2.5rem',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    <div style={{
                      width: 72,
                      height: 72,
                      borderRadius: '18px',
                      background: `color-mix(in srgb, var(--sg-accent) 15%, transparent)`,
                      border: `2px solid color-mix(in srgb, var(--sg-accent) 30%, transparent)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--sg-accent)',
                      flexShrink: 0
                    }}>
                      <IconComponent size={36} strokeWidth={1.5} />
                    </div>
                    <div style={{ paddingTop: '0.75rem' }}>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: 'var(--color-text-heading)',
                        margin: '0 0 0.4rem 0'
                      }}>
                        {step.title}
                      </h3>
                      <p style={{
                        fontSize: '0.85rem',
                        color: 'var(--color-text-secondary)',
                        margin: 0
                      }}>
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: '4rem' }}
        >
          <a href="/contact" style={{
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
            boxShadow: '0 12px 32px -6px color-mix(in srgb, var(--sg-accent) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 24px 56px -8px color-mix(in srgb, var(--sg-accent) 50%, transparent), inset 0 1px 0 rgba(255,255,255,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 12px 32px -6px color-mix(in srgb, var(--sg-accent) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}>
            Start your project <Icons.ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
