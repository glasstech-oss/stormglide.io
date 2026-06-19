import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { CheckCircle2, Clock, Plus, X } from 'lucide-react'
import { getProjects, updateProject, addProject, getClient } from '../../firebase/collections'
import AdminLayout from '../../components/layout/AdminLayout'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    clientId: '',
    description: '',
    status: 'proposal',
    budget: { quoted: 0, spent: 0, currency: 'GHS' },
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deliverables: [],
    team: [],
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getProjects()
        setProjects(data)
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await updateProject(projectId, { status: newStatus })
      const updated = await getProjects()
      setProjects(updated)
      const refreshed = updated.find(p => p.id === projectId)
      setSelectedProject(refreshed)
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  const handleSaveEdit = async () => {
    try {
      await updateProject(selectedProject.id, editForm)
      setEditMode(false)
      const updated = await getProjects()
      setProjects(updated)
      const refreshed = updated.find(p => p.id === selectedProject.id)
      setSelectedProject(refreshed)
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    try {
      await addProject({
        ...createForm,
        budget: { quoted: parseInt(createForm.budget.quoted) || 0, spent: 0, currency: 'GHS' },
        startDate: new Date(createForm.startDate),
        dueDate: new Date(createForm.dueDate),
      })
      setShowCreateForm(false)
      setCreateForm({
        name: '',
        clientId: '',
        description: '',
        status: 'proposal',
        budget: { quoted: 0, spent: 0, currency: 'GHS' },
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        deliverables: [],
        team: [],
      })
      const updated = await getProjects()
      setProjects(updated)
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'proposal': return '#f59e0b'
      case 'active': return '#3b82f6'
      case 'completed': return '#10b981'
      case 'support': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  const projectStats = {
    proposal: projects.filter(p => p.status === 'proposal').length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
  }

  const completedDeliverables = selectedProject?.deliverables?.filter(d => d.status === 'completed').length || 0
  const totalDeliverables = selectedProject?.deliverables?.length || 0
  const progressPercent = totalDeliverables > 0 ? (completedDeliverables / totalDeliverables) * 100 : 0

  return (
    <AdminLayout>
      <Helmet>
        <title>Projects Management | Admin | StormGlide</title>
      </Helmet>

      <div style={{ padding: '3rem 2rem', background: 'var(--bg-soft)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
                Projects Management
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
                Track and manage all client projects
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'var(--sg-accent)',
                color: 'var(--color-background)',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Plus size={18} />
              New Project
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            {[
              { label: 'Proposals', count: projectStats.proposal, color: '#f59e0b' },
              { label: 'Active', count: projectStats.active, color: '#3b82f6' },
              { label: 'Completed', count: projectStats.completed, color: '#10b981' },
              { label: 'Total', count: projects.length, color: 'var(--sg-accent)' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: '1.5rem',
                  background: 'var(--color-background)',
                  border: `2px solid ${stat.color}`,
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '2rem', fontWeight: 700, color: stat.color }}>
                  {stat.count}
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Projects Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            {/* Projects List */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '2rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
                maxHeight: '700px',
                overflowY: 'auto',
              }}
            >
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
                All Projects ({projects.length})
              </h2>
              {projects.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)' }}>No projects yet</p>
              ) : (
                projects.map((proj, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedProject(proj)
                      setEditForm({})
                      setEditMode(false)
                    }}
                    style={{
                      padding: '1rem',
                      background: selectedProject?.id === proj.id ? 'var(--bg-soft)' : 'transparent',
                      border: selectedProject?.id === proj.id ? '1px solid var(--sg-accent)' : 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      marginBottom: '0.75rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-text-heading)' }}>
                      {proj.name}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                      GHS {(proj.budget?.quoted || 0).toLocaleString()}
                    </p>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      backgroundColor: `color-mix(in srgb, ${getStatusColor(proj.status)} 15%, transparent)`,
                      color: getStatusColor(proj.status),
                      textTransform: 'capitalize',
                    }}>
                      {proj.status}
                    </span>
                  </div>
                ))
              )}
            </motion.div>

            {/* Project Detail */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '2rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
              }}
            >
              {selectedProject ? (
                <>
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
                          {selectedProject.name}
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                          Client ID: {selectedProject.clientId}
                        </p>
                      </div>
                      <select
                        value={selectedProject.status}
                        onChange={(e) => handleStatusChange(selectedProject.id, e.target.value)}
                        style={{
                          padding: '0.5rem',
                          border: '1px solid var(--color-border)',
                          borderRadius: '6px',
                          background: 'var(--bg-soft)',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <option value="proposal">Proposal</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="support">Support</option>
                      </select>
                    </div>
                  </div>

                  {/* Budget & Timeline */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '2rem',
                    paddingBottom: '2rem',
                    borderBottom: '1px solid var(--color-border)',
                  }}>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                        Budget
                      </p>
                      <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                        GHS {(selectedProject.budget?.quoted || 0).toLocaleString()}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        Spent: GHS {(selectedProject.budget?.spent || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                        Due Date
                      </p>
                      <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                        {selectedProject.dueDate ? new Date(selectedProject.dueDate.seconds * 1000).toLocaleDateString() : 'N/A'}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        {selectedProject.startDate ? `Started: ${new Date(selectedProject.startDate.seconds * 1000).toLocaleDateString()}` : 'Not started'}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div style={{ marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                      Progress: {Math.round(progressPercent)}% ({completedDeliverables}/{totalDeliverables})
                    </p>
                    <div style={{
                      height: '8px',
                      background: 'var(--color-border)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${progressPercent}%`,
                        background: 'var(--sg-accent)',
                        borderRadius: '4px',
                        transition: 'width 0.3s',
                      }} />
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
                      Deliverables
                    </h3>
                    {selectedProject.deliverables?.map((del, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.75rem 0',
                        borderBottom: i < selectedProject.deliverables.length - 1 ? '1px solid var(--color-border)' : 'none',
                      }}>
                        <CheckCircle2 size={20} color={del.status === 'completed' ? 'var(--sg-accent)' : 'var(--color-border)'} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: '0.25rem' }}>
                            {del.name}
                          </p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
                            {del.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
                  Select a project to view details
                </p>
              )}
            </motion.div>
          </div>

          {/* Create Project Modal */}
          {showCreateForm && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: 'var(--color-background)',
                  borderRadius: '12px',
                  padding: '2rem',
                  maxWidth: '500px',
                  width: '90%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                    Create New Project
                  </h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Client ID"
                    value={createForm.clientId}
                    onChange={(e) => setCreateForm({ ...createForm, clientId: e.target.value })}
                    className="input"
                  />
                  <textarea
                    placeholder="Description"
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    className="input"
                    style={{ minHeight: '80px' }}
                  />
                  <input
                    type="number"
                    placeholder="Budget (GHS)"
                    value={createForm.budget.quoted}
                    onChange={(e) => setCreateForm({
                      ...createForm,
                      budget: { ...createForm.budget, quoted: parseInt(e.target.value) || 0 }
                    })}
                    className="input"
                  />
                  <input
                    type="date"
                    value={createForm.startDate}
                    onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                    className="input"
                  />
                  <input
                    type="date"
                    value={createForm.dueDate}
                    onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
                    className="input"
                  />
                  <select
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                    className="input"
                  >
                    <option value="proposal">Proposal</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="support">Support</option>
                  </select>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ justifyContent: 'center', padding: '0.875rem' }}
                  >
                    Create Project
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
