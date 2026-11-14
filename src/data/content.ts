const m = (p: string) => `${import.meta.env.BASE_URL}media/${p}`
export const media = m

export const SITE = 'https://www.sirab.az'

/* ---------- Məhsullar (sirab.az/az/products) ---------- */
export type CategoryId = 'qazsiz' | 'qazli' | 'premium' | 'bidon' | 'xususi' | 'icki'

export const CATEGORIES: { id: CategoryId; label: string; note: string }[] = [
  { id: 'qazsiz', label: 'Qazsız sular', note: 'Şüşə və plastik' },
  { id: 'qazli', label: 'Qazlı sular', note: 'Klassik yaşıl şüşə' },
  { id: 'premium', label: 'Premium', note: 'Naxışlı şüşə' },
  { id: 'bidon', label: 'Bidon', note: 'Ev və ofis üçün' },
  { id: 'xususi', label: 'Xüsusi sular', note: 'Sport və uşaq' },
  { id: 'icki', label: 'Qazlı içkilər', note: 'Limon və alma' },
]

export type Product = {
  id: string
  cat: CategoryId
  volume: string
  pack: 'Şüşə' | 'Plastik'
  kind: string
  img: string
  url: string
  tone: 'blue' | 'green' | 'pearl' | 'aqua' | 'citrus'
}

const P = (
  id: string,
  cat: CategoryId,
  volume: string,
  pack: Product['pack'],
  kind: string,
  file: string,
  path: string,
  tone: Product['tone'],
): Product => ({
  id,
  cat,
  volume,
  pack,
  kind,
  img: m(`products/${file}.webp`),
  url: `${SITE}/az/product-details/${path}`,
  tone,
})

export const PRODUCTS: Product[] = [
  P('s-g-033', 'qazsiz', '0.33 L', 'Şüşə', 'Qazsız', 'qazsiz_suse_03', 'still-waters/sirab-033-l-still', 'blue'),
  P('s-g-05', 'qazsiz', '0.5 L', 'Şüşə', 'Qazsız', 'qazsiz_suse_05', 'still-waters/sirab-05-l-still', 'blue'),
  P('s-g-075', 'qazsiz', '0.75 L', 'Şüşə', 'Qazsız', 'qazsiz_suse_075', 'still-waters/sirab-075-l-still', 'blue'),
  P('s-p-033', 'qazsiz', '0.33 L', 'Plastik', 'Qazsız', 'qazsiz_plastik_03', 'still-waters/sirab-033-l-still', 'aqua'),
  P('s-p-05', 'qazsiz', '0.5 L', 'Plastik', 'Qazsız', 'qazsiz_plastik_05', 'still-waters/sirab-05-l-still', 'aqua'),
  P('s-p-1', 'qazsiz', '1 L', 'Plastik', 'Qazsız', 'qazsiz_plastik_1', 'still-waters/sirab-1-l-still', 'aqua'),
  P('s-p-15', 'qazsiz', '1.5 L', 'Plastik', 'Qazsız', 'qazsiz_plastik_105', 'still-waters/sirab-15-l-still', 'aqua'),

  P('q-g-02', 'qazli', '0.2 L', 'Şüşə', 'Qazlı', 'qazli_suse_02', 'sparkling-waters/sirab-02-l-sparkling', 'green'),
  P('q-g-033', 'qazli', '0.33 L', 'Şüşə', 'Qazlı', 'qazli_suse_03', 'sparkling-waters/sirab-033-l-sparkling', 'green'),
  P('q-g-05', 'qazli', '0.5 L', 'Şüşə', 'Qazlı', 'qazli_suse_05', 'sparkling-waters/sirab-05-l-sparkling', 'green'),
  P('q-g-075', 'qazli', '0.75 L', 'Şüşə', 'Qazlı', 'qazli_suse_075', 'sparkling-waters/sirab-075-l-sparkling', 'green'),
  P('q-p-05', 'qazli', '0.5 L', 'Plastik', 'Qazlı', 'qazli_plastik_05', 'sparkling-waters/sirab-05-l-sparkling', 'green'),
  P('q-p-1', 'qazli', '1 L', 'Plastik', 'Qazlı', 'qazli_plastik_1', 'sparkling-waters/sirab-1-l-sparkling', 'green'),
  P('q-p-15', 'qazli', '1.5 L', 'Plastik', 'Qazlı', 'qazli_plastik_105', 'sparkling-waters/sirab-15-l-sparkling', 'green'),

  P('p-s-033', 'premium', '0.33 L', 'Şüşə', 'Premium qazsız', 'premium_qazsiz_03', 'premium-waters/sirab-033-l-premium-still', 'pearl'),
  P('p-s-075', 'premium', '0.75 L', 'Şüşə', 'Premium qazsız', 'premium_qazsiz_750', 'premium-waters/sirab-075-l-premium-still', 'pearl'),
  P('p-q-033', 'premium', '0.33 L', 'Şüşə', 'Premium qazlı', 'premium_qazli_03', 'premium-waters/sirab-033-l-premium-sparkling', 'pearl'),
  P('p-q-075', 'premium', '0.75 L', 'Şüşə', 'Premium qazlı', 'premium_qazli_750', 'premium-waters/sirab-075-l-premium-sparkling', 'pearl'),

  P('b-5', 'bidon', '5 L', 'Plastik', 'Bidon', 'bidon_5', 'canister/sirab-5-l-canister', 'aqua'),
  P('b-10', 'bidon', '10 L', 'Plastik', 'Bidon', 'bidon_10', 'canister/sirab-10-l-canister', 'aqua'),
  P('b-18', 'bidon', '18 L', 'Plastik', 'Bidon', 'bidon_18', 'canister/sirab-18-l-canister', 'aqua'),
  P('b-19', 'bidon', '19 L', 'Plastik', 'Bidon', 'bidon_19', 'canister/sirab-19-l-canister', 'aqua'),

  P('x-sport', 'xususi', '0.75 L', 'Plastik', 'Sport su', 'xususi_idman', 'special-waters/sirab-075-l-sport-water', 'aqua'),
  P('x-kids', 'xususi', '0.33 L', 'Plastik', 'Uşaq suyu', 'xususi_usaq', 'special-waters/sirab-033-l-kids-water', 'aqua'),

  P('i-limon', 'icki', '0.2 L', 'Şüşə', 'Limon ləzzətli', 'Sirab_Soda_limon', 'carbonated-drinks/sirab-02-l-lemon-flavored', 'citrus'),
  P('i-alma', 'icki', '0.2 L', 'Şüşə', 'Alma ləzzətli', 'Sirab_Soda_alma', 'carbonated-drinks/sirab-02-l-apple-flavored', 'citrus'),
]

/* ---------- Kolleksiya (sirab.az ana səhifə slaydları) ---------- */
export const COLLECTION = [
  {
    key: 'klassik',
    word: 'ŞÜŞƏ',
    title: 'Klassik şüşə',
    text: 'Qazlı və qazsız Sirab — 0.2 L-dən 0.75 L-ə qədər şüşə qablaşdırmada. 2024-cü ildə Cenevrədə “Beynəlxalq Möhtəşəm Dad” mükafatı.',
    img: m('site/sld1.webp'),
    bg: '#0d3a2a',
  },
  {
    key: 'premium',
    word: 'PREMIUM',
    title: 'Premium',
    text: 'Minimalist şüşə və əl naxışını xatırladan etiket. Süfrə, restoran və xüsusi anlar üçün.',
    img: m('site/sld2.webp'),
    bg: '#14283a',
  },
  {
    key: 'pet',
    word: 'HƏR GÜN',
    title: 'Hər gün üçün',
    text: '0.33 L-dən 1.5 L-ə qədər yüngül plastik qablaşdırma. Çantada, masada, yolda.',
    img: m('site/sld3.webp'),
    bg: '#0f3550',
  },
  {
    key: 'sport',
    word: 'SPORT',
    title: 'Sport su',
    text: 'Sport qapaqlı 0.75 L. Hərəkətdə olanlar üçün bir əllə açılan qapaq.',
    img: m('site/sld4.webp'),
    bg: '#123e5c',
  },
  {
    key: 'soda',
    word: 'LƏZZƏT',
    title: 'Limon və alma',
    text: 'Sirab mineral suyu əsasında 0.2 L qazlı içkilər. Yeni ləzzətlər, eyni mənbə.',
    img: m('site/sld5.webp'),
    bg: '#1f3d1c',
  },
]

/* ---------- Mineral tərkib (sirab.az/az/about, product-details) ---------- */
export type Mineral = { key: string; name: string; formula: string; min: number; max: number; upTo?: boolean }

export const MINERALS: Record<'qazli' | 'qazsiz', { scale: number; ticks: number[]; rows: Mineral[] }> = {
  qazli: {
    scale: 2000,
    ticks: [0, 500, 1000, 1500, 2000],
    rows: [
      { key: 'hco3', name: 'Hidrokarbonat', formula: 'HCO₃⁻', min: 1000, max: 2000 },
      { key: 'ca', name: 'Kalsium', formula: 'Ca²⁺', min: 200, max: 400 },
      { key: 'nak', name: 'Natrium + Kalium', formula: 'Na⁺ + K⁺', min: 100, max: 350 },
      { key: 'so4', name: 'Sulfat', formula: 'SO₄²⁻', min: 150, max: 300 },
      { key: 'cl', name: 'Xlorid', formula: 'Cl⁻', min: 10, max: 150 },
      { key: 'mg', name: 'Maqnezium', formula: 'Mg²⁺', min: 0, max: 100, upTo: true },
    ],
  },
  qazsiz: {
    scale: 80,
    ticks: [0, 20, 40, 60, 80],
    rows: [
      { key: 'hco3', name: 'Hidrokarbonat', formula: 'HCO₃⁻', min: 0, max: 75, upTo: true },
      { key: 'ca', name: 'Kalsium', formula: 'Ca²⁺', min: 0, max: 10, upTo: true },
      { key: 'nak', name: 'Natrium + Kalium', formula: 'Na⁺ + K⁺', min: 0, max: 18.5, upTo: true },
      { key: 'so4', name: 'Sulfat', formula: 'SO₄²⁻', min: 0, max: 25, upTo: true },
      { key: 'cl', name: 'Xlorid', formula: 'Cl⁻', min: 0, max: 10, upTo: true },
      { key: 'mg', name: 'Maqnezium', formula: 'Mg²⁺', min: 0, max: 6.5, upTo: true },
    ],
  },
}

/* ---------- Tarixçə ---------- */
export const HISTORY = [
  { year: '1950', title: 'Sənaye istifadəsinin başlanğıcı', text: 'Sirab mineral su yatağından sənaye məqsədilə istifadəyə başlanılır.' },
  { year: '1968', title: 'Zavod istifadəyə verilir', text: 'Yatağın ehtiyatları hesablanır, Dövlət Ehtiyatlar Komissiyası tərəfindən təsdiqlənir və Sirab zavodu işə düşür.' },
  { year: '2003', title: 'Açıq Səhmdar Cəmiyyəti', text: 'Zavod ASC statusu alır və istehsal yenilənir.' },
  { year: '2012', title: 'Avropaya ilk ixrac', text: 'Avropa bazarına inteqrasiya: ilk göndərişlər Latviya və Litvaya.' },
  { year: '2025', title: 'Yeni qablaşdırma', text: '75 illik yubiley ilində qablaşdırma müasir və minimalist üslubda yenilənir.' },
]

/* ---------- Mükafatlar ---------- */
export const AWARDS = [
  { year: '2005', place: 'Cenevrə', name: 'Qızıl medal · Biznesdə yüksək keyfiyyət' },
  { year: '2009', place: 'Ukrayna', name: 'Qızıl medal · XII Qida və içkilər forumu' },
  { year: '2009', place: 'Azərbaycan', name: '“İlin Brendi”' },
  { year: '2010', place: 'Moskva', name: 'Gümüş medal · PRODEXPO' },
  { year: '2011', place: 'Moskva', name: 'Qızıl medal · PRODEXPO' },
  { year: '2011', place: 'Qazaxıstan', name: 'Qızıl medal · Yeyinti sənayesi sərgisi' },
  { year: '2012', place: 'Azərbaycan', name: '“İlin Brendi”' },
  { year: '2012', place: 'Naxçıvan', name: '“İlin İxracatçısı”' },
  { year: '2015', place: 'Brüssel', name: '“Mükəmməl Ləzzət” · ITQI' },
  { year: '2018', place: 'Moskva', name: 'Qızıl medal · XXV PRODEXPO' },
  { year: '2024', place: 'Cenevrə', name: '“Beynəlxalq Möhtəşəm Dad”' },
]

export const EXPORTS = [
  'ABŞ', 'Kanada', 'Türkiyə', 'Rusiya', 'Qətər', 'Küveyt', 'Çin', 'Polşa',
  'Ukrayna', 'Qazaxıstan', 'Türkmənistan', 'İraq', 'Latviya', 'Litva', 'Belarus',
]

export const NAV = [
  { href: '#film', label: 'Mənbə' },
  { href: '#terkib', label: 'Tərkib' },
  { href: '#kolleksiya', label: 'Kolleksiya' },
  { href: '#mehsullar', label: 'Məhsullar' },
  { href: '#tarix', label: 'Tarix' },
  { href: '#catdirilma', label: 'Çatdırılma' },
]
