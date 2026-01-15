'use client';

import { Inter, Jost, Montserrat, Playfair_Display } from 'next/font/google';
import { useEffect } from 'react';
import './globals.css';

// Re-define fonts to ensure they are available in this isolated layout
const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className={`${jost.className} ${playfair.variable} ${montserrat.variable} ${inter.variable} antialiased min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground text-center`}>
        <div className="max-w-md w-full space-y-8">
          <div className="space-y-4">
            <h1 className="font-playfair text-4xl font-bold">
              Critical Error
            </h1>
            <p className="font-montserrat text-muted-foreground text-sm">
              We apologize, but a critical error has occurred and the application cannot be rendered.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-foreground text-background font-montserrat font-medium text-sm tracking-widest uppercase hover:bg-accent transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
