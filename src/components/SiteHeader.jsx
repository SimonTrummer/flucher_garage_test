import { useEffect, useRef, useState } from 'react'
import { business, nav, whatsappLink } from '../content'
import { useScrollApi } from '../lib/scroll'
import { CloseIcon, InstagramIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from './Icons'
import { LogoMark, Wordmark } from './Logo'
import styles from './SiteHeader.module.css'

export default function SiteHeader({ hidden = false }) {
  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const [theme, setTheme] = useState('light')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const scroll = useScrollApi()

  // Light text on dark sections, dark text on the bright studio.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const header = headerRef.current
      if (!header) return
      setScrolled(window.scrollY > 8)
      const probe = Math.round(header.offsetHeight / 2)
      for (const el of document.elementsFromPoint(window.innerWidth / 2, probe)) {
        if (header.contains(el)) continue
        const host = el.closest('[data-nav-theme]')
        if (host) {
          setTheme(host.dataset.navTheme === 'light' ? 'light' : 'dark')
          break
        }
      }
    }
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
    }
  }, [])

  // Menu: lock the page, trap focus, close with Escape.
  useEffect(() => {
    if (!open) return undefined
    scroll?.lock()
    const menu = menuRef.current
    const button = buttonRef.current
    const focusables = () => [...menu.querySelectorAll('a[href], button:not([disabled])')]
    focusables()[0]?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      scroll?.unlock()
      button?.focus({ preventScroll: true })
    }
  }, [open, scroll])

  function goTo(event, href) {
    event.preventDefault()
    setOpen(false)
    // Wait one frame so the page is unlocked before scrolling.
    requestAnimationFrame(() => scroll?.scrollTo(href))
    history.replaceState(null, '', href)
  }

  function toTop(event) {
    event.preventDefault()
    scroll?.scrollTo('#top')
  }

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-theme={open ? 'dark' : theme}
      data-scrolled={scrolled && !open ? 'true' : 'false'}
      data-hidden={hidden ? 'true' : 'false'}
    >
      <div className={`container ${styles.bar}`}>
        <a className={styles.brand} href="#top" onClick={toTop} aria-label="Flucher’s Garage – zum Seitenanfang">
          <LogoMark size={40} className={styles.mark} />
          <Wordmark className={styles.wordmark} />
        </a>

        <nav className={styles.nav} aria-label="Hauptnavigation">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a className={styles.link} href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          className={`btn ${theme === 'light' ? 'btn--ink' : ''} ${styles.cta}`}
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="btn__inner">
            <WhatsAppIcon />
            WhatsApp
          </span>
        </a>

        <button
          ref={buttonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="hauptmenue"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
          <span className="visually-hidden">Menü öffnen</span>
        </button>
      </div>

      <div
        ref={menuRef}
        id="hauptmenue"
        className={styles.menu}
        data-open={open ? 'true' : 'false'}
        role="dialog"
        aria-modal="true"
        aria-label="Menü"
        hidden={!open}
        data-lenis-prevent
      >
        <div className={`container ${styles.menuBar}`}>
          <span className={styles.menuBrand}>
            <LogoMark size={40} />
          </span>
          <button type="button" className={styles.menuButton} onClick={() => setOpen(false)}>
            <CloseIcon />
            <span className="visually-hidden">Menü schließen</span>
          </button>
        </div>
        <nav className={`container ${styles.menuNav}`} aria-label="Menü">
          <ul>
            {nav.map((item, index) => (
              <li key={item.href} style={{ '--i': index }}>
                <a href={item.href} onClick={(event) => goTo(event, item.href)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={`container ${styles.menuFoot}`}>
          <a className="btn" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <span className="btn__inner">
              <WhatsAppIcon />
              WhatsApp schreiben
            </span>
          </a>
          <div className={styles.menuLinks}>
            <a href={business.phone.href}>
              <PhoneIcon />
              {business.phone.display}
            </a>
            <a href={business.instagram.url} target="_blank" rel="noopener noreferrer">
              <InstagramIcon />@{business.instagram.handle}
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
