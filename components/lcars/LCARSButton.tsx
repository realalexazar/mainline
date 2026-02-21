'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

type LCARSColor = 'amber' | 'orange' | 'peach' | 'blue' | 'lavender' | 'pink' | 'red' | 'light-blue' | 'tan';

interface LCARSButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: LCARSColor;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  href?: string;
}

const colorMap: Record<LCARSColor, string> = {
  amber: 'bg-lcars-amber text-lcars-bg',
  orange: 'bg-lcars-orange text-lcars-bg',
  peach: 'bg-lcars-peach text-lcars-bg',
  blue: 'bg-lcars-blue text-lcars-bg',
  lavender: 'bg-lcars-lavender text-lcars-bg',
  pink: 'bg-lcars-pink text-white',
  red: 'bg-lcars-red text-white',
  'light-blue': 'bg-lcars-light-blue text-lcars-bg',
  tan: 'bg-lcars-tan text-lcars-bg',
};

const sizeMap = {
  sm: 'px-4 py-1.5 text-xs',
  md: 'px-6 py-2 text-sm',
  lg: 'px-8 py-3 text-base',
};

const LCARSButton = forwardRef<HTMLButtonElement, LCARSButtonProps>(
  ({ className, color = 'amber', size = 'md', fullWidth, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'font-mono uppercase tracking-wider rounded-full transition-all duration-150',
          'hover:brightness-125 active:brightness-90',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          colorMap[color],
          sizeMap[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

LCARSButton.displayName = 'LCARSButton';
export default LCARSButton;
