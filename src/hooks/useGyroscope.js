import { useEffect } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

/* Gyroscope parallax for mobile — adds a subtle holographic float based on device tilt.
   Fails gracefully if DeviceOrientationEvent is unavailable or needs explicit permission. */
export function useGyroscope(options = { stiffness: 100, damping: 30, mass: 0.5 }) {
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.DeviceOrientationEvent) return undefined

    const handleOrientation = (e) => {
      if (e.gamma === null || e.beta === null) return
      // Normalize beta (front-back tilt): ~45deg is a typical holding angle
      // normalize gamma (left-right tilt): [-45, 45] -> [-1, 1]
      const b = Math.max(0, Math.min(90, e.beta))
      const g = Math.max(-45, Math.min(45, e.gamma))
      tiltY.set((b - 45) / 45)
      tiltX.set(g / 45)
    }

    // iOS 13+ requires an explicit permission grant, triggered from within
    // a real user gesture, before deviceorientation events fire at all —
    // requesting it passively on mount is silently ignored there. Android
    // and desktop have no such requirement and just start firing directly.
    const needsPermission = typeof window.DeviceOrientationEvent.requestPermission === 'function'
    if (!needsPermission) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true })
      return () => window.removeEventListener('deviceorientation', handleOrientation)
    }

    let requested = false
    const requestOnGesture = () => {
      if (requested) return
      requested = true
      window.removeEventListener('touchend', requestOnGesture)
      window.removeEventListener('click', requestOnGesture)
      window.DeviceOrientationEvent.requestPermission()
        .then((result) => {
          if (result === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, { passive: true })
          }
        })
        .catch(() => { /* denied, or not a real user-gesture context — tilt just stays inert */ })
    }
    window.addEventListener('touchend', requestOnGesture, { passive: true })
    window.addEventListener('click', requestOnGesture)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      window.removeEventListener('touchend', requestOnGesture)
      window.removeEventListener('click', requestOnGesture)
    }
  }, [tiltX, tiltY])

  return {
    tiltX: useSpring(tiltX, options),
    tiltY: useSpring(tiltY, options),
  }
}
