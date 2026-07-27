import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

/* Minimalist hero: one statement, one action pair, one product frame.
   The triple-mockup carousel this replaced now lives only on /work —
   the hero's job is the sentence, not a product tour. */
export default function Hero() {
  const { activeVariant, theme } = useTheme()
  const whatsappPhone = theme.contactWhatsapp.replace(/[^0-9]/g, '').replace(/^0/, '233')

  return (
    <section className="sg-home-hero" data-variant={activeVariant.id}>
      <div className="sg-home-hero-inner">
        <div className="sg-home-hero-copy">
          <motion.div
            className="sg-home-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="sg-home-status-dot" />
            Business Systems Studio
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            One system <em>instead of six tools.</em>
          </motion.h1>

          <motion.p
            className="sg-home-hero-body"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Spreadsheets, chat groups, paper files, and three apps that don't talk to each other. We design, build, and run the single system that replaces all of it — customers, staff, inventory, payments, and reporting in one dashboard your team will actually use.
          </motion.p>

          <motion.div
            className="sg-home-hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
          >
            <Link to="/products" className="btn-primary">
              See our products <ArrowRight size={16} />
            </Link>
            <Link to="/price-estimator" className="sg-home-text-link">
              Start a project <ArrowRight size={15} />
            </Link>
          </motion.div>

          <motion.div
            className="sg-home-location"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.38 }}
          >
            <MapPin size={14} />
            Built in Accra — working with clients across time zones
            <span aria-hidden="true" style={{ opacity: 0.4 }}> · </span>
            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: 'inherit' }}
            >
              Chat on WhatsApp <ArrowUpRight size={12} />
            </a>
          </motion.div>
        </div>

        <motion.div
          className="sg-home-product-stage sg-home-product-stage-minimal"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="sg-stage-frame sg-stage-window sg-stage-window-main is-active is-static">
            <span className="sg-stage-window-bar">
              <i /><i /><i />
              <small>operations.stormglide.io</small>
            </span>
            <img
              src="/images/mockups/webapp.webp"
              width="1024"
              height="662"
              alt="Business operations dashboard built by Stormglide"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
