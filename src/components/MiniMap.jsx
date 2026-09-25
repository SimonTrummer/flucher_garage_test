import { useRef } from 'react'
import { m, useInView } from 'motion/react'
import styles from './MiniMap.module.css'

// Equirectangular projection around 47° N, drawn to scale (18.05 px per km).
const LON_MIN = 15.36
const LAT_MAX = 47.115
const PX_PER_KM = 18.05
const KM_PER_DEG_LAT = 111.2
const KM_PER_DEG_LON = 111.32 * Math.cos((47.04 * Math.PI) / 180)

const project = (lat, lon) => [
  (lon - LON_MIN) * KM_PER_DEG_LON * PX_PER_KM,
  (LAT_MAX - lat) * KM_PER_DEG_LAT * PX_PER_KM,
]

const GRAZ = { lat: 47.0707, lon: 15.4384 } // Hauptplatz
const LON_LINES = [15.4, 15.45, 15.5, 15.55, 15.6, 15.65, 15.7]
const LAT_LINES = [47.1, 47.05, 47.0]
const deg = (v, digits = 2) => v.toFixed(digits).replace('.', ',')

export default function MiniMap({ lat, lon, town, distance }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [gx, gy] = project(GRAZ.lat, GRAZ.lon)
  const [sx, sy] = project(lat, lon)
  const km = Math.hypot(sx - gx, sy - gy) / PX_PER_KM

  return (
    <figure className={styles.map}>
      <svg ref={ref} viewBox="0 0 520 300" role="img" aria-labelledby="map-title map-desc">
        <title id="map-title">Lage von {town}</title>
        <desc id="map-desc">
          {town} liegt {distance}. Luftlinie zum Grazer Hauptplatz: etwa {Math.round(km)} Kilometer.
        </desc>

        {LON_LINES.map((l) => {
          const [x] = project(47, l)
          return <line key={l} className={styles.grid} x1={x} y1="0" x2={x} y2="300" />
        })}
        {LAT_LINES.map((l) => {
          const [, y] = project(l, 15.5)
          return <line key={l} className={styles.grid} x1="0" y1={y} x2="520" y2={y} />
        })}
        <text className={styles.coord} x="8" y={project(47.05, 15.5)[1] - 6}>
          {deg(47.05)}° N
        </text>
        <text className={styles.coord} x={project(47, 15.5)[0] + 6} y="290">
          {deg(15.5)}° O
        </text>

        <m.line
          className={styles.route}
          x1={gx}
          y1={gy}
          x2={sx}
          y2={sy}
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
        />
        <text
          className={styles.distance}
          x={(gx + sx) / 2}
          y={(gy + sy) / 2 - 12}
          transform={`rotate(${((Math.atan2(sy - gy, sx - gx) * 180) / Math.PI).toFixed(2)} ${(gx + sx) / 2} ${(gy + sy) / 2})`}
        >
          ≈ {Math.round(km)} km
        </text>

        <circle className={styles.city} cx={gx} cy={gy} r="6" />
        <text className={styles.cityLabel} x={gx} y={gy - 16}>
          Graz
        </text>

        <circle className={styles.pulse} cx={sx} cy={sy} r="10" />
        <circle className={styles.here} cx={sx} cy={sy} r="8" />
        <text className={styles.hereLabel} x={sx} y={sy + 30}>
          St. Marein bei Graz
        </text>

        <g className={styles.scale} transform="translate(372 270)">
          <line x1="0" y1="0" x2={5 * PX_PER_KM} y2="0" />
          <line x1="0" y1="-5" x2="0" y2="5" />
          <line x1={5 * PX_PER_KM} y1="-5" x2={5 * PX_PER_KM} y2="5" />
          <text x={5 * PX_PER_KM + 10} y="4">
            5 km
          </text>
        </g>
        <g className={styles.north} transform="translate(492 34)">
          <path d="M0 -16 7 6 0 1 -7 6Z" />
          <text x="0" y="22">
            N
          </text>
        </g>
      </svg>
      <figcaption className={styles.caption}>
        {deg(lat, 3)}° N · {deg(lon, 3)}° O · Gemeindezentrum
      </figcaption>
    </figure>
  )
}
