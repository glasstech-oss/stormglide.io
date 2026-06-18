import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Mail, MapPin, Check, ArrowRight, Clock, Loader2, Zap } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import PageLayout from '../components/layout/PageLayout'
import { useTheme } from '../context/ThemeContext'
import { useAdmin } from '../context/AdminContext'

const TYPES = ['New System', 'Product Demo', 'Tech Consulting', 'Partnership', 'Other']

/*
 * ── Web3Forms setup ──────────────────────────────────────────────────────
 * 1. Go to https://web3forms.com/
 * 2. Enter your email (johnsedofiadakey@gmail.com)
 * 3. Copy the access key you receive
 * 4. Replace the value below with your key
 * ─────────────────────────────────────────────────────────────────────────
 */
const WEB3FORMS_KEY = 'f921c153-954b-431f-bbe5-30475c682b44'

const FAQS = [
  { q: 'How long does a typical project take?', a: 'Most custom systems take 6–16 weeks depending on scope. Simple web apps can be ready in 3–4 weeks. We give you a clear timeline before we start.' },
  { q: 'Do you work with clients outside Ghana?', a: 'Yes. We currently serve clients in Ghana and Guinea, and we work remotely with clients anywhere. We communicate over WhatsApp, email, and video.' },
  { q: 'What happens after launch?', a: "We provide ongoing support and maintenance for everything we build. We don't disappear. Bug fixes are free; new features are quoted separately." },
  { q: 'Can we start with one of your existing products?', a: 'Absolutely. Several products like Nexus HRM and Nexus MFG can be deployed and customized for your business within days.' },
  { q: 'Do you own the code after delivery?', a: 'Yes. Every project we deliver, you own the source code and all assets outright. No vendor lock-in, no recurring licensing fees from us.' },
  { q: 'How does pricing work?', a: 'We quote a fixed price after scoping your project. No hourly billing, no surprise invoices. What we quote is what you pay — nothing more.' },
]

export default function ContactPage() {
  const { theme } = useTheme()
  const { addInquiry } = useAdmin()

  const [form, setForm]           = useState({ name: '', company: '', email: '', type: '', message: '' })
  const [status, setStatus]       = useState('idle')   // idle | loading | success | error
  const [errorMsg, setErrorMsg]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    // Always log to admin panel
    addInquiry(form)

    // Send email via Web3Forms
    try {
      if (WEB3FORMS_KEY && WEB3FORMS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
        const payload = {
          access_key: WEB3FORMS_KEY,
          subject:    `New Stormglide enquiry — ${form.type || 'General'} from ${form.name}`,
          name:       form.name,
          email:      form.email,
          company:    form.company || '(not provided)',
          type:       form.type    || '(not provided)',
          message:    form.message,
          from_name:  'Stormglide Contact Form',
        }
        const res = await fetch('https://api.web3forms.com/submit', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body:    JSON.stringify(payload),
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.message || 'Submission failed')
      }
      setStatus('success')
    } catch (err) {
      // Even if email fails, the inquiry is logged in admin panel
      console.error('Web3Forms error:', err)
      setStatus('success')   // show success anyway — admin has the data
    }
  }

  return (
    <PageLayout>
      <Helmet>
        <title>Contact StormGlide — Discuss Your Software Project</title>
        <meta name="description" content="Get in touch with StormGlide to discuss your custom software, SaaS development, or automation needs. We respond within 24 hours. Based in Accra, Ghana." />
        <meta name="keywords" content="contact software developer, software development company Africa, SaaS development inquiry, custom software contact" />
        <meta property="og:title" content="Contact StormGlide Technologies" />
        <meta property="og:description" content="Tell us about your project. We respond within 24 hours." />
        <meta property="og:url" content="https://stormglide.vercel.app/contact" />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href="https://stormglide.vercel.app/contact" />

        {/* Schema.org ContactPoint markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "email": "hello@stormglide.io",
            "areaServed": "Africa",
            "availableLanguage": "en"
          })}
        </script>

        {/* FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How long does a typical project take?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most custom systems take 6–16 weeks depending on scope. Simple web apps can be ready in 3–4 weeks. We give you a clear timeline before we start."
                }
              },
              {
                "@type": "Question",
                "name": "Do you work with clients outside Ghana?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. We currently serve clients in Ghana and Guinea, and we work remotely with clients anywhere. We communicate over WhatsApp, email, and video."
                }
              },
              {
                "@type": "Question",
                "name": "What happens after launch?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We provide ongoing support and maintenance for everything we build. We don't disappear. Bug fixes are free; new features are quoted separately."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface)', padding: '4rem 2rem 3rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-label">CONTACT</div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '1.25rem', maxWidth: '520px' }}>
              Tell us what you need to build
            </h1>
            {/* WhatsApp hero CTA */}
            <a
              href={`https://wa.me/${theme.contactWhatsapp.replace(/[^0-9]/g, '').replace(/^0/, '233')}?text=${encodeURIComponent("Hi Stormglide, I'd like to discuss a project.")}`}
              target="_blank" rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.9rem 1.5rem',
                background: '#25D366', color: 'var(--color-text-heading)',
                borderRadius: '14px', textDecoration: 'none',
                fontWeight: 700, fontSize: '1rem',
                boxShadow: '0 8px 28px rgba(37,211,102,0.35)',
                transition: 'all 0.2s', marginBottom: '1.25rem',
                fontFamily: 'var(--font-display)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(37,211,102,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(37,211,102,0.35)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp — fastest way to reach us
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-success)' }} />
              Or fill the form below — we respond within 24 hours
            </div>
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '4rem', alignItems: 'start' }} className="contact-grid">

          {/* ── Form ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {status === 'success' ? (
              <div style={{ padding: '4rem 3rem', background: 'color-mix(in srgb, var(--color-success) 5%, transparent)', border: '1.5px solid color-mix(in srgb, var(--color-success) 20%, transparent)', borderRadius: 'var(--border-radius-lg)', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-success) 10%, transparent)', border: '2px solid color-mix(in srgb, var(--color-success) 25%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <Check size={30} color="var(--color-success)" />
                </div>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Message received! 🎉</h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                  We'll be in touch within 24 hours. You can also reach us on WhatsApp for a faster reply.
                </p>
                <a
                  href={`https://wa.me/${theme.contactWhatsapp.replace(/[^0-9]/g, '').replace(/^0/, '233')}?text=${encodeURIComponent("Hi, I just submitted the contact form on your site.")}`}
                  target="_blank" rel="noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.7rem 1.5rem', background: '#25D366', color: 'var(--color-text-heading)',
                    borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Follow up on WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-name-row">
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>Name *</label>
                    <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required disabled={status === 'loading'} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>Company</label>
                    <input className="input" placeholder="Company name" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} disabled={status === 'loading'} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>Email *</label>
                  <input className="input" type="email" placeholder="hello@company.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required disabled={status === 'loading'} />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>What are you looking for? *</label>
                  <select className="input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} required disabled={status === 'loading'}>
                    <option value="">Select a topic...</option>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>Message *</label>
                  <textarea className="input" placeholder="Tell us about your project — what it needs to do, how many users, any timeline constraints..." rows={6} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required style={{ resize: 'vertical' }} disabled={status === 'loading'} />
                </div>

                {errorMsg && (
                  <div style={{ padding: '0.875rem 1rem', background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 'var(--radius)', color: '#E11D48', fontSize: '0.85rem' }}>
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={status === 'loading'}
                  style={{ justifyContent: 'center', padding: '0.875rem', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.95rem', opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'wait' : 'pointer' }}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Sending…
                    </>
                  ) : (
                    <>Send message <ArrowRight size={15} /></>
                  )}
                </button>

                <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @media(max-width:520px){.form-name-row{grid-template-columns:1fr!important}}`}</style>
              </form>
            )}
          </motion.div>

          {/* ── Sidebar ── */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', background: 'color-mix(in srgb, var(--sg-accent) 5%, transparent)', border: '1.5px solid color-mix(in srgb, var(--sg-accent) 15%, transparent)', borderRadius: 'var(--border-radius)' }}>
              <div style={{ width: 42, height: 42, borderRadius: '11px', background: 'color-mix(in srgb, var(--sg-accent) 10%, transparent)', border: '1.5px solid color-mix(in srgb, var(--sg-accent) 20%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={17} color="var(--color-accent-blue)" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-heading)', marginBottom: '0.1rem' }}>Fast response</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>We reply within 24 hours, usually sooner.</div>
              </div>
            </div>

            <a href={`https://wa.me/${theme.contactWhatsapp.replace(/[^0-9]/g, '').replace(/^0/, '233')}`} target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', background: 'rgba(37,211,102,0.06)', border: '1.5px solid rgba(37,211,102,0.2)', borderRadius: 'var(--border-radius)', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.06)'; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{ width: 42, height: 42, borderRadius: '11px', background: 'rgba(37,211,102,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageSquare size={18} color="#25D366" />
              </div>
              <div>
                <div style={{ color: '#16A34A', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.1rem' }}>Chat on WhatsApp</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{theme.contactWhatsapp}</div>
              </div>
            </a>

            {[
              { icon: Mail, label: 'Email', value: theme.contactEmail, href: `mailto:${theme.contactEmail}`, color: 'var(--color-accent-blue)', bg: 'color-mix(in srgb, var(--sg-accent) 8%, transparent)', border: 'color-mix(in srgb, var(--sg-accent) 15%, transparent)' },
              { icon: MapPin, label: 'Location', value: 'Accra, Ghana', href: null, color: 'var(--color-accent-violet)', bg: 'color-mix(in srgb, var(--color-success) 8%, transparent)', border: 'color-mix(in srgb, var(--color-success) 15%, transparent)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', background: 'var(--color-background)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' }}>
                <div style={{ width: 42, height: 42, borderRadius: '11px', background: item.bg, border: `1.5px solid ${item.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon size={17} color={item.color} />
                </div>
                <div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem', fontWeight: 500 }}>{item.label}</div>
                  {item.href
                    ? <a href={item.href} style={{ color: 'var(--color-text-heading)', fontWeight: 500, textDecoration: 'none', fontSize: '0.9rem' }}>{item.value}</a>
                    : <div style={{ color: 'var(--color-text-heading)', fontWeight: 500, fontSize: '0.9rem' }}>{item.value}</div>
                  }
                </div>
              </div>
            ))}

            {/* Scope badge */}
            <div style={{ padding: '1.375rem', background: 'linear-gradient(135deg, color-mix(in srgb, var(--sg-accent) 6%, transparent), color-mix(in srgb, var(--color-success) 4%, transparent))', border: '1.5px solid color-mix(in srgb, var(--sg-accent) 15%, transparent)', borderRadius: 'var(--border-radius-lg)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--ink-300)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>Our promise</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--ink-700)', fontWeight: 600, marginBottom: '0.375rem' }}><Zap size={14} color="var(--amber)" /> Scope + fixed price in 48 hrs</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--ink-400)', lineHeight: 1.65, margin: 0 }}>
                After your first message, we'll come back with a complete scope, feature list, fixed price, and delivery date — no commitment needed.
              </p>
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginTop: '5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>FAQ</div>
            <h2 style={{ fontSize: '1.6rem', letterSpacing: '-0.02em' }}>Common questions</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '1.25rem' }}>
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{ padding: '1.5rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)' }}
              >
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.625rem', lineHeight: 1.4, color: 'var(--ink-900)' }}>{faq.q}</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.72, margin: 0 }}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`@media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr !important; } }`}</style>
    </PageLayout>
  )
}
