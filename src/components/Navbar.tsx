"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { IconSun, IconMoonStars } from '@tabler/icons-react';

const NAV_LINKS = [
  { label: "Men", href: "/products?gender=men" },
  { label: "Women", href: "/products?gender=women" },
  { label: "Kids", href: "/products?gender=unisex" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render theme-dependent UI after mount
  useEffect(() => setMounted(true), []);

  return (
    <header className="bg-red-500/50 supports-[backdrop-filter]:bg-red-400/30 sticky top-0 z-50 w-full border-b backdrop-blur">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <Link href="/" aria-label="Nike Home" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Nike"
            width={28}
            height={28}
            priority
            className="invert"
          />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-body text-white transition-colors hover:text-gray-200"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-6 md:flex">
          <button className="text-body text-white transition-colors hover:text-gray-200">
            Search
          </button>
          <button className="text-body text-white transition-colors hover:text-gray-200">
            My Cart (2)
          </button>

          {/* Theme toggle: single button (no dropdown). Default follows system (configured in ThemeProvider). */}
          <Button
            variant="ghost"
            onClick={() => {
              // If currently dark (resolved), switch to light; otherwise switch to dark.
              // resolvedTheme takes into account system preference when defaultTheme='system'.
              const current = resolvedTheme === "dark" ? "light" : "dark";
              setTheme(current);
            }}
            aria-label="Toggle theme"
            className="!text-white "
          >
            {mounted && resolvedTheme === "dark" ? (
              <IconSun size={18} />
            ) : (
              <IconMoonStars size={18} />
            )}
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="mb-1 block h-0.5 w-6 bg-white"></span>
          <span className="mb-1 block h-0.5 w-6 bg-white"></span>
          <span className="block h-0.5 w-6 bg-white"></span>
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`border-t border-light-300 md:hidden ${open ? "block" : "hidden"}`}
      >
        <ul className="space-y-2 px-4 py-3">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block py-2 text-body text-white hover:text-gray-200"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="flex items-center justify-between pt-2">
            <button className="text-body text-white">Search</button>
            <button className="text-body text-white">My Cart (2)</button>
          </li>
          <li className="flex items-center justify-center pt-2">
            {/* Mobile theme toggle. */}
            <button
              onClick={() => {
                const current = resolvedTheme === "dark" ? "light" : "dark";
                setTheme(current);
              }}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-body text-white hover:text-gray-200"
              aria-label="Toggle theme"
            >
              {mounted && resolvedTheme === "dark" ? (
                <IconSun size={18} />
              ) : (
                <IconMoonStars size={18} />
              )}
              <span className="sr-only">Toggle theme</span>
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
