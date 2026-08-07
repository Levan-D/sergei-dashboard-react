import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export default function FormGroup({
  label,
  full,
  half,
  hint,
  className,
  style,
  children,
}: {
  label?: ReactNode;
  full?: boolean;
  half?: boolean;
  hint?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5',
        full && 'w-full',
        half && 'w-full @mobile:w-[calc(50%-8px)]',
        className,
      )}
      style={style}
    >
      {label && <label>{label}</label>}
      {children}
      {hint && <div className="mt-1 text-[11px] text-ink-3">{hint}</div>}
    </div>
  );
}
