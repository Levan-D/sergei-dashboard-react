import type { TableHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export default function Table({ className, children, ...rest }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn(
        'w-full border-collapse',
        '[&_th]:border-b [&_th]:border-line [&_th]:px-5 [&_th]:py-2.5 [&_th]:text-left [&_th]:text-[11px] [&_th]:font-semibold [&_th]:tracking-[.06em] [&_th]:text-ink-3 [&_th]:uppercase',
        '[&_td]:border-b [&_td]:border-line [&_td]:px-5 [&_td]:py-3 [&_td]:align-middle [&_td]:text-[13.5px]',
        '[&_tr:last-child_td]:border-b-0',
        '[&_tr:hover_td]:bg-surface-2',
        className,
      )}
      {...rest}
    >
      {children}
    </table>
  );
}
