"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { profile } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { Parallax } from "@/components/ui/Parallax";

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1600 });
  const display = useTransform(spring, (v) => formatNumber(Math.round(v)));

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      <motion.span>{display}</motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

export function About() {
  return (
    <section id="about" className="section-pad relative">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <Parallax speed={0.4} axis="both" offset={60}>
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40"
              >
                <span className="text-neon-cyan">01</span> · About
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
                className="h-display mt-4 text-4xl font-light tracking-tighter md:text-5xl"
              >
                Turning data <span className="gradient-text">into decisions</span>.
              </motion.h2>
            </div>
          </Parallax>
          <Parallax speed={0.2} axis="y" offset={40}>
            <div className="space-y-6 text-pretty text-lg leading-relaxed text-white/80">
              {profile.bio.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </Parallax>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
          {profile.achievements.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass rounded-2xl p-6"
            >
              <div className="h-display text-4xl font-light tracking-tight text-white">
                <Counter value={a.value} suffix={a.suffix} />
              </div>
              <div className="mt-2 text-xs uppercase tracking-wider text-white/50">
                {a.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
