import { useEffect, useRef, useState } from 'react'
import { Sparkles, X, ArrowUp, Loader2 } from 'lucide-react'
import { sendChatMessage } from '../../lib/aiChat'

const GREETING = "Hi — I'm Stormglide's AI assistant. Ask me anything about what we build, get a price estimate, book time with the team, or ask something completely unrelated — happy to help either way."

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, sending])

  async function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setSending(true)
    setError(false)

    try {
      const { reply } = await sendChatMessage(next)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setError(true)
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now — try WhatsApp or the contact form, or give it another moment and try again." }])
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button
        className={`sg-ai-fab${open ? ' is-open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <Sparkles size={21} />}
      </button>

      <div className={`sg-ai-panel${open ? ' is-open' : ''}`} role="dialog" aria-label="Stormglide AI assistant" aria-hidden={!open}>
        <div className="sg-ai-header">
          <div className="sg-ai-header-icon"><Sparkles size={16} /></div>
          <div>
            <div className="sg-ai-header-title">Stormglide AI</div>
            <div className="sg-ai-header-sub">Ask anything — really</div>
          </div>
        </div>

        <div className="sg-ai-messages" ref={listRef}>
          {messages.map((m, i) => (
            <div key={i} className={`sg-ai-bubble sg-ai-bubble-${m.role}`}>{m.content}</div>
          ))}
          {sending && (
            <div className="sg-ai-bubble sg-ai-bubble-assistant sg-ai-typing">
              <Loader2 size={14} className="sg-ai-spin" /> Thinking…
            </div>
          )}
        </div>

        <form className="sg-ai-input-row" onSubmit={handleSend}>
          <input
            className="sg-ai-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message…"
            aria-label="Message"
            disabled={sending}
          />
          <button type="submit" className="sg-ai-send" disabled={sending || !input.trim()} aria-label="Send">
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
        .sg-ai-fab.is-open { background: var(--color-text-heading); }

        .sg-ai-panel {
          position: fixed;
          left: 1.25rem;
          bottom: 5.25rem;
          z-index: 1001;
          width: min(360px, calc(100vw - 2.5rem));
          height: min(520px, calc(100vh - 8rem));
          display: flex;
          flex-direction: column;
          background: var(--color-surface);
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
          background: var(--color-surface-alt);
          flex-shrink: 0;
        }
        .sg-ai-header-icon {
          width: 32px; height: 32px; border-radius: 9px;
          background: color-mix(in srgb, var(--sg-accent) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--sg-accent) 25%, transparent);
          display: flex; align-items: center; justify-content: center;
          color: var(--sg-accent); flex-shrink: 0;
        }
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
        .sg-ai-typing { display: flex; align-items: center; gap: 0.4rem; color: var(--color-text-secondary); }
        .sg-ai-spin { animation: sgAiSpin 0.8s linear infinite; }
        @keyframes sgAiSpin { to { transform: rotate(360deg); } }

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
          font-size: 0.85rem;
          background: var(--color-surface);
          color: var(--color-text-heading);
        }
        .sg-ai-input:focus-visible { outline: 2px solid var(--sg-accent); outline-offset: 1px; }
        .sg-ai-send {
          width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
          background: var(--sg-accent); color: #fff; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .sg-ai-send:disabled { opacity: 0.5; cursor: not-allowed; }
        .sg-ai-error { padding: 0 0.9rem 0.75rem; font-size: 0.72rem; color: var(--color-danger); }

        @media (max-width: 640px) {
          .sg-ai-fab { left: 1rem; bottom: 1rem; width: 48px; height: 48px; }
          .sg-ai-panel { left: 0.75rem; bottom: 4.75rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sg-ai-fab, .sg-ai-panel { transition: none; }
        }
      `}</style>
    </>
  )
}
