import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  title: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
  /** Shown beside the save button, where the user is looking when nothing happens. */
  error?: string | null;
  compact?: boolean;
  borderTop?: boolean;
  stack?: boolean;
};

export default function SectionHeader({ title, sub, right, error, compact, borderTop, stack }: Props) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 border-b border-line',
        compact ? 'px-3 py-3.5 @mobile:px-4' : 'px-5 py-3 @mobile:py-4',
        borderTop && 'border-t',
        stack && '@max-mobile:flex-col @max-mobile:items-start @max-mobile:gap-2',
      )}
    >
      <div className="min-w-0">
        <div className={cn('font-semibold text-ink', compact ? 'text-[13px]' : 'text-sm')}>{title}</div>
        {sub && <div className="mt-1.5 text-xs text-ink-3">{sub}</div>}
      </div>
      {(error || right) && (
        // Variable-length text sharing a row with a button. Rather than squeeze
        // the message thinner and thinner, it drops below once the row runs out
        // of space: `flex-wrap-reverse` sends the second line above, so the
        // button keeps the top and the error lands under it.
        //
        // The cap is what makes that happen early enough. Flexbox sizes this
        // block from its inline width (message + button) and only wraps it
        // afterwards, so without a ceiling it claims room it will not use and
        // the title pays for it by wrapping. Capped, the block wraps first and
        // the title keeps its line.
        <div className="flex max-w-[60%] flex-wrap-reverse items-center justify-end gap-x-2.5 gap-y-1.5">
          {error && <p className="min-w-0 text-right text-[11px] text-balance text-red">{error}</p>}
          {right && <div className="shrink-0">{right}</div>}
        </div>
      )}
    </div>
  );
}
