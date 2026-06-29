function OfficialMark({ x = 0, y = 0, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect className="sg-brand-logo-mark-ink" x="22" y="2" width="20" height="20" />
      <rect className="sg-brand-logo-mark-accent" x="50" y="0" width="26" height="26" />
      <path className="sg-brand-logo-mark-ink" d="M0 34H42V80H20V58H0Z" />
      <rect className="sg-brand-logo-mark-ink" x="50" y="34" width="26" height="24" />
    </g>
  )
}

export default function BrandLogo({
  className = '',
  label = 'Stormglide.io',
  markOnly = false,
}) {
  if (markOnly) {
    return (
      <span className={`sg-brand-logo is-mark ${className}`.trim()} role="img" aria-label={label}>
        <svg className="sg-brand-logo-mark-svg" viewBox="0 0 78 80" aria-hidden="true">
          <OfficialMark />
        </svg>
      </span>
    )
  }

  return (
    <span className={`sg-brand-logo is-full ${className}`.trim()} role="img" aria-label={label}>
      <svg viewBox="0 0 960 141" aria-hidden="true">
        <OfficialMark x={2} y={31} scale={0.96} />
        <text
          className="sg-brand-logo-wordmark"
          x="126"
          y="108"
          fontFamily="Manrope, Arial, sans-serif"
          fontSize="108"
          fontWeight="500"
          letterSpacing="-5"
        >
          stormglide<tspan className="sg-brand-logo-wordmark-accent">.io</tspan>
        </text>
      </svg>
    </span>
  )
}
