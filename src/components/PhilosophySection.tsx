'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PhilosophySection() {
  return (
    <section className="relative overflow-hidden bg-background pt-28 pb-36 transition-colors duration-500 md:pt-36">
      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-accent/8 blur-[110px]" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-3/4 overflow-hidden rounded-sm group shadow-soft">
              <Image
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg"
                alt="Signature Velvet Bow"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] opacity-90 dark:opacity-80"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
              />

              {/* Hotspot */}
              <div className="absolute top-1/2 right-1/3 w-8 h-8 flex items-center justify-center cursor-pointer group/hotspot">
                <div className="w-2 h-2 bg-accent rounded-full relative z-10"></div>
                <div className="absolute inset-0 bg-accent/30 rounded-full animate-ping"></div>
                <div className="absolute left-6 bg-surface/90 backdrop-blur-md text-text-primary text-xs p-3 w-48 rounded-sm opacity-0 group-hover/hotspot:opacity-100 transition-opacity duration-300 pointer-events-none border border-border-subtle shadow-soft">
                  <p className="font-serif italic text-accent mb-1">Silk Velvet</p>
                  <p>Hand-stitched in Italy</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-1"></div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6"
          >
            <span className="text-text-secondary text-xs tracking-[0.22em] lowercase italic block mb-6">the philosophy</span>
            <h2 className="text-4xl md:text-6xl font-light text-text-primary leading-[0.98] tracking-[-0.04em] mb-8">
              Not an accessory.
              {' '}
              <br />
              <span className="font-serif italic text-text-secondary opacity-75">A point of view.</span>
            </h2>
            <p className="text-xl text-text-secondary font-light leading-relaxed mb-10 max-w-lg">
              Each bow is cut to hold shape, catch light, and frame the face without shouting. We work in small batches with velvet, organza, pearls, and trims that feel collected rather than manufactured.
            </p>
            <Link href="/collections">
              <motion.div
                whileHover={{ x: 10 }}
                className="inline-flex items-center gap-3 text-text-primary border-b border-border-subtle pb-2 hover:border-accent transition-all duration-500 uppercase text-xs tracking-widest cursor-pointer"
              >
                Read the studio notes
                {' '}
                <ArrowRight className="w-3 h-3 text-accent" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
