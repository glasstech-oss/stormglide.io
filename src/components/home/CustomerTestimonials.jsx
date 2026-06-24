import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function CustomerTestimonials() {
  const { activeVariant } = useTheme()

  const testimonials = [
    {
      quote: "CargoScan transformed how we manage logistics. What used to take 2 hours in Excel now takes 10 minutes. Our team actually uses the system without complaints.",
      author: "Operations Director",
      company: "Major Logistics Company",
      role: "Logistics",
      rating: 5
    },
    {
      quote: "We replaced 3 different systems with StormGlide's custom solution. It's the first system I've seen that actually understands how African supply chains work.",
      author: "CEO",
      company: "Manufacturing Business",
      role: "Manufacturing",
      rating: 5
    },
    {
      quote: "The level of support is incredible. When we needed custom features, they built them without making us wait 6 months. This is what enterprise software should be.",
      author: "Business Manager",
      company: "E-commerce Retailer",
      role: "E-commerce",
      rating: 5
    },
    {
      quote: "SANO helped us understand customer data better than any tool we've tried. The health insights are accurate and the interface is intuitive for non-technical team members.",
      author: "Health Director",
      company: "Healthcare Provider",
      role: "Healthcare",
      rating: 5
    }
  ]

  return (
    <section style={{
      padding: 'clamp(4rem, 10vw, 8rem) 2rem',
      background: activeVariant.id === 'editorial'
        ? 'color-mix(in srgb, var(--color-background) 98%, var(--sg-accent) 2%)'
        : 'var(--bg-soft)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
          }}>What Customers Say</p>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--color-text-heading)',
            margin: '0 0 1rem 0',
            lineHeight: 1.2
          }}>
            Trusted by African businesses
          </h2>
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            See how our customers are transforming their operations
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(1.5rem, 4vw, 2rem)',
          marginTop: '2rem'
        }}>
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              style={{
                padding: '2rem',
                borderRadius: '24px',
                background: activeVariant.id === 'editorial'
                  ? 'color-mix(in srgb, var(--color-surface) 60%, var(--sg-accent) 1%)'
                  : 'color-mix(in srgb, var(--color-surface) 50%, transparent)',
                border: `1.5px solid color-mix(in srgb, var(--sg-accent) 15%, transparent)`,
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px)'
                e.currentTarget.style.borderColor = `color-mix(in srgb, var(--sg-accent) 40%, transparent)`
                e.currentTarget.style.boxShadow = `0 24px 48px -8px color-mix(in srgb, var(--sg-accent) 15%, transparent)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = `color-mix(in srgb, var(--sg-accent) 15%, transparent)`
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Rating */}
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill="var(--sg-accent)"
                    color="var(--sg-accent)"
                  />
                ))}
              </div>

              {/* Quote */}
              <p style={{
                fontSize: '1rem',
                lineHeight: 1.6,
                color: 'var(--color-text-primary)',
                fontStyle: 'italic',
                margin: 0,
                flex: 1
              }}>
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div style={{ borderTop: `1px solid color-mix(in srgb, var(--sg-accent) 15%, transparent)`, paddingTop: '1.5rem' }}>
                <p style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--color-text-heading)',
                  margin: '0 0 0.25rem 0'
                }}>
                  {testimonial.author}
                </p>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-secondary)',
                  margin: '0 0 0.5rem 0'
                }}>
                  {testimonial.company}
                </p>
                <span style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '99px',
                  background: `color-mix(in srgb, var(--sg-accent) 12%, transparent)`,
                  color: 'var(--sg-accent)'
                }}>
                  {testimonial.role}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: '4rem' }}
        >
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '2rem'
          }}>
            Ready to join successful African businesses improving their operations?
          </p>
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
            Get Started Now →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
