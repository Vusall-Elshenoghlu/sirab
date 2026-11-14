import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { frames } from '../lib/frames'
import { media } from '../data/content'

type Props = { onDone: () => void }

/**
 * Kadrların "skeleti" yüklənənə qədər göstərilir.
 * Faiz rəqəmi + su səviyyəsi kimi qalxan dolğu, sonra pərdə yuxarı açılır.
 */
export default function Preloader({ onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const [pct, setPct] = useState(0)
  const shown = useRef({ v: 0 })
  const finished = useRef(false)

  useEffect(() => {
    return frames.subscribe((_l, c, total) => {
      const target = Math.round((c / total) * 100)
      gsap.to(shown.current, {
        v: target,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: true,
        onUpdate: () => setPct(Math.round(shown.current.v)),
      })
    })
  }, [])

  const { contextSafe } = useGSAP({ scope: root })

  const exit = contextSafe(() => {
    if (finished.current) return
    finished.current = true
    const tl = gsap.timeline({ onComplete: () => { gsap.set(root.current, { display: 'none' }) } })
    tl.to('.pl-count, .pl-caption', { y: -30, opacity: 0, duration: 0.6, ease: 'power2.in', stagger: 0.05 })
      .to('.pl-logo', { scale: 0.92, opacity: 0, duration: 0.7, ease: 'power2.in' }, '<')
      .add(onDone, '-=0.2')
      .to('.pl-water', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.1')
      .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '<0.08')
  })

  const exitRef = useRef(exit)
  exitRef.current = exit

  useEffect(() => {
    if (pct >= 100) {
      const t = window.setTimeout(() => exitRef.current(), 250)
      return () => window.clearTimeout(t)
    }
  }, [pct])

  // Şəbəkə çox zəifdirsə də sayt açılsın
  useEffect(() => {
    const t = window.setTimeout(() => exitRef.current(), 12000)
    return () => window.clearTimeout(t)
  }, [])

  useGSAP(
    () => {
      gsap.from('.pl-logo', { opacity: 0, y: 20, duration: 1.2, ease: 'power3.out' })
      gsap.from('.pl-caption', { opacity: 0, duration: 1, delay: 0.3 })
    },
    { scope: root },
  )

  return (
    <div className="preloader" ref={root} role="status" aria-live="polite" aria-label={`Yüklənir ${pct}%`}>
      <div className="pl-water" style={{ transform: `translateY(${100 - pct}%)` }} />
      <div className="pl-inner">
        <img className="pl-logo" src={media('site/logo-white.svg')} alt="Sirab" width={240} height={86} />
        <div className="pl-caption">Naxçıvan · 1258 m · 1950-dən bəri</div>
      </div>
      <div className="pl-count" aria-hidden="true">
        <span>{String(pct).padStart(3, '0')}</span>
        <small>%</small>
      </div>
    </div>
  )
}
