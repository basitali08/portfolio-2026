"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Ambient audio toggle.
 * Drop a royalty-free ambient track in /public/ambient.mp3 and it will play
 * on user click. Browsers block autoplay until user interaction, which is fine
 * for a portfolio — the toggle is a real opt-in.
 */
export function AmbientAudio() {
  const [enabled, setEnabled] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audio.current = new Audio("/ambient.mp3");
    audio.current.loop = true;
    audio.current.volume = 0.25;
    return () => {
      audio.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (!audio.current) return;
    if (enabled) {
      audio.current.play().catch(() => setEnabled(false));
    } else {
      audio.current.pause();
    }
  }, [enabled]);

  useEffect(() => {
    const onToggle = () => setEnabled((v) => !v);
    window.addEventListener("toggle-audio", onToggle as EventListener);
    return () => window.removeEventListener("toggle-audio", onToggle as EventListener);
  }, []);

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 1.4 }}
        onClick={() => setEnabled((v) => !v)}
        className="fixed bottom-5 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-ink-900/70 text-white/70 backdrop-blur-md transition hover:border-white/20 hover:text-white"
        aria-label={enabled ? "Mute ambient audio" : "Play ambient audio"}
        data-cursor="hover"
      >
        {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </motion.button>
    </AnimatePresence>
  );
}
