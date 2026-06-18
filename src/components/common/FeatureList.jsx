/**
 * FeatureList - Reusable component for displaying feature lists
 */
export default function FeatureList({
  items = [],
  color = 'var(--sg-accent)',
  layout = 'column', // 'column' or 'grid'
  showIcon = true,
}) {
  if (!items || items.length === 0) return null

  return (
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'grid',
        gridTemplateColumns: layout === 'grid' ? 'repeat(2, 1fr)' : '1fr',
        gap: '0.75rem',
      }}
    >
      {items.map((item, idx) => (
        <li
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            fontSize: '0.95rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
          }}
        >
          {showIcon && (
            <span
              style={{
                color,
                fontWeight: 600,
                marginTop: '0.2rem',
                flexShrink: 0,
              }}
            >
              ✓
            </span>
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
