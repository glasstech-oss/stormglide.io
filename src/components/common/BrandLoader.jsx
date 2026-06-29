import BrandLogo from './BrandLogo'

export default function BrandLoader({ label = 'Loading Stormglide' }) {
  return (
    <div className="sg-brand-loader" role="status" aria-live="polite">
      <BrandLogo className="sg-brand-loader-logo" />
      <span className="sg-brand-loader-track" aria-hidden="true"><span /></span>
      <span className="sg-visually-hidden">{label}</span>
    </div>
  )
}
