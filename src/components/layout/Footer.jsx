import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const PRODUCTS = [
  { name: 'Nexus HRM',   slug: 'nexus-hrm',  color: 'var(--color-accent-blue)' },
  { name: 'SANO Health', slug: 'sano',        color: 'var(--color-success)' },
  { name: 'CargoScan',   slug: 'cargoscan',   color: 'var(--color-warning)' },
  { name: 'Nexus MFG',   slug: 'nexus-mfg',  color: 'var(--color-success)' },
  { name: 'Glasstech',   slug: 'glasstech',   color: 'var(--color-accent-violet)' },
]

const NAV = [
  { label: 'Products',  href: '/products'  },
  { label: 'Services',  href: '/services'  },
  { label: 'Pricing',   href: '/pricing'   },
  { label: 'Work',      href: '/work'      },
  { label: 'About',     href: '/about'     },
  { label: 'Contact',   href: '/contact'   },
]

const linkBase = {
  color: 'var(--ink-400)',
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-body)',
  transition: 'color 0.15s',
  display: 'block',
}

export default function Footer() {
  const { theme } = useTheme()

  return (
    <footer style={{ background: 'var(--color-surface-alt)', position: 'relative', overflow: 'hidden' }}>

      {/* Subtle background glow */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-40%', left: '-10%',
          width: '700px', height: '700px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, color-mix(in srgb, var(--sg-accent) 7%, transparent) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-5%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, color-mix(in srgb, var(--sg-accent-2) 5%, transparent) 0%, transparent 65%)',
        }} />
      </div>

      {/* ── Top CTA strip ── */}
      <div style={{
        borderBottom: '1px solid var(--color-border-subtle)',
        padding: '4rem 2rem',
        position: 'relative',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 600,
              color: 'var(--sg-accent)', letterSpacing: '0.14em', textTransform: 'uppercase',
              marginBottom: '0.875rem',
            }}>
              Start a project
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1,
              color: 'var(--color-text-heading)', maxWidth: '540px',
            }}>
              Ready to build something your business can rely on?
            </h2>
          </div>
          <Link
            to="/contact"
            className="btn-primary"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
              padding: '0.9rem 1.875rem',
              fontSize: '0.9rem',
              flexShrink: 0,
            }}
          >
            Let's talk <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem 3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 1fr 1.2fr', gap: '3rem' }} className="footer-grid">

          {/* Brand column */}
          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
              <svg viewBox="0 0 16 24" height="24" style={{ display: 'block', color: 'var(--color-text-heading)' }}>
                <rect x="4" y="0" width="6" height="6" fill="currentColor" />
                <rect x="12" y="0" width="4" height="7" fill="var(--sg-accent)" />
                <path d="M0 10 H10 V24 H4 V16 H0 Z" fill="currentColor" />
                <rect x="12" y="10" width="4" height="7" fill="currentColor" />
              </svg>
              <span style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontWeight: 800, 
                fontSize: '24px', 
                letterSpacing: '-0.04em', 
                color: 'var(--color-text-heading)',
                display: 'flex',
                alignItems: 'baseline'
              }}>
                stormglide.
                <span style={{ position: 'relative', display: 'inline-flex' }}>
                  ı
                  <span style={{ 
                    position: 'absolute', 
                    top: '0.2em', 
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0.23em', 
                    height: '0.23em', 
                    backgroundColor: 'var(--sg-accent)', 
                    borderRadius: '1.5px' 
                  }}></span>
                </span>
                o
              </span>
            </div>

            <p style={{ color: 'var(--ink-400)', fontSize: '0.875rem', lineHeight: 1.75, maxWidth: '260px', marginBottom: '1.75rem' }}>
              Custom software, business systems, and AI-powered tools built for Africa.
            </p>

            {/* Social links */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { label: 'WhatsApp', href: `https://wa.me/${theme.contactWhatsapp.replace(/[^0-9]/g, '').replace(/^0/, '233')}` },
                { label: 'LinkedIn', href: theme.contactLinkedIn },
                { label: 'Email',    href: `mailto:${theme.contactEmail}` },
              ].map(link => (
                <a key={link.label} href={link.href}
                  target={link.label !== 'Email' ? '_blank' : undefined} rel="noreferrer"
                  style={{
                    padding: '0.35rem 0.875rem',
                    background: 'color-mix(in srgb, var(--color-surface) 90%, transparent)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--ink-400)',
                    fontSize: '0.75rem',
                    textDecoration: 'none',
                    transition: 'all 0.15s',
                    fontWeight: 500,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'color-mix(in srgb, var(--sg-accent) 20%, transparent)'; e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--sg-accent) 40%, transparent)'; e.currentTarget.style.color = 'var(--color-text-heading)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'color-mix(in srgb, var(--color-surface) 90%, transparent)'; e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; e.currentTarget.style.color = 'var(--ink-400)' }}
                >{link.label}</a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 600,
              color: 'var(--ink-300)', letterSpacing: '0.14em',
              textTransform: 'uppercase', marginBottom: '1.375rem',
            }}>Navigation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {NAV.map(link => (
                <Link key={link.href} to={link.href} style={linkBase}
                  onMouseEnter={e => e.target.style.color = 'var(--color-text-heading)'}
                  onMouseLeave={e => e.target.style.color = 'var(--ink-400)'}
                >{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 600,
              color: 'var(--ink-300)', letterSpacing: '0.14em',
              textTransform: 'uppercase', marginBottom: '1.375rem',
            }}>Products</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {PRODUCTS.map(p => (
                <Link key={p.slug} to={`/products/${p.slug}`} style={{ ...linkBase, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text-heading)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-400)' }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0, opacity: 0.7 }} />
                  {p.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact card */}
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 600,
              color: 'var(--ink-300)', letterSpacing: '0.14em',
              textTransform: 'uppercase', marginBottom: '1.375rem',
            }}>Get in touch</div>
            <div style={{
              background: 'color-mix(in srgb, var(--color-surface) 60%, transparent)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius)',
              padding: '1.25rem',
            }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-400)', lineHeight: 1.7, marginBottom: '1.125rem' }}>
                We respond within 24 hours. Tell us what you need to build.
              </div>
              <a
                href={`mailto:${theme.contactEmail}`}
                style={{
                  display: 'block', fontSize: '0.85rem', fontWeight: 600,
                  color: 'var(--color-text-primary)', textDecoration: 'none',
                  marginBottom: '0.375rem', transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--color-text-heading)'}
                onMouseLeave={e => e.target.style.color = 'var(--color-text-primary)'}
              >
                {theme.contactEmail}
              </a>
              <a
                href={`https://wa.me/${theme.contactWhatsapp.replace(/[^0-9]/g, '').replace(/^0/, '233')}`}
                target="_blank" rel="noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  fontSize: '0.78rem', color: 'var(--color-success)', textDecoration: 'none',
                  fontWeight: 500, transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                WhatsApp {theme.contactWhatsapp} <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        borderTop: '1px solid var(--color-border-subtle)',
        padding: '1.375rem 2rem',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '0.75rem',
        }}>
          <p style={{ color: 'var(--ink-300)', fontSize: '0.78rem', fontFamily: 'var(--font-body)' }}>
            © 2025 Stormglide Technologies Ltd. · Built in Accra, Ghana
          </p>
          <Link to="/admin/login" style={{
            display: 'flex', alignItems: 'center', gap: '0.3rem',
            color: 'var(--ink-300)', fontSize: '0.72rem', textDecoration: 'none',
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ink-500)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-300)'}
          >
            Admin <ArrowUpRight size={10} />
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
