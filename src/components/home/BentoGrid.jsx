import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'

// Bento Box Grid Container
export const BentoContainer = ({ children, isPrimary = false }) => (
  <div
    className="bento-grid-container"
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '1.5rem',
      gridAutoRows: 'minmax(280px, auto)',
    }}
  >
    {children}
  </div>
)

// Individual Bento Item
export const BentoItem = ({ 
  title, 
  subtitle, 
  description, 
  icon, 
  color, 
  colSpan = 4, 
  rowSpan = 1,
  delay = 0,
  children,
  align = 'start', // start, center, end
  bgMode = 'subtle' // subtle, solid, glass
}) => {
  const IconComponent = Icons[icon] || Icons.Box

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className={`bento-item col-span-${colSpan} row-span-${rowSpan}`}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align === 'center' ? 'center' : 'left',
        padding: '2.5rem',
        borderRadius: '24px',
        border: bgMode === 'solid' ? `1px solid ${color}` : '1px solid var(--color-border-subtle)',
        background: bgMode === 'solid' 
          ? `color-mix(in srgb, ${color} 8%, transparent)` 
          : bgMode === 'glass' 
            ? 'color-mix(in srgb, var(--color-surface) 60%, transparent)' 
            : 'var(--color-surface)',
        backdropFilter: bgMode === 'glass' ? 'blur(12px)' : 'none',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: bgMode === 'solid' ? `0 8px 32px color-mix(in srgb, ${color} 10%, transparent)` : 'var(--shadow-sm)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'default'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = bgMode === 'solid' 
          ? `0 16px 48px color-mix(in srgb, ${color} 15%, transparent)` 
          : 'var(--shadow-md)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = bgMode === 'solid' 
          ? `0 8px 32px color-mix(in srgb, ${color} 10%, transparent)` 
          : 'var(--shadow-sm)'
      }}
    >
      {/* Decorative background glow for solid mode */}
      {bgMode === 'solid' && (
        <div 
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: `radial-gradient(circle at center, color-mix(in srgb, ${color} 15%, transparent) 0%, transparent 60%)`,
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', height: '100%' }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            background: `color-mix(in srgb, ${color} 15%, transparent)`,
            border: `1.5px solid color-mix(in srgb, ${color} 30%, transparent)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: `0 4px 12px color-mix(in srgb, ${color} 20%, transparent)`
          }}
        >
          <IconComponent size={28} color={color} strokeWidth={1.5} />
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          {title}
        </h3>
        
        {subtitle && (
          <p style={{ fontSize: '0.9rem', color: color, fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.02em' }}>
            {subtitle}
          </p>
        )}

        <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, flex: 1, maxWidth: align === 'center' ? '90%' : '100%' }}>
          {description}
        </p>

        {children && (
          <div style={{ marginTop: '1.5rem', width: '100%' }}>
            {children}
          </div>
        )}
      </div>
    </motion.div>
  )
}
