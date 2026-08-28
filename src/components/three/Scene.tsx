"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

export function Scene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    ref.current.appendChild(renderer.domElement);

    const COLOR_IN = new THREE.Color("#00e5ff");
    const COLOR_HIDDEN = new THREE.Color("#8b5cf6");
    const COLOR_OUT = new THREE.Color("#a3ff12");
    const COLOR_PULSE = new THREE.Color("#ffffff");

    const LAYERS = [6, 9, 9, 6];
    const LAYER_X = [-6, -2, 2, 6];
    const NODES: THREE.Vector3[] = [];
    const NODE_COLORS: THREE.Color[] = [];
    const NODE_LAYER: number[] = [];

    const nodeGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const nodesGroup = new THREE.Group();

    for (let l = 0; l < LAYERS.length; l++) {
      const n = LAYERS[l];
      const x = LAYER_X[l];
      const c =
        l === 0
          ? COLOR_IN
          : l === LAYERS.length - 1
            ? COLOR_OUT
            : COLOR_HIDDEN;
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n;
        const y = (t - 0.5) * 7;
        const z = (Math.random() - 0.5) * 0.4;
        const pos = new THREE.Vector3(x, y, z);
        NODES.push(pos);
        NODE_COLORS.push(c);
        NODE_LAYER.push(l);
        const mat = new THREE.MeshBasicMaterial({
          color: c,
          transparent: true,
          opacity: 0.9,
        });
        const mesh = new THREE.Mesh(nodeGeo, mat);
        mesh.position.copy(pos);
        nodesGroup.add(mesh);

        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 12, 12),
          new THREE.MeshBasicMaterial({
            color: c,
            transparent: true,
            opacity: 0.18,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        halo.position.copy(pos);
        nodesGroup.add(halo);
      }
    }
    scene.add(nodesGroup);

    type Edge = {
      from: THREE.Vector3;
      to: THREE.Vector3;
      fromIdx: number;
      toIdx: number;
      weight: number;
      active: number;
      cooldown: number;
      mat: THREE.LineBasicMaterial;
    };
    const edges: Edge[] = [];

    let edgeIdx = 0;
    for (let l = 0; l < LAYERS.length - 1; l++) {
      const start = NODES.findIndex((_, i) => NODE_LAYER[i] === l);
      const end = NODES.findIndex((_, i) => NODE_LAYER[i] === l + 1);
      const countA = LAYERS[l];
      const countB = LAYERS[l + 1];
      for (let a = 0; a < countA; a++) {
        for (let b = 0; b < countB; b++) {
          const from = NODES[start + a];
          const to = NODES[end + b];
          const skip = Math.random() < 0.35;
          const weight = 0.15 + Math.random() * 0.55;
          if (skip) {
            edgeIdx++;
            continue;
          }
          const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
          const mat = new THREE.LineBasicMaterial({
            color: COLOR_HIDDEN,
            transparent: true,
            opacity: 0.12 * weight,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          });
          const line = new THREE.Line(geo, mat);
          scene.add(line);
          edges.push({
            from,
            to,
            fromIdx: start + a,
            toIdx: end + b,
            weight,
            active: 0,
            cooldown: Math.random() * 3,
            mat,
          });
          edgeIdx++;
        }
      }
    }

    const pulseGeo = new THREE.SphereGeometry(0.09, 10, 10);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: COLOR_PULSE,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    type Pulse = { mesh: THREE.Mesh; edge: Edge; t: number; speed: number };
    const pulses: Pulse[] = [];
    const PULSE_POOL = 90;
    for (let i = 0; i < PULSE_POOL; i++) {
      const m = new THREE.Mesh(pulseGeo, pulseMat.clone());
      m.visible = false;
      scene.add(m);
      pulses.push({ mesh: m, edge: edges[0], t: 0, speed: 1 });
    }
    let pulseCursor = 0;

    const spawnPulse = () => {
      const edge = edges[Math.floor(Math.random() * edges.length)];
      const p = pulses[pulseCursor];
      pulseCursor = (pulseCursor + 1) % PULSE_POOL;
      p.edge = edge;
      p.t = 0;
      p.speed = 0.35 + Math.random() * 0.5;
      p.mesh.position.copy(edge.from);
      (p.mesh.material as THREE.MeshBasicMaterial).color.copy(COLOR_PULSE);
      (p.mesh.material as THREE.MeshBasicMaterial).opacity = 0.95;
      p.mesh.visible = true;
      p.mesh.scale.setScalar(0.6 + Math.random() * 0.8);
    };

    const dataParticlesCount = 700;
    const dPos = new Float32Array(dataParticlesCount * 3);
    for (let i = 0; i < dataParticlesCount; i++) {
      dPos[i * 3] = (Math.random() - 0.5) * 24;
      dPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      dPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4;
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
    const dataParticles = new THREE.Points(
      dGeo,
      new THREE.PointsMaterial({
        size: 0.025,
        color: "#8b5cf6",
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(dataParticles);

    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / w) * 2 - 1;
      mouse.y = -(e.clientY / h) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let scrollProg = 0;
    const onScroll = () => {
      const sh = document.documentElement.scrollHeight - window.innerHeight;
      scrollProg = sh > 0 ? window.scrollY / sh : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    let pulseTimer = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      const dt = Math.min(0.05, clock.getDelta());
      const s = scrollProg;

      pulseTimer += dt;
      if (pulseTimer > 0.05) {
        pulseTimer = 0;
        spawnPulse();
        if (Math.random() < 0.3) spawnPulse();
      }

      for (const p of pulses) {
        if (!p.mesh.visible) continue;
        p.t += dt * p.speed;
        if (p.t >= 1) {
          p.mesh.visible = false;
          continue;
        }
        p.mesh.position.lerpVectors(p.edge.from, p.edge.to, p.t);
        const fade = 1 - Math.abs(p.t - 0.5) * 2;
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = 0.4 + fade * 0.6;
      }

      const breathe = 0.85 + Math.sin(t * 1.5) * 0.15;
      nodesGroup.children.forEach((child, i) => {
        if ("material" in child) {
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (i % 2 === 0) {
            mat.opacity = 0.6 + Math.sin(t * 1.2 + i) * 0.3;
          }
        }
      });

      dataParticles.rotation.y = t * 0.02;
      dataParticles.rotation.x = Math.sin(t * 0.1) * 0.1;

      nodesGroup.rotation.y = mouse.x * 0.15;
      nodesGroup.rotation.x = mouse.y * 0.1 - s * 0.3;
      nodesGroup.position.y = s * -1.5;

      camera.position.z = 10 - s * 3;
      camera.position.y = s * 0.8;
      camera.position.x = mouse.x * 0.4;
      camera.lookAt(0, s * -0.5, 0);

      const fadeEdges = 0.15 + (1 - s) * 0.25;
      for (const e of edges) {
        e.mat.opacity = fadeEdges * e.weight;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      camera.aspect = ww / wh;
      camera.updateProjectionMatrix();
      renderer.setSize(ww, wh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (ref.current?.contains(renderer.domElement))
        ref.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
