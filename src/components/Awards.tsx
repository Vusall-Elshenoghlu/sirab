import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { AWARDS, EXPORTS } from '../data/content'

/** Sonsuz marquee: scroll sürətinə və istiqamətinə reaksiya verir. */
export default function Awards() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>('.mq-row')
      const loops = rows.map((row, i) => {
        const inner = row.querySelector<HTMLElement>('.mq-inner')!
        const dir = i % 2 === 0 ? -1 : 1
        gsap.set(inner, { xPercent: dir === -1 ? 0 : -50 })
        return gsap.to(inner, {
          xPercent: dir === -1 ? -50 : 0,
          duration: i === 0 ? 48 : 38,
          ease: 'none',
          repeat: -1,
        })
      })

      let reset: gsap.core.Tween | null = null
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 250)
          const dirMul = self.direction === 1 ? 1 : -1
          loops.forEach((l) => gsap.to(l, { timeScale: (1 + Math.abs(v)) * dirMul, duration: 0.2, overwrite: true }))
          reset?.kill()
          reset = gsap.delayedCall(0.25, () =>
            loops.forEach((l) => gsap.to(l, { timeScale: dirMul, duration: 1.2, ease: 'power2.out', overwrite: true })),
          )
        },
      })

      gsap.from('.awards-head > *', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
    },
    { scope: root },
  )

  const awardRow = [...AWARDS, ...AWARDS]
  const exportRow = [...EXPORTS, ...EXPORTS]

  return (
    <section className="awards" ref={root} aria-label="Mükafatlar və ixrac">
      <div className="wrap awards-head">
        <span className="eyebrow">Mükafatlar</span>
        <h2>
          Cenevrədən Moskvaya, <em>Brüsseldən</em> Astanaya
        </h2>
      </div>

      <div className="mq-row mq-awards">
        <div className="mq-inner">
          {awardRow.map((a, i) => (
            <div className="mq-award" key={i} aria-hidden={i >= AWARDS.length}>
              <span className="mq-year">{a.year}</span>
              <span className="mq-text">
                <strong>{a.name}</strong>
                <span>{a.place}</span>
              </span>
              <span className="mq-sep" aria-hidden="true">✦</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mq-row mq-exports">
        <div className="mq-inner">
          {exportRow.map((c, i) => (
            <span className="mq-country" key={i} aria-hidden={i >= EXPORTS.length}>
              {c}
            </span>
          ))}
        </div>
      </div>
      <p className="wrap awards-note">Sirab 15-dən çox ölkəyə ixrac olunur.</p>
    </section>
  )
}
