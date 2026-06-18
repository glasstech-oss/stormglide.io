import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * FinalCTA - Strong final call-to-action before footer
 */
export default function FinalCTA() {
  return (
    <section
      style={{
        padding: 'var(--section-padding) 2rem',
        background: 'linear-gradient(135deg, #060E21 0%, var(--color-surface) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, color-mix(in srgb, var(--sg-accent) 8%, transparent) 0%, transparent 65%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            left: '-5%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, color-mix(in srgb, var(--color-success) 6%, transparent) 0%, transparent 65%)',
          }}
        />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.875rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
            color: 'var(--color-text-heading)',
            lineHeight: 1.2,
          }}
        >
          Let’s build your business system.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: '1.05rem',
            color: 'color-mix(in srgb, var(--color-text-heading) 75%, transparent)',
            lineHeight: 1.75,
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem',
          }}
        >
          Stop running operations on paper, spreadsheets, and scattered tools. Let's discuss your workflows and build a system that works exactly how you need it to.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            to="/contact"
            className="btn-primary"
            style={{
              textDecoration: 'none',
              gap: '0.5rem',
            }}
          >
            Discuss Your Project <ArrowRight size={16} />
          </Link>
          <a
            href="mailto:hello@stormglide.tech"
            className="btn-secondary"
            style={{
              textDecoration: 'none',
            }}
          >
            Send Us a Message
          </a>
        </motion.div>
      </div>
    </section>
  )
}
