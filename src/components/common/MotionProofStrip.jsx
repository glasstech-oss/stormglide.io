import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const DEFAULT_VISUALS = [
  {
    name: 'Nexus HRM',
    label: 'HR operations dashboard',
    image: '/images/mockups/webapp.webp',
    tone: 'var(--sg-accent)',
  },
  {
    name: 'Lollarod Commerce',
    label: 'Responsive storefront',
    image: '/images/mockups/website.webp',
    tone: 'var(--color-warning)',
  },
  {
    name: 'SANO Health',
    label: 'Mobile health product',
    image: '/images/mockups/mobile.webp',
    tone: 'var(--color-success)',
  },
  {
    name: 'Nexus Dental',
    label: 'Clinic management workspace',
    image: '/images/mockups/dental.webp',
    tone: 'var(--color-success)',
  },
  {
    name: 'LOU Beauty Hub',
    label: 'Booking and studio flow',
    image: '/images/mockups/cosmetology.webp',
    tone: 'var(--color-accent-coral)',
  },
  {
    name: 'Glasstech',
    label: 'Quote-ready catalog',
    image: '/images/mockups/glasstech.webp',
    tone: 'var(--color-accent-violet)',
  },
]

const PROOF_POINTS = [
  'Interfaces visible before the sales call',
  'Customer-facing site plus backoffice logic',
  'Built with responsive, touch-first flows',
]

export default function MotionProofStrip({
  eyebrow = 'MOTION PROOF',
  title = 'Less telling. More showing.',
  body = 'Software and websites should be inspectable. This section turns the portfolio into moving interface proof instead of another wall of paragraphs.',
  ctaLabel = 'Explore the work',
  ctaHref = '/work',
  visuals = DEFAULT_VISUALS,
}) {
  return (
    <section className="sg-motion-proof" data-motion="reveal">
      <div className="sg-motion-proof-copy">
        <div className="section-label">{eyebrow}</div>
        <h2>{title}</h2>
        <p>{body}</p>
        <div className="sg-motion-proof-points">
          {PROOF_POINTS.map(point => (
            <span key={point}>
              <CheckCircle2 size={15} />
              {point}
            </span>
          ))}
        </div>
        <Link to={ctaHref} className="btn-primary">
          {ctaLabel} <ArrowRight size={15} />
        </Link>
      </div>

      <div className="sg-motion-proof-stage">
        <div className="sg-motion-proof-rail" data-motion="image-rail">
          {visuals.map((visual, index) => (
            <figure
              className={`sg-motion-proof-card ${index % 3 === 1 ? 'is-lower' : ''}`}
              key={visual.name}
              style={{ '--motion-tone': visual.tone }}
              data-motion="parallax"
              data-speed={index % 2 === 0 ? '0.28' : '0.16'}
            >
              <div className="sg-motion-proof-browser">
                <span />
                <span />
                <span />
                <small>{visual.name.toLowerCase().replaceAll(' ', '-')}</small>
              </div>
              <img src={visual.image} alt={`${visual.name} interface preview`} loading="lazy" decoding="async" />
              <figcaption>
                <strong>{visual.name}</strong>
                <span>{visual.label}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <style>{`
        .sg-motion-proof {
          position: relative;
          display: grid;
          grid-template-columns: minmax(280px, 0.7fr) minmax(0, 1.3fr);
          gap: clamp(2rem, 5vw, 5rem);
          align-items: start;
          padding: 5rem 2rem;
          border-top: 1px solid var(--color-border-subtle);
          border-bottom: 1px solid var(--color-border-subtle);
          background: var(--color-surface);
          overflow: hidden;
        }

        .sg-motion-proof-copy {
          max-width: 420px;
        }

        .sg-motion-proof-copy h2 {
          margin: 1rem 0 1rem;
          font-size: clamp(2rem, 4.5vw, 4rem);
          line-height: 0.98;
          letter-spacing: 0;
        }

        .sg-motion-proof-copy p {
          color: var(--color-text-secondary);
          font-size: 1rem;
          line-height: 1.72;
          margin-bottom: 1.25rem;
        }

        .sg-motion-proof-points {
          display: grid;
          gap: 0.65rem;
          margin-bottom: 1.6rem;
        }

        .sg-motion-proof-points span {
          display: flex;
          align-items: flex-start;
          gap: 0.55rem;
          color: var(--color-text-primary);
          font-size: 0.88rem;
          line-height: 1.45;
        }

        .sg-motion-proof-points svg {
          color: var(--sg-accent);
          flex: 0 0 auto;
          margin-top: 0.15rem;
        }

        .sg-motion-proof-stage {
          min-width: 0;
          perspective: 1200px;
          overflow: hidden;
        }

        .sg-motion-proof-rail {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          width: max-content;
          max-width: none;
          padding: 0.75rem 2rem 1.25rem 0;
          will-change: transform;
        }

        .sg-motion-proof-card {
          width: min(58vw, 390px);
          flex: 0 0 auto;
          margin: 0;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--motion-tone) 25%, var(--color-border-subtle));
          border-radius: 8px;
          background: var(--color-background);
          box-shadow: var(--shadow-md);
          transform-style: preserve-3d;
          will-change: transform;
        }

        .sg-motion-proof-card.is-lower {
          margin-top: 3.5rem;
        }

        .sg-motion-proof-browser {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.65rem 0.8rem;
          border-bottom: 1px solid var(--color-border-subtle);
          background: var(--color-surface);
        }

        .sg-motion-proof-browser span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--motion-tone);
          opacity: 0.55;
        }

        .sg-motion-proof-browser small {
          margin-left: 0.35rem;
          color: var(--color-text-secondary);
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.08em;
        }

        .sg-motion-proof-card img {
          display: block;
          width: 100%;
          height: 255px;
          object-fit: cover;
          object-position: top;
          background: var(--color-surface-alt);
        }

        .sg-motion-proof-card figcaption {
          display: grid;
          gap: 0.2rem;
          padding: 0.9rem 1rem 1rem;
        }

        .sg-motion-proof-card strong {
          color: var(--color-text-heading);
          font-family: var(--font-display);
          font-size: 0.98rem;
          line-height: 1.1;
        }

        .sg-motion-proof-card span {
          color: var(--color-text-secondary);
          font-size: 0.78rem;
        }

        @media (max-width: 919px) {
          .sg-motion-proof {
            grid-template-columns: 1fr;
            padding: 3.5rem 1rem;
          }

          .sg-motion-proof-copy {
            max-width: 620px;
          }

          .sg-motion-proof-rail {
            width: 100%;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding: 0.5rem 1rem 1rem 0;
            -webkit-overflow-scrolling: touch;
          }

          .sg-motion-proof-card {
            width: min(82vw, 360px);
            scroll-snap-align: start;
          }

          .sg-motion-proof-card.is-lower {
            margin-top: 0;
          }

          .sg-motion-proof-card img {
            height: 230px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sg-motion-proof-rail,
          .sg-motion-proof-card {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}
