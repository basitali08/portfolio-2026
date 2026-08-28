"use client";

import { ReactNode, useEffect } from "react";
import { useLenis } from "@/lib/hooks/useLenis";
import { useScrollProgress } from "@/lib/hooks/useScrollProgress";

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenis = useLenis();
  useScrollProgress();

  useEffect(() => {
    let mounted = true;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        if (!mounted || !lenis) return;
        gsap.registerPlugin(ScrollTrigger);
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
        ScrollTrigger.refresh();
      });
    });
    return () => {
      mounted = false;
    };
  }, [lenis]);

  return <>{children}</>;
}
