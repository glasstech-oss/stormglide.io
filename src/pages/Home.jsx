import { useRef } from 'react'
import gsap from 'gsap'
import Footer from '../components/layout/Footer'
import HomeWorld from '../components/home/HomeWorld'
import ProductShowcase from '../components/home/ProductShowcase'
import Testimonials from '../components/home/Testimonials'
import TrustBand from '../components/home/TrustBand'
import { useLenis } from '../lib/useLenis'
import '../styles/home.css'

// Sections below the HomeWorld runway each fade/slide up once as they enter
// view — no scrub, just a one-time trigger (see useLenis.js for the Lenis +
// ScrollTrigger wiring this depends on).
function useSectionReveal(refs) {
  useLenis('/', scroller =>
    gsap.context(() => {
      refs.forEach(ref => {
        if (!ref.current) return
        gsap.from(ref.current, {
          opacity: 0,
          y: 32,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            scroller,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
      })
    }),
  )
}

export default function Home() {
  const showcaseRef = useRef(null)
  const testimonialsRef = useRef(null)
  const trustRef = useRef(null)

  useSectionReveal([showcaseRef, testimonialsRef, trustRef])

  return (
    <>
      <main className="sg-home">
        <HomeWorld />
        <div ref={showcaseRef}>
          <ProductShowcase />
        </div>
        <div ref={testimonialsRef}>
          <Testimonials />
        </div>
        <div ref={trustRef}>
          <TrustBand />
        </div>
      </main>
      <Footer />
    </>
  )
}
