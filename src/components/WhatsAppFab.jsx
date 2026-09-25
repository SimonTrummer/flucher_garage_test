import { useEffect, useState } from 'react'
import { whatsappLink } from '../content'
import { WhatsAppIcon } from './Icons'
import styles from './WhatsAppFab.module.css'

/** Floating WhatsApp shortcut: shown after the hero, hidden while the contact section is on screen. */
export default function WhatsAppFab() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    const contact = document.getElementById('kontakt')
    let contactInView = false
    let raf = 0

    const update = () => {
      raf = 0
      const pastHero = hero ? window.scrollY > hero.offsetHeight - window.innerHeight * 0.6 : window.scrollY > 800
      setVisible(pastHero && !contactInView)
    }
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        contactInView = entry.isIntersecting
        request()
      },
      { threshold: 0.12 },
    )
    if (contact) observer.observe(contact)
    window.addEventListener('scroll', request, { passive: true })
    update()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', request)
    }
  }, [])

  return (
    <aside aria-label="Schnellkontakt">
      <a
        className={styles.fab}
        data-visible={visible ? 'true' : 'false'}
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-hidden={visible ? undefined : 'true'}
        tabIndex={visible ? undefined : -1}
      >
        <WhatsAppIcon />
        <span className={styles.label}>WhatsApp</span>
      </a>
    </aside>
  )
}
