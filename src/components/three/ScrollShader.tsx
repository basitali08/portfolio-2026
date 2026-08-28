"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ScrollShader() {
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
    camera.position.z = 4;

    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color("#00e5ff") },
      uColorB: { value: new THREE.Color("#8b5cf6") },
      uColorC: { value: new THREE.Color("#a3ff12") },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vPos;
        void main() {
          vUv = uv;
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        varying vec3 vPos;
        uniform float uTime;
        uniform float uProgress;
        uniform vec2 uMouse;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;

        // Simplex 3D noise by Ashima
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

        void main() {
          vec2 uv = vUv;
          float p = uProgress;

          // Mouse-driven swirl
          vec2 m = (uMouse - 0.5) * 0.4;
          vec2 p1 = uv + m * 0.2;

          // Layered noise driven by time + scroll
          float n1 = snoise(vec3(p1 * 2.5, uTime * 0.18 + p * 1.5));
          float n2 = snoise(vec3(p1 * 5.0 + n1, uTime * 0.35 - p * 2.0));
          float n3 = snoise(vec3(p1 * 10.0, uTime * 0.5 + p * 3.0));

          float field = n1 * 0.6 + n2 * 0.3 + n3 * 0.15;
          field = field * 0.5 + 0.5;

          // Three-stop gradient that morphs with progress
          vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 0.5, field));
          col = mix(col, uColorC, smoothstep(0.5, 1.0, field) * (0.4 + p * 0.6));

          // Vignette
          float v = smoothstep(1.1, 0.3, length(uv - 0.5));
          col *= v;

          // Scroll-driven distortion
          float warp = sin(uv.x * 8.0 + uTime + p * 6.0) * 0.05 * p;
          col += warp * uColorC;

          // Soft glow ramp
          col = pow(col, vec3(0.9));
          col *= 1.0 + p * 0.4;

          gl_FragColor = vec4(col, 0.85);
        }
      `,
    });

    const geo = new THREE.PlaneGeometry(8, 5, 1, 1);
    const mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);

    const mouse = { x: 0.5, y: 0.5 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const onResize = () => {
      const ww = wrap.clientWidth;
      const wh = wrap.clientHeight;
      camera.aspect = ww / wh;
      camera.updateProjectionMatrix();
      renderer.setSize(ww, wh, false);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      uniforms.uTime.value = clock.getElapsedTime();

      // Compute scroll progress through the wrap element
      const rect = wrap.getBoundingClientRect();
      const total = wrap.clientHeight - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? passed / total : 0;
      uniforms.uProgress.value = THREE.MathUtils.lerp(
        uniforms.uProgress.value,
        p,
        0.12,
      );
      uniforms.uMouse.value.x += (mouse.x - uniforms.uMouse.value.x) * 0.08;
      uniforms.uMouse.value.y += (mouse.y - uniforms.uMouse.value.y) * 0.08;

      mesh.scale.setScalar(1 + p * 0.15);
      mesh.rotation.z = p * 0.3;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      material.dispose();
      geo.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative h-[300vh] w-full"
      aria-label="Scroll-driven shader"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 h-full w-full"
        />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            Scroll · Driven · Shader
          </p>
          <h2 className="h-display mt-4 text-4xl font-light tracking-tighter md:text-7xl">
            Data <span className="gradient-text">flows</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-sm text-white/60 md:text-base">
            Every scroll tick is a uniform — a fragment shader painting the
            field between raw data and a deployed model. Noise distorts, colors
            shift, and the canvas scrubs with you.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-white/40">
            <span className="h-px w-12 bg-white/20" />
            <span>keep scrolling</span>
            <span className="h-px w-12 bg-white/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
