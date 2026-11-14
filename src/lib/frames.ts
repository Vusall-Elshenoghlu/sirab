/**
 * 4 videodan çıxarılmış ardıcıl kadrlar (public/media/film/{d,m}/0001.webp … 0479.webp).
 * Sıra: İlandağ → şəlalə → su kürəsi → su burulğanı → Sirab şüşəsi.
 *
 * Yükləmə prioriteti: əvvəl hər N-ci kadr ("skelet"), sonra aradakılar.
 * Beləliklə scroll dərhal işləyir, keyfiyyət isə arxa planda tamamlanır.
 */

export const FRAME_COUNT = 479
/** Hər videonun kadr aralığı (0-dan başlayan indekslər) — public/media/film/meta.json */
export const CHAPTER_FRAMES: [number, number][] = [
  [0, 120], // 1 — dağ → şəlalə
  [121, 240], // 2 — şəlalə → su kürəsi
  [241, 359], // 3 — kürə → burulğan
  [360, 478], // 4 — burulğan → şüşə (16:9)
]
/**
 * 4-cü video 16:9-dur; ilk 3 video onun mərkəzi kvadratıdır.
 * Kvadrat kadr = 960px. Geniş kadrda bu kvadrat x=squareX-dən başlayır (miqyas = scale).
 * Bu ədədlər SIFT ilə ölçülüb — keçid piksel dəqiqliyindədir.
 */
export const WIDE_START = 360
export const WIDE = { scale: 1.33078, squareX: 371.56, squareY: -0.68 }
export const SQUARE = 960

const base = import.meta.env.BASE_URL
const set =
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px), (max-height: 520px)').matches ? 'm' : 'd'
/** Mobil üçün yüngül dəst (576px), desktop üçün tam keyfiyyət (960px) */
export const FRAME_SCALE = set === 'm' ? 0.6 : 1
export const frameUrl = (i: number) => `${base}media/film/${set}/${String(i + 1).padStart(4, '0')}.webp`

type Listener = (loaded: number, criticalLoaded: number, criticalTotal: number) => void

class FrameStore {
  images: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null)
  private started = false
  private listeners = new Set<Listener>()
  private loaded = 0
  private critical = new Set<number>()
  private criticalLoaded = 0

  start() {
    if (this.started) return
    this.started = true

    // Kritik dəst: ilk 12 kadr + hər 8-ci kadr + son kadr
    const order: number[] = []
    const push = (i: number) => {
      if (i >= 0 && i < FRAME_COUNT && !order.includes(i)) order.push(i)
    }
    for (let i = 0; i < 12; i++) push(i)
    for (let i = 0; i < FRAME_COUNT; i += 8) push(i)
    push(FRAME_COUNT - 1)
    order.forEach((i) => this.critical.add(i))
    // Sonra addımları kiçildərək doldururuq
    for (const step of [4, 2, 1]) for (let i = 0; i < FRAME_COUNT; i += step) push(i)

    // Paralel 6 axın
    let cursor = 0
    const next = () => {
      if (cursor >= order.length) return
      const idx = order[cursor++]
      const img = new Image()
      img.decoding = 'async'
      img.src = frameUrl(idx)
      const done = (ok: boolean) => {
        if (ok) this.images[idx] = img
        this.loaded++
        if (this.critical.has(idx)) this.criticalLoaded++
        this.emit()
        next()
      }
      img.onload = () => {
        // decode() — scroll zamanı ilk çəkilişdə takılmanın qarşısını alır
        if ('decode' in img) img.decode().then(() => done(true), () => done(true))
        else done(true)
      }
      img.onerror = () => done(false)
    }
    for (let k = 0; k < 6; k++) next()
  }

  /** İstənilən kadrın ən yaxın yüklənmiş variantı */
  nearest(i: number): HTMLImageElement | null {
    if (this.images[i]) return this.images[i]
    for (let d = 1; d < FRAME_COUNT; d++) {
      const a = this.images[i - d]
      if (a) return a
      const b = this.images[i + d]
      if (b) return b
    }
    return null
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn)
    fn(this.loaded, this.criticalLoaded, this.critical.size || 1)
    return () => {
      this.listeners.delete(fn)
    }
  }

  private emit() {
    this.listeners.forEach((fn) => fn(this.loaded, this.criticalLoaded, this.critical.size))
  }
}

export const frames = new FrameStore()
