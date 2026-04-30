'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MarketingPageShellProps {
  maxWidthClassName?: string;
  children: ReactNode;
}

interface MarketingHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
}

export function MarketingPageShell({ children, maxWidthClassName = 'max-w-7xl' }: MarketingPageShellProps) {
  return (
    <div className="min-h-[80vh] bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className={`relative z-10 ${maxWidthClassName} mx-auto px-6 md:px-12 py-24 md:py-32`}>
        {children}
      </div>
    </div>
  );
}

export function MarketingHero({ eyebrow, title, description }: MarketingHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16 md:mb-24"
    >
      <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase block mb-6">
        {eyebrow}
      </span>
      <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6">
        {title}
      </h1>
      <p className="font-inter text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
