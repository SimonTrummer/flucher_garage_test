import { useRef } from 'react'
import { m, useScroll, useSpring } from 'motion/react'
import { detailing, whatsappLink } from '../content'
import BeforeAfter from '../components/BeforeAfter'
import { DropIcon, SeatIcon, SparkIcon, WhatsAppIcon } from '../components/Icons'
import { Reveal, RevealTitle } from '../components/Reveal'
import styles from './Detailing.module.css'

const ICONS = { seat: SeatIcon, drop: DropIcon, spark: SparkIcon }

export default function Detailing() {
  const stepsRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ['start 85%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <section id="aufbereitung" className={styles.section} data-nav-theme="dark" aria-labelledby="aufbereitung-title">
      <div className="container">
        <header className={styles.head}>
          <div className={styles.headTitle}>
            <p className="eyebrow">{detailing.eyebrow}</p>
            <RevealTitle id="aufbereitung-title" className={`section-title ${styles.title}`}>
              Vom <span className={styles.mud}>Gatsch</span> zum <span className={styles.shine}>Glanz.</span>
            </RevealTitle>
          </div>
          <Reveal className={styles.headText} delay={0.1}>
            <p className="lead">{detailing.lead}</p>
            <a className="btn" href={whatsappLink(detailing.cta.text)} target="_blank" rel="noopener noreferrer">
              <span className="btn__inner">
                <WhatsAppIcon />
                {detailing.cta.label}
              </span>
            </a>
          </Reveal>
        </header>

        <Reveal y={48}>
          <BeforeAfter
            before="bmw-m2-vorher"
            after="bmw-m2-nachher"
            labels={{ before: detailing.compare.before, after: detailing.compare.after }}
            alt={detailing.compare.alt}
            caption={detailing.compare.caption}
          />
        </Reveal>

        <ul className={styles.scope}>
          {detailing.scope.map((item, index) => {
            const Icon = ICONS[item.icon]
            return (
              <Reveal as="li" key={item.title} className={styles.scopeItem} delay={index * 0.08}>
                <span className={styles.scopeIcon}>
                  <Icon />
                </span>
                <h3 className={styles.scopeTitle}>{item.title}</h3>
                <p className={styles.scopeText}>{item.text}</p>
              </Reveal>
            )
          })}
        </ul>

        <div className={styles.process}>
          <h3 className={styles.processTitle}>{detailing.stepsTitle}</h3>
          <div ref={stepsRef} className={styles.stepsWrap}>
            <div className={styles.track} aria-hidden="true">
              <m.span className={styles.trackFill} style={{ scaleX: progress }} />
            </div>
            <ol className={styles.steps}>
              {detailing.steps.map((step, index) => (
                <Reveal as="li" key={step.title} className={styles.step} delay={index * 0.1}>
                  <span className={styles.stepNo} aria-hidden="true">
                    {index + 1}
                  </span>
                  <h4 className={styles.stepTitle}>{step.title}</h4>
                  <p className={styles.stepText}>{step.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
