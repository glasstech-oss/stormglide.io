import { MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useActivePanelNode } from '../../lib/panelRegistry'

export default function WhatsAppFloat() {
  const { theme } = useTheme()
  const [isVisible, setIsVisible] = useState(false)
  const phone = theme.contactWhatsapp.replace(/[^0-9]/g, '').replace(/^0/, '233')
  const activePanelNode = useActivePanelNode()

  useEffect(() => {
    if (!activePanelNode) return undefined
    const updateVisibility = () => {
      const revealPoint = Math.min(520, window.innerHeight * 0.65)
      setIsVisible(activePanelNode.scrollTop > revealPoint)
    }

    updateVisibility()
    activePanelNode.addEventListener('scroll', updateVisibility, { passive: true })
    return () => activePanelNode.removeEventListener('scroll', updateVisibility)
  }, [activePanelNode])

  return (
    <a
      className={`sg-whatsapp-float${isVisible ? ' is-visible' : ''}`}
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact Stormglide on WhatsApp"
      title="WhatsApp"
    >
      <MessageCircle size={23} />
      <style>{`
        .sg-whatsapp-float {
          position: fixed;
          right: 1.25rem;
          bottom: 1.25rem;
          z-index: 1000;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.32);
          border-radius: 50%;
          background: linear-gradient(160deg, rgba(30,169,82,0.92), rgba(20,130,64,0.88));
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
          color: #fff;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255,255,255,0.35);
          text-decoration: none;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(12px);
          transition: opacity 160ms ease, transform 160ms ease, box-shadow 160ms ease, visibility 160ms ease;
        }

        .sg-whatsapp-float.is-visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateY(0);
        }

        .sg-whatsapp-float.is-visible:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.26);
        }

        .sg-whatsapp-float:focus-visible {
          outline: 2px solid var(--sg-accent);
          outline-offset: 3px;
        }

        @media (max-width: 640px) {
          .sg-whatsapp-float {
            right: 1rem;
            bottom: 1rem;
            width: 44px;
            height: 44px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sg-whatsapp-float {
            transition: none;
          }
        }
      `}</style>
    </a>
  )
}
