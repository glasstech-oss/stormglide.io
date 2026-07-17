import { ArrowRight, Code2, Handshake, MapPin, Route } from 'lucide-react'
import WordReveal from '../common/WordReveal'
import { Link } from 'react-router-dom'

const COMMITMENTS = [
  { icon: Handshake, title: 'Direct collaboration', text: 'You work with the people designing and building the system.' },
  { icon: Code2, title: 'Clear ownership', text: 'Your software and business data remain your operational assets.' },
  { icon: Route, title: 'Workflow before features', text: 'The system follows the work instead of forcing a generic template.' },
]

export default function TrustBand() {
  return (
    <section className="sg-trust-section">
      <div className="sg-home-container sg-trust-layout">
        <div className="sg-trust-intro">
          <span className="sg-home-section-label">Trust through the work</span>
          <WordReveal text="Built close to the problem." />
          <p>Stormglide is based in Accra. We build for the infrastructure, payment methods and operational realities our customers use every day.</p>
          <div className="sg-trust-location"><MapPin size={16} /> Accra, Ghana</div>
          <Link to="/contact" className="sg-home-text-link">
            How we work <ArrowRight size={15} />
          </Link>
        </div>

        <div className="sg-trust-commitments">
          {COMMITMENTS.map(({ icon: Icon, title, text }, index) => (
            <div className="sg-trust-commitment" key={title}>
              <span className="sg-trust-index">0{index + 1}</span>
              <Icon size={19} />
              <div><h3>{title}</h3><p>{text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
