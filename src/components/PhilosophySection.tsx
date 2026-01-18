'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PhilosophySection() {
  return (
    <section className="overflow-hidden bg-background pt-32 pb-32 relative transition-colors duration-500">
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
            <span className="text-text-secondary text-xs tracking-[0.3em] uppercase block mb-6">The Philosophy</span>
            <h2 className="text-4xl md:text-6xl font-light text-text-primary leading-none tracking-tight mb-8">
              Sculpted from
              {' '}
              <br />
              <span className="font-serif italic text-text-secondary opacity-70">shadow & light.</span>
            </h2>
            <p className="text-xl text-text-secondary font-light leading-relaxed mb-10 max-w-lg">
              We believe an accessory is not an addition, but a completion. Our bows are architectural statements, crafted from vintage Japanese silks and French velvets, designed to define the silhouette of the modern muse.
            </p>
            <Link href="/collections">
              <motion.div
                whileHover={{ x: 10 }}
                className="inline-flex items-center gap-3 text-text-primary border-b border-border-subtle pb-2 hover:border-accent transition-all duration-500 uppercase text-xs tracking-widest cursor-pointer"
              >
                Read the Journal
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
