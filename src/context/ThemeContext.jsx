import { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { defaultTheme } from '../data/defaultTheme'
import { defaultVisualVariantId, getVisualVariant, visualVariants } from '../data/visualVariants'

const ThemeContext = createContext(null)

function setVars(root, vars) {
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}

function applyThemeToDOM(theme, variant) {
  const root = document.documentElement
  Object.entries(theme).forEach(([key, value]) => {
    if (
      typeof value === 'string' &&
      (key.startsWith('color') ||
        key.startsWith('font') ||
        key.startsWith('border') ||
        key.startsWith('section'))
    ) {
      const cssVar = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase()
      root.style.setProperty(cssVar, value)
    }
  })

  root.dataset.sgVariant = variant.id
  root.style.setProperty('--font-display', variant.fonts.display)
  root.style.setProperty('--font-body', variant.fonts.body)
  root.style.setProperty('--font-mono', variant.fonts.mono)

  const c = variant.colors
  const r = variant.radii

  setVars(root, {
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
    '--bg-dark': c.textHeading,
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
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('theme', defaultTheme)
  const [visualVariant, setStoredVisualVariant] = useLocalStorage('visualVariant', defaultVisualVariantId)
  const activeVariant = getVisualVariant(visualVariant)

  useEffect(() => {
    applyThemeToDOM(theme, activeVariant)
  }, [theme, activeVariant])

  function updateTheme(key, value) {
    setTheme(prev => ({ ...prev, [key]: value }))
  }

  function resetTheme() {
    setTheme(defaultTheme)
  }

  function setVisualVariant(id) {
    setStoredVisualVariant(getVisualVariant(id).id)
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      updateTheme,
      resetTheme,
      visualVariant: activeVariant.id,
      activeVariant,
      visualVariants,
      setVisualVariant,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
