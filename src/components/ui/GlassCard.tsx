"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const GlassCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function GlassCard({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "glass relative overflow-hidden rounded-2xl p-6 transition-all duration-300",
          className,
        )}
        {...rest}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />
        <div className="relative">{children}</div>
      </div>
    );
  },
);
