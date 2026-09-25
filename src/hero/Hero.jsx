import { useEffect, useRef } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { hero, whatsappLink } from '../content'
import { ArrowIcon, WhatsAppIcon } from '../components/Icons'
import { createFramePlayer, frameRect, INTRO_END } from './framePlayer'
import styles from './Hero.module.css'

const BASE = import.meta.env.BASE_URL
const ROLL_IN_MS = 1900
const ROLL_IN_DELAY_MS = 220

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

/**
 * phase: 'loading' → frames are being fetched (the garage door is closed)
 *        'reveal'  → door opens, the bike rolls in, the headline appears in its wake
 */
export default function Hero({ phase, instant = false, onFramesReady, onProgress }) {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const stickyRef = useRef(null)
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const textRef = useRef(null)
  const gasRef = useRef(null)
  const playerRef = useRef(null)
  const introRef = useRef({ state: 'wait', raf: 0 }) // wait · playing · done
  const metricsRef = useRef({ scrubEnd: 0.65, wide: true })
  const lastProgressRef = useRef(0)

  // Keep callbacks in refs so effects don't restart when the parent re-renders.
  const readyRef = useRef(onFramesReady)
  const progressRef = useRef(onProgress)
  useEffect(() => {
    readyRef.current = onFramesReady
    progressRef.current = onProgress
  })

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  // ---------- helpers that write straight to the DOM (no re-renders while scrolling) ----------

  function setWake(px) {
    textRef.current?.style.setProperty('--wake', `${Math.round(px)}px`)
  }

  function wakeForFrame(frame) {
    const player = playerRef.current
    const stage = stageRef.current
    const text = textRef.current
    if (!player || !stage || !text) return 0
    const box = player.bikeBox(frame)
    if (!box) return 0
    const stageRect = stage.getBoundingClientRect()
    const textRect = text.getBoundingClientRect()
    const edge = metricsRef.current.wide
      ? stageRect.left + box.left - 28 // headline appears behind the bike's rear wheel
      : stageRect.left + box.right + 56 // headline is pulled in by the front wheel
    return edge - textRect.left
  }

  function applyScroll(p) {
    lastProgressRef.current = p
    const player = playerRef.current
    const stage = stageRef.current
    if (!player || !stage || reduceMotion) return
    const { scrubEnd } = metricsRef.current
    const turn = clamp01(p / scrubEnd)
    const cover = clamp01((p - scrubEnd) / (1 - scrubEnd))

    if (introRef.current.state === 'playing' && turn > 0.015) finishIntro()
    if (introRef.current.state === 'done') {
      player.show(INTRO_END + turn * (player.count - 1 - INTRO_END))
    }

    stage.style.setProperty('--turn', turn.toFixed(4))
    stage.style.setProperty('--cover', cover.toFixed(4))
    // Once the dark section slides in, the header should switch to its dark look.
    if (stickyRef.current) stickyRef.current.dataset.navTheme = cover > 0.12 ? 'dark' : 'light'
    if (gasRef.current) gasRef.current.style.fontStretch = `${(100 + turn * 50).toFixed(1)}%`
  }

  function finishIntro() {
    const intro = introRef.current
    if (intro.state === 'done') return
    cancelAnimationFrame(intro.raf)
    intro.state = 'done'
    const text = textRef.current
    if (text) {
      const from = parseFloat(text.style.getPropertyValue('--wake')) || 0
      const to = text.getBoundingClientRect().width + 160
      const start = performance.now()
      const tick = (now) => {
        const t = clamp01((now - start) / 420)
        setWake(from + (to - from) * easeOutQuart(t))
        if (t < 1) intro.raf = requestAnimationFrame(tick)
        else text.dataset.intro = 'done'
      }
      intro.raf = requestAnimationFrame(tick)
    }
    applyScroll(lastProgressRef.current)
  }

  useMotionValueEvent(scrollYProgress, 'change', applyScroll)

  // ---------- set up the player ----------
  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    let player = null
    let cancelled = false
    let resizeObserver = null

    function measure() {
      if (!player) return
      const width = stage.clientWidth
      const height = stage.clientHeight
      metricsRef.current.wide = width / height >= 1.12
      const stageBox = stage.getBoundingClientRect()
      const textBox = textRef.current?.getBoundingClientRect()
      const text = textBox ? { right: textBox.right - stageBox.left, bottom: textBox.bottom - stageBox.top } : null
      player.resize(width, height, frameRect(width, height, text))

      // The scroll part ends where the next section starts to slide over the hero.
      const section = sectionRef.current
      const next = section.nextElementSibling
      const scrollLength = section.offsetHeight - stickyRef.current.offsetHeight
      const overlap = next ? Math.max(0, section.offsetTop + section.offsetHeight - next.offsetTop) : 0
      metricsRef.current.scrubEnd =
        scrollLength > 0 ? Math.min(1, Math.max(0.3, (scrollLength - overlap) / scrollLength)) : 1
      applyScroll(scrollYProgress.get())
    }

    fetch(`${BASE}sequence/manifest.json`)
      .then((r) => r.json())
      .then((manifest) => {
        if (cancelled) return
        const sparse = window.matchMedia('(max-width: 760px)').matches || Boolean(navigator.connection?.saveData)
        player = createFramePlayer({ canvas, baseUrl: BASE, manifest, sparse })
        playerRef.current = player
        measure()
        resizeObserver = new ResizeObserver(measure)
        resizeObserver.observe(stage)
        if (textRef.current) resizeObserver.observe(textRef.current)

        if (reduceMotion) {
          player.show(player.count - 1)
          player.start()
          introRef.current.state = 'done'
          readyRef.current?.()
          return
        }
        player.show(0)
        player.start()
        const timeout = new Promise((resolve) => setTimeout(resolve, 2600))
        Promise.race([player.whenReady(player.introFrames(), (v) => progressRef.current?.(v)), timeout]).then(() => {
          progressRef.current?.(1)
          if (!cancelled) readyRef.current?.()
        })
      })
      .catch(() => readyRef.current?.())

    return () => {
      cancelled = true
      resizeObserver?.disconnect()
      player?.destroy()
      playerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion])

  // ---------- roll-in ----------
  useEffect(() => {
    const intro = introRef.current
    if (phase === 'loading' || intro.state !== 'wait') return
    const text = textRef.current
    if (reduceMotion || instant || !playerRef.current) {
      intro.state = 'done'
      if (text) text.dataset.intro = 'done'
      applyScroll(scrollYProgress.get())
      return
    }
    intro.state = 'playing'
    if (text) text.dataset.intro = 'wake'
    setWake(wakeForFrame(0))
    const start = performance.now() + ROLL_IN_DELAY_MS
    const tick = (now) => {
      if (intro.state !== 'playing') return
      const t = clamp01((now - start) / ROLL_IN_MS)
      const frame = easeOutCubic(t) * INTRO_END
      playerRef.current?.show(frame)
      setWake(wakeForFrame(frame))
      if (t < 1) intro.raf = requestAnimationFrame(tick)
      else finishIntro()
    }
    intro.raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(intro.raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, reduceMotion, instant])

  return (
    <section ref={sectionRef} className={styles.hero} id="top" aria-labelledby="hero-title">
      <div ref={stickyRef} className={styles.sticky} data-nav-theme="light">
        <div ref={stageRef} className={styles.stage} data-phase={phase}>
          <div className={styles.backdrop} aria-hidden="true" />
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
          <p className="visually-hidden">{hero.animationLabel}</p>

          <div className={`container ${styles.content}`}>
            <div ref={textRef} className={styles.text} data-intro={reduceMotion ? 'done' : 'wait'}>
              <p className={`eyebrow ${styles.eyebrow}`}>{hero.eyebrow}</p>
              <h1 id="hero-title" className={styles.title}>
                <span className="visually-hidden">
                  Flucher’s Garage – Autoaufbereitung, offizieller Sherco-Händler und Schmier- und Betriebsstoffe in
                  Sankt Marein bei Graz.
                </span>
                <span className={styles.words} aria-hidden="true">
                  <span className={styles.glanz}>{hero.words[0]}</span>
                  <span ref={gasRef} className={styles.gas}>
                    {hero.words[1]}
                  </span>
                  <span className={styles.oel}>{hero.words[2]}</span>
                </span>
              </h1>
              <p className={styles.lead}>{hero.lead}</p>
              <div className={styles.actions}>
                <a
                  className="btn btn--ink"
                  href={whatsappLink(hero.primary.text)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="btn__inner">
                    <WhatsAppIcon />
                    {hero.primary.label}
                  </span>
                </a>
                <a className={`btn btn--ghost-ink ${styles.secondary}`} href={hero.secondary.href}>
                  <span className="btn__inner">
                    {hero.secondary.label}
                    <ArrowIcon className="btn__arrow" />
                  </span>
                </a>
              </div>
              <p className={styles.badge}>
                <span className={styles.badgeKicker}>{hero.badge.kicker}</span>
                <span className={styles.badgeText}>{hero.badge.text}</span>
              </p>
            </div>
          </div>

          <div className={styles.scrollHint} aria-hidden="true">
            <span className={styles.scrollLine} />
            Scrollen
          </div>
          <div className={styles.shade} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
