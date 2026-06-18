import { motion } from 'framer-motion'

/**
 * SectionHeader - Standardized section label + heading + description pattern
 * Used across all major sections for consistency
 */
export default function SectionHeader({
  label,
  title,
  description,
  alignment = 'left',
  color = 'blue',
  maxWidth = '640px',
  showMotion = true,
}) {
  const Container = showMotion ? motion.div : 'div'
  const containerProps = showMotion
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
      }
    : {}

  return (
    <Container
      {...containerProps}
      style={{
        textAlign: alignment,
        margin: alignment === 'center' ? '0 auto' : undefined,
        maxWidth,
      }}
    >
      {label && (
        <div
          className="section-label"
          style={{ justifyContent: alignment === 'center' ? 'center' : 'flex-start', marginBottom: '1.125rem' }}
        >
          {label}
        </div>
      )}
      {title && (
        <h2
          style={{
            fontSize: 'clamp(1.6rem, 5vw, 2.875rem)',
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>
      )}
      {description && (
        <p
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: '1rem',
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          {description}
        </p>
      )}
    </Container>
  )
}
