import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import SectionHeader from '../common/SectionHeader'
import { testimonials } from '../../data/testimonials'

/**
 * Testimonials - Real client voices build credibility
 */
export default function Testimonials() {
  return (
    <section style={{ padding: 'var(--section-padding) 2rem', background: 'var(--bg-white)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <SectionHeader
          label="CLIENT VOICES"
          title="What our clients say"
          alignment="center"
          maxWidth="640px"
        />

        <div
          style={{
            marginTop: '4rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
            gap: '2rem',
          }}
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="card sg-testimonial-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '2rem',
              }}
            >
              {/* Stars */}
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem' }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--amber)" color="var(--amber)" />
                ))}
              </div>

              {/* Quote */}
              <p
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.75,
                  marginBottom: '1.5rem',
                  flex: 1,
                  fontStyle: 'italic',
                }}
              >
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem' }}>
                <p
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--color-text-heading)',
                    margin: '0 0 0.25rem 0',
                  }}
                >
                  {testimonial.author}
                </p>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                  }}
                >
                  {testimonial.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
