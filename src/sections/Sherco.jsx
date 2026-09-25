import { useRef } from 'react'
import { m, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { sherco, whatsappLink } from '../content'
import Gauge from '../components/Gauge'
import { WhatsAppIcon } from '../components/Icons'
import { Reveal, RevealTitle } from '../components/Reveal'
import styles from './Sherco.module.css'

const BASE = import.meta.env.BASE_URL

export default function Sherco() {
  const sectionRef = useRef(null)
  const reduceMotion = useReducedMotion()

  // Parallax: bike and the big "50" drift in opposite directions.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bikeY = useTransform(scrollYProgress, [0, 1], [70, -70])
  const numberY = useTransform(scrollYProgress, [0, 1], [-60, 90])
  const numberX = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])

  // Gentle 3D tilt that follows the mouse.
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rotateX = useSpring(tiltX, { stiffness: 120, damping: 18 })
  const rotateY = useSpring(tiltY, { stiffness: 120, damping: 18 })

  function onPointerMove(event) {
    if (event.pointerType !== 'mouse' || reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    tiltY.set(px * 14)
    tiltX.set(py * -9)
  }

  function onPointerLeave() {
    tiltX.set(0)
    tiltY.set(0)
  }

  return (
    <section
      ref={sectionRef}
      id="sherco"
      className={styles.section}
      data-nav-theme="dark"
      aria-labelledby="sherco-title"
    >
      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          <div className={styles.copy}>
            <p className={`eyebrow ${styles.eyebrow}`}>{sherco.eyebrow}</p>
            <RevealTitle id="sherco-title" className={`section-title ${styles.title}`}>
              {sherco.title}
            </RevealTitle>
            <Reveal className={styles.text} delay={0.1}>
              <p className={styles.lead}>{sherco.lead}</p>
              <p className={styles.note}>{sherco.note}</p>
              <a
                className="btn btn--white"
                href={whatsappLink(sherco.cta.text)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="btn__inner">
                  <WhatsAppIcon />
                  {sherco.cta.label}
                </span>
              </a>
            </Reveal>
          </div>

          <div className={styles.stage} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
            {/* Diagonal livery graphics like on the bike's shrouds, only behind the bike */}
            <div className={styles.livery} aria-hidden="true">
              <span className={styles.band} />
              <span className={styles.bandFluo} />
            </div>
            <m.span className={styles.bigNumber} style={{ y: numberY, x: numberX }} aria-hidden="true">
              50
            </m.span>
            <span className={styles.floor} aria-hidden="true" />
            <m.div className={styles.bike} style={{ y: bikeY, rotateX, rotateY }}>
              <img
                src={`${BASE}img/sherco-sm-50.webp`}
                width="550"
                height="496"
                alt={sherco.imageAlt}
                loading="lazy"
                decoding="async"
              />
            </m.div>
            <span className={styles.tag}>{sherco.arrival}</span>
          </div>
        </div>

        <div className={styles.cluster}>
          <p className={styles.clusterCaption}>{sherco.factsCaption}</p>
          <dl className={styles.facts}>
            {sherco.facts.map((fact, index) => (
              <Reveal key={fact.label} className={styles.fact} delay={index * 0.08}>
                <dt className={styles.factLabel}>{fact.label}</dt>
                <dd className={styles.factValue}>
                  {fact.gauge ? (
                    <>
                      <Gauge value={Number(fact.value)} />
                      <span className="visually-hidden">
                        {fact.value} {fact.unit}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={styles.factNumber}>{fact.value}</span>
                      {fact.unit ? <span className={styles.factUnit}>{fact.unit}</span> : null}
                    </>
                  )}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
