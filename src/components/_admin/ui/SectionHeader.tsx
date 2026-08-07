import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export default function SectionHeader({
  title,
  sub,
  right,
  compact,
  borderTop,
  stack,
}: {
  title: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
  compact?: boolean;
  borderTop?: boolean;
  stack?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-line',
        compact ? 'px-3 py-3.5 @mobile:px-4' : 'px-5 py-3 @mobile:py-4',
        borderTop && 'border-t',
        stack && '@max-mobile:flex-col @max-mobile:items-start @max-mobile:gap-2',
      )}
    >
      <div>
        <div className={cn('font-semibold text-ink', compact ? 'text-[13px]' : 'text-sm')}>{title}</div>
        {sub && <div className="mt-1.5 text-xs text-ink-3">{sub}</div>}
      </div>
      {right}
    </div>
  );
}
