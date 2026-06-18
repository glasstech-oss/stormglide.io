import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

const COLUMNS = [
  { id: 'planning', label: 'Planning' },
  { id: 'building', label: 'Building' },
  { id: 'review', label: 'Review' },
  { id: 'delivered', label: 'Delivered' },
]

const COL_COLORS = { planning: 'var(--color-accent-cyan)', building: 'var(--color-accent-violet)', review: 'var(--color-warning)', delivered: 'var(--color-success)' }

const EMPTY_PROJECT = { clientName: '', projectName: '', description: '', startDate: '', estimatedEndDate: '', status: 'planning', progress: 0, notes: '' }

function ProjectModal({ project, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(project || EMPTY_PROJECT)
  const isEdit = !!project?.id

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,10,24,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--border-radius-lg)', padding: '2rem', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><X size={18} /></button>
        <h3 style={{ marginBottom: '1.5rem' }}>{isEdit ? 'Edit Project' : 'New Project'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>Client Name</label>
              <input className="input" value={form.clientName} onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))} required />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>Project Name</label>
              <input className="input" value={form.projectName} onChange={e => setForm(p => ({ ...p, projectName: e.target.value }))} required />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>Start Date</label>
              <input className="input" type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>Est. End Date</label>
              <input className="input" type="date" value={form.estimatedEndDate} onChange={e => setForm(p => ({ ...p, estimatedEndDate: e.target.value }))} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>Status</label>
            <select className="input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>Progress: {form.progress}%</label>
            <input type="range" min={0} max={100} value={form.progress} onChange={e => setForm(p => ({ ...p, progress: Number(e.target.value) }))} style={{ width: '100%', accentColor: 'var(--color-accent-cyan)' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-primary" onClick={() => onSave(form)}>{isEdit ? 'Save Changes' : 'Create Project'}</button>
              <button className="btn-secondary" onClick={onClose}>Cancel</button>
            </div>
            {isEdit && (
              <button onClick={() => { onDelete(form.id); onClose() }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', fontSize: '0.8rem' }}>Delete project</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProjectsManager() {
  const { projects, addProject, updateProject, deleteProject } = useAdmin()
  const [modal, setModal] = useState(null)

  const handleSave = (form) => {
    if (form.id) updateProject(form.id, form)
    else addProject(form)
    setModal(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Projects</h2>
        <button className="btn-primary" style={{ gap: '0.375rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }} onClick={() => setModal({})}>
          <Plus size={16} /> Add Project
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'start' }}>
        {COLUMNS.map(col => {
          const colProjects = projects.filter(p => p.status === col.id)
          return (
            <div key={col.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: COL_COLORS[col.id] }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{col.label}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginLeft: 'auto' }}>{colProjects.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {colProjects.map(proj => (
                  <motion.div key={proj.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    onClick={() => setModal(proj)}
                    className="card"
                    style={{ cursor: 'pointer', background: 'var(--color-surface)' }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{proj.projectName}</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', marginBottom: '0.875rem' }}>{proj.clientName}</div>
                    <div style={{ marginBottom: '0.375rem' }}>
                      <div style={{ height: 4, background: 'var(--color-border-subtle)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${proj.progress}%`, background: COL_COLORS[col.id], borderRadius: 2, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                      <span>{proj.startDate ? new Date(proj.startDate).toLocaleDateString() : '—'}</span>
                      <span>{proj.progress}%</span>
                    </div>
                  </motion.div>
                ))}
                {colProjects.length === 0 && (
                  <div style={{ border: '1px dashed var(--color-border-subtle)', borderRadius: 'var(--border-radius)', padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>No projects</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {modal !== null && (
          <ProjectModal
            project={modal?.id ? modal : null}
            onClose={() => setModal(null)}
            onSave={handleSave}
            onDelete={deleteProject}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
