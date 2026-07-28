import Footer from './Footer'

export default function PageLayout({ children }) {
  return (
    <>
      <div className="sg-pull-refresh-easter-egg">
        <div className="easter-content">
          <span className="sg-sys">SYSTEM STATUS</span>
          <span className="sg-on">ONLINE</span>
        </div>
      </div>
      <main style={{ paddingTop: '68px', position: 'relative', zIndex: 1, background: 'var(--color-background)' }}>
        {children}
      </main>
      <Footer />
      <style>{`
        .sg-pull-refresh-easter-egg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 150px;
          transform: translateY(-100%);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 2rem;
          background: #000;
          z-index: 0;
          overflow: hidden;
        }
        .sg-pull-refresh-easter-egg::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(0deg, rgba(0, 255, 0, 0.1) 0px, transparent 1px, transparent 4px);
          opacity: 0.3;
        }
        .sg-pull-refresh-easter-egg .easter-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          font-family: var(--font-mono);
          letter-spacing: 0.15em;
        }
        .sg-pull-refresh-easter-egg .sg-sys {
          font-size: 0.65rem;
          color: var(--color-text-secondary);
        }
        .sg-pull-refresh-easter-egg .sg-on {
          font-size: 0.9rem;
          color: #00ff00;
          font-weight: 700;
          text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
        }
      `}</style>
    </>
  )
}
