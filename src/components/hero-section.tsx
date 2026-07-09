import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Adjust the import path as needed

export default function HeroSection() {
  return (
    <section
      aria-label="Hero section"
      role="banner"
      className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden"
    >
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        <video
          aria-hidden="true"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover object-[30%_30%] md:object-center"
        >
          <source
            src="https://ik.imagekit.io/nq9atqhjb/woman_looks_left_and_right_in_5s.mp4"
            type="video/mp4"
          />
        </video>
        {/* 2. Responsive Overlays */}
        {/* Dark mode: deep gradient. Light mode: subtle fade */}
        <div className="absolute inset-0 bg-linear-to-b from-black/18 via-black/8 to-black/68 dark:from-black/62 dark:to-black/90 transition-opacity duration-500" />

        {/* 3. Vignette - only in dark mode */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/40 opacity-0 dark:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 text-center">
        <p
          className="mb-5 font-(--font-montserrat) text-[0.68rem] font-semibold uppercase tracking-[0.36em] text-white/75"
        >
          Velvet bows, cut in small runs
        </p>
        <h1
          className="text-[clamp(4rem,14vw,9rem)] font-normal leading-[0.92] tracking-[-0.055em] drop-shadow-2xl"
        >
          <span className="block text-white">Made for</span>
          <span className="block bg-linear-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            the afterparty
          </span>
        </h1>

        <div
          className="w-15 h-px bg-accent my-8 mx-auto opacity-80"
        />

        <p
          className="mx-auto mb-12 max-w-[38rem] px-4 font-(--font-jost) text-base leading-8 tracking-wide text-neutral-200 drop-shadow-md sm:text-lg"
        >
          Sculptural hair bows stitched from velvet, silk, pearls, and trims found in old ateliers. Built for weddings, late dinners, and camera flash.
        </p>

        <div
          className="flex flex-col items-stretch sm:items-center gap-4 w-full sm:w-auto sm:flex-row"
        >
          {/* CTA Primary: Accent color in light mode, bright in dark mode */}
          <Button asChild className="group relative z-20 flex h-14 items-center justify-center space-x-3 overflow-hidden rounded-full border-none bg-accent px-10 py-4 text-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:bg-accent/90 hover:shadow-[0_0_30px_oklch(0.56_0.12_24/0.35)] active:scale-95">
            <Link href="/collections">
              <span className="relative z-10 font-(--font-montserrat) tracking-[0.2em] uppercase text-sm">
                Shop the edit
              </span>
              <div className="pointer-events-none absolute inset-y-0 left-[-45%] w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-[430%]" />
            </Link>
          </Button>

          {/* CTA Secondary: Inverted */}
          <Button
            asChild
            variant="outline"
            className="group relative z-20 flex h-14 items-center justify-center space-x-3 rounded-full border border-white/35 bg-white/7 px-10 py-4 text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-white/12 active:scale-95"
          >
            <Link href="/collections">
              <span className="font-(--font-montserrat) tracking-[0.2em] uppercase text-sm">
                View lookbook
              </span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 sm:flex"
      >
        <div className="flex flex-col items-center gap-3 animate-[hero-scroll-bounce_2s_ease-in-out_infinite] opacity-80">
          <span className="font-(--font-montserrat) text-[0.625rem] uppercase tracking-[0.3em] text-white/80">
            Scroll
          </span>
          <div className="w-px h-20 bg-linear-to-b from-accent via-white/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
