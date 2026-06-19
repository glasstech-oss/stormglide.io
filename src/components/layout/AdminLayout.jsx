import AdminNav from '../admin/AdminNav'

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-background)' }}>
      <AdminNav />
      <div style={{ flex: 1, marginLeft: '250px', minWidth: 0 }}>
        {children}
      </div>
    </div>
  )
}
