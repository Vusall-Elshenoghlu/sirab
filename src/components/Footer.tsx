import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { NAV, SITE, media } from '../data/content'
import { scrollToTarget } from '../lib/smoothScroll'

const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/sirabasc' },
  { label: 'Facebook', href: 'https://www.facebook.com/SirabAsc' },
  { label: 'YouTube', href: 'https://www.youtube.com/@SirabASC' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/sirab-asc' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@sirabasc' },
]

export default function Footer() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '.ft-giant img',
        { yPercent: 60, opacity: 0.2 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'bottom bottom', scrub: true },
        },
      )
      gsap.fromTo(
        '.ft-wave path',
        { attr: { d: 'M1046.5 108.557C1363.74 172.612 1625.27 87.2405 1728 28.2949V147H0V56.2232C552.5 -60.5217 649 28.2956 1046.5 108.557Z' } },
        {
          attr: { d: 'M846.5 68.557C1263.74 142.612 1625.27 117.2405 1728 58.2949V147H0V36.2232C452.5 -20.5217 549 8.2956 846.5 68.557Z' },
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        },
      )
    },
    { scope: root },
  )

  return (
    <footer className="footer" ref={root}>
      <svg className="ft-wave" viewBox="0 0 1728 147" preserveAspectRatio="none" aria-hidden="true">
        <path d="M1046.5 108.557C1363.74 172.612 1625.27 87.2405 1728 28.2949V147H0V56.2232C552.5 -60.5217 649 28.2956 1046.5 108.557Z" />
      </svg>
      <div className="ft-body">
        <div className="wrap ft-grid">
          <div className="ft-col ft-about">
            <p>
              Sirab ASC. Naxçıvan Muxtar Respublikası, Babək rayonu, Sirab kəndi. Təbii mineral su 1950-ci ildən.
            </p>
          </div>
          <nav className="ft-col" aria-label="Alt menyu">
            <span className="ft-title">Səhifə</span>
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToTarget(n.href)
                }}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="ft-col">
            <span className="ft-title">Sosial</span>
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
          <div className="ft-col">
            <span className="ft-title">Əlaqə</span>
            <span className="selectable">*1950</span>
            <span className="selectable">+994 36 541 81 13</span>
            <a href={SITE} target="_blank" rel="noreferrer">
              sirab.az ↗
            </a>
          </div>
        </div>
        <div className="ft-giant" aria-hidden="true">
          <img src={media('site/logo-white.svg')} alt="" />
        </div>
        <div className="wrap ft-bottom">
          <span>© {new Date().getFullYear()} Sirab ASC</span>
          <button className="ft-top" onClick={() => scrollToTarget(0)}>
            Yuxarı qayıt ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
