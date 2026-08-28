"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

export function Avatar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const size = el.clientWidth || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    el.appendChild(renderer.domElement);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhysicalMaterial({
        color: "#0f1320",
        emissive: "#8b5cf6",
        emissiveIntensity: 0.6,
        roughness: 0.15,
        metalness: 0.85,
      }),
    );
    head.position.set(0, 0.3, 0);

    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.45, 0.012, 16, 100),
      new THREE.MeshBasicMaterial({ color: "#00e5ff" }),
    );
    ring1.rotation.x = Math.PI / 2.4;

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.7, 0.006, 16, 120),
      new THREE.MeshBasicMaterial({
        color: "#ff3df0",
        transparent: true,
        opacity: 0.7,
      }),
    );
    ring2.rotation.x = Math.PI / 2;
    ring2.rotation.y = 0.2;

    const ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(2.0, 0.004, 16, 140),
      new THREE.MeshBasicMaterial({
        color: "#a3ff12",
        transparent: true,
        opacity: 0.5,
      }),
    );
    ring3.rotation.x = 0.2;
    ring3.rotation.y = Math.PI / 2.5;

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const l1 = new THREE.PointLight("#00e5ff", 1.5);
    l1.position.set(5, 5, 5);
    scene.add(l1);
    const l2 = new THREE.PointLight("#ff3df0", 1);
    l2.position.set(-5, -3, 3);
    scene.add(l2);
    const l3 = new THREE.PointLight("#a3ff12", 0.8);
    l3.position.set(0, -5, -5);
    scene.add(l3);

    const group = new THREE.Group();
    group.add(head, ring1, ring2, ring3);
    scene.add(group);

    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      group.rotation.y += 0.005;
      group.rotation.x += (mouse.y * 0.4 - group.rotation.x) * 0.05;
      group.rotation.y += (mouse.x * 0.6 - group.rotation.y) * 0.05;
      head.position.y = 0.3 + Math.sin(t * 1.6) * 0.08;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative aspect-square w-full max-w-md">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.4), transparent 60%)",
          filter: "blur(40px)",
        }}
      />
      <div ref={ref} className="h-full w-full" />
    </div>
  );
}
