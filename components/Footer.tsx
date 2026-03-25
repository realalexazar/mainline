'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const shopLinks = [
  { label: 'All Products', href: '/products' },
  { label: 'New Arrivals', href: '/products?sort=newest' },
  { label: 'On Sale', href: '/products?sort=price_asc' },
];

const infoLinks = [
  { label: 'Shipping', href: '/policies/shipping' },
  { label: 'Returns', href: '/policies/returns' },
  { label: 'Privacy', href: '/policies/privacy' },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="border-t border-border max-w-content mx-auto px-6 md:px-10 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
        <div>
          <div className="font-headline font-semibold text-[1.2rem] tracking-[-0.02em] uppercase mb-3">
            MAINLINE<span className="text-accent">HUB</span>
          </div>
          <p className="text-[0.85rem] text-text-dim max-w-[280px] leading-relaxed">
            A curated general store. Good stuff from everywhere, for everyone.
          </p>
        </div>

        <div className="flex gap-8 md:gap-16">
          <FooterCol title="Shop" links={shopLinks} />
          <FooterCol title="Info" links={infoLinks} />
          <FooterCol
            title="Connect"
            links={[
              { label: 'Instagram', href: '#' },
              { label: 'Twitter', href: '#' },
              { label: 'Email', href: 'mailto:support@mainline-hub.com' },
            ]}
          />
        </div>
      </div>

      <div className="flex justify-between pt-8 border-t border-border text-[0.75rem] text-text-dim">
        <span>&copy; {new Date().getFullYear()} Mainline Hub</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-text-dim mb-4">
        {title}
      </h4>
      <ul className="list-none space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[0.85rem] text-text-mid hover:text-text transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
