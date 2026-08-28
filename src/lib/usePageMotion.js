import { useLenis } from './useLenis'

/**
 * Page-level GSAP motion for content pages. The home/services/products pages
 * already have custom scroll mechanics; this hook gives the other marketing
 * pages the same ScrollTrigger language without duplicating Lenis setup.
 */
export function usePageMotion(routePath, rootRef) {
  useLenis(routePath, (scroller, { gsap, ScrollTrigger }) =>
    gsap.context(() => {
      const root = rootRef.current
      if (!root) return undefined

      const mm = gsap.matchMedia()
      const reveals = gsap.utils.toArray('[data-motion="reveal"]', root)
      reveals.forEach((el, index) => {
        gsap.fromTo(
          el,
          {
            autoAlpha: 0,
            y: Number(el.dataset.motionY || 28),
            rotateX: Number(el.dataset.motionRotate || 0),
          },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: Number(el.dataset.motionDuration || 0.75),
            ease: 'power3.out',
            delay: Math.min(index % 5, 4) * 0.035,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: el.dataset.motionStart || 'top 84%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      gsap.utils.toArray('[data-motion="parallax"]', root).forEach(el => {
        const speed = Number(el.dataset.speed || 0.18)
        gsap.fromTo(
          el,
          { y: 80 * speed },
          {
            y: -80 * speed,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      gsap.utils.toArray('[data-motion="image-rail"]', root).forEach(rail => {
        const children = gsap.utils.toArray(rail.children)
        gsap.fromTo(
          children,
          { autoAlpha: 0, x: 70, rotateY: -10 },
          {
            autoAlpha: 1,
            x: 0,
            rotateY: 0,
            stagger: 0.08,
            duration: 0.72,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: rail,
              scroller,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          },
        )

        gsap.to(rail, {
          x: () => {
            const visibleWidth = rail.parentElement?.clientWidth || rail.clientWidth
            const overflow = rail.scrollWidth - visibleWidth
            return overflow > 0 ? -overflow * 0.55 : -48
          },
          ease: 'none',
          scrollTrigger: {
            trigger: rail,
            scroller,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
      })

      mm.add('(min-width: 920px)', () => {
        gsap.utils.toArray('[data-motion="pin-copy"]', root).forEach(el => {
          const parent = el.parentElement
          if (!parent) return
          ScrollTrigger.create({
            trigger: parent,
            scroller,
            start: 'top 96px',
            end: 'bottom center',
            pin: el,
            pinSpacing: false,
          })
        })
      })

      return () => mm.revert()
    }, rootRef),
  )
}
