'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Adjust the import path as needed

// Animation variants based on the design system
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1 },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 },
};

const scaleX = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: { duration: 0.6 },
};

const scrollIndicatorBounce = {
  y: ['0%', '20%', '0%'],
  transition: {
    duration: 2,
    repeat: Infinity,
  },
};

export default function HeroSection() {
  return (
    <section
      aria-label="Hero section"
      role="banner"
      className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden"
    >
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* 1. Image */}
        {/* 1. Image */}
        {/* Mobile Background: customized to show the face (approx top 20%) */}
        <div
          className="absolute inset-0 bg-cover transition-all duration-700 md:hidden"
          style={{
            backgroundImage: `url('https://cdn.100xadi.com/assets/ecom-hero-mobile-bg.webp')`,
            backgroundPosition: '30% 30%',
          }}
        />
        {/* Desktop Background */}
        <div
          className="absolute inset-0 bg-center bg-cover transition-all duration-700 hidden md:block"
          style={{
            backgroundImage: `url('https://cdn.100xadi.com/assets/ecom-hero-bg-desktop.webp')`,
          }}
        />
        {/* 2. Responsive Overlays */}
        {/* Dark mode: deep gradient. Light mode: subtle fade */}
        <div className="absolute inset-0 bg-linear-to-b from-black/18 via-black/8 to-black/68 dark:from-black/62 dark:to-black/90 transition-opacity duration-500" />

        {/* 3. Vignette - only in dark mode */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/40 opacity-0 dark:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 text-center">
        <motion.p
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ ...fadeIn.transition, delay: 0.25 }}
          className="mb-5 font-(--font-montserrat) text-[0.68rem] font-semibold uppercase tracking-[0.36em] text-white/75"
        >
          Velvet bows, cut in small runs
        </motion.p>
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ ...fadeInUp.transition, delay: 0.4 }}
          className="text-[clamp(4rem,14vw,9rem)] font-normal leading-[0.92] tracking-[-0.055em] drop-shadow-2xl"
        >
          <span className="block text-white">Made for</span>
          <span className="block bg-linear-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            the afterparty
          </span>
        </motion.h1>

        <motion.div
          variants={scaleX}
          initial="initial"
          animate="animate"
          transition={{ ...scaleX.transition, delay: 0.8 }}
          className="w-15 h-px bg-accent my-8 mx-auto opacity-80"
        />

        <motion.p
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ ...fadeIn.transition, delay: 1 }}
          className="mx-auto mb-12 max-w-[38rem] px-4 font-(--font-jost) text-base leading-8 tracking-wide text-neutral-200 drop-shadow-md sm:text-lg"
        >
          Sculptural hair bows stitched from velvet, silk, pearls, and trims found in old ateliers. Built for weddings, late dinners, and camera flash.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ ...fadeInUp.transition, delay: 1.2 }}
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
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 sm:flex"
      >
        <motion.div
          className="flex flex-col items-center gap-3"
          animate={scrollIndicatorBounce}
        >
          <span className="font-(--font-montserrat) text-[0.625rem] uppercase tracking-[0.3em] text-white/80">
            Scroll
          </span>
          <div className="w-px h-20 bg-linear-to-b from-accent via-white/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
