import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { MessageSquare, Mail, MapPin, Check, ArrowRight, ArrowUpRight, Clock, Loader2, Zap, Building2, Layers, Brain, Shield, Wrench, Phone, Monitor, Lock, UserRound, Globe2 } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout'
import WordReveal from '../components/common/WordReveal'
import { useTheme } from '../context/ThemeContext'
import { useAdmin } from '../context/AdminContext'
import { revealItem } from '../lib/reveal'
import { submitLead } from '../lib/crm'
import { LIVE_PRODUCT_COUNT } from '../data/products'
import { CLIENT_WORK_COUNT } from '../data/clientWork'

const API_BASE = 'https://us-central1-stormglideio.cloudfunctions.net/api'

const TYPES = ['New System', 'Product Demo', 'Tech Consulting', 'Partnership', 'Other']

const PILLARS = [
  { icon: Building2, title: 'Built in Africa', desc: "We understand the market, the infrastructure, the constraints, and the opportunity. We don't build for Africa from the outside — we are inside it.", color: 'var(--color-accent-blue)', bg: 'color-mix(in srgb, var(--sg-accent) 7%, transparent)', border: 'color-mix(in srgb, var(--sg-accent) 15%, transparent)' },
  { icon: Layers, title: 'Full-Stack Delivery', desc: 'Design, build, deploy, support — one team handles it all. No handoffs, no excuses, no disappearing after launch.', color: 'var(--color-accent-violet)', bg: 'color-mix(in srgb, var(--color-success) 7%, transparent)', border: 'color-mix(in srgb, var(--color-success) 15%, transparent)' },
  { icon: Brain, title: 'AI-Native by Default', desc: 'Every system we build considers artificial intelligence from day one. Not as a gimmick — as a genuine tool for doing more with less.', color: 'var(--color-accent-coral)', bg: 'color-mix(in srgb, var(--color-accent-coral) 7%, transparent)', border: 'color-mix(in srgb, var(--color-accent-coral) 15%, transparent)' },
  { icon: Shield, title: 'Enterprise-Grade Security', desc: 'Multi-tenant architecture, role-based access control, audit trails, and data encryption. Built right from the start.', color: 'var(--color-success)', bg: 'color-mix(in srgb, var(--color-success) 7%, transparent)', border: 'color-mix(in srgb, var(--color-success) 18%, transparent)' },
  { icon: Zap, title: 'Speed Without Shortcuts', desc: "We scope in 48 hours, demo in week one, and ship on the exact date we commit to. No 6-month timelines, no excuses, no disappearing developers. Fast is how we work.", color: 'var(--color-warning)', bg: 'color-mix(in srgb, var(--color-warning) 7%, transparent)', border: 'color-mix(in srgb, var(--color-warning) 18%, transparent)' },
]

const STATS = [
  { value: String(LIVE_PRODUCT_COUNT),   label: 'Products live'      },
  { value: 'Ghana & Guinea',             label: 'Countries served'   },
  { value: String(CLIENT_WORK_COUNT),    label: 'Systems shipped'    },
  { value: '24h',                        label: 'Response time'      },
]

const SECURITY_POINTS = [
  { title: 'Encrypted in transit and at rest', desc: 'All data moves over HTTPS, and every system we build stores data with provider-level encryption at rest — the same standard used by Google Cloud and Firebase infrastructure.' },
  { title: 'Role-based access control', desc: "Nobody sees more than their role requires. Admins, staff, and clients each get scoped access — built into every system from day one, not bolted on later." },
  { title: 'Automatic backups', desc: 'Your data is backed up continuously on managed infrastructure, not sitting on a single laptop or unmonitored server.' },
  { title: 'You own your data', desc: 'Every system we build is yours — exportable, documented, and never held hostage. If you ever leave, you leave with your data intact.' },
]

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
  { q: 'Can we start with one of your existing products?', a: 'Absolutely. Several products like Nexus HRM and LOÙ Beauty Hub can be deployed and customized for your business within days.' },
  { q: 'Do you own the code after delivery?', a: 'Yes. Every project we deliver, you own the source code and all assets outright. No vendor lock-in — host it, modify it, or hand it to another developer, any time.' },
  { q: 'How does pricing work?', a: 'We quote a fixed price after scoping your project. No hourly billing, no surprise invoices. What we quote is what you pay — nothing more.' },
]

export default function ContactPage() {
  const { theme } = useTheme()
  const { addInquiry } = useAdmin()
  const location = useLocation()

  const [form, setForm]           = useState({ name: '', company: '', email: '', phone: '', type: '', message: '', budget: '', timeline: '' })
  const [status, setStatus]       = useState('idle')   // idle | loading | success | error
  const [errorMsg, setErrorMsg]   = useState('')
  const [team, setTeam]           = useState([])

  useEffect(() => {
    let cancelled = false
    fetch(`${API_BASE}/v1/team`)
      .then(res => (res.ok ? res.json() : []))
      .then(data => { if (!cancelled && Array.isArray(data)) setTeam(data) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  // React Router doesn't scroll to hash fragments on its own — jump to the
  // "Let's build" form when arriving via /contact#build.
  useEffect(() => {
    if (location.hash !== '#build') return
    const target = document.getElementById('build')
    if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [location.hash, location.key])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      // Save to Firebase Firestore
      await addInquiry({
        clientName: form.name,
        clientEmail: form.email,
        clientPhone: form.phone || '',
        company: form.company,
        serviceType: form.type,
        message: form.message,
        budget: form.budget || '',
        timeline: form.timeline || '',
        source: 'contact_form',
      })

      // Best-effort: also send this lead to the real admin CRM (addInquiry
      // above only ever writes to localStorage/Supabase). Fire-and-forget so
      // a network hiccup here never blocks the visible success confirmation.
      submitLead({
        name: form.name,
        email: form.email,
        phone: form.phone,
        organization: form.company,
        missionScope: form.type,
        details: form.message,
        budget: form.budget,
        timeline: form.timeline,
        source: 'contact_form',
      }).catch(() => {})

      // Also send email via Web3Forms if available
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
        await fetch('https://api.web3forms.com/submit', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body:    JSON.stringify(payload),
        })
      }
      setStatus('success')
      setForm({ name: '', company: '', email: '', phone: '', type: '', message: '', budget: '', timeline: '' })
    } catch (err) {
      console.error('Submission error:', err)
      setErrorMsg(err.message || 'Failed to submit. Please try again.')
      setStatus('error')
    }
  }

  return (
    <PageLayout>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--color-border-subtle)', background: 'var(--color-surface)', padding: '4rem 2rem 3rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="section-label">ABOUT</div>
            <WordReveal
              as="h1"
              text="A software company built by people who understand the African market"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '1rem', maxWidth: '640px' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              <MapPin size={14} />
              <span>Accra, Ghana — operating across Ghana & Guinea</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Who we are */}
      <div style={{ padding: '5rem 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }} className="about-grid">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <WordReveal
              as="h2"
              text="We build the technology African businesses deserve — not the watered-down version"
              style={{ fontSize: '1.6rem', letterSpacing: '-0.02em', marginBottom: '1.25rem', lineHeight: 1.2 }}
            />
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '0.975rem', marginBottom: '1.5rem' }}>{theme.siteAboutText}</p>
            <blockquote style={{ borderLeft: '3px solid var(--color-accent-blue)', paddingLeft: '1.25rem', fontFamily: 'var(--font-display)', fontSize: '1rem', fontStyle: 'italic', color: 'var(--color-text-heading)', background: 'color-mix(in srgb, var(--sg-accent) 4%, transparent)', borderRadius: '0 10px 10px 0', padding: '1rem 1.25rem' }}>
              "{theme.siteMission}"
            </blockquote>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', border: '1.5px solid var(--color-border-subtle)', marginBottom: '2rem' }}>
              {STATS.map(s => (
                <div key={s.label} style={{ background: 'var(--glass-bg)', padding: '1.75rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(120deg, var(--color-accent-blue), var(--color-accent-violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.25rem' }}>{s.value}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', background: 'color-mix(in srgb, var(--color-success) 6%, transparent)', border: '1.5px solid color-mix(in srgb, var(--color-success) 20%, transparent)', borderRadius: 'var(--border-radius)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)', flexShrink: 0 }} />
              <span style={{ color: 'var(--color-success)', fontSize: '0.875rem', fontWeight: 500 }}>Currently accepting new projects</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Founder */}
      <div style={{ padding: '5rem 2rem', borderTop: '1px solid var(--color-border-subtle)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div className="section-label" style={{ marginBottom: '2.5rem' }}>THE FOUNDER</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 340px) 1fr', gap: '3.5rem', alignItems: 'start' }} className="about-grid">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div style={{ borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', border: '1.5px solid var(--color-border-subtle)', boxShadow: '0 24px 60px -28px rgba(22,35,63,0.35)', aspectRatio: '4 / 5', background: 'color-mix(in srgb, var(--sg-accent) 6%, transparent)' }}>
                <img
                  src="/images/founder-john-dakey.jpg"
                  alt="John Dakey, founder of Stormglide"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              </div>
              <div style={{ marginTop: '1.1rem' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-text-heading)' }}>John Dakey</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sg-accent)', marginTop: '0.3rem' }}>Founder &middot; Supply Chain, CIPS UK</div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}>
              <WordReveal
                as="h2"
                text="I ran businesses before I ever wrote software. That's the whole point."
                style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '1.4rem' }}
              />
              <div style={{ display: 'grid', gap: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '0.95rem' }}>
                <p>
                  My whole life has been business. I trained in supply chain with the Chartered
                  Institute of Procurement &amp; Supply (UK), then spent years on the operating
                  side — running an international logistics company, trading across borders, and
                  consulting for businesses on their operations and audits.
                </p>
                <p>
                  Somewhere along the way I taught myself to build software, because the systems
                  I needed didn't exist — or weren't built for how business actually works here.
                  That combination is rare, and it's Stormglide's edge: every system we ship is
                  designed by someone who has stood where you stand — chasing invoices, reconciling
                  payroll, moving goods through customs. We build customer-centric systems, we
                  customise down to the tiniest detail, and we never stop improving what we've shipped.
                </p>
              </div>
              <blockquote style={{ borderLeft: '3px solid var(--sg-accent)', margin: '1.6rem 0 0', padding: '1rem 1.25rem', background: 'color-mix(in srgb, var(--sg-accent) 4%, transparent)', borderRadius: '0 10px 10px 0', color: 'var(--color-text-heading)', fontStyle: 'italic', fontSize: '0.98rem' }}>
                "The vision is simple: when a business anywhere in Africa wants a website with a
                real system behind it — complex operations, IoT on the factory floor, all of it —
                Stormglide should be the first name they say."
              </blockquote>
              <div style={{ display: 'flex', gap: '2.2rem', flexWrap: 'wrap', marginTop: '1.8rem', fontFamily: 'var(--font-mono)', fontSize: '0.64rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>
                <span><b style={{ color: 'var(--sg-accent)' }}>MISSION&nbsp;/&nbsp;</b> A working demo for every industry</span>
                <span><b style={{ color: 'var(--sg-accent-2)' }}>METHOD&nbsp;/&nbsp;</b> Learn fast as AI moves, ship faster</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div style={{ padding: '0 2rem 5rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>HOW WE OPERATE</div>
            <WordReveal as="h2" text="Four principles we don't compromise on" style={{ letterSpacing: '-0.02em' }} />
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {PILLARS.map((p, i) => {
              const Icon = p.icon
              return (
                <motion.div
                  key={p.title}
                  {...revealItem(i)}
                  style={{ background: 'var(--glass-bg)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', padding: '2rem', position: 'relative', overflow: 'hidden', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${p.color}, transparent)` }} />
                  <div style={{ width: 44, height: 44, borderRadius: '12px', background: p.bg, border: `1.5px solid ${p.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Icon size={20} color={p.color} />
                  </div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>{p.title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.72, fontSize: '0.875rem' }}>{p.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Founder section */}
      <div style={{ padding: '5rem 2rem', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-subtle)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '3rem' }}>
            <div className="section-label">WHO'S BEHIND THIS</div>
            <WordReveal as="h2" text="Built by engineers who know what broken software costs." style={{ letterSpacing: '-0.028em', maxWidth: '480px' }} />
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }} className="founder-grid">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div style={{ background: 'linear-gradient(135deg, var(--sg-accent)08 0%, var(--color-success)08 100%)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', padding: '2.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-violet))', borderRadius: '99px 99px 0 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, var(--sg-accent), var(--color-success))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={26} color="var(--color-text-heading)" fill="var(--color-text-heading)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-heading)' }}>The Founding Team</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.15rem' }}>Accra, Ghana</div>
                  </div>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                  Stormglide started because we kept watching African businesses get burned — paying for expensive imported software that didn't fit how they work, or getting burned by developers who disappeared after launch.
                </p>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                  We are engineers, designers, and product builders — all from Ghana — who decided the solution was simple: build the software ourselves, for clients who deserve the same quality as any Fortune 500 company.
                </p>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.85, fontSize: '0.95rem' }}>
                  Every system we've shipped is live, running real businesses, and maintained by us today. We don't move on. We stay in.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { Icon: Wrench,       color: 'var(--sg-accent)', bg: 'color-mix(in srgb, var(--sg-accent) 8%, transparent)',  title: 'We build what we promise', desc: 'Every feature we scope, we deliver. Every timeline we give, we hit. If something changes, you hear it from us first — not after the fact.' },
                  { Icon: Phone,        color: 'var(--color-success)', bg: 'color-mix(in srgb, var(--color-success) 8%, transparent)',  title: "We don't disappear",       desc: 'Our WhatsApp is always open. Every system we\'ve ever shipped still has our support. Clients call us two years after launch — and we answer.' },
                  { Icon: Globe2,       color: 'var(--color-success)', bg: 'color-mix(in srgb, var(--color-success) 8%, transparent)', title: 'We understand Africa first', desc: "We've built for Paystack, MTN MoMo, SSNIT, NHIS, and GES. We know how Ghanaian businesses actually operate — and we design for that reality." },
                  { Icon: Monitor,      color: 'var(--color-accent-blue)', bg: 'color-mix(in srgb, var(--color-accent-blue) 8%, transparent)',  title: 'No outsourcing, ever',      desc: 'Every line of code is written by our in-house team. No freelancers, no handoffs to unknown developers, no AI-generated junk. Just our engineers.' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    {...revealItem(i)}
                    style={{ display: 'flex', gap: '1rem', padding: '1.25rem', background: 'var(--glass-bg)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', alignItems: 'flex-start' }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: '10px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <item.Icon size={16} color={item.color} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-heading)', marginBottom: '0.375rem' }}>{item.title}</div>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.83rem', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Meet the team — only shown once real people are added in the admin portal */}
      {team.length > 0 && (
        <div style={{ padding: '5rem 2rem', background: 'var(--glass-bg)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '2.5rem' }}>
              <div className="section-label">MEET THE TEAM</div>
              <WordReveal as="h2" text="The people building your system" style={{ letterSpacing: '-0.02em', maxWidth: '480px' }} />
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {team.map((member, i) => (
                <motion.div
                  key={member.id}
                  {...revealItem(i)}
                  style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', padding: '1.75rem' }}
                >
                  <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', background: 'var(--color-surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    {member.photoDataUri ? (
                      <img src={member.photoDataUri} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <UserRound size={26} color="var(--color-text-secondary)" />
                    )}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-heading)' }}>{member.name}</div>
                  {member.title && <div style={{ fontSize: '0.82rem', color: 'var(--sg-accent)', marginTop: '0.15rem', marginBottom: '0.75rem' }}>{member.title}</div>}
                  {member.bio && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>{member.bio}</p>}
                  {member.linkedinUrl && (
                    <a href={member.linkedinUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.85rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
                      LinkedIn <ArrowUpRight size={14} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Data & security */}
      <div style={{ padding: '5rem 2rem', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-subtle)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '2.5rem' }}>
            <div className="section-label">DATA & SECURITY</div>
            <WordReveal as="h2" text="You're trusting us with payroll, health, and customer data. Here's how we protect it." style={{ letterSpacing: '-0.02em', maxWidth: '520px' }} />
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {SECURITY_POINTS.map((point, i) => (
              <motion.div
                key={point.title}
                {...revealItem(i)}
                style={{ background: 'var(--glass-bg)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', padding: '1.75rem' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'color-mix(in srgb, var(--color-success) 8%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>
                  <Lock size={18} color="var(--color-success)" />
                </div>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.6rem' }}>{point.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.85rem' }}>{point.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Let's build (contact form) ── */}
      <div id="build" style={{ borderTop: '1px solid var(--color-border-subtle)', padding: '5rem 2rem 3rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="section-label">CONTACT</div>
            <WordReveal
              as="h2"
              text="Tell us what you need to build"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '1.25rem', maxWidth: '520px' }}
            />
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '4rem', alignItems: 'start', marginTop: '3rem' }} className="contact-grid">

            {/* ── Form ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
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
            <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' }}>
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
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 2rem 6rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>FAQ</div>
            <WordReveal as="h2" text="Common questions" style={{ fontSize: '1.6rem', letterSpacing: '-0.02em' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '1.25rem' }}>
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                {...revealItem(i)}
                style={{ padding: '1.5rem', background: 'var(--color-surface)', border: '1.5px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)' }}
              >
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.625rem', lineHeight: 1.4, color: 'var(--ink-900)' }}>{faq.q}</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.72, margin: 0 }}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .founder-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </PageLayout>
  )
}
