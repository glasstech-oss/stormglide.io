import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { supabase, isSupabaseEnabled } from '../lib/supabase'

const AdminContext = createContext(null)

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36)

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL STORAGE PROVIDER (active when Supabase is not configured)
// ─────────────────────────────────────────────────────────────────────────────
function LocalStorageAdmin({ children }) {
  const [inquiries, setInquiries] = useLocalStorage('inquiries', [])
  const [demoRequests, setDemoRequests] = useLocalStorage('demoRequests', [])
  const [projects, setProjects] = useLocalStorage('projects', [])

  function addInquiry(data) {
    const record = { id: generateId(), ...data, date: new Date().toISOString(), status: 'new', notes: '', readAt: null }
    setInquiries(prev => [record, ...prev])
    return record
  }
  function updateInquiry(id, changes) {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, ...changes } : i))
  }
  function addDemoRequest(data) {
    const record = { id: generateId(), ...data, date: new Date().toISOString(), status: 'new' }
    setDemoRequests(prev => [record, ...prev])
    return record
  }
  function updateDemoRequest(id, changes) {
    setDemoRequests(prev => prev.map(d => d.id === id ? { ...d, ...changes } : d))
  }
  function addProject(data) {
    const record = { id: generateId(), ...data, notes: '' }
    setProjects(prev => [record, ...prev])
    return record
  }
  function updateProject(id, changes) {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p))
  }
  function deleteProject(id) {
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  return (
    <AdminContext.Provider value={{
      inquiries, demoRequests, projects,
      addInquiry, updateInquiry,
      addDemoRequest, updateDemoRequest,
      addProject, updateProject, deleteProject,
      isSupabase: false,
      loading: false,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE PROVIDER (active when VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY set)
// ─────────────────────────────────────────────────────────────────────────────
function SupabaseAdmin({ children }) {
  const [inquiries, setInquiries] = useState([])
  const [demoRequests, setDemoRequests] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const [{ data: inq }, { data: demo }, { data: proj }] = await Promise.all([
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('demo_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
    ])
    if (inq) setInquiries(inq)
    if (demo) setDemoRequests(demo)
    if (proj) setProjects(proj)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function addInquiry(data) {
    const { data: record } = await supabase.from('inquiries').insert([{ ...data, status: 'new', notes: '' }]).select().single()
    if (record) setInquiries(prev => [record, ...prev])
    return record
  }
  async function updateInquiry(id, changes) {
    await supabase.from('inquiries').update(changes).eq('id', id)
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, ...changes } : i))
  }
  async function addDemoRequest(data) {
    const { data: record } = await supabase.from('demo_requests').insert([{ ...data, status: 'new' }]).select().single()
    if (record) setDemoRequests(prev => [record, ...prev])
    return record
  }
  async function updateDemoRequest(id, changes) {
    await supabase.from('demo_requests').update(changes).eq('id', id)
    setDemoRequests(prev => prev.map(d => d.id === id ? { ...d, ...changes } : d))
  }
  async function addProject(data) {
    const { data: record } = await supabase.from('projects').insert([{ ...data, notes: '' }]).select().single()
    if (record) setProjects(prev => [record, ...prev])
    return record
  }
  async function updateProject(id, changes) {
    await supabase.from('projects').update(changes).eq('id', id)
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p))
  }
  async function deleteProject(id) {
    await supabase.from('projects').delete().eq('id', id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  return (
    <AdminContext.Provider value={{
      inquiries, demoRequests, projects,
      addInquiry, updateInquiry,
      addDemoRequest, updateDemoRequest,
      addProject, updateProject, deleteProject,
      isSupabase: true,
      loading,
      reload: load,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Public provider — auto-selects based on env
// ─────────────────────────────────────────────────────────────────────────────
export function AdminProvider({ children }) {
  return isSupabaseEnabled
    ? <SupabaseAdmin>{children}</SupabaseAdmin>
    : <LocalStorageAdmin>{children}</LocalStorageAdmin>
}

export function useAdmin() {
  return useContext(AdminContext)
}
