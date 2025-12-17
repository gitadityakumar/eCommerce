'use client';

import { IconMenu2, IconMoonStars, IconSun, IconX } from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from '@/components/ui/navbar-menu';
// import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: 'Men', href: '/products?gender=men' },
  { label: 'Women', href: '/products?gender=women' },
  { label: 'Kids', href: '/products?gender=unisex' },
  { label: 'Collections', href: '/collections' },
  { label: 'Contact', href: '/contact' },
] as const;

export default function Navbar() {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  // fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md transition-all duration-500

  return (
    <div className="sticky top-0 z-50 w-full h-15 border-b border-white/5  bg-black/85 backdrop-blur-md transition-all duaration-500 flex items-center justify-center">

      <Menu setActive={setActive} className="border-none shadow-none bg-transparent dark:bg-transparent px-0 py-0 w-full justify-between mix-blend-difference z-50">
        {/* Logo */}
        <Link href="/" aria-label="PreetyTwist Home" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="PreetyTwist"
            width={24}
            height={24}
            priority
            className="ml-4"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm font-medium text-white dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors">
            Search
          </button>
          <button className="text-sm font-medium text-white dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors">
            Cart (2)
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const current = resolvedTheme === 'dark' ? 'light' : 'dark';
              setTheme(current);
            }}
            aria-label="Toggle theme"
            className="h-8 w-8 rounded-full   backdrop-blur-md shadow-sm hover:bg-white/10 transition-colors"
          >
            {mounted && resolvedTheme === 'dark'
              ? (
                  <IconSun size={18} className="text-white" />
                )
              : (
                  <IconMoonStars size={18} className="text-white" />
                )}
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden text-white dark:text-neutral-200"
          onClick={() => setOpen(!open)}
        >
          {open ? <IconX size={24} /> : <IconMenu2 size={24} />}
        </button>
      </Menu>

      {/* Mobile Menu Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-none dark:bg-black/80   md:hidden">
          <div className="flex flex-col space-y-4 bg-black/80  p-12">
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-lg font-medium text-white dark:text-neutral-200"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-4" />
            <button className="text-left text-lg font-medium text-white dark:text-neutral-200">
              Search
            </button>
            <button className="text-left text-lg font-medium text-white     dark:text-neutral-200">
              My Cart (2)
            </button>
            <div className="flex items-center gap-2 pt-2 pb-0">
              <span className="text-white dark:text-neutral-200">Theme:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              >
                {mounted && resolvedTheme === 'dark' ? <IconSun size={18} /> : <IconMoonStars size={18} className="text-gray-500" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
