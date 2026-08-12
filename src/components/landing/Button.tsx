import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-light active:bg-[#0055f7]',
  secondary: 'bg-[#d4d4d8] text-black hover:bg-[#c9c9ce] active:bg-[#bfbfc5]',
  ghost: 'bg-transparent text-white border border-white/40 hover:bg-white/10',
};

const base =
  't-button inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-6 transition-colors w1280:h-12';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; href?: undefined };
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; href: string };
type Props = ButtonProps | AnchorProps;

export default function Button({ variant = 'primary', className, children, ...rest }: Props) {
  const classes = cn(base, variants[variant], className);

  if (typeof rest.href === 'string') {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
