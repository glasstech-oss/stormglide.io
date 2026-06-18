import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Mail, MapPin, Check, ArrowRight } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAdmin } from '../../context/AdminContext'

const TYPES = ['New System', 'Product Demo', 'Tech Consulting', 'Partnership', 'Other']

export default function Contact() {
  const { theme } = useTheme()
  const { addInquiry } = useAdmin()
  const [form, setForm] = useState({ name: '', company: '', email: '', type: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    addInquiry(form)
    setSubmitted(true)
  }

  return (
    <section id="contact" style={{ padding: 'var(--section-padding) 2rem', background: 'var(--color-surface)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(ellipse, color-mix(in srgb, var(--sg-accent) 5%, transparent) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>LET'S WORK TOGETHER</div>
          <h2 style={{ marginBottom: '1rem', letterSpacing: '-0.02em' }}>Ready to build something that works?</h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '420px', margin: '0 auto' }}>Tell us what you need. We'll respond within 24 hours.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            {submitted ? (
              <div style={{
                background: 'color-mix(in srgb, var(--color-success) 5%, transparent)',
                border: '1.5px solid color-mix(in srgb, var(--color-success) 20%, transparent)',
                borderRadius: 'var(--border-radius-lg)',
                padding: '3rem', textAlign: 'center',
              }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-success) 10%, transparent)', border: '1.5px solid color-mix(in srgb, var(--color-success) 25%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <Check size={26} color="var(--color-success)" />
                </div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Message received.</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>We'll be in touch soon. ✓</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>Name</label>
                    <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>Company</label>
                    <input className="input" placeholder="Company name" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>Email</label>
                  <input className="input" type="email" placeholder="hello@company.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>What are you looking for?</label>
                  <select className="input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} required>
                    <option value="">Select a topic...</option>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>Message</label>
                  <textarea className="input" placeholder="Tell us about your project..." rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '0.875rem', gap: '0.5rem', marginTop: '0.25rem' }}>
                  Send Message <ArrowRight size={15} />
                </button>
              </form>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a
              href={`https://wa.me/233${theme.contactWhatsapp.replace(/^0/, '')}`}
              target="_blank" rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1.25rem 1.5rem',
                background: 'rgba(37,211,102,0.06)',
                border: '1.5px solid rgba(37,211,102,0.2)',
                borderRadius: 'var(--border-radius)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.06)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
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

            {theme.siteCurrentlyAccepting && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '1rem 1.25rem',
                background: 'color-mix(in srgb, var(--color-success) 6%, transparent)',
                border: '1.5px solid color-mix(in srgb, var(--color-success) 20%, transparent)',
                borderRadius: 'var(--border-radius)',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)', animation: 'pulse 2s ease-in-out infinite', flexShrink: 0 }} />
                <span style={{ color: 'var(--color-success)', fontSize: '0.875rem', fontWeight: 500 }}>Currently accepting new projects</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }`}</style>
    </section>
  )
}
