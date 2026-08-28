"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { profile, type Skill } from "@/lib/data";
import { SkillSphereClient as SkillSphere } from "@/components/three/SkillSphereClient";
import { Parallax } from "@/components/ui/Parallax";
import { cn } from "@/lib/utils";

const categories: Array<Skill["category"] | "all"> = [
  "all",
  "language",
  "framework",
  "tool",
  "design",
  "soft",
];

export function Skills() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("all");
  const filtered =
    filter === "all" ? profile.skills : profile.skills.filter((s) => s.category === filter);

  return (
    <section id="skills" className="section-pad relative">
      <div className="mx-auto max-w-7xl">
        <Parallax speed={0.35} axis="y" offset={80}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40"
          >
            <span className="text-neon-cyan">05</span> · Skills
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
            Things I'm <span className="gradient-text">sharp at</span>.
          </motion.h2>
        </Parallax>

        <div className="mt-12 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              data-cursor="hover"
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs uppercase tracking-wider transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60",
                filter === c
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <SkillSphere skills={filtered} />
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-white/90">{s.name}</span>
                  <span className="font-mono text-[10px] text-white/40">
                    {s.level}
                  </span>
                </div>
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
