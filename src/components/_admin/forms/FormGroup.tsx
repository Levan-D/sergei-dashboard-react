import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  label?: ReactNode;
  full?: boolean;
  half?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export default function FormGroup({ label, full, half, hint, error, className, style, children }: Props) {
  return (
    <div
      className={cn('flex flex-col gap-1.5', full && 'w-full', half && 'w-full @mobile:w-[calc(50%-8px)]', className)}
      style={style}
    >
      {label && <label>{label}</label>}
      {children}
      {error ? (
        <p className="mt-1 text-[11px] text-red">{error}</p>
      ) : (
        hint && <p className="mt-1 text-[11px] text-ink-3">{hint}</p>
      )}
    </div>
  );
}
