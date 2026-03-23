'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/stores/cart';

const navLinks = [
  { label: 'Shop All', href: '/products' },
  { label: 'New Arrivals', href: '/products?sort=newest' },
  { label: 'Apparel', href: '/products?category=tees' },
  { label: 'Home + Goods', href: '/products?category=home' },
  { label: 'Accessories', href: '/products?category=accessories' },
];

export default function Navbar() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());

  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 md:py-6 bg-bg/85 backdrop-blur-[20px] border-b border-border">
      <Link href="/" className="font-mono font-bold text-[1.15rem] tracking-[0.08em] uppercase">
        Mainline<span className="text-accent">Hub</span>
      </Link>

      <ul className="hidden md:flex gap-8 list-none">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[0.85rem] tracking-[0.12em] uppercase text-text-mid hover:text-text transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/cart"
        className="font-mono text-[0.85rem] text-text-mid border border-border px-5 py-2.5 rounded-[4px] hover:border-accent hover:text-accent transition-all duration-200"
      >
        Cart ({itemCount})
      </Link>
    </nav>
  );
}
