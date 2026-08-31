import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Globe, Zap, ShoppingCart, BarChart3, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/common/SectionHeader'
import PageLayout from '../components/layout/PageLayout'

export default function ServiceLandingWebsiteDevelopment() {
  return (
    <PageLayout>

      {/* Hero */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ marginBottom: '1rem', color: 'var(--sg-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              Web Development for Ghana
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              Professional Websites for Ghanaian Businesses
            </h1>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
              Custom-designed, fast-loading websites that convert visitors into customers. E-commerce, corporate, portfolios — all optimized for Ghana market with local payment integration.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 160ms ease' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                Get Your Website <ArrowRight size={16} />
              </Link>
              <a href="#why-us" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'color-mix(in srgb, var(--color-surface) 38%, transparent)', color: 'var(--color-text-heading)', border: '1px solid var(--color-border-subtle)', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 160ms ease' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                See Our Work
              </a>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', border: '1px solid color-mix(in srgb, var(--sg-accent) 22%, transparent)', borderRadius: 'var(--radius)', background: 'color-mix(in srgb, var(--sg-accent) 8%, transparent)', color: 'var(--color-text-secondary)', padding: '0.72rem 0.9rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.03em' }}>
              <span style={{ color: 'var(--sg-accent)', fontWeight: 700 }}>✓ SERVING GHANA SINCE 2021</span> • Custom-built • Fast loading
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problems Section */}
      <section id="why-us" style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="The Problem" title="Why Most Websites Fail" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { icon: Globe, title: 'Generic Website Builders', desc: 'Wix and Squarespace look the same. Your competitors use them too. No competitive advantage.' },
              { icon: Zap, title: 'Slow Loading Speed', desc: 'Websites built with templates load slowly on Ghana\'s internet. Visitors leave before your site loads.' },
              { icon: ShoppingCart, title: 'Payment Problems', desc: 'Off-the-shelf solutions don\'t integrate with Paystack, MTN MoMo, or Vodafone Cash. You lose sales.' },
              { icon: BarChart3, title: 'No SEO Optimization', desc: 'Generic websites don\'t rank on Google. Customers never find you. Expensive ads become your only option.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '14px', background: 'var(--bg-soft)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'color-mix(in srgb, var(--sg-accent) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--sg-accent) 28%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <item.icon size={24} color="var(--sg-accent)" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Build */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Solutions" title="What We Build" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { icon: ShoppingCart, title: 'E-Commerce Websites', desc: 'Sell online with Paystack, MTN MoMo, Vodafone Cash. Product catalog, shopping cart, order management. Start selling in 4-6 weeks.' },
              { icon: Globe, title: 'Corporate Websites', desc: 'Professional business websites that build credibility. Showcase your team, services, and expertise. Mobile-first design.' },
              { icon: BarChart3, title: 'Service Websites', desc: 'For consultants, agencies, service providers. Portfolio, testimonials, booking system. Show why you\'re different.' },
              { icon: Smartphone, title: 'Portfolio Websites', desc: 'Showcase your work. Artists, photographers, designers. Beautiful galleries, case studies, client testimonials.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '14px', background: 'var(--glass-bg)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'color-mix(in srgb, var(--sg-accent) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--sg-accent) 28%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <item.icon size={24} color="var(--sg-accent)" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Every Website Includes" title="Built-In Features" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Performance & Design</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Mobile-friendly (90% users on mobile)', 'Fast loading (optimized for slow connections)', 'Modern, professional design', 'SEO optimized (show up on Google)', 'Works on all devices'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle size={20} color="var(--sg-accent)" style={{ flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Business Features</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Paystack + local payment integration', 'Admin dashboard (easy updates)', 'Analytics (track visitors)', 'Secure & HTTPS encrypted', 'Support & maintenance included'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle size={20} color="var(--sg-accent)" style={{ flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Our Process" title="How We Work" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { num: '1', title: 'Discovery', desc: 'We learn about your business, goals, and target customers' },
              { num: '2', title: 'Design', desc: 'Create mockups showing how your website will look' },
              { num: '3', title: 'Development', desc: 'Build the website, integrate payments, optimize for speed' },
              { num: '4', title: 'Testing', desc: 'Test on phones, tablets, and computers' },
              { num: '5', title: 'Launch', desc: 'Deploy to web, set up domain, configure analytics' },
              { num: '6', title: 'Support', desc: 'Ongoing maintenance, updates, and improvements' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'center', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'var(--glass-bg)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--sg-accent)', marginBottom: '0.5rem' }}>{item.num}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Investment" title="What You Get, Scoped to You" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { title: 'Starter', desc: 'A focused site for a business that needs a strong first impression online.', items: ['Up to 5 pages', 'Mobile responsive', 'SEO optimized', 'Contact form', 'Support for 3 months'] },
              { title: 'Standard', desc: 'For businesses ready to sell and grow online.', items: ['Up to 10 pages', 'E-commerce ready', 'Payment integration', 'Analytics setup', 'Support for 6 months'] },
              { title: 'Advanced', desc: 'Custom builds for businesses with specific integration or workflow needs.', items: ['Custom design', 'Advanced features', 'API integrations', 'Extended support', 'Room to grow'] },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '14px', background: 'var(--bg-soft)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>{item.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {item.items.map((feature, j) => (
                    <li key={j} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                      <CheckCircle size={20} color="var(--sg-accent)" style={{ flexShrink: 0 }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
            All websites include domain, hosting, and SSL — we'll scope your project and send a custom quote before any work begins.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Real Client Work" title="Websites We've Actually Built" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))', gap: '2rem' }}>
            {[
              // Real clients, real scope — pulled from src/data/clientWork.js.
              // No invented metrics: we don't have before/after numbers for
              // these, so "Result" states what shipped and when, not a
              // percentage or multiplier nobody measured.
              { name: 'Lollarod Enterprise', slug: 'lollarod-enterprise', industry: 'Fine Home & Interior Products', before: 'Selling across 3 showrooms with no online catalog or wholesale pricing', after: 'A 200+ SKU e-commerce platform with Paystack checkout and an admin backoffice with sales analytics and inventory tracking', result: 'Live since 2023' },
              { name: 'Green Gold Gardens', slug: 'green-gold-gardens', industry: 'Nursery, Landscaping & Design', before: 'Running the business through WhatsApp — no catalog, no repeat-customer tracking', after: 'A live plant catalog, bookable design services, staff payroll, and a CRM tracking every repeat customer', result: 'Live since 2025' },
              { name: 'KenteHaul', slug: 'kente-haul', industry: 'Fashion & Heritage Retail', before: 'No dedicated online store for authentic Kente and Fugu products', after: 'A full e-commerce platform with wishlist, order tracking, and heritage content alongside the shop', result: 'Live since 2025' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '14px', background: 'var(--glass-bg)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>{item.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--sg-accent)', fontWeight: 600, marginBottom: '1rem' }}>{item.industry}</p>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}><strong>Before:</strong> {item.before}</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}><strong>After:</strong> {item.after}</p>
                </div>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--sg-accent)', marginBottom: '0.75rem' }}>{item.result}</p>
                <Link to={`/work/${item.slug}`} style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-heading)', textDecoration: 'none' }}>
                  View case study →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--glass-bg)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <SectionHeader label="Questions" title="Website FAQ" alignment="center" />
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { q: 'How long does it take to build a website?', a: 'Basic websites: 4-6 weeks. E-commerce sites: 6-8 weeks. Complex sites: 8-12 weeks. We provide a timeline before starting.' },
              { q: 'Do you help with domain and hosting?', a: 'Yes. We handle everything. You just need to focus on your business. Domain registration and hosting are included.' },
              { q: 'Can you help with online payments?', a: 'Absolutely. We integrate Paystack, MTN MoMo, and Vodafone Cash. Your customers can pay however they prefer.' },
              { q: 'Will my website show up on Google?', a: 'Yes. All our websites are SEO optimized to rank on Google. We also provide guidance on getting more visibility.' },
              { q: 'What if I want to make changes later?', a: 'Easy. You\'ll have an admin dashboard to update content. We provide training and ongoing support for any questions.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'var(--bg-soft)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text-heading)' }}>{item.q}</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', margin: 0 }}>{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Ready to Get Online?</h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>Let's build a website that grows your business. Free consultation to discuss your goals and provide a quote.</p>
          <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.75rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', cursor: 'pointer' }}>
            Schedule Free Consultation <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}
