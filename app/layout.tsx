import type { Metadata, Viewport } from "next";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { AmbientAudio } from "@/components/ui/AmbientAudio";
import { Navbar } from "@/components/ui/Navbar";
import { profile } from "@/lib/data";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.tagline,
  keywords: [
    profile.name,
    "portfolio",
    "3D portfolio",
    ...profile.skills.map((s) => s.name),
  ],
  authors: [{ name: profile.name, url: profile.links.linkedin }],
  creator: profile.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: `${profile.name} — ${profile.title}`,
    description: profile.tagline,
    siteName: profile.name,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: `${profile.name} — ${profile.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: profile.tagline,
    creator: profile.handle,
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: siteUrl },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        <LenisProvider>
          <LoadingScreen />
          <CustomCursor />
          <AmbientAudio />
          <CommandPalette />
          <Navbar />
          <main id="main" className="relative">
            {children}
          </main>
        </LenisProvider>
      </body>
    </html>
  );
}
