import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center justify-center px-6">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="relative text-center">
        <div className="text-8xl font-display font-light tracking-tighter md:text-[12rem]">
          <span className="gradient-text">404</span>
        </div>
        <h1 className="mt-4 font-display text-2xl tracking-tight text-white/80">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-white/50">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="btn-primary mt-8 inline-flex"
          data-cursor="hover"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
