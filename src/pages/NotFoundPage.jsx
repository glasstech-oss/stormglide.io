import { motion } from 'framer-motion'
import { ArrowRight, Home, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found · Stormglide Technologies</title>
      </Helmet>
      <Navbar />
      <main style={{
        minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '6rem 2rem', background: 'var(--bg-white)', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background blobs */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(ellipse, color-mix(in srgb, var(--sg-accent) 7%, transparent) 0%, transparent 65%)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(ellipse, color-mix(in srgb, var(--color-success) 5%, transparent) 0%, transparent 65%)' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', maxWidth: '520px', position: 'relative' }}
        >
          {/* Code chip */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
            background: 'color-mix(in srgb, var(--sg-accent) 7%, transparent)', border: '1px solid color-mix(in srgb, var(--sg-accent) 18%, transparent)',
            borderRadius: '99px', padding: '0.3rem 1rem', marginBottom: '2rem',
            color: 'var(--blue)', letterSpacing: '0.1em', fontWeight: 600,
          }}>
            <Zap size={13} color="var(--blue)" />
            ERROR 404
          </div>

          {/* Giant 404 */}
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(6rem, 20vw, 10rem)',
            fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 0.9,
            background: 'linear-gradient(135deg, var(--blue) 0%, var(--violet) 55%, var(--color-success) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginBottom: '1.5rem',
          }}>
            404
          </div>

          <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', letterSpacing: '-0.025em', marginBottom: '1rem', color: 'var(--ink-900)' }}>
            This page doesn't exist
          </h1>
          <p style={{ color: 'var(--ink-400)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            The link you followed may be broken, or the page may have been moved. Head back home — everything's running fine there.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn-primary" style={{ textDecoration: 'none', gap: '0.5rem' }}>
              <Home size={15} /> Back to home
            </Link>
            <Link to="/contact" className="btn-secondary" style={{ textDecoration: 'none', gap: '0.5rem' }}>
              Contact us <ArrowRight size={15} />
            </Link>
          </div>

          {/* Quick links */}
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--ink-100)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--ink-300)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Popular pages
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'Products', href: '/products' },
                { label: 'Services', href: '/services' },
                { label: 'Pricing',  href: '/pricing'  },
                { label: 'Work',     href: '/work'     },
                { label: 'About',    href: '/about'    },
              ].map(link => (
                <Link key={link.href} to={link.href} style={{
                  padding: '0.35rem 0.875rem',
                  background: 'var(--bg-soft)', border: '1px solid var(--ink-100)',
                  borderRadius: '99px', textDecoration: 'none',
                  fontSize: '0.82rem', color: 'var(--ink-500)', fontWeight: 500,
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)'; e.currentTarget.style.background = 'var(--blue-light)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ink-100)'; e.currentTarget.style.color = 'var(--ink-500)'; e.currentTarget.style.background = 'var(--bg-soft)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  )
}
