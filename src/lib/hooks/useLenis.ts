"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";

export function useLenis() {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      lerp: 0.1,
    });

    let rafId = 0;
    function raf(time: number) {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    setLenis(instance);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
    };
  }, []);

  return lenis;
}
