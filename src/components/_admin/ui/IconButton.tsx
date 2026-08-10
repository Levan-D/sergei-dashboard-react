import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export default function IconButton({ className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'flex h-8 w-8 cursor-pointer items-center justify-center rounded-el border border-line bg-transparent text-ink-2 transition-all hover:border-line-2 hover:bg-surface-2 hover:text-ink',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
