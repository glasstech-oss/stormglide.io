import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

const ADMIN_PASSWORD = 'stormglide2025'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('stormglide_admin_auth', 'true')
      navigate('/admin')
    } else {
      setError('Incorrect password. Try again.')
      setPassword('')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}
      >
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-accent-blue) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-accent-blue) 30%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Lock size={22} color="var(--color-accent-cyan)" />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--color-accent-cyan)', fontWeight: 700, marginBottom: '0.5rem' }}>S/ Stormglide</div>
        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Admin Portal</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>Enter your password to continue</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            autoFocus
            aria-label="Admin password"
          />
          {error && <div style={{ color: 'var(--color-danger)', fontSize: '0.8rem', textAlign: 'left' }}>{error}</div>}
          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '0.875rem' }}>
            Enter Portal
          </button>
        </form>

        <button onClick={() => window.history.back()} style={{ marginTop: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.8rem', textDecoration: 'underline' }}>
          ← Back to site
        </button>
      </motion.div>
    </div>
  )
}
