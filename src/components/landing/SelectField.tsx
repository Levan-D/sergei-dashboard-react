import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { IconChevronRight } from '@/components/landing/icons';

type Props = {
  label: string;
  options: string[];
  defaultValue?: string;
  className?: string;
};

export default function SelectField({ label, options, defaultValue, className }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? options[0] ?? '');
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-[54px] w-full cursor-pointer items-center rounded-xl bg-surface-2 px-3 text-left shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-surface-3"
      >
        <span className="flex min-w-0 flex-1 flex-col px-1.5 pb-0.5">
          <span className="block truncate text-xs text-ink-2">{label}</span>
          <span className="block truncate text-sm text-ink">{value}</span>
        </span>
        <IconChevronRight
          size={16}
          className={cn('shrink-0 rotate-90 text-ink transition-transform', open && '-rotate-90')}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-30 mt-1 flex max-h-64 w-full flex-col gap-0.5 overflow-y-auto rounded-[14px] bg-surface p-2 shadow-[0px_4px_16px_rgba(0,0,0,0.12)]">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setValue(opt);
                setOpen(false);
              }}
              className={cn(
                'cursor-pointer rounded-lg px-2 py-2 text-left text-sm text-ink transition-colors hover:bg-surface-2',
                opt === value && 'bg-surface-2 font-medium',
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
