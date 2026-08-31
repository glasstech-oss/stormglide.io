/**
 * The site's spatial map: where each route lives on the persistent canvas board.
 * Top-level pages sit left→right in navbar order (x). Sub-pages belong to their
 * parent's x position but sit "deeper" (depth) — they render as a zoom-in overlay
 * rather than as their own board panel (see App.jsx for why).
 */
export const BOARD_PATHS = ['/', '/services', '/products', '/work', '/pricing', '/contact']

const SPATIAL_X = Object.fromEntries(BOARD_PATHS.map((path, i) => [path, i]))

const PRODUCT_LANDING_PATHS = ['/nexus-hrm', '/cargoscan', '/sano-health', '/nexus-dental']

export function getSpatialPosition(pathname) {
  if (SPATIAL_X[pathname] !== undefined) return { x: SPATIAL_X[pathname], depth: 0 }
  if (pathname.startsWith('/services/')) return { x: SPATIAL_X['/services'], depth: 1 }
  if (pathname.startsWith('/products/') || PRODUCT_LANDING_PATHS.includes(pathname)) {
    return { x: SPATIAL_X['/products'], depth: 1 }
  }
  if (pathname.startsWith('/work/')) return { x: SPATIAL_X['/work'], depth: 1 }
  if (pathname.startsWith('/industries')) return { x: SPATIAL_X['/work'], depth: 1 }
  return null // off-board routes (client portal, admin, 404)
}

/** Which board panel "owns" this pathname — the panel behind a depth overlay, or null off-board. */
export function getBoardKey(pathname) {
  const pos = getSpatialPosition(pathname)
  return pos ? BOARD_PATHS[pos.x] : null
}

/** Direction of travel between two spatial positions, for transition variants. */
export function getMove(from, to) {
  if (!from || !to) return { type: 'fade' }
  if (to.x !== from.x) return { type: 'lateral', dir: to.x > from.x ? 1 : -1 }
  if (to.depth !== from.depth) return { type: 'depth', dir: to.depth > from.depth ? 1 : -1 }
  return { type: 'fade' }
}
