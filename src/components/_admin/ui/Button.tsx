import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  sm?: boolean;
  loading?: boolean;
};

const btnVariants = {
  primary: 'bg-accent text-white hover:bg-accent-light',
  /** Filled neutral, same box as `danger` — for the positive counterpart to a destructive action. */
  secondary: 'bg-surface-3 text-ink border border-line-2 hover:bg-line-2',
  ghost: 'bg-transparent text-ink-2 border border-line hover:bg-surface-2 hover:text-ink hover:border-line-2',
  danger: 'bg-red-bg text-red border border-red/20 hover:bg-red/20',
};

/**
 * `loading` keeps the button at its natural width: the label goes transparent and a
 * spinner is overlaid on top, so nothing reflows while a mutation is in flight.
 */
export default function Button({ variant = 'primary', sm, loading, disabled, className, children, ...rest }: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex cursor-pointer items-center gap-1.5 rounded-el border-none font-sans font-semibold transition-all',
        sm ? 'px-[11px] py-[5px] text-xs' : 'px-3.5 py-[7px] text-[13px]',
        btnVariants[variant],
        (disabled || loading) && 'cursor-not-allowed opacity-50',
        className,
      )}
      {...rest}
    >
      <span className={cn('contents', loading && 'invisible')}>{children}</span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              'animate-spin rounded-full border-2 border-current border-t-transparent opacity-70',
              sm ? 'h-3 w-3' : 'h-3.5 w-3.5',
            )}
          />
        </span>
      )}
    </button>
  );
}
