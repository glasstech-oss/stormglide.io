import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, MoveUpRight, CheckCircle2, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import { SITE_URL } from '../data/seo'
import { CLIENT_WORK, getWorkPath } from '../data/clientWork'
import { handleViewTransitionClick, useViewTransitionNavigate } from '../lib/viewTransition'
import GyroCard from '../components/common/GyroCard'
import MotionProofStrip from '../components/common/MotionProofStrip'
import { usePageMotion } from '../lib/usePageMotion'

const clientWorkSchema = {
  '@context': 'https://schema.org',
  '@graph': CLIENT_WORK.map(item => ({
    '@type': 'Product',
    '@id': `${item.url}#${item.id || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: item.name,
    description: item.desc,
    category: item.category,
    url: item.url,
    brand: { '@id': `${SITE_URL}/#organization` },
    areaServed: item.region,
  })),
}

const WORK_PREVIEW_IMAGES = {
  'lollarod-enterprise': '/images/mockups/website.webp',
  'nexus-dental-system': '/images/mockups/dental.webp',
  'cosmetology-spa-management-system': '/images/mockups/cosmetology.webp',
  kentehaul: '/images/mockups/website.webp',
  'jaybesin-logistics': '/images/mockups/webapp.webp',
  'kyekye-cuisine': '/images/mockups/mobile.webp',
  barbermanager: '/images/mockups/mobile.webp',
}

function getWorkPreviewImage(item) {
  return WORK_PREVIEW_IMAGES[item.slug] || '/images/mockups/webapp.webp'
}

export default function WorkPage() {
  const pageRef = useRef(null)
  const [activeSlug, setActiveSlug] = useState(() => CLIENT_WORK.find(item => !item.noEmbed)?.slug || CLIENT_WORK[0].slug)
  const vtNavigate = useViewTransitionNavigate()

  const active = CLIENT_WORK.find(c => c.slug === activeSlug)
  const activePreviewImage = getWorkPreviewImage(active)

  usePageMotion('/work', pageRef)

  return (
    <PageLayout>
      <div ref={pageRef}>
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(clientWorkSchema)}</script>
        </Helmet>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--ink-100)', background: 'var(--bg-soft)', padding: '5rem 2rem 3.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-label">OUR WORK</div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.04em', marginBottom: '1rem', maxWidth: '580px' }}>
              Real client systems, live.
            </h1>
            <p style={{ color: 'var(--ink-400)', fontSize: '1.05rem', maxWidth: '520px', lineHeight: 1.8 }}>
              Browse the actual sites we've shipped for paying customers, right here — or open any of them in a new tab.
            </p>
          </motion.div>
        </div>
      </div>

      <MotionProofStrip
        eyebrow="LIVE INTERFACES"
        title="Proof should move, not just read well."
        body="The portfolio now leads with interface motion: product screens, storefronts, and operational dashboards moving through the page before the visitor reaches the detailed case list."
      />

      {/* Live site browser */}
      <div className="sg-work-demo-section" data-motion="reveal" style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem 2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div className="section-label">BROWSE LIVE</div>
          <h2 style={{ fontSize: '1.4rem', letterSpacing: '-0.028em', marginBottom: 0 }}>Click through the sites we've built</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', alignItems: 'start' }} className="work-grid">
          {/* Sidebar tabs */}
          <div className="sg-work-demo-sidebar" style={{ position: 'sticky', top: '88px' }}>
            <div className="sg-work-demo-tabs" style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {CLIENT_WORK.map(c => {
                const Icon = c.RegionIcon
                const isActive = activeSlug === c.slug
                return (
                  <button
                    key={c.slug}
                    onClick={() => setActiveSlug(c.slug)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.75rem 1rem', borderRadius: '10px', cursor: 'pointer',
                      border: isActive ? `1.5px solid ${c.color}40` : '1.5px solid transparent',
                      background: isActive ? `${c.color}08` : 'none',
                      textAlign: 'left', transition: 'all 0.15s',
                      fontFamily: 'var(--font-body)',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-soft)' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'none' }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: '8px', background: `${c.color}14`, border: `1px solid ${c.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color={c.color} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 500, color: isActive ? 'var(--ink-900)' : 'var(--ink-400)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--ink-300)', marginTop: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.category}</div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="sg-work-demo-cta-card" style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'var(--bg-soft)', border: '1.5px solid var(--ink-100)', borderRadius: 'var(--radius-lg)' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--ink-400)', lineHeight: 1.65, marginBottom: '0.875rem' }}>
                Want something like this for your business?
              </p>
              <Link to="/price-estimator" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: active.color, fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
                Start a project <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Browser panel */}
          <div className="sg-work-demo-panel">
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '9px', background: `${active.color}14`, border: `1.5px solid ${active.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <active.RegionIcon size={17} color={active.color} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '0.1rem' }}>{active.name}</h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--ink-400)' }}>{active.scope}</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="sg-demo-frame" style={{ border: 'none', borderRadius: '0', overflow: 'hidden', boxShadow: 'none' }}>
                  <div style={{ background: 'transparent', padding: '0.75rem 0', borderBottom: '1px solid var(--ink-100)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--color-danger)' }} />
                    <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--color-warning)' }} />
                    <div style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--color-success)' }} />
                    <a
                      href={active.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', background: 'var(--bg-subtle)', border: '1px solid var(--ink-100)', borderRadius: '6px', padding: '0.25rem 0.75rem', marginLeft: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--ink-300)', textDecoration: 'none' }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{active.url.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink size={11} style={{ flexShrink: 0 }} />
                    </a>
                  </div>
                  <div className="sg-demo-frame-body" style={{ position: 'relative' }}>
                    {/* Invisible overlay to prevent scroll trapping on mobile, but allow clicks to pass through on desktop */}
                    <a 
                      href={active.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="sg-mobile-iframe-overlay"
                      aria-label={`Open ${active.name} live site`}
                    >
                      <div className="sg-overlay-pill">
                        Open Site <ExternalLink size={14} />
                      </div>
                    </a>
                    
                    {active.noEmbed ? (
                      <div className="sg-embed-blocked">
                        <div className="sg-embed-blocked-preview">
                          <img src={activePreviewImage} alt={`${active.name} interface preview`} loading="lazy" decoding="async" />
                        </div>
                        <div className="sg-mobile-demo-icon" style={{ '--demo-color': active.color }}>
                          <active.RegionIcon size={22} />
                        </div>
                        <p>This site doesn't allow embedded previews — open it directly instead.</p>
                        <a href={active.url} target="_blank" rel="noreferrer">
                          Open {active.name} <MoveUpRight size={14} />
                        </a>
                      </div>
                    ) : (
                      <iframe
                        key={active.slug}
                        src={active.url}
                        title={`${active.name} — live site`}
                        loading="lazy"
                        style={{ width: '100%', height: '560px', border: 'none', display: 'block', background: 'var(--color-surface)' }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Client Work Showcase */}
      <div data-motion="reveal" style={{ padding: '4rem 2rem 6rem', background: 'var(--glass-bg)', position: 'relative', overflow: 'hidden', marginTop: '3rem' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '-20%', left: '20%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, color-mix(in srgb, var(--sg-accent) 10%, transparent) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '3rem' }}>
            <div className="section-label" style={{ background: 'color-mix(in srgb, var(--sg-accent) 15%, transparent)', borderColor: 'color-mix(in srgb, var(--sg-accent) 30%, transparent)', color: 'color-mix(in srgb, var(--color-success) 90%, transparent)' }}>LIVE CLIENT WORK</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', letterSpacing: '-0.028em', color: 'var(--color-text-heading)', maxWidth: '580px', marginBottom: '0.75rem' }}>
              Real systems built for real businesses
            </h2>
            <p style={{ color: 'color-mix(in srgb, var(--color-text-heading) 45%, transparent)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '480px' }}>
              These are live. Click the links, explore the sites, and see exactly the kind of work we deliver for clients.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(440px, 100%), 1fr))', gap: '1.5rem' }} className="client-grid">
            {CLIENT_WORK.map((c, i) => (
              <GyroCard
                key={c.name}
                className="sg-client-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  position: 'relative',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '0',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
              >
                {/* Stretched link — the whole card opens the case study;
                    "Visit site" below sits above this (z-index) so it still
                    opens the external site directly, without nesting an <a>
                    inside another <a>. */}
                <Link
                  to={getWorkPath(c.slug)}
                  onClick={e => handleViewTransitionClick(e, vtNavigate, getWorkPath(c.slug), { name: 'work-flip' })}
                  aria-label={`View the ${c.name} case study`}
                  style={{ position: 'absolute', inset: 0, zIndex: 1 }}
                />

                {/* Card top accent removed for editorial style */}
                <div className="sg-client-card-body" style={{ padding: '1rem 0', position: 'relative' }}>
                  {/* Header row */}
                  <div className="sg-client-card-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'color-mix(in srgb, var(--color-text-heading) 30%, transparent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        <c.RegionIcon size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />{c.region} · {c.category} · {c.year}
                      </div>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-heading)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{c.name}</h3>
                      <div style={{ fontSize: '0.75rem', color: c.color, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{c.scope}</div>
                    </div>
                    <a className="sg-client-card-link" href={c.url} target="_blank" rel="noreferrer"
                      style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.875rem', background: `${c.color}18`, border: `1.5px solid ${c.color}35`, borderRadius: '99px', textDecoration: 'none', color: c.color, fontSize: '0.78rem', fontWeight: 600, flexShrink: 0, transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = c.color; e.currentTarget.style.color = 'var(--color-text-heading)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = `${c.color}18`; e.currentTarget.style.color = c.color }}
                    >
                      Visit site <MoveUpRight size={12} />
                    </a>
                  </div>

                  <p className="sg-client-desc" style={{ fontSize: '0.875rem', color: 'color-mix(in srgb, var(--color-text-heading) 45%, transparent)', lineHeight: 1.75, marginBottom: '1.5rem' }}>{c.desc}</p>

                  {/* What was built */}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'color-mix(in srgb, var(--color-text-heading) 25%, transparent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.875rem', fontWeight: 600 }}>
                    What's inside
                  </div>
                  <div className="sg-client-built-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {c.what.map(w => (
                      <div key={w} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.425rem', fontSize: '0.8rem' }}>
                        <CheckCircle2 size={12} color={c.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span style={{ color: 'color-mix(in srgb, var(--color-text-heading) 55%, transparent)', lineHeight: 1.4 }}>{w}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stack */}
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid color-mix(in srgb, var(--color-text-heading) 7%, transparent)' }}>
                    {c.stack.map(t => (
                      <span key={t} className="sg-client-stack-tag" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', padding: '0.2rem 0.55rem', borderRadius: '6px', background: 'color-mix(in srgb, var(--color-text-heading) 5%, transparent)', border: '1px solid color-mix(in srgb, var(--color-text-heading) 10%, transparent)', color: 'color-mix(in srgb, var(--color-text-heading) 40%, transparent)', fontWeight: 500 }}>{t}</span>
                    ))}
                  </div>

                  <div className="sg-client-view-case" style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem', color: c.color, fontSize: '0.82rem', fontWeight: 600 }}>
                    View case study <ArrowRight size={13} />
                  </div>
                </div>
              </GyroCard>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <p style={{ color: 'color-mix(in srgb, var(--color-text-heading) 30%, transparent)', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>
              + many more client systems across Ghana, Guinea, UK, US, UAE, Togo & China
            </p>
            <Link to="/contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', background: 'color-mix(in srgb, var(--color-text-heading) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--color-text-heading) 15%, transparent)', borderRadius: 'var(--radius)', color: 'var(--color-text-heading)', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--color-text-heading) 14%, transparent)'}
              onMouseLeave={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--color-text-heading) 8%, transparent)'}
            >
              Let's build yours <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>

      <style>{`
        .sg-mobile-iframe-overlay {
          display: none;
        }

        .sg-embed-blocked {
          display: grid;
          justify-items: center;
          text-align: center;
          gap: 0.9rem;
          padding: 2rem;
          min-height: 400px;
          align-content: center;
          background: var(--bg-soft);
        }

        .sg-embed-blocked-preview {
          width: min(100%, 620px);
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--color-border-subtle);
          box-shadow: var(--shadow-sm);
          background: var(--color-surface);
        }

        .sg-embed-blocked-preview img {
          display: block;
          width: 100%;
          height: min(36vw, 250px);
          min-height: 180px;
          object-fit: cover;
          object-position: top;
        }

        .sg-embed-blocked p {
          color: var(--ink-400);
          font-size: 0.9rem;
          max-width: 32ch;
          line-height: 1.6;
        }

        .sg-embed-blocked a {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.25rem;
          border-radius: 999px;
          background: var(--sg-accent);
          color: #FFFFFF;
          font-weight: 600;
          font-size: 0.85rem;
          text-decoration: none;
        }

        @media (max-width: 860px) {
          .sg-work-demo-section {
            padding: 3rem 1rem 1rem !important;
            max-width: 100% !important;
          }

          .work-grid {
            display: block !important;
            grid-template-columns: 1fr !important;
            min-width: 0;
          }

          .work-grid > *,
          .sg-work-demo-panel,
          .sg-demo-frame {
            min-width: 0;
            max-width: 100%;
          }

          .sg-work-demo-sidebar {
            position: static !important;
            top: auto !important;
            margin-bottom: 1rem;
          }

          .sg-work-demo-tabs {
            flex-direction: row !important;
            gap: 0.75rem !important;
            overflow-x: auto;
            padding: 0 0 0.5rem;
            margin: 0 -1rem;
            padding-left: 1rem;
            padding-right: 1rem;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }

          .sg-work-demo-tabs button {
            width: auto !important;
            min-width: min(72vw, 245px);
            flex: 0 0 auto;
            scroll-snap-align: start;
            border: 1px solid var(--glass-border) !important;
            background: var(--glass-bg) !important;
            border-radius: 18px !important;
          }

          .sg-work-demo-cta-card {
            display: none;
          }

          .sg-work-demo-panel {
            margin-top: 0.5rem;
          }

          .sg-demo-frame {
            border-radius: 24px !important;
            box-shadow: var(--shadow-sm) !important;
          }

          .sg-mobile-iframe-overlay {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            inset: 0;
            z-index: 10;
            background: rgba(0, 0, 0, 0.02);
            text-decoration: none;
          }

          .sg-overlay-pill {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            padding: 0.75rem 1.25rem;
            border-radius: 99px;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--color-text-heading);
            box-shadow: var(--shadow-sm);
            backdrop-filter: blur(8px);
          }

          .sg-demo-frame-body iframe {
            height: 400px !important;
            pointer-events: none; /* Let the overlay catch the tap and prevent scroll hijack */
          }

          .sg-client-desc {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-bottom: 1rem !important;
          }

          .client-grid { grid-template-columns: 1fr !important; }

          .sg-client-card-body {
            padding: 1.25rem !important;
          }

          .sg-client-card-header {
            display: grid !important;
            gap: 1rem;
          }

          .sg-client-card-link {
            width: 100%;
            justify-content: center;
            min-height: 44px;
          }

          .sg-client-built-list {
            display: none !important;
          }
        }

      `}</style>
      </div>
    </PageLayout>
  )
}
