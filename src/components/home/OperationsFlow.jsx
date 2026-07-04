import { ArrowRight, BarChart3, Database, FileSpreadsheet, MessageCircle, Zap } from 'lucide-react'
import WordReveal from '../common/WordReveal'

const INPUTS = [
  { icon: MessageCircle, title: 'Customer messages', detail: 'Requests, updates, approvals' },
  { icon: FileSpreadsheet, title: 'Spreadsheets', detail: 'Records, calculations, reporting' },
  { icon: Database, title: 'Disconnected data', detail: 'Teams working without context' },
]

export default function OperationsFlow() {
  return (
    <section className="sg-operations-section">
      <div className="sg-home-container sg-operations-layout">
        <div className="sg-operations-copy">
          <span className="sg-home-section-label">From fragmented to visible</span>
          <WordReveal text="One operating system, not another disconnected tool." />
          <p>We map the workflow first, then connect the people, data and decisions that keep the business moving.</p>
          <div className="sg-operations-outcomes">
            <span><Zap size={16} /> Faster handoffs</span>
            <span><BarChart3 size={16} /> Clearer decisions</span>
          </div>
        </div>

        <div className="sg-flow-diagram" aria-label="Operational information flowing into one Stormglide system">
          <div className="sg-flow-inputs">
            {INPUTS.map(({ icon: Icon, title, detail }) => (
              <div className="sg-flow-input" key={title}>
                <Icon size={18} />
                <span><strong>{title}</strong><small>{detail}</small></span>
              </div>
            ))}
          </div>

          <div className="sg-flow-connector" aria-hidden="true">
            <ArrowRight size={20} />
          </div>

          <div className="sg-flow-output">
            <div className="sg-flow-output-head">
              <span>Stormglide system</span>
              <small>Live workspace</small>
            </div>
            <div className="sg-flow-output-grid">
              <div><small>Open work</small><strong>Visible</strong></div>
              <div><small>Approvals</small><strong>Tracked</strong></div>
              <div className="sg-flow-chart" aria-hidden="true">
                {[42, 68, 54, 82, 72, 94].map((height, index) => (
                  <span key={index} style={{ '--bar-height': `${height}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
