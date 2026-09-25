// All business data and copy in one place. Change texts here, not in the components.
// \u00AD is a soft hyphen: long German words may break there on small screens.

const WHATSAPP_NUMBER = '4368120708671'

export const business = {
  name: "Flucher's Garage",
  intro: 'Autoaufbereitung · Sherco-Handel · Schmier- und Betriebsstoffe',
  phone: { display: '+43 681 20708671', href: 'tel:+4368120708671' },
  email: 'office@fluchers-garage.at',
  instagram: { handle: 'fluchers_garage', url: 'https://www.instagram.com/fluchers_garage/' },
  facebook: { label: "Flucher's Garage", url: 'https://www.facebook.com/p/Fluchers-Garage-61574060888591/' },
  location: {
    town: 'Sankt Marein bei Graz',
    region: 'Steiermark',
    country: 'Österreich',
    district: 'Graz-Umgebung',
    // Centre of the municipality (Land Steiermark). Replace with the garage's
    // exact position once the street address is published.
    lat: 47.01464,
    lon: 15.66254,
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sankt+Marein+bei+Graz',
  },
  // Shown in the contact section. Adjust as soon as fixed opening hours exist.
  hours: 'Termine nach Vereinbarung',
}

export function whatsappLink(text) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

export function mailLink(subject, body) {
  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)
  const query = params.toString().replace(/\+/g, '%20')
  return `mailto:${business.email}${query ? `?${query}` : ''}`
}

export const nav = [
  { href: '#aufbereitung', label: 'Aufbereitung' },
  { href: '#sherco', label: 'Sherco' },
  { href: '#schmierstoffe', label: 'Schmierstoffe' },
  { href: '#garage', label: 'Über uns' },
  { href: '#kontakt', label: 'Kontakt' },
]

export const hero = {
  eyebrow: 'Sankt Marein bei Graz · Steiermark',
  words: ['Glanz.', 'Gas.', 'Öl.'],
  lead: 'Autoaufbereitung, offizieller Sherco-Händler und Schmier- & Betriebsstoffe. Alles aus einer Garage in Sankt Marein bei Graz.',
  primary: {
    label: 'Anfrage per WhatsApp',
    text: "Hallo Flucher's Garage! Ich hätte eine Anfrage: ",
  },
  secondary: { label: 'Leistungen ansehen', href: '#leistungen' },
  badge: { kicker: 'Offizieller Sherco-Händler', text: '50 ccm ab November' },
  animationLabel:
    'Animation: Ein blaues Sherco-Supermoto mit 50 ccm rollt ins Bild und dreht sich beim Scrollen zur Kamera.',
}

export const services = {
  eyebrow: 'Leistungen',
  title: 'Was in der Garage passiert',
  items: [
    {
      word: 'Glanz',
      title: 'Autoaufbereitung',
      text: 'Innenraum, Lack und Felgen. Dein Auto kommt sauber und gepflegt zurück.',
      href: '#aufbereitung',
      tone: 'chrome',
    },
    {
      word: 'Gas',
      title: 'Sherco-Händler',
      text: 'Offizieller Sherco-Händler. Die 50-ccm-Mopeds kommen im November.',
      href: '#sherco',
      tone: 'sherco',
    },
    {
      word: 'Öl',
      title: 'Schmier- & Betriebsstoffe',
      text: 'Motoröl, Zweitaktöl, Bremsflüssigkeit, Kühlmittel und mehr.',
      href: '#schmierstoffe',
      tone: 'oil',
    },
  ],
}

export const detailing = {
  eyebrow: 'Autoaufbereitung',
  title: 'Vom Gatsch zum Glanz.',
  lead: 'Innen, außen und bis in die Ritzen. Wir bereiten dein Auto so auf, dass du es wieder gern herzeigst.',
  compare: {
    before: 'Vorher',
    after: 'Nachher',
    caption: 'BMW M2 – zieh den Regler, um vorher und nachher zu vergleichen.',
    alt: {
      before: 'Weißer BMW M2 vor der Aufbereitung, übersät mit Schmutz und Schlammspritzern',
      after: 'Derselbe BMW M2 nach der Aufbereitung, sauber und glänzend',
    },
  },
  scope: [
    {
      icon: 'seat',
      title: 'Innenraum',
      text: 'Saugen, Sitze und Teppiche reinigen, Kunststoffe pflegen, Scheiben innen putzen.',
    },
    {
      icon: 'drop',
      title: 'Außen',
      text: 'Handwäsche, Felgen, Insekten und Teer entfernen. Auch die Stellen, die man nicht gleich sieht.',
    },
    {
      icon: 'spark',
      title: 'Lack',
      text: 'Politur und Versiegelung, damit der Glanz auch nach der nächsten Regenfahrt bleibt.',
    },
  ],
  stepsTitle: 'So läuft’s ab',
  steps: [
    { title: 'Fotos schicken', text: 'Ein paar Handyfotos per WhatsApp reichen uns für den ersten Blick.' },
    { title: 'Angebot bekommen', text: 'Du bekommst einen Preis und einen Termin, der dir passt.' },
    { title: 'Aufbereitung', text: 'Dein Auto steht bei uns in der Garage und wird gründlich gemacht.' },
    { title: 'Abholen', text: 'Du holst es sauber ab und freust dich beim Einsteigen.' },
  ],
  cta: {
    label: 'Fotos per WhatsApp schicken',
    text: 'Hallo! Ich hätte gern ein Angebot für eine Autoaufbereitung. Mein Auto: ',
  },
}

export const sherco = {
  eyebrow: 'Offizieller Sherco-Händler',
  title: '50 ccm Freiheit.',
  lead: 'Ab November stehen die 50-ccm-Mopeds von Sherco bei uns in der Garage. Modelle und Preise folgen in Kürze.',
  note: 'Du willst eines der ersten? Sag uns Bescheid, dann melden wir uns, sobald sie da sind.',
  facts: [
    { value: '50', unit: 'ccm', label: 'Hubraum' },
    { value: '45', unit: 'km/h', label: 'Höchstgeschwindigkeit', gauge: true },
    { value: 'AM', unit: '', label: 'Führerschein ab 15 Jahren' },
  ],
  factsCaption: 'Was in Österreich für ein Moped gilt',
  cta: {
    label: 'Vormerken per WhatsApp',
    text: 'Hallo! Ich interessiere mich für ein Sherco-Moped mit 50 ccm. Bitte meldet euch, sobald sie da sind.',
  },
  imageAlt: 'Sherco-Supermoto mit 50 ccm in Blau mit neongelben Felgenstreifen',
  arrival: 'Ab November',
}

export const fluids = {
  eyebrow: 'Schmier- & Betriebsstoffe',
  title: 'Damit’s rund läuft.',
  lead: 'Öl, Flüssigkeiten und Pflegemittel für Auto, Motorrad und Moped. Sag uns, was du fährst, und wir finden das Passende.',
  items: [
    {
      id: 'motoroel',
      shape: 'canister',
      name: 'Motoröl',
      spec: 'z. B. 5W-30 · 10W-40',
      label: '5W-30',
      color: '#e8a33d',
    },
    {
      id: 'zweitakt',
      shape: 'slim',
      name: 'Zwei\u00ADtakt\u00ADöl',
      spec: '2T fürs Moped',
      label: '2T',
      color: '#e2513f',
    },
    {
      id: 'getriebe',
      shape: 'bottle',
      name: 'Getriebe\u00ADöl',
      spec: 'z. B. 75W-90',
      label: '75W-90',
      color: '#b7731f',
    },
    {
      id: 'bremse',
      shape: 'small',
      name: 'Brems\u00ADflüssig\u00ADkeit',
      spec: 'DOT 4',
      label: 'DOT 4',
      color: '#e6cf7a',
    },
    {
      id: 'kuehlmittel',
      shape: 'jug',
      name: 'Kühl\u00ADmittel',
      spec: 'Frostschutz fürs Kühlsystem',
      label: '−35 °C',
      color: '#e0579f',
    },
    {
      id: 'kette',
      shape: 'spray',
      name: 'Ketten\u00ADspray',
      spec: 'für Moped & Motorrad',
      label: 'CHAIN',
      color: '#9aa7c2',
    },
  ],
  note: 'Welche Sorten gerade da sind, sagen wir dir gern per WhatsApp.',
  cta: {
    label: 'Verfügbarkeit anfragen',
    text: 'Hallo! Habt ihr folgendes Öl bzw. folgenden Betriebsstoff da? ',
  },
}

export const story = {
  eyebrow: 'Die Garage',
  number: '15',
  numberLabel: 'Jahre seit dem ersten Moped',
  quote:
    '15 Jahre ist es her, dass ich mein erstes Moped bekommen habe und diese unendliche Freiheit erleben durfte, die mit der neu gewonnenen Mobilität einherging.',
  signature: "Flucher's Garage",
  text: 'Aus dieser Begeisterung ist Flucher’s Garage entstanden: eine Garage in Sankt Marein bei Graz, in der Autos wieder glänzen, Mopeds ihre Fahrerinnen und Fahrer finden und das richtige Öl im Regal steht.',
}

export const contact = {
  eyebrow: 'Kontakt',
  title: 'Ab in die Garage.',
  lead: 'Am schnellsten erreichst du uns per WhatsApp. Schreib kurz, worum es geht, und wir melden uns.',
  topics: ['Autoaufbereitung', 'Sherco-Moped', 'Schmierstoffe', 'Etwas anderes'],
  distance: 'ca. 18 km südöstlich von Graz (Luftlinie)',
}

// Impressum / Datenschutz. Fields set to null show up as a highlighted
// "[… ergänzen]" placeholder on the website until they are filled in.
export const legal = {
  owner: null, // Vor- und Nachname der Inhaberin / des Inhabers
  street: null, // Straße und Hausnummer
  zip: null, // Postleitzahl
  uid: null, // UID-Nummer, falls vorhanden
  hosting: null, // Name und Anschrift des Hosting-Anbieters
  imageCredits: null, // z. B. "Sherco-Produktfotos: Sherco / Importeur"
  authority: 'Bezirkshauptmannschaft Graz-Umgebung',
  chamber: 'Wirtschaftskammer Steiermark',
  purpose: 'Fahrzeugaufbereitung, Handel mit Kraftfahrzeugen (Sherco) sowie Handel mit Schmier- und Betriebsstoffen',
  updated: 'September 2026',
}
