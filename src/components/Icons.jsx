// Small line icons (24px grid). Decorative by default; pass `title` to expose one.

function Svg({ title, children, className, strokeWidth = 1.8, fill = 'none', ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export function WhatsAppIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 2.8a9.2 9.2 0 0 0-7.9 13.9L2.8 21.2l4.6-1.2A9.2 9.2 0 1 0 12 2.8Z" />
      <path
        d="M8.7 7.6c.2-.4.4-.5.8-.5h.5c.2 0 .4.1.5.4l.8 1.9c.1.2 0 .5-.1.7l-.6.7c-.1.1-.2.4 0 .6.4.7 1 1.4 1.6 1.9.6.5 1.3.9 2 1.1.2.1.4 0 .6-.1l.7-.8c.1-.2.4-.2.6-.1l1.8.9c.2.1.4.3.3.6-.2 1.1-1.1 1.9-2.2 2-3.4.2-7.5-3.8-7.2-7.2 0-.6.2-1.1.4-1.6Z"
        fill="currentColor"
        stroke="none"
      />
    </Svg>
  )
}

export function PhoneIcon(props) {
  return (
    <Svg {...props}>
      <path d="M5.2 3.5h3l1.5 4-2 1.3a11 11 0 0 0 7.5 7.5l1.3-2 4 1.5v3a1.7 1.7 0 0 1-1.8 1.7A16.7 16.7 0 0 1 3.5 5.3a1.7 1.7 0 0 1 1.7-1.8Z" />
    </Svg>
  )
}

export function MailIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.2" />
      <path d="m4 7 8 6 8-6" />
    </Svg>
  )
}

export function InstagramIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function FacebookIcon(props) {
  return (
    <Svg {...props}>
      <path d="M14.2 21v-7.6h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4a21 21 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H8.5v3h2.6V21" />
    </Svg>
  )
}

export function PinIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </Svg>
  )
}

export function ClockIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  )
}

export function ArrowIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />
    </Svg>
  )
}

export function ArrowUpRightIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </Svg>
  )
}

export function CopyIcon(props) {
  return (
    <Svg {...props}>
      <rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2" />
      <path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5" />
    </Svg>
  )
}

export function CheckIcon(props) {
  return (
    <Svg {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Svg>
  )
}

export function CloseIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  )
}

export function SeatIcon(props) {
  return (
    <Svg {...props}>
      <path d="M8.5 3.5h3.2a2 2 0 0 1 2 2.2l-.9 7.8h3.4a2 2 0 0 1 2 2v2.3H7.4l-.8-12a2 2 0 0 1 1.9-2.3Z" />
      <path d="M9 17.8V21M16.5 17.8V21" />
    </Svg>
  )
}

export function DropIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3.2s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11Z" />
      <path d="M9.2 14.6a2.9 2.9 0 0 0 2.4 2.7" />
    </Svg>
  )
}

export function SparkIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3.5 13.9 10 20.5 12 13.9 14 12 20.5 10.1 14 3.5 12 10.1 10Z" />
      <path d="M19 3.5v3M17.5 5h3" />
    </Svg>
  )
}

export function MenuIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 8h16M4 16h11" />
    </Svg>
  )
}

export function ArrowUpIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" />
    </Svg>
  )
}
