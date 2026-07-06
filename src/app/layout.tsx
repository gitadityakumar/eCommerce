import type { Metadata } from 'next';
import { appFontClassName } from '@/app/fonts';
import { AuthProvider } from '@/components/AuthProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://preetytwist.com'),
  title: {
    default: 'Preety Twist | Editorial hair accessories',
    template: '%s | Preety Twist',
  },
  description: 'Small-batch hair bows and occasion accessories made with velvet, silk, pearls, and archival trims.',
  openGraph: {
    title: 'Preety Twist | Editorial hair accessories',
    description: 'Small-batch hair bows and occasion accessories made with velvet, silk, pearls, and archival trims.',
    siteName: 'Preety Twist',
    type: 'website',
    images: [
      {
        url: '/readme/banner.png',
        width: 1200,
        height: 630,
        alt: 'Preety Twist editorial accessories campaign',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Preety Twist | Editorial hair accessories',
    description: 'Small-batch hair bows and occasion accessories made with velvet, silk, pearls, and archival trims.',
    images: ['/readme/banner.png'],
  },
};

export default function RootShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={appFontClassName}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div id="main-content">
              {children}
            </div>
          </AuthProvider>
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
