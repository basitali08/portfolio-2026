"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Briefcase, MapPin, Calendar, ChevronDown } from "lucide-react";
import { experience } from "@/lib/data";
import { Parallax } from "@/components/ui/Parallax";
import { cn } from "@/lib/utils";

export function Experience() {
  const [open, setOpen] = useState<string | null>(experience[0]?.id ?? null);

  return (
    <section id="experience" className="section-pad relative">
      <div className="mx-auto max-w-7xl">
        <Parallax speed={0.3} axis="y" offset={60}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40"
          >
            <span className="text-neon-cyan">02</span> · Experience
          </motion.div>
        </Parallax>
        <Parallax speed={0.45} axis="both" offset={120}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="h-display mt-4 max-w-3xl text-4xl font-light tracking-tighter md:text-6xl"
          >
            A short, opinionated{" "}
            <span className="gradient-text">career arc</span>.
          </motion.h2>
        </Parallax>

        <div className="mt-16 space-y-4">
          {experience.map((exp, i) => {
            const isOpen = open === exp.id;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={cn(
                  "glass overflow-hidden rounded-2xl transition-all duration-500",
                  isOpen && "neon-border",
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : exp.id)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neon-cyan/60"
                  data-cursor="hover"
                  aria-expanded={isOpen}
                  aria-controls={`exp-content-${exp.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02]">
                      <Briefcase className="h-5 w-5 text-neon-cyan" />
                    </div>
                    <div>
                      <div className="font-display text-xl tracking-tight">
                        {exp.role}
                      </div>
                      <div className="mt-0.5 text-sm text-white/60">
                        {exp.company}
                        {exp.location && (
                          <>
                            <span className="mx-2 text-white/30">·</span>
                            <MapPin className="mr-1 inline h-3 w-3" />
                            {exp.location}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <Calendar className="h-3 w-3" />
                    {exp.start} — {exp.end}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </div>
                </button>
                <motion.div
                  id={`exp-content-${exp.id}`}
                  role="region"
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 border-t border-white/5 p-6 pt-5">
                    <ul className="space-y-2 text-sm text-white/80">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="flex gap-3">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neon-cyan" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.tags.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
