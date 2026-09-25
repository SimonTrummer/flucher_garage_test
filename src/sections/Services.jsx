import { services } from '../content'
import { ArrowIcon } from '../components/Icons'
import { Reveal, RevealTitle } from '../components/Reveal'
import styles from './Services.module.css'

/** Slides over the pinned hero like a livery stripe; three bands, one per trade. */
export default function Services() {
  return (
    <section id="leistungen" className={styles.services} data-nav-theme="dark" aria-labelledby="leistungen-title">
      <span className={styles.stripe} aria-hidden="true" />
      <div className="container">
        <div className={styles.head}>
          <p className="eyebrow">{services.eyebrow}</p>
          <RevealTitle id="leistungen-title" className={`section-title ${styles.title}`}>
            {services.title}
          </RevealTitle>
        </div>
        <ul className={styles.bands}>
          {services.items.map((item, index) => (
            <Reveal as="li" key={item.href} delay={index * 0.08}>
              <a className={styles.band} href={item.href} data-tone={item.tone}>
                <span className={styles.word} aria-hidden="true">
                  {item.word}.
                </span>
                <span className={styles.meta}>
                  <span className={styles.bandTitle}>{item.title}</span>
                  <span className={styles.bandText}>{item.text}</span>
                </span>
                <span className={styles.go} aria-hidden="true">
                  <ArrowIcon />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
