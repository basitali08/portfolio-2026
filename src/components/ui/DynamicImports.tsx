"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const SceneClient = dynamic(
  () => import("@/components/three/SceneClient").then((m) => m.SceneClient),
  { ssr: false },
);

const ScrollJourney = dynamic(
  () => import("@/components/three/ScrollJourney").then((m) => m.ScrollJourney),
  { ssr: false },
);

function SceneFallback() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-ink-950" aria-hidden />
  );
}

function ScrollJourneyFallback() {
  return (
    <div className="relative h-[300vh] w-full" aria-label="3D Journey loading">
      <div className="sticky top-0 h-screen w-full bg-ink-950" />
    </div>
  );
}

export function DynamicScene() {
  return (
    <ErrorBoundary fallback={<SceneFallback />}>
      <Suspense fallback={<SceneFallback />}>
        <SceneClient />
      </Suspense>
    </ErrorBoundary>
  );
}

export function DynamicScrollJourney() {
  return (
    <ErrorBoundary fallback={<ScrollJourneyFallback />}>
      <Suspense fallback={<ScrollJourneyFallback />}>
        <ScrollJourney />
      </Suspense>
    </ErrorBoundary>
  );
}
