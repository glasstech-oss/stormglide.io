import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, X, Trophy, Rocket } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export default function StormGliderGame() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [gameState, setGameState] = useState('start') // start, playing, over
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('sg_highscore') || '0', 10))
  
  const canvasRef = useRef(null)
  const requestRef = useRef(null)
  
  // Game physics state
  const state = useRef({
    shipY: 150,
    velocity: 0,
    gravity: 0.5,
    lift: -7,
    obstacles: [],
    frameCount: 0,
    score: 0,
    highScore: parseInt(localStorage.getItem('sg_highscore') || '0', 10)
  })

  const showLauncher = location.pathname === '/' || isOpen

  const resetGame = () => {
    state.current = {
      shipY: 150,
      velocity: 0,
      gravity: 0.5,
      lift: -7,
      obstacles: [],
      frameCount: 0,
      score: 0
    }
    setScore(0)
    setGameState('playing')
  }

  const jump = useCallback(() => {
    if (gameState === 'playing') {
      state.current.velocity = state.current.lift
    }
  }, [gameState])

  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing' || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const update = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update ship
      state.current.velocity += state.current.gravity
      state.current.shipY += state.current.velocity
      
      // Boundaries
      if (state.current.shipY > canvas.height - 20 || state.current.shipY < 0) {
        setGameState('over')
        return
      }

      // Draw Angry Bird
      ctx.save()
      ctx.translate(50, state.current.shipY)
      
      const maxRotation = Math.PI / 4 // 45 degrees
      const rotation = Math.min(maxRotation, Math.max(-maxRotation, state.current.velocity * 0.1))
      ctx.rotate(rotation)

      // Body (Red Circle)
      ctx.fillStyle = '#e52b22'
      ctx.beginPath()
      ctx.arc(0, 0, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.lineWidth = 1
      ctx.strokeStyle = '#000'
      ctx.stroke()
      
      // Belly (Cream)
      ctx.fillStyle = '#ffecb3'
      ctx.beginPath()
      ctx.arc(0, 4, 10, 0, Math.PI)
      ctx.fill()

      // Eyes
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(5, -4, 4, 0, Math.PI * 2) // Right eye
      ctx.fill()
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(-3, -4, 4, 0, Math.PI * 2) // Left eye
      ctx.fill()
      ctx.stroke()
      
      // Pupils
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.arc(6, -4, 1.5, 0, Math.PI * 2) // Right pupil
      ctx.arc(-2, -4, 1.5, 0, Math.PI * 2) // Left pupil
      ctx.fill()

      // Angry Eyebrows
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.moveTo(1, -6)
      ctx.lineTo(10, -9)
      ctx.lineTo(10, -11)
      ctx.lineTo(1, -8)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(1, -6)
      ctx.lineTo(-8, -9)
      ctx.lineTo(-8, -11)
      ctx.lineTo(1, -8)
      ctx.fill()

      // Beak
      ctx.fillStyle = '#ffc107'
      ctx.beginPath()
      ctx.moveTo(14, 1) // Tip
      ctx.lineTo(4, -3) // Top base
      ctx.lineTo(4, 5)  // Bottom base
      ctx.fill()
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(4, 1)
      ctx.lineTo(14, 1)
      ctx.stroke()
      
      // Feather crest
      ctx.fillStyle = '#e52b22'
      ctx.beginPath()
      ctx.arc(-8, -13, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(-12, -10, 2.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Speed lines
      if (state.current.velocity > 5 || state.current.velocity < -5) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(-25, -5)
        ctx.lineTo(-45, -5 + (Math.random() * 4 - 2))
        ctx.moveTo(-25, 5)
        ctx.lineTo(-40, 5 + (Math.random() * 4 - 2))
        ctx.stroke()
      }
      
      ctx.restore()

      // Handle Obstacles
      if (state.current.frameCount % 90 === 0) { // Add new obstacle
        const gapPosition = Math.random() * (canvas.height - 140) + 70
        state.current.obstacles.push({
          x: canvas.width,
          gapTop: gapPosition - 65,
          gapBottom: gapPosition + 65,
          width: 30
        })
      }

      ctx.fillStyle = '#308aff' // secondary accent

      for (let i = state.current.obstacles.length - 1; i >= 0; i--) {
        const obs = state.current.obstacles[i]
        obs.x -= 3 // Speed
        
        // Draw Top Pipe
        ctx.fillRect(obs.x, 0, obs.width, obs.gapTop)
        
        // Draw Bottom Pipe
        ctx.fillRect(obs.x, obs.gapBottom, obs.width, canvas.height - obs.gapBottom)
        
        // Collision Detection
        const shipLeft = 50 - 12
        const shipRight = 50 + 12
        const shipTop = state.current.shipY - 12
        const shipBottom = state.current.shipY + 12
        
        if (shipRight > obs.x && shipLeft < obs.x + obs.width) {
          if (shipTop < obs.gapTop || shipBottom > obs.gapBottom) {
            setGameState('over')
            return
          }
        }
        
        // Scoring
        if (obs.x === 47) { // Passed ship
          state.current.score += 1
          setScore(state.current.score)
          if (state.current.score > state.current.highScore) {
            state.current.highScore = state.current.score
            setHighScore(state.current.score)
            localStorage.setItem('sg_highscore', state.current.score.toString())
          }
        }
        
        // Remove offscreen
        if (obs.x + obs.width < 0) {
          state.current.obstacles.splice(i, 1)
        }
      }

      state.current.frameCount++
      requestRef.current = requestAnimationFrame(update)
    }

    requestRef.current = requestAnimationFrame(update)

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [gameState])

  // Handle Spacebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (gameState === 'playing') {
          jump()
        } else if (gameState === 'start' || gameState === 'over') {
          resetGame()
        }
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, gameState, jump])

  return (
    <>
      {/* Floating Widget Button */}
      <AnimatePresence>
        {showLauncher && !isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '24px',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'color-mix(in srgb, var(--color-surface) 70%, transparent)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--color-border-subtle)',
              boxShadow: '0 10px 28px rgba(0,0,0,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 90
            }}
            whileHover={{ scale: 1.1, background: 'var(--sg-accent)' }}
            className="sg-game-launcher group"
            aria-label="Open Storm Glider"
            title="Storm Glider"
          >
            <Gamepad2 size={20} className="text-[var(--sg-accent)] group-hover:text-black transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Game Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '24px',
              width: '320px',
              height: '480px',
              background: 'color-mix(in srgb, var(--color-surface) 85%, transparent)',
              backdropFilter: 'blur(20px)',
              border: '1px solid color-mix(in srgb, var(--sg-accent) 30%, transparent)',
              borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gamepad2 size={16} color="var(--sg-accent)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>STORM GLIDER</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Game Canvas Container */}
            <div 
              style={{ flex: 1, position: 'relative', cursor: gameState === 'playing' ? 'pointer' : 'default' }}
              onPointerDown={jump}
            >
              <canvas 
                ref={canvasRef} 
                width={320} 
                height={350} 
                style={{ width: '100%', height: '100%', display: 'block' }}
              />

              {/* Start Screen */}
              {gameState === 'start' && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
                  <Rocket size={48} color="var(--sg-accent)" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>Storm Glider</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>Tap or Spacebar to fly</p>
                  <button 
                    onClick={resetGame}
                    style={{ background: 'var(--sg-accent)', color: 'black', border: 'none', padding: '10px 24px', borderRadius: '99px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    PLAY NOW
                  </button>
                </div>
              )}

              {/* Game Over Screen */}
              {gameState === 'over' && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', padding: '24px', textAlign: 'center' }}>
                  <Trophy size={48} color="#FFD700" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.2rem' }}>Score: {score}</h3>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFD700', marginBottom: '1rem', background: 'rgba(255,215,0,0.1)', padding: '4px 12px', borderRadius: '99px' }}>
                    BEST: {highScore}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    Not bad! But our software scales infinitely.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={resetGame}
                      style={{ background: 'transparent', color: 'white', border: '1px solid var(--color-border-subtle)', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      RETRY
                    </button>
                    <a 
                      href="mailto:hello@stormglide.io"
                      style={{ background: 'var(--sg-accent)', color: 'black', textDecoration: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 800 }}
                    >
                      LET'S BUILD
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Score HUD */}
            {gameState === 'playing' && (
              <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '4px 14px', borderRadius: '99px', fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  {score}
                </div>
                {highScore > 0 && (
                  <div style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700', padding: '2px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    BEST {highScore}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
