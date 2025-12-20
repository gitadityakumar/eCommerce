'use client';
import { motion } from 'framer-motion';
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
        <div
          className="absolute inset-0 bg-center bg-cover "
          style={{
            backgroundImage: `url('https://ik.imagekit.io/nq9atqhjb/Generated%20Image%20November%2019,%202025%20-%2011_56AM.png?tr=w-2912,h-1632,f-webp')`,
          }}
        />
        {/* 2. Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
        {/* 3. Vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 text-center">
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ ...fadeInUp.transition, delay: 0.4 }}
          className="mt-8 sm:mt-12 md:mt-16 font-[var(--font-playfair)] text-[clamp(3rem,14vw,8rem)] sm:text-[clamp(3.5rem,12vw,8rem)] md:text-[clamp(4.5rem,10vw,8rem)] lg:text-[clamp(5rem,8vw,8rem)] font-normal leading-[1.1] tracking-[-0.02em]"
          style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
        >
          <span className="block text-white">Refined</span>
          <span className="block bg-gradient-to-b from-white via-white to-neutral-400 bg-clip-text text-transparent">
            Elegance
          </span>
        </motion.h1>

        <motion.div
          variants={scaleX}
          initial="initial"
          animate="animate"
          transition={{ ...scaleX.transition, delay: 0.8 }}
          className="w-[40px] sm:w-[60px] h-[1px] bg-[#D4AF37] my-6 sm:my-8 mx-auto opacity-80"
        />

        <motion.p
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ ...fadeIn.transition, delay: 1 }}
          className="max-w-[90%] sm:max-w-[600px] mx-auto mb-8 sm:mb-10 md:mb-12 px-2 font-[var(--font-inter)] text-[clamp(1rem,4vw,1.25rem)] sm:text-[clamp(1.0625rem,3vw,1.25rem)] md:text-[clamp(1.125rem,2vw,1.25rem)]  leading-[1.6] tracking-[0.05em] text-[#E5E5E5] opacity-90"
        >
          Experience the pinnacle of haute couture craftsmanship in our curated
          collections.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ ...fadeInUp.transition, delay: 1.2 }}
          className="flex flex-col items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto sm:flex-row px-2 sm:px-0"
        >
          <Button className="group relative z-20 flex h-12 sm:h-14 w-full sm:w-auto items-center justify-center space-x-2 bg-gradient-to-r from-red-400 to-red-500 px-6 sm:px-8 py-3 text-sm font-bold leading-6 text-white transition-all duration-300 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-red-500 before:to-red-600 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 hover:shadow-2xl hover:shadow-red-500/40 hover:-translate-y-1 active:scale-95 overflow-hidden">
            {/* Glare Effect */}
            <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-1000 ease-out group-hover:translate-x-full" />
            <span className="relative z-10 transition-transform duration-300 group-hover:scale-110 whitespace-nowrap font-[var(--font-montserrat)] tracking-[0.15em] uppercase text-sm md:text-base">
              Discover
            </span>
            {/* Ripple Effect */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-active:scale-100 transition-transform duration-300" />
            </div>
          </Button>
          <Button
            variant="outline"
            className="group relative z-20 flex h-12 sm:h-14 w-full sm:w-auto items-center justify-center space-x-2 border-2 border-white/30 bg-transparent px-5 sm:px-6 py-3 text-sm font-bold leading-6 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/10 hover:text-white hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1 active:scale-95"
          >
            <svg
              className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            <span className="transition-transform duration-300 group-hover:scale-105 whitespace-nowrap font-[var(--font-montserrat)] tracking-[0.15em] uppercase text-sm md:text-base">
              Learn More
            </span>
          </Button>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hidden sm:flex"
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={scrollIndicatorBounce}
        >
          <span className="font-[var(--font-montserrat)] text-[0.625rem] uppercase tracking-[0.2em] text-white opacity-80 whitespace-nowrap">
            SCROLL DOWN
          </span>
          <div className="w-[1px] h-[40px] sm:h-[60px] bg-gradient-to-b from-transparent via-white to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
