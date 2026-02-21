import { cn } from '@/lib/utils';

type LCARSColor = 'amber' | 'orange' | 'peach' | 'blue' | 'lavender' | 'pink' | 'red' | 'light-blue' | 'tan';

interface LCARSBarProps {
  children?: React.ReactNode;
  color?: LCARSColor;
  align?: 'left' | 'right';
  className?: string;
}

const barColorMap: Record<LCARSColor, string> = {
  amber: 'bg-lcars-amber',
  orange: 'bg-lcars-orange',
  peach: 'bg-lcars-peach',
  blue: 'bg-lcars-blue',
  lavender: 'bg-lcars-lavender',
  pink: 'bg-lcars-pink',
  red: 'bg-lcars-red',
  'light-blue': 'bg-lcars-light-blue',
  tan: 'bg-lcars-tan',
};

export default function LCARSBar({
  children,
  color = 'amber',
  align = 'left',
  className,
}: LCARSBarProps) {
  return (
    <div
      className={cn(
        'flex items-center h-8 rounded-full px-6 font-mono text-xs uppercase tracking-widest text-lcars-bg',
        barColorMap[color],
        align === 'right' && 'justify-end',
        className
      )}
    >
      {children}
    </div>
  );
}
