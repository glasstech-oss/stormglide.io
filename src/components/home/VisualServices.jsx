import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

/**
 * VisualServices - Icon grid showing what we do
 * No long descriptions - just icons, titles, and links
 */
export default function VisualServices() {
  const { activeVariant } = useTheme()

  const services = [
    {
      icon: 'Globe',
      title: 'Web Apps',
      href: '/services/web-app-development-ghana'
    },
    {
      icon: 'Smartphone',
      title: 'Mobile Apps',
      href: '/services/mobile-app-development-ghana'
    },
    {
      icon: 'Palette',
      title: 'Design',
      href: '/services/design-services-ghana'
    },
    {
      icon: 'Zap',
      title: 'Automation',
      href: '/services'
    },
    {
      icon: 'Layout',
      title: 'Websites',
      href: '/services/website-development-ghana'
    },
    {
      icon: 'Layers',
      title: 'Custom SaaS',
      href: '/services'
    },
  ]

  return (
    <section style={{
      padding: 'var(--section-padding) 2rem',
      background: 'var(--color-background)',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Minimal header */}
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
          }}>What We Build</p>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--color-text-heading)',
            margin: 0,
            lineHeight: 1.2
          }}>
            Full-stack digital solutions
          </h2>
        </motion.div>

        {/* Service grid - Icon + Title only */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '2.5rem',
          marginBottom: '4rem'
        }}>
          {services.map((service, idx) => {
            const IconComponent = Icons[service.icon] || Icons.Box
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.5 }}
                as={Link}
                to={service.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  borderRadius: '24px',
                  background: activeVariant.id === 'editorial'
                    ? 'color-mix(in srgb, var(--color-surface) 50%, transparent)'
                    : 'color-mix(in srgb, var(--color-surface) 40%, transparent)',
                  border: `1.5px solid color-mix(in srgb, var(--sg-accent) 12%, transparent)`,
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.08)'
                  e.currentTarget.style.borderColor = `color-mix(in srgb, var(--sg-accent) 40%, transparent)`
                  e.currentTarget.style.boxShadow = `0 24px 48px -8px color-mix(in srgb, var(--sg-accent) 15%, transparent)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.borderColor = `color-mix(in srgb, var(--sg-accent) 12%, transparent)`
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '18px',
                  background: `color-mix(in srgb, var(--sg-accent) 15%, transparent)`,
                  border: `2px solid color-mix(in srgb, var(--sg-accent) 30%, transparent)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sg-accent)',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  <IconComponent size={40} strokeWidth={1.3} />
                </div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--color-text-heading)',
                  margin: 0,
                  lineHeight: 1.3
                }}>
                  {service.title}
                </h3>
              </motion.div>
            )
          })}
        </div>

        {/* All services link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ textAlign: 'center' }}
        >
          <Link to="/services" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 2rem',
            background: 'var(--color-surface)',
            border: `2px solid color-mix(in srgb, var(--sg-accent) 30%, transparent)`,
            color: 'var(--color-text-heading)',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '0.95rem',
            textDecoration: 'none',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `color-mix(in srgb, var(--sg-accent) 60%, transparent)`
            e.currentTarget.style.background = 'var(--color-surface)'
            e.currentTarget.style.color = 'var(--sg-accent)'
            e.currentTarget.style.transform = 'translateY(-3px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `color-mix(in srgb, var(--sg-accent) 30%, transparent)`
            e.currentTarget.style.background = 'var(--color-surface)'
            e.currentTarget.style.color = 'var(--color-text-heading)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}>
            Explore all services <Icons.ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
