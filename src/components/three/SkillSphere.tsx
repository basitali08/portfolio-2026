"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import type { Skill } from "@/lib/data";

export function SkillSphere({ skills }: { skills: Skill[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || skills.length === 0) return;

    const el = ref.current;
    const size = el.clientWidth || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    el.appendChild(renderer.domElement);

    const wireSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 32, 32),
      new THREE.MeshBasicMaterial({
        color: "#8b5cf6",
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      }),
    );

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const l1 = new THREE.PointLight("#00e5ff", 1.2);
    l1.position.set(10, 10, 10);
    scene.add(l1);
    const l2 = new THREE.PointLight("#ff3df0", 0.8);
    l2.position.set(-10, -10, -5);
    scene.add(l2);

    const group = new THREE.Group();
    group.add(wireSphere);
    scene.add(group);

    const total = skills.length;
    skills.forEach((skill, i) => {
      const phi = Math.acos(-1 + (2 * (i + 0.5)) / total);
      const theta = Math.sqrt(total * Math.PI) * phi;
      const r = 2.2;
      const color =
        skill.category === "language"
          ? "#00e5ff"
          : skill.category === "framework"
          ? "#8b5cf6"
          : skill.category === "tool"
          ? "#a3ff12"
          : skill.category === "design"
          ? "#ff3df0"
          : "#ffb020";
      const node = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.18, 0),
        new THREE.MeshPhysicalMaterial({
          color,
          emissive: color,
          emissiveIntensity: 1.2,
          roughness: 0.2,
          metalness: 0.6,
        }),
      );
      node.position.set(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi),
      );
      group.add(node);
    });

    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      group.rotation.y += 0.002;
      group.rotation.x += (mouse.y * 0.3 - group.rotation.x) * 0.03;
      group.rotation.z += (mouse.x * 0.2 - group.rotation.z) * 0.03;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      const s = el.clientWidth || size;
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(s, s);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [skills]);

  return <div ref={ref} className="h-full w-full" />;
}
