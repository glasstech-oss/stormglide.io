import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Inbox, PlaySquare, FolderKanban, Palette, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
  { to: '/admin/demos', label: 'Demo Requests', icon: PlaySquare },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/customizer', label: 'Site Customizer', icon: Palette },
]

export default function AdminNav() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const logout = () => {
    sessionStorage.removeItem('stormglide_admin_auth')
    navigate('/admin/login')
  }

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1.5rem 1rem', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '0.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-accent-cyan)', fontWeight: 700 }}>S/ ADMIN</div>
      </div>
      <nav style={{ flex: 1, padding: '0.5rem 0' }}>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.625rem 1rem',
              textDecoration: 'none',
              color: isActive ? 'var(--color-accent-cyan)' : 'var(--color-text-secondary)',
              background: isActive ? 'color-mix(in srgb, var(--color-accent-blue) 8%, transparent)' : 'none',
              borderLeft: isActive ? '2px solid var(--color-accent-cyan)' : '2px solid transparent',
              fontSize: '0.875rem',
              transition: 'all 0.15s',
            })}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', fontSize: '0.875rem', borderTop: '1px solid var(--color-border-subtle)', width: '100%', textAlign: 'left' }}>
        <LogOut size={16} /> Logout
      </button>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex" style={{ width: 220, flexShrink: 0, background: 'var(--color-surface)', borderRight: '1px solid var(--color-border-subtle)', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-subtle)', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-accent-cyan)', fontWeight: 700 }}>S/ ADMIN</span>
        <button onClick={() => setMobileOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'var(--color-surface)', paddingTop: '60px' }}>
          <SidebarContent />
        </div>
      )}
    </>
  )
}
