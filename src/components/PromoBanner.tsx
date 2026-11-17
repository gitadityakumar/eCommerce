'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function PromoBanner() {
  return (
    <section className="relative flex min-h-[70dvh] items-center justify-center overflow-hidden bg-background py-20 transition-colors duration-500">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-background/55 dark:bg-background/75 z-10 transition-colors duration-500 backdrop-blur-[1px]"></div>
        <Image
          src="/editorial/gala-edit-ambient.jpg"
          className="w-full h-full object-cover object-center opacity-85 dark:opacity-60 transition-transform duration-1000 scale-105"
          alt="Gala Evening Editorial"
          fill
          sizes="100vw"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="relative z-20 text-center px-6 border border-border-subtle bg-surface/75 dark:bg-black/50 backdrop-blur-md p-10 md:p-16 max-w-3xl shadow-lifted rounded-md mx-4"
      >
        <span className="block text-accent text-xs tracking-[0.32em] uppercase mb-4 drop-shadow-sm font-semibold">
          Limited atelier run
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-7xl text-text-primary font-light tracking-[-0.035em] mb-6 font-(--font-playfair)">
          The gala edit
        </h2>
        <p className="text-text-secondary font-light text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
          Crystal-touched bows, vintage lace, and satin pieces made for long evenings and close-up photography.
        </p>
        <Link
          href="/collections"
          className="inline-flex items-center justify-center bg-accent text-white px-10 sm:px-12 py-3.5 sm:py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-accent/90 transition-all shadow-soft rounded-full hover:shadow-[0_0_30px_oklch(0.56_0.12_24/0.4)] hover:-translate-y-0.5 active:scale-95"
        >
          Shop the run
        </Link>
      </motion.div>
    </section>
  );
}
