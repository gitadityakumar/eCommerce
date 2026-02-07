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
      className="relative flex items-center justify-center  w-full h-screen min-h-[600px] max-h-[1080px] overflow-hidden"
    >
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* 1. Image */}
        {/* 1. Image */}
        {/* Mobile Background: customized to show the face (approx top 20%) */}
        <div
          className="absolute inset-0 bg-cover transition-all duration-700 md:hidden"
          style={{
            backgroundImage: `url('https://ik.imagekit.io/nq9atqhjb/hero-mobile.png?tr=w-1080,f-webp')`,
            backgroundPosition: '30% 30%',
          }}
        />
        {/* Desktop Background */}
        <div
          className="absolute inset-0 bg-center bg-cover transition-all duration-700 hidden md:block"
          style={{
            backgroundImage: `url('https://ik.imagekit.io/nq9atqhjb/Generated%20Image%20November%2019,%202025%20-%2011_56AM.png?tr=w-2912,h-1632,f-webp')`,
          }}
        />
        {/* 2. Responsive Overlays */}
        {/* Dark mode: deep gradient. Light mode: subtle fade */}
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/60 dark:from-black/60 dark:to-black/90 transition-opacity duration-500" />

        {/* 3. Vignette - only in dark mode */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/40 opacity-0 dark:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 text-center">
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ ...fadeInUp.transition, delay: 0.4 }}
          className="mt-8 sm:mt-12 md:mt-16 text-[clamp(3.5rem,14vw,8.5rem)] font-normal leading-[1.05] tracking-[-0.03em] drop-shadow-2xl"
        >
          <span className="block text-white">Refined</span>
          <span className="block bg-linear-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            Elegance
          </span>
        </motion.h1>

        <motion.div
          variants={scaleX}
          initial="initial"
          animate="animate"
          transition={{ ...scaleX.transition, delay: 0.8 }}
          className="w-[60px] h-px bg-accent my-8 mx-auto opacity-80"
        />

        <motion.p
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ ...fadeIn.transition, delay: 1 }}
          className="max-w-[600px] mx-auto mb-12 px-4 font-(--font-inter) text-lg leading-relaxed tracking-wide text-neutral-200 drop-shadow-md"
        >
          Experience the pinnacle of haute couture craftsmanship in our curated
          collections.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ ...fadeInUp.transition, delay: 1.2 }}
          className="flex flex-col items-stretch sm:items-center gap-4 w-full sm:w-auto sm:flex-row"
        >
          {/* CTA Primary: Accent color in light mode, bright in dark mode */}
          <Button asChild className="group relative z-20 flex h-14 items-center justify-center space-x-3 bg-accent px-10 py-4 text-white hover:bg-accent/90 transition-all duration-500 hover:shadow-[0_0_30px_oklch(0.6_0.2_25/0.4)] hover:-translate-y-1 active:scale-95 overflow-hidden rounded-full border-none shadow-soft">
            <Link href="/collections">
              <span className="relative z-10 font-(--font-montserrat) tracking-[0.2em] uppercase text-sm">
                Discover
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </Link>
          </Button>

          {/* CTA Secondary: Inverted */}
          <Button
            asChild
            variant="outline"
            className="group relative z-20 flex h-14 items-center justify-center space-x-3 border-2 border-white/30 bg-white/5 backdrop-blur-md px-10 py-4 text-white transition-all duration-500 hover:border-white hover:bg-white/10 hover:-translate-y-1 active:scale-95 rounded-full"
          >
            <Link href="/collections">
              <span className="font-(--font-montserrat) tracking-[0.2em] uppercase text-sm">
                Learn More
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
            EXPLORE
          </span>
          <div className="w-px h-[80px] bg-linear-to-b from-accent via-white/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
