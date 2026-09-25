import { useRef } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import { story } from '../content'
import { LogoMark } from '../components/Logo'
import { Reveal } from '../components/Reveal'
import styles from './Story.module.css'

export default function Story() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  // The slats inside the "15" roll like the garage door while you scroll past.
  const slats = useTransform(scrollYProgress, [0, 1], ['0px 0px', '0px -220px'])

  return (
    <section
      ref={sectionRef}
      id="garage"
      className={styles.section}
      data-nav-theme="dark"
      aria-labelledby="garage-title"
    >
      <div className={`container ${styles.grid}`}>
        <div className={styles.numberCol}>
          <h2 className="eyebrow" id="garage-title">
            {story.eyebrow}
          </h2>
          <m.p className={styles.number} style={{ backgroundPosition: slats }} aria-hidden="true">
            {story.number}
          </m.p>
          <p className={styles.numberLabel}>
            <span className="visually-hidden">{story.number} </span>
            {story.numberLabel}
          </p>
        </div>

        <figure className={styles.quoteCol}>
          <Reveal as="blockquote" className={styles.quote}>
            <p>„{story.quote}“</p>
          </Reveal>
          <Reveal as="figcaption" className={styles.signature} delay={0.1}>
            <LogoMark size={48} />
            <span>{story.signature}</span>
          </Reveal>
          <Reveal as="p" className={styles.text} delay={0.15}>
            {story.text}
          </Reveal>
        </figure>
      </div>
    </section>
  )
}
