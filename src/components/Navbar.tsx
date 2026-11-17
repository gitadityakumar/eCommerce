'use client';

import {
  IconSearch,
  IconShoppingCart,
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu } from '@/components/ui/navbar-menu';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';
import { useUserCartStore } from '@/store/user-cart';
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
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const guestItemCount = useCartStore(s => s.getItemCount());
  const userItemCount = useUserCartStore(s => s.count);
  const fetchUserCount = useUserCartStore(s => s.fetchCount);

  const cartItemCount = isAuthenticated ? userItemCount : guestItemCount;

  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = pathname === '/';
  const isTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      fetchUserCount();
    }
  }, [isAuthenticated, fetchUserCount]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isActiveNavLink = (href: string) => {
    const [hrefPath, hrefQuery] = href.split('?');

    if (pathname !== hrefPath) {
      return false;
    }

    if (!hrefQuery) {
      return pathname === hrefPath && !searchParams.has('gender');
    }

    const expectedParams = new URLSearchParams(hrefQuery);
    return Array.from(expectedParams.entries()).every(
      ([key, value]) => searchParams.get(key) === value,
    );
  };

  return (
    <div
      className={cn(
        'z-50 flex h-15 w-full items-center justify-center transition-all duration-300',
        isHomePage ? 'fixed top-0 left-0 right-0' : 'sticky top-0',
        isTransparent
          ? 'border-b border-white/10 bg-gradient-to-b from-black/55 via-black/25 to-transparent backdrop-blur-[2px]'
          : 'border-b border-border-subtle bg-background/85 backdrop-blur-md shadow-xs',
      )}
    >
      <Menu setActive={setActive} className="border-none shadow-none bg-transparent dark:bg-transparent px-4 py-0 w-full justify-between z-50">
        {/* Logo - Always visible */}
        <Link href="/" aria-label="PreetyTwist Home" className="flex items-center shrink-0">
          <Image
            src="/logo.svg"
            alt="PreetyTwist"
            width={418}
            height={347}
            priority
            className={cn(
              'h-5 w-6 transition-all duration-300',
              isTransparent ? 'brightness-125 filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]' : 'dark:invert',
            )}
          />
        </Link>

        {/* Primary Navigation Links - Desktop ONLY (≥1024px) */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map(l => (
            (() => {
              const active = isActiveNavLink(l.href);

              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative text-sm font-medium transition-colors after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:transition-transform after:duration-300',
                    isTransparent
                      ? cn(
                          'text-white/90 drop-shadow-sm hover:text-white',
                          active ? 'text-white font-semibold after:scale-x-100 after:bg-white' : 'after:scale-x-0 after:bg-white/80',
                        )
                      : cn(
                          'text-text-primary hover:text-accent',
                          active ? 'text-accent after:scale-x-100 after:bg-accent' : 'after:scale-x-0 after:bg-accent',
                        ),
                  )}
                >
                  {l.label}
                </Link>
              );
            })()
          ))}
        </div>

        {/* Actions - Desktop, Tablet, and Mobile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search - Expandable on all breakpoints */}
          <div className="relative flex items-center h-10 min-w-[40px] justify-end">
            <div
              className={cn(
                'absolute right-0 flex h-9 w-[180px] origin-right items-center overflow-hidden rounded-full border shadow-soft transition-[opacity,transform] duration-200 ease-out lg:w-[260px]',
                isTransparent
                  ? 'border-white/20 bg-black/60 backdrop-blur-md text-white'
                  : 'border-border-subtle bg-background/88 text-text-primary',
                isSearchOpen ? 'scale-x-100 opacity-100' : 'pointer-events-none scale-x-0 opacity-0',
              )}
            >
              {isSearchOpen && (
                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search bows, velvet, pearl..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  onBlur={() => {
                    if (!searchQuery)
                      setIsSearchOpen(false);
                  }}
                  className={cn(
                    'ml-10 w-full appearance-none border-none! bg-transparent pr-4 text-xs outline-none! ring-0! ring-offset-0!',
                    isTransparent ? 'text-white placeholder:text-white/60' : 'text-text-primary placeholder:text-text-secondary/60',
                  )}
                />
              )}
            </div>
            <button
              onClick={() => {
                if (isSearchOpen) {
                  handleSearch();
                }
                else {
                  setIsSearchOpen(true);
                }
              }}
              className={cn(
                'z-10 flex h-10 w-10 items-center justify-center rounded-full p-2 transition-all duration-300 active:scale-95',
                isTransparent
                  ? 'text-white hover:bg-white/15'
                  : 'text-text-primary hover:bg-accent/8 hover:text-accent',
                isSearchOpen && (isTransparent ? 'absolute left-0 text-white' : 'absolute left-0 text-accent'),
              )}
              aria-label="Search"
            >
              <IconSearch size={20} />
            </button>
          </div>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className={cn(
              'relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 active:scale-95',
              isTransparent
                ? 'text-white hover:bg-white/15'
                : 'text-text-primary hover:bg-accent/8 hover:text-accent',
            )}
            aria-label="Cart"
          >
            <IconShoppingCart size={20} />
            {mounted && cartItemCount > 0 && (
              <span className={cn(
                'absolute top-1 right-1 transform translate-x-1/2 -translate-y-1/2 text-[9px] font-bold bg-accent text-white px-1.5 rounded-full h-4 min-w-4 flex items-center justify-center border-2 shadow-soft group-hover:scale-110 transition-transform',
                isTransparent ? 'border-black/40' : 'border-background',
              )}>
                {cartItemCount}
              </span>
            )}
          </Link>

          {mounted && <ProfileDropdown isTransparent={isTransparent} />}
        </div>
      </Menu>
    </div>
  );
}
