import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { BadgeColor } from '@/types';

/* ── Button ── */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
  sm?: boolean;
};

const btnVariants = {
  primary: 'bg-accent text-white hover:bg-accent-light',
  ghost: 'bg-transparent text-ink-2 border border-line hover:bg-surface-2 hover:text-ink hover:border-line-2',
  danger: 'bg-red-bg text-red border border-red/20 hover:bg-red/20',
};

export function Button({ variant = 'primary', sm, className, children, ...rest }: ButtonProps) {
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

/* ── Icon button (topbar) ── */
export function IconButton({ className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'flex h-8 w-8 cursor-pointer items-center justify-center rounded-el border border-line bg-transparent text-ink-2 transition-all duration-150 hover:border-line-2 hover:bg-surface-2 hover:text-ink',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ── Badge ── */
const badgeColors: Record<BadgeColor, string> = {
  blue: 'bg-accent-bg text-accent-light',
  green: 'bg-green-bg text-green',
  yellow: 'bg-yellow-bg text-yellow',
  red: 'bg-red-bg text-red',
  gray: 'bg-surface-3 text-ink-2',
};

export function Badge({ color, className, children }: { color: BadgeColor; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[20px] px-2.5 py-[3px] text-xs font-semibold',
        badgeColors[color],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── Toggle ── */
export function Toggle({
  on,
  onClick,
  title,
  className,
}: {
  on: boolean;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
  className?: string;
}) {
  return (
    <div
      title={title}
      onClick={onClick}
      className={cn(
        'relative h-5 w-9 shrink-0 cursor-pointer rounded-[20px] border border-line-2 transition-colors duration-200',
        on ? 'bg-accent' : 'bg-surface-3',
        className,
      )}
    >
      <span
        className={cn(
          'absolute top-[2px] left-[2px] h-3.5 w-3.5 rounded-full bg-white transition-transform duration-200',
          on && 'translate-x-4',
        )}
      />
    </div>
  );
}

/* ── Chip ── */
export function Chip({
  label,
  active,
  onClick,
  withX,
  className,
}: {
  label: string;
  active: boolean;
  onClick?: () => void;
  withX?: boolean;
  className?: string;
}) {
  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex cursor-pointer items-center gap-[5px] rounded-[20px] border py-[5px] pr-3 pl-3.5 text-xs font-semibold transition-all duration-150 select-none',
        active
          ? 'border-accent bg-accent-bg text-accent-light'
          : 'border-line bg-transparent text-ink-2 hover:border-line-2 hover:text-ink',
        className,
      )}
    >
      {label}
      {withX && (
        <svg
          viewBox="0 0 10 10"
          className={cn(
            'block h-2.5 w-2.5 shrink-0 transition-opacity duration-150',
            active ? 'opacity-70' : 'pointer-events-none opacity-0',
          )}
        >
          <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

/* ── Section card ── */
export function SectionCard({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mb-4 rounded-card border border-line bg-surface shadow-card', className)}>{children}</div>;
}

export function SectionHeader({
  title,
  sub,
  right,
  compact,
  borderTop,
}: {
  title: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
  compact?: boolean;
  borderTop?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-line',
        compact ? 'px-4 py-3.5' : 'px-5 py-4',
        borderTop && 'border-t',
      )}
    >
      <div>
        <div className={cn('font-semibold text-ink', compact ? 'text-[13px]' : 'text-sm')}>{title}</div>
        {sub && <div className="mt-0.5 text-xs text-ink-3">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

/* ── Upload zone ── */
export function UploadZone({
  icon,
  text,
  hint,
  onClick,
  compact,
  className,
}: {
  icon: string;
  text: string;
  hint?: string;
  onClick?: () => void;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-card border-2 border-dashed border-line-2 text-center transition-all duration-150 hover:border-accent hover:bg-accent-bg',
        compact ? 'p-4' : 'p-8',
        className,
      )}
    >
      <div className={cn('mb-2', compact ? 'text-lg' : 'text-[28px]')}>{icon}</div>
      <div className="text-[13px] text-ink-2">{text}</div>
      {hint && <div className="mt-1 text-[11px] text-ink-3">{hint}</div>}
    </div>
  );
}

/* ── Avatar ── */
export function Avatar({ initials, bg, sm }: { initials: string; bg?: string; sm?: boolean }) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-bold text-white',
        sm ? 'h-[26px] w-[26px] text-[10px]' : 'h-8 w-8 text-xs',
      )}
      style={{ background: bg ?? 'var(--accent)' }}
    >
      {initials}
    </div>
  );
}

/* ── Form group ── */
export function FormGroup({
  label,
  full,
  hint,
  className,
  style,
  children,
}: {
  label?: ReactNode;
  full?: boolean;
  hint?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', full && 'col-span-full', className)} style={style}>
      {label && <label>{label}</label>}
      {children}
      {hint && <div className="mt-1 text-[11px] text-ink-3">{hint}</div>}
    </div>
  );
}
