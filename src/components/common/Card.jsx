import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

/**
 * Card - Flexible card component for various use cases
 * Can display icon, title, description, features, and CTA
 */
export default function Card({
  icon: IconComponent,
  title,
  description,
  features = [],
  color = 'var(--sg-accent)',
  onClick,
  href,
  ctaText = 'Learn more',
  showMotion = true,
  variant = 'default', // 'default', 'service', 'solution'
  delay = 0,
}) {
  const Container = showMotion ? motion.div : 'div'
  const containerProps = showMotion
    ? {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { delay },
      }
    : {}

  const content = (
    <>
      {IconComponent && (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: `${color}15`,
            border: `1.5px solid ${color}28`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: variant === 'service' ? '1.25rem' : '1rem',
            flexShrink: 0,
          }}
        >
          <IconComponent size={22} color={color} strokeWidth={1.5} />
        </div>
      )}

      {title && (
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
            color: 'var(--color-text-heading)',
          }}
        >
          {title}
        </h3>
      )}

      {description && (
        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.65,
            marginBottom: features.length > 0 ? '1rem' : '0',
          }}
        >
          {description}
        </p>
      )}

      {features.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '1rem 0 0 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {features.map((feature, idx) => (
            <li
              key={idx}
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}
            >
              <span style={{ color, marginTop: '0.2rem', flexShrink: 0 }}>•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {(onClick || href) && (
        <div style={{ marginTop: '1.25rem' }}>
          {href ? (
            <a
              href={href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: color,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              {ctaText} <ArrowRight size={16} />
            </a>
          ) : (
            <button
              onClick={onClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: color,
                color: 'var(--color-text-heading)',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '0.9'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {ctaText} <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}
    </>
  )

  return (
    <Container
      {...containerProps}
      className="card"
      style={{
        padding: variant === 'service' ? '2rem' : '1.75rem',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {content}
    </Container>
  )
}
