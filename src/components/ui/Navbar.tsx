"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Menu, X, Command } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 32);
      const h = document.documentElement;
      setProgress((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100);

      // Track active section
      const sections = navItems.map((item) => item.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "py-3" : "py-5",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 md:px-10",
            scrolled &&
              "rounded-full border border-white/10 bg-ink-950/60 px-4 py-2 backdrop-blur-xl md:px-6",
          )}
        >
          <a
            href="#"
            className="group flex items-center gap-2 font-display text-sm font-medium tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 rounded-full"
            data-cursor="hover"
          >
            <span className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-neon-cyan to-neon-violet">
              <span className="absolute inset-0 animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0deg,white_60deg,transparent_120deg)] opacity-30" />
              <span className="relative text-xs font-bold text-ink-950">B</span>
            </span>
            <span className="hidden sm:block">basit.dev</span>
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {navItems.map((item, i) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative rounded-full px-3 py-1.5 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60",
                    isActive ? "text-white" : "text-white/60 hover:text-white",
                  )}
                  data-cursor="hover"
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className={cn("font-mono text-[10px]", isActive ? "text-neon-cyan" : "text-white/30")}>
                    0{i + 1}
                  </span>
                  <span className="ml-1.5">{item.label}</span>
                  <span className={cn(
                    "absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-neon-cyan to-neon-violet transition-transform duration-300",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )} />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const e = new CustomEvent("open-command");
                window.dispatchEvent(e);
              }}
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition hover:border-white/20 hover:text-white md:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60"
              data-cursor="hover"
              aria-label="Open command palette"
            >
              <Command className="h-3.5 w-3.5" />
              <span>⌘K</span>
            </button>
            <a
              href="#contact"
              className="btn-primary hidden md:inline-flex"
              data-cursor="hover"
            >
              Hire me
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60 rounded-full p-1"
              data-cursor="hover"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="absolute inset-x-0 -bottom-px h-px overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-transparent via-neon-violet to-transparent transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="absolute inset-0 bg-ink-950/95 backdrop-blur-xl" />
            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="relative flex h-full flex-col items-center justify-center gap-6 p-8"
            >
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="font-display text-3xl font-light tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60 rounded-lg px-4 py-2"
                >
                  <span className="font-mono text-xs text-white/30">0{i + 1}</span>{" "}
                  {item.label}
                </motion.a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
