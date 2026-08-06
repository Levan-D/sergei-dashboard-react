import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
  sm?: boolean;
};

const btnVariants = {
  primary: 'bg-accent text-white hover:bg-accent-light',
  ghost: 'bg-transparent text-ink-2 border border-line hover:bg-surface-2 hover:text-ink hover:border-line-2',
  danger: 'bg-red-bg text-red border border-red/20 hover:bg-red/20',
};

export default function Button({ variant = 'primary', sm, className, children, ...rest }: Props) {
  return (
    <button
      className={cn(
        'inline-flex cursor-pointer items-center gap-1.5 rounded-el border-none font-sans font-semibold transition-all duration-150',
        sm ? 'px-[11px] py-[5px] text-xs' : 'px-3.5 py-[7px] text-[13px]',
        btnVariants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
