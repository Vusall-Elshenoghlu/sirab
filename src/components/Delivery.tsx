import { useRef, useState } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { media } from '../data/content'

const PHONE = '+994 36 541 81 13'

export default function Delivery() {
  const root = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  useGSAP(
    () => {
      const split = SplitText.create('.dl-big', { type: 'chars' })
      gsap.from(split.chars, {
        yPercent: 120,
        stagger: 0.06,
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.dl-big', start: 'top 85%' },
      })
      gsap.fromTo(
        '.dl-phone',
        { yPercent: 18, rotate: 8 },
        {
          yPercent: -12,
          rotate: -4,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      gsap.from('.dl-text > *', {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        scrollTrigger: { trigger: '.dl-text', start: 'top 80%' },
      })
      // Dalğa üzərində ripple dairələri
      gsap.to('.dl-ripple', {
        scale: 2.4,
        opacity: 0,
        duration: 4,
        stagger: { each: 1.3, repeat: -1 },
        ease: 'power1.out',
      })
      return () => split.revert()
    },
    { scope: root },
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText('*1950')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="delivery" ref={root} id="catdirilma">
      <div className="wrap dl-grid">
        <div className="dl-text">
          <span className="eyebrow">Çatdırılma</span>
          <div className="dl-big" aria-label="Qısa nömrə *1950">
            *1950
          </div>
          <h2>Bir gün ərzində, pulsuz</h2>
          <p className="lead">
            Mobil tətbiq və ya telefon vasitəsilə sifariş edin. Bakı daxilində ev və ofislərə gün ərzində pulsuz
            çatdırılma.
          </p>
          <div className="dl-actions">
            <button className="btn btn-dark" onClick={copy}>
              {copied ? 'Kopyalandı' : '*1950 nömrəsini kopyala'}
            </button>
            <a className="btn btn-outline" href="https://apps.apple.com/az/app/sirab-su/id6444388824" target="_blank" rel="noreferrer">
              App Store ↗
            </a>
            <a className="btn btn-outline" href="https://play.google.com/store/apps/developer?id=Sirab" target="_blank" rel="noreferrer">
              Google Play ↗
            </a>
          </div>
          <p className="dl-phone-line">
            Telefon: <span className="selectable">{PHONE}</span>
          </p>
        </div>
        <div className="dl-visual" aria-hidden="true">
          <span className="dl-ripple" />
          <span className="dl-ripple" />
          <span className="dl-ripple" />
          <img className="dl-phone" src={media('site/shipping_phone.webp')} alt="" loading="lazy" />
        </div>
      </div>
    </section>
  )
}
