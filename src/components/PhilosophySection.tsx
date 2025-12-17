'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image';

export default function PhilosophySection () {
  return (
    <section className="overflow-hidden bg-[#030303] pt-32 pb-32 relative">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm group">
              <Image 
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg" 
                alt="Signature Velvet Bow" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] opacity-90"
              />
              
              {/* Hotspot */}
              <div className="absolute top-1/2 right-1/3 w-8 h-8 flex items-center justify-center cursor-pointer group/hotspot">
                <div className="w-2 h-2 bg-white rounded-full relative z-10"></div>
                <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
                <div className="absolute left-6 bg-black/80 backdrop-blur-md text-white text-xs p-3 w-48 rounded-sm opacity-0 group-hover/hotspot:opacity-100 transition-opacity duration-300 pointer-events-none border border-white/10">
                  <p className="font-serif italic text-neutral-300 mb-1">Silk Velvet</p>
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
            <span className="text-neutral-500 text-xs tracking-[0.3em] uppercase block mb-6">The Philosophy</span>
            <h2 className="text-4xl md:text-6xl font-light text-white leading-none tracking-tight mb-8">
              Sculpted from <br />
              <span className="font-serif italic text-neutral-400">shadow & light.</span>
            </h2>
            <p className="text-xl text-neutral-400 font-light leading-relaxed mb-10 max-w-lg">
              We believe an accessory is not an addition, but a completion. Our bows are architectural statements, crafted from vintage Japanese silks and French velvets, designed to define the silhouette of the modern muse.
            </p>
            <motion.a 
              whileHover={{ x: 10 }}
              href="#" 
              className="inline-flex items-center gap-3 text-white border-b border-white/30 pb-2 hover:border-white transition-all duration-500 uppercase text-xs tracking-widest"
            >
              Read the Journal <ArrowRight className="w-3 h-3" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
