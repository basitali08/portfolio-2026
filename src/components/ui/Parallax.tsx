"use client";

import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

type ParallaxProps = {
  children: ReactNode;
  offset?: number;
  className?: string;
  speed?: number;
  axis?: "y" | "x" | "both";
  scale?: boolean;
  rotate?: boolean;
  opacity?: boolean;
};

export function Parallax({
  children,
  offset = 100,
  className,
  speed = 0.3,
  axis = "y",
  scale = false,
  rotate = false,
  opacity = false,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const distance = offset * speed;
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const x = useTransform(scrollYProgress, [0, 1], [distance * 0.5, -distance * 0.5]);
  const s = useTransform(scrollYProgress, [0, 0.5, 1], scale ? [0.9, 1, 0.95] : [1, 1, 1]);
  const r = useTransform(scrollYProgress, [0, 1], rotate ? [0, distance * 0.05] : [0, 0]);
  const o = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], opacity ? [0, 1, 1, 0.4] : [1, 1, 1, 1]);

  const transformValue = (latestX: MotionValue<number>, latestY: MotionValue<number>) =>
    `translate3d(${axis === "x" || axis === "both" ? latestX.get() : 0}px, ${
      axis === "y" || axis === "both" ? latestY.get() : 0
    }px, 0) rotate(${r.get()}deg) scale(${s.get()})`;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y: axis === "y" || axis === "both" ? y : 0,
        x: axis === "x" || axis === "both" ? x : 0,
        rotate: rotate ? r : 0,
        scale: scale ? s : 1,
        opacity: o,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  );
}
