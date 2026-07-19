import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useActivePanelNode } from './panelRegistry'

// Mirrors App.jsx's DESKTOP_BOARD_QUERY — the breakpoint at which routes move
// from plain window scroll to the persistent board-panel layout.
const DESKTOP_BOARD_QUERY = '(min-width: 920px)'

// gsap + ScrollTrigger + Lenis (~50KB gzipped) are only needed on the handful
// of pages that pin/scrub or fade-reveal on scroll — loading them as a dynamic
// import (not a static top-level import) keeps them out of each route's
// initial chunk entirely, so they start downloading only once this hook
// actually runs, in parallel with the page's first paint rather than blocking
// it. Cached in one module-level promise so navigating between pages that all
// use this hook only pays the fetch/parse cost once per session.
let scrollLibsPromise = null
function loadScrollLibs() {
  if (!scrollLibsPromise) {
    scrollLibsPromise = Promise.all([
      import('lenis'),
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([lenisMod, gsapMod, stMod]) => {
      const gsap = gsapMod.default
      const { ScrollTrigger } = stMod
      gsap.registerPlugin(ScrollTrigger)
      return { Lenis: lenisMod.default, gsap, ScrollTrigger }
    })
  }
  return scrollLibsPromise
}

/**
 * Smooth-scroll (Lenis) synced to GSAP ScrollTrigger, scoped to whichever DOM
 * node actually scrolls this route: the persistent board panel on desktop, or
 * `window` on mobile (see panelRegistry.js). Board panels never unmount once
 * visited — content-visibility:auto just hides them off-screen — so this only
 * runs while `routePath` is the active location; otherwise the rAF loop would
 * keep ticking in the background forever after navigating away.
 *
 * `buildTriggers(scroller, { gsap, ScrollTrigger })` is called once Lenis is
 * live for this route and should create + return a gsap.context (or anything
 * with `.revert()`) so its ScrollTriggers get torn down when the route goes
 * inactive. `scroller` is the board panel element on desktop, or `undefined`
 * (meaning window) on mobile. `gsap`/`ScrollTrigger` are passed in rather than
 * imported directly by the page so those libraries stay out of the page's own
 * static import graph — see loadScrollLibs() above.
 *
 * Convention for pages that pin or scrub (not just fade-reveal): scope that
 * work to desktop inside `buildTriggers` with
 * `gsap.matchMedia(scroller).add('(min-width: 900px)', () => {...})` so
 * narrow/mobile viewports fall back to a plain stacked layout instead of a
 * pin — pins assume a tall board-panel viewport and don't degrade gracefully
 * on their own.
 */
export function useLenis(routePath, buildTriggers) {
  const location = useLocation()
  const activePanelNode = useActivePanelNode()
  const isActive = location.pathname === routePath

  useEffect(() => {
    if (!isActive) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const isDesktopBoard = window.matchMedia(DESKTOP_BOARD_QUERY).matches
    if (isDesktopBoard && !activePanelNode) return undefined // panel ref not registered yet

    let cancelled = false
    let lenis
    let frame
    let ctx
    let refreshTimer
    let lateRefreshTimer
    let images = []
    let refresh

    loadScrollLibs().then(({ Lenis, gsap, ScrollTrigger }) => {
      if (cancelled) return

      lenis = new Lenis(
        isDesktopBoard
          ? { wrapper: activePanelNode, content: activePanelNode, duration: 1.1 }
          : { duration: 1.1 },
      )

      lenis.on('scroll', ScrollTrigger.update)

      frame = requestAnimationFrame(function raf(time) {
        lenis.raf(time)
        frame = requestAnimationFrame(raf)
      })

      ctx = buildTriggers?.(isDesktopBoard ? activePanelNode : undefined, { gsap, ScrollTrigger })

      // Trigger positions are measured once at creation time; images (e.g.
      // the product mockups below the fold) still loading at that point
      // shift layout afterward and leave stale start/end offsets, which is
      // what let sections read as already-revealed on first load. Re-measure
      // once the page's images have actually settled.
      images = Array.from(document.images).filter(img => !img.complete)
      refresh = () => ScrollTrigger.refresh()
      refreshTimer = setTimeout(refresh, 300)
      // A second, later refresh catches the board's lateral-pan spring (see
      // Board's cameraX in App.jsx, stiffness 140/damping 24) settling after
      // a nav — that can take noticeably longer than 300ms, and any pinned
      // trigger measured against the panel mid-pan would pin at the wrong
      // scroll offset. Reveal-only triggers tolerate being a little off;
      // pins don't, so this matters starting with the first page that pins
      // something.
      lateRefreshTimer = setTimeout(refresh, 700)
      images.forEach(img => img.addEventListener('load', refresh, { once: true }))
      window.addEventListener('load', refresh)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      clearTimeout(refreshTimer)
      clearTimeout(lateRefreshTimer)
      images.forEach(img => img.removeEventListener('load', refresh))
      window.removeEventListener('load', refresh)
      ctx?.revert?.()
      lenis?.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, activePanelNode])
}
