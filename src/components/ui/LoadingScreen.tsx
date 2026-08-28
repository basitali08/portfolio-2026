"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function LoadingScreen() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 12 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(id);
        setTimeout(() => setDone(true), 400);
      }
      setProgress(p);
    }, 120);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.87, 0, 0.13, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink-950"
        >
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute inset-0 bg-radial-fade" />
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="text-7xl font-display font-light tracking-tighter md:text-9xl">
              <span className="gradient-text">2026</span>
            </div>
            <motion.div
              className="absolute -inset-x-8 -inset-y-4 rounded-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(139,92,246,0.25), transparent 70%)",
                filter: "blur(20px)",
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <div className="relative mt-12 h-px w-64 overflow-hidden bg-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          <div className="relative mt-4 font-mono text-xs uppercase tracking-[0.3em] text-white/50">
            Booting portfolio · {Math.min(100, Math.round(progress))}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
