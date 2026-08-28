# Portfolio 2026

A futuristic, award-quality 3D personal portfolio site. Next.js 15 · React 19 · TypeScript · Tailwind · Framer Motion · GSAP · Three.js (R3F) · Lenis.

> Built for **Basit Ali** (https://www.linkedin.com/in/basit-ali-824851375). All content is keyed off `src/lib/data.ts` — edit there, not in components.

## Features

- Cinematic 3D hero (R3F + custom shader-like material)
- Lenis smooth scroll (with reduced-motion respect)
- 3D skill sphere with category filters
- Animated counters, magnetic CTAs, command palette (`⌘K`)
- Custom cursor, ambient audio toggle, loading screen
- Glassmorphism UI, gradient typography, holographic accents
- Testimonials marquee, expandable experience cards
- Animated contact form, copy-to-clipboard email
- SEO: per-page metadata, OG image, sitemap, robots
- Lighthouse-tuned: lazy 3D, GPU-accelerated animations, `next/font`
- A11y: focus states, skip-to-content, reduced-motion support

## Quick start

```bash
pnpm install        # or npm / yarn / bun
pnpm dev            # http://localhost:3000
pnpm build && pnpm start
```

Node 20+. React 19 RC pinned in `package.json`.

## Customize

1. **Profile content** — `src/lib/data.ts`
2. **Theme** — `tailwind.config.ts` (colors, animations, shadows)
3. **3D scenes** — `src/components/three/*`
4. **Sections** — `src/components/sections/*`

## Real LinkedIn data (optional)

LinkedIn aggressively blocks scraping from shared IPs. To get live data:

1. Sign up for a provider (e.g. **Proxycurl** or **RapidAPI → linkedin-data-scraper**).
2. `cp .env.example .env.local` and fill in `LINKEDIN_RAPIDAPI_KEY`.
3. From a server component / route, call `fetchLinkedIn()` from `src/lib/linkedin.ts` and map the response into the `profile` / `experience` / `projects` shape in `data.ts`. Cache with `revalidate: 60*60*24*7`.

By default, the site ships with a typed placeholder so it builds and runs without a provider.

## Resume + audio

- Drop your PDF at `public/resume.pdf`.
- Drop a royalty-free ambient track at `public/ambient.mp3` (the toggle will play it on opt-in click — autoplay is browser-blocked and we don't fight that).

## Deploy

### Vercel (recommended)

```bash
pnpm i -g vercel
vercel
```

Set env vars in the Vercel dashboard. The site uses `@vercel/og`-ready metadata out of the box.

### Static / self-host

```bash
pnpm build
# .next/standalone is your friend, or just `next start` behind nginx.
```

## Performance notes

- `optimizePackageImports` for `framer-motion`, `lucide-react`, `@react-three/drei`
- DPR capped at 1.5 in 3D scenes
- All animations are `transform` / `opacity` only where it matters
- Fonts via `next/font` (subset, self-hosted, no FOUT)
- 3D components lazy-load inside `<Suspense>`

## License

Your portfolio, your license. MIT vibes — do whatever you want.
