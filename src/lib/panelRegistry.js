import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getBoardKey, getSpatialPosition } from './spatialBoard'

/**
 * Global singletons (Navbar, WhatsAppFloat, ScrollProgress, GradientMesh) need to read
 * "the scroll position of whichever panel is currently visible" — but scrolling now
 * happens inside individual board panels (or the depth overlay), not the document.
 * This is a tiny pub-sub registry each panel/overlay registers its own scroll node into.
 */
const nodes = new Map()
const listeners = new Set()

export function setPanelNode(key, node) {
  if (node) nodes.set(key, node)
  else nodes.delete(key)
  listeners.forEach(fn => fn())
}

export function getPanelNode(key) {
  return nodes.get(key) || null
}

function subscribePanelRegistry(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const OVERLAY_KEY = '__overlay__'

/** Returns the DOM node currently responsible for scrolling — a board panel, or the depth/off-board overlay. */
export function useActivePanelNode() {
  const location = useLocation()
  const [, forceRender] = useState(0)

  useEffect(() => subscribePanelRegistry(() => forceRender(n => n + 1)), [])

  const pos = getSpatialPosition(location.pathname)
  const key = !pos || pos.depth > 0 ? OVERLAY_KEY : getBoardKey(location.pathname)
  return getPanelNode(key)
}
