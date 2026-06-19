import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { LogOut, CheckCircle2, Clock, Users, DollarSign } from 'lucide-react'
import { auth } from '../../firebase/db'
import { signOut } from 'firebase/auth'
import { getProjectsByClient, getClient } from '../../firebase/collections'
import PageLayout from '../../components/layout/PageLayout'

export default function ClientProject() {
  const [project, setProject] = useState(null)
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const user = auth.currentUser

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!user) {
          navigate('/client/login')
          return
        }

        // Get projects for this client (would need to add userId field to client data)
        // For now, show a placeholder message
        setProject({
          id: 'sample_project',
          name: 'Your Project Name',
          status: 'active',
          description: 'Project details coming soon...',
          startDate: new Date(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          budget: { quoted: 50000, spent: 20000 },
          team: [{ name: 'John Developer', role: 'Lead' }],
          deliverables: [
            { name: 'UI Design', status: 'completed' },
            { name: 'Backend API', status: 'in-progress' },
            { name: 'Frontend Build', status: 'pending' },
          ],
        })

        setClient({
          id: user.uid,
          name: 'Your Company',
          phone: user.phoneNumber,
        })
      } catch (error) {
        console.error('Error loading project:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, navigate])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/client/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <p>Loading your project...</p>
        </div>
      </PageLayout>
    )
  }

  if (!project) {
    return (
      <PageLayout>
        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <p>No projects found. Please contact support.</p>
        </div>
      </PageLayout>
    )
  }

  const getDaysLeft = (date) => {
    const days = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 'Overdue'
  }

  const completedDeliverables = project.deliverables?.filter(d => d.status === 'completed').length || 0
  const totalDeliverables = project.deliverables?.length || 0
  const progressPercent = (completedDeliverables / totalDeliverables) * 100

  return (
    <PageLayout>
      <Helmet>
        <title>My Project | StormGlide</title>
      </Helmet>

      <div style={{ padding: '3rem 2rem', background: 'var(--bg-soft)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '3rem',
              padding: '2rem',
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '14px',
            }}
          >
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
                {project.name}
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
                Welcome, {client?.name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                color: 'var(--sg-accent)',
                border: '1px solid var(--sg-accent)',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </motion.div>

          {/* Project Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem',
            }}
          >
            <div style={{
              padding: '1.5rem',
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Status</p>
                <Clock size={16} color='var(--sg-accent)' />
              </div>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-heading)', textTransform: 'capitalize' }}>
                {project.status}
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Days Left</p>
                <Clock size={16} color='var(--sg-accent)' />
              </div>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                {getDaysLeft(project.dueDate)}
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Progress</p>
                <CheckCircle2 size={16} color='var(--sg-accent)' />
              </div>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                {Math.round(progressPercent)}%
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Budget</p>
                <DollarSign size={16} color='var(--sg-accent)' />
              </div>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                GHS {project.budget?.spent || 0} / {project.budget?.quoted || 0}
              </p>
            </div>
          </motion.div>

          {/* Deliverables */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              padding: '2rem',
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '14px',
              marginBottom: '2rem',
            }}
          >
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              Deliverables ({completedDeliverables}/{totalDeliverables})
            </h2>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '8px',
              background: 'var(--color-border)',
              borderRadius: '4px',
              marginBottom: '2rem',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'var(--sg-accent)',
                borderRadius: '4px',
                transition: 'width 0.3s ease',
              }} />
            </div>

            {/* Deliverables List */}
            {project.deliverables?.map((deliverable, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 0',
                borderBottom: i < project.deliverables.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: deliverable.status === 'completed' ? 'var(--sg-accent)' : 'var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {deliverable.status === 'completed' && (
                    <CheckCircle2 size={16} color='var(--color-background)' />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: '0.25rem' }}>
                    {deliverable.name}
                  </p>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    textTransform: 'capitalize',
                  }}>
                    {deliverable.status.replace('-', ' ')}
                  </p>
                </div>
                <span style={{
                  display: 'inline-block',
                  padding: '0.4rem 0.75rem',
                  background: deliverable.status === 'completed' ? 'color-mix(in srgb, var(--sg-accent) 15%, transparent)' : 'color-mix(in srgb, var(--color-text-secondary) 15%, transparent)',
                  color: deliverable.status === 'completed' ? 'var(--sg-accent)' : 'var(--color-text-secondary)',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}>
                  {deliverable.status.replace('-', ' ')}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              padding: '2rem',
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '14px',
            }}
          >
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              Team Members
            </h2>
            {project.team?.map((member, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '1rem',
                background: 'var(--bg-soft)',
                borderRadius: '8px',
                marginBottom: i < project.team.length - 1 ? '1rem' : 0,
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--sg-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-background)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  flexShrink: 0,
                }}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: '0.25rem' }}>
                    {member.name}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </PageLayout>
  )
}
