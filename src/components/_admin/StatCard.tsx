import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';

export function StatCard({
  label,
  value,
  sub,
  valueStyle,
}: {
  label: string;
  value: string;
  sub?: string;
  valueStyle?: CSSProperties;
}) {
  return (
    <div
      className={cn(
        'rounded-card border border-line bg-surface p-5 shadow-card',
        // column count: 1-up under @sm, 2-up up to @mobile, equal-width row at @mobile+
        'basis-full @sm:basis-[calc(50%-4px)] @mobile:flex-1 @mobile:basis-0',
        // compact horizontal layout (text left / number right) only in the single-column @sm range
        '@max-sm:flex @max-sm:items-center @max-sm:justify-between @max-sm:gap-3',
      )}
    >
      <div className="min-w-0">
        <div className="text-xs font-medium text-ink-3 @sm:mb-2">{label}</div>
        {sub && <div className="mt-1 text-xs text-ink-3 @sm:hidden">{sub}</div>}
      </div>
      <div className="shrink-0 font-mono text-[28px] font-bold text-ink @max-sm:text-right" style={valueStyle}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-ink-3 @max-sm:hidden">{sub}</div>}
    </div>
  );
}
