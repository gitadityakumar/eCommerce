'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function PhilosophySection() {
  const [isHotspotOpen, setIsHotspotOpen] = useState(false);

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
            <div className="relative aspect-3/4 overflow-hidden rounded-md group shadow-lifted border border-border-subtle/60">
              <Image
                src="/editorial/signature-velvet-bow.jpg"
                alt="Signature Velvet Bow by Preety Twist"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] opacity-95 dark:opacity-90"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                priority
              />

              {/* Accessible Hotspot (Touch & Click Support) */}
              <button
                type="button"
                onClick={() => setIsHotspotOpen(prev => !prev)}
                onMouseEnter={() => setIsHotspotOpen(true)}
                onMouseLeave={() => setIsHotspotOpen(false)}
                onFocus={() => setIsHotspotOpen(true)}
                onBlur={() => setIsHotspotOpen(false)}
                aria-expanded={isHotspotOpen}
                aria-label="Toggle craftsmanship details: Italian Silk Velvet"
                className="absolute top-[48%] right-[28%] w-9 h-9 flex items-center justify-center cursor-pointer group/hotspot focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full z-20"
              >
                <div className="w-2.5 h-2.5 bg-accent rounded-full relative z-10 shadow-sm" />
                <div className="absolute inset-0 bg-accent/35 rounded-full animate-ping" />
                <div
                  className={cn(
                    'absolute left-7 top-1/2 -translate-y-1/2 bg-surface/95 backdrop-blur-md text-text-primary text-xs p-3.5 w-52 rounded-md transition-all duration-300 pointer-events-none border border-border-subtle shadow-lifted text-left z-30',
                    isHotspotOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none',
                  )}
                >
                  <p className="font-(--font-playfair) italic text-accent font-medium mb-1">Italian Silk Velvet</p>
                  <p className="text-text-secondary text-[11px] leading-relaxed font-light">
                    Hand-shaped and stitched with silk threads in our private studio run.
                  </p>
                </div>
              </button>
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
            <span className="text-text-secondary text-xs tracking-[0.24em] uppercase font-medium block mb-6">the philosophy</span>
            <h2 className="text-4xl md:text-6xl font-light text-text-primary leading-[1.02] tracking-[-0.035em] mb-8 font-(--font-playfair)">
              Not an accessory.
              {' '}
              <br />
              <span className="italic text-text-secondary opacity-80">A point of view.</span>
            </h2>
            <p className="text-lg md:text-xl text-text-secondary font-light leading-relaxed mb-10 max-w-lg">
              Each bow is cut to hold shape, catch light, and frame the face without shouting. We work in small batches with velvet, organza, pearls, and trims that feel collected rather than manufactured.
            </p>
            <Link href="/collections" className="inline-block">
              <motion.div
                whileHover={{ x: 8 }}
                className="inline-flex items-center gap-3 text-text-primary border-b border-border-subtle pb-2 hover:border-accent hover:text-accent transition-all duration-300 uppercase text-xs tracking-widest cursor-pointer"
              >
                Read the studio notes
                {' '}
                <ArrowRight className="w-3.5 h-3.5 text-accent" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
