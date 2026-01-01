'use client';

import { IconMenu2, IconMoonStars, IconSearch, IconShoppingBagHeart, IconShoppingCart, IconSun, IconX } from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from '@/components/ui/navbar-menu';
import { useCartStore } from '@/store/cart';

const NAV_LINKS = [
  { label: 'Products', href: '/products' },
  { label: 'Women', href: '/products?gender=women' },
  // { label: 'Kids', href: '/products?gender=unisex' },
  { label: 'Collections', href: '/collections' },
  { label: 'Contact', href: '/contact' },
] as const;

export default function Navbar() {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const cartItemCount = useCartStore(s => s.getItemCount());

  useEffect(() => setMounted(true), []);

  return (
    <div className="sticky top-0 z-50 w-full h-15 border-b border-border-subtle bg-background/80 backdrop-blur-md transition-all duration-300 flex items-center justify-center">

      <Menu setActive={setActive} className="border-none shadow-none bg-transparent dark:bg-transparent px-0 py-0 w-full justify-between z-50">
        {/* Logo */}
        <Link href="/" aria-label="PreetyTwist Home" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="PreetyTwist"
            width={24}
            height={24}
            priority
            className="ml-4 dark:invert"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
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

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            className="text-text-primary hover:text-accent transition-colors p-2"
            aria-label="Search"
          >
            <IconSearch size={20} />
          </button>
          <button
            className="text-text-primary hover:text-accent transition-colors p-2"
            aria-label="Wishlist"
          >
            <IconShoppingBagHeart size={20} />
          </button>
          <Link
            href="/cart"
            className="text-text-primary hover:text-accent transition-colors p-2 relative"
            aria-label="Cart"
          >
            <IconShoppingCart size={20} />
            <span className="absolute top-1 right-1 transform translate-x-1/2 -translate-y-1/2 text-[9px] font-bold bg-accent text-white px-1.5 rounded-full h-4 min-w-4 flex items-center justify-center border-2 border-background shadow-soft group-hover:scale-110 transition-transform">
              {mounted ? cartItemCount : 0}
            </span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const current = resolvedTheme === 'dark' ? 'light' : 'dark';
              setTheme(current);
            }}
            aria-label="Toggle theme"
            className="h-8 w-8 rounded-full text-text-primary hover:bg-surface/50 transition-colors"
          >
            {mounted && resolvedTheme === 'dark'
              ? (
                  <IconSun size={18} />
                )
              : (
                  <IconMoonStars size={18} />
                )}
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden text-text-primary"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <IconX size={24} /> : <IconMenu2 size={24} />}
        </button>
      </Menu>

      {/* Mobile Menu Overlay */}
      {open && (mounted && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col space-y-4 p-12">
            <div className="flex justify-between items-center mb-8">
              <Link href="/" onClick={() => setOpen(false)}>
                <Image src="/logo.svg" alt="PreetyTwist" width={24} height={24} className="dark:invert" />
              </Link>
              <button onClick={() => setOpen(false)} className="text-text-primary">
                <IconX size={24} />
              </button>
            </div>
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-2xl font-light text-text-primary"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-border-subtle my-8" />
            <div className="flex flex-col gap-6">
              <button
                className="text-text-primary flex items-center gap-4"
                onClick={() => setOpen(false)}
              >
                <IconSearch size={24} />
                <span className="text-xl font-light">Search</span>
              </button>
              <button
                className="text-text-primary flex items-center gap-4"
                onClick={() => setOpen(false)}
              >
                <IconShoppingBagHeart size={24} />
                <span className="text-xl font-light">Wishlist</span>
              </button>
              <Link
                href="/cart"
                className="text-text-primary flex items-center gap-4"
                onClick={() => setOpen(false)}
              >
                <IconShoppingCart size={24} />
                <span className="text-xl font-light">
                  Cart (
                  {mounted ? cartItemCount : 0}
                  )
                </span>
              </Link>
            </div>
            <div className="flex items-center justify-between mt-auto pt-12">
              <span className="text-text-secondary uppercase tracking-widest text-xs">Switch Theme</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="w-12 h-12 rounded-full border border-border-subtle"
              >
                {resolvedTheme === 'dark' ? <IconSun size={20} /> : <IconMoonStars size={20} />}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
