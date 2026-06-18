import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Activity, Shield, Share2 } from 'lucide-react'

function PulsingHeart() {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
        style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,77,109,0.2)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
      >
        <Heart size={28} color="#FF4D6D" fill="#FF4D6D" />
      </motion.div>
    </div>
  )
}

function CircleProgress({ value, max, color, label }) {
  const pct = value / max
  const r = 36
  const circ = 2 * Math.PI * r
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="var(--color-border-subtle)" strokeWidth="6" />
        <circle
          cx="45" cy="45" r={r} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="45" y="50" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">{value}</text>
      </svg>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-secondary)' }}>{label}</span>
    </div>
  )
}

export default function SANODemo() {
  const [screen, setScreen] = useState('welcome')

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '420px', padding: '1rem', background: '#07101C' }}>
      <AnimatePresence mode="wait">
        {screen === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ textAlign: 'center', maxWidth: 320 }}
          >
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,200,150,0.15)', border: '2px solid rgba(0,200,150,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Heart size={32} color="var(--color-success)" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--color-text-heading)', marginBottom: '0.5rem' }}>SANO Health</div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>Your health, in your hands.</p>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setScreen('dashboard')}>
              Get Started
            </button>
          </motion.div>
        )}

        {screen === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', maxWidth: 380 }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-heading)', marginBottom: '1.25rem' }}>Health Dashboard</div>

            {/* Heart rate */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)', padding: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <PulsingHeart />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-text-heading)' }}>72 <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>bpm</span></div>
                <div style={{ color: 'var(--color-success)', fontSize: '0.75rem' }}>Normal range</div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)', padding: '1rem', textAlign: 'center' }}>
                <CircleProgress value={85} max={100} color="var(--color-accent-cyan)" label="Health Score" />
              </div>
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={12} color="var(--color-accent-violet)" />
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.7rem' }}>Last Scan</span>
                </div>
                <div style={{ color: 'var(--color-text-primary)', fontSize: '0.8rem', fontWeight: 600 }}>3 days ago</div>
                <span style={{ color: 'var(--color-success)', fontSize: '0.7rem' }}>Normal</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[['Scan Now', 'var(--color-accent-cyan)'], ['View History', 'var(--color-accent-violet)'], ['Share', 'var(--color-success)']].map(([label, color]) => (
                <button key={label} style={{ flex: 1, background: `${color}15`, border: `1px solid ${color}40`, borderRadius: '8px', padding: '0.625rem', color, fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
