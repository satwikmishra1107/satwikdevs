import { useEffect, useRef, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import Image from '../assets/portrait.webp';
import { PERF_FLAGS, reportRevealFrames, type FrameSample } from '../lib/perf';

const CanvasRevealShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform float uProgress;
    varying vec2 vUv;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      float diagonal = (1.0 - vUv.x) * 0.5 + (1.0 - vUv.y) * 0.5;
      float threshold = mix(diagonal, random(vUv), 0.3);
      
      float duration = 0.35;
      float start = threshold * (1.0 - duration);
      float end = start + duration;
      
      float localProgress = smoothstep(start, end, uProgress);
      float revealAlpha = smoothstep(0.9, 1.0, localProgress);

      // The image already vignettes; this just lets the base melt into the page
      float edgeFade = smoothstep(0.0, 0.2, vUv.y);

      gl_FragColor = vec4(texColor.rgb, texColor.a * revealAlpha * edgeFade);
    }
  `
};

const ParticleFlightShader = {
  vertexShader: `
    uniform float uProgress;
    uniform float uTime;
    varying vec2 vUv;
    varying float vFlightProgress;
    varying float vEnergy;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    // Fast 3D noise (Single Pass)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vUv = uv;
      float diagonal = (1.0 - uv.x) * 0.5 + (1.0 - uv.y) * 0.5;
      float threshold = mix(diagonal, random(uv), 0.3);
      
      float duration = 0.35;
      float start = threshold * (1.0 - duration);
      float end = start + duration;
      
      float particleProgress = smoothstep(start, end, uProgress);
      vFlightProgress = particleProgress;

      float seed = random(uv) * 6.2831;
      float turbulence = 1.0 - particleProgress;
      
      // OPTIMIZED: Replaced 6-pass curlNoise with 1-pass fast noise + wave vector
      float n = snoise(position * 0.35 + vec3(0.0, 0.0, uTime * 0.12));
      vec3 flow = vec3(sin(n * 6.28 + seed), cos(n * 6.28 + seed), n) * turbulence * 1.4;

      // Particles stream in from off-screen right, crossing the whole hero
      vec3 streamDir = normalize(vec3(1.6, 0.55, -0.4));
      float travelDist = 9.0 + random(uv) * 3.5;
      vec3 scatterOrigin = position + streamDir * travelDist;
      vec3 travelDir = streamDir;

      vec3 upGuess = abs(travelDir.y) > 0.95 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
      vec3 tangentA = normalize(cross(travelDir, upGuess));
      vec3 tangentB = cross(travelDir, tangentA);
      float swirlSpins = 1.5 + random(uv + 1.0) * 1.0; 
      float swirlAngle = particleProgress * swirlSpins * 6.2831853 + seed;
      float swirlEnvelope = sin(clamp(particleProgress, 0.0, 1.0) * 3.14159265);
      float swirlRadius = 0.35 * swirlEnvelope; 
      vec3 swirl = (tangentA * cos(swirlAngle) + tangentB * sin(swirlAngle)) * swirlRadius;

      float gather = smoothstep(0.0, 0.65, particleProgress) * (1.0 - smoothstep(0.55, 1.0, particleProgress));
      vec3 core = vec3(0.0, 0.0, 0.4);
      vec3 gathered = mix(scatterOrigin, core, gather);

      float arrive = smoothstep(0.55, 1.0, particleProgress);
      float snap = 1.0 - pow(1.0 - arrive, 2.5);
      vec3 released = mix(gathered, position, snap);

      vec3 finalPos = released + flow * (1.0 - arrive) + swirl;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
      gl_PointSize = mix(4.0, 1.0, particleProgress); 
      vEnergy = gather;
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    varying vec2 vUv;
    varying float vFlightProgress;
    varying float vEnergy;

    void main() {
      if (vFlightProgress <= 0.0 || vFlightProgress >= 1.0) discard; 

      vec2 cxy = 2.0 * gl_PointCoord - 1.0;
      float r = dot(cxy, cxy);
      if (r > 1.0) discard; 

      vec4 texColor = texture2D(uTexture, vUv);
      vec3 flightTone = vec3(1.0, 0.3, 0.0); // Vibrant Orange
      vec3 coreTone = vec3(1.0, 0.6, 0.1);   // Bright Yellow-Orange
      vec3 tint = mix(flightTone, coreTone, vEnergy);

      float glowMultiplier = mix(3.2, 1.0, vFlightProgress) + vEnergy * 1.6;
      // Base emission so particles from dark areas (suit, hair) still glow in flight
      vec3 flyingColor = tint * (texColor.rgb + 0.35) * glowMultiplier;

      float fadeOut = 1.0 - smoothstep(0.9, 1.0, vFlightProgress);
      float alpha = texColor.a * (1.0 - r) * fadeOut;

      gl_FragColor = vec4(flyingColor, alpha);
    }
  `
};

const REVEAL_DURATION = 4.2; // seconds
// Optional (?warmup=1): invisible frames rendered before the clock starts, so
// first-render costs (shader compile, texture upload) land before any motion
const WARMUP_FRAMES = PERF_FLAGS.warmupFrames;

interface PortraitProps {
  onRevealStart?: () => void;
  onRevealEnd?: () => void;
}

export default function Portrait({ onRevealStart, onRevealEnd }: PortraitProps) {
  const canvasMatRef = useRef<THREE.ShaderMaterial>(null);
  const brushMatRef = useRef<THREE.ShaderMaterial>(null);
  const startTimeRef = useRef<number | null>(null);
  const warmupRef = useRef(0);
  const framesRef = useRef<FrameSample[]>([]);
  const lastFrameRef = useRef<number | null>(null);
  const doneRef = useRef(false);
  const reduceMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const texture = useTexture(Image) as THREE.Texture;
  const { width, height } = useThree(state => state.viewport);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  const canvasUniforms = useMemo(() => ({
    uTexture: { value: texture },
    uProgress: { value: 0.0 },
  }), [texture]);

  const brushUniforms = useMemo(() => ({
    uTexture: { value: texture },
    uProgress: { value: 0.0 },
    uTime: { value: 0.0 }
  }), [texture]);

  const { gl, scene, camera } = useThree();
  useEffect(() => {
    if (WARMUP_FRAMES === 0) return;
    gl.initTexture(texture);
    gl.compile(scene, camera);
  }, [gl, scene, camera, texture]);

  const recordFrame = (t: number) => {
    if (!PERF_FLAGS.perf) return;
    const now = performance.now();
    if (lastFrameRef.current !== null) {
      framesRef.current.push({ dt: now - lastFrameRef.current, t });
    }
    lastFrameRef.current = now;
  };

  // One-shot, time-driven reveal: plays once on load and stays assembled
  useFrame((state) => {
    if (doneRef.current || !canvasMatRef.current || !brushMatRef.current) return;

    if (warmupRef.current < WARMUP_FRAMES) {
      warmupRef.current++;
      recordFrame(-1);
      return;
    }

    const now = state.clock.elapsedTime;
    if (startTimeRef.current === null) {
      startTimeRef.current = now;
      onRevealStart?.();
    }

    const t = reduceMotion
      ? 1
      : Math.min((now - startTimeRef.current) / REVEAL_DURATION, 1);
    const progress = 1 - Math.pow(1 - t, 2); // ease-out
    recordFrame(t);

    brushMatRef.current.uniforms.uTime.value = now;
    canvasMatRef.current.uniforms.uProgress.value = progress;
    brushMatRef.current.uniforms.uProgress.value = progress;

    if (t >= 1) {
      doneRef.current = true;
      if (PERF_FLAGS.perf) reportRevealFrames(framesRef.current);
      onRevealEnd?.();
    }
  });

  const img = texture.image as HTMLImageElement | undefined;
  const imageAspect = img ? img.width / img.height : 1;

  // Landscape: portrait sits on the left half. Narrow screens: top of the hero.
  const isLandscape = width > height * 1.1;
  const planeHeight = isLandscape
    ? height * 0.66
    : Math.min(height * 0.25, (width * 0.55) / imageAspect);
  const planeWidth = planeHeight * imageAspect;
  const groupPosition: [number, number, number] = isLandscape
    ? [-width * 0.185, -height * 0.04, 0]
    : [0, height / 2 - planeHeight / 2 - height * 0.1, 0];

  return (
    <group position={groupPosition}>
      <mesh>
        <planeGeometry args={[planeWidth, planeHeight, 1, 1]} />
        <shaderMaterial
          ref={canvasMatRef}
          vertexShader={CanvasRevealShader.vertexShader}
          fragmentShader={CanvasRevealShader.fragmentShader}
          uniforms={canvasUniforms}
          transparent={true}
          depthWrite={false}
        />
      </mesh>

      <points>
        <planeGeometry args={[planeWidth, planeHeight, 200, 200]} />
        <shaderMaterial
          ref={brushMatRef}
          vertexShader={ParticleFlightShader.vertexShader}
          fragmentShader={ParticleFlightShader.fragmentShader}
          uniforms={brushUniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}