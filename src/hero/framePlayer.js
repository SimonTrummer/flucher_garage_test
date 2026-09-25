// Draws the hero image sequence onto a canvas.
//
// Frames are loaded in priority order (first/last key frames, then the
// roll-in, then the scroll part from coarse to fine) and the player always
// draws the nearest frame that is already decoded, so scrubbing works long
// before everything has arrived.

export const INTRO_END = 60 // frames 0..60: the bike rolls in; 60..end: it turns to the camera

const MAX_PARALLEL = 6

export function createFramePlayer({ canvas, baseUrl, manifest, sparse = false }) {
  const { count } = manifest
  const images = new Array(count).fill(null)
  const state = new Uint8Array(count) // 0 idle · 1 loading · 2 ready · 3 failed
  const waiters = new Set()
  const ctx = canvas.getContext('2d', { alpha: true })
  const stride = sparse ? 2 : 1

  let geometry = null // frame rect in CSS pixels
  let dpr = 1
  let wanted = 0
  let drawn = -1
  let raf = 0
  let destroyed = false
  let queue = []
  let inflight = 0
  let loadedCount = 0

  const snap = (i) => Math.min(count - 1, Math.max(0, Math.round(i / stride) * stride))
  const src = (i) => `${baseUrl}sequence/${String(i).padStart(3, '0')}.webp`

  function buildQueue() {
    const seen = new Set()
    const order = []
    const push = (i) => {
      const s = snap(i)
      if (!seen.has(s)) {
        seen.add(s)
        order.push(s)
      }
    }
    push(0)
    push(INTRO_END)
    push(count - 1)
    for (let i = 0; i <= INTRO_END; i += 2) push(i)
    for (const step of [16, 8, 4, 2, 1]) {
      for (let i = INTRO_END; i < count; i += step) push(i)
    }
    for (let i = 1; i <= INTRO_END; i += 1) push(i)
    return order
  }

  function pump() {
    while (!destroyed && inflight < MAX_PARALLEL && queue.length) {
      const i = queue.shift()
      if (state[i]) continue
      state[i] = 1
      inflight += 1
      const img = new Image()
      img.decoding = 'async'
      img.src = src(i)
      img
        .decode()
        .then(() => {
          images[i] = img
          state[i] = 2
        })
        .catch(() => {
          state[i] = 3
        })
        .finally(() => {
          inflight -= 1
          loadedCount += 1
          if (destroyed) return
          notify()
          request()
          pump()
        })
    }
  }

  function notify() {
    for (const w of waiters) {
      if (w.frames.every((f) => state[f] >= 2)) {
        waiters.delete(w)
        w.resolve()
      } else {
        w.progress?.(w.frames.filter((f) => state[f] >= 2).length / w.frames.length)
      }
    }
  }

  function nearestReady(target) {
    if (state[target] === 2) return target
    for (let d = 1; d < count; d += 1) {
      const a = target - d
      const b = target + d
      if (a >= 0 && state[a] === 2) return a
      if (b < count && state[b] === 2) return b
    }
    return -1
  }

  function render() {
    raf = 0
    if (!geometry || destroyed) return
    const index = nearestReady(wanted)
    if (index < 0 || index === drawn) return
    const { x, y, w, h } = geometry
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(images[index], x * dpr, y * dpr, w * dpr, h * dpr)
    drawn = index
  }

  function request() {
    if (!raf && !destroyed) raf = requestAnimationFrame(render)
  }

  return {
    count,
    start() {
      queue = buildQueue()
      pump()
    },
    /** Resolves once all of the given frames are decoded. */
    whenReady(frames, progress) {
      const list = [...new Set(frames.map(snap))]
      if (list.every((f) => state[f] >= 2)) return Promise.resolve()
      return new Promise((resolve) => waiters.add({ frames: list, resolve, progress }))
    },
    introFrames() {
      const list = []
      for (let i = 0; i <= INTRO_END; i += 2) list.push(i)
      return list
    },
    show(index) {
      wanted = snap(index)
      request()
    },
    /** Sets the canvas size and where the 16:9 frame sits inside it (CSS px). */
    resize(width, height, rect) {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      geometry = rect
      drawn = -1
      request()
    },
    /** Bike bounding box of a frame, in CSS px relative to the canvas. */
    bikeBox(index) {
      if (!geometry) return null
      const box = manifest.bbox?.[Math.min(count - 1, Math.max(0, Math.round(index)))]
      if (!box) return null
      const { x, y, w, h } = geometry
      return { left: x + box[0] * w, top: y + box[1] * h, right: x + box[2] * w, bottom: y + box[3] * h }
    },
    get loaded() {
      return loadedCount
    },
    destroy() {
      destroyed = true
      cancelAnimationFrame(raf)
      waiters.clear()
      queue = []
    },
  }
}

/**
 * Where the 16:9 frame goes. The frames have a pure white background and are
 * multiplied onto the studio, so the frame edges are invisible and the frame
 * can be placed freely. It always sits on the bottom edge (its last rows fade
 * to white, so the shadow never ends in a line).
 *
 * `text` is the hero text block in stage pixels ({ right, bottom }): on wide
 * screens the bike stands to the right of it, on tall screens below it.
 *
 * Bike bounding boxes in frame units: at rest (frame 60) x 0.29–0.62,
 * y 0.20–0.82; largest (frame ~160) x 0.33–0.68, y 0.11–0.95.
 */
export function frameRect(width, height, text, frameRatio = 16 / 9) {
  if (width / height >= 1.12) {
    const textRight = text?.right ?? width * 0.45
    let w = Math.min(height, (width / frameRatio) * 1.3) * frameRatio
    // Rest frame's left edge (0.286) clears the text; largest frame's right edge (0.68) stays on screen.
    const fits = (fw) => textRight + 28 + (0.49 - 0.286) * fw <= width - 24 - (0.68 - 0.49) * fw
    if (!fits(w)) w = Math.max(width * 0.7, (width - 52 - textRight) / (0.204 + 0.19))
    const h = w / frameRatio
    const minCentre = textRight + 28 + 0.204 * w
    const maxCentre = width - 24 - 0.19 * w
    const centre = Math.min(maxCentre, Math.max(width * 0.64, minCentre))
    return { x: centre - 0.49 * w, y: height - h, w, h }
  }
  // Tall screens: the resting bike (top at 0.203) starts below the text.
  const top = (text?.bottom ?? height * 0.45) + 14
  let h = Math.min((width * 2.3) / frameRatio, (height - top) / (1 - 0.203))
  h = Math.max(h, height * 0.42)
  const w = h * frameRatio
  return { x: width / 2 - 0.49 * w, y: height - h, w, h }
}
