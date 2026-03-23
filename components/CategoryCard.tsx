import Link from 'next/link';

interface CategoryCardProps {
  icon: string;
  name: string;
  subtitle: string;
  href: string;
}

export default function CategoryCard({ icon, name, subtitle, href }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-bg-card hover:bg-bg-card-hover transition-all duration-300 py-14 px-8 text-center relative overflow-hidden"
    >
      <div className="text-3xl mb-4 opacity-60">{icon}</div>
      <div className="font-mono text-[0.8rem] tracking-[0.15em] uppercase group-hover:text-accent transition-colors duration-200">
        {name}
      </div>
      <div className="text-[0.8rem] text-text-dim mt-1.5">{subtitle}</div>
    </Link>
  );
}
