'use client';

import { cn } from '@/lib/utils';
import { ReactNode, useEffect } from 'react';

interface LCARSModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function LCARSModal({
  open,
  onClose,
  title,
  children,
  className,
}: LCARSModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div
        className={cn(
          'relative z-10 w-full max-w-lg mx-4 bg-lcars-bg border border-lcars-amber rounded-tl-lcars rounded-br-lcars overflow-hidden animate-slide-in-up',
          className
        )}
      >
        <div className="h-2 bg-lcars-amber" />
        {title && (
          <div className="px-6 pt-4 pb-2 border-b border-lcars-panel">
            <h2 className="font-mono text-sm uppercase tracking-widest text-lcars-amber">
              {title}
            </h2>
          </div>
        )}
        <div className="p-6">{children}</div>
        <div className="h-2 bg-lcars-orange" />
      </div>
    </div>
  );
}
