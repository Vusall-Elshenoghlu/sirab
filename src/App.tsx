import { useEffect, useState } from 'react'
import { ScrollTrigger } from './lib/gsap'
import { destroySmoothScroll, initSmoothScroll, lockScroll } from './lib/smoothScroll'
import { frames } from './lib/frames'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import ScrollFilm from './components/ScrollFilm'
import Manifesto from './components/Manifesto'
import Source from './components/Source'
import MacroGallery from './components/MacroGallery'
import Minerals from './components/Minerals'
import Collection from './components/Collection'
import Products from './components/Products'
import Lifestyle from './components/Lifestyle'
import Timeline from './components/Timeline'
import Awards from './components/Awards'
import Delivery from './components/Delivery'
import Footer from './components/Footer'

export default function App() {
  const [ready, setReady] = useState(false)
  // SplitText sətirləri düzgün ölçsün deyə bölmələri şriftlər yükləndikdən sonra qururuq
  const [fontsReady, setFontsReady] = useState(false)

  useEffect(() => {
    let alive = true
    const done = () => alive && setFontsReady(true)
    Promise.race([
      document.fonts
        ? Promise.all([
            document.fonts.load('300 1em "Fraunces Variable"', 'Əə'),
            document.fonts.load('italic 300 1em "Fraunces Variable"', 'Əə'),
            document.fonts.load('400 1em "Onest Variable"', 'Əə'),
          ])
        : Promise.resolve(),
      new Promise((r) => window.setTimeout(r, 2500)),
    ]).then(done)
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    frames.start()
    initSmoothScroll()
    lockScroll(true)
    return () => destroySmoothScroll()
  }, [])

  useEffect(() => {
    if (!ready) return
    lockScroll(false)
    // Şriftlər və şəkillər yerləşdikdən sonra ölçüləri yenilə
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => window.clearTimeout(t)
  }, [ready])

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <Nav ready={ready} />
      {fontsReady && (
      <main>
        <ScrollFilm ready={ready} />
        <Manifesto />
        <Source />
        <MacroGallery />
        <Minerals />
        <Collection />
        <Products />
        <Lifestyle />
        <Timeline />
        <Awards />
        <Delivery />
      </main>
      )}
      {fontsReady && <Footer />}
      <div className="grain" aria-hidden="true" />
    </>
  )
}
