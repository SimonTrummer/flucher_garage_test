// Opens the Impressum / Datenschutz dialogs from anywhere (footer links, deep links).
export const LEGAL_EVENT = 'fg:legal'

export function openLegal(kind) {
  window.dispatchEvent(new CustomEvent(LEGAL_EVENT, { detail: kind }))
}
