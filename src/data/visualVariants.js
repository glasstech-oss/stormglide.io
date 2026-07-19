export const visualVariants = {
  glass: {
    id: 'glass',
    label: 'Glass',
    shortLabel: 'G',
    description: 'Liquid glass — frosted translucent surfaces over a living gradient field.',
    fonts: {
      display: 'Avenir Next Condensed',
      body: 'Manrope',
      mono: 'Space Mono',
    },
    colors: {
      background: '#0A1120',
      surface: 'rgba(255,255,255,0.05)',
      surfaceAlt: 'rgba(255,255,255,0.09)',
      border: 'rgba(255,255,255,0.14)',
      textHeading: '#F4F7FC',
      textPrimary: '#E1E6F0',
      textSecondary: 'rgba(230,235,246,0.66)',
      muted: 'rgba(230,235,246,0.4)',
      accent: '#4D8DFF',
      accentDark: '#2563EB',
      accent2: '#2FB673',
      accent3: '#3DDC97',
      warning: '#FEBC2E',
      danger: '#FF6B6B',
      heroGlow: 'rgba(77,141,255,0.26)',
      heroGlow2: 'rgba(240,127,35,0.18)',
    },
    radii: {
      base: '20px',
      lg: '28px',
      xl: '36px',
    },
    hero: {
      eyebrow: 'Business Systems Studio',
      titleLines: [
        { text: 'SaaS Software' },
        { text: 'Built for African', accent: true, italic: true, joinNext: ' Businesses.' },
      ],
      body: 'Stop running your business on WhatsApp, Excel, and paper. We build the system that replaces them — customers, staff, inventory, and reports, all in one dashboard.',
      primaryCta: 'Explore the systems',
      secondaryCta: 'Start a project',
      browserLabel: 'stormglide.io',
      visualLabels: ['Website', 'Web app', 'Native app'],
    },
  },
}

// Light appearance for the 'glass' variant — not a recolor of the dark palette,
// a distinct recipe: light glass needs a pale, warm base for the vivid wallpaper
// to sit on, and dark (not white) text/ink since the backdrop is now light.
export const lightColors = {
  background: '#FAF9F6',
  surface: 'rgba(22,35,63,0.03)',
  surfaceAlt: 'rgba(22,35,63,0.05)',
  border: 'rgba(22,35,63,0.14)',
  textHeading: '#16233F',
  textPrimary: '#33415E',
  textSecondary: 'rgba(22,35,63,0.62)',
  muted: 'rgba(22,35,63,0.4)',
  accent: '#2563EB',
  accentDark: '#1D4FC4',
  accent2: '#128A57',
  accent3: '#1AA15A',
  warning: '#B7791F',
  danger: '#D6483F',
  heroGlow: 'rgba(37,99,235,0.14)',
  heroGlow2: 'rgba(240,127,35,0.12)',
}

export const defaultVisualVariantId = 'glass'

export function getVisualVariant(id) {
  return visualVariants[id] || visualVariants[defaultVisualVariantId]
}
