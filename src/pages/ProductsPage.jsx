import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Heart, Package, Factory, Layers, CheckCircle2, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import { getProductPath, products } from '../data/products'
import { useLenis } from '../lib/useLenis'
import { handleViewTransitionClick, useViewTransitionNavigate } from '../lib/viewTransition'

// real interface shots on the product cards — the products page was the one
// page describing software without showing any
const PRODUCT_SHOTS = {
  'nexus-hrm': '/images/mockups/webapp.webp',
  sano: '/images/mockups/mobile.webp',
  'nexus-dental': '/images/mockups/dental.webp',
  cargoscan: '/images/mockups/website.webp',
}

const ICONS = { Users, Heart, Package, Factory, Layers, Stethoscope }

function ProductCard({ product, i }) {
  const Icon = ICONS[product.icon]
  const shot = PRODUCT_SHOTS[product.id]
  const vtNavigate = useViewTransitionNavigate()
  const path = getProductPath(product.id)
  return (
    <motion.div
      className="product-track-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.07 }}
    >
      <Link
        to={path}
        onClick={e => handleViewTransitionClick(e, vtNavigate, path, { name: 'depth' })}
        style={{ display: 'block', textDecoration: 'none', height: '100%' }}
      >
        <div style={{
          background: 'var(--glass-bg)', border: '1.5px solid var(--color-border-subtle)',
          borderRadius: 'var(--border-radius-lg)', padding: '2rem', height: '100%',
          boxShadow: '0 1px 4px rgba(15,23,42,0.04)', transition: 'all 0.25s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = product.color + '50'; e.currentTarget.style.boxShadow = `0 8px 40px ${product.color}12`; e.currentTarget.style.transform = 'translateY(-3px)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(15,23,42,0.04)'; e.currentTarget.style.transform = 'none' }}
        >
          <div style={{ margin: '-2rem -2rem 1.5rem', borderBottom: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg) var(--border-radius-lg) 0 0', overflow: 'hidden', aspectRatio: '16 / 8', background: shot ? 'color-mix(in srgb, var(--color-text-heading) 4%, transparent)' : `linear-gradient(135deg, ${product.color}18, ${product.color}05)` }}>
            {shot ? (
              <img
                src={shot}
                alt={`${product.name} interface`}
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
              />
            ) : (
              // No interface shot for this product yet — an honest placeholder
              // (product color + icon), not a stand-in screenshot, so the
              // horizontal track's card heights stay consistent either way.
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={40} color={product.color} strokeWidth={1.5} style={{ opacity: 0.5 }} />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '13px', background: `${product.color}12`, border: `1.5px solid ${product.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={22} color={product.color} />
            </div>
            <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', padding: '0.2rem 0.55rem', borderRadius: '99px', background: product.status === 'live' ? 'color-mix(in srgb, var(--color-success) 10%, transparent)' : 'color-mix(in srgb, var(--color-warning) 10%, transparent)', color: product.status === 'live' ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', border: `1px solid ${product.status === 'live' ? 'color-mix(in srgb, var(--color-success) 20%, transparent)' : 'color-mix(in srgb, var(--color-warning) 20%, transparent)'}` }}>{product.status}</span>
          </div>

          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.375rem' }}>{product.name}</h2>
          <p style={{ fontSize: '0.82rem', color: product.color, fontWeight: 500, marginBottom: '0.875rem' }}>{product.tagline}</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.72, marginBottom: '1.5rem' }}>{product.description}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {product.features.slice(0, 4).map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                <CheckCircle2 size={13} color={product.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                {f}
              </div>
            ))}
            {product.features.length > 4 && (
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', paddingLeft: '1.375rem' }}>+{product.features.length - 4} more</div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {product.tech.map(t => (
              <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', padding: '0.2rem 0.55rem', borderRadius: '6px', background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-secondary)' }}>{t}</span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: product.color, fontSize: '0.85rem', fontWeight: 600 }}>
            View full product <ArrowRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function ProductsPage() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useLenis('/products', (scroller, { gsap, ScrollTrigger }) =>
    gsap.context(() => {
      // Horizontal card track, pinned + scrubbed — side-by-side motion helps
      // comparison here the way it doesn't for a plain vertical list. Desktop
      // board only (see useLenis.js); mobile/narrow keeps a normal stack via
      // the CSS override in the <style> block below, so this branch simply
      // doesn't run there.
      const mm = gsap.matchMedia()
      mm.add('(min-width: 920px)', () => {
        const track = trackRef.current
        const section = sectionRef.current
        if (!track || !section) return undefined

        const getDistance = () => Math.max(track.scrollWidth - track.parentElement.clientWidth, 0)

        const st = ScrollTrigger.create({
          trigger: section,
          scroller,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          animation: gsap.to(track, { x: () => -getDistance(), ease: 'none' }),
        })

        return () => st.kill()
      })
    }),
  )

  return (
    <PageLayout>
      {/* Page header */}
      <div style={{ borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface)', padding: '4rem 2rem 3rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="section-label">OUR PRODUCTS</div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '1rem', maxWidth: '600px' }}>
              Software built for African businesses — and already running
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', maxWidth: '520px', lineHeight: 1.75 }}>
              Six products across HR, health, logistics, and manufacturing — each solving a real problem we saw first-hand.
            </p>
            <Link to="/work" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginTop: '1rem', color: 'var(--sg-accent)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
              Want to try them live, or see real client systems? Visit our Work page <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Products track — horizontal on desktop (pinned + scrubbed), a plain
          stack on mobile/narrow (see .products-track media query below). */}
      <div ref={sectionRef} className="products-track-section">
        <div ref={trackRef} className="products-track">
          {products.map((product, i) => <ProductCard key={product.id} product={product} i={i} />)}
        </div>
      </div>

      <div style={{ padding: '3rem 2rem 6rem', maxWidth: '1280px', margin: '0 auto' }}>
        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ padding: '3rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>Need something that doesn't exist yet?</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>We also build fully custom systems from the ground up — tailored exactly to how your business operates.</p>
          <Link to="/contact" className="btn-primary" style={{ textDecoration: 'none', gap: '0.5rem' }}>
            Start a custom project <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>

      <style>{`
        .products-track-section {
          overflow: hidden;
          padding: 1rem 0 4rem;
        }
        .products-track {
          display: flex;
          align-items: stretch;
          gap: 1.5rem;
          width: max-content;
          padding: 0 2rem;
        }
        .product-track-card {
          width: min(85vw, 420px);
          flex-shrink: 0;
        }
        @media (max-width: 919px) {
          .products-track-section { overflow: visible; padding: 0; }
          .products-track {
            display: grid !important;
            grid-template-columns: 1fr;
            width: 100% !important;
            max-width: 1280px;
            margin: 0 auto;
            gap: 1.25rem;
            padding: 4rem 2rem 2rem;
            transform: none !important;
          }
          .product-track-card { width: 100% !important; }
        }
        @media (min-width: 640px) and (max-width: 919px) {
          .products-track {
            grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          }
        }
      `}</style>
    </PageLayout>
  )
}
