import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useLayoutEffect, useRef } from 'react'
import {
  CalendarCheck,
  FileSpreadsheet,
  FileText,
  MessageCircle,
  Receipt,
  Users,
  Wallet,
} from 'lucide-react'
import { useActivePanelNode } from '../../lib/panelRegistry'

/* The scroll world: a tall (300vh) section with a sticky viewport. As the
   visitor scrolls, the scattered fragments a business actually runs on —
   WhatsApp threads, spreadsheet cells, paper invoices — fly in from the
   edges and assemble into one Stormglide dashboard, which switches on.
   The pitch, enacted by the visitor's own thumb. */

const FRAGMENTS = [
  { id: 'wa1', icon: MessageCircle, label: 'Customer WhatsApp', from: { x: -420, y: -180, r: -18 } },
  { id: 'xl1', icon: FileSpreadsheet, label: 'Sales.xlsx', from: { x: 430, y: -220, r: 14 } },
  { id: 'inv', icon: Receipt, label: 'Paper invoices', from: { x: -480, y: 140, r: -10 } },
  { id: 'py', icon: Wallet, label: 'Payroll notebook', from: { x: 470, y: 120, r: 16 } },
  { id: 'bk', icon: CalendarCheck, label: 'Bookings diary', from: { x: -300, y: 320, r: 8 } },
  { id: 'st', icon: Users, label: 'Staff records', from: { x: 330, y: 300, r: -14 } },
  { id: 'rp', icon: FileText, label: 'Month-end reports', from: { x: 0, y: -360, r: 6 } },
]

const PANEL_STATS = [
  { label: 'Invoiced this month', value: 'GHS 48,200' },
  { label: 'Bookings this week', value: '136' },
  { label: 'Payroll status', value: 'Reconciled' },
  { label: 'Open requests', value: '5' },
]

function Fragment({ fragment, progress, reduceMotion }) {
  const { from } = fragment
  // Each fragment flies from its scattered position to the dashboard center
  // over the first two-thirds of the scroll, then fades as the dashboard takes over.
  const x = useTransform(progress, [0.05, 0.62], [from.x, 0])
  const y = useTransform(progress, [0.05, 0.62], [from.y, 0])
  const rotate = useTransform(progress, [0.05, 0.62], [from.r, 0])
  const opacity = useTransform(progress, [0, 0.08, 0.58, 0.68], [0, 1, 1, 0])
  const scale = useTransform(progress, [0.05, 0.62], [1, 0.55])
  const Icon = fragment.icon

  if (reduceMotion) return null

  return (
    <motion.div className="sg-story-fragment" style={{ x, y, rotate, opacity, scale }}>
      <Icon size={15} />
      {fragment.label}
    </motion.div>
  )
}

export default function ScrollStory() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const panelContainerRef = useRef(null)
  const activePanelNode = useActivePanelNode()
  useLayoutEffect(() => {
    panelContainerRef.current = activePanelNode
  }, [activePanelNode])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: panelContainerRef,
    offset: ['start start', 'end end'],
  })

  // The dashboard materialises as the fragments arrive, then "switches on".
  const dashOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1])
  const dashScale = useTransform(scrollYProgress, [0.3, 0.62, 0.8], [0.86, 1, 1])
  const liveOpacity = useTransform(scrollYProgress, [0.66, 0.78], [0, 1])
  const headStart = useTransform(scrollYProgress, [0, 0.24], [1, 0])
  const headEnd = useTransform(scrollYProgress, [0.66, 0.8], [0, 1])

  return (
    <section className="sg-story" ref={sectionRef} data-static={reduceMotion || undefined}>
      <div className="sg-story-sticky">
        <motion.p className="sg-story-line sg-story-line-start" style={reduceMotion ? undefined : { opacity: headStart }}>
          Right now, your business lives in pieces.
        </motion.p>

        <div className="sg-story-stage" aria-hidden="true">
          {FRAGMENTS.map(fragment => (
            <Fragment key={fragment.id} fragment={fragment} progress={scrollYProgress} reduceMotion={reduceMotion} />
          ))}

          <motion.div
            className="sg-story-dashboard"
            style={reduceMotion ? undefined : { opacity: dashOpacity, scale: dashScale }}
          >
            <div className="sg-story-dashboard-bar">
              <i /><i /><i />
              <small>app.stormglide.io</small>
            </div>
            <div className="sg-story-dashboard-head">
              <strong>Your business, in one place</strong>
              <motion.span className="sg-story-live" style={reduceMotion ? undefined : { opacity: liveOpacity }}>
                <i /> LIVE
              </motion.span>
            </div>
            <div className="sg-story-dashboard-grid">
              {PANEL_STATS.map(stat => (
                <div key={stat.label}>
                  <small>{stat.label}</small>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.p className="sg-story-line sg-story-line-end" style={reduceMotion ? undefined : { opacity: headEnd }}>
          One system. Built for how you already work.
        </motion.p>
      </div>
    </section>
  )
}
