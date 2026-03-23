import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  linkText?: string;
  linkHref?: string;
}

export default function SectionHeader({ title, linkText, linkHref }: SectionHeaderProps) {
  return (
    <div className="flex items-baseline justify-between px-6 md:px-10 pt-16 md:pt-20 pb-8 md:pb-10 max-w-content mx-auto">
      <span className="font-mono text-[0.8rem] tracking-[0.15em] uppercase text-text-mid">
        {title}
      </span>
      {linkText && linkHref && (
        <Link
          href={linkHref}
          className="text-[0.85rem] text-text-dim border-b border-border pb-0.5 hover:text-accent hover:border-accent transition-all duration-200"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}
