import { useId } from 'react'
import { F_PATH } from '../brand/fPath'
import styles from './Logo.module.css'

/** The round roller-door mark from the Facebook avatar, drawn as vector. */
export function LogoMark({ size = 44, className = '', title }) {
  const clipId = `mark-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <clipPath id={clipId}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="100" height="100" fill="#3D3F45" />
        <rect width="100" height="26" fill="#CDBB9C" />
        <g fill="#A39174">
          <rect y="5.6" width="100" height="1.3" />
          <rect y="11.6" width="100" height="1.3" />
          <rect y="17.6" width="100" height="1.3" />
          <rect y="23.6" width="100" height="2.4" />
        </g>
        <rect x="43" y="28" width="14" height="2.6" rx="1.3" fill="#26272C" />
      </g>
      <path
        d={F_PATH}
        transform="translate(12 36) scale(0.076)"
        fill="#fff"
        stroke="#fff"
        strokeWidth="26"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** "Flucher’s" in script above spaced "GARAGE", as on the Sherco flyer. */
export function Wordmark({ className = '' }) {
  return (
    <span className={`${styles.wordmark} ${className}`}>
      <span className={styles.script}>Flucher’s</span>
      <span className={styles.caps}>Garage</span>
    </span>
  )
}
