import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-light active:bg-[#0055f7]',
  secondary: 'bg-[#d4d4d8] text-black hover:bg-[#c9c9ce] active:bg-[#bfbfc5]',
  ghost: 'bg-transparent text-white border border-white/40 hover:bg-white/10',
};

export default function Button({ variant = 'primary', className, children, ...rest }: Props) {
  return (
    <button
      className={cn(
        't-button inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-6 transition-colors w1280:h-12',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
