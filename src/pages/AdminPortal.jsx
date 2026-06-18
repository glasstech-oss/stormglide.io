import { Routes, Route } from 'react-router-dom'
import AdminNav from '../components/admin/AdminNav'
import AdminDashboard from '../components/admin/AdminDashboard'
import InquiriesManager from '../components/admin/InquiriesManager'
import DemoRequestsManager from '../components/admin/DemoRequestsManager'
import ProjectsManager from '../components/admin/ProjectsManager'
import SiteCustomizer from '../components/admin/SiteCustomizer'

export default function AdminPortal() {
  const now = new Date().toLocaleString('en-GH', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-background)' }}>
      <AdminNav />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ borderBottom: '1px solid var(--color-border-subtle)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-surface)', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-text-heading)', fontSize: '0.95rem' }}>Stormglide Admin</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{now}</span>
        </div>

        {/* Content */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', paddingTop: '4.5rem' }} className="md:pt-8">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="inquiries" element={<InquiriesManager />} />
            <Route path="demos" element={<DemoRequestsManager />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="customizer" element={<SiteCustomizer />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
