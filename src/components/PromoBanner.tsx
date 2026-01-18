'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function PromoBanner() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-background transition-colors duration-500">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute inset-0 w-full h-full"
      >
        <div className="absolute inset-0 bg-background/40 dark:bg-black/60 z-10 transition-colors duration-500"></div>
        <Image
          src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop"
          className="w-full h-full object-cover opacity-80 dark:opacity-40 grayscale-20 dark:grayscale-0 transition-opacity duration-700"
          alt="Seasonal Promo"
          fill
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-20 text-center px-6 border border-border-subtle bg-surface/60 dark:bg-black/40 backdrop-blur-md p-12 md:p-20 max-w-3xl shadow-soft"
      >
        <span className="block text-accent text-xs tracking-[0.4em] uppercase mb-6 drop-shadow-sm">Limited Edition Drop</span>
        <h2 className="text-5xl md:text-7xl text-text-primary font-light tracking-tight mb-8">The Gala Edit</h2>
        <p className="text-text-secondary font-light text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          Exclusive pieces featuring Swarovski crystals and rare vintage lace. Crafted for the modern muse.
        </p>
        <Link href="/collections">
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="bg-accent text-white px-12 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-accent/90 transition-all shadow-soft rounded-full hover:shadow-[0_0_30px_oklch(0.6_0.2_25/0.4)]"
          >
            Shop the Drop
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}
