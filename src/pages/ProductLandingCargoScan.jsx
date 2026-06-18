import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, CheckCircle, Truck, BarChart3, Navigation, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/common/SectionHeader'
import PageLayout from '../components/layout/PageLayout'

export default function CargoScanLanding() {
  return (
    <PageLayout>
      <Helmet>
        <title>CargoScan: Logistics & Supply Chain Tracking Software</title>
        <meta name="description" content="CargoScan is a production-grade logistics tracking platform for African supply chains. Real-time cargo tracking, route optimization, and delivery management. Live since 2021." />
        <meta name="keywords" content="logistics software, supply chain management, cargo tracking, fleet management, delivery tracking, logistics platform" />
        <meta property="og:title" content="CargoScan - Logistics Platform" />
        <meta property="og:description" content="Real-time logistics and supply chain tracking for African businesses" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Hero */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ marginBottom: '1rem', color: 'var(--sg-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              Logistics & Supply Chain
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              CargoScan
            </h1>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
              Production-grade logistics platform with real-time cargo tracking, route optimization, and delivery management. Live since 2021. Serving 30+ logistics companies across Africa.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 160ms ease' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                Request Demo <ArrowRight size={16} />
              </Link>
              <a href="#features" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.95rem 1.45rem', background: 'color-mix(in srgb, var(--color-surface) 38%, transparent)', color: 'var(--color-text-heading)', border: '1px solid var(--color-border-subtle)', borderRadius: '999px', fontWeight: 800, fontSize: '0.94rem', textDecoration: 'none', cursor: 'pointer', transition: 'transform 160ms ease' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                Learn More
              </a>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem', border: '1px solid color-mix(in srgb, var(--sg-accent) 22%, transparent)', borderRadius: 'var(--radius)', background: 'color-mix(in srgb, var(--sg-accent) 8%, transparent)', color: 'var(--color-text-secondary)', padding: '0.72rem 0.9rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.03em' }}>
              <span style={{ color: 'var(--sg-accent)', fontWeight: 700 }}>✓ LIVE PRODUCT</span> • 30+ logistics companies • Real-time tracking
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Core Capabilities" title="What CargoScan Does" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { icon: Navigation, title: 'Real-time Tracking', desc: 'GPS-enabled cargo tracking with live map, geofencing, and alerts' },
              { icon: Truck, title: 'Fleet Management', desc: 'Manage vehicles, drivers, routes, and maintenance schedules' },
              { icon: BarChart3, title: 'Performance Analytics', desc: 'Track delivery times, fuel costs, and driver performance metrics' },
              { icon: AlertCircle, title: 'Alerts & Notifications', desc: 'Instant alerts for delays, arrivals, deviations, and exceptions' },
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

      {/* Results / Impact */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Real Results" title="Impact for Our Customers" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))', gap: '2rem' }}>
            {[
              { number: '30+', label: 'Active logistics companies' },
              { number: '80%', label: 'Reduction in delivery delays' },
              { number: '12 min', label: 'Order fulfillment time (down from 2hrs)' },
              { number: '15 countries', label: 'Tracked across Africa' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 700, color: 'var(--sg-accent)', marginBottom: '0.5rem' }}>{item.number}</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeader label="Technology" title="Built for Supply Chain at Scale" alignment="left" maxWidth="700px" />
          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Real-time Capabilities</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Live GPS tracking every 30 seconds', 'Offline-capable mobile apps', 'Automated route optimization', 'Multi-vehicle coordination', 'Incident notifications in real-time'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle size={20} color="var(--sg-accent)" style={{ flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Integration & Automation</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['SMS and WhatsApp driver communications', 'Customer delivery notifications', 'ERP and WMS system integration', 'Fuel consumption optimization', 'Scalable to 1000+ vehicles'].map((item, i) => (
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

      {/* FAQ */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--bg-soft)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <SectionHeader label="Questions" title="Frequently Asked" alignment="center" />
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { q: 'Can CargoScan work in areas with poor connectivity?', a: 'Yes. CargoScan is built for African infrastructure. Mobile apps work offline and sync when connectivity returns. GPS data is cached and sent batch-wise.' },
              { q: 'How accurate is the GPS tracking?', a: 'Real-time GPS updates every 30 seconds with ±5 meter accuracy in open areas. Geofencing alerts trigger within 50m of defined zones.' },
              { q: 'Can drivers use basic phones?', a: 'Yes. Drivers can receive SMS updates and communicate via basic phones. The full app requires Android (iOS coming soon).' },
              { q: 'How do I integrate with my existing ERP?', a: 'CargoScan provides REST API and direct database integration. Most integrations are completed in 1-2 weeks. Support for SAP, Oracle, and custom systems.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'var(--color-background)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text-heading)' }}>{item.q}</h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', margin: 0 }}>{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: 'calc(var(--section-padding) * 1.2) 2rem', background: 'var(--color-background)', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>Ready to transform your supply chain?</h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>Join 30+ logistics companies using CargoScan for real-time tracking, route optimization, and delivery management.</p>
          <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.75rem', background: 'var(--sg-accent)', color: 'var(--color-background)', border: 'none', borderRadius: '999px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', cursor: 'pointer' }}>
            Schedule a Demo <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}
