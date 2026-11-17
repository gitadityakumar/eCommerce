'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function SpotlightSection() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-32 transition-colors duration-500 md:py-40">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1611042553365-9b101441c135?q=80&w=2000&auto=format&fit=crop"
          className="w-full h-full object-cover transition-all duration-700 brightness-[0.75] md:brightness-[0.8] dark:brightness-[0.22]"
          alt="Background Texture"
          fill
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-background/85 sm:bg-background/70 md:bg-background/60 dark:bg-black/75 backdrop-blur-[2px] transition-colors" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-text-secondary text-xs tracking-[0.36em] uppercase mb-4 flex items-center gap-4 font-medium">
            <span className="w-12 h-px bg-border-subtle"></span>
            {' '}
            Studio focus
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-light text-text-primary tracking-[-0.035em] mb-8 leading-[1.02] font-(--font-playfair)">
            Pearls with
            {' '}
            <br />
            <span className="italic text-text-secondary opacity-80">weight</span>
          </h2>
          <p className="text-base sm:text-lg text-text-secondary font-light leading-relaxed mb-10 max-w-md border-l border-accent/30 pl-6">
            Freshwater pearls are set into structural organza so the piece keeps its silhouette while moving softly under warm light.
          </p>
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-accent text-white px-8 sm:px-10 py-3.5 sm:py-4 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-accent/90 transition-all shadow-soft rounded-full hover:-translate-y-0.5 active:scale-95"
            >
              Explore Piece
            </Link>
            <span className="text-text-primary font-light text-xl tabular-nums">₹35,000.00</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative z-20 aspect-square max-w-md ml-auto shadow-soft">
            <Image
              src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg"
              className="w-full h-full object-cover border border-border-subtle"
              alt="Pearl Detail"
              fill
              sizes="(min-width: 768px) 448px, 100vw"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-10 -left-10 z-10 w-64 h-64 bg-surface p-1 shadow-soft"
          >
            <Image
              src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5bab247f-35d9-400d-a82b-fd87cfe913d2_1600w.webp"
              className="w-full h-full object-cover opacity-80 dark:opacity-60"
              alt="Texture Close Up"
              fill
              sizes="256px"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
