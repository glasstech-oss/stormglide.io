/**
 * Triggers a subtle physical vibration on supported mobile devices.
 * Typically used for tactile feedback on buttons, cards, and interactive elements.
 */
export const triggerHaptic = (pattern = 10) => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    try {
      window.navigator.vibrate(pattern)
    } catch (err) {
      // Ignore
    }
  }
}

/**
 * Creates a beautiful, glassmorphic touch ripple at the exact point of interaction.
 * Call this in your onPointerDown handler.
 */
export const createRipple = (event, color = 'var(--sg-accent)') => {
  const button = event.currentTarget
  
  // Calculate relative click coordinates
  const rect = button.getBoundingClientRect()
  
  // Support both mouse and touch events
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY
  
  const x = clientX - rect.left
  const y = clientY - rect.top
  
  // Create ripple element
  const circle = document.createElement('span')
  const diameter = Math.max(rect.width, rect.height) * 2
  const radius = diameter / 2
  
  circle.style.width = circle.style.height = `${diameter}px`
  circle.style.left = `${x - radius}px`
  circle.style.top = `${y - radius}px`
  circle.style.position = 'absolute'
  circle.style.borderRadius = '50%'
  circle.style.background = `color-mix(in srgb, ${color} 40%, transparent)`
  circle.style.pointerEvents = 'none'
  circle.style.transform = 'scale(0)'
  circle.style.animation = 'sg-ripple 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
  
  // Make sure the parent has position relative/overflow hidden if it doesn't already
  if (getComputedStyle(button).position === 'static') {
    button.style.position = 'relative'
  }
  
  // Remove existing ripples to prevent build-up if clicked rapidly
  const existingRipple = button.getElementsByClassName('sg-ripple-effect')[0]
  if (existingRipple) {
    existingRipple.remove()
  }
  
  circle.classList.add('sg-ripple-effect')
  button.appendChild(circle)
  
  // Trigger physical haptic feedback
  triggerHaptic(15)
  
  // Clean up
  setTimeout(() => {
    circle.remove()
  }, 600)
}

// Inject the global keyframes for the ripple just once
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.innerHTML = `
    @keyframes sg-ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    .sg-ripple-effect {
      z-index: 0;
    }
  `
  document.head.appendChild(style)
}
