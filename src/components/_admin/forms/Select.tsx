import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { IconChevronDown } from '@/components/_admin/icons';

type Props = {
  options: string[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function Select({ options, value, defaultValue, onChange, placeholder, className }: Props) {
  const [open, setOpen] = useState(false);
  const [inner, setInner] = useState(defaultValue ?? (placeholder ? '' : (options[0] ?? '')));
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = value !== undefined ? value : inner;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const pick = (opt: string) => {
    if (value === undefined) setInner(opt);
    onChange?.(opt);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn('relative w-full', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex w-full cursor-pointer items-center justify-between gap-2 rounded-el border bg-surface-2 px-2 py-2 text-left font-sans text-[13.5px] text-ink transition-colors duration-150 md:px-3',
          open ? 'border-accent' : 'border-line',
        )}
      >
        <span className={cn('truncate', !selected && 'text-ink-3')}>{selected || placeholder}</span>
        <IconChevronDown
          size={14}
          className={cn('shrink-0 text-ink-3 transition-transform duration-150', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-[260px] overflow-y-auto overscroll-contain rounded-el border border-line bg-surface-2 py-1 shadow-card">
          {placeholder && (
            <div
              onClick={() => pick('')}
              className="cursor-pointer px-2 py-1.5 text-[13.5px] text-ink-3 transition-colors duration-100 hover:bg-surface-3 md:px-3"
            >
              {placeholder}
            </div>
          )}
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => pick(opt)}
              className={cn(
                'cursor-pointer px-2 py-1.5 text-[13.5px] transition-colors duration-100 hover:bg-surface-3 md:px-3',
                opt === selected ? 'font-semibold text-accent-light' : 'text-ink',
              )}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
