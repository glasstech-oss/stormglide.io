import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, BarChart3, Database, FileSpreadsheet, MessageCircle, Zap } from 'lucide-react'
import WordReveal from '../common/WordReveal'

const INPUTS = [
  { icon: MessageCircle, title: 'Customer messages', detail: 'Requests, updates, approvals' },
  { icon: FileSpreadsheet, title: 'Spreadsheets', detail: 'Records, calculations, reporting' },
  { icon: Database, title: 'Disconnected data', detail: 'Teams working without context' },
]

const LOG_TEMPLATES = [
  'Invoice #{n} approved — GHS {amt}',
  'New lead synced from WhatsApp',
  'Payroll batch {n} reconciled',
  'Inventory check-in — {n} units',
  'Client portal: request #{n} closed',
  'Report generated — {n} records',
  'Staff clock-in synced',
  'Paystack webhook confirmed',
]

let logId = 0
function makeLogLine() {
  const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)]
  const text = template
    .replace('{n}', Math.floor(100 + Math.random() * 900))
    .replace('{amt}', (Math.random() * 4000 + 200).toFixed(0))
  logId += 1
  return { id: logId, text }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

let barId = 0
function makeBar(prevValue) {
  const drift = (Math.random() - 0.45) * 30
  barId += 1
  return { id: barId, value: clamp(Math.round((prevValue ?? 55) + drift), 18, 98) }
}

/** A live-feeling number: ticks toward a new random target every interval
    instead of snapping, so it reads as a value actually being measured.
    Freezes at its starting value under prefers-reduced-motion. */
function useLiveMetric(min, max, intervalMs, reduceMotion) {
  const [value, setValue] = useState(() => Math.round((min + max) / 2))
  useEffect(() => {
    if (reduceMotion) return undefined
    const id = setInterval(() => {
      setValue(v => clamp(v + Math.round((Math.random() - 0.5) * (max - min) * 0.3), min, max))
    }, intervalMs)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max, intervalMs])
  return value
}

function LiveBadge() {
  return (
    <span className="sg-flow-live-badge">
      <span className="sg-flow-live-dot" />
      Live
    </span>
  )
}

function SyncRing({ percent }) {
  const radius = 15.5
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - percent / 100)
  return (
    <div className="sg-flow-ring" role="img" aria-label={`System sync ${percent}%`}>
      <svg viewBox="0 0 36 36">
        <circle className="sg-flow-ring-track" cx="18" cy="18" r={radius} />
        <circle
          className="sg-flow-ring-value"
          cx="18" cy="18" r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="sg-flow-ring-sweep" aria-hidden="true" />
      <strong>{percent}%</strong>
    </div>
  )
}

export default function OperationsFlow() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  // Pause every live ticker while the section is off-screen. Background tabs
  // throttle rAF but not intervals the same way, so exit animations stall
  // while new bars keep arriving — the chart accumulated 100+ bar elements
  // in production before this gate existed.
  const inView = useInView(sectionRef, { amount: 0.15 })
  const paused = reduceMotion || !inView
  const openWork = useLiveMetric(28, 61, 1400, paused)
  const approvals = useLiveMetric(4, 19, 1900, paused)
  const throughput = useLiveMetric(120, 340, 700, paused)
  const syncPercent = useLiveMetric(72, 99, 2200, paused)

  const [bars, setBars] = useState(() => {
    const seed = [42, 68, 54, 82, 72, 94, 61, 77, 58]
    return seed.map(v => ({ id: (barId += 1), value: v }))
  })
  const [logLines, setLogLines] = useState(() => [makeLogLine(), makeLogLine(), makeLogLine()])

  useEffect(() => {
    if (paused) return undefined
    const id = setInterval(() => {
      setBars(prev => {
        // hard cap: slice from the end so the array can never grow past its
        // seed length even if a tick races an exit animation
        const last = prev[prev.length - 1]
        return [...prev, makeBar(last?.value)].slice(-9)
      })
    }, 1100)
    return () => clearInterval(id)
  }, [paused])

  useEffect(() => {
    if (paused) return undefined
    const id = setInterval(() => {
      setLogLines(prev => [...prev, makeLogLine()].slice(-3))
    }, 1900)
    return () => clearInterval(id)
  }, [paused])

  return (
    <section className="sg-operations-section" ref={sectionRef}>
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
            <span className="sg-flow-scan" aria-hidden="true" />
            <div className="sg-flow-output-head">
              <span>Stormglide system</span>
              <LiveBadge />
            </div>
            <div className="sg-flow-output-grid">
              <div>
                <small>Open work</small>
                <strong><AnimatedNumber value={openWork} /></strong>
              </div>
              <div>
                <small>Approvals</small>
                <strong><AnimatedNumber value={approvals} /></strong>
              </div>
              <div className="sg-flow-metric-row">
                <SyncRing percent={syncPercent} />
                <div className="sg-flow-throughput">
                  <small>Requests / min</small>
                  <strong><AnimatedNumber value={throughput} /></strong>
                  <span className="sg-flow-sparkline" aria-hidden="true">
                    {bars.slice(-5).map(bar => (
                      <i key={bar.id} style={{ height: `${18 + bar.value * 0.18}%` }} />
                    ))}
                  </span>
                </div>
              </div>
              <div className="sg-flow-chart" aria-hidden="true">
                <AnimatePresence initial={false} mode="popLayout">
                  {bars.map(bar => (
                    <motion.span
                      key={bar.id}
                      layout
                      initial={{ opacity: 0, scaleY: 0.2 }}
                      animate={{ opacity: 1, scaleY: 1, height: `${bar.value}%` }}
                      exit={{ opacity: 0, scaleY: 0.2 }}
                      transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.32, 0.72, 0, 1] }}
                    />
                  ))}
                </AnimatePresence>
              </div>
              <div className="sg-flow-log">
                <small>Activity</small>
                <AnimatePresence initial={false} mode="popLayout">
                  {logLines.map(line => (
                    <motion.div
                      key={line.id}
                      className="sg-flow-log-line"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: reduceMotion ? 0 : 0.35 }}
                    >
                      {line.text}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AnimatedNumber({ value }) {
  return (
    <span className="sg-flow-number">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
