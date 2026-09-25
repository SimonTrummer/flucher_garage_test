import { useEffect, useRef, useState } from 'react'
import { business, legal } from '../content'
import { LEGAL_EVENT } from '../lib/legal'
import { useScrollApi } from '../lib/scroll'
import { CloseIcon } from './Icons'
import styles from './LegalDialogs.module.css'

function Field({ value, hint }) {
  return value ? <>{value}</> : <mark className={styles.todo}>[{hint} ergänzen]</mark>
}

function Imprint() {
  return (
    <>
      <p className={styles.kicker}>Angaben gemäß § 5 ECG und Offenlegung gemäß § 25 MedienG</p>
      <dl className={styles.facts}>
        <div>
          <dt>Medieninhaber &amp; Betreiber</dt>
          <dd>
            {business.name}
            <br />
            Inhaber:in: <Field value={legal.owner} hint="Vor- und Nachname" />
          </dd>
        </div>
        <div>
          <dt>Anschrift</dt>
          <dd>
            <Field value={legal.street} hint="Straße und Hausnummer" />
            <br />
            <Field value={legal.zip} hint="PLZ" /> {business.location.town}, {business.location.country}
          </dd>
        </div>
        <div>
          <dt>Kontakt</dt>
          <dd>
            Telefon &amp; WhatsApp: {business.phone.display}
            <br />
            E-Mail: {business.email}
          </dd>
        </div>
        <div>
          <dt>Unternehmensgegenstand</dt>
          <dd>{legal.purpose}</dd>
        </div>
        <div>
          <dt>UID-Nummer</dt>
          <dd>
            <Field value={legal.uid} hint="UID-Nummer, falls vorhanden" />
          </dd>
        </div>
        <div>
          <dt>Gewerbebehörde</dt>
          <dd>{legal.authority}</dd>
        </div>
        <div>
          <dt>Kammer</dt>
          <dd>{legal.chamber}</dd>
        </div>
        <div>
          <dt>Rechtsvorschriften</dt>
          <dd>
            Gewerbeordnung, abrufbar unter{' '}
            <a href="https://www.ris.bka.gv.at" target="_blank" rel="noopener noreferrer">
              www.ris.bka.gv.at
            </a>
          </dd>
        </div>
        <div>
          <dt>Blattlinie</dt>
          <dd>Information über die Leistungen und Angebote von {business.name}.</dd>
        </div>
        <div>
          <dt>Bildnachweis</dt>
          <dd>
            <Field value={legal.imageCredits} hint="Bildnachweis" />
          </dd>
        </div>
      </dl>
    </>
  )
}

function Privacy() {
  return (
    <div className={styles.prose}>
      <h3>Verantwortlich</h3>
      <p>
        {business.name}, <Field value={legal.owner} hint="Vor- und Nachname" />,{' '}
        <Field value={legal.street} hint="Straße und Hausnummer" />, <Field value={legal.zip} hint="PLZ" />{' '}
        {business.location.town}. E-Mail: {business.email}
      </p>

      <h3>Keine Cookies, kein Tracking</h3>
      <p>
        Diese Website setzt keine Cookies, speichert nichts auf deinem Gerät und verwendet keine Analyse- oder
        Werbedienste. Schriften und Bilder werden direkt von unserem Server geladen – es werden keine Verbindungen zu
        Google Fonts oder anderen Drittanbietern aufgebaut.
      </p>

      <h3>Hosting und Server-Logfiles</h3>
      <p>
        Beim Aufruf der Website verarbeitet unser Hosting-Anbieter (
        <Field value={legal.hosting} hint="Hosting-Anbieter" />) technisch notwendige Daten wie IP-Adresse, Datum,
        Uhrzeit und die aufgerufene Seite, um die Website sicher auszuliefern. Rechtsgrundlage ist unser berechtigtes
        Interesse an einem sicheren Betrieb (Art. 6 Abs. 1 lit. f DSGVO).
      </p>

      <h3>Kontakt per WhatsApp, E-Mail oder Telefon</h3>
      <p>
        Wenn du uns kontaktierst, verarbeiten wir deine Angaben, um deine Anfrage zu beantworten (Art. 6 Abs. 1 lit. b
        DSGVO). Das Formular auf dieser Website überträgt selbst keine Daten, sondern öffnet WhatsApp oder dein
        E-Mail-Programm mit einer vorbereiteten Nachricht. Für WhatsApp gelten die Datenschutzbestimmungen von WhatsApp
        Ireland Limited.
      </p>

      <h3>Links zu Instagram, Facebook, WhatsApp und Google Maps</h3>
      <p>
        Das sind einfache Links. Erst wenn du einen davon anklickst, wird die Seite des jeweiligen Anbieters geöffnet;
        dort gelten dessen Datenschutzbestimmungen.
      </p>

      <h3>Deine Rechte</h3>
      <p>
        Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und
        Widerspruch. Schreib uns dazu einfach an {business.email}. Wenn du meinst, dass wir deine Daten nicht korrekt
        verarbeiten, kannst du dich bei der Österreichischen Datenschutzbehörde beschweren (
        <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer">
          www.dsb.gv.at
        </a>
        ).
      </p>
      <p className={styles.updated}>Stand: {legal.updated}</p>
    </div>
  )
}

const TITLES = { impressum: 'Impressum', datenschutz: 'Datenschutz' }

export default function LegalDialogs() {
  const dialogRef = useRef(null)
  const [kind, setKind] = useState(null)
  const scroll = useScrollApi()

  useEffect(() => {
    const onOpen = (event) => setKind(event.detail)
    const fromHash = () => {
      const hash = window.location.hash.slice(1)
      if (hash in TITLES) setKind(hash)
    }
    fromHash()
    window.addEventListener(LEGAL_EVENT, onOpen)
    window.addEventListener('hashchange', fromHash)
    return () => {
      window.removeEventListener(LEGAL_EVENT, onOpen)
      window.removeEventListener('hashchange', fromHash)
    }
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!kind || !dialog) return undefined
    if (!dialog.open) dialog.showModal()
    scroll?.lock()
    return () => scroll?.unlock()
  }, [kind, scroll])

  function close() {
    dialogRef.current?.close()
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="legal-title"
      onClose={() => {
        setKind(null)
        if (window.location.hash.slice(1) in TITLES) history.replaceState(null, '', window.location.pathname)
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) close()
      }}
    >
      {kind ? (
        <div className={styles.inner} data-lenis-prevent>
          <div className={styles.head}>
            <h2 id="legal-title" className={styles.title}>
              {TITLES[kind]}
            </h2>
            <button type="button" className={styles.close} onClick={close}>
              <CloseIcon />
              <span className="visually-hidden">Schließen</span>
            </button>
          </div>
          {kind === 'datenschutz' ? <Privacy /> : <Imprint />}
        </div>
      ) : null}
    </dialog>
  )
}
