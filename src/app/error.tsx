'use client';

import { IconHome, IconRefresh } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log to an error reporting service
    console.error('Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center bg-background text-foreground relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-destructive/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-2xl mx-auto space-y-8"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex justify-center mb-6"
          >
            <div className="h-1 bg-accent w-24 rounded-full" />
          </motion.div>

          <h1 className="font-playfair text-4xl md:text-5xl font-medium mb-4">
            Something went wrong
          </h1>
          <p className="font-montserrat text-muted-foreground text-lg md:text-xl max-w-lg mx-auto font-light">
            We encountered an unexpected issue. Our team has been notified.
            <br className="hidden md:block" />
            Please try refreshing the page.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => reset()}
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-montserrat font-medium text-sm tracking-widest uppercase hover:bg-accent hover:text-white transition-all duration-300 shadow-lg hover:shadow-accent/25"
          >
            <IconRefresh size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-8 py-4 border border-foreground/10 hover:border-accent text-foreground hover:text-accent rounded-full font-montserrat font-medium text-sm tracking-widest uppercase transition-all duration-300"
          >
            <IconHome size={16} />
            <span>Return Home</span>
          </Link>
        </motion.div>

        {/* Development Helper - Hidden in Production if desired, or kept for context if safe */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 p-4 bg-destructive/5 border border-destructive/20 rounded-lg max-w-xl mx-auto text-left"
          >
            <p className="font-mono text-xs text-destructive mb-2 font-bold uppercase tracking-wider">Error Details (Dev Only):</p>
            <p className="font-mono text-sm text-muted-foreground break-all">
              {error.message || 'Unknown error occurred'}
            </p>
            {error.digest && (
              <p className="font-mono text-xs text-muted-foreground mt-2">
                Digest:
                {' '}
                {error.digest}
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
