'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface LegalSectionCardProps {
  title: string;
  headerIcon: ReactNode;
  items: string[];
  itemIcon: ReactNode;
  sectionIndex: number;
}

interface LegalHeroProps {
  title: ReactNode;
  description: ReactNode;
  meta: ReactNode;
}

interface LegalNoticeCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  delay?: number;
}

interface LegalContactCardProps {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  emailHref: string;
  emailLabel: string;
}

interface LegalLinksProps {
  primaryHref: string;
  primaryLabel: string;
}

export function LegalPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[80vh] bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-24 md:py-32">
        {children}
      </div>
    </div>
  );
}

export function LegalHero({ title, description, meta }: LegalHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16 md:mb-20"
    >
      <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase block mb-6">
        Legal
      </span>
      <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6">
        {title}
      </h1>
      <p className="font-inter text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
        {description}
      </p>
      <div className="mt-6">{meta}</div>
    </motion.div>
  );
}

export function LegalIntroCard({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 md:p-8 mb-8"
    >
      <p className="font-inter text-muted-foreground text-base leading-relaxed">{children}</p>
    </motion.div>
  );
}

export function LegalSectionCard({ title, headerIcon, items, itemIcon, sectionIndex }: LegalSectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: sectionIndex * 0.08 }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl overflow-hidden hover:border-accent/20 transition-colors duration-300"
    >
      <div className="px-6 py-5 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          {headerIcon}
          <h3 className="font-playfair text-xl md:text-2xl font-light text-foreground">{title}</h3>
        </div>
      </div>

      <div className="px-6 py-5">
        <ul className="space-y-3">
          {items.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: sectionIndex * 0.08 + index * 0.05 }}
              className="flex items-start gap-3"
            >
              <span className="text-accent mt-1.5 shrink-0">{itemIcon}</span>
              <span className="font-inter text-muted-foreground text-sm leading-relaxed">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function LegalNoticeCard({ title, icon, children, delay = 0.6 }: LegalNoticeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 md:p-8 mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="font-playfair text-xl md:text-2xl font-light text-foreground">{title}</h3>
      </div>
      <p className="font-inter text-muted-foreground text-sm leading-relaxed">{children}</p>
    </motion.div>
  );
}

export function LegalContactCard({ icon, title, description, emailHref, emailLabel }: LegalContactCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="text-center bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 md:p-12"
    >
      <div className="flex justify-center mb-5">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent">
          {icon}
        </div>
      </div>
      <h2 className="font-playfair text-2xl md:text-3xl font-light mb-4">{title}</h2>
      <p className="font-inter text-muted-foreground text-base max-w-lg mx-auto mb-8">{description}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          asChild
          className="group h-12 px-8 bg-accent hover:bg-accent/90 text-white rounded-full font-montserrat uppercase tracking-widest text-xs font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
        >
          <Link href="/contact">Contact Us</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-12 px-8 border-border hover:border-accent rounded-full font-montserrat uppercase tracking-widest text-xs font-semibold transition-all duration-300"
        >
          <a href={emailHref}>{emailLabel}</a>
        </Button>
      </div>
    </motion.div>
  );
}

export function LegalLinks({ primaryHref, primaryLabel }: LegalLinksProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="text-center mt-12"
    >
      <p className="font-inter text-muted-foreground text-sm">
        Also see our
        {' '}
        <Link href={primaryHref} className="text-accent hover:underline underline-offset-4">
          {primaryLabel}
        </Link>
        {' '}
        and
        {' '}
        <Link href="/faq" className="text-accent hover:underline underline-offset-4">
          FAQ
        </Link>
      </p>
    </motion.div>
  );
}
