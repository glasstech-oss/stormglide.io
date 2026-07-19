import { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { defaultTheme } from '../data/defaultTheme'
import { defaultVisualVariantId, getVisualVariant, lightColors } from '../data/visualVariants'

const ThemeContext = createContext(null)

// Theme utilities intentionally share this module with their provider.
// eslint-disable-next-line react-refresh/only-export-components
export function getThemeVariables(theme, variant, preserveFonts = false) {
  const vars = {}
  
  // Custom theme properties from DB
  Object.entries(theme).forEach(([key, value]) => {
    if (
      typeof value === 'string' &&
      (key.startsWith('color') ||
        (!preserveFonts && key.startsWith('font')) ||
        key.startsWith('border') ||
        key.startsWith('section'))
    ) {
      const cssVar = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase()
      vars[cssVar] = value
    }
  })

  if (!preserveFonts) {
    vars['--font-display'] = variant.fonts.display
    vars['--font-body'] = variant.fonts.body
    vars['--font-mono'] = variant.fonts.mono
  }

  const c = variant.colors
  const r = variant.radii

  Object.assign(vars, {
    '--color-background': c.background,
    '--color-surface': c.surface,
    '--color-surface-alt': c.surfaceAlt,
    '--color-border-subtle': c.border,
    '--color-accent-blue': c.accent,
    '--color-accent-cyan': c.accent,
    '--color-accent-violet': c.accent2,
    '--color-accent-coral': c.danger,
    '--color-accent-gold': c.warning,
    '--color-text-heading': c.textHeading,
    '--color-text-primary': c.textPrimary,
    '--color-text-secondary': c.textSecondary,
    '--color-success': c.accent3,
    '--color-warning': c.warning,
    '--color-danger': c.danger,

    '--bg-white': c.background,
    '--bg-soft': c.surface,
    '--bg-subtle': c.surfaceAlt,
    '--bg-dark': c.background,
    '--bg-dark-2': c.surfaceAlt,
    '--ink-950': c.textHeading,
    '--ink-900': c.textHeading,
    '--ink-700': c.textPrimary,
    '--ink-500': c.textSecondary,
    '--ink-400': c.textSecondary,
    '--ink-300': c.muted,
    '--ink-100': c.border,
    '--ink-050': c.surface,

    '--blue': c.accent,
    '--blue-dark': c.accentDark,
    '--blue-light': `${c.accent}18`,
    '--violet': c.accent2,
    '--green': c.accent3,
    '--amber': c.warning,
    '--red': c.danger,

    '--radius': r.base,
    '--radius-lg': r.lg,
    '--radius-xl': r.xl,
    '--border-radius': r.base,
    '--border-radius-lg': r.lg,
    '--section-padding': theme.sectionPadding || '110px',

    '--shadow-xs': `0 1px 2px ${c.textHeading}10`,
    '--shadow-sm': `0 10px 30px ${c.textHeading}10`,
    '--shadow-md': `0 18px 60px ${c.textHeading}18`,
    '--shadow-lg': `0 28px 90px ${c.textHeading}24`,

    '--sg-accent': c.accent,
    '--sg-accent-dark': c.accentDark,
    '--sg-accent-2': c.accent2,
    '--sg-accent-3': c.accent3,
    '--sg-hero-bg': c.background,
    '--sg-hero-text': c.textHeading,
    '--sg-hero-muted': c.textSecondary,
    '--sg-border': c.border,
    '--sg-spotlight-color': c.heroGlow,
    '--sg-spotlight-flash': c.accent,
  })

  return vars
}

function setVars(root, vars) {
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}

function getAppearanceVariant(variant, appearance) {
  if (appearance !== 'light') return variant
  return { ...variant, colors: lightColors }
}

function applyThemeToDOM(theme, variant, appearance) {
  const root = document.documentElement
  root.dataset.sgVariant = variant.id
  root.dataset.sgAppearance = appearance
  const vars = getThemeVariables(theme, getAppearanceVariant(variant, appearance))
  setVars(root, vars)
}

// The site is permanently light/off-white — no dark mode.
const appearance = 'light'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('theme', defaultTheme)
  const activeVariant = getVisualVariant(defaultVisualVariantId)

  useEffect(() => {
    applyThemeToDOM(theme, activeVariant, appearance)
  }, [theme, activeVariant])

  function updateTheme(key, value) {
    setTheme(prev => ({ ...prev, [key]: value }))
  }

  function resetTheme() {
    setTheme(defaultTheme)
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      updateTheme,
      resetTheme,
      visualVariant: activeVariant.id,
      activeVariant,
      appearance,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext)
}
