import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

const ScrollContext = createContext(null)

const headerOffset = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72

/** Smooth wheel scrolling (Lenis) plus a tiny API to lock scrolling or jump to a section. */
export function ScrollProvider({ children }) {
  const lenisRef = useRef(null)
  const locksRef = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    // Lenis already honours `scroll-padding-top` (the header height, see base.css).
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      anchors: true,
      stopInertiaOnNavigate: true,
    })
    lenisRef.current = lenis
    if (locksRef.current > 0) lenis.stop()
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const api = useMemo(
    () => ({
      lock() {
        locksRef.current += 1
        lenisRef.current?.stop()
        document.documentElement.style.overflow = 'hidden'
      },
      unlock() {
        locksRef.current = Math.max(0, locksRef.current - 1)
        if (locksRef.current === 0) {
          document.documentElement.style.overflow = ''
          lenisRef.current?.start()
        }
      },
      scrollTo(target) {
        const el = typeof target === 'string' ? document.querySelector(target) : target
        if (!el) return
        if (lenisRef.current) {
          lenisRef.current.scrollTo(el, { force: true })
        } else {
          const top = el.getBoundingClientRect().top + window.scrollY - headerOffset()
          window.scrollTo({ top, behavior: 'auto' })
        }
      },
    }),
    [],
  )

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useScrollApi() {
  return useContext(ScrollContext)
}
