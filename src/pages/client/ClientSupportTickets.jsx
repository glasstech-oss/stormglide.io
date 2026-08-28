import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Send } from 'lucide-react'
import { auth } from '../../firebase/db'
import { addSupportTicket, getTicketsByProject } from '../../firebase/collections'
import PageLayout from '../../components/layout/PageLayout'

const DEFAULT_PROJECT_ID = 'client_project_123'

export default function ClientSupportTickets() {
  const [projectId] = useState(DEFAULT_PROJECT_ID)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
  })
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()
  const user = auth.currentUser

  const loadTickets = useCallback(async (projId) => {
    try {
      const ticketData = await getTicketsByProject(projId)
      setTickets(ticketData)
    } catch (error) {
      console.error('Error loading tickets:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      navigate('/client/login')
      return
    }
    const timer = window.setTimeout(() => loadTickets(projectId), 0)
    return () => window.clearTimeout(timer)
  }, [user, navigate, loadTickets, projectId])

  const handleSubmitTicket = async (e) => {
    e.preventDefault()
    try {
      await addSupportTicket({
        projectId,
        clientId: user.uid,
        title: newTicket.title,
        description: newTicket.description,
        priority: newTicket.priority,
        responses: [
          {
            author: 'client',
            message: newTicket.description,
            timestamp: new Date().toISOString(),
          },
        ],
      })

      setSubmitted(true)
      setNewTicket({ title: '', description: '', priority: 'medium' })

      setTimeout(() => setSubmitted(false), 3000)
      loadTickets(projectId)
    } catch (error) {
      console.error('Error creating ticket:', error)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <p>Loading support tickets...</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Helmet>
        <title>Support Tickets | My Project | StormGlide</title>
      </Helmet>

      <div style={{ padding: '3rem 2rem', background: 'var(--bg-soft)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '3rem' }}
          >
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
              Support Tickets
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
              Submit support requests and track their status
            </p>
          </motion.div>

          {/* Success Message */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                padding: '1rem',
                background: 'color-mix(in srgb, #10b981 10%, transparent)',
                border: '1px solid color-mix(in srgb, #10b981 25%, transparent)',
                borderRadius: '8px',
                marginBottom: '2rem',
                color: '#059669',
                fontWeight: 600,
              }}
            >
              ✓ Ticket submitted successfully. Our team will respond soon.
            </motion.div>
          )}

          {/* Create Ticket Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '2rem',
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '14px',
              marginBottom: '3rem',
            }}
          >
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              Submit a New Ticket
            </h2>
            <form onSubmit={handleSubmitTicket}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: 'var(--color-text-heading)',
                }}>
                  Issue Title
                </label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder="Brief description of your issue"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'var(--bg-soft)',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: 'var(--color-text-heading)',
                }}>
                  Description
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Provide details about the issue you're experiencing"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'var(--bg-soft)',
                    minHeight: '120px',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: 'var(--color-text-heading)',
                }}>
                  Priority
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'var(--bg-soft)',
                  }}
                >
                  <option value="low">Low (Can wait)</option>
                  <option value="medium">Medium (Needs attention)</option>
                  <option value="high">High (Urgent)</option>
                </select>
              </div>

              <button
                type="submit"
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
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                <Send size={18} />
                Submit Ticket
              </button>
            </form>
          </motion.div>

          {/* Your Tickets */}
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
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
              Your Tickets ({tickets.length})
            </h2>

            {tickets.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', padding: '2rem 0', textAlign: 'center' }}>
                No tickets submitted yet. Submit one above if you need help.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tickets.map((ticket, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '1.5rem',
                      background: 'var(--bg-soft)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${getPriorityColor(ticket.priority)}`,
                    }}
                  >
                    <div style={{ marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--color-text-heading)' }}>
                        {ticket.title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        Submitted {new Date(ticket.createdAt?.seconds * 1000).toLocaleDateString()}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.4rem 0.75rem',
                        background: `color-mix(in srgb, ${getPriorityColor(ticket.priority)} 15%, transparent)`,
                        color: getPriorityColor(ticket.priority),
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}>
                        {ticket.priority}
                      </span>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.4rem 0.75rem',
                        background: 'color-mix(in srgb, var(--color-text-secondary) 15%, transparent)',
                        color: 'var(--color-text-secondary)',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}>
                        {ticket.status || 'open'}
                      </span>
                    </div>

                    {ticket.responses?.length > 0 && (
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                          Latest Response:
                        </p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-heading)', lineHeight: 1.5 }}>
                          {ticket.responses[ticket.responses.length - 1]?.message || 'No response yet'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageLayout>
  )
}
