"use client";

import { useEffect, useRef, useState } from "react";

export function useMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [normalized, setNormalized] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      setPos({ x: e.clientX, y: e.clientY });
      setNormalized({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.15;
      current.current.y += (target.current.y - current.current.y) * 0.15;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return { pos, normalized, smoothed: current };
}
