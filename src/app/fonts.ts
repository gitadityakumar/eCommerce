import { Inter, Jost, Montserrat, Playfair_Display } from 'next/font/google';

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

export const appFontClassName = `${jost.className} ${playfair.variable} ${montserrat.variable} ${inter.variable} antialiased`;
