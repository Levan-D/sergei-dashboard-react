import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export default function SectionCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('mb-3 rounded-card border border-line bg-surface shadow-card md:mb-4', className)}>
      {children}
    </div>
  );
}
