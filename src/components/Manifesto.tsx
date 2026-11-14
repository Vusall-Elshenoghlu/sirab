import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'

/** Böyük mətn: sözlər scroll irəlilədikcə bir-bir "işıqlanır". */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const split = SplitText.create('.manifesto-text', { type: 'words' })
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: '.manifesto-text', start: 'top 78%', end: 'bottom 45%', scrub: true },
        },
      )
      gsap.from('.manifesto-meta > *', {
        y: 24,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
      return () => split.revert()
    },
    { scope: root },
  )

  return (
    <section className="manifesto" ref={root}>
      <div className="wrap">
        <div className="manifesto-meta">
          <span className="eyebrow">Manifest</span>
          <span className="manifesto-coord">39° şm. e. · Kəlbəağıl vadisi</span>
        </div>
        <p className="manifesto-text">
          Naxçıvanın dağlarında, dəniz səviyyəsindən 1258 metr yüksəklikdə su daşların arasından süzülərək gəlir.
          1950-ci ildən bəri bizim işimiz onun təbiətini qorumaq, şüşəyə doldurmaq və sizə çatdırmaqdır.
        </p>
      </div>
    </section>
  )
}
