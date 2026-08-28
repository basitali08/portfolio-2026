"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft, ArrowRight } from "lucide-react";
import { commandItems, profile } from "@/lib/data";
import { copyToClipboard } from "@/lib/utils";

type Action = "copy-email" | "download-resume" | "open-linkedin" | "open-github" | "toggle-audio";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command", onOpen as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command", onOpen as EventListener);
    };
  }, []);

  const items = useMemo(() => {
    if (!query) return commandItems;
    const q = query.toLowerCase();
    return commandItems.filter(
      (i) => i.label.toLowerCase().includes(q) || i.section.toLowerCase().includes(q),
    );
  }, [query]);

  const run = async (id: string) => {
    const item = commandItems.find((i) => i.id === id);
    if (!item) return;
    if (item.href) {
      document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
      return;
    }
    const action = item.action as Action;
    switch (action) {
      case "copy-email":
        if (await copyToClipboard(profile.email)) {
          setToast("Email copied");
        }
        break;
      case "download-resume":
        setToast("Resume download starting…");
        // Replace with your hosted PDF:
        const a = document.createElement("a");
        a.href = "/resume.pdf";
        a.download = `${profile.name.replace(/\s+/g, "_")}_Resume.pdf`;
        a.click();
        break;
      case "open-linkedin":
        window.open(profile.links.linkedin, "_blank", "noopener");
        break;
      case "open-github":
        window.open(profile.links.github, "_blank", "noopener");
        break;
      case "toggle-audio":
        window.dispatchEvent(new CustomEvent("toggle-audio"));
        setToast("Toggled ambient audio");
        break;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 1800);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-start justify-center bg-ink-950/70 p-4 pt-[12vh] backdrop-blur-md"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(items.length - 1, a + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (items[active]) run(items[active].id);
              }
            }}
          >
            <motion.div
              initial={{ y: -16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-xl overflow-hidden rounded-2xl"
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <Search className="h-4 w-4 text-white/40" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  placeholder="Type a command or search…"
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
                <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-white/40">
                ESC
                </kbd>
              </div>
              <ul className="max-h-80 overflow-y-auto p-2">
                {items.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-white/40">
                    No results
                  </li>
                )}
                {items.map((item, i) => (
                  <li key={item.id}>
                    <button
                      onMouseEnter={() => setActive(i)}
                      onClick={() => run(item.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60 ${
                        active === i ? "bg-white/[0.06] text-white" : "text-white/70"
                      }`}
                      data-cursor="hover"
                    >
                      <span className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 opacity-30" />
                        {item.label}
                      </span>
                      <span className="flex items-center gap-2 text-[10px] text-white/40">
                        {item.section}
                        {item.shortcut && (
                          <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5">
                            {item.shortcut}
                          </kbd>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-[10px] text-white/40">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <CornerDownLeft className="h-3 w-3" /> open
                  </span>
                  <span>↑↓ navigate</span>
                </div>
                <span>basit.dev/cmd</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-[210] -translate-x-1/2 rounded-full border border-white/10 bg-ink-900/90 px-4 py-2 text-xs text-white backdrop-blur"
            role="status"
            aria-live="polite"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
