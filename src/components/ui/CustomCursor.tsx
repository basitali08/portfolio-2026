"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<"default" | "hover" | "text">("default");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let rx = 0,
      ry = 0,
      mx = 0,
      my = 0,
      raf = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
    };
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t) return;
      if (t.closest("[data-cursor='hover'], a, button, [role='button']")) {
        setVariant("hover");
      } else if (t.closest("[data-cursor='text'], h1, h2, p")) {
        setVariant("text");
      } else {
        setVariant("default");
      }
    };
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        className={cn(
          "custom-cursor pointer-events-none fixed left-0 top-0 z-[120] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-[width,height,opacity] duration-200 ease-out",
          hidden && "opacity-0",
          variant === "default" && "h-8 w-8",
          variant === "hover" && "h-14 w-14",
          variant === "text" && "h-2 w-12",
        )}
        style={{
          borderRadius: 9999,
          border: "1px solid rgba(255,255,255,0.7)",
        }}
      />
      <div
        ref={dot}
        className={cn(
          "custom-cursor-dot pointer-events-none fixed left-0 top-0 z-[121] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-opacity",
          hidden && "opacity-0",
        )}
      />
    </>
  );
}
