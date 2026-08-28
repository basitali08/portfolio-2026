"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const SHADER_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vPos;
  varying vec3 vNormal;
  uniform float uTime;
  uniform float uProgress;
  uniform float uSeed;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(
              i.z+vec4(0.0,i1.z,i2.z,1.0))
              +i.y+vec4(0.0,i1.y,i2.y,1.0))
              +i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * snoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  // 1D network layer of soft neurons along an axis
  float neurons(float u, float t, float seed) {
    float v = 0.0;
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      float center = fract(fi * 0.17 + seed);
      float w = sin(t * (0.4 + fi * 0.13) + fi + seed * 6.28) * 0.5 + 0.5;
      float d = abs(u - center);
      d = min(d, 1.0 - d);
      v += smoothstep(0.06, 0.0, d) * w;
    }
    return v;
  }

  // Synapse lines connecting two neuron strips
  float synapses(float u, float v, float t, float seed) {
    float total = 0.0;
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float x0 = fract(fi * 0.23 + seed);
      float y0 = fract(fi * 0.31 + seed * 1.7);
      float phase = t * (0.5 + fi * 0.2) + seed * 6.28;
      float on = step(0.5, sin(phase) * 0.5 + 0.5);
      float d = distance(vec2(u, v), vec2(x0, y0));
      total += smoothstep(0.02, 0.0, d) * on;
    }
    return total;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.5 + uSeed * 10.0;
    float p = uProgress;

    float n1 = fbm(vec3(uv * 3.0, t * 0.3 + p * 2.0 + uSeed));
    float n2 = fbm(vec3(uv * 6.0 + n1, t * 0.5 - p * 1.5 + uSeed * 2.0));

    vec3 col = mix(uColorA, uColorB, smoothstep(-0.4, 0.4, n1));
    col = mix(col, uColorC, smoothstep(0.2, 0.8, n2) * (0.5 + p * 0.5));

    // Neural layer
    float n = neurons(uv.x, t, uSeed);
    col += n * uColorC * 1.2;
    float s = synapses(uv.x, uv.y, t, uSeed);
    col += s * uColorA * 1.5;

    // Scroll-driven pulse rings
    float r = length(uv - 0.5);
    float ring = sin(r * 40.0 - t * 2.0 - p * 10.0) * 0.5 + 0.5;
    ring *= smoothstep(0.55, 0.0, r);
    col += ring * 0.3 * uColorB * (0.5 + p);

    // Vignette toward edges
    col *= smoothstep(0.7, 0.2, r);

    // Slight color grade
    col = pow(col, vec3(0.95));
    col *= 1.1;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const SHADER_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vPos = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export function ScrollCinematic() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    renderer.setSize(w, h, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 14);

    const PALETTES = [
      {
        a: new THREE.Color("#00e5ff"),
        b: new THREE.Color("#8b5cf6"),
        c: new THREE.Color("#a3ff12"),
      },
      {
        a: new THREE.Color("#8b5cf6"),
        b: new THREE.Color("#ff3df0"),
        c: new THREE.Color("#00e5ff"),
      },
      {
        a: new THREE.Color("#a3ff12"),
        b: new THREE.Color("#00e5ff"),
        c: new THREE.Color("#ff3df0"),
      },
    ];

    type Ring = {
      group: THREE.Group;
      mesh: THREE.Mesh;
      uniforms: { [k: string]: { value: any } };
      basePos: THREE.Vector3;
      baseRot: THREE.Euler;
      spinAxis: THREE.Vector3;
      spinSpeed: number;
    };
    const rings: Ring[] = [];
    const RING_DEFS = [
      { radius: 2.4, tube: 0.12, radial: 24, tubular: 200, palette: 0 },
      { radius: 1.7, tube: 0.09, radial: 24, tubular: 160, palette: 1 },
      { radius: 1.1, tube: 0.07, radial: 24, tubular: 140, palette: 2 },
      { radius: 3.2, tube: 0.05, radial: 24, tubular: 220, palette: 1 },
    ];

    for (const def of RING_DEFS) {
      const pal = PALETTES[def.palette];
      const uniforms = {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uSeed: { value: Math.random() * 10 },
        uColorA: { value: pal.a },
        uColorB: { value: pal.b },
        uColorC: { value: pal.c },
      };
      const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: SHADER_VERT,
        fragmentShader: SHADER_FRAG,
        side: THREE.DoubleSide,
        transparent: true,
      });
      const geo = new THREE.TorusGeometry(
        def.radius,
        def.tube,
        def.radial,
        def.tubular,
      );
      const mesh = new THREE.Mesh(geo, mat);
      const group = new THREE.Group();
      group.add(mesh);
      scene.add(group);

      const axis = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      ).normalize();

      rings.push({
        group,
        mesh,
        uniforms,
        basePos: group.position.clone(),
        baseRot: group.rotation.clone(),
        spinAxis: axis,
        spinSpeed: 0.15 + Math.random() * 0.35,
      });
    }

    rings[0].basePos.set(0, 0.5, 0);
    rings[0].baseRot.set(0.1, 0, 0);
    rings[1].basePos.set(0.5, -0.3, -1.0);
    rings[1].baseRot.set(0.3, Math.PI / 4, 0.2);
    rings[2].basePos.set(-0.4, 0.2, -2.0);
    rings[2].baseRot.set(-0.2, -Math.PI / 5, 0.1);
    rings[3].basePos.set(0, -0.8, 0.5);
    rings[3].baseRot.set(Math.PI / 2, 0, 0);

    // Glow spheres at ring centers
    const coreCount = 60;
    const coreGeo = new THREE.BufferGeometry();
    const cpos = new Float32Array(coreCount * 3);
    for (let i = 0; i < coreCount; i++) {
      cpos[i * 3] = (Math.random() - 0.5) * 18;
      cpos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      cpos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    coreGeo.setAttribute("position", new THREE.BufferAttribute(cpos, 3));
    const cores = new THREE.Points(
      coreGeo,
      new THREE.PointsMaterial({
        size: 0.05,
        color: "#ffffff",
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(cores);

    const onResize = () => {
      const ww = wrap.clientWidth;
      const wh = wrap.clientHeight;
      camera.aspect = ww / wh;
      camera.updateProjectionMatrix();
      renderer.setSize(ww, wh, false);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    let currentP = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      const dt = Math.min(0.05, clock.getDelta());

      const rect = wrap.getBoundingClientRect();
      const total = wrap.clientHeight - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), total);
      const target = total > 0 ? passed / total : 0;
      currentP += (target - currentP) * 0.08;

      // Ring spin + scroll-driven motion
      rings.forEach((r, i) => {
        r.mesh.rotation.x += r.spinSpeed * dt;
        r.mesh.rotation.y += r.spinSpeed * 0.6 * dt;
        r.uniforms.uTime.value = t;
        r.uniforms.uProgress.value = currentP;

        const orbit = currentP * Math.PI * 2;
        const lift = Math.sin(orbit + i) * 0.6;
        const spread = currentP * 4;
        r.group.position.x =
          r.basePos.x + Math.cos(orbit * 0.5 + i) * spread * 0.4;
        r.group.position.y = r.basePos.y + lift;
        r.group.position.z = r.basePos.z - currentP * 2;
        r.group.rotation.x =
          r.baseRot.x + Math.sin(orbit + i) * 0.5 + currentP * 0.6;
        r.group.rotation.y =
          r.baseRot.y + currentP * Math.PI * (i % 2 === 0 ? 1 : -1);
        r.group.rotation.z = r.baseRot.z + currentP * 0.4;

        const s = 1 + Math.sin(orbit * 2 + i) * 0.08 + currentP * 0.2;
        r.group.scale.setScalar(s);
      });

      // Camera moves on scroll
      camera.position.x = Math.sin(currentP * Math.PI * 2) * 1.2;
      camera.position.y = Math.cos(currentP * Math.PI) * 0.8;
      camera.position.z = 14 - currentP * 4;
      camera.lookAt(0, 0, 0);

      cores.rotation.y = t * 0.05;
      (cores.material as THREE.PointsMaterial).opacity =
        0.3 + (1 - currentP) * 0.4;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      rings.forEach((r) => {
        r.mesh.geometry.dispose();
        (r.mesh.material as THREE.Material).dispose();
      });
      coreGeo.dispose();
      (cores.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative h-[260vh] w-full"
      aria-label="Cinematic 3D"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 h-full w-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-950/60" />
      </div>
    </section>
  );
}
