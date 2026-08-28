import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 px-6 py-20 md:px-12 lg:px-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-fade" />
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-20" />

      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        <h3 className="h-display text-[14vw] font-light leading-none tracking-tighter md:text-[10vw]">
          <span className="gradient-text">Basit Ali</span>
        </h3>
        <div className="mt-2 font-mono text-xs uppercase tracking-[0.4em] text-white/40">
          Data Scientist · AI Engineer
        </div>

        <div className="mt-10 flex items-center gap-2 text-xs text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-neon-lime shadow-[0_0_8px_rgba(163,255,18,0.7)]" />
          {profile.status === "available" && "Available for new work"}
          {profile.status === "limited" && "Limited availability"}
          {profile.status === "unavailable" && "Currently unavailable"}
        </div>
      </div>
    </footer>
  );
}
