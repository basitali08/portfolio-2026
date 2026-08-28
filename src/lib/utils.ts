import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(n: number, min = 0, max = 1) {
  return Math.min(Math.max(n, min), max);
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function mapRange(value: number, inMin: number, inMax: number, outMin = 0, outMax = 1) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function copyToClipboard(text: string) {
  if (typeof navigator === "undefined") return Promise.resolve(false);
  return navigator.clipboard.writeText(text).then(
    () => true,
    () => false,
  );
}
