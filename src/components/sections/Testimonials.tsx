"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useCallback } from "react";
import { Quote } from "lucide-react";
import { testimonials } from "@/lib/data";
import { Parallax } from "@/components/ui/Parallax";

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  // Duplicate for infinite marquee
  const items = [...testimonials, ...testimonials];

  const handlePause = useCallback(() => {
    pausedRef.current = true;
  }, []);
  const handleResume = useCallback(() => {
    pausedRef.current = false;
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    let x = 0;
    const speed = 0.4;
    const tick = () => {
      if (!pausedRef.current) {
        x -= speed;
        const half = el.scrollWidth / 2;
        if (-x >= half) x = 0;
        el.style.transform = `translate3d(${x}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="testimonials" className="section-pad relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <Parallax speed={0.3} axis="y" offset={60}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40"
          >
            <span className="text-neon-cyan">06</span> · Testimonials
          </motion.div>
        </Parallax>
        <Parallax speed={0.5} axis="both" offset={100}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="h-display mt-4 max-w-3xl text-4xl font-light tracking-tighter md:text-6xl"
          >
            What people <span className="gradient-text">say back</span>.
          </motion.h2>
        </Parallax>
      </div>

      <div
        className="relative mt-16"
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
        onFocus={handlePause}
        onBlur={handleResume}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-ink-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-ink-950 to-transparent" />
        <div ref={trackRef} className="flex w-max gap-6 px-6 will-change-transform">
          {items.map((t, i) => (
            <article
              key={`${t.id}-${i}`}
              className="glass w-[360px] shrink-0 rounded-2xl p-6 md:w-[440px]"
              data-cursor="hover"
              tabIndex={0}
              aria-label={`Testimonial from ${t.name}`}
            >
              <Quote className="h-5 w-5 text-neon-cyan" />
              <p className="mt-4 text-pretty text-base text-white/80 md:text-lg">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-violet/30 text-sm font-medium">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm text-white">{t.name}</div>
                  <div className="text-xs text-white/50">
                    {t.role} · {t.company}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
