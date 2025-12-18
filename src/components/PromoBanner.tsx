'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function PromoBanner () {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-[#050505]">
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0 w-full h-full"
      >
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <Image 
          src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-50" 
          alt="Seasonal Promo" 
          fill
        />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-20 text-center px-6 border border-white/10 bg-black/30 backdrop-blur-sm p-12 md:p-20 max-w-3xl"
      >
        <span className="block text-rose-400 text-xs tracking-[0.3em] uppercase mb-6">Limited Edition Drop</span>
        <h2 className="text-5xl md:text-7xl text-white font-light tracking-tight mb-6">The Gala Edit</h2>
        <p className="text-neutral-300 font-light text-lg mb-10">
          Exclusive pieces featuring Swarovski crystals and rare vintage lace.
        </p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-black px-12 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors"
        >
          Shop the Drop
        </motion.button>
      </motion.div>
    </section>
  );
};
