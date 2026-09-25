// Renders scripts/og-image.html to public/img/og-image.jpg (1200 × 630).
// Needs Playwright with a Chromium browser: `npx playwright install chromium`
// (skip that step if a Chromium is already set up), then run
// `node scripts/make-og-image.cjs` from the repository root.
const path = require('node:path')
const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await page.goto(`file://${path.resolve(__dirname, 'og-image.html')}`)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
  await page.screenshot({
    path: path.resolve(__dirname, '..', 'public', 'img', 'og-image.jpg'),
    type: 'jpeg',
    quality: 88,
  })
  await browser.close()
  console.log('public/img/og-image.jpg written')
})()
