import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { media } from '../data/content'

const STATS = [
  { value: 1257.8, decimals: 2, unit: 'm', label: 'Qaynağın dəniz səviyyəsindən hündürlüyü' },
  { value: 14.6, decimals: 1, unit: 'km', label: 'Naxçıvan şəhərindən şimal-şərqə' },
  { value: 1950, decimals: 0, unit: '', label: 'Sənaye istifadəsinin başladığı il' },
  { value: 15, decimals: 0, unit: '+', label: 'İxrac olunan ölkə' },
  { value: 21, decimals: 0, unit: '', label: 'Məhsul çeşidi, 0.2 L-dən 19 L-ə qədər' },
  { value: 7, decimals: 0, unit: '', label: 'Müasir texnoloji istehsal xətti' },
]

export default function Source() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // Başlıq
      const split = SplitText.create('.source-head h2', { type: 'lines', mask: 'lines' })
      gsap.from(split.lines, {
        yPercent: 105,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.source-head', start: 'top 80%' },
      })

      // Panorama: kiçik pəncərədən tam ekrana açılır
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        gsap.fromTo(
          '.source-pano',
          { clipPath: 'inset(14% 20% 14% 20% round 28px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            ease: 'none',
            scrollTrigger: { trigger: '.source-pano-wrap', start: 'top 85%', end: 'top 10%', scrub: true },
          },
        )
      })
      mm.add('(max-width: 767px)', () => {
        gsap.fromTo(
          '.source-pano',
          { clipPath: 'inset(8% 6% 8% 6% round 20px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            ease: 'none',
            scrollTrigger: { trigger: '.source-pano-wrap', start: 'top 90%', end: 'top 20%', scrub: true },
          },
        )
      })
      gsap.fromTo(
        '.source-pano img',
        { scale: 1.3, yPercent: -6 },
        {
          scale: 1,
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: '.source-pano-wrap', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      gsap.from('.source-pano-caption > *', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: { trigger: '.source-pano-wrap', start: 'top 20%' },
      })

      // Sayğaclar
      gsap.utils.toArray<HTMLElement>('.stat').forEach((el, i) => {
        const num = el.querySelector<HTMLElement>('.stat-num')!
        const target = Number(num.dataset.value)
        const decimals = Number(num.dataset.decimals)
        const obj = { v: 0 }
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1,
          delay: i * 0.06,
          scrollTrigger: { trigger: '.source-stats', start: 'top 85%' },
        })
        gsap.to(obj, {
          v: target,
          duration: 2.2,
          delay: i * 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.source-stats', start: 'top 85%' },
          onUpdate: () => {
            num.textContent = obj.v.toLocaleString('az-AZ', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
              useGrouping: false,
            })
          },
        })
      })

      // İlandağ: parallax
      gsap.fromTo(
        '.source-portrait img',
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: '.source-split', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      gsap.from('.source-split-text > *', {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        scrollTrigger: { trigger: '.source-split', start: 'top 70%' },
      })
      return () => split.revert()
    },
    { scope: root },
  )

  return (
    <section className="source" ref={root} id="qaynaq">
      <div className="wrap source-head">
        <span className="eyebrow">Qaynaq</span>
        <h2>
          Kəlbəağıl vadisi. <em>Sirab kəndi.</em>
        </h2>
        <p className="lead">
          Mineral su yatağı Babək rayonunun Sirab kəndindədir. Ehtiyatları 1968-ci ildə hesablanıb təsdiqlənib və
          həmin il zavod istifadəyə verilib.
        </p>
      </div>

      <div className="source-pano-wrap">
        <div className="source-pano">
          <img src={media('site/intro_mountain.webp')} alt="Naxçıvan dağları və vadi" loading="lazy" />
          <div className="source-pano-caption">
            <span className="eyebrow">Naxçıvan Muxtar Respublikası</span>
            <strong>Dağlar arasında, günəşli yaylada</strong>
          </div>
        </div>
      </div>

      <div className="wrap">
        <ul className="source-stats">
          {STATS.map((s) => (
            <li className="stat" key={s.label}>
              <div className="stat-value">
                <span className="stat-num" data-value={s.value} data-decimals={s.decimals}>
                  {s.value.toFixed(s.decimals)}
                </span>
                {s.unit && <span className="stat-unit">{s.unit}</span>}
              </div>
              <p>{s.label}</p>
            </li>
          ))}
        </ul>

        <div className="source-split">
          <figure className="source-portrait">
            <img src={media('img/ilandag.webp')} alt="İlandağ zirvəsi və yaşıl yamaclar" loading="lazy" />
          </figure>
          <div className="source-split-text">
            <span className="eyebrow">İlandağ</span>
            <h3>Naxçıvanın simvolu olan zirvə</h3>
            <p>
              İlandağın kəskin silueti Naxçıvanın hər yerindən görünür. Su bu dağların arasından keçərək mineral
              tərkibini toplayır: hidrokarbonat, kalsium, maqnezium.
            </p>
            <p className="muted">
              Zavodda 7 müasir texnoloji xətt və 4 əsas istehsal sahəsi işləyir. Su 4–8 °C temperaturda soyudulur.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
