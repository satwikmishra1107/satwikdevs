import { useEffect, useRef } from 'react';

// How quickly the light catches up with the cursor; lower trails more
const FOLLOW = 0.1;

// A soft warm light that drifts after the cursor behind the page content
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let frame = 0;

    const tick = () => {
      const k = reduceMotion ? 1 : FOLLOW;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      // Stop the loop once the light has settled
      frame = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.3
        ? requestAnimationFrame(tick)
        : 0;
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      el.style.opacity = '1';
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      el.style.opacity = '0';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        ref={ref}
        className="absolute left-0 top-0 h-[720px] w-[720px] -ml-[360px] -mt-[360px] rounded-full opacity-0 transition-opacity duration-700 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(249,115,22,0.13) 0%, rgba(255,214,170,0.05) 30%, transparent 65%)',
        }}
      />
    </div>
  );
}
