'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function SpotlightSection() {
  return (
    <section className="relative py-32 w-full overflow-hidden bg-background transition-colors duration-500">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1611042553365-9b101441c135?q=80&w=2000&auto=format&fit=crop"
          className="w-full h-full object-cover transition-all duration-700 brightness-[0.8] dark:brightness-[0.25]"
          alt="Background Texture"
          fill
        />
        <div className="absolute inset-0 bg-background/60 dark:bg-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-text-secondary text-xs tracking-[0.4em] uppercase mb-4 flex items-center gap-4">
            <span className="w-12 h-px bg-border-subtle"></span>
            {' '}
            Spotlight
          </div>
          <h2 className="md:text-7xl text-5xl font-light text-text-primary tracking-tighter mb-8">
            The Pearl
            {' '}
            <br />
            <span className="font-serif italic text-text-secondary">Essence</span>
          </h2>
          <p className="text-lg text-text-secondary font-light leading-relaxed mb-10 max-w-md border-l border-accent/20 pl-6">
            Thousands of freshwater pearls hand-sewn onto structural organza. A shimmering halo that catches the light with every movement.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-accent text-white px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-accent/90 transition-colors shadow-soft rounded-full"
              >
                Purchase
              </motion.button>
            </Link>
            <span className="text-text-primary font-light text-xl">₹35,000.00</span>
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
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
