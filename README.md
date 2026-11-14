# Sirab — scroll animasiyalı premium sayt

React 18 + TypeScript + Vite + GSAP 3.13 (ScrollTrigger, SplitText, Flip) + Lenis.

## İşə salmaq

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # hazır sayt dist/ qovluğunda
npm run preview   # build-i yoxlamaq üçün
```

`dist/` qovluğunu istənilən statik hostinqə (Netlify, Vercel, nginx) yükləmək olar — `base: './'` qurulub.

## Struktur

```
public/media/
  film/      0001–0399.webp — 4 video ardıcıl kadrlara çevrilib (scroll-film)
  img/       zip-dəki şəkillər (optimallaşdırılmış webp)
  products/  sirab.az-dan 26 məhsul şəkli (şəffaf fon)
  site/      sirab.az-dan slayd, həyat tərzi, tətbiq şəkilləri və loqolar
src/
  App.tsx                 bölmələrin ardıcıllığı, preloader → scroll kilidi
  lib/gsap.ts             GSAP plaginlərinin qeydiyyatı
  lib/smoothScroll.ts     Lenis + ScrollTrigger sinxronizasiyası
  lib/frames.ts           kadrların prioritetli yüklənməsi (əvvəl skelet, sonra tam)
  data/content.ts         bütün mətnlər, məhsullar, mineral tərkib, tarix, mükafatlar
  components/
    Preloader.tsx         su səviyyəsi kimi qalxan yükləmə ekranı
    Nav.tsx               aşağı scroll-da gizlənən menyu + mobil tam ekran menyu
    ScrollFilm.tsx        ƏSAS: 4 video bir-birinin ardınca scroll ilə (canvas)
    Manifesto.tsx         söz-söz işıqlanan böyük mətn
    Source.tsx            panorama clip-path açılışı, sayğaclar, İlandağ parallax
    MacroGallery.tsx      üfüqi pin-lənmiş qalereya (zip şəkilləri)
    Minerals.tsx          qazlı/qazsız mineral tərkib qrafiki, pH şkalası
    Collection.tsx        pin-lənmiş 5 xətt kolleksiyası (fon rəngi dəyişir, snap)
    Products.tsx          26 məhsul, kateqoriya filtri (GSAP Flip), 3D tilt
    Lifestyle.tsx         müxtəlif sürətli parallax mozaika
    Timeline.tsx          odometr il rəqəmi + çəkilən xətt
    Awards.tsx            scroll sürətinə reaksiya verən marquee
    Delivery.tsx          *1950 çatdırılma bölməsi
    Footer.tsx            hərəkətli dalğa + nəhəng loqo
```

## Scroll-film necə işləyir

Videolar `<video>` ilə deyil, kadr-kadr `<canvas>`-da çəkilir — Safari daxil bütün brauzerlərdə
scroll-un hər iki istiqamətində hamar işləyir.

- **Sıra:** `59502` (İlandağ → şəlalə) → `59503` (şəlalə → kürə) → `59504` (kürə → burulğan) → `59505` (burulğan → şüşə).
- **Keyfiyyət:** orijinal ölçü (960×960 və 1280×720), 24 fps, WebP q86 + yüngül kəskinləşdirmə.
  Mobil üçün ayrıca 60% ölçülü dəst (`film/m`), desktop üçün `film/d`.
- **Kompozisiya:** kadr kəsilmir — dağın zirvəsi də, aşağıdakı su yolu da tam görünür.
  Kadrdan kənar sahə kadrın güzgü əksinin bulanıq versiyası ilə dolur, kənarlar yumşaq əriyir.
- **Kəsiksiz keçidlər:** hər keçiddə növbəti videonun ilk kadrı əvvəlkinin son kadrı ilə SIFT ilə tutuşdurulur.
  1→2 və 2→3: 2–3 px sürüşmə və rəng fərqi 18 kadr ərzində sönən düzəlişlə aradan qaldırılır.
  3→4: 16:9 video kvadrat videoların 1.33× uzaqlaşdırılmış versiyasıdır — canvas onu dəqiq eyni miqyasda çəkir,
  yan hissələr isə 18 kadr ərzində bulanıqdan aydına keçir.

Kadrları yenidən yaratmaq (Python 3, `opencv-python`, `Pillow`):

```bash
python3 tools/build_frames.py <videolar_qovluğu> public/media/film
```

Skript `public/media/film/meta.json` yazır; oradakı rəqəmlər `src/lib/frames.ts`-dəki sabitlərlə eynidir.

Fəsil mətnlərinin vaxtı `ScrollFilm.tsx`-də `inOut('.chap-2', 0.17, 0.4)` kimi (0–1 aralığında) verilib;
pin uzunluğu `window.innerHeight * 6.5`-dir.

## Qeydlər

- Məhsul linkləri sirab.az-dakı məhsul səhifələrinə aparır.
- Mineral tərkib, tarix, mükafatlar və ixrac ölkələri sirab.az/az/about səhifəsindən götürülüb.
- `prefers-reduced-motion` aktiv olduqda Lenis söndürülür və CSS animasiyaları dayanır.
