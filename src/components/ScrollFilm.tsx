import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap'
import { CHAPTER_FRAMES, FRAME_COUNT, FRAME_SCALE, SQUARE, WIDE, WIDE_START, frames } from '../lib/frames'
import { media } from '../data/content'
import { scrollToTarget } from '../lib/smoothScroll'

const CHAPTERS = [
  { n: '01', label: 'Dağ' },
  { n: '02', label: 'Qaynaq' },
  { n: '03', label: 'Damla' },
  { n: '04', label: 'Sirab' },
]

const LAST = FRAME_COUNT - 1
const t = (frame: number) => frame / LAST
/** 4-cü videonun yan hissələri bu qədər kadr ərzində bulanıqdan aydına keçir */
const SIDE_RAMP = 18

type Rect = { x: number; y: number; w: number; h: number }

/**
 * Kvadrat kadrın ekrandakı yeri.
 * Landşaft: tam hündürlük — dağın zirvəsi də, aşağıdakı su yolu da tam görünür.
 * Portret: eni bir az aşan kvadrat, mətn üçün aşağıda yer qalır.
 */
function squareRect(cw: number, ch: number): Rect {
  if (cw >= ch) {
    const size = ch
    return { x: (cw - size) / 2, y: 0, w: size, h: size }
  }
  const size = Math.min(cw * 1.22, ch * 0.66)
  return { x: (cw - size) / 2, y: ch * 0.4 - size / 2, w: size, h: size }
}

/** Kənarları yumşaq keçidli maska (yalnız ekranın içində qalan kənarlar üçün) */
const maskCache = new Map<string, HTMLCanvasElement>()
function featherMask(w: number, h: number, edges: [boolean, boolean, boolean, boolean], f: number) {
  const key = `${w}x${h}:${edges.join('')}:${f}`
  let m = maskCache.get(key)
  if (m) return m
  m = document.createElement('canvas')
  m.width = w
  m.height = h
  const c = m.getContext('2d')!
  c.fillStyle = '#000'
  c.fillRect(0, 0, w, h)
  c.globalCompositeOperation = 'destination-in'
  const ramp = (g: CanvasGradient, from: number, to: number, total: number) => {
    // smoothstep pilləsi
    for (let i = 0; i <= 8; i++) {
      const p = i / 8
      const a = p * p * (3 - 2 * p)
      g.addColorStop(Math.min(1, Math.max(0, (from + (to - from) * p) / total)), `rgba(0,0,0,${a})`)
    }
  }
  const [l, tp, r, b] = edges
  if (l) {
    const g = c.createLinearGradient(0, 0, w, 0)
    ramp(g, 0, f, w)
    g.addColorStop(1, '#000')
    c.fillStyle = g
    c.fillRect(0, 0, w, h)
  }
  if (r) {
    const g = c.createLinearGradient(w, 0, 0, 0)
    ramp(g, 0, f, w)
    g.addColorStop(1, '#000')
    c.fillStyle = g
    c.fillRect(0, 0, w, h)
  }
  if (tp) {
    const g = c.createLinearGradient(0, 0, 0, h)
    ramp(g, 0, f, h)
    g.addColorStop(1, '#000')
    c.fillStyle = g
    c.fillRect(0, 0, w, h)
  }
  if (b) {
    const g = c.createLinearGradient(0, h, 0, 0)
    ramp(g, 0, f, h)
    g.addColorStop(1, '#000')
    c.fillStyle = g
    c.fillRect(0, 0, w, h)
  }
  if (maskCache.size > 24) maskCache.clear()
  maskCache.set(key, m)
  return m
}

const mk = () => (typeof document !== 'undefined' ? document.createElement('canvas') : null)
const off = mk()
const tiny = mk()
const mid = mk()
const mid2 = mk()

/**
 * Kadrdan kənarda qalan sahə üçün fon: kadrın kənar pikselləri ekranın kənarına qədər
 * uzadılır, sonra iki pilləli kiçiltmə/böyütmə ilə yumşaq bulanıqlaşdırılır.
 * Nəticədə kadrla fon arasında rəng davamlılığı qalır.
 */
function drawBackdrop(ctx: CanvasRenderingContext2D, img: HTMLImageElement, dst: Rect, cw: number, ch: number) {
  if (!tiny || !mid || !mid2) return
  const tw = 36
  const th = Math.max(2, Math.round((tw * ch) / cw))
  if (tiny.width !== tw || tiny.height !== th) {
    tiny.width = tw
    tiny.height = th
  }
  const t = tiny.getContext('2d')!
  const fx = tw / cw
  const fy = th / ch
  const d = { x: dst.x * fx, y: dst.y * fy, w: dst.w * fx, h: dst.h * fy }
  const iw = img.naturalWidth
  const ih = img.naturalHeight
  t.globalCompositeOperation = 'source-over'
  t.imageSmoothingQuality = 'high'
  // əsas örtük (künclər üçün)
  const sc = Math.max(tw / iw, th / ih) * 1.1
  t.drawImage(img, (tw - iw * sc) / 2, (th - ih * sc) / 2, iw * sc, ih * sc)
  // kadrın güzgü əksləri — sərhəddə rəng və faktura eynidir
  const mirror = (sx: number, sy: number, ox: number, oy: number) => {
    t.save()
    t.translate(ox, oy)
    t.scale(sx, sy)
    t.drawImage(img, 0, 0, d.w, d.h)
    t.restore()
  }
  if (d.x > 0) mirror(-1, 1, d.x, d.y)
  if (d.x + d.w < tw) mirror(-1, 1, d.x + 2 * d.w, d.y)
  if (d.y > 0) mirror(1, -1, d.x, d.y)
  if (d.y + d.h < th) mirror(1, -1, d.x, d.y + 2 * d.h)
  t.drawImage(img, d.x, d.y, d.w, d.h)

  // pilləli böyütmə — blok və zolaq artefaktları olmadan yumşaq bulanıqlıq
  const step = (src: HTMLCanvasElement, dstC: HTMLCanvasElement, div: number) => {
    const w = Math.max(2, Math.round(cw / div))
    const h = Math.max(2, Math.round(ch / div))
    if (dstC.width !== w || dstC.height !== h) {
      dstC.width = w
      dstC.height = h
    }
    const c = dstC.getContext('2d')!
    c.imageSmoothingQuality = 'high'
    c.globalCompositeOperation = 'copy'
    c.drawImage(src, 0, 0, w, h)
  }
  step(tiny, mid2, 16)
  step(mid2, mid, 5)
  ctx.globalCompositeOperation = 'source-over'
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(mid, 0, 0, cw, ch)
  ctx.fillStyle = 'rgba(6, 18, 25, 0.28)'
  ctx.fillRect(0, 0, cw, ch)
}

/** Şəkli dst düzbucağına çəkir; ekranın içində qalan kənarları yumşaq "əriyir". */
function drawFeathered(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  src: Rect,
  dst: Rect,
  cw: number,
  ch: number,
  alpha = 1,
) {
  const x0 = Math.max(0, dst.x)
  const y0 = Math.max(0, dst.y)
  const x1 = Math.min(cw, dst.x + dst.w)
  const y1 = Math.min(ch, dst.y + dst.h)
  if (x1 <= x0 || y1 <= y0 || alpha <= 0) return
  const kx = src.w / dst.w
  const ky = src.h / dst.h
  const sx = src.x + (x0 - dst.x) * kx
  const sy = src.y + (y0 - dst.y) * ky
  const sw = (x1 - x0) * kx
  const sh = (y1 - y0) * ky
  const vw = Math.round(x1 - x0)
  const vh = Math.round(y1 - y0)
  const edges: [boolean, boolean, boolean, boolean] = [dst.x > 1, dst.y > 1, dst.x + dst.w < cw - 1, dst.y + dst.h < ch - 1]
  ctx.globalAlpha = alpha
  if (!edges.some(Boolean) || !off) {
    ctx.drawImage(img, sx, sy, sw, sh, x0, y0, vw, vh)
    ctx.globalAlpha = 1
    return
  }
  if (off.width !== vw || off.height !== vh) {
    off.width = vw
    off.height = vh
  }
  const o = off.getContext('2d')!
  o.globalCompositeOperation = 'copy'
  o.imageSmoothingQuality = 'high'
  o.drawImage(img, sx, sy, sw, sh, 0, 0, vw, vh)
  o.globalCompositeOperation = 'destination-in'
  o.drawImage(featherMask(vw, vh, edges, Math.round(Math.min(vw, vh) * 0.17)), 0, 0)
  o.globalCompositeOperation = 'source-over'
  ctx.drawImage(off, x0, y0)
  ctx.globalAlpha = 1
}

/**
 * Dörd video bir-birinin ardınca, scroll ilə kadr-kadr oynadılır (canvas).
 * Videolar arasındakı keçidlər kadr səviyyəsində tikilib (bax: tools/build_frames.py).
 * Mətn fəsilləri və fəsil göstəricisi eyni GSAP timeline-a bağlıdır.
 */
export default function ScrollFilm({ ready }: { ready: boolean }) {
  const section = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const state = useRef({ frame: 0, drawn: -1, drawnImg: null as HTMLImageElement | null })

  // --- Canvas çəkilişi ---
  // 1) fon: kadrın çox kiçik versiyası tam ekrana yayılır (təbii bulanıqlıq)
  // 2) kadr özü: kəsilmədən, kənarları fona əriyərək
  // 3) 4-cü video: kvadratın davamı olan yan hissələr tədricən aydınlaşır
  const render = useRef(() => {})
  render.current = () => {
    const c = canvas.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const idx = Math.round(state.current.frame)
    const img = frames.nearest(idx)
    if (!img) return
    if (state.current.drawn === idx && state.current.drawnImg === img) return
    state.current.drawn = idx
    state.current.drawnImg = img

    const cw = c.width
    const ch = c.height
    const iw = img.naturalWidth
    const ih = img.naturalHeight
    const wide = iw > ih * 1.2
    const sq = squareRect(cw, ch)
    const k = sq.w / SQUARE // kvadrat-piksel → ekran-piksel

    // Kadrın ekran düzbucağı
    const dst: Rect = wide
      ? {
          x: sq.x - WIDE.squareX * k,
          y: sq.y - WIDE.squareY * k,
          w: ((iw / FRAME_SCALE) * WIDE.scale) * k,
          h: ((ih / FRAME_SCALE) * WIDE.scale) * k,
        }
      : sq

    // 1) Bulanıq fon
    drawBackdrop(ctx, img, dst, cw, ch)

    // 2–3) Kadr
    const full: Rect = { x: 0, y: 0, w: iw, h: ih }
    if (!wide) {
      drawFeathered(ctx, img, full, dst, cw, ch)
      return
    }
    const ramp = Math.min(1, Math.max(0, (idx - WIDE_START) / SIDE_RAMP))
    if (ramp >= 1) {
      drawFeathered(ctx, img, full, dst, cw, ch)
      return
    }
    // Yan hissələr tədricən görünür, mərkəz (əvvəlki videonun davamı) həmişə tam aydındır
    drawFeathered(ctx, img, full, dst, cw, ch, ramp)
    const sPerSrc = FRAME_SCALE / WIDE.scale // kvadrat-piksel → mənbə-piksel
    const srcSq: Rect = {
      x: WIDE.squareX * sPerSrc,
      y: WIDE.squareY * sPerSrc,
      w: SQUARE * sPerSrc,
      h: SQUARE * sPerSrc,
    }
    drawFeathered(ctx, img, srcSq, sq, cw, ch)
  }

  // Ölçü dəyişəndə canvas-ı yenilə
  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      c.width = Math.round(c.clientWidth * dpr)
      c.height = Math.round(c.clientHeight * dpr)
      const ctx = c.getContext('2d')
      if (ctx) {
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
      }
      state.current.drawn = -1
      render.current()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(c)
    // Yeni kadr yüklənəndə (daha dəqiq versiya gəlibsə) yenidən çək
    const unsub = frames.subscribe(() => render.current())
    return () => {
      ro.disconnect()
      unsub()
    }
  }, [])

  // --- Scroll timeline ---
  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 6.5}`,
          pin: '.film-stage',
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Kadrlar
      tl.to(state.current, { frame: LAST, duration: 1, onUpdate: () => render.current() }, 0)

      // Fəsil göstəricisi
      const fills = gsap.utils.toArray<HTMLElement>('.rail-fill')
      CHAPTER_FRAMES.forEach(([a, b], i) => {
        tl.fromTo(fills[i], { scaleY: 0 }, { scaleY: 1, duration: t(b) - t(a) }, t(a))
        tl.set(`.rail-item:nth-child(${i + 1})`, { className: 'rail-item is-active' }, t(a))
        if (i > 0) tl.set(`.rail-item:nth-child(${i})`, { className: 'rail-item is-done' }, t(a))
      })

      // Fəsil 1 — çıxış
      tl.to('.chap-1 .chap-inner', { yPercent: -18, opacity: 0, duration: 0.09, ease: 'power1.in' }, 0.05)
      tl.to('.film-hint', { opacity: 0, duration: 0.03 }, 0.01)

      // Fəsil 2, 3 — giriş / çıxış
      const inOut = (sel: string, tin: number, tout: number) => {
        tl.fromTo(
          `${sel} .reveal`,
          { yPercent: 60, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.06, stagger: 0.012, ease: 'power2.out' },
          tin,
        )
        tl.to(`${sel} .reveal`, { yPercent: -40, opacity: 0, duration: 0.05, stagger: 0.006, ease: 'power1.in' }, tout)
      }
      inOut('.chap-2', 0.17, 0.4)
      inOut('.chap-3', 0.53, 0.69)

      // Fəsil 4 — final
      tl.fromTo('.film-shade-final', { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.86)
      tl.fromTo(
        '.chap-4 .reveal',
        { yPercent: 50, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.07, stagger: 0.012, ease: 'power2.out' },
        0.88,
      )
      tl.to({}, { duration: 0.04 }) // final kadrda kiçik pauza
    },
    { scope: section },
  )

  // Hero mətninin ilk girişi (preloader bitəndən sonra)
  useGSAP(
    () => {
      if (!ready) return
      const split = SplitText.create('.chap-1 h1', { type: 'lines,words', mask: 'lines' })
      gsap
        .timeline({ delay: 0.15 })
        .from('.film-canvas', { scale: 1.12, duration: 2.4, ease: 'expo.out' }, 0)
        .from(split.words, { yPercent: 110, duration: 1.3, stagger: 0.05, ease: 'expo.out' }, 0.2)
        .from('.chap-1 .eyebrow, .chap-1 p, .film-rail, .film-hint', { opacity: 0, y: 20, duration: 1, stagger: 0.1 }, 0.6)
      return () => split.revert()
    },
    { scope: section, dependencies: [ready] },
  )

  // ScrollTrigger-in ölçüləri preloader-dan sonra
  useEffect(() => {
    if (ready) ScrollTrigger.refresh()
  }, [ready])

  return (
    <section id="film" className="film" ref={section} aria-label="Sirab: dağdan şüşəyə">
      <div className="film-stage">
        <canvas className="film-canvas" ref={canvas} aria-hidden="true" />
        <div className="film-shade" aria-hidden="true" />
        <div className="film-shade-final" aria-hidden="true" />

        <div className="chap chap-1">
          <div className="chap-inner">
            <span className="eyebrow">Naxçıvan · İlandağ · 1950-dən bəri</span>
            <h1>
              Dağın ürəyindən <em>süzülən</em> su
            </h1>
            <p>Kəlbəağıl vadisindən süfrənizə — 75 ildir eyni mənbə, eyni saflıq.</p>
          </div>
        </div>

        <div className="chap chap-2">
          <div className="chap-inner">
            <span className="eyebrow reveal">Kəlbəağıl vadisi · 1257.80 m</span>
            <h2 className="reveal">Qaynaq daşların arasından keçir</h2>
            <p className="reveal">
              Naxçıvan şəhərindən 14.6 km şimal-şərqdə, Babək rayonunun Sirab kəndində su öz təbii yolunu davam
              etdirir.
            </p>
          </div>
        </div>

        <div className="chap chap-3">
          <div className="chap-inner">
            <span className="eyebrow reveal">pH 7.4</span>
            <h2 className="reveal">
              Hər damlada <em>bir dağ</em>
            </h2>
            <p className="reveal">Dağların yaddaşı suyun tərkibində qalır: hidrokarbonat, kalsium, maqnezium — təbii nisbətdə.</p>
          </div>
        </div>

        <div className="chap chap-4">
          <div className="chap-inner">
            <img className="reveal chap-logo" src={media('site/logo-white.svg')} alt="Sirab 1950" width={420} height={150} />
            <p className="reveal">Azərbaycanın sevimli suyu. 15-dən çox ölkəyə ixrac olunur.</p>
            <div className="reveal chap-actions">
              <a href="#mehsullar" className="btn btn-light" onClick={(e) => { e.preventDefault(); scrollToTarget('#mehsullar') }}>
                Məhsullara bax
              </a>
              <a href="#terkib" className="btn btn-ghost" onClick={(e) => { e.preventDefault(); scrollToTarget('#terkib') }}>
                Mineral tərkib
              </a>
            </div>
          </div>
        </div>

        <ol className="film-rail" aria-hidden="true">
          {CHAPTERS.map((c, i) => (
            <li key={c.n} className={`rail-item ${i === 0 ? 'is-active' : ''}`}>
              <span className="rail-n">{c.n}</span>
              <span className="rail-track">
                <span className="rail-fill" />
              </span>
              <span className="rail-label">{c.label}</span>
            </li>
          ))}
        </ol>

        <div className="film-hint" aria-hidden="true">
          <span>Aşağı sürüşdürün</span>
          <i />
        </div>
      </div>
    </section>
  )
}
