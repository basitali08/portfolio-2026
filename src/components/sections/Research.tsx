"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, FileText } from "lucide-react";
import { publications } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Research() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <section id="research" className="section-pad relative">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40"
        >
          <span className="text-white/70">04</span>
          <span className="mx-3 text-white/20">/</span>
          Research
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="h-display mt-4 max-w-3xl text-4xl font-light tracking-tighter md:text-6xl"
        >
          Selected <span className="gradient-text">publications</span>.
        </motion.h2>

        <p className="mt-4 max-w-2xl text-pretty text-sm text-white/65 md:text-base">
          Peer-reviewed work in computational biology and applied machine
          learning. Indexed internationally.
        </p>

        <ol className="mt-16 space-y-px">
          {publications.map((pub, i) => {
            const isOpen = expanded[pub.id] ?? false;
            return (
              <motion.li
                key={pub.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group relative"
              >
                <div
                  className={cn(
                    "relative grid gap-x-8 gap-y-3 border-t border-white/10 py-10 transition-colors duration-500 md:grid-cols-[3rem,1fr,12rem]",
                    "hover:border-white/25",
                  )}
                >
                  <div className="font-mono text-xs text-white/30">
                    [{String(i + 1).padStart(2, "0")}]
                  </div>

                  <div className="min-w-0">
                    <h3
                      className="text-balance text-lg leading-snug tracking-tight md:text-xl"
                      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                      {pub.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-white/60">
                      <span className="text-white/80">{pub.authors}</span>
                      <span className="text-white/20">·</span>
                      <em className="not-italic text-white/55">
                        {pub.venue}
                      </em>
                      <span className="text-white/20">·</span>
                      <span className="font-mono text-xs text-white/45">
                        {pub.year}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        setExpanded((p) => ({ ...p, [pub.id]: !isOpen }))
                      }
                      className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60 rounded"
                      data-cursor="hover"
                      aria-expanded={isOpen}
                    >
                      <span
                        className={cn(
                          "inline-block h-px bg-current transition-all duration-300",
                          isOpen ? "w-10" : "w-5",
                        )}
                      />
                      {isOpen ? "Hide abstract" : "Read abstract"}
                    </button>

                    <motion.div
                      initial={false}
                      animate={{
                        height: isOpen ? "auto" : 0,
                        opacity: isOpen ? 1 : 0,
                      }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-white/70">
                        {pub.abstract}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {pub.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-sm border border-white/10 bg-transparent px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/55"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1.5 text-xs text-white/70 transition-colors hover:text-white"
                      data-cursor="hover"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span className="border-b border-white/20 pb-px">
                        Read on SSRN
                      </span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                    {pub.doi && (
                      <span className="font-mono text-[10px] text-white/30">
                        {pub.doi}
                      </span>
                    )}
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">
                      Preprint
                    </span>
                  </div>
                </div>
              </motion.li>
            );
          })}

          <li className="border-t border-white/10" />
        </ol>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/35">
          <span className="font-mono uppercase tracking-[0.2em]">
            Total citations tracked via SSRN
          </span>
          <span className="font-mono">Last updated · 2025</span>
        </div>
      </div>
    </section>
  );
}
