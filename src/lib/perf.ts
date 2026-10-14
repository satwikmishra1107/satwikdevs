// Diagnostics for the hero reveal, switched on through URL params:
//   ?perf        log frame timing to the console when the reveal finishes
//   ?warmup=1    render a few invisible frames before the reveal clock starts
//   ?nobloom     disable the bloom pass
//   ?dpr=1       force the canvas pixel ratio
const params = new URLSearchParams(window.location.search);

export const PERF_FLAGS = {
  perf: params.has('perf'),
  warmupFrames: params.get('warmup') === '1' ? 4 : 0,
  bloom: !params.has('nobloom'),
  dpr: params.has('dpr') ? Number(params.get('dpr')) : null,
};

export interface FrameSample {
  dt: number; // ms since the previous frame
  t: number; // reveal progress 0..1, or -1 during warm-up
}

export function reportRevealFrames(frames: FrameSample[]) {
  const reveal = frames.filter((f) => f.t >= 0);
  if (reveal.length === 0) return;

  const dts = reveal.map((f) => f.dt).sort((a, b) => a - b);
  const pct = (q: number) => dts[Math.min(dts.length - 1, Math.floor(q * dts.length))];
  const avg = dts.reduce((a, b) => a + b, 0) / dts.length;
  const round = (n: number) => Math.round(n * 10) / 10;

  const summary = {
    flags: window.location.search || '(none)',
    frames: reveal.length,
    'avg fps': round(1000 / avg),
    'median ms': round(pct(0.5)),
    'p95 ms': round(pct(0.95)),
    'worst ms': round(dts[dts.length - 1]),
    'frames > 20ms': dts.filter((d) => d > 20).length,
    'frames > 33ms': dts.filter((d) => d > 33).length,
    'frames > 50ms': dts.filter((d) => d > 50).length,
  };

  // Where in the reveal the slow frames happen
  const slices = Array.from({ length: 10 }, (_, i) => {
    const inSlice = reveal.filter((f) => f.t >= i / 10 && (f.t < (i + 1) / 10 || (i === 9 && f.t <= 1)));
    const sliceDts = inSlice.map((f) => f.dt);
    const sliceAvg = sliceDts.reduce((a, b) => a + b, 0) / (sliceDts.length || 1);
    return {
      reveal: `${i * 10}–${(i + 1) * 10}%`,
      frames: inSlice.length,
      'avg fps': round(1000 / sliceAvg),
      'worst ms': round(Math.max(0, ...sliceDts)),
    };
  });

  console.log('%cHero reveal: frame timing', 'color:#f97316;font-weight:bold;font-size:13px');
  console.table(summary);
  console.table(slices);
  (window as unknown as { __revealPerf: unknown }).__revealPerf = { summary, slices, frames };
  showOverlay(summary, slices);
}

// On-page copy of the results, so they can be read with DevTools closed
function showOverlay(summary: Record<string, unknown>, slices: Record<string, unknown>[]) {
  const pre = document.createElement('pre');
  pre.textContent = [
    ...Object.entries(summary).map(([k, v]) => `${k.padEnd(14)} ${v}`),
    '',
    'reveal    frames  fps    worst ms',
    ...slices.map((s) =>
      `${String(s.reveal).padEnd(10)}${String(s.frames).padEnd(8)}${String(s['avg fps']).padEnd(7)}${s['worst ms']}`
    ),
  ].join('\n');
  pre.style.cssText =
    'position:fixed;left:16px;bottom:16px;z-index:200;margin:0;padding:12px 14px;font:11px/1.5 monospace;' +
    'color:#e5e5e5;background:rgba(10,10,10,.92);border:1px solid #333;border-radius:8px;pointer-events:none';
  document.body.appendChild(pre);
}
