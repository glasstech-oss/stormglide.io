import { useEffect } from 'react'
import { useActivePanelNode } from '../../lib/panelRegistry'

/**
 * Screen-fixed foreground light — pointer glint + a scroll-driven vignette.
 * Unlike <GradientMesh/> (the world's color blobs, which pan with the board),
 * this always stays put relative to the viewport, like light hitting the glass
 * you're looking through rather than scenery behind it.
 */
export default function AmbientGlow() {
  const activePanelNode = useActivePanelNode()

  useEffect(() => {
    if (!activePanelNode) return undefined
    let frame = 0
    const root = document.documentElement

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        const total = activePanelNode.scrollHeight - activePanelNode.clientHeight
        root.style.setProperty('--sg-scroll-n', total > 0 ? `${activePanelNode.scrollTop / total}` : '0')
        frame = 0
      })
    }

    onScroll()
    activePanelNode.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      activePanelNode.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [activePanelNode])

  return (
    <div className="sg-ambient-glow" aria-hidden="true">
      <style>{`
        .sg-ambient-glow {
          position: fixed;
          inset: 0;
          z-index: 15;
          pointer-events: none;
        }

        .sg-ambient-glow::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            42vmax 42vmax at calc(50% + var(--sg-pointer-x-n, 0) * 30%) calc(40% + var(--sg-pointer-y-n, 0) * 30%),
            color-mix(in srgb, var(--sg-accent) 8%, transparent),
            transparent 70%
          );
          transition: background-position 200ms ease;
        }

        .sg-ambient-glow::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.22) 100%);
          opacity: calc(var(--sg-scroll-n, 0) * 1);
        }

        @media (prefers-reduced-motion: reduce) {
          .sg-ambient-glow::before { transition: none; }
        }
      `}</style>
    </div>
  )
}
