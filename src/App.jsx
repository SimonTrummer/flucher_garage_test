import { useCallback, useEffect, useState } from 'react'
import { domAnimation, LazyMotion, MotionConfig, useMotionValue } from 'motion/react'
import Intro from './components/Intro'
import SiteHeader from './components/SiteHeader'
import Hero from './hero/Hero'
import Services from './sections/Services'
import Detailing from './sections/Detailing'
import Sherco from './sections/Sherco'
import Fluids from './sections/Fluids'
import Story from './sections/Story'
import Contact from './sections/Contact'
import SiteFooter from './components/SiteFooter'
import LegalDialogs from './components/LegalDialogs'
import WhatsAppFab from './components/WhatsAppFab'
import { ScrollProvider, useScrollApi } from './lib/scroll'

function initialSetup() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // Arriving on a deep link (#kontakt) or a restored scroll position: skip the show.
  const deepLink = Boolean(window.location.hash && window.location.hash !== '#top') || window.scrollY > 40
  return {
    showDoor: !reduce && !deepLink,
    instant: deepLink,
  }
}

function Site() {
  const [{ showDoor, instant }] = useState(initialSetup)
  const [phase, setPhase] = useState('loading') // loading · reveal
  const [doorMounted, setDoorMounted] = useState(showDoor)
  const progress = useMotionValue(0)
  const scroll = useScrollApi()

  // The page stays put while the door is shut.
  useEffect(() => {
    if (!doorMounted) return undefined
    scroll.lock()
    return () => scroll.unlock()
  }, [doorMounted, scroll])

  const reveal = useCallback(() => {
    setPhase((current) => (current === 'loading' ? 'reveal' : current))
  }, [])

  const handleOpened = useCallback(() => setDoorMounted(false), [])

  return (
    <>
      <a className="skip-link" href="#main">
        Zum Inhalt springen
      </a>
      <SiteHeader hidden={doorMounted && phase === 'loading'} />
      {doorMounted ? (
        <Intro opening={phase !== 'loading'} progress={progress} onSkip={reveal} onOpened={handleOpened} />
      ) : null}
      <main id="main">
        <Hero phase={phase} instant={instant} onFramesReady={reveal} onProgress={(v) => progress.set(v)} />
        <Services />
        <Detailing />
        <Sherco />
        <Fluids />
        <Story />
        <Contact />
      </main>
      <SiteFooter />
      <LegalDialogs />
      <WhatsAppFab />
    </>
  )
}

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <ScrollProvider>
          <Site />
        </ScrollProvider>
      </MotionConfig>
    </LazyMotion>
  )
}
