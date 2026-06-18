import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    // Wait for the animation to finish + a little breathing room, then dismiss
    const timer = setTimeout(() => {
      onComplete()
    }, 2800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--color-background)', // Use the theme background
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem'
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
      >
        <svg viewBox="0 0 16 24" height="96" style={{ display: 'block', color: 'var(--color-text-heading)' }}>
          {/* Top Left Square */}
          <motion.rect 
            x="4" y="0" width="6" height="6" fill="currentColor" 
            initial={{ y: -30, opacity: 0, scale: 0.5 }} 
            animate={{ y: 0, opacity: 1, scale: 1 }} 
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }} 
          />
          {/* Top Right Accent Bar */}
          <motion.rect 
            x="12" y="0" width="4" height="7" fill="var(--sg-accent)" 
            initial={{ x: 30, opacity: 0, scale: 0.5 }} 
            animate={{ x: 0, opacity: 1, scale: 1 }} 
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }} 
          />
          {/* Bottom Left Main Shape */}
          <motion.path 
            d="M0 10 H10 V24 H4 V16 H0 Z" fill="currentColor" 
            initial={{ y: 30, opacity: 0, scale: 0.5 }} 
            animate={{ y: 0, opacity: 1, scale: 1 }} 
            transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }} 
          />
          {/* Bottom Right Bar */}
          <motion.rect 
            x="12" y="10" width="4" height="7" fill="currentColor" 
            initial={{ x: 30, opacity: 0, scale: 0.5 }} 
            animate={{ x: 0, opacity: 1, scale: 1 }} 
            transition={{ delay: 0.7, type: 'spring', stiffness: 200, damping: 20 }} 
          />
        </svg>
        
        {/* Text Logo */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            fontFamily: "var(--font-display)", 
            fontWeight: 800, 
            fontSize: '3rem', 
            letterSpacing: '-0.04em', 
            color: 'var(--color-text-heading)',
            display: 'flex',
            alignItems: 'baseline'
          }}
        >
          stormglide.
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            ı
            <span style={{ 
              position: 'absolute', top: '0.2em', left: '50%', transform: 'translateX(-50%)',
              width: '0.23em', height: '0.23em', backgroundColor: 'var(--sg-accent)', borderRadius: '1.5px' 
            }}></span>
          </span>
          o
        </motion.div>
      </motion.div>

      {/* Decorative ambient glow behind the logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1.5 }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, color-mix(in srgb, var(--sg-accent) 15%, transparent) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: -1
        }}
      />
    </motion.div>
  )
}
