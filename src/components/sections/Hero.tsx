"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Sparkles, MapPin } from "lucide-react";
import { profile } from "@/lib/data";
import { MagneticButton } from "@/components/ui/MagneticButton";
import Image from "next/image";
import { useTypewriter } from "@/lib/hooks/useTypewriter";

const roles = [
  "Data Scientist",
  "AI Engineer",
  "ML Engineer",
  "Predictive Modeler",
  "Research Addict",
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const typed = useTypewriter(roles, { typeSpeed: 90, deleteSpeed: 45, holdTime: 1400 });
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-32"
    >
      <div className="absolute inset-0 grid-bg mask-fade-b opacity-40" />
      <div className="absolute inset-0 bg-radial-fade" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 md:px-12 lg:grid-cols-[1.1fr_1fr] lg:px-20"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 backdrop-blur"
            data-cursor="hover"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-lime opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-lime" />
            </span>
            Available for new work ·{" "}
            <span className="font-mono text-white/50">{time || "00:00"} UTC</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="h-display text-balance text-5xl font-light leading-[0.95] tracking-tighter md:text-7xl lg:text-8xl"
          >
            Hi, I'm <span className="gradient-text">{profile.name.split(" ")[0]}.</span>
            <br />
            I build
            <br />
            <span className="inline-flex items-baseline">
              <span className="text-white/40">{"< "}</span>
              <span className="text-white">{typed}</span>
              <span className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-1 animate-pulse bg-neon-cyan" />
              <span className="text-white/40">{"/>"}</span>
            </span>
            <br />
            <span className="text-white/40">that feel alive.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.8 }}
            className="mt-8 max-w-xl text-pretty text-lg text-white/70"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <MagneticButton href="#projects" className="btn-primary">
              See the work
              <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href="#contact" className="btn-ghost">
              <Sparkles className="h-4 w-4" />
              Start a project
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1, duration: 0.8 }}
            className="mt-10 flex items-center gap-2 text-xs text-white/40"
          >
            <MapPin className="h-3.5 w-3.5" />
            {profile.location} · {profile.pronouns}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-md"
          data-cursor="hover"
        >
          <div className="relative aspect-square">
            <div className="absolute inset-0 -z-10 rounded-full" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.4), transparent 60%)", filter: "blur(40px)" }} />
            <div className="relative h-full w-full rounded-full border-2 border-white/20 p-1">
              <Image
                src="/profile.jpg"
                alt={profile.name}
                width={400}
                height={400}
                className="h-full w-full rounded-full object-cover"
                priority
              />
            </div>
            <div className="absolute -inset-3 rounded-full border border-neon-cyan/20 animate-spin-slow" style={{ animationDuration: "12s" }} />
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/10 bg-ink-900/60 px-4 py-3 text-xs text-white/70 backdrop-blur-md">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                Status
              </div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon-lime shadow-[0_0_8px_rgba(163,255,18,0.7)]" />
                Online · building
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                Stack
              </div>
              <div className="mt-0.5">Python · XGBoost · Streamlit</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40 transition hover:text-white"
          data-cursor="hover"
        >
          scroll
          <ArrowDown className="h-3 w-3 animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
