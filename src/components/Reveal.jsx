import { m } from 'motion/react'

const EASE = [0.16, 1, 0.3, 1]
const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' }

/** Rises into place the first time it scrolls into view. */
export function Reveal({ as = 'div', children, delay = 0, y = 32, ...rest }) {
  const Component = m[as] ?? m.div
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Component>
  )
}

/**
 * Headline that slides up out of a mask. The heading itself is observed (it is
 * never clipped, so the in-view check is reliable); the inner line is masked.
 */
export function RevealTitle({ as = 'h2', children, delay = 0, ...rest }) {
  const Component = m[as] ?? m.h2
  const line = {
    hidden: { clipPath: 'inset(0% -12% 100% -12%)', y: '0.35em' },
    shown: {
      clipPath: 'inset(-25% -12% -25% -12%)',
      y: '0em',
      transition: { duration: 1.05, ease: EASE, delay },
    },
  }
  return (
    <Component initial="hidden" whileInView="shown" viewport={VIEWPORT} {...rest}>
      <m.span style={{ display: 'block' }} variants={line}>
        {children}
      </m.span>
    </Component>
  )
}
