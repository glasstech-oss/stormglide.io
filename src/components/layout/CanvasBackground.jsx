import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'

function useGlobalPointer() {
  const pointer = useRef({ nx: 0, ny: 0, active: false })

  useEffect(() => {
    const handlePointer = (e) => {
      let clientX, clientY
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }
      pointer.current.nx = (clientX / window.innerWidth) * 2 - 1
      pointer.current.ny = -(clientY / window.innerHeight) * 2 + 1
    }

    const handleDown = (e) => {
      pointer.current.active = true
      handlePointer(e)
    }

    const handleUp = () => {
      pointer.current.active = false
    }

    window.addEventListener('mousemove', handlePointer, { passive: true })
    window.addEventListener('touchmove', handlePointer, { passive: true })
    window.addEventListener('mousedown', handleDown, { passive: true })
    window.addEventListener('touchstart', handleDown, { passive: true })
    window.addEventListener('mouseup', handleUp, { passive: true })
    window.addEventListener('touchend', handleUp, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handlePointer)
      window.removeEventListener('touchmove', handlePointer)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('touchstart', handleDown)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchend', handleUp)
    }
  }, [])

  return pointer
}

function WaveMesh({ scrollY, globalPointer }) {
  const meshRef = useRef(null)
  const { viewport } = useThree()
  
  // We create a grid for the plane. 
  // 40 segments wide, 40 segments high.
  const [width, height, widthSegments, heightSegments] = [20, 20, 60, 60]
  
  const depthSpring = useRef(0)

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()
    const positions = meshRef.current.geometry.attributes.position
    
    // Map NDC to world coordinates at Z=0
    // viewport.width/height is the size of the view at z=0
    const mouseWorldX = globalPointer.current.nx * (viewport.width / 2)
    const mouseWorldY = globalPointer.current.ny * (viewport.height / 2)
    
    // Target depth is deep when clicking/touching, and shallow when just hovering
    const targetDepth = globalPointer.current.active ? 2.5 : 0.3
    depthSpring.current = MathUtils.lerp(depthSpring.current, targetDepth, delta * 10)
    
    const holeRadius = 3.0
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      
      // Calculate a flowing wave effect using sine and cosine functions
      const baseZ = Math.sin(x * 0.5 + time * 0.3) * 0.5 + Math.cos(y * 0.5 + time * 0.2) * 0.5
      
      const dx = x - mouseWorldX
      const dy = y - mouseWorldY
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      let pull = 0
      if (dist < holeRadius) {
        // Smooth falloff curve
        const falloff = 1 - (dist / holeRadius) * (dist / holeRadius)
        pull = falloff * falloff * depthSpring.current
      }
      
      positions.setZ(i, baseZ - pull)
    }
    
    positions.needsUpdate = true

    // Rotate the entire mesh slightly based on scroll
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0

    // Smoothly interpolate rotation based on scroll (moves from -1.4 to -0.6)
    const targetRotationX = -1.4 + (scrollProgress * 0.8)
    meshRef.current.rotation.x = MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, 0.05)

    // Gentle rotation based on mouse position
    const targetRotationY = globalPointer.current.nx * 0.2
    const targetRotationZ = globalPointer.current.ny * 0.1
    
    meshRef.current.rotation.y = MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, 0.05)
    meshRef.current.rotation.z = MathUtils.lerp(meshRef.current.rotation.z, targetRotationZ, 0.05)
  })

  return (
    <mesh ref={meshRef} position={[0, -2, -5]}>
      <planeGeometry args={[width, height, widthSegments, heightSegments]} />
      {/* Light silver/grey wireframe to match the white/techy aesthetic */}
      <meshBasicMaterial 
        color="#8892b0" 
        wireframe={true} 
        transparent={true} 
        opacity={0.35} 
      />
    </mesh>
  )
}

function Particles({ scrollY, globalPointer }) {
  const pointsRef = useRef(null)
  
  // Create 500 random points in a sphere
  const count = 500
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      const r = 8 + Math.random() * 4
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [count])

  // Create an array to store original positions for the particles
  const originalPositions = useMemo(() => new Float32Array(positions), [positions])
  const { viewport } = useThree()
  const pullSpring = useRef(0)

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    const time = state.clock.getElapsedTime()
    
    const targetPull = globalPointer.current.active ? 0.6 : 0.05
    pullSpring.current = MathUtils.lerp(pullSpring.current, targetPull, delta * 8)
    
    // Slowly rotate the particle sphere
    pointsRef.current.rotation.y = time * 0.02
    pointsRef.current.rotation.x = time * 0.01
    
    // Parallax effect on mouse move
    const targetX = globalPointer.current.nx * 0.5
    const targetY = globalPointer.current.ny * 0.5
    pointsRef.current.position.x = MathUtils.lerp(pointsRef.current.position.x, targetX, 0.02)
    pointsRef.current.position.y = MathUtils.lerp(pointsRef.current.position.y, targetY, 0.02)

    // Subtle scroll effect on particles (moving them backwards)
    pointsRef.current.position.z = -Math.min(scrollY * 0.005, 5)

    // Gravitational suck for particles
    const posAttribute = pointsRef.current.geometry.attributes.position
    
    // Local mouse coordinates mapped roughly to the particle space
    const mouseWorldX = globalPointer.current.nx * (viewport.width / 2) - pointsRef.current.position.x
    const mouseWorldY = globalPointer.current.ny * (viewport.height / 2) - pointsRef.current.position.y
    // We assume the hole is deep in Z, let's say at z = -1.5 relative to the points container
    const holeZ = -1.5

    for (let i = 0; i < count; i++) {
      const origX = originalPositions[i * 3]
      const origY = originalPositions[i * 3 + 1]
      const origZ = originalPositions[i * 3 + 2]
      
      const dx = origX - mouseWorldX
      const dy = origY - mouseWorldY
      const dz = origZ - holeZ
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      
      const pullRadius = 5.0
      let pullFactor = 0
      if (dist < pullRadius) {
        // Smoother, realistic quadratic falloff
        const falloff = 1 - Math.pow(dist / pullRadius, 2)
        pullFactor = falloff * pullSpring.current * 0.6
      }
      
      posAttribute.setX(i, MathUtils.lerp(origX, mouseWorldX, pullFactor))
      posAttribute.setY(i, MathUtils.lerp(origY, mouseWorldY, pullFactor))
      posAttribute.setZ(i, MathUtils.lerp(origZ, holeZ, pullFactor))
    }
    posAttribute.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color="#8892b0" 
        transparent={true} 
        opacity={0.6} 
        sizeAttenuation={true} 
      />
    </points>
  )
}

export default function CanvasBackground() {
  const [scrollY, setScrollY] = useState(0)
  const globalPointer = useGlobalPointer()

  useEffect(() => {
    const handleScroll = (e) => {
      setScrollY(window.scrollY || e.target.scrollTop || 0)
    }

    const overlay = document.querySelector('.sg-depth-overlay')
    if (overlay) {
      overlay.addEventListener('scroll', handleScroll, { passive: true })
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      if (overlay) overlay.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: -1, 
        pointerEvents: 'none',
        background: 'radial-gradient(circle at center, #ffffff 0%, #f4f6f9 100%)'
      }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <WaveMesh scrollY={scrollY} globalPointer={globalPointer} />
        <Particles scrollY={scrollY} globalPointer={globalPointer} />
        <fog attach="fog" args={['#f4f6f9', 8, 28]} />
      </Canvas>
    </div>
  )
}
