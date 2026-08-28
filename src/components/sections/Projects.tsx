"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowUpRight, X, ExternalLink, Github } from "lucide-react";
import { projects } from "@/lib/data";
import { Parallax } from "@/components/ui/Parallax";
import { cn } from "@/lib/utils";

export function Projects() {
  const [active, setActive] = useState<(typeof projects)[number] | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap for modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!active) return;
      if (e.key === "Escape") {
        setActive(null);
        return;
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [active],
  );

  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
      closeRef.current?.focus();
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, handleKeyDown]);

  return (
    <section id="projects" className="section-pad relative">
      <div className="mx-auto max-w-7xl">
        <Parallax speed={0.3} axis="y" offset={60}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40"
          >
            <span className="text-neon-cyan">03</span> · Projects
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
            Selected <span className="gradient-text">work</span>.
          </motion.h2>
        </Parallax>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              onClick={() => setActive(p)}
              data-cursor="hover"
              className={cn(
                "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-1 text-left transition-all duration-500 hover:border-white/20",
                p.featured && "md:col-span-2",
              )}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-neon-violet/20 via-transparent to-neon-cyan/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div
                className={cn(
                  "relative grid gap-6 rounded-[1.4rem] bg-ink-900/60 p-8 backdrop-blur",
                  p.featured ? "md:grid-cols-2" : "",
                )}
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <span className="font-mono">0{i + 1}</span>
                    <span className="h-px w-8 bg-white/20" />
                    <span className="uppercase tracking-wider">{p.tags[0]}</span>
                  </div>
                  <h3 className="h-display mt-3 text-2xl tracking-tight md:text-3xl">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-pretty text-sm text-white/70 md:text-base">
                    {p.blurb}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                {p.featured && p.metrics && (
                  <div className="grid grid-cols-3 gap-2 self-end">
                    {p.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                      >
                        <div className="h-display text-2xl tracking-tight">
                          {m.value}
                        </div>
                        <div className="mt-1 text-[10px] uppercase tracking-wider text-white/40">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[140] flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-xl"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Project: ${active.title}`}
        >
          <motion.div
            ref={modalRef}
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative w-full max-w-2xl overflow-hidden rounded-3xl p-8"
          >
            <button
              ref={closeRef}
              onClick={() => setActive(null)}
              className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60"
              data-cursor="hover"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              Case study
            </div>
            <h3 className="h-display mt-2 text-3xl tracking-tight">
              {active.title}
            </h3>
            <p className="mt-2 text-pretty text-white/70">{active.blurb}</p>
            <p className="mt-4 text-sm text-white/80">{active.description}</p>
            {active.metrics && (
              <div className="mt-6 grid grid-cols-3 gap-2">
                {active.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                  >
                    <div className="h-display text-2xl tracking-tight">
                      {m.value}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-wider text-white/40">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-1.5">
              {active.tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {active.link && (
                <a
                  href={active.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  data-cursor="hover"
                >
                  Visit <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              {active.repo && (
                <a
                  href={active.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                  data-cursor="hover"
                >
                  Source <Github className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
