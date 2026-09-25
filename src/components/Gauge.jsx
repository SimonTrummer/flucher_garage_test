import { useEffect, useRef } from 'react'
import { animate, m, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import styles from './Gauge.module.css'

const MAX = 60
const START = -120 // degrees, 0 km/h
const SWEEP = 240
const CX = 100
const CY = 104
const R = 84

const polar = (deg, r) => {
  const rad = (deg * Math.PI) / 180
  return [CX + r * Math.sin(rad), CY - r * Math.cos(rad)]
}
const angleFor = (kmh) => START + (kmh / MAX) * SWEEP

function arc(r, fromDeg, toDeg) {
  const [x1, y1] = polar(fromDeg, r)
  const [x2, y2] = polar(toDeg, r)
  const large = toDeg - fromDeg > 180 ? 1 : 0
  return `M${x1.toFixed(2)} ${y1.toFixed(2)}A${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

const TICKS = Array.from({ length: MAX / 5 + 1 }, (_, i) => i * 5)

/** Moped speedometer; the needle swings to the legal 45 km/h when it scrolls into view. */
export default function Gauge({ value = 45 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.7 })
  const reduceMotion = useReducedMotion()
  const speed = useMotionValue(reduceMotion ? value : 0)
  const needle = useTransform(speed, (v) => `rotate(${angleFor(v)}deg)`)
  const readout = useTransform(speed, (v) => String(Math.max(0, Math.round(v))))
  const filled = useTransform(speed, (v) => Math.max(0.001, v / MAX))

  useEffect(() => {
    if (!inView) return undefined
    if (reduceMotion) {
      speed.set(value)
      return undefined
    }
    const controls = animate(speed, value, { type: 'spring', stiffness: 42, damping: 9, mass: 1.1 })
    return () => controls.stop()
  }, [inView, reduceMotion, speed, value])

  return (
    <svg ref={ref} className={styles.gauge} viewBox="0 0 200 172" aria-hidden="true" focusable="false">
      <path className={styles.track} d={arc(R, START, START + SWEEP)} />
      <path className={styles.zone} d={arc(R, angleFor(45), START + SWEEP)} />
      <m.path className={styles.fill} d={arc(R, START, START + SWEEP)} style={{ pathLength: filled }} />
      {TICKS.map((kmh) => {
        const major = kmh % 10 === 0
        const deg = angleFor(kmh)
        const [x1, y1] = polar(deg, R - 10)
        const [x2, y2] = polar(deg, R - (major ? 22 : 16))
        const [lx, ly] = polar(deg, R - 36)
        return (
          <g key={kmh}>
            <line
              className={major ? styles.tickMajor : styles.tick}
              x1={x1.toFixed(2)}
              y1={y1.toFixed(2)}
              x2={x2.toFixed(2)}
              y2={y2.toFixed(2)}
            />
            {major ? (
              <text className={styles.label} x={lx.toFixed(2)} y={(ly + 4).toFixed(2)}>
                {kmh}
              </text>
            ) : null}
          </g>
        )
      })}
      <m.g className={styles.needle} style={{ transform: needle }}>
        <path d={`M${CX - 3.2} ${CY} L${CX} ${CY - R + 12} L${CX + 3.2} ${CY} Z`} />
      </m.g>
      <circle className={styles.hub} cx={CX} cy={CY} r="9" />
      <m.text className={styles.readout} x={CX} y={CY + 50}>
        {readout}
      </m.text>
      <text className={styles.unit} x={CX} y={CY + 64}>
        km/h
      </text>
    </svg>
  )
}
