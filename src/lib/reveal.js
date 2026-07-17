/**
 * Shared reveal-on-scroll recipe for pages that don't hijack scroll (Pricing,
 * Contact) — consolidates what was previously slightly different per-item
 * stagger delays/easings duplicated across those two files into one constant.
 */
export const REVEAL_EASE = [0.16, 1, 0.3, 1]

export const revealItem = (i = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.06, duration: 0.5, ease: REVEAL_EASE },
})
