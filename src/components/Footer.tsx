import {
  IconBrandInstagram,
  IconBrandMeta,
  IconBrandX,
} from '@tabler/icons-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black pt-24 pb-12 border-t border-white/5">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-1">
            <Link
              href="/"
              className="text-2xl tracking-[0.2em] font-light text-white uppercase block mb-8"
            >
              Preety Twist
            </Link>
            <p className="text-neutral-400 text-sm font-light leading-relaxed max-w-xs">
              Redefining the art of hair accessories through uncompromising
              quality and modern design.
            </p>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-8">
              Shop
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/products"
                  className="text-neutral-400 hover:text-white transition-colors text-sm font-light tracking-wide"
                >
                  All Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sort=newest"
                  className="text-neutral-400 hover:text-white transition-colors text-sm font-light tracking-wide"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  className="text-neutral-400 hover:text-white transition-colors text-sm font-light tracking-wide"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/products?collection=velvet-edit"
                  className="text-neutral-400 hover:text-white transition-colors text-sm font-light tracking-wide"
                >
                  The Velvet Edit
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-8">
              Client Services
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/contact"
                  className="text-neutral-400 hover:text-white transition-colors text-sm font-light tracking-wide"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-neutral-400 hover:text-white transition-colors text-sm font-light tracking-wide"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-neutral-400 hover:text-white transition-colors text-sm font-light tracking-wide"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-neutral-400 hover:text-white transition-colors text-sm font-light tracking-wide"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-8">
              My Account
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/profile"
                  className="text-neutral-400 hover:text-white transition-colors text-sm font-light tracking-wide"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/my-orders"
                  className="text-neutral-400 hover:text-white transition-colors text-sm font-light tracking-wide"
                >
                  Order History
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="text-neutral-400 hover:text-white transition-colors text-sm font-light tracking-wide"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-neutral-400 hover:text-white transition-colors text-sm font-light tracking-wide"
                >
                  Shopping Bag
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
          <div className="flex gap-6 mb-4 md:mb-0">
            <span className="text-neutral-500 text-xs">
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
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <IconBrandInstagram className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/preetytwist"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <IconBrandX className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com/preetytwist"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <IconBrandMeta className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
