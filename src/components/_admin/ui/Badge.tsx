import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Shared badge/status color used across catalog, landing and history. */
export type BadgeColor = 'blue' | 'green' | 'yellow' | 'red' | 'gray';

const badgeColors: Record<BadgeColor, string> = {
  blue: 'bg-accent-bg text-accent-light',
  green: 'bg-green-bg text-green',
  yellow: 'bg-yellow-bg text-yellow',
  red: 'bg-red-bg text-red',
  gray: 'bg-surface-3 text-ink-2',
};

export default function Badge({
  color,
  className,
  children,
}: {
  color: BadgeColor;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[20px] px-2.5 py-[3px] text-xs font-semibold',
        badgeColors[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
