import { m } from 'motion/react'
import { business, nav, whatsappLink } from '../content'
import { openLegal } from '../lib/legal'
import { useScrollApi } from '../lib/scroll'
import { ArrowUpIcon, FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, WhatsAppIcon } from './Icons'
import styles from './SiteFooter.module.css'

export default function SiteFooter() {
  const scroll = useScrollApi()
  const year = new Date().getFullYear()

  function toTop(event) {
    event.preventDefault()
    scroll?.scrollTo('#top')
  }

  return (
    <footer className={styles.footer} data-nav-theme="dark">
      <div className="container">
        <div className={styles.brand}>
          {/* Written out from left to right, like a signature */}
          <m.div
            className={styles.scriptWrap}
            aria-hidden="true"
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, amount: 0.5 }}
          >
            <m.p
              className={styles.script}
              variants={{
                hidden: { clipPath: 'inset(-20% 100% -30% -5%)' },
                shown: {
                  clipPath: 'inset(-20% -5% -30% -5%)',
                  transition: { duration: 1.6, ease: [0.65, 0, 0.35, 1] },
                },
              }}
            >
              Flucher’s
            </m.p>
          </m.div>
          <p className={styles.caps}>
            <span className="visually-hidden">Flucher’s </span>Garage
          </p>
          <p className={styles.tagline}>{business.intro}</p>
        </div>

        <div className={styles.cols}>
          <nav aria-labelledby="footer-seiten">
            <h2 id="footer-seiten" className={styles.colTitle}>
              Seiten
            </h2>
            <ul className={styles.links}>
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className={styles.colTitle}>Kontakt</h2>
            <ul className={styles.links}>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon /> WhatsApp
                </a>
              </li>
              <li>
                <a href={business.phone.href}>
                  <PhoneIcon /> {business.phone.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${business.email}`}>
                  <MailIcon /> {business.email}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className={styles.colTitle}>Folgen</h2>
            <ul className={styles.links}>
              <li>
                <a href={business.instagram.url} target="_blank" rel="noopener noreferrer">
                  <InstagramIcon /> Instagram
                </a>
              </li>
              <li>
                <a href={business.facebook.url} target="_blank" rel="noopener noreferrer">
                  <FacebookIcon /> Facebook
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className={styles.colTitle}>Standort</h2>
            <p className={styles.address}>
              {business.location.town}
              <br />
              {business.location.region}, {business.location.country}
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {year} Flucher’s Garage</p>
          <div className={styles.legal}>
            <button type="button" onClick={() => openLegal('impressum')}>
              Impressum
            </button>
            <button type="button" onClick={() => openLegal('datenschutz')}>
              Datenschutz
            </button>
          </div>
          <a className={styles.top} href="#top" onClick={toTop}>
            Nach oben <ArrowUpIcon />
          </a>
        </div>
      </div>
    </footer>
  )
}
