import { motion } from 'framer-motion'
import { ArrowRight, Users, Heart, Package, Factory, Layers, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import { products } from '../data/products'
import { Helmet } from 'react-helmet-async'

const ICONS = { Users, Heart, Package, Factory, Layers }

export default function ProductsPage() {
  return (
    <PageLayout>
      <Helmet>
        <title>Products — Stormglide Technologies</title>
        <meta name="description" content="Nexus HRM, CargoScan, Nexus MFG, SANO Health, and Glasstech — production-ready business software built for Africa." />
        <meta property="og:title" content="Products — Stormglide Technologies" />
        <meta property="og:description" content="Nexus HRM, CargoScan, Nexus MFG — production-ready business software running across Africa." />
        <meta property="og:image" content="https://stormglide.vercel.app/og-image.svg" />
        <meta property="og:url" content="https://stormglide.vercel.app/products" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://stormglide.vercel.app/og-image.svg" />
        <link rel="canonical" href="https://stormglide.vercel.app/products" />
      </Helmet>
      {/* Page header */}
      <div style={{ borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface)', padding: '4rem 2rem 3rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="section-label">OUR PRODUCTS</div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '1rem', maxWidth: '600px' }}>
              Software built for African businesses — and already running
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', maxWidth: '520px', lineHeight: 1.75 }}>
              Five products across HR, health, logistics, and manufacturing. Each one was built to solve a real problem we saw businesses in Africa struggling with.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Products grid */}
      <div style={{ padding: '4rem 2rem 6rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {products.map((product, i) => {
            const Icon = ICONS[product.icon]
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link to={`/products/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--color-background)', border: '1.5px solid var(--color-border-subtle)',
                    borderRadius: 'var(--border-radius-lg)', padding: '2rem', height: '100%',
                    boxShadow: '0 1px 4px rgba(15,23,42,0.04)', transition: 'all 0.25s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = product.color + '50'; e.currentTarget.style.boxShadow = `0 8px 40px ${product.color}12`; e.currentTarget.style.transform = 'translateY(-3px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(15,23,42,0.04)'; e.currentTarget.style.transform = 'none' }}
                  >
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
          })}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginTop: '4rem', padding: '3rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>Need something that doesn't exist yet?</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>We also build fully custom systems from the ground up — tailored exactly to how your business operates.</p>
          <Link to="/contact" className="btn-primary" style={{ textDecoration: 'none', gap: '0.5rem' }}>
            Start a custom project <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </PageLayout>
  )
}
