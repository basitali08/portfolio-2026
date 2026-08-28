"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uRes;

  // ---------- noise ----------
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float vnoise(vec2 p){
    vec2 i=floor(p); vec2 f=fract(p);
    float a=hash(i); float b=hash(i+vec2(1.,0.));
    float c=hash(i+vec2(0.,1.)); float d=hash(i+vec2(1.,1.));
    vec2 u=f*f*(3.-2.*f);
    return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
  }
  float fbm(vec2 p){
    float v=0., a=.5;
    for(int i=0;i<5;i++){ v+=a*vnoise(p); p*=2.02; a*=.5; }
    return v;
  }

  // ---------- scanlines / glitch ----------
  float scanline(vec2 uv, float t){
    return 0.92 + 0.08 * sin(uv.y * uRes.y * 1.4 + t * 6.0);
  }
  float glitch(vec2 uv, float t){
    float g = step(0.985, hash(vec2(floor(uv.y * 80.0), floor(t * 12.0))));
    return g * (hash(vec2(t, uv.y)) - 0.5) * 0.4;
  }

  // ---------- neon city silhouette ----------
  float city(vec2 uv, float seed, float speed){
    float h = 0.0;
    float x = uv.x * 30.0;
    float col = 0.0;
    for(int i=0;i<6;i++){
      float fi = float(i);
      float bx = floor(x + fi*7.0 + seed*100.0);
      float w  = 0.6 + hash(vec2(bx, seed)) * 1.4;
      float dh = hash(vec2(bx*1.3, seed+7.0)) * 0.5;
      float dx = fract(x + fi*7.0 + seed*100.0);
      float bar = step(dx, w) * step(0.5-dh, uv.y);
      h = max(h, bar * (0.2 + 0.8 * (0.5-dh)*1.4));
    }
    return clamp(h, 0.0, 1.0);
  }

  void main(){
    vec2 uv = vUv;
    float t = uTime * 0.4;
    float p = uProgress;

    // background gradient (cyber dusk)
    vec3 skyTop    = vec3(0.04, 0.02, 0.10);
    vec3 skyMid    = vec3(0.55, 0.05, 0.35);
    vec3 skyHorizon= vec3(1.00, 0.25, 0.55);
    vec3 skyBot    = vec3(0.00, 0.65, 0.90);
    float vy = uv.y;
    vec3 sky = mix(skyBot, skyHorizon, smoothstep(0.0, 0.35, vy));
    sky = mix(sky, skyMid, smoothstep(0.30, 0.55, vy));
    sky = mix(sky, skyTop, smoothstep(0.55, 1.0, vy));

    // big neon sun
    vec2 sunC = vec2(0.5 + sin(t*0.3)*0.05, 0.42);
    float sunR = 0.18;
    float dSun = length((uv - sunC) * vec2(1.0, 1.2));
    float sun = smoothstep(sunR, sunR - 0.005, dSun);
    float sunGlow = smoothstep(sunR * 2.5, sunR * 0.9, dSun) * 0.5;
    vec3 sunCol = mix(vec3(1.0, 0.15, 0.45), vec3(1.0, 0.85, 0.25), smoothstep(0.0, 0.5, dSun));
    sky += sunCol * (sun + sunGlow);

    // ground reflection
    float ground = smoothstep(0.34, 0.30, vy);
    sky = mix(sky, sky * 0.4 + vec3(0.0, 0.2, 0.4) * 0.3, ground);

    // perspective grid floor
    vec2 g = uv;
    g.y = (g.y - 0.30) * 6.0;
    float gridX = smoothstep(0.98, 1.0, abs(fract(g.x * 2.0 + t*0.2) - 0.5) * 2.0);
    float gridZ = smoothstep(0.97, 1.0, abs(fract(g.y - t*0.6) - 0.5) * 2.0);
    float grid = max(gridX, gridZ) * smoothstep(0.0, 0.3, uv.y) * smoothstep(0.34, 0.20, uv.y);
    vec3 gridCol = mix(vec3(0.0, 0.9, 1.0), vec3(1.0, 0.1, 0.7), uv.x);
    sky += gridCol * grid * 1.4;

    // far city
    float c1 = city(uv, 1.0, t);
    sky = mix(sky, vec3(0.02, 0.0, 0.05), c1 * 0.9);
    sky += vec3(1.0, 0.1, 0.6) * c1 * 0.7 * (0.3 + 0.7 * sin(t*2.0 + uv.x*20.0));

    // near city with windows
    float c2 = city(uv * vec2(1.0, 0.7) + vec2(0.0, 0.05), 5.0, t*0.5);
    sky = mix(sky, vec3(0.0), c2);
    float win = step(0.85, hash(vec2(floor(uv.x*300.0), floor(uv.y*200.0)) + floor(t*4.0)));
    sky += vec3(1.0, 0.9, 0.4) * win * c2 * 0.9;
    sky += vec3(0.0, 0.9, 1.0) * step(0.92, hash(vec2(floor(uv.x*120.0), floor(uv.y*80.0)) + floor(t*3.0))) * c2;

    // far city again for depth
    float c3 = city(uv * vec2(0.7, 0.9) + vec2(0.1, 0.0), 9.0, t*0.3);
    sky = mix(sky, vec3(0.06, 0.0, 0.12), c3 * 0.7);
    sky += vec3(1.0, 0.0, 0.4) * c3 * 0.4;

    // fog / atmosphere
    float fog = smoothstep(0.0, 0.4, uv.y);
    sky = mix(sky * 0.6 + vec3(0.6, 0.1, 0.4) * 0.4, sky, fog);

    // scanlines
    sky *= scanline(uv, uTime);

    // glitch shift
    float gx = glitch(uv, uTime);
    sky.r += gx * 0.6;
    sky.b -= gx * 0.3;

    // chromatic shimmer on scroll
    float shift = p * 0.04;
    vec3 chroma;
    chroma.r = sky.r * (1.0 + shift);
    chroma.g = sky.g;
    chroma.b = sky.b * (1.0 - shift);
    sky = mix(sky, chroma, 0.7);

    // vignette
    float v = smoothstep(1.1, 0.3, length(uv - 0.5));
    sky *= v;

    // grain
    sky += (hash(uv * uRes + uTime) - 0.5) * 0.04;

    gl_FragColor = vec4(sky, 1.0);
  }
`;

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export function CyberpunkVideo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    renderer.setSize(w, h, false);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uRes: { value: new THREE.Vector2(w, h) },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
    });
    const geo = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const onResize = () => {
      const ww = wrap.clientWidth;
      const wh = wrap.clientHeight;
      renderer.setSize(ww, wh, false);
      uniforms.uRes.value.set(ww, wh);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    let p = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      const rect = wrap.getBoundingClientRect();
      const total = wrap.clientHeight - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), total);
      const target = total > 0 ? passed / total : 0;
      p += (target - p) * 0.1;
      uniforms.uProgress.value = p;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative h-[260vh] w-full bg-ink-950"
      aria-label="Cyberpunk cinematic"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 h-full w-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/30 via-transparent to-ink-950/70" />
        <div className="pointer-events-none absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 md:left-12 md:top-12">
          <span className="text-neon-pink">REC</span>
          <span className="ml-3 inline-block h-2 w-2 animate-pulse rounded-full bg-neon-pink align-middle" />
          <span className="ml-3 text-white/30">
            CH 04 · NEON DISTRICT · 23:47
          </span>
        </div>
        <div className="pointer-events-none absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 md:bottom-12 md:right-12">
          ISO 6400 · 24FPS · 4K
        </div>
      </div>
    </section>
  );
}
