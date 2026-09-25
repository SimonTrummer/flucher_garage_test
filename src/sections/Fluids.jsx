import { useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { fluids, whatsappLink } from '../content'
import Bottle from '../components/Bottle'
import { WhatsAppIcon } from '../components/Icons'
import { Reveal, RevealTitle } from '../components/Reveal'
import styles from './Fluids.module.css'

export default function Fluids() {
  const shelfRef = useRef(null)
  const filled = useInView(shelfRef, { once: true, amount: 0.35 })
  const [active, setActive] = useState(null)

  function tap(id, event) {
    if (event.pointerType === 'mouse') return
    setActive(id)
    window.setTimeout(() => setActive((current) => (current === id ? null : current)), 1400)
  }

  return (
    <section id="schmierstoffe" className={styles.section} data-nav-theme="dark" aria-labelledby="schmierstoffe-title">
      <div className="container">
        <header className={styles.head}>
          <div className={styles.headTitle}>
            <p className={`eyebrow ${styles.eyebrow}`}>{fluids.eyebrow}</p>
            <RevealTitle id="schmierstoffe-title" className={`section-title ${styles.title}`}>
              {fluids.title}
            </RevealTitle>
          </div>
          <Reveal delay={0.1}>
            <p className="lead">{fluids.lead}</p>
          </Reveal>
        </header>

        <ul ref={shelfRef} className={styles.shelf}>
          {fluids.items.map((item, index) => (
            <li
              key={item.id}
              className={styles.item}
              style={{ '--i': index }}
              onPointerEnter={(event) => event.pointerType === 'mouse' && setActive(item.id)}
              onPointerLeave={(event) => event.pointerType === 'mouse' && setActive(null)}
              onPointerDown={(event) => tap(item.id, event)}
            >
              <div className={styles.bottle}>
                <Bottle
                  shape={item.shape}
                  color={item.color}
                  label={item.label}
                  active={active === item.id}
                  filled={filled}
                />
              </div>
              <span className={styles.plank} aria-hidden="true" />
              <h3 className={styles.name}>{item.name}</h3>
              <p className={styles.spec}>{item.spec}</p>
            </li>
          ))}
        </ul>

        <Reveal className={styles.foot}>
          <p className={styles.note}>{fluids.note}</p>
          <a className="btn" href={whatsappLink(fluids.cta.text)} target="_blank" rel="noopener noreferrer">
            <span className="btn__inner">
              <WhatsAppIcon />
              {fluids.cta.label}
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
