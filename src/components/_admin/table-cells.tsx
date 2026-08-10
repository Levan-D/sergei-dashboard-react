import type { ReactNode } from 'react';
import Avatar from '@/components/_admin/ui/Avatar';

type IdentityCellProps = {
  initials: string;
  bg?: string;
  name: string;
  sub?: string;
  sm?: boolean;
};

/** `<td>` with an avatar + name (+ optional subtitle) — the identity column shared by data tables. */
export function IdentityCell({ initials, bg, name, sub, sm = true }: IdentityCellProps) {
  return (
    <td>
      <div className={sm ? 'flex items-center gap-2' : 'flex items-center gap-2.5'}>
        <Avatar sm={sm} initials={initials} bg={bg} />
        <div>
          <div className="text-[13.5px] font-semibold text-ink">{name}</div>
          {sub && <div className="text-[11px] text-ink-3">{sub}</div>}
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

type ActionsCellProps = { children: ReactNode };

/** `<td>` holding a horizontal group of row actions (buttons, toggles). */
export function ActionsCell({ children }: ActionsCellProps) {
  return (
    <td>
      <div className="flex items-center gap-1.5">{children}</div>
    </td>
  );
}
