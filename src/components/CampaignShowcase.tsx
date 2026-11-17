'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CampaignShowcase() {
  return (
    <section className="py-20 overflow-hidden bg-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-20 border-b border-border-subtle pb-6"
        >
          <h3 className="text-3xl font-light text-text-primary tracking-[-0.03em]">
            Evening study
            {' '}
            <span className="font-serif italic text-text-secondary">No. 05</span>
          </h3>
          <Link href="/collections" className="text-text-secondary hover:text-accent text-sm tracking-widest uppercase transition-colors">
            View lookbook
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 auto-rows-[minmax(200px,auto)]">
          {/* Large Hero Item */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-6 md:row-span-2 relative group cursor-pointer"
          >
            <Link href="/products">
              <div className="relative min-h-[34rem] overflow-hidden bg-surface shadow-soft md:h-[78dvh] md:max-h-[48rem]">
                <Image
                  src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg"
                  className="object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100 dark:opacity-80"
                  alt="Model Portrait"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <div className="absolute bottom-0 left-0 w-full p-8 bg-linear-to-t from-black/60 to-transparent">
                  <p className="text-white text-3xl font-serif italic mb-2">Grand velvet bow</p>
                  <p className="text-neutral-300 text-sm tracking-widest uppercase">₹18,000.00</p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Texture Detail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-6 md:row-span-1 relative group cursor-pointer overflow-hidden shadow-soft rounded-sm"
          >
            <Link href="/collections">
              <div className="relative w-full h-[22rem] md:h-full min-h-[18rem]">
                <Image
                  src="/editorial/velvet-texture-detail.jpg"
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-95 dark:opacity-85"
                  alt="Silver Thread & Seed Pearl Hand-stitched Texture Detail"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/70 z-10 flex items-end justify-center pb-8" />
                <div className="absolute top-6 right-6 z-20">
                  <span className="bg-surface/90 backdrop-blur-md text-text-primary text-[10px] font-bold px-3 py-1 uppercase tracking-widest shadow-soft border border-border-subtle">
                    New cut
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 z-20">
                  <h4 className="text-white text-xl font-light font-(--font-playfair)">Silver Thread & Seed Pearl</h4>
                  <p className="text-neutral-300 text-xs tracking-widest uppercase mt-1">Artisanal Details</p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Product Focus Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-3 md:row-span-1 relative group cursor-pointer bg-surface shadow-soft transition-all duration-500 rounded-sm"
          >
            <Link href="/products" className="block h-full">
              <div className="p-8 flex flex-col justify-between h-full border border-border-subtle hover:border-accent/40 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="text-text-secondary text-xs">01.</span>
                  <Plus className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <Image
                  src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg"
                  className="w-32 h-32 object-cover mx-auto my-4 rounded-full shadow-soft group-hover:scale-105 transition-transform duration-500"
                  alt="Petite Noir Bow"
                  width={128}
                  height={128}
                />
                <div>
                  <h4 className="text-text-primary text-lg font-light leading-tight">Petite Noir</h4>
                  <p className="text-text-secondary text-sm mt-1">₹8,500.00</p>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-3 md:row-span-1 relative group bg-bg-secondary flex items-center justify-center shadow-soft rounded-sm p-8"
          >
            <div className="text-center p-2">
              <h4 className="text-2xl font-(--font-playfair) italic text-text-primary mb-3">Custom Atelier</h4>
              <p className="text-text-secondary text-xs font-light leading-relaxed mb-6">
                Bespoke commissions for weddings and galas.
              </p>
              <Link
                href="/contact"
                className="inline-block border border-border-subtle bg-surface/80 px-7 py-3 text-xs uppercase tracking-widest text-text-primary transition-all duration-300 hover:border-text-primary hover:bg-text-primary hover:text-background hover:scale-105 active:scale-95 shadow-soft rounded-full"
              >
                Inquire
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
