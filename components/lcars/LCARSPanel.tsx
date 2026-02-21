import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type LCARSColor = 'amber' | 'orange' | 'peach' | 'blue' | 'lavender' | 'pink' | 'red' | 'light-blue' | 'tan';

interface LCARSPanelProps {
  children: ReactNode;
  color?: LCARSColor;
  title?: string;
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

export default function LCARSPanel({
  children,
  color = 'amber',
  title,
  className,
}: LCARSPanelProps) {
  return (
    <div
      className={cn(
        'bg-lcars-bg rounded-tl-lcars rounded-br-lcars overflow-hidden border border-lcars-panel',
        className
      )}
    >
      <div className={cn('h-2', barColorMap[color])} />
      {title && (
        <div className="px-4 pt-3 pb-1">
          <span className="font-mono text-xs uppercase tracking-widest text-lcars-text-light">
            {title}
          </span>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
