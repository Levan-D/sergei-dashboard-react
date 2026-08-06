import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export default function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full appearance-none rounded-el border border-line bg-surface-2 px-2 py-2 font-sans text-[13.5px] text-ink transition-[border] duration-150 outline-none focus:border-accent @mobile:px-3',
        className,
      )}
      {...rest}
    />
  );
}
