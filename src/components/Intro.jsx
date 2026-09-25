import { useEffect, useRef } from 'react'
import { m } from 'motion/react'
import { LogoMark, Wordmark } from './Logo'
import styles from './Intro.module.css'

const OPEN_MS = 1150

/**
 * The garage door from the logo. It stays shut while the first frames of the
 * hero load (at most ~2.6 s), then rolls up and reveals the studio.
 * Any click or key press opens it right away.
 */
export default function Intro({ opening, progress, onSkip, onOpened }) {
  const doneRef = useRef(onOpened)
  const skipRef = useRef(onSkip)
  useEffect(() => {
    doneRef.current = onOpened
    skipRef.current = onSkip
  })

  useEffect(() => {
    if (!opening) return undefined
    const timer = setTimeout(() => doneRef.current?.(), OPEN_MS + 80)
    return () => clearTimeout(timer)
  }, [opening])

  useEffect(() => {
    const skip = () => skipRef.current?.()
    window.addEventListener('keydown', skip)
    window.addEventListener('wheel', skip, { passive: true })
    window.addEventListener('touchmove', skip, { passive: true })
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('wheel', skip)
      window.removeEventListener('touchmove', skip)
    }
  }, [])

  return (
    <div
      className={styles.intro}
      data-opening={opening ? 'true' : 'false'}
      onPointerDown={() => onSkip?.()}
      aria-hidden="true"
    >
      <div className={styles.door}>
        <div className={styles.plate}>
          <LogoMark size={112} className={styles.mark} />
          <Wordmark className={styles.wordmark} />
        </div>
        <div className={styles.lip}>
          <m.span className={styles.progress} style={{ scaleX: progress }} />
          <span className={styles.handle} />
        </div>
      </div>
    </div>
  )
}
