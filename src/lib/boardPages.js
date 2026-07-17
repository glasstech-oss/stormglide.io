import { lazy } from 'react'

/** Raw dynamic importers, keyed by board path — used both to build the lazy
 *  components below and to prefetch a page's chunk on nav-link hover. */
export const boardPageImporters = {
  '/': () => import('../pages/Home'),
  '/services': () => import('../pages/ServicesPage'),
  '/products': () => import('../pages/ProductsPage'),
  '/work': () => import('../pages/WorkPage'),
  '/pricing': () => import('../pages/PricingPage'),
  '/contact': () => import('../pages/ContactPage'),
}

export const boardPageComponents = Object.fromEntries(
  Object.entries(boardPageImporters).map(([path, importer]) => [path, lazy(importer)])
)

export function prefetchBoardPage(path) {
  boardPageImporters[path]?.()
}
