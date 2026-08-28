"use client";

import { useEffect, useState } from "react";

export function useTypewriter(
  words: string[],
  options: { typeSpeed?: number; deleteSpeed?: number; holdTime?: number; loop?: boolean } = {},
) {
  const { typeSpeed = 80, deleteSpeed = 40, holdTime = 1600, loop = true } = options;
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;
    const current = words[index % words.length];

    if (!deleting && subIndex === current.length) {
      const t = setTimeout(() => setDeleting(true), holdTime);
      return () => clearTimeout(t);
    }

    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((i) => (loop || i + 1 < words.length ? i + 1 : i));
      return;
    }

    const t = setTimeout(
      () => setSubIndex((s) => s + (deleting ? -1 : 1)),
      deleting ? deleteSpeed : typeSpeed,
    );
    return () => clearTimeout(t);
  }, [subIndex, index, deleting, words, typeSpeed, deleteSpeed, holdTime, loop]);

  useEffect(() => {
    const current = words[index % words.length] ?? "";
    setText(current.slice(0, subIndex));
  }, [subIndex, index, words]);

  return text;
}
