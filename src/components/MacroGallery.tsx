import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { media } from '../data/content'

/* Sabit "təsadüfi" ədədlər — hər renderdə eyni nəticə */
const rnd = (i: number, s = 1) => {
  const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/* ---------- 01 · Çat: yer qatlarının kəsiyi ---------- */
function ArtFissure() {
  const strata = [
    { y: 320, c: '#6e6253' },
    { y: 400, c: '#5b5145' },
    { y: 480, c: '#4a4239' },
    { y: 560, c: '#3a352f' },
    { y: 640, c: '#2b2925' },
  ]
  const wave = (y: number, k: number) =>
    `M0 ${y} C 300 ${y - 30 - k * 4} 520 ${y + 34} 820 ${y + 6} S 1300 ${y - 26} 1600 ${y + 10} L1600 1000 L0 1000 Z`
  const vein =
    'M835 1000 L858 930 L842 868 L870 800 L852 735 L884 668 L864 600 L890 540 L872 470 L898 408 L882 350 L900 300'
  const bubbles = Array.from({ length: 16 }, (_, i) => ({
    r: 3 + rnd(i) * 6,
    d: 5 + rnd(i, 2) * 5,
    delay: -rnd(i, 3) * 10,
    dx: (rnd(i, 4) - 0.5) * 20,
  }))
  return (
    <svg className="macro-art art-fissure" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <defs>
        <linearGradient id="fz-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d7f8c" />
          <stop offset="1" stopColor="#a9c2c6" />
        </linearGradient>
        <linearGradient id="fz-water" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#3fbf7f" stopOpacity="0.15" />
          <stop offset="1" stopColor="#bfe6ff" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#fz-sky)" />
      <path
        d="M0 300 L180 250 L320 270 L470 170 L560 210 L690 90 L760 140 L820 120 L900 300 L1050 230 L1180 260 L1320 190 L1460 250 L1600 230 L1600 1000 L0 1000Z"
        fill="#7d8c7a"
      />
      {strata.map((s, i) => (
        <path key={i} d={wave(s.y, i)} fill={s.c} />
      ))}
      {/* Çat və içində qalxan su */}
      <path d={vein} fill="none" stroke="#061219" strokeWidth="34" strokeLinejoin="round" />
      <path className="fz-flow" d={vein} fill="none" stroke="url(#fz-water)" strokeWidth="12" strokeLinejoin="round" />
      <g className="fz-bubbles">
        {bubbles.map((b, i) => (
          <circle
            key={i}
            cx={870 + b.dx}
            cy={980}
            r={b.r}
            style={{ animationDuration: `${b.d}s`, animationDelay: `${b.delay}s` }}
          />
        ))}
      </g>
      {/* Qaynaq nöqtəsi */}
      <circle cx="900" cy="300" r="10" fill="#e6f6ff" />
      <circle className="fz-ping" cx="900" cy="300" r="10" fill="none" stroke="#e6f6ff" strokeWidth="2" />
      <g className="fz-labels">
        <line x1="900" y1="300" x2="1040" y2="150" />
        <text x="1050" y="140">Qaynaq</text>
        <line x1="878" y1="510" x2="1060" y2="510" />
        <text x="1072" y="518">Çat-damar</text>
        <text x="60" y="630" className="fz-depth">↓ yerin dərinliyi</text>
      </g>
    </svg>
  )
}

/* ---------- 02 · Qaz: şüşədə qalxan qabarcıqlar ---------- */
function ArtBubbles() {
  const bubbles = Array.from({ length: 34 }, (_, i) => ({
    left: 36 + rnd(i, 5) * 28,
    size: 4 + rnd(i, 6) * 12,
    d: 4 + rnd(i, 7) * 6,
    delay: -rnd(i, 8) * 10,
    drift: (rnd(i, 9) - 0.5) * 40,
  }))
  return (
    <div className="macro-art art-gas" aria-hidden="true">
      <div className="gas-glow" />
      <img src={media('products/qazli_suse_075.webp')} alt="" loading="lazy" />
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="gas-b"
          style={
            {
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              animationDuration: `${b.d}s`,
              animationDelay: `${b.delay}s`,
              '--drift': `${b.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
      <span className="gas-tag">
        CO₂ <em>· təbii</em>
      </span>
    </div>
  )
}

/* ---------- 03 · Tərkib: ionlar ---------- */
const IONS = [
  { f: 'HCO₃⁻', n: 'Hidrokarbonat', v: 1500, x: 380, y: 400 },
  { f: 'Ca²⁺', n: 'Kalsium', v: 300, x: 590, y: 220 },
  { f: 'Na⁺+K⁺', n: 'Natrium + Kalium', v: 225, x: 612, y: 520 },
  { f: 'SO₄²⁻', n: 'Sulfat', v: 225, x: 190, y: 190 },
  { f: 'Cl⁻', n: 'Xlorid', v: 80, x: 185, y: 600 },
  { f: 'Mg²⁺', n: 'Maqnezium', v: 50, x: 430, y: 660 },
]
function ArtIons() {
  const k = 150 / Math.sqrt(1500)
  return (
    <svg className="macro-art art-ions" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="800" height="800" fill="#0b2433" />
      {IONS.slice(1).map((o) => (
        <line key={o.f} x1={IONS[0].x} y1={IONS[0].y} x2={o.x} y2={o.y} className="ion-bond" />
      ))}
      {IONS.map((o, i) => {
        const r = Math.sqrt(o.v) * k
        return (
          <g key={o.f} className="ion" style={{ animationDelay: `${-i * 1.3}s` }}>
            <circle cx={o.x} cy={o.y} r={r} className={i === 0 ? 'ion-core' : 'ion-dot'} />
            <text x={o.x} y={o.y + (i === 0 ? 4 : 2)} className="ion-f" style={{ fontSize: Math.max(15, r * 0.38) }}>
              {o.f}
            </text>
            {i === 0 && (
              <text x={o.x} y={o.y + 44} className="ion-n">
                ~{o.v} mq/l
              </text>
            )}
          </g>
        )
      })}
      <text x="40" y="760" className="ion-note">
        Qazlı Sirab · göstərici aralığının ortası, mq/l
      </text>
    </svg>
  )
}

/* ---------- 04 · Forma: 0.2 L → 19 L ---------- */
const LINEUP = [
  { f: 'qazli_suse_02', l: '0.2 L' },
  { f: 'qazsiz_suse_05', l: '0.5 L' },
  { f: 'qazli_suse_075', l: '0.75 L' },
  { f: 'qazsiz_plastik_105', l: '1.5 L' },
  { f: 'bidon_5', l: '5 L' },
  { f: 'bidon_19', l: '19 L' },
]
function ArtLineup() {
  return (
    <div className="macro-art art-lineup" aria-hidden="true">
      <div className="lineup-row">
        {LINEUP.map((p) => (
          <figure key={p.f}>
            <img src={media(`products/${p.f}.webp`)} alt="" loading="lazy" />
            <figcaption>{p.l}</figcaption>
          </figure>
        ))}
      </div>
      <div className="lineup-floor" />
    </div>
  )
}

const SHOTS = [
  {
    Art: ArtFissure,
    title: 'Çat',
    label: 'Yer qatlarının kəsiyi: su çatlarla qaynağa qalxır',
    text: 'Sirab çat-damar tipli sudur. Yer qatlarının arasındakı çatlarla yuxarı qalxır və bu yolda daşlardan mineral toplayır.',
    wide: true,
  },
  {
    Art: ArtBubbles,
    title: 'Qaz',
    label: 'Qazlı Sirab şüşəsində qalxan qabarcıqlar',
    text: 'Qabarcıqların mənbəyi təbiidir. Qazın 97.5–99.9%-i karbon qazıdır və o, su ilə birlikdə yerin dərinliyindən gəlir.',
    wide: false,
  },
  {
    Art: ArtIons,
    title: 'Tərkib',
    label: 'Sirabın əsas ionları, ölçüsü miqdarına görə',
    text: 'Hər litrdə əsas yeri hidrokarbonat tutur, ardınca kalsium, natrium və sulfat gəlir. Suya dadını dağın daşları verir.',
    wide: false,
  },
  {
    Art: ArtLineup,
    title: 'Forma',
    label: 'Sirab qablaşdırmaları: 0.2 litrdən 19 litrə qədər',
    text: 'Eyni mənbə, 21 çeşid: 0.2 litrlik şüşədən 19 litrlik bidona qədər. Şüşə, plastik, qazlı və qazsız.',
    wide: true,
  },
]

/** Üfüqi pin-lənmiş qalereya: vertikal scroll → üfüqi hərəkət. */
export default function MacroGallery() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const track = root.current!.querySelector<HTMLElement>('.macro-track')!
        const distance = () => track.scrollWidth - window.innerWidth

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })

        // Vizualın içində əks istiqamətli parallax
        gsap.utils.toArray<HTMLElement>('.macro-panel').forEach((panel) => {
          const art = panel.querySelector('.macro-art')
          gsap.fromTo(
            art,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          )
          gsap.from(panel.querySelectorAll('.macro-caption > *'), {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 70%' },
          })
        })

        gsap.from('.lineup-row figure', {
          yPercent: 30,
          opacity: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.art-lineup', containerAnimation: tween, start: 'left 75%' },
        })

        gsap.to('.macro-progress i', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true },
        })
      })

      mm.add('(max-width: 899px)', () => {
        gsap.utils.toArray<HTMLElement>('.macro-panel').forEach((panel) => {
          gsap.from(panel, {
            clipPath: 'inset(12% 8% 12% 8% round 18px)',
            ease: 'none',
            scrollTrigger: { trigger: panel, start: 'top 95%', end: 'top 40%', scrub: true },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section className="macro" ref={root} aria-label="Suyun anatomiyası">
      <div className="macro-track">
        <div className="macro-intro">
          <span className="eyebrow">Suyun anatomiyası</span>
          <h2>
            Dörd an, <em>bir</em> su
          </h2>
          <p>Bir qurtum Sirabın içində nə var: qaynağın yolu, təbii qazı, mineralları və sizə çatdığı forma.</p>
          <div className="macro-progress" aria-hidden="true">
            <i />
          </div>
        </div>
        {SHOTS.map(({ Art, ...s }, i) => (
          <figure className={`macro-panel ${s.wide ? 'is-wide' : 'is-square'}`} key={s.title}>
            <div className="macro-img" role="img" aria-label={s.label}>
              <Art />
            </div>
            <figcaption className="macro-caption">
              <span className="macro-n">{String(i + 1).padStart(2, '0')} / 04</span>
              <strong>{s.title}</strong>
              <span>{s.text}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
