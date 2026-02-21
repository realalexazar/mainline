'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface LCARSInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const LCARSInput = forwardRef<HTMLInputElement, LCARSInputProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={id}
            className="block font-mono text-xs uppercase tracking-widest text-lcars-text-light"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full bg-lcars-panel border border-lcars-amber rounded-lcars-sm px-4 py-2',
            'font-mono text-sm text-lcars-text placeholder:text-lcars-orange/40',
            'focus:outline-none focus:border-lcars-peach transition-colors',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

LCARSInput.displayName = 'LCARSInput';
export default LCARSInput;
