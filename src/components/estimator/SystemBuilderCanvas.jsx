import { motion } from 'framer-motion'
import { Plus, X, Globe, Database, Server, Smartphone, LayoutDashboard } from 'lucide-react'

// Map factor IDs to icons and colors
const FACTOR_ICONS = {
  'multi-branch': { icon: Globe, color: '#3b82f6' },
  'payments': { icon: Database, color: '#10b981' },
  'offline': { icon: Server, color: '#f59e0b' },
  'whatsapp': { icon: Smartphone, color: '#22c55e' },
  'staff-roles': { icon: LayoutDashboard, color: '#8b5cf6' },
  'reports': { icon: LayoutDashboard, color: '#ec4899' },
  'rush': { icon: Plus, color: '#f43f5e' },
  'branding': { icon: Plus, color: '#ec4899' },
  'copywriting': { icon: Plus, color: '#8b5cf6' },
  'multilang': { icon: Globe, color: '#3b82f6' },
  'support': { icon: Plus, color: '#10b981' },
}

export default function SystemBuilderCanvas({ pkg, scopeFactors, addOns, allScopeFactors, allAddOns, onToggleScopeFactor, onToggleAddOn }) {
  if (!pkg) return null

  const activeNodes = [
    ...allScopeFactors.filter(f => scopeFactors.has(f.id)).map(f => ({ ...f, type: 'scope' })),
    ...allAddOns.filter(a => addOns.has(a.id)).map(a => ({ ...a, type: 'addon' }))
  ]

  const availableNodes = [
    ...allScopeFactors.filter(f => !scopeFactors.has(f.id)).map(f => ({ ...f, type: 'scope' })),
    ...allAddOns.filter(a => !addOns.has(a.id)).map(a => ({ ...a, type: 'addon' }))
  ]

  const PkgIcon = pkg.icon || Server

  return (
    <div className="sg-system-builder-canvas">
      {/* Central Base Node */}
      <div className="sg-canvas-center">
        <div className="sg-node base-node" style={{ borderColor: pkg.color }}>
          <PkgIcon size={32} color={pkg.color} />
          <span>{pkg.name}</span>
          <div className="sg-pulse-ring" style={{ borderColor: pkg.color }} />
        </div>

        {/* Orbiting Active Nodes */}
        {activeNodes.map((node, i) => {
          const angle = (i / activeNodes.length) * Math.PI * 2
          const radius = 140
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          const nodeMeta = FACTOR_ICONS[node.id] || { icon: Plus, color: 'var(--color-text-secondary)' }
          const Icon = nodeMeta.icon

          return (
            <motion.div
              key={node.id}
              className="sg-node active-node"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x, y }}
              exit={{ scale: 0, opacity: 0 }}
              style={{ borderColor: nodeMeta.color }}
            >
              <button 
                className="sg-remove-node"
                onClick={() => node.type === 'scope' ? onToggleScopeFactor(node.id) : onToggleAddOn(node.id)}
              >
                <X size={12} />
              </button>
              <Icon size={16} color={nodeMeta.color} />
              <span className="sg-node-label">{node.label}</span>
              
              {/* Connecting line to center */}
              <svg className="sg-node-link">
                <line x1={0} y1={0} x2={-x} y2={-y} stroke={nodeMeta.color} strokeWidth="2" strokeDasharray="4 4" />
              </svg>
            </motion.div>
          )
        })}
      </div>

      {/* Available Modules Dock */}
      <div className="sg-canvas-dock">
        <div className="sg-dock-title">Available Modules</div>
        <div className="sg-dock-items">
          {availableNodes.map(node => {
            const nodeMeta = FACTOR_ICONS[node.id] || { icon: Plus, color: 'var(--color-text-secondary)' }
            const Icon = nodeMeta.icon
            return (
              <motion.button
                key={node.id}
                className="sg-dock-item"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => node.type === 'scope' ? onToggleScopeFactor(node.id) : onToggleAddOn(node.id)}
              >
                <Icon size={14} color={nodeMeta.color} />
                <span>{node.label}</span>
                <Plus size={14} className="sg-add-icon" />
              </motion.button>
            )
          })}
        </div>
      </div>

      <style>{`
        .sg-system-builder-canvas {
          position: relative;
          width: 100%;
          min-height: 500px;
          background: var(--bg-soft);
          border: 1.5px solid var(--ink-100);
          border-radius: var(--radius-xl);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .sg-canvas-center {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 350px;
        }

        .sg-node {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--color-surface);
          border: 2px solid;
          border-radius: 50%;
          z-index: 10;
        }

        .base-node {
          width: 90px;
          height: 90px;
          box-shadow: 0 0 40px rgba(0,0,0,0.1);
        }

        .base-node span {
          font-size: 0.65rem;
          font-weight: 700;
          text-align: center;
          margin-top: 0.25rem;
          line-height: 1.1;
          padding: 0 0.25rem;
        }

        .sg-pulse-ring {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          border: 2px solid;
          opacity: 0.2;
          animation: pulseRing 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulseRing {
          0% { transform: scale(0.9); opacity: 0.5; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .active-node {
          width: 50px;
          height: 50px;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
        }

        .sg-remove-node {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--color-danger);
          color: #fff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.2s;
        }

        .active-node:hover .sg-remove-node {
          opacity: 1;
          transform: scale(1);
        }

        .sg-node-label {
          position: absolute;
          bottom: -24px;
          font-size: 0.65rem;
          white-space: nowrap;
          background: var(--color-surface);
          padding: 0.2rem 0.5rem;
          border-radius: 99px;
          border: 1px solid var(--ink-100);
          color: var(--color-text-secondary);
          pointer-events: none;
        }

        .sg-node-link {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          overflow: visible;
          z-index: -1;
          pointer-events: none;
        }

        .sg-canvas-dock {
          background: var(--glass-bg-strong);
          border-top: 1px solid var(--ink-100);
          padding: 1.5rem;
        }

        .sg-dock-title {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-secondary);
          margin-bottom: 1rem;
        }

        .sg-dock-items {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .sg-dock-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.875rem;
          border-radius: 999px;
          background: var(--color-surface);
          border: 1.5px solid var(--ink-100);
          color: var(--color-text-primary);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .sg-dock-item:hover {
          border-color: var(--sg-accent);
        }

        .sg-add-icon {
          color: var(--color-text-secondary);
          transition: color 0.2s;
        }

        .sg-dock-item:hover .sg-add-icon {
          color: var(--sg-accent);
        }
      `}</style>
    </div>
  )
}
