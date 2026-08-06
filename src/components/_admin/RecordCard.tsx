import type { ReactNode } from 'react';
import Avatar from '@/components/_admin/ui/Avatar';
import Badge from '@/components/_admin/ui/Badge';
import type { BadgeColor } from '@/components/_admin/ui/Badge';

/** Card rendering of a table row — used where a data table collapses on narrow containers. */
export function RecordCard({
  initials,
  bg,
  title,
  meta,
  description,
  badge,
  action,
  onClick,
}: {
  initials: string;
  bg?: string;
  title: string;
  meta?: string;
  description?: ReactNode;
  badge?: { label: ReactNode; color: BadgeColor };
  action?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-el border border-line bg-surface-2 p-3${onClick ? ' cursor-pointer hover:border-line-2' : ''}`}
    >
      <div className="flex items-center gap-2">
        <Avatar sm initials={initials} bg={bg} />
        <span className="text-[13.5px] font-semibold text-ink">{title}</span>
        {meta && <span className="ml-auto text-[11px] text-ink-3">{meta}</span>}
      </div>
      {(description || badge || action) && (
        <div className="mt-2 flex items-center gap-2">
          {description && <span className="text-[13px] text-ink-2">{description}</span>}
          {badge && <Badge color={badge.color}>{badge.label}</Badge>}
          {action && <span className="ml-auto">{action}</span>}
        </div>
      )}
    </div>
  );
}
