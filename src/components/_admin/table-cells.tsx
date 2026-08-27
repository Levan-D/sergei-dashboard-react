import type { ReactNode } from 'react';
import Avatar from '@/components/_admin/ui/Avatar';

type IdentityCellProps = {
  initials: string;
  bg?: string;
  name: string;
  sub?: string;
  sm?: boolean;
  imageUrl?: string | null;
};

/** `<td>` with an avatar + name (+ optional subtitle) — the identity column shared by data tables. */
export function IdentityCell({ initials, bg, name, sub, sm = true, imageUrl }: IdentityCellProps) {
  return (
    <td>
      <div className={sm ? 'flex items-center gap-2' : 'flex items-center gap-2.5'}>
        <Avatar sm={sm} initials={initials} bg={bg} imageUrl={imageUrl} />
        <div>
          <p className="text-[13.5px] font-semibold text-ink">{name}</p>
          {sub && <p className="text-[11px] text-ink-3">{sub}</p>}
        </div>
      </div>
    </td>
  );
}

type MutedCellProps = { children: ReactNode };

/** `<td>` for secondary/muted text (time, date, counts). */
export function MutedCell({ children }: MutedCellProps) {
  return <td className="text-ink-3">{children}</td>;
}

type ActionsCellProps = { children: ReactNode; className?: string };

/**
 * `<td>` holding a group of row actions (buttons, toggles). Defaults to a
 * horizontal row; pass `className` to lay the slots out differently, e.g. a
 * fixed grid so actions line up down the column across unlike rows.
 */
export function ActionsCell({ children, className = 'flex items-center gap-1.5' }: ActionsCellProps) {
  return (
    <td>
      <div className={className}>{children}</div>
    </td>
  );
}
