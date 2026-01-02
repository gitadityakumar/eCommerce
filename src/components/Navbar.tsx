'use client';

import {
  IconSearch,
  IconShoppingCart,
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Menu } from '@/components/ui/navbar-menu';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { ProfileDropdown } from './ProfileDropdown';

const NAV_LINKS = [
  { label: 'Products', href: '/products' },
  { label: 'Women', href: '/products?gender=women' },
  { label: 'Collections', href: '/collections' },
  { label: 'Contact', href: '/contact' },
] as const;

export default function Navbar() {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [active, setActive] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const cartItemCount = useCartStore(s => s.getItemCount());

  useEffect(() => setMounted(true), []);

  return (
    <div className="sticky top-0 z-50 w-full h-15 border-b border-border-subtle bg-background/80 backdrop-blur-md transition-all duration-300 flex items-center justify-center">
      <Menu setActive={setActive} className="border-none shadow-none bg-transparent dark:bg-transparent px-4 py-0 w-full justify-between z-50">
        {/* Logo - Always visible */}
        <Link href="/" aria-label="PreetyTwist Home" className="flex items-center shrink-0">
          <Image
            src="/logo.svg"
            alt="PreetyTwist"
            width={24}
            height={24}
            priority
            className="dark:invert"
          />
        </Link>

        {/* Primary Navigation Links - Desktop ONLY (≥1024px) */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-text-primary hover:text-accent transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions - Desktop, Tablet, and Mobile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search - Expandable on all breakpoints */}
          <div className="relative flex items-center h-10 min-w-[40px] justify-end">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: mounted && window.innerWidth >= 1024 ? 260 : 180, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="absolute right-0 flex items-center h-9 bg-background/80 backdrop-blur-sm border border-border-subtle rounded-full overflow-hidden"
                >
                  <input
                    ref={searchInputRef}
                    type="search"
                    placeholder="Search Atelier..."
                    onBlur={() => setIsSearchOpen(false)}
                    className="bg-transparent border-none! outline-none! ring-0! ring-offset-0! text-xs text-text-primary placeholder:text-text-secondary/60 ml-10 w-full pr-4 appearance-none"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={cn(
                'hover:bg-accent/5 hover:text-accent transition-all duration-300 p-2 z-10 rounded-full h-10 w-10 flex items-center justify-center',
                isSearchOpen ? 'absolute left-0 text-accent' : 'text-text-primary hover:bg-accent/5',
              )}
              aria-label="Search"
            >
              <IconSearch size={20} />
            </button>
          </div>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="text-text-primary hover:text-accent transition-all duration-300 h-10 w-10 flex items-center justify-center rounded-full hover:bg-accent/5 relative"
            aria-label="Cart"
          >
            <IconShoppingCart size={20} />
            {mounted && cartItemCount > 0 && (
              <span className="absolute top-1 right-1 transform translate-x-1/2 -translate-y-1/2 text-[9px] font-bold bg-accent text-white px-1.5 rounded-full h-4 min-w-4 flex items-center justify-center border-2 border-background shadow-soft group-hover:scale-110 transition-transform">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Profile Avatar Icon - Always visible, top-right */}
          <ProfileDropdown />
        </div>
      </Menu>
    </div>
  );
}
