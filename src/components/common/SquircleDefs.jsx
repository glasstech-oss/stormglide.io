/**
 * One reusable continuous-curvature "squircle" clip path, referenced everywhere
 * via `clip-path: url(#sg-squircle)`. Uses clipPathUnits="objectBoundingBox" so
 * this single 0-1 unit-square path scales correctly to any element's own box —
 * no per-component sizing needed. Apple's corners aren't a circular arc (that's
 * what plain border-radius gives you); a superellipse-style curve reads as
 * "continuous" because the curvature itself changes smoothly into the straight
 * edge instead of snapping from flat to a fixed-radius circle.
 */
export default function SquircleDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <clipPath id="sg-squircle" clipPathUnits="objectBoundingBox">
          <path d="M0.24,0 L0.76,0 C0.89,0 1,0.11 1,0.24 L1,0.76 C1,0.89 0.89,1 0.76,1 L0.24,1 C0.11,1 0,0.89 0,0.76 L0,0.24 C0,0.11 0.11,0 0.24,0 Z" />
        </clipPath>
      </defs>
    </svg>
  )
}
