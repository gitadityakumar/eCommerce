import {
  IconBrandInstagram,
  IconBrandMeta,
  IconBrandX,
} from '@tabler/icons-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle bg-bg-secondary pt-24 pb-12 text-text-primary">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 gap-16 mb-24 md:grid-cols-2 lg:grid-cols-[1.35fr_0.85fr_0.85fr_0.85fr]">
          <div>
            <Link
              href="/"
              className="mb-8 block text-2xl font-light uppercase tracking-[0.2em] text-text-primary transition-colors hover:text-accent"
            >
              Preety Twist
            </Link>
            <p className="max-w-xs text-sm font-light leading-7 text-text-secondary">
              Hair bows and occasion pieces made in small runs from velvet, silk, pearls, and trims with a past life.
            </p>
          </div>

          <div>
            <h4 className="text-text-primary text-xs font-bold tracking-[0.2em] uppercase mb-8">
              Shop
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/products"
                  className="text-text-secondary hover:text-accent transition-colors text-sm font-light tracking-wide"
                >
                  All Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sort=newest"
                  className="text-text-secondary hover:text-accent transition-colors text-sm font-light tracking-wide"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  className="text-text-secondary hover:text-accent transition-colors text-sm font-light tracking-wide"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/products?collection=velvet-edit"
                  className="text-text-secondary hover:text-accent transition-colors text-sm font-light tracking-wide"
                >
                  The Velvet Edit
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary text-xs font-bold tracking-[0.2em] uppercase mb-8">
              Client Services
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/contact"
                  className="text-text-secondary hover:text-accent transition-colors text-sm font-light tracking-wide"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-text-secondary hover:text-accent transition-colors text-sm font-light tracking-wide"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-text-secondary hover:text-accent transition-colors text-sm font-light tracking-wide"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-text-secondary hover:text-accent transition-colors text-sm font-light tracking-wide"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary text-xs font-bold tracking-[0.2em] uppercase mb-8">
              My Account
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/profile"
                  className="text-text-secondary hover:text-accent transition-colors text-sm font-light tracking-wide"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/my-orders"
                  className="text-text-secondary hover:text-accent transition-colors text-sm font-light tracking-wide"
                >
                  Order History
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="text-text-secondary hover:text-accent transition-colors text-sm font-light tracking-wide"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-text-secondary hover:text-accent transition-colors text-sm font-light tracking-wide"
                >
                  Shopping Bag
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border-subtle">
          <div className="flex gap-6 mb-4 md:mb-0">
            <span className="text-text-secondary text-xs">
              ©
              {currentYear}
              {' '}
              Preety Twist
            </span>
          </div>
          <div className="flex gap-6">
            <a
              href="https://instagram.com/preetytwist"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent transition-colors"
              aria-label="Preety Twist on Instagram"
            >
              <IconBrandInstagram className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/preetytwist"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent transition-colors"
              aria-label="Preety Twist on X"
            >
              <IconBrandX className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com/preetytwist"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent transition-colors"
              aria-label="Preety Twist on Facebook"
            >
              <IconBrandMeta className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
