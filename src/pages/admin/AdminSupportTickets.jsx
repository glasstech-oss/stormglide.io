import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { AlertTriangle, Clock, CheckCircle, MessageSquare } from 'lucide-react'
import { getSupportTickets, updateSupportTicket, addSupportTicket } from '../../firebase/collections'
import PageLayout from '../../components/layout/PageLayout'

export default function AdminSupportTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [response, setResponse] = useState('')
  const [newTicket, setNewTicket] = useState({
    projectId: '',
    clientId: '',
    title: '',
    description: '',
    priority: 'medium',
  })
  const [showNewForm, setShowNewForm] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const ticketData = await getSupportTickets()
        setTickets(ticketData)
      } catch (error) {
        console.error('Error loading tickets:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    try {
      await addSupportTicket(newTicket)

      setNewTicket({
        projectId: '',
        clientId: '',
        title: '',
        description: '',
        priority: 'medium',
      })
      setShowNewForm(false)

      const updated = await getSupportTickets()
      setTickets(updated)
    } catch (error) {
      console.error('Error creating ticket:', error)
    }
  }

  const handleAddResponse = async () => {
    if (!selectedTicket || !response.trim()) return

    try {
      const currentResponses = selectedTicket.responses || []
      currentResponses.push({
        author: 'team',
        message: response,
        timestamp: new Date().toISOString(),
      })

      await updateSupportTicket(selectedTicket.id, {
        responses: currentResponses,
      })

      setResponse('')
      const updated = await getSupportTickets()
      setTickets(updated)
      const refreshed = updated.find(t => t.id === selectedTicket.id)
      setSelectedTicket(refreshed)
    } catch (error) {
      console.error('Error adding response:', error)
    }
  }

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await updateSupportTicket(ticketId, { status: newStatus })
      const updated = await getSupportTickets()
      setTickets(updated)
    } catch (error) {
      console.error('Error updating ticket:', error)
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

  const openTickets = tickets.filter(t => t.status === 'open').length
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length

  return (
    <PageLayout>
      <Helmet>
        <title>Support Tickets | Admin | StormGlide</title>
      </Helmet>

      <div style={{ padding: '3rem 2rem', background: 'var(--bg-soft)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '3rem',
            }}
          >
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
                Support Tickets
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
                Manage client support requests and track resolutions
              </p>
            </div>
            <button
              onClick={() => setShowNewForm(!showNewForm)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--sg-accent)',
                color: 'var(--color-background)',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {showNewForm ? 'Cancel' : '+ New Ticket'}
            </button>
          </motion.div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '1.5rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Open</p>
                <AlertTriangle size={16} color='#ef4444' />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                {openTickets}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                padding: '1.5rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>In Progress</p>
                <Clock size={16} color='#f59e0b' />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                {inProgressTickets}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                padding: '1.5rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Resolved</p>
                <CheckCircle size={16} color='#10b981' />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
                {resolvedTickets}
              </p>
            </motion.div>
          </div>

          {/* New Ticket Form */}
          {showNewForm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '2rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
                marginBottom: '2rem',
              }}
            >
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
                Create Support Ticket
              </h2>
              <form onSubmit={handleCreateTicket}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Project ID"
                    value={newTicket.projectId}
                    onChange={(e) => setNewTicket({ ...newTicket, projectId: e.target.value })}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      backgroundColor: 'var(--bg-soft)',
                    }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Client ID"
                    value={newTicket.clientId}
                    onChange={(e) => setNewTicket({ ...newTicket, clientId: e.target.value })}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      backgroundColor: 'var(--bg-soft)',
                    }}
                    required
                  />
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      backgroundColor: 'var(--bg-soft)',
                    }}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Ticket Title"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    backgroundColor: 'var(--bg-soft)',
                    marginBottom: '1rem',
                    boxSizing: 'border-box',
                  }}
                  required
                />
                <textarea
                  placeholder="Ticket Description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    backgroundColor: 'var(--bg-soft)',
                    marginBottom: '1.5rem',
                    minHeight: '100px',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'var(--sg-accent)',
                    color: 'var(--color-background)',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Create Ticket
                </button>
              </form>
            </motion.div>
          )}

          {/* Tickets List */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            {/* Tickets Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '2rem',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
                maxHeight: '600px',
                overflowY: 'auto',
              }}
            >
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-text-heading)' }}>
                Tickets
              </h2>
              {tickets.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)' }}>No tickets yet</p>
              ) : (
                tickets.map((ticket, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedTicket(ticket)}
                    style={{
                      padding: '1rem',
                      background: selectedTicket?.id === ticket.id ? 'var(--bg-soft)' : 'transparent',
                      border: selectedTicket?.id === ticket.id ? '1px solid var(--sg-accent)' : 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      marginBottom: '0.75rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-text-heading)' }}>
                      {ticket.title}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                      {ticket.projectId}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        backgroundColor: `color-mix(in srgb, ${getPriorityColor(ticket.priority)} 15%, transparent)`,
                        color: getPriorityColor(ticket.priority),
                        textTransform: 'capitalize',
                      }}>
                        {ticket.priority}
                      </span>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        backgroundColor: 'color-mix(in srgb, var(--color-text-secondary) 15%, transparent)',
                        color: 'var(--color-text-secondary)',
                        textTransform: 'capitalize',
                      }}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </motion.div>

            {/* Ticket Detail */}
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
              {selectedTicket ? (
                <>
                  <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-heading)' }}>
                      {selectedTicket.title}
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                      Project: {selectedTicket.projectId}
                    </p>
                    <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      {selectedTicket.description}
                    </p>
                  </div>

                  {/* Status & Priority */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    <div>
                      <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                        Status
                      </label>
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          fontSize: '0.95rem',
                          backgroundColor: 'var(--bg-soft)',
                          boxSizing: 'border-box',
                        }}
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                        Priority
                      </label>
                      <select
                        defaultValue={selectedTicket.priority}
                        onChange={(e) => updateSupportTicket(selectedTicket.id, { priority: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          fontSize: '0.95rem',
                          backgroundColor: 'var(--bg-soft)',
                          boxSizing: 'border-box',
                        }}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  {/* Responses */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-heading)' }}>
                      Conversation
                    </h3>
                    {selectedTicket.responses?.map((resp, i) => (
                      <div key={i} style={{
                        padding: '1rem',
                        background: resp.author === 'team' ? 'var(--bg-soft)' : 'transparent',
                        borderRadius: '8px',
                        marginBottom: '0.75rem',
                        borderLeft: `4px solid ${resp.author === 'team' ? 'var(--sg-accent)' : 'var(--color-border)'}`,
                      }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                          {resp.author === 'team' ? 'Team' : 'Client'} • {new Date(resp.timestamp).toLocaleDateString()}
                        </p>
                        <p style={{ color: 'var(--color-text-heading)' }}>
                          {resp.message}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Add Response */}
                  <div>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Add response..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        backgroundColor: 'var(--bg-soft)',
                        marginBottom: '1rem',
                        minHeight: '80px',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      onClick={handleAddResponse}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'var(--sg-accent)',
                        color: 'var(--color-background)',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Send Response
                    </button>
                  </div>
                </>
              ) : (
                <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
                  Select a ticket to view details
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
