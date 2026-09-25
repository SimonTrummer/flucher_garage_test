import { useId } from 'react'
import styles from './Bottle.module.css'

// Container outlines in a 120 × 220 box, standing on y = 216.
const SHAPES = {
  // 5-litre canister with a handle and a neck on the left
  canister: {
    body: 'M20 216a10 10 0 0 1-10-10V84a14 14 0 0 1 14-14h6V58h22v12h52a8 8 0 0 1 8 8v128a10 10 0 0 1-10 10Z',
    extra: 'M64 70V52a6 6 0 0 1 6-6h24a6 6 0 0 1 6 6v18',
    cap: { x: 26, y: 40, w: 30, h: 20, r: 3 },
    label: { x: 22, y: 118, w: 76, h: 58 },
    level: 104,
  },
  // tall slim 2T bottle
  slim: {
    body: 'M44 216a8 8 0 0 1-8-8V98c0-10 10-16 14-24V56h20v18c4 8 14 14 14 24v110a8 8 0 0 1-8 8Z',
    cap: { x: 47, y: 28, w: 26, h: 30, r: 4 },
    label: { x: 40, y: 128, w: 40, h: 58 },
    level: 112,
  },
  // one-litre bottle with angled shoulders
  bottle: {
    body: 'M36 216a10 10 0 0 1-10-10V110l20-30V62h28v18l20 30v96a10 10 0 0 1-10 10Z',
    cap: { x: 43, y: 44, w: 34, h: 20, r: 3 },
    label: { x: 32, y: 132, w: 56, h: 56 },
    level: 122,
  },
  // small brake-fluid bottle
  small: {
    body: 'M44 216a8 8 0 0 1-8-8v-66c0-8 8-14 14-18v-12h20v12c6 4 14 10 14 18v66a8 8 0 0 1-8 8Z',
    cap: { x: 46, y: 90, w: 28, h: 24, r: 4 },
    label: { x: 40, y: 158, w: 40, h: 40 },
    level: 146,
  },
  // coolant jug with a handle cut-out
  jug: {
    body: 'M28 216a12 12 0 0 1-12-12V96c0-8 4-14 12-18l8-4V60h20v14h30a16 16 0 0 1 16 16v114a12 12 0 0 1-12 12Z',
    extra: 'M74 92h14a6 6 0 0 1 6 6v18a6 6 0 0 1-6 6H74',
    cap: { x: 33, y: 46, w: 26, h: 18, r: 3 },
    label: { x: 24, y: 136, w: 72, h: 52 },
    level: 112,
  },
  // aerosol can (opaque)
  spray: {
    body: 'M44 216a6 6 0 0 1-6-6V86c0-10 8-18 18-20h8c10 2 18 10 18 20v124a6 6 0 0 1-6 6Z',
    cap: { x: 48, y: 40, w: 24, h: 26, r: 5 },
    nozzle: { x: 55, y: 30, w: 10, h: 10 },
    label: { x: 38, y: 118, w: 44, h: 64 },
    opaque: true,
  },
}

const WAVE = 'M-60 0Q-45 -5 -30 0T0 0T30 0T60 0T90 0T120 0T150 0T180 0T210 0V260H-60Z'

export default function Bottle({ shape, color, label, active = false, filled = true }) {
  const s = SHAPES[shape] ?? SHAPES.bottle
  const clipId = `bottle-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  return (
    <svg
      className={styles.svg}
      viewBox="0 0 120 220"
      aria-hidden="true"
      focusable="false"
      style={{ '--liquid': color }}
      data-active={active ? 'true' : 'false'}
      data-filled={filled ? 'true' : 'false'}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={s.body} />
        </clipPath>
      </defs>

      <g className={styles.tilt}>
        {s.opaque ? (
          <path className={styles.can} d={s.body} />
        ) : (
          <>
            <path className={styles.glass} d={s.body} />
            <g clipPath={`url(#${clipId})`}>
              <g className={styles.liquid}>
                <g className={styles.fill} style={{ '--level': `${s.level}px` }}>
                  <g className={styles.slosh}>
                    <path className={styles.wave} d={WAVE} />
                  </g>
                  <path className={`${styles.wave} ${styles.waveBack}`} d={WAVE} />
                </g>
              </g>
            </g>
          </>
        )}

        <path className={styles.outline} d={s.body} />
        {s.extra ? <path className={styles.handle} d={s.extra} /> : null}
        <rect className={styles.cap} x={s.cap.x} y={s.cap.y} width={s.cap.w} height={s.cap.h} rx={s.cap.r} />
        {s.nozzle ? (
          <rect className={styles.cap} x={s.nozzle.x} y={s.nozzle.y} width={s.nozzle.w} height={s.nozzle.h} rx="2" />
        ) : null}
        <path className={styles.highlight} d={`M${s.label.x + 4} ${s.label.y - 22}v-10`} />

        <g className={styles.sticker}>
          <rect x={s.label.x} y={s.label.y} width={s.label.w} height={s.label.h} rx="4" />
          <rect className={styles.stickerBand} x={s.label.x} y={s.label.y} width={s.label.w} height="7" rx="3" />
          <text x={s.label.x + s.label.w / 2} y={s.label.y + s.label.h / 2 + 8}>
            {label}
          </text>
        </g>

        {shape === 'spray' ? (
          <g className={styles.mist}>
            <circle cx="30" cy="36" r="5" />
            <circle cx="20" cy="30" r="7" />
            <circle cx="10" cy="40" r="6" />
            <circle cx="22" cy="46" r="4" />
          </g>
        ) : null}
      </g>
    </svg>
  )
}
