import type { Metadata } from 'next';
import { DM_Sans, Darker_Grotesque, Epilogue, Azeret_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '700'],
});

const darkerGrotesque = Darker_Grotesque({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['400', '500', '600'],
});

const epilogue = Epilogue({
  subsets: ['latin'],
  variable: '--font-headline-alt',
  weight: ['300', '400'],
  style: ['normal', 'italic'],
});

const azeretMono = Azeret_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
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
    <html lang="en" className={`${dmSans.variable} ${darkerGrotesque.variable} ${epilogue.variable} ${azeretMono.variable}`}>
      <body className="font-body">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
