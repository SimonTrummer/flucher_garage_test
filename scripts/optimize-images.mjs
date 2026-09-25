// Builds the responsive images in public/img from the originals in assets-src.
// Run with `npm run assets:images` after replacing a photo.
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = (file) => path.join(root, 'assets-src', file)
const out = (file) => path.join(root, 'public', 'img', file)

await mkdir(path.join(root, 'public', 'img'), { recursive: true })

async function photo(input, name, widths) {
  for (const width of widths) {
    const base = sharp(src(input)).resize({ width, withoutEnlargement: true })
    await base
      .clone()
      .avif({ quality: 52, effort: 6 })
      .toFile(out(`${name}-${width}.avif`))
    await base
      .clone()
      .webp({ quality: 78, effort: 6 })
      .toFile(out(`${name}-${width}.webp`))
  }
}

// Before/after pair: identical framing, so both get exactly the same treatment.
await photo('bmw-m2-vorher.jpg', 'bmw-m2-vorher', [1600, 960])
await photo('bmw-m2-nachher.jpg', 'bmw-m2-nachher', [1600, 960])

// Sherco product shot, background removed (see README) and trimmed to the
// bike. The source is only ~550 px wide after trimming, so the page never
// shows it larger than that.
await sharp(src('sherco-sm-50-cutout.png'))
  .trim({ threshold: 1 })
  .webp({ quality: 88, alphaQuality: 92, effort: 6 })
  .toFile(out('sherco-sm-50.webp'))

// Icons from the vector mark.
const mark = path.join(root, 'public', 'favicon.svg')
await sharp(mark, { density: 600 })
  .resize(180, 180)
  .flatten({ background: '#0a0c12' })
  .png()
  .toFile(out('apple-touch-icon.png'))
await sharp(mark, { density: 300 }).resize(32, 32).png().toFile(out('favicon-32.png'))
await sharp(mark, { density: 600 }).resize(512, 512).png().toFile(out('icon-512.png'))

console.log('images written to public/img')
