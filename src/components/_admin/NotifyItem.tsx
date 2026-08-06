import type { ReactNode } from 'react';

export function NotifyItem({
  children,
  meta,
  read,
  onClick,
}: {
  children: ReactNode;
  meta: string;
  read?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-start gap-2 border-b border-line px-5 py-3.5 last:border-b-0 hover:bg-surface-2 @mobile:gap-3"
    >
      <div className={`mt-[5px] h-2 w-2 shrink-0 rounded-full ${read ? 'bg-surface-3' : 'bg-accent'}`} />
      <div>
        <div className={`text-[13px] leading-normal ${read ? 'text-ink-2' : 'text-ink'}`}>{children}</div>
        <div className="mt-[3px] text-[11px] text-ink-3">{meta}</div>
      </div>
    </div>
  );
}
