import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { COLLECTION } from '../data/content'

/**
 * Pin-lənmiş "kolleksiya" səhnəsi: scroll ilə 5 xətt bir-birini əvəz edir.
 * Fon rəngi, arxadakı nəhəng söz, şüşələr və mətn eyni timeline-da dəyişir.
 */
export default function Collection() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const slides = gsap.utils.toArray<HTMLElement>('.col-slide')
      const words = gsap.utils.toArray<HTMLElement>('.col-word')
      const dots = gsap.utils.toArray<HTMLElement>('.col-dot')
      const n = slides.length

      gsap.set(slides.slice(1), { autoAlpha: 0 })
      gsap.set(words.slice(1), { autoAlpha: 0, yPercent: 30 })
      gsap.set(root.current, { backgroundColor: COLLECTION[0].bg })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * (n - 0.3)}`,
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: { snapTo: 'labelsDirectional', duration: { min: 0.25, max: 0.8 }, delay: 0.08, ease: 'power2.inOut' },
        },
      })

      tl.addLabel('s0')
      for (let i = 1; i < n; i++) {
        const prev = slides[i - 1]
        const cur = slides[i]
        const at = `t${i}`
        tl.addLabel(at, '+=0.35')
          .to(prev.querySelector('.col-bottles'), { yPercent: -35, rotate: -8, scale: 0.9, autoAlpha: 0, duration: 0.6 }, at)
          .to(prev.querySelectorAll('.col-text > *'), { y: -40, autoAlpha: 0, stagger: 0.04, duration: 0.4 }, at)
          .to(words[i - 1], { yPercent: -30, autoAlpha: 0, duration: 0.6 }, at)
          .to(root.current, { backgroundColor: COLLECTION[i].bg, duration: 0.8 }, at)
          .set(cur, { autoAlpha: 1 }, at)
          // Yeni slayd köhnəsi tam itmədən daxil olur — boş kadr qalmır
          .fromTo(
            cur.querySelector('.col-bottles'),
            { yPercent: 40, rotate: 10, scale: 0.9, autoAlpha: 0 },
            { yPercent: 0, rotate: 0, scale: 1, autoAlpha: 1, duration: 0.7, ease: 'power3.out' },
            `${at}+=0.25`,
          )
          .fromTo(
            cur.querySelectorAll('.col-text > *'),
            { y: 50, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.5, ease: 'power3.out' },
            `${at}+=0.35`,
          )
          .fromTo(words[i], { yPercent: 30, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6 }, `${at}+=0.25`)
          .to(dots[i - 1], { scale: 1, opacity: 0.35, duration: 0.2 }, `${at}+=0.25`)
          .to(dots[i], { scale: 1.6, opacity: 1, duration: 0.2 }, `${at}+=0.25`)
          .set(prev, { autoAlpha: 0 }, `${at}+=0.6`)
          .addLabel(`s${i}`, `${at}+=0.95`)
      }
      tl.to({}, { duration: 0.35 })

      // Şüşələrin mouse ilə yüngül hərəkəti
      const stage = root.current!.querySelector<HTMLElement>('.col-stage')!
      const rx = gsap.quickTo('.col-float', 'rotationY', { duration: 0.8, ease: 'power3.out' })
      const ry = gsap.quickTo('.col-float', 'rotationX', { duration: 0.8, ease: 'power3.out' })
      const onMove = (e: PointerEvent) => {
        const r = stage.getBoundingClientRect()
        rx(((e.clientX - r.left) / r.width - 0.5) * 16)
        ry(-((e.clientY - r.top) / r.height - 0.5) * 10)
      }
      stage.addEventListener('pointermove', onMove)
      return () => stage.removeEventListener('pointermove', onMove)
    },
    { scope: root },
  )

  return (
    <section className="collection" ref={root} id="kolleksiya" aria-label="Sirab kolleksiyası">
      <div className="col-words" aria-hidden="true">
        {COLLECTION.map((c) => (
          <span className="col-word" key={c.key}>
            {c.word}
          </span>
        ))}
      </div>

      <div className="col-stage">
        {COLLECTION.map((c, i) => (
          <article className="col-slide" key={c.key}>
            <div className="col-text">
              <span className="eyebrow">
                Kolleksiya · {String(i + 1).padStart(2, '0')}/{String(COLLECTION.length).padStart(2, '0')}
              </span>
              <h2>{c.title}</h2>
              <p>{c.text}</p>
            </div>
            <div className="col-bottles">
              <div className="col-float">
                <img src={c.img} alt={c.title} decoding="async" />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="col-dots" aria-hidden="true">
        {COLLECTION.map((c, i) => (
          <span className="col-dot" key={c.key} style={i === 0 ? { transform: 'scale(1.6)', opacity: 1 } : undefined} />
        ))}
      </div>
    </section>
  )
}
