import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { NAV, media } from '../data/content'
import { lockScroll, scrollToTarget } from '../lib/smoothScroll'

export default function Nav({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  useGSAP(
    () => {
      // Aşağı scroll — gizlən, yuxarı — görün
      const show = gsap.quickTo(root.current, 'yPercent', { duration: 0.5, ease: 'power3.out' })
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const y = self.scroll()
          root.current?.classList.toggle('is-solid', y > 40)
          if (y < 120) show(0)
          else show(self.direction === 1 ? -140 : 0)
        },
      })
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (ready)
        gsap.fromTo(
          '.nav > *',
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.08, delay: 0.4, clearProps: 'all' },
        )
    },
    { scope: root, dependencies: [ready] },
  )

  useEffect(() => {
    lockScroll(open)
    if (open) {
      gsap.fromTo(
        '.menu-sheet a',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out', delay: 0.15 },
      )
    }
  }, [open])

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    window.setTimeout(() => scrollToTarget(href), open ? 350 : 0)
  }

  return (
    <>
      <header className="nav" ref={root}>
        <a href="#film" className="nav-logo" onClick={go('#film')} aria-label="Sirab — başa qayıt">
          <img src={media('site/logo-white.svg')} alt="Sirab" width={112} height={40} />
        </a>
        <nav className="nav-links" aria-label="Əsas menyu">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={go(n.href)}>
              {n.label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="#catdirilma" onClick={go('#catdirilma')}>
          <span className="nav-cta-num">*1950</span>
          <span>Sifariş et</span>
        </a>
        <button
          className={`nav-burger ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Menyunu bağla' : 'Menyunu aç'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </header>

      <div className={`menu-sheet ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <ul>
          {NAV.map((n, i) => (
            <li key={n.href}>
              <span className="menu-idx">{String(i + 1).padStart(2, '0')}</span>
              <span className="menu-mask">
                <a href={n.href} onClick={go(n.href)} tabIndex={open ? 0 : -1}>
                  {n.label}
                </a>
              </span>
            </li>
          ))}
        </ul>
        <p className="menu-foot">Çatdırılma: *1950 · +994 36 541 81 13</p>
      </div>
    </>
  )
}
