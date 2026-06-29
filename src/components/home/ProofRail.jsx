import { MapPin, Monitor, PanelsTopLeft, Smartphone } from 'lucide-react'

const PROOF_ITEMS = [
  { icon: MapPin, title: 'Accra, Ghana', label: 'Built close to the work' },
  { icon: PanelsTopLeft, title: 'Business systems', label: 'Operations, people and data' },
  { icon: Monitor, title: 'Web platforms', label: 'Fast, responsive and maintainable' },
  { icon: Smartphone, title: 'Mobile products', label: 'Designed for daily use' },
]

export default function ProofRail() {
  return (
    <section className="sg-proof-rail" aria-label="Stormglide capabilities">
      <div className="sg-proof-rail-inner">
        {PROOF_ITEMS.map(({ icon: Icon, title, label }) => (
          <div className="sg-proof-item" key={title}>
            <Icon size={18} />
            <span>
              <strong>{title}</strong>
              <small>{label}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
