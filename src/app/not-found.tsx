'use client';

import { IconArrowLeft } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center bg-background text-foreground relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-2xl mx-auto space-y-8"
      >
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-playfair text-[8rem] md:text-[12rem] leading-none font-medium text-accent/10 select-none"
          >
            404
          </motion.h1>

          <div className="-mt-12 md:-mt-20 relative z-20">
            <h2 className="font-playfair text-3xl md:text-5xl font-medium mb-4">
              Page Not Found
            </h2>
            <p className="font-montserrat text-muted-foreground text-lg md:text-xl max-w-lg mx-auto font-light">
              We couldn't seem to find the page you're looking for. It may have been moved or doesn't exist.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-montserrat font-medium text-sm tracking-widest uppercase hover:bg-accent hover:text-white transition-all duration-300 shadow-lg hover:shadow-accent/25"
          >
            <IconArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Atelier</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
