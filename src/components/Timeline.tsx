import { useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { HISTORY } from '../data/content'

/**
 * Solda "yapışqan" il rəqəmi, sağda hadisələr.
 * Hadisə ekranın ortasına çatanda il rəqəmi rəqəm-rəqəm fırlanır, xətt çəkilir.
 */
export default function Timeline() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      gsap.fromTo(
        '.tl-line-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.tl-list', start: 'top 55%', end: 'bottom 55%', scrub: true },
        },
      )
      gsap.utils.toArray<HTMLElement>('.tl-item').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(i),
        })
        gsap.from(el.querySelectorAll('.tl-item-year, h3, p'), {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 80%' },
        })
      })
      gsap.from('.tl-head > *', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
    },
    { scope: root },
  )

  // İl rəqəmlərinin "odometr" animasiyası
  useGSAP(
    () => {
      const digits = HISTORY[active].year.split('')
      digits.forEach((d, i) => {
        gsap.to(`.odo-col:nth-child(${i + 1}) .odo-strip`, {
          yPercent: -Number(d) * 10,
          duration: 1.1,
          delay: i * 0.06,
          ease: 'expo.out',
        })
      })
    },
    { scope: root, dependencies: [active] },
  )

  return (
    <section className="timeline" ref={root} id="tarix">
      <div className="wrap tl-grid">
        <div className="tl-sticky">
          <div className="tl-head">
            <span className="eyebrow">Tarix</span>
            <h2>75 il, bir mənbə</h2>
          </div>
          <div className="odo" aria-label={`İl ${HISTORY[active].year}`}>
            {[0, 1, 2, 3].map((c) => (
              <span className="odo-col" key={c} aria-hidden="true">
                <span className="odo-strip">
                  {Array.from({ length: 10 }, (_, d) => (
                    <span key={d}>{d}</span>
                  ))}
                </span>
              </span>
            ))}
          </div>
          <p className="tl-active-title">{HISTORY[active].title}</p>
        </div>

        <ol className="tl-list">
          <span className="tl-line" aria-hidden="true">
            <span className="tl-line-fill" />
          </span>
          {HISTORY.map((h, i) => (
            <li className={`tl-item ${i === active ? 'is-active' : ''}`} key={h.year}>
              <span className="tl-dot" aria-hidden="true" />
              <span className="tl-item-year">{h.year}</span>
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
