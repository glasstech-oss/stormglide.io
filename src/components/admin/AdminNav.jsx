import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, MessageSquare, DollarSign, Zap, LogOut } from 'lucide-react'
import { auth } from '../../firebase/db'
import { signOut } from 'firebase/auth'

export default function AdminNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Inquiries', icon: MessageSquare, path: '/admin/inquiries' },
    { label: 'Projects', icon: FileText, path: '/admin/projects' },
    { label: 'Invoices', icon: DollarSign, path: '/admin/invoices' },
    { label: 'Support', icon: MessageSquare, path: '/admin/support-tickets' },
    { label: 'Infrastructure', icon: Zap, path: '/admin/infrastructure' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: '250px',
      height: '100vh',
      background: 'var(--color-background)',
      borderRight: '1px solid var(--color-border)',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        marginBottom: '2rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <h2 style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          color: 'var(--color-text-heading)',
        }}>
          StormGlide Admin
        </h2>
      </div>

      {/* Navigation Items */}
      <nav style={{ flex: 1 }}>
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              background: isActive(item.path) ? 'var(--bg-soft)' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '0.5rem',
              color: isActive(item.path) ? 'var(--sg-accent)' : 'var(--color-text-secondary)',
              fontSize: '0.95rem',
              fontWeight: isActive(item.path) ? 600 : 500,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.target.style.background = 'color-mix(in srgb, var(--sg-accent) 10%, transparent)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.target.style.background = 'transparent'
              }
            }}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'transparent',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          cursor: 'pointer',
          color: 'var(--color-text-secondary)',
          fontSize: '0.95rem',
          fontWeight: 500,
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'color-mix(in srgb, #ef4444 10%, transparent)'
          e.target.style.color = '#ef4444'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent'
          e.target.style.color = 'var(--color-text-secondary)'
        }}
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  )
}
