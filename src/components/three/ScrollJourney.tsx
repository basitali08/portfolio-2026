"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const GEO_TYPES = [
  "IcosahedronGeometry",
  "OctahedronGeometry",
  "DodecahedronGeometry",
  "TorusKnotGeometry",
] as const;

const PALETTE = [
  new THREE.Color("#00e5ff"),
  new THREE.Color("#8b5cf6"),
  new THREE.Color("#a3ff12"),
  new THREE.Color("#ff3df0"),
];

const VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vPos;
  varying vec3 vNormal;
  varying float vDist;
  uniform float uTime;
  uniform float uProgress;

  void main() {
    vUv = uv;
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vDist = length(worldPos.xyz);
    vec3 pos = position;
    float wave = sin(pos.y * 2.0 + uTime + uProgress * 4.0) * 0.05;
    pos.x += wave;
    pos.z += cos(pos.x * 2.0 + uTime * 0.5) * 0.05;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  varying vec2 vUv;
  varying vec3 vPos;
  varying vec3 vNormal;
  varying float vDist;
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uColor;

  void main() {
    float fresnel = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    fresnel = pow(fresnel, 2.0);

    float pulse = sin(uTime * 2.0 + vDist * 0.5) * 0.3 + 0.7;

    vec3 col = uColor * (0.4 + fresnel * 0.8);
    col += uColor * fresnel * pulse * 0.6;

    float alpha = 0.3 + fresnel * 0.5 + uProgress * 0.2;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(col, alpha);
  }
`;

const PARTICLE_VERT = `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  uniform float uTime;
  uniform float uProgress;

  void main() {
    vColor = aColor;
    vec3 pos = position;
    float drift = sin(uTime * 0.3 + pos.x * 2.0 + pos.z * 2.0) * 0.3;
    pos.y += drift * 0.5;
    pos.x += sin(uTime * 0.2 + pos.y) * 0.2;
    pos.z += cos(uTime * 0.2 + pos.x) * 0.2;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const PARTICLE_FRAG = `
  varying vec3 vColor;
  uniform float uProgress;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d);
    alpha *= 0.6 + uProgress * 0.3;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

function randomInBox(bound: number): number {
  return (Math.random() - 0.5) * bound * 2;
}

export function ScrollJourney() {
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
    renderer.setSize(wrap.clientWidth, wrap.clientHeight, false);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050510, 0.035);

    const camera = new THREE.PerspectiveCamera(
      60,
      wrap.clientWidth / wrap.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 12);

    // --- Geometric objects ---
    const objects: {
      mesh: THREE.Mesh;
      initialPos: THREE.Vector3;
      rotSpeed: THREE.Vector3;
      phase: number;
    }[] = [];
    const objGroup = new THREE.Group();
    scene.add(objGroup);

    const COUNT = 28;

    for (let i = 0; i < COUNT; i++) {
      const GeoClass =
        GEO_TYPES[Math.floor(Math.random() * GEO_TYPES.length)];
      const geo = new THREE[GeoClass](
        ...(GeoClass === "TorusKnotGeometry"
          ? [0.3 + Math.random() * 0.3, 0.1 + Math.random() * 0.1, 64, 8]
          : [0.2 + Math.random() * 0.4, 0]) as ConstructorParameters<typeof THREE[typeof GeoClass]>,
      );

      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)].clone();
      const uniforms = {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uColor: { value: color },
      };

      const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geo, mat);
      const pos = new THREE.Vector3(
        randomInBox(8),
        randomInBox(5),
        randomInBox(10) - 3,
      );
      mesh.position.copy(pos);
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      );
      mesh.scale.setScalar(0.5 + Math.random() * 0.8);

      objGroup.add(mesh);

      objects.push({
        mesh,
        initialPos: pos.clone(),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
        ),
        phase: Math.random() * Math.PI * 2,
      });
    }

    // --- Particles ---
    const PARTICLE_COUNT = 2000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PARTICLE_COUNT * 3);
    const pSize = new Float32Array(PARTICLE_COUNT);
    const pColor = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPos[i * 3] = randomInBox(14);
      pPos[i * 3 + 1] = randomInBox(8);
      pPos[i * 3 + 2] = randomInBox(14) - 2;

      pSize[i] = 1 + Math.random() * 4;

      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      pColor[i * 3] = c.r;
      pColor[i * 3 + 1] = c.g;
      pColor[i * 3 + 2] = c.b;
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("aSize", new THREE.BufferAttribute(pSize, 1));
    pGeo.setAttribute("aColor", new THREE.BufferAttribute(pColor, 3));

    const pMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
      },
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // --- Resize ---
    const onResize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", onResize);

    // --- Animation loop ---
    let raf = 0;
    let currentP = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const dt = Math.min(0.05, clock.getDelta());
      const elapsed = clock.getElapsedTime();

      const rect = wrap.getBoundingClientRect();
      const total = wrap.clientHeight - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), total);
      currentP += ((total > 0 ? passed / total : 0) - currentP) * 0.06;

      // Camera flythrough
      const orbitAngle = currentP * Math.PI * 2;
      const heightOffset = Math.sin(currentP * Math.PI) * 2;
      camera.position.x = Math.sin(orbitAngle) * 10;
      camera.position.y = heightOffset + 0.5;
      camera.position.z = 2 - currentP * 8;
      camera.lookAt(0, 0, currentP * -4);

      // Objects
      objects.forEach((obj, i) => {
        const u = obj.mesh.material as THREE.ShaderMaterial;
        u.uniforms.uTime.value = elapsed;
        u.uniforms.uProgress.value = currentP;

        obj.mesh.rotation.x += obj.rotSpeed.x;
        obj.mesh.rotation.y += obj.rotSpeed.y;
        obj.mesh.rotation.z += obj.rotSpeed.z;

        const drift = Math.sin(currentP * 4 + obj.phase + i) * 0.5;
        obj.mesh.position.x = obj.initialPos.x + drift * 0.3;
        obj.mesh.position.y =
          obj.initialPos.y + Math.sin(elapsed * 0.5 + obj.phase) * 0.2;
        obj.mesh.position.z =
          obj.initialPos.z - currentP * 2 + Math.sin(elapsed * 0.3 + i) * 0.3;

        const sc = 0.6 + Math.sin(currentP * 3 + obj.phase) * 0.2 + 0.3;
        obj.mesh.scale.setScalar(sc);
      });

      // Particles
      pMat.uniforms.uTime.value = elapsed;
      pMat.uniforms.uProgress.value = currentP;
      particles.rotation.y = currentP * 0.2;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      objects.forEach((obj) => {
        obj.mesh.geometry.dispose();
        (obj.mesh.material as THREE.Material).dispose();
      });
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative h-[300vh] w-full"
      aria-label="3D Journey"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute inset-0 h-full w-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/30 via-transparent to-ink-950/60" />
      </div>
    </section>
  );
}
