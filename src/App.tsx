import { useEffect, useLayoutEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Footer from './components/Footer';
import Terminal from './components/Terminal';
import CursorGlow from './components/CursorGlow';
import { setLenis } from './lib/scroll';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduceMotion,
    });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      if (reduceMotion) return;
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Hidden terminal: ` or ~ toggles it from anywhere outside a text field
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '`' && e.key !== '~') return;
      const target = e.target as HTMLElement;
      if (target.matches('input, textarea, [contenteditable="true"]')) return;
      e.preventDefault();
      setTerminalOpen((open) => !open);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-neutral-200 overflow-x-clip selection:bg-orange-500/30 selection:text-orange-100">
      <CursorGlow />
      <Navbar />
      <main className="relative z-[1] w-full">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Footer onOpenTerminal={() => setTerminalOpen(true)} />
      </main>
      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
    </div>
  );
}
