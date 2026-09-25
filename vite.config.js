import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  // Relative asset URLs: the build works from a domain root and from a subfolder.
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    // `vite build --mode embed` inlines the fonts into the CSS, for hosts that
    // only serve the page and a few files (used for the shareable preview).
    assetsInlineLimit: mode === 'embed' ? 250_000 : 4096,
    outDir: mode === 'embed' ? 'dist-embed' : 'dist',
  },
}))
