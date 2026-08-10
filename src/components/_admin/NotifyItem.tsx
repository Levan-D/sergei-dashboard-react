import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  meta: string;
  read?: boolean;
  onClick?: () => void;
};

const rowClass =
  'flex w-full cursor-pointer items-start gap-2 border-b border-line px-5 py-3.5 text-left last:border-b-0 hover:bg-surface-2 @mobile:gap-3';

export function NotifyItem({ children, meta, read, onClick }: Props) {
  const body = (
    <>
      <span className={`mt-[5px] h-2 w-2 shrink-0 rounded-full ${read ? 'bg-surface-3' : 'bg-accent'}`} />
      <span className="block">
        <span className={`block text-[13px] leading-normal ${read ? 'text-ink-2' : 'text-ink'}`}>{children}</span>
        <span className="mt-[3px] block text-[11px] text-ink-3">{meta}</span>
      </span>
    </>
  );

  if (!onClick) return <div className={rowClass}>{body}</div>;

  return (
    <button type="button" onClick={onClick} className={rowClass}>
      {body}
    </button>
  );
}
