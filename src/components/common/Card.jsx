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
        initial: { opacity: 0, y: 28, rotateX: 8, transformPerspective: 900 },
        whileInView: { opacity: 1, y: 0, rotateX: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { delay, duration: 0.6, ease: [0.32, 0.72, 0, 1] },
      }
    : {}

  const content = (
    <>
      {IconComponent && (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            background: `${color}20`,
            border: `1px solid ${color}38`,
            backdropFilter: 'blur(14px) saturate(160%)',
            WebkitBackdropFilter: 'blur(14px) saturate(160%)',
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25)`,
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
                background: `${color}26`,
                border: `1px solid ${color}55`,
                backdropFilter: 'blur(14px) saturate(160%)',
                WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22)',
                color: 'var(--color-text-heading)',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.filter = 'brightness(1.15)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.filter = 'none'
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
