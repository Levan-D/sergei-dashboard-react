import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export default function SectionHeader({
  title,
  sub,
  right,
  compact,
  borderTop,
}: {
  title: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
  compact?: boolean;
  borderTop?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-line',
        compact ? 'px-3 py-3.5 @mobile:px-4' : 'px-5 py-3 @mobile:py-4',
        borderTop && 'border-t',
      )}
    >
      <div>
        <div className={cn('font-semibold text-ink', compact ? 'text-[13px]' : 'text-sm')}>{title}</div>
        {sub && <div className="mt-0.5 text-xs text-ink-3">{sub}</div>}
      </div>
      {right}
    </div>
  );
}
