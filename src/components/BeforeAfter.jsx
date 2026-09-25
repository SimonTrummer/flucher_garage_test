import { useEffect, useRef, useState } from 'react'
import {
  animate,
  m,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import styles from './BeforeAfter.module.css'

const BASE = import.meta.env.BASE_URL

function Picture({ name, alt, className, eager = false }) {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`${BASE}img/${name}-960.avif 960w, ${BASE}img/${name}-1600.avif 1600w`}
        sizes="(min-width: 1400px) 1320px, 94vw"
      />
      <source
        type="image/webp"
        srcSet={`${BASE}img/${name}-960.webp 960w, ${BASE}img/${name}-1600.webp 1600w`}
        sizes="(min-width: 1400px) 1320px, 94vw"
      />
      <img
        className={className}
        src={`${BASE}img/${name}-1600.webp`}
        width="2000"
        height="1413"
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable="false"
      />
    </picture>
  )
}

/**
 * Before/after comparison. The value is how much of the "before" photo is
 * visible (0–100). Drag anywhere on the image, or focus the handle and use
 * the arrow keys.
 */
export default function BeforeAfter({ before, after, labels, alt, caption }) {
  const frameRef = useRef(null)
  const handleRef = useRef(null)
  const touchedRef = useRef(false)
  const reduceMotion = useReducedMotion()
  const inView = useInView(frameRef, { once: true, amount: 0.6 })
  const [shine, setShine] = useState(false)

  const pos = useMotionValue(50)
  const clip = useTransform(pos, (v) => `inset(0 ${100 - v}% 0 0)`)
  const left = useTransform(pos, (v) => `${v}%`)
  // Shift the knob inwards near the edges so it is never cut in half.
  const knobX = useTransform(pos, (v) => (50 - v) * 0.6)
  const beforeLabel = useTransform(pos, (v) => (v < 14 ? 0 : 1))
  const afterLabel = useTransform(pos, (v) => (v > 86 ? 0 : 1))

  useMotionValueEvent(pos, 'change', (v) => {
    const handle = handleRef.current
    if (!handle) return
    const value = Math.round(v)
    handle.setAttribute('aria-valuenow', String(value))
    handle.setAttribute('aria-valuetext', `${value} % vorher, ${100 - value} % nachher`)
  })

  // One demonstration sweep: dirty → clean → middle.
  useEffect(() => {
    if (!inView || reduceMotion || touchedRef.current) return undefined
    const controls = animate(pos, [50, 94, 7, 50], {
      duration: 3.2,
      times: [0, 0.2, 0.72, 1],
      ease: ['easeInOut', [0.65, 0, 0.35, 1], 'easeInOut'],
      delay: 0.3,
    })
    const timer = setTimeout(() => setShine(true), 2400)
    return () => {
      controls.stop()
      clearTimeout(timer)
    }
  }, [inView, reduceMotion, pos])

  function stopDemo() {
    touchedRef.current = true
    pos.stop()
  }

  function setFromPointer(clientX) {
    const rect = frameRef.current.getBoundingClientRect()
    const v = ((clientX - rect.left) / rect.width) * 100
    pos.set(Math.min(100, Math.max(0, v)))
  }

  function onPointerDown(event) {
    if (event.button !== 0) return
    stopDemo()
    frameRef.current.setPointerCapture(event.pointerId)
    frameRef.current.dataset.dragging = 'true'
    setFromPointer(event.clientX)
  }

  function onPointerMove(event) {
    if (frameRef.current.dataset.dragging === 'true') setFromPointer(event.clientX)
  }

  function onPointerUp(event) {
    frameRef.current.dataset.dragging = 'false'
    if (frameRef.current.hasPointerCapture(event.pointerId)) frameRef.current.releasePointerCapture(event.pointerId)
  }

  function onKeyDown(event) {
    const steps = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -20, PageUp: 20 }
    let next
    if (event.key in steps) next = pos.get() + steps[event.key]
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = 100
    else return
    event.preventDefault()
    stopDemo()
    animate(pos, Math.min(100, Math.max(0, next)), { duration: 0.25, ease: 'easeOut' })
  }

  return (
    <figure className={styles.figure}>
      <div
        ref={frameRef}
        className={styles.frame}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        data-shine={shine ? 'true' : 'false'}
      >
        <Picture name={after} alt={alt.after} className={styles.image} />
        <span className={styles.sheen} aria-hidden="true" />
        <m.div className={styles.beforeLayer} style={{ clipPath: clip }}>
          <Picture name={before} alt={alt.before} className={styles.image} />
        </m.div>

        <m.span className={`${styles.tag} ${styles.tagBefore}`} style={{ opacity: beforeLabel }} aria-hidden="true">
          {labels.before}
        </m.span>
        <m.span className={`${styles.tag} ${styles.tagAfter}`} style={{ opacity: afterLabel }} aria-hidden="true">
          {labels.after}
        </m.span>

        <m.div className={styles.divider} style={{ left }}>
          <m.div
            ref={handleRef}
            className={styles.handle}
            style={{ x: knobX }}
            role="slider"
            tabIndex={0}
            aria-label="Vorher-nachher-Regler"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={50}
            aria-valuetext="50 % vorher, 50 % nachher"
            onKeyDown={onKeyDown}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M9.5 7 4.5 12l5 5M14.5 7l5 5-5 5" />
            </svg>
          </m.div>
        </m.div>
      </div>
      {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  )
}
