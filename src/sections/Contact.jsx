import { useRef, useState } from 'react'
import { business, contact, mailLink, whatsappLink } from '../content'
import MiniMap from '../components/MiniMap'
import {
  ArrowUpRightIcon,
  CheckIcon,
  ClockIcon,
  CopyIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
} from '../components/Icons'
import { Reveal, RevealTitle } from '../components/Reveal'
import styles from './Contact.module.css'

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false)

  async function copy(event) {
    const button = event.currentTarget
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Clipboard blocked: select the text next to the button instead.
      const text = button.parentElement?.querySelector('[data-copy]')
      if (text) {
        const range = document.createRange()
        range.selectNodeContents(text)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
      }
      return
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button type="button" className={styles.copy} onClick={copy} data-copied={copied ? 'true' : 'false'}>
      {copied ? <CheckIcon /> : <CopyIcon />}
      <span className="visually-hidden">{label} kopieren</span>
      <span className={styles.copyState} aria-live="polite">
        {copied ? 'Kopiert' : ''}
      </span>
    </button>
  )
}

function ContactForm() {
  const formRef = useRef(null)
  const [topic, setTopic] = useState(contact.topics[0])
  const [errors, setErrors] = useState({})

  function onSubmit(event) {
    event.preventDefault()
    const data = new FormData(formRef.current)
    const name = String(data.get('name') || '').trim()
    const vehicle = String(data.get('vehicle') || '').trim()
    const message = String(data.get('message') || '').trim()

    const nextErrors = {}
    if (!name) nextErrors.name = 'Bitte gib deinen Namen an.'
    if (!message) nextErrors.message = 'Schreib uns kurz, worum es geht.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      formRef.current.querySelector(nextErrors.name ? '#kontakt-name' : '#kontakt-nachricht')?.focus()
      return
    }

    const lines = [
      `Hallo Flucher’s Garage!`,
      '',
      `Anliegen: ${topic}`,
      `Name: ${name}`,
      vehicle ? `Fahrzeug: ${vehicle}` : null,
      '',
      message,
    ].filter((line) => line !== null)
    const text = lines.join('\n')

    const via = event.nativeEvent.submitter?.value
    if (via === 'mail') {
      window.location.href = mailLink(`Anfrage: ${topic}`, text)
    } else {
      window.open(whatsappLink(text), '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
      <fieldset className={styles.topics}>
        <legend className={styles.legend}>Worum geht’s?</legend>
        <div className={styles.chips}>
          {contact.topics.map((item) => (
            <label key={item} className={styles.chip}>
              <input type="radio" name="topic" value={item} checked={topic === item} onChange={() => setTopic(item)} />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="kontakt-name">Name</label>
          <input
            id="kontakt-name"
            name="name"
            autoComplete="name"
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'kontakt-name-fehler' : undefined}
          />
          {errors.name ? (
            <p id="kontakt-name-fehler" className={styles.error}>
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className={styles.field}>
          <label htmlFor="kontakt-fahrzeug">
            Fahrzeug <span className={styles.optional}>(optional)</span>
          </label>
          <input id="kontakt-fahrzeug" name="vehicle" placeholder="z. B. VW Golf, Sherco 50" />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="kontakt-nachricht">Nachricht</label>
        <textarea
          id="kontakt-nachricht"
          name="message"
          rows={4}
          placeholder="Was dürfen wir für dich tun?"
          aria-invalid={errors.message ? 'true' : undefined}
          aria-describedby={errors.message ? 'kontakt-nachricht-fehler' : undefined}
        />
        {errors.message ? (
          <p id="kontakt-nachricht-fehler" className={styles.error}>
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className={styles.actions}>
        <button type="submit" name="via" value="whatsapp" className="btn">
          <span className="btn__inner">
            <WhatsAppIcon />
            Per WhatsApp senden
          </span>
        </button>
        <button type="submit" name="via" value="mail" className="btn btn--ghost">
          <span className="btn__inner">
            <MailIcon />
            Per E-Mail senden
          </span>
        </button>
      </div>
      <p className={styles.hint}>
        Beim Senden öffnet sich WhatsApp bzw. dein E-Mail-Programm mit der fertigen Nachricht. Diese Website speichert
        keine Daten.
      </p>
    </form>
  )
}

export default function Contact() {
  const { location } = business
  return (
    <section id="kontakt" className={styles.section} data-nav-theme="dark" aria-labelledby="kontakt-title">
      <span className={styles.stripe} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div className={styles.main}>
          <p className="eyebrow">{contact.eyebrow}</p>
          <RevealTitle id="kontakt-title" className={`section-title ${styles.title}`}>
            {contact.title}
          </RevealTitle>
          <p className="lead">{contact.lead}</p>
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>

        <Reveal as="aside" className={styles.aside} delay={0.1} aria-label="Kontaktdaten">
          <ul className={styles.list}>
            <li className={styles.entry}>
              <span className={styles.icon}>
                <WhatsAppIcon />
              </span>
              <span className={styles.entryBody}>
                <span className={styles.entryLabel}>WhatsApp &amp; Telefon</span>
                <span className={styles.entryValue} data-copy>
                  {business.phone.display}
                </span>
                <span className={styles.entryLinks}>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                    WhatsApp öffnen
                  </a>
                  <a href={business.phone.href}>
                    <PhoneIcon /> Anrufen
                  </a>
                </span>
              </span>
              <CopyButton value={business.phone.display} label="Telefonnummer" />
            </li>
            <li className={styles.entry}>
              <span className={styles.icon}>
                <MailIcon />
              </span>
              <span className={styles.entryBody}>
                <span className={styles.entryLabel}>E-Mail</span>
                <a className={styles.entryValue} href={mailLink()} data-copy>
                  {business.email}
                </a>
              </span>
              <CopyButton value={business.email} label="E-Mail-Adresse" />
            </li>
            <li className={styles.entry}>
              <span className={styles.icon}>
                <PinIcon />
              </span>
              <span className={styles.entryBody}>
                <span className={styles.entryLabel}>Standort</span>
                <span className={styles.entryValue}>
                  {location.town}, {location.region}
                </span>
                <span className={styles.entryLinks}>
                  <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer">
                    In Google Maps öffnen <ArrowUpRightIcon />
                  </a>
                </span>
              </span>
            </li>
            <li className={styles.entry}>
              <span className={styles.icon}>
                <ClockIcon />
              </span>
              <span className={styles.entryBody}>
                <span className={styles.entryLabel}>Termine</span>
                <span className={styles.entryValue}>{business.hours}</span>
              </span>
            </li>
          </ul>

          <MiniMap lat={location.lat} lon={location.lon} town={location.town} distance={contact.distance} />

          <div className={styles.social}>
            <a href={business.instagram.url} target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
              <span>@{business.instagram.handle}</span>
            </a>
            <a href={business.facebook.url} target="_blank" rel="noopener noreferrer">
              <FacebookIcon />
              <span>{business.facebook.label}</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
