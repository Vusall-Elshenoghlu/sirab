import { useLayoutEffect, useRef, useState } from 'react'
import { Flip, gsap, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap'
import { CATEGORIES, PRODUCTS, type CategoryId } from '../data/content'

type Filter = 'all' | CategoryId

export default function Products() {
  const root = useRef<HTMLElement>(null)
  const grid = useRef<HTMLDivElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const [filter, setFilter] = useState<Filter>('all')

  const visible = (cat: CategoryId) => filter === 'all' || filter === cat
  const count = PRODUCTS.filter((p) => visible(p.cat)).length

  const choose = (f: Filter) => {
    if (f === filter) return
    // Görünmə animasiyalarını dayandır ki, gizli kartlar şəffaf qalmasın
    ScrollTrigger.getAll().forEach((st) => {
      if (String(st.vars.id ?? '').startsWith('pcard')) st.kill()
    })
    gsap.killTweensOf('.p-card')
    gsap.set('.p-card', { opacity: 1, y: 0 })
    flipState.current = Flip.getState('.p-card')
    setFilter(f)
  }

  // Filtr dəyişəndə — GSAP Flip ilə kartlar yeni yerlərinə axır
  useLayoutEffect(() => {
    if (!flipState.current) return
    Flip.from(flipState.current, {
      duration: 0.8,
      ease: 'power3.inOut',
      scale: true,
      absolute: true,
      stagger: 0.015,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.03 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.4 }),
      onComplete: () => ScrollTrigger.refresh(),
    })
    flipState.current = null
  }, [filter])

  useGSAP(
    () => {
      const split = SplitText.create('.products-head h2', { type: 'lines', mask: 'lines' })
      gsap.from(split.lines, {
        yPercent: 105,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.products-head', start: 'top 80%' },
      })
      gsap.from('.p-tabs button', {
        y: 20,
        opacity: 0,
        stagger: 0.05,
        scrollTrigger: { trigger: '.p-tabs', start: 'top 90%' },
      })
      gsap.utils.toArray<HTMLElement>('.p-card').forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 1.1,
          delay: (i % 4) * 0.07,
          ease: 'expo.out',
          scrollTrigger: { id: `pcard-${i}`, trigger: card, start: 'top 95%', once: true },
        })
      })
      return () => split.revert()
    },
    { scope: root },
  )

  // 3D əyilmə + şüşənin yüngül hərəkəti
  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse') return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    gsap.to(el, { rotationY: px * 10, rotationX: -py * 10, duration: 0.6, ease: 'power3.out', transformPerspective: 900 })
    gsap.to(el.querySelector('.p-img'), { x: px * 18, y: py * 10 - 10, duration: 0.6, ease: 'power3.out' })
    el.style.setProperty('--gx', `${(px + 0.5) * 100}%`)
    el.style.setProperty('--gy', `${(py + 0.5) * 100}%`)
  }
  const onLeave = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    gsap.to(el, { rotationY: 0, rotationX: 0, duration: 0.9, ease: 'elastic.out(1, 0.6)' })
    gsap.to(el.querySelector('.p-img'), { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.6)' })
  }

  return (
    <section className="products" ref={root} id="mehsullar">
      <div className="wrap">
        <div className="products-head">
          <div>
            <span className="eyebrow">Məhsullar</span>
            <h2>
              0.2 litrdən <em>19 litrə</em> qədər
            </h2>
          </div>
          <p className="lead">
            Altı məhsul qrupu, şüşə və plastik qablaşdırma. Ətraflı məlumat üçün karta klikləyin.
          </p>
        </div>

        <div className="p-tabs" role="tablist" aria-label="Məhsul qrupları">
          <button role="tab" aria-selected={filter === 'all'} className={filter === 'all' ? 'is-active' : ''} onClick={() => choose('all')}>
            Hamısı <sup>{PRODUCTS.length}</sup>
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={filter === c.id}
              className={filter === c.id ? 'is-active' : ''}
              onClick={() => choose(c.id)}
            >
              {c.label} <sup>{PRODUCTS.filter((p) => p.cat === c.id).length}</sup>
            </button>
          ))}
        </div>
        <p className="p-count" aria-live="polite">
          {count} məhsul
        </p>

        <div className="p-grid" ref={grid}>
          {PRODUCTS.map((p) => (
            <a
              key={p.id}
              data-flip-id={p.id}
              className={`p-card tone-${p.tone}`}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              hidden={!visible(p.cat)}
              onPointerMove={onMove}
              onPointerLeave={onLeave}
            >
              <span className="p-glow" aria-hidden="true" />
              <span className="p-meta">
                <span className="p-pack">{p.pack}</span>
                <span className="p-kind">{p.kind}</span>
              </span>
              <img className="p-img" src={p.img} alt={`Sirab ${p.volume} ${p.kind}, ${p.pack.toLowerCase()} qablaşdırma`} loading="lazy" />
              <span className="p-foot">
                <span className="p-vol">{p.volume}</span>
                <span className="p-arrow" aria-hidden="true">↗</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
