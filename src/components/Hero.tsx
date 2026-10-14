import { Suspense, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import Portrait from './Portrait';
import { PROFILE, RESUME_URL } from '../data';
import { scrollToId } from '../lib/scroll';
import { PERF_FLAGS } from '../lib/perf';

// Text lands just as the portrait finishes assembling
const TEXT_DELAY_MS = 2600;
// If WebGL or the texture fails, never leave the hero empty
const FALLBACK_MS = 4500;

export default function Hero() {
  const [showText, setShowText] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShowText(true), FALLBACK_MS);
    return () => clearTimeout(id);
  }, []);

  const handleRevealStart = () => {
    setTimeout(() => setShowText(true), TEXT_DELAY_MS);
  };

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden"
    >
      {/* Warm key light behind the portrait */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_55%_60%_at_50%_35%,rgba(249,115,22,0.10),transparent_70%)] lg:bg-[radial-gradient(ellipse_38%_60%_at_31%_45%,rgba(249,115,22,0.2),transparent_70%)]" />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 50 }}
          dpr={PERF_FLAGS.dpr ?? [1, 1.5]}
          frameloop={settled ? 'demand' : 'always'}
        >
          <Suspense fallback={null}>
            <Portrait
              onRevealStart={handleRevealStart}
              onRevealEnd={() => setSettled(true)}
            />
          </Suspense>
          {PERF_FLAGS.bloom && (
            <EffectComposer multisampling={0}>
              <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.2} intensity={0.9} radius={0.7} />
            </EffectComposer>
          )}
        </Canvas>
      </div>

      {/* Keeps text legible where it overlaps the portrait on narrow screens */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] via-[#050505]/85 to-transparent z-10 pointer-events-none lg:hidden" />

      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 md:px-12 xl:px-24 flex flex-col justify-end lg:justify-center pb-24 lg:pb-0">
        <div className="max-w-xl lg:ml-auto lg:w-[44%]">
          <motion.p
            {...fadeUp(0)}
            className="font-mono text-xs tracking-wider text-neutral-500 mb-5"
          >
            {PROFILE.role}
          </motion.p>

          <motion.h1
            {...fadeUp(0.1)}
            className="font-display text-5xl sm:text-6xl xl:text-7xl font-semibold text-white tracking-tight leading-[0.95]"
          >
            {PROFILE.name}
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="mt-6 text-base sm:text-lg text-neutral-400 font-light leading-relaxed"
          >
            {PROFILE.summary}
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="mt-10 flex items-center gap-8 text-sm">
            <button
              onClick={() => scrollToId('projects')}
              className="group inline-flex items-center gap-2 text-white cursor-pointer"
            >
              <span className="border-b border-orange-400/60 group-hover:border-orange-400 pb-0.5 transition-colors">
                View work
              </span>
              <ArrowDown className="w-4 h-4 text-orange-400 group-hover:translate-y-0.5 transition-transform" />
            </button>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
            >
              Resume
              <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
