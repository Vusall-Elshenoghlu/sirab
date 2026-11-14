import { useRef, useState } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { MINERALS, media } from '../data/content'

type Mode = 'qazli' | 'qazsiz'

const fmt = (n: number) => n.toLocaleString('az-AZ', { maximumFractionDigits: 1 })

const SUMMARY: Record<Mode, { label: string; value: string; note: string }[]> = {
  qazli: [
    { label: 'Ümumi minerallıq', value: '1.5–3.3', note: 'q/l' },
    { label: 'Karbon qazı', value: '97.5–99.9', note: '% qaz tərkibində' },
  ],
  qazsiz: [
    { label: 'Ümumi minerallıq', value: '0.10', note: 'q/l' },
    { label: 'Qaz', value: 'Yoxdur', note: 'təbii qazsız süfrə suyu' },
  ],
}

export default function Minerals() {
  const root = useRef<HTMLElement>(null)
  const [mode, setMode] = useState<Mode>('qazli')
  const data = MINERALS[mode]

  // İlk giriş
  useGSAP(
    () => {
      const split = SplitText.create('.minerals-head h2', { type: 'lines', mask: 'lines' })
      gsap.from(split.lines, {
        yPercent: 105,
        stagger: 0.1,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.minerals-head', start: 'top 80%' },
      })
      gsap.from('.m-bar', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.4,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.m-chart', start: 'top 75%' },
      })
      gsap.from('.m-row .m-name, .m-row .m-val', {
        opacity: 0,
        y: 14,
        stagger: 0.04,
        scrollTrigger: { trigger: '.m-chart', start: 'top 75%' },
      })
      gsap.from('.ph-marker', {
        left: '0%',
        duration: 2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.ph-card', start: 'top 85%' },
      })
      gsap.fromTo(
        '.minerals-bottle img',
        { yPercent: 12, rotate: -6 },
        {
          yPercent: -12,
          rotate: 4,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      return () => split.revert()
    },
    { scope: root },
  )

  // Rejim dəyişəndə barlar yeni ölçüyə axır
  const first = useRef(true)
  useGSAP(
    () => {
      if (first.current) {
        first.current = false
        return
      }
      gsap.from('.m-bar', { scaleX: 0, transformOrigin: 'left center', duration: 1, stagger: 0.05, ease: 'expo.out' })
      gsap.from('.m-val, .m-summary-value', { opacity: 0, y: 10, duration: 0.6, stagger: 0.03 })
    },
    { scope: root, dependencies: [mode], revertOnUpdate: false },
  )

  return (
    <section className="minerals" ref={root} id="terkib">
      <div className="wrap minerals-grid">
        <div className="minerals-head">
          <span className="eyebrow">Mineral tərkib</span>
          <h2>
            Təbiətin <em>öz formulu</em>
          </h2>
          <p className="lead">
            Sirabın tərkibi dağların süxurlarından gəlir. Aşağıdakı aralıqlar sirab.az-da dərc olunan göstəricilərdir.
          </p>

          <div className="m-toggle" role="tablist" aria-label="Su növü">
            {(['qazli', 'qazsiz'] as Mode[]).map((m) => (
              <button
                key={m}
                role="tab"
                id={`m-tab-${m}`}
                aria-selected={mode === m}
                className={mode === m ? 'is-active' : ''}
                onClick={() => setMode(m)}
              >
                {m === 'qazli' ? 'Qazlı' : 'Qazsız'}
              </button>
            ))}
            <span className={`m-toggle-pill ${mode}`} aria-hidden="true" />
          </div>

          <div className="m-summary">
            {SUMMARY[mode].map((s) => (
              <div key={s.label} className="m-summary-item">
                <span className="m-summary-label">{s.label}</span>
                <span className="m-summary-value">{s.value}</span>
                <span className="m-summary-note">{s.note}</span>
              </div>
            ))}
            <div className="m-summary-item ph-card">
              <span className="m-summary-label">pH</span>
              <span className="m-summary-value">7.4</span>
              <div className="ph-scale" aria-label="pH şkalası 0-dan 14-ə, Sirab 7.4">
                <span className="ph-marker" style={{ left: `${(7.4 / 14) * 100}%` }} />
              </div>
              <div className="ph-ticks" aria-hidden="true">
                <span>0</span>
                <span>7</span>
                <span>14</span>
              </div>
            </div>
          </div>
        </div>

        <div className="m-chart" role="tabpanel" aria-labelledby={`m-tab-${mode}`}>
          <div className="m-chart-head">
            <span>İon</span>
            <span>mq/l</span>
          </div>
          <div className="m-rows">
            {data.rows.map((r) => {
              const left = (r.min / data.scale) * 100
              const width = Math.max(((r.max - r.min) / data.scale) * 100, 0.8)
              return (
                <div className="m-row" key={`${mode}-${r.key}`}>
                  <div className="m-name">
                    <span className="m-formula">{r.formula}</span>
                    <span>{r.name}</span>
                  </div>
                  <div className="m-track">
                    {data.ticks.map((tk) => (
                      <i key={tk} className="m-grid" style={{ left: `${(tk / data.scale) * 100}%` }} />
                    ))}
                    <span
                      className={`m-bar ${r.upTo ? 'is-upto' : ''}`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    />
                  </div>
                  <div className="m-val">{r.upTo ? `< ${fmt(r.max)}` : `${fmt(r.min)}–${fmt(r.max)}`}</div>
                </div>
              )
            })}
          </div>
          <div className="m-axis" aria-hidden="true">
            <span />
            <div className="m-axis-track">
              {data.ticks.map((tk) => (
                <span key={tk} style={{ left: `${(tk / data.scale) * 100}%` }}>
                  {fmt(tk)}
                </span>
              ))}
            </div>
            <span />
          </div>
          <p className="m-note">
            {mode === 'qazli'
              ? 'Zolaq: göstəricinin minimum–maksimum aralığı. Solğun zolaq: yuxarı hədd.'
              : 'Qazsız suda bütün göstəricilər yuxarı hədd kimi verilib, ona görə şkala 0–80 mq/l-dir.'}
          </p>
        </div>

        <div className="minerals-bottle" aria-hidden="true">
          <img
            className={mode === 'qazli' ? 'is-active' : ''}
            src={media('site/info_bottle.webp')}
            alt=""
            loading="lazy"
          />
          <img
            className={mode === 'qazsiz' ? 'is-active' : ''}
            src={media('site/info_bottle_qazsiz.webp')}
            alt=""
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
