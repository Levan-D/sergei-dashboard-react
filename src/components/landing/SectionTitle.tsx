import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = { className?: string; children: ReactNode };

export default function SectionTitle({ className, children }: Props) {
  return (
    <h2
      className={cn(
        'font-condensed text-[28px] leading-[1.1] font-semibold tracking-[0.01em] uppercase w640:text-[32px] w960:text-[48px]',
        className,
      )}
    >
      {children}
    </h2>
  );
}
