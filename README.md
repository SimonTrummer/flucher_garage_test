# Flucher's Garage – Website

One-page website for **Flucher's Garage** in Sankt Marein bei Graz (Steiermark):
Autoaufbereitung, offizieller Sherco-Händler (50-ccm-Mopeds) sowie Schmier- und
Betriebsstoffe. Built with React 19 and Vite.

## What's on the page

| Section | Highlights |
| --- | --- |
| **Intro** | The roller door from the logo stays shut while the first frames load, then rolls up. Any click, key or scroll opens it right away. |
| **Hero** | A light "photo studio". The Sherco rolls in, and as you scroll it turns towards you (199-frame image sequence on a `<canvas>`). The headline animates its own meaning: **GLANZ.** gets a light sweep, **GAS.** stretches wider while you scroll, **ÖL.** is half full of sloshing oil. |
| **Leistungen** | A dark section slides over the pinned studio with a fluo livery stripe. Three bands link to the trades. |
| **Autoaufbereitung** | Before/after slider (BMW M2) with a one-off "wipe clean" demo. You can drag it or use the keyboard. Scope of work, and a numbered process whose line fills as you scroll. |
| **Sherco** | Livery-blue section with the cut-out bike (parallax plus a slight mouse tilt), and a speedometer that sweeps to the legal 45 km/h. |
| **Schmierstoffe** | A shelf of SVG containers with animated liquid. On hover a container tilts while the liquid stays level. |
| **Die Garage** | The quote from the Facebook post; the "15" is filled with the door slats and rolls as you scroll. |
| **Kontakt** | A form that composes a WhatsApp or e-mail message (the site stores nothing), copyable contact details, and a to-scale map from Graz to St. Marein. |
| **Footer** | Signature wordmark, links, Impressum and Datenschutz as dialogs (`#impressum`, `#datenschutz` also work as links). |

Everything respects `prefers-reduced-motion`: with reduced motion the hero shows the
final frame and nothing moves on its own.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the build locally
npm run lint
```

The build is fully static and uses relative paths. Upload the contents of `dist/` to any
web space (World4You, easyname, Netlify, Vercel, …).

## Editing content

**All texts and business data live in [`src/content.js`](src/content.js)**: phone,
e-mail, Instagram and Facebook links, location, section copy, service lists and the
lubricant shelf.

- WhatsApp links are built with `whatsappLink(text)`, so each button opens a chat with
  a suitable pre-filled message.
- `­` in a word is a soft hyphen: long German words may break there on phones.

### Before going live

- [ ] **Impressum / Datenschutz:** fill in the `legal` block in `src/content.js` (owner name,
      street, postcode, UID number if any, hosting provider, image credits). Until then the
      site shows highlighted `[… ergänzen]` placeholders. Have both texts checked.
- [ ] Confirm the **Autoaufbereitung** scope (Innenraum / Außen / Lack) and the process steps.
- [ ] Confirm **"50 ccm ab November"** and the right to use the Sherco product photo and video.
- [ ] Set real **opening hours** (`business.hours`, currently "Termine nach Vereinbarung").
- [ ] If the site won't run on `https://fluchers-garage.at/`, update the canonical URL, the
      Open Graph URLs and the JSON-LD in `index.html`, plus `public/robots.txt` and
      `public/sitemap.xml`.

## Assets

Originals are in `assets-src/`; the processed files in `public/` are committed, so you
only need these scripts when replacing a source file.

| Output | Script | Notes |
| --- | --- | --- |
| `public/sequence/*.webp` + `manifest.json` | `python3 scripts/extract-frames.py` | Frames 40–238 of `sherco-rollin.mp4`. The background is lifted to pure white and the bottom edge fades out, so the canvas can use `mix-blend-mode: multiply` without visible edges. The manifest holds the bike's bounding box per frame; the hero uses it for layout and for the headline reveal. Needs Pillow, numpy and ffmpeg (`pip install pillow numpy imageio-ffmpeg`). |
| `public/img/*` (photos, icons) | `npm run assets:images` | AVIF + WebP in two widths, via sharp. |
| `assets-src/sherco-sm-50-cutout.png` | – | Background removed with [rembg](https://github.com/danielgatis/rembg) (`birefnet-general` model). |
| `public/img/og-image.jpg` | `node scripts/make-og-image.cjs` | Share preview (1200 × 630), rendered from `scripts/og-image.html` with Playwright. |

## Tech notes

- **Fonts** are self-hosted through Fontsource, so no requests go to Google (GDPR):
  *Anybody* (variable width 50–150 %, the livery headlines), *Barlow* (body text) and
  *Great Vibes* (wordmark only).
- The **logo mark** is a vector redraw of the Facebook avatar (`src/components/Logo.jsx`).
  The "F" outline is the Great Vibes glyph converted to a path (`src/brand/fPath.js`).
- **Motion:** Motion (`motion/react`, loaded through `LazyMotion`) handles scroll-linked
  values and reveals; Lenis provides smooth wheel scrolling.
- The **hero sequence** loads key frames first, then fills in coarse-to-fine, and always
  draws the nearest decoded frame. Phones load every second frame.
- Design tokens (colours, type scale, spacing) are in `src/styles/tokens.css`.

```
src/
  App.jsx               page assembly, intro/door coordination
  content.js            ← all texts and business data
  hero/                 canvas frame player + hero section
  sections/             Services, Detailing, Sherco, Fluids, Story, Contact
  components/           header, footer, logo, slider, gauge, bottles, map, dialogs …
  lib/                  smooth-scroll provider, legal-dialog events
  styles/               tokens + base styles
scripts/                asset pipeline (frames, images, share image)
assets-src/             original photos and video
```
