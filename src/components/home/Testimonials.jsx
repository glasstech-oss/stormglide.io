import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { testimonials } from '../../data/testimonials'

/**
 * Testimonials - Editorial layout, massive pull quotes, no boxes.
 */
export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 8000) // 8 seconds per quote
    return () => clearInterval(timer)
  }, [])

  const current = testimonials[currentIndex]

  return (
    <section style={{ padding: '8rem 2rem', background: 'var(--color-surface)', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', position: 'relative' }}>
        
        {/* Editorial Section Label */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          color: 'var(--sg-accent)',
          textTransform: 'uppercase',
          marginBottom: '4rem',
          fontWeight: 700
        }}>
          / Client Voices
        </div>

        <div style={{ minHeight: '320px', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, filter: 'blur(8px)', y: 15 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(8px)', y: -15 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
            >
              {/* Massive typographic quote */}
              <h2 style={{
                fontFamily: "var(--font-display), 'Arial Narrow', sans-serif",
                fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                lineHeight: 1.05,
                color: 'var(--color-text-heading)',
                margin: '0 0 3rem 0',
                letterSpacing: '-0.01em',
                maxWidth: '900px',
                textIndent: '-0.4em'
              }}>
                "{current.quote}"
              </h2>

              {/* Author Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '40px', height: '1px', background: 'var(--sg-accent)' }} />
                <div>
                  <p style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'var(--color-text-heading)',
                    margin: '0 0 0.2rem 0',
                  }}>
                    {current.author}
                  </p>
                  <p style={{
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                    letterSpacing: '0.05em'
                  }}>
                    {current.company}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Custom Progress Indicators */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '4rem' }}>
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: idx === currentIndex ? '32px' : '8px',
                height: '2px',
                background: idx === currentIndex ? 'var(--sg-accent)' : 'var(--color-border-subtle)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              aria-label={`View testimonial ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
