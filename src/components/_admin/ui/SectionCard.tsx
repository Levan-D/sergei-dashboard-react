import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = { className?: string; children: ReactNode };

export default function SectionCard({ className, children }: Props) {
  return (
    <div className={cn('mb-3 rounded-card border border-line bg-surface shadow-card @mobile:mb-4', className)}>
      {children}
    </div>
  );
}
