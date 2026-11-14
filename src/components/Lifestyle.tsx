import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { media } from '../data/content'

const MOMENTS = [
  { img: media('site/blog_sport.webp'), cls: 'ls-a', speed: -14, title: 'Təbiətdə', text: 'Çöldə, gəzintidə, günəşin altında.' },
  { img: media('site/qazli_life.webp'), cls: 'ls-b', speed: 10, title: 'Evdə', text: 'Kitab, sakit səhər və bir stəkan qazlı Sirab.' },
  { img: media('site/blog_premium.webp'), cls: 'ls-c', speed: -8, title: 'Süfrədə', text: 'Premium şüşə xüsusi axşamlar üçün.' },
  { img: media('site/blog_2.webp'), cls: 'ls-d', speed: 16, title: 'Hər gün', text: 'Təmiz su, təmiz başlanğıc.' },
]

export default function Lifestyle() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const split = SplitText.create('.ls-head h2', { type: 'chars,words' })
      gsap.from(split.chars, {
        yPercent: 100,
        opacity: 0,
        rotate: 6,
        stagger: 0.02,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.ls-head', start: 'top 80%' },
      })
      gsap.utils.toArray<HTMLElement>('.ls-item').forEach((el) => {
        const speed = Number(el.dataset.speed)
        gsap.fromTo(
          el,
          { yPercent: -speed },
          {
            yPercent: speed,
            ease: 'none',
            scrollTrigger: { trigger: '.ls-grid', start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
        gsap.fromTo(
          el.querySelector('.ls-img'),
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.4,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          },
        )
        gsap.from(el.querySelector('img'), {
          scale: 1.35,
          duration: 1.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })
      return () => split.revert()
    },
    { scope: root },
  )

  return (
    <section className="lifestyle" ref={root}>
      <div className="wrap">
        <div className="ls-head">
          <span className="eyebrow">Həyat tərzi</span>
          <h2>Həyatın hər anında</h2>
        </div>
        <div className="ls-grid">
          {MOMENTS.map((m) => (
            <figure className={`ls-item ${m.cls}`} data-speed={m.speed} key={m.title}>
              <div className="ls-img">
                <img src={m.img} alt={m.text} loading="lazy" />
              </div>
              <figcaption>
                <strong>{m.title}</strong>
                <span>{m.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
