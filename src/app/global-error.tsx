'use client';

import { useEffect } from 'react';
import { appFontClassName } from '@/app/fonts';
import './globals.css';

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
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${appFontClassName} min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground text-center`}>
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
