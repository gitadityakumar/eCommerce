'use client'
import { Button } from "@/components/ui/button"; // Adjust the import path as needed
import { motion } from "framer-motion";

// Animation variants based on the design system
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: "easeOut" },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 },
};

const scaleX = {
    initial: { scaleX: 0 },
    animate: { scaleX: 1 },
    transition: { duration: 0.6 }
};

const scrollIndicatorBounce = {
    y: ["0%", "20%", "0%"],
    transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
    },
};


export default function NoirHauteCoutureHero() {
  return (
    <section 
        aria-label="Hero section"
        role="banner"
        className="relative flex items-center justify-center w-full h-screen min-h-[600px] max-h-[1080px] overflow-hidden"
    >
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* 1. Image */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ 
            backgroundImage: `url('https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/30a171b9-41c8-48fe-8ea6-deec71d988ec_3840w.webp')`,
            filter: 'grayscale(30%) contrast(120%) brightness(0.7)',
          }}
        />
        {/* 2. Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
        {/* 3. Vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-7xl px-6 text-center md:px-12 lg:px-20">
        <motion.p
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ ...fadeIn.transition, delay: 0.2 }}
          className="mb-4 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-[#D4AF37] opacity-90"
        >
          Timeless Sophistication
        </motion.p>
        
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ ...fadeInUp.transition, delay: 0.4 }}
          className="font-playfair-display text-[clamp(3rem,8vw,7rem)] font-light leading-tight tracking-tighter uppercase text-white"
          style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
        >
          Elegance Redefined
        </motion.h1>

        <motion.div 
            variants={scaleX}
            initial="initial"
            animate="animate"
            transition={{ ...scaleX.transition, delay: 0.8 }}
            className="w-[60px] h-[1px] bg-[#D4AF37] my-8 mx-auto opacity-80"
        />

        <motion.p
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ ...fadeIn.transition, delay: 1 }}
          className="max-w-[600px] mx-auto mb-12 font-inter text-[clamp(1rem,2vw,1.25rem)] font-light leading-relaxed tracking-wider text-gray-200 opacity-90"
        >
          Experience the pinnacle of haute couture craftsmanship in our curated collections.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ ...fadeInUp.transition, delay: 1.2 }}
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <Button
            className="w-full sm:w-auto bg-[#D4AF37] text-black rounded-none px-12 py-7 text-[13px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 ease-in-out hover:bg-white hover:text-black hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
            style={{ boxShadow: '0 4px 20px rgba(212,175,55,0.3)' }}
          >
            Discover
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto bg-transparent text-white border-white rounded-none px-12 py-7 text-[13px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 ease-in-out hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
          >
            Learn More
          </Button>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[1px] h-[60px]"
        >
            <motion.div 
                className="w-full h-full bg-gradient-to-b from-transparent via-white to-transparent"
                animate={scrollIndicatorBounce}
            />
        </motion.div>
    </section>
  );
}