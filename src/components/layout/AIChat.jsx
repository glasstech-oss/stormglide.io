import { useEffect, useRef, useState } from 'react'
import { X, ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { sendChatMessage } from '../../lib/aiChat'
import BrandLogo from '../common/BrandLogo'

const GREETING = "Hi — I'm Stormglide's AI assistant. Ask me anything about what we build, get a price estimate, book time with the team, or ask something completely unrelated — happy to help either way."

// The assistant is instructed to hand out links using `[label](url)` markdown
// syntax (WhatsApp, email, /work) since bubbles otherwise render as plain
// text — this turns that syntax into real clickable elements.
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

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }])
  const [input, setInput] = useState('')
  const [netBusy, setNetBusy] = useState(false)
  const [error, setError] = useState(false)
  // Real tokens stream in from the backend already, but network chunks land
  // in uneven bursts — this replays them onto screen at a steady human-typing
  // pace instead of having text jump in whole chunks. typingIndex tracks
  // which message is mid-reveal; revealLen is how many of its characters are
  // currently shown.
  const [typingIndex, setTypingIndex] = useState(null)
  const [revealLen, setRevealLen] = useState(0)
  const listRef = useRef(null)
  const messagesRef = useRef(messages)
  useEffect(() => { messagesRef.current = messages }, [messages])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, revealLen])

  // Advances revealLen toward the target message's full length. Speeds up
  // when the backlog is large (e.g. the network delivered a big chunk at
  // once) so long replies don't feel sluggish, but stays close to a natural
  // typing cadence for the common case. typingIndex itself is only ever set
  // by handleSend for the next reply — once fully revealed and the network
  // is done, isRevealing (derived below, not stored) simply goes false.
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

  async function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || netBusy || isRevealing) return

    const next = [...messages, { role: 'user', content: text }]
    const assistantIndex = next.length
    setMessages([...next, { role: 'assistant', content: '' }])
    setTypingIndex(assistantIndex)
    setRevealLen(0)
    setInput('')
    setNetBusy(true)
    setError(false)

    try {
      await sendChatMessage(next, {
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

  return (
    <>
      <button
        className={`sg-ai-fab${open ? ' is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <BrandLogo markOnly className="sg-ai-fab-logo" />}
      </button>

      <div className={`sg-ai-panel${open ? ' is-open' : ''}`} role="dialog" aria-label="Stormglide AI assistant" aria-hidden={!open}>
        <div className="sg-ai-header">
          <div className="sg-ai-header-icon"><BrandLogo markOnly className="sg-ai-header-logo" /></div>
          <div>
            <div className="sg-ai-header-title">Stormglide AI</div>
            <div className="sg-ai-header-sub">Ask anything — really</div>
          </div>
        </div>

        <div className="sg-ai-messages" ref={listRef}>
          {messages.map((m, i) => {
            const isTypingThis = typingIndex === i
            const showDots = isTypingThis && revealLen === 0 && netBusy
            if (showDots) {
              return (
                <div key={i} className="sg-ai-bubble sg-ai-bubble-assistant sg-ai-typing">
                  <span className="sg-ai-dot" />
                  <span className="sg-ai-dot" />
                  <span className="sg-ai-dot" />
                </div>
              )
            }
            const shown = isTypingThis ? m.content.slice(0, revealLen) : m.content
            if (!shown) return null
            return (
              <div key={i} className={`sg-ai-bubble sg-ai-bubble-${m.role}`}>
                {renderContent(shown)}
                {isTypingThis && revealLen < m.content.length && <span className="sg-ai-cursor" />}
              </div>
            )
          })}
        </div>

        <form className="sg-ai-input-row" onSubmit={handleSend}>
          <input
            className="sg-ai-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            aria-label="Message"
            disabled={netBusy || isRevealing}
          />
          <button type="submit" className="sg-ai-send" disabled={netBusy || isRevealing || !input.trim()} aria-label="Send">
            <ArrowUp size={16} />
          </button>
        </form>
        {error && <div className="sg-ai-error">Having trouble reaching the assistant — please retry.</div>}
      </div>

      <style>{`
        .sg-ai-fab {
          position: fixed;
          left: 1.25rem;
          bottom: 1.25rem;
          z-index: 1001;
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 50%;
          background: linear-gradient(155deg, var(--sg-accent), var(--sg-accent-2));
          color: #fff;
          cursor: pointer;
          box-shadow: 0 12px 32px rgba(37,99,235,0.28);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }
        .sg-ai-fab:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(37,99,235,0.34); }
        .sg-ai-fab.is-open { background: var(--color-text-heading); animation: none; }
        .sg-ai-fab-logo.sg-brand-logo.is-mark { width: 24px; color: #fff; }
        .sg-ai-fab-logo .sg-brand-logo-mark-accent { fill: #fff; opacity: 0.72; }

        .sg-ai-fab:not(.is-open) { animation: sgAiFabPulse 2.8s ease-out infinite; }
        @keyframes sgAiFabPulse {
          0%, 100% { box-shadow: 0 12px 32px rgba(37,99,235,0.28), 0 0 0 0 rgba(37,99,235,0.45); }
          50% { box-shadow: 0 12px 32px rgba(37,99,235,0.28), 0 0 0 12px rgba(37,99,235,0); }
        }

        .sg-ai-panel {
          position: fixed;
          left: 1.25rem;
          bottom: 5.25rem;
          z-index: 1001;
          width: min(360px, calc(100vw - 2.5rem));
          height: min(520px, calc(100vh - 8rem));
          display: flex;
          flex-direction: column;
          /* --color-surface is a ~3-5% "glass" tint by design (see
             visualVariants.js's lightColors), meant to sit as a subtle film
             over the page's solid background — fine for small chips over
             plain space, but reads as fully transparent for a text-heavy
             panel that can end up over busy content. Blended with the real
             solid background color instead, same technique the nav dock
             uses (.sg-navbar in Navbar.jsx). */
          background: color-mix(in srgb, var(--color-background) 97%, var(--color-surface));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1.5px solid var(--color-border-subtle);
          border-radius: var(--border-radius-lg);
          box-shadow: 0 24px 64px rgba(15,23,42,0.18);
          opacity: 0;
          visibility: hidden;
          transform: translateY(12px) scale(0.98);
          transform-origin: bottom left;
          transition: opacity 160ms ease, transform 160ms ease, visibility 160ms ease;
          overflow: hidden;
        }
        .sg-ai-panel.is-open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        .sg-ai-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.1rem;
          border-bottom: 1px solid var(--color-border-subtle);
          background: color-mix(in srgb, var(--color-background) 92%, var(--color-surface-alt));
          flex-shrink: 0;
        }
        .sg-ai-header-icon {
          width: 32px; height: 32px; border-radius: 9px;
          background: color-mix(in srgb, var(--sg-accent) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--sg-accent) 25%, transparent);
          display: flex; align-items: center; justify-content: center;
          color: var(--sg-accent); flex-shrink: 0;
        }
        .sg-ai-header-logo.sg-brand-logo.is-mark { width: 18px; }
        .sg-ai-header-logo .sg-brand-logo-mark-accent { opacity: 0.6; }
        .sg-ai-header-title { font-weight: 700; font-size: 0.88rem; color: var(--color-text-heading); }
        .sg-ai-header-sub { font-size: 0.72rem; color: var(--color-text-secondary); }

        .sg-ai-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .sg-ai-bubble {
          max-width: 85%;
          padding: 0.6rem 0.85rem;
          border-radius: 14px;
          font-size: 0.85rem;
          line-height: 1.55;
          white-space: pre-wrap;
        }
        .sg-ai-bubble-assistant {
          align-self: flex-start;
          background: var(--color-surface-alt);
          border: 1px solid var(--color-border-subtle);
          color: var(--color-text-primary);
          border-bottom-left-radius: 4px;
        }
        .sg-ai-bubble-user {
          align-self: flex-end;
          background: var(--sg-accent);
          color: #fff;
          border-bottom-right-radius: 4px;
        }

        .sg-ai-link { color: var(--sg-accent); font-weight: 700; text-decoration: underline; text-underline-offset: 2px; }
        .sg-ai-bubble-user .sg-ai-link { color: #fff; }

        .sg-ai-cursor {
          display: inline-block;
          width: 2px;
          height: 0.95em;
          background: currentColor;
          margin-left: 1px;
          vertical-align: text-bottom;
          animation: sgAiCursorBlink 0.85s steps(1) infinite;
        }
        @keyframes sgAiCursorBlink { 50% { opacity: 0; } }

        .sg-ai-typing { display: flex; align-items: center; gap: 4px; padding: 0.7rem 0.9rem; }
        .sg-ai-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--color-text-secondary);
          opacity: 0.5;
          animation: sgAiDotBounce 1.2s infinite ease-in-out;
        }
        .sg-ai-dot:nth-child(2) { animation-delay: 0.15s; }
        .sg-ai-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes sgAiDotBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.45; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        .sg-ai-input-row {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem;
          border-top: 1px solid var(--color-border-subtle);
          flex-shrink: 0;
        }
        .sg-ai-input {
          flex: 1;
          border: 1px solid var(--color-border-subtle);
          border-radius: 999px;
          padding: 0.6rem 1rem;
          /* iOS Safari auto-zooms the whole page on focus if a text input's
             font-size is under 16px — 16px here is the floor, not a design
             choice, even though 0.85rem matches the rest of the widget. */
          font-size: 16px;
          background: var(--color-surface);
          color: var(--color-text-heading);
        }
        .sg-ai-input:focus-visible { outline: 2px solid var(--sg-accent); outline-offset: 1px; }
        .sg-ai-input:disabled { opacity: 0.6; }
        .sg-ai-send {
          width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
          background: var(--sg-accent); color: #fff; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .sg-ai-send:disabled { opacity: 0.5; cursor: not-allowed; }
        .sg-ai-error { padding: 0 0.9rem 0.75rem; font-size: 0.72rem; color: var(--color-danger); }

        @media (max-width: 640px) {
          /* The bottom dock nav (.sg-navbar) spans nearly the full width and
             sits at bottom:10px with a z-index above this FAB, so the old
             bottom-left spot got buried under it. Moved to the right side,
             clear above the dock's height instead. */
          .sg-ai-fab { left: auto; right: 1rem; bottom: 92px; width: 48px; height: 48px; }
          .sg-ai-panel { left: auto; right: 0.75rem; bottom: 150px; transform-origin: bottom right; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sg-ai-fab, .sg-ai-panel { transition: none; }
          .sg-ai-fab:not(.is-open) { animation: none; }
          .sg-ai-cursor, .sg-ai-dot { animation: none; }
        }
      `}</style>
    </>
  )
}
