import type { Metadata } from 'next';
import { DM_Sans, Space_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '700'],
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Mainline Hub — A Curated General Store',
    template: '%s | Mainline Hub',
  },
  description:
    'Good stuff from everywhere, for everyone. Shop apparel, home goods, accessories, art, and more at Mainline Hub.',
  openGraph: {
    title: 'Mainline Hub',
    description: 'A curated general store. Good stuff from everywhere, for everyone.',
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
    <html lang="en" className={`${dmSans.variable} ${spaceMono.variable}`}>
      <body className="font-body">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
