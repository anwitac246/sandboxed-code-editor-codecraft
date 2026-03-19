export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero pt-32 pb-20 md:pt-44 md:pb-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          Craft, run, and scale{" "}
          <span className="text-foreground">your code effortlessly in a fully sandboxed workspace.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          CodeCraft gives you a real terminal, instant environments, and seamless execution—all in one place.
          Build without limits, focus on what matters: your code.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#get-started"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-primary"
          >
            Get Started
          </a>
          <a
            href="#docs"
            className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            Read Docs
          </a>
        </div>
      </div>

      {/* Decorative glow orb */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-150 w-200 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" />
    </section>
  );
}
