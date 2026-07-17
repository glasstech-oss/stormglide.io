import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'

/**
 * Manual document.startViewTransition() wrapper — NOT React Router's built-in
 * `viewTransition` prop. That prop is a confirmed no-op under this app's plain
 * <BrowserRouter> (it only does anything under the data-router APIs —
 * createBrowserRouter/RouterProvider — and migrating to those is a separate,
 * riskier change to the existing AnimatePresence transition system in
 * App.jsx's DepthOverlay). Calling startViewTransition directly works with
 * any router.
 *
 * `flushSync` forces the navigate()-triggered re-render to commit
 * synchronously inside the transition callback, so the View Transitions API
 * captures the real "after" DOM instead of a stale frame. `sgViaVT: true` is
 * threaded through navigation state so App.jsx's SiteContent can suppress its
 * own Framer Motion page transition for this navigation — otherwise both
 * systems would animate the same nav at once.
 *
 * Known limitation, not solved here: if the target route's lazy chunk isn't
 * preloaded, flushSync commits the Suspense fallback as the VT "new" state,
 * and real content pops in un-transitioned once the chunk resolves. The
 * existing hover-prefetch (prefetchBoardPage in Navbar.jsx) covers the common
 * case.
 */
export function navigateWithViewTransition(navigate, to, { name, state } = {}) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || !document.startViewTransition) {
    navigate(to, { state })
    return
  }
  const root = document.documentElement
  if (name) root.setAttribute('data-sg-vt', name)
  const transition = document.startViewTransition(() => {
    flushSync(() => navigate(to, { state: { ...state, sgViaVT: true } }))
  })
  transition.finished.finally(() => root.removeAttribute('data-sg-vt'))
}

export function useViewTransitionNavigate() {
  const navigate = useNavigate()
  return useCallback((to, opts) => navigateWithViewTransition(navigate, to, opts), [navigate])
}

/**
 * Drop into a <Link>'s onClick. Lets modifier-clicks / middle-clicks / already-
 * handled events fall through to the browser's normal new-tab behavior;
 * otherwise takes over navigation via the View Transition wrapper above.
 */
export function handleViewTransitionClick(e, navigateFn, to, opts) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  navigateFn(to, opts)
}
