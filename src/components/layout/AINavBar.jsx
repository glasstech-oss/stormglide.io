import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { sendChatMessage } from '../../lib/aiChat'
import { AnimatePresence, motion } from 'framer-motion'
import BrandLogo from '../common/BrandLogo'

const GREETING = "Hi — I'm Stormglide's support assistant. Ask me anything, or tell me where you want to go."

function renderContent(text) {
  const nodes = []
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let match
  let key = 0
  while ((match = linkRe.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    const [, label, url] = match
    if (url.startsWith('/')) {
      nodes.push(<Link key={key++} to={url} className="sg-ai-link">{label}</Link>)
    } else {
      nodes.push(<a key={key++} href={url} target="_blank" rel="noopener noreferrer" className="sg-ai-link">{label}</a>)
    }
    last = linkRe.lastIndex
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Work', href: '/work' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/contact' },
]

export default function AINavBar() {
  const [expanded, setExpanded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }])
  const [input, setInput] = useState('')
  const [netBusy, setNetBusy] = useState(false)
  const [error, setError] = useState(false)
  const [typingIndex, setTypingIndex] = useState(null)
  const [revealLen, setRevealLen] = useState(0)
  const navigate = useNavigate()

  const listRef = useRef(null)
  const messagesRef = useRef(messages)
  const textareaRef = useRef(null)

  useEffect(() => { messagesRef.current = messages }, [messages])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, revealLen, expanded])

  useEffect(() => {
    if (!expanded) return
    function onKey(e) { if (e.key === 'Escape') { setExpanded(false); setMenuOpen(false); } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded])

  useEffect(() => {
    if (typingIndex === null) return
    const id = setInterval(() => {
      setRevealLen((len) => {
        const target = messagesRef.current[typingIndex]?.content?.length || 0
        if (len >= target) return len
        const backlog = target - len
        const step = backlog > 80 ? 6 : backlog > 24 ? 3 : 1
        return Math.min(len + step, target)
      })
    }, 18)
    return () => clearInterval(id)
  }, [typingIndex])

  const typingTarget = typingIndex !== null ? (messages[typingIndex]?.content?.length || 0) : 0
  const isRevealing = typingIndex !== null && (netBusy || revealLen < typingTarget)

  function resizeTextarea(el) {
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }

  function handleInputChange(e) {
    setInput(e.target.value)
    resizeTextarea(e.target)
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || netBusy || isRevealing) return
    if (navigator.vibrate) navigator.vibrate(8)

    const next = [...messages, { role: 'user', content: text }]
    const assistantIndex = next.length
    setMessages([...next, { role: 'assistant', content: '' }])
    setTypingIndex(assistantIndex)
    setRevealLen(0)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = ''
    setNetBusy(true)
    setError(false)
    setExpanded(true)

    try {
      await sendChatMessage(next, {
        onAction: (action) => {
          if (action.type === 'NAVIGATE' && action.path) {
            navigate(action.path)
            // Keep chat open to show the friendly "Taking you there..." message
          }
        },
        onDelta: (partial) => {
          setMessages((prev) => {
            const copy = [...prev]
            copy[assistantIndex] = { role: 'assistant', content: partial }
            return copy
          })
        },
      })
    } catch {
      setError(true)
      setMessages((prev) => {
        const copy = [...prev]
        if (!copy[assistantIndex]?.content) {
          copy[assistantIndex] = { role: 'assistant', content: "I'm having trouble connecting right now — try WhatsApp or the contact form, or give it another moment and try again." }
        }
        return copy
      })
    } finally {
      setNetBusy(false)
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    sendMessage()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Click outside to collapse
  useEffect(() => {
    function handleClick(e) {
      if (!e.target.closest('.sg-ainav')) {
        setExpanded(false)
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <>
      <Link to="/" className="sg-logo sg-brand-pin" aria-label="Stormglide home">
        <BrandLogo className="sg-ainav-brand-logo" />
      </Link>

      <div className={`sg-ainav ${expanded ? 'is-expanded' : ''}`}>
        
        {/* Chat History Panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div 
              className="sg-ainav-history"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'min(400px, calc(100vh - 150px))' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="sg-ainav-header">
                <div className="sg-ainav-header-icon"><BrandLogo markOnly className="sg-ainav-header-logo" /></div>
                <div>
                  <div className="sg-ainav-header-title">Stormglide AI</div>
                  <div className="sg-ainav-header-sub">Nav & Support</div>
                </div>
                <button className="sg-ainav-header-close" onClick={() => setExpanded(false)} aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="sg-ainav-messages" ref={listRef}>
                {messages.map((m, i) => {
                  const isTypingThis = typingIndex === i
                  const showDots = isTypingThis && revealLen === 0 && netBusy
                  if (showDots) {
                    return (
                      <div key={i} className="sg-ainav-bubble sg-ainav-bubble-assistant sg-ainav-typing">
                        <span className="sg-ainav-dot" />
                        <span className="sg-ainav-dot" />
                        <span className="sg-ainav-dot" />
                      </div>
                    )
                  }
                  const shown = isTypingThis ? m.content.slice(0, revealLen) : m.content
                  if (!shown) return null
                  return (
                    <div key={i} className={`sg-ainav-bubble sg-ainav-bubble-${m.role}`}>
                      {renderContent(shown)}
                      {isTypingThis && revealLen < m.content.length && <span className="sg-ainav-cursor" />}
                    </div>
                  )
                })}
              </div>
              {error && <div className="sg-ainav-error">Having trouble reaching the assistant.</div>}
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Input Bar */}
        <div className="sg-ainav-bar">
          <div className="sg-ainav-menu-wrapper">
            <button 
              className="sg-ainav-menu-btn" 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div 
                  className="sg-ainav-menu-dropdown"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                >
                  {NAV_LINKS.map(link => (
                    <Link key={link.href} to={link.href} onClick={() => { setMenuOpen(false); setExpanded(false); }}>
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            className="sg-ainav-open"
            onClick={() => setExpanded(true)}
            aria-label="Ask Stormglide AI assistant"
          >
            Ask AI
          </button>

          <form className="sg-ainav-form" onSubmit={handleFormSubmit}>
            <textarea
              ref={textareaRef}
              className="sg-ainav-input"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onClick={() => { if (!expanded && messages.length > 1) setExpanded(true) }}
              placeholder="Ask anything or tell me where to go..."
              aria-label="AI Navigation and Chat"
              rows={1}
              disabled={netBusy || isRevealing}
            />
            <button type="submit" className="sg-ainav-send" disabled={netBusy || isRevealing || !input.trim()} aria-label="Send">
              <ArrowUp size={18} />
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .sg-logo {
          display: inline-flex;
          align-items: center;
          gap: 0.62rem;
          color: inherit;
          font-family: var(--font-mono), ui-monospace, monospace;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          text-decoration: none;
          white-space: nowrap;
          z-index: 2000;
        }

        .sg-ainav-brand-logo { width: 178px; }
        
        .sg-ainav {
          position: fixed;
          bottom: 16px;
          left: auto;
          right: 1.25rem;
          margin: 0;
          width: auto;
          max-width: min(188px, calc(100vw - 2rem));
          z-index: 1500;
          display: flex;
          flex-direction: column;
          /* Liquid glass aesthetic */
          background: color-mix(in srgb, var(--color-background) 86%, transparent);
          backdrop-filter: var(--glass-blur-strong);
          -webkit-backdrop-filter: var(--glass-blur-strong);
          border: 1px solid var(--color-border-subtle);
          border-radius: 999px;
          box-shadow: 0 16px 44px rgba(15,23,42,0.14), inset 0 1px 0 var(--glass-highlight);
          transition: border-radius 0.2s ease, width 0.2s ease, max-width 0.2s ease, bottom 0.2s ease;
        }

        .sg-ainav.is-expanded {
          bottom: 24px;
          left: 0;
          right: 0;
          margin: 0 auto;
          border-radius: 20px;
          width: min(720px, calc(100vw - 1rem));
          max-width: none;
        }

        .sg-ainav-bar {
          display: flex;
          align-items: center;
          padding: 0.35rem;
          gap: 0.25rem;
        }

        .sg-ainav.is-expanded .sg-ainav-bar {
          align-items: flex-end;
          padding: 0.5rem 0.5rem 0.5rem 0.8rem;
        }

        .sg-ainav-menu-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sg-ainav.is-expanded .sg-ainav-menu-wrapper {
          padding-bottom: 0.25rem;
        }

        .sg-ainav-menu-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--color-text-secondary);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .sg-ainav-menu-btn:hover {
          background: var(--color-surface-alt);
          color: var(--color-text-heading);
        }

        .sg-ainav-menu-dropdown {
          position: absolute;
          bottom: calc(100% + 16px);
          left: 0;
          width: 200px;
          background: var(--glass-bg-strong);
          backdrop-filter: var(--glass-blur-strong);
          -webkit-backdrop-filter: var(--glass-blur-strong);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          box-shadow: 0 12px 32px rgba(0,0,0,0.2), inset 0 1px 0 var(--glass-highlight);
        }

        .sg-ainav-menu-dropdown a {
          padding: 0.75rem 1rem;
          color: var(--color-text-heading);
          text-decoration: none;
          font-weight: 600;
          border-radius: var(--radius);
          transition: background 0.15s ease;
        }

        .sg-ainav-menu-dropdown a:hover {
          background: color-mix(in srgb, var(--sg-accent) 15%, transparent);
        }

        .sg-ainav-open {
          flex: none;
          height: 36px;
          min-width: 0;
          border: none;
          border-radius: 999px;
          background: transparent;
          color: var(--color-text-heading);
          cursor: pointer;
          font-size: 0.86rem;
          font-weight: 800;
          text-align: left;
          padding: 0 0.65rem;
          white-space: nowrap;
        }

        .sg-ainav-open:hover {
          color: var(--sg-accent);
        }

        .sg-ainav.is-expanded .sg-ainav-open {
          display: none;
        }

        .sg-ainav-form {
          flex: 1;
          display: flex;
          align-items: flex-end;
          gap: 0.5rem;
          background: color-mix(in srgb, var(--color-surface) 60%, transparent);
          border-radius: 22px;
          padding: 0.25rem 0.25rem 0.25rem 1rem;
          border: 1px solid var(--color-border-subtle);
        }

        .sg-ainav:not(.is-expanded) .sg-ainav-form {
          display: none;
        }

        .sg-ainav-input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--color-text-heading);
          font-family: inherit;
          font-size: 16px;
          line-height: 1.5;
          padding: 0.5rem 0;
          resize: none;
          max-height: 120px;
          overflow-y: auto;
        }
        
        .sg-ainav-input:focus { outline: none; }
        .sg-ainav-input:disabled { opacity: 0.6; }
        
        .sg-ainav-input::placeholder {
          color: var(--color-text-secondary);
          opacity: 0.7;
        }

        .sg-ainav-send {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: none;
          background: var(--sg-accent);
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .sg-ainav-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .sg-ainav-send:not(:disabled):hover {
          transform: scale(1.05);
        }

        /* History Panel */
        .sg-ainav-history {
          display: flex;
          flex-direction: column;
          border-bottom: 1px solid var(--color-border-subtle);
          overflow: hidden;
        }

        .sg-ainav-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border-bottom: 1px solid var(--color-border-subtle);
          background: color-mix(in srgb, var(--color-surface-alt) 40%, transparent);
        }

        .sg-ainav-header-icon {
          width: 28px; height: 28px; border-radius: 8px;
          background: color-mix(in srgb, var(--sg-accent) 15%, transparent);
          display: flex; align-items: center; justify-content: center;
          color: var(--sg-accent);
        }
        .sg-ainav-header-logo.sg-brand-logo.is-mark { width: 14px; }
        .sg-ainav-header-logo .sg-brand-logo-mark-accent { opacity: 0.8; }
        
        .sg-ainav-header-title { font-weight: 700; font-size: 0.85rem; color: var(--color-text-heading); }
        .sg-ainav-header-sub { font-size: 0.7rem; color: var(--color-text-secondary); }
        
        .sg-ainav-header-close {
          margin-left: auto;
          width: 28px; height: 28px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--color-text-secondary);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        .sg-ainav-header-close:hover { background: var(--color-surface); color: var(--color-text-heading); }

        .sg-ainav-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .sg-ainav-bubble {
          max-width: 85%;
          padding: 0.65rem 0.9rem;
          border-radius: 16px;
          font-size: 0.9rem;
          line-height: 1.5;
          white-space: pre-wrap;
        }
        .sg-ainav-bubble-assistant {
          align-self: flex-start;
          background: color-mix(in srgb, var(--color-surface-alt) 70%, transparent);
          border: 1px solid var(--color-border-subtle);
          color: var(--color-text-primary);
          border-bottom-left-radius: 4px;
        }
        .sg-ainav-bubble-user {
          align-self: flex-end;
          background: var(--sg-accent);
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        .sg-ai-link { color: var(--sg-accent); font-weight: 600; text-decoration: underline; }
        .sg-ainav-bubble-user .sg-ai-link { color: #fff; }

        .sg-ainav-cursor {
          display: inline-block;
          width: 2px; height: 0.9em;
          background: currentColor;
          margin-left: 2px;
          vertical-align: middle;
          animation: blink 0.8s steps(1) infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }

        .sg-ainav-typing { display: flex; gap: 4px; padding: 0.8rem 1rem; }
        .sg-ainav-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--color-text-secondary);
          animation: dotBounce 1.4s infinite ease-in-out both;
        }
        .sg-ainav-dot:nth-child(1) { animation-delay: -0.32s; }
        .sg-ainav-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        .sg-ainav-error {
          padding: 0.5rem 1rem;
          color: var(--color-danger);
          font-size: 0.8rem;
        }

        @media (max-width: 640px) {
          .sg-ainav {
            bottom: calc(12px + env(safe-area-inset-bottom, 0));
            left: 1rem;
            max-width: calc(100vw - 5.75rem);
            margin-left: 0;
            margin-right: auto;
            right: auto;
          }
          .sg-ainav.is-expanded {
            left: 0;
            right: 0;
            margin-left: auto;
            margin-right: auto;
            width: min(720px, calc(100vw - 1rem));
          }
          .sg-ainav-menu-dropdown {
            left: 0;
            width: calc(100vw - 2rem);
          }
        }
      `}</style>
    </>
  )
}
