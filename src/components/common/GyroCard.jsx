import { useRef } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { useGyroscope } from '../../hooks/useGyroscope'

export default function GyroCard({ children, style, className = '', ...props }) {
  const cardRef = useRef(null)
  
  // Get raw tilt data (defaults to 0 on desktop or unsupported devices)
  const { tiltX, tiltY } = useGyroscope({ active: true })
  
  // Smooth the raw tilt values using springs for natural motion
  const smoothX = useSpring(tiltX, { stiffness: 150, damping: 20 })
  const smoothY = useSpring(tiltY, { stiffness: 150, damping: 20 })
  
  // Map tilt to 3D rotation (-15deg to 15deg)
  // tiltY (pitch) rotates around X axis, tiltX (roll) rotates around Y axis
  const rotateX = useTransform(smoothY, [-1, 1], [-10, 10])
  const rotateY = useTransform(smoothX, [-1, 1], [-10, 10])
  
  // Map tilt to a shifting glare gradient for the glass effect
  const glareX = useTransform(smoothX, [-1, 1], ['0%', '100%'])
  const glareY = useTransform(smoothY, [-1, 1], ['0%', '100%'])
  const glareOpacity = useTransform(smoothX, [-1, 0, 1], [0.5, 0, 0.5])

  return (
    <motion.div
      ref={cardRef}
      className={`sg-gyro-card ${className}`}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      {...props}
    >
      {children}
      
      {/* Glare overlay */}
      <motion.div
        className="sg-gyro-glare"
        style={{
          left: glareX,
          top: glareY,
          opacity: glareOpacity
        }}
      />
      
      <style>{`
        .sg-gyro-card {
          position: relative;
          overflow: hidden;
          will-change: transform;
        }
        .sg-gyro-glare {
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.15) 0%,
            transparent 60%
          );
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 10;
          mix-blend-mode: overlay;
        }
      `}</style>
    </motion.div>
  )
}
