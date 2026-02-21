import type { Metadata } from 'next';
import { Share_Tech_Mono, Inter } from 'next/font/google';
import './globals.css';
import LCARSFrame from '@/components/lcars/LCARSFrame';

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'Mainline Hub — General Merchandise, All Sectors',
    template: '%s | Mainline Hub',
  },
  description:
    'Mainline Hub is your one-stop general merchandise store. Shop apparel, accessories, and more with the smoothest checkout in the quadrant.',
  openGraph: {
    title: 'Mainline Hub',
    description: 'General Merchandise — All Sectors',
    url: 'https://mainline-hub.com',
    siteName: 'Mainline Hub',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${shareTechMono.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <LCARSFrame>{children}</LCARSFrame>
      </body>
    </html>
  );
}
