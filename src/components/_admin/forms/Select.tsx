import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { IconChevronDown } from '@/components/_admin/icons';

type Props = {
  options: string[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

type MenuPos = { left: number; width: number; top?: number; bottom?: number; maxHeight: number };

const MENU_MAX_H = 260;
const MENU_GAP = 4;

export default function Select({ options, value, defaultValue, onChange, placeholder, className, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [inner, setInner] = useState(defaultValue ?? (placeholder ? '' : (options[0] ?? '')));
  const [pos, setPos] = useState<MenuPos | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selected = value !== undefined ? value : inner;

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const place = () => {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const below = window.innerHeight - r.bottom - MENU_GAP;
      const above = r.top - MENU_GAP;
      const flip = below < Math.min(MENU_MAX_H, 160) && above > below;
      setPos({
        left: r.left,
        width: r.width,
        top: flip ? undefined : r.bottom + MENU_GAP,
        bottom: flip ? window.innerHeight - r.top + MENU_GAP : undefined,
        maxHeight: Math.max(80, Math.min(MENU_MAX_H, flip ? above : below)),
      });
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open]);

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
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-el border bg-surface-2 px-2 py-2 text-left font-sans text-[13.5px] text-ink transition-colors @mobile:px-3',
          disabled ? 'cursor-not-allowed text-ink-3' : 'cursor-pointer',
          open ? 'border-accent' : 'border-line',
        )}
      >
        <span className={cn('truncate', !selected && 'text-ink-3')}>{selected || placeholder}</span>
        <IconChevronDown size={14} className={cn('shrink-0 text-ink-3 transition-transform', open && 'rotate-180')} />
      </button>
      {open && pos && (
        <div
          style={{ position: 'fixed', left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom, maxHeight: pos.maxHeight }}
          className="z-[2000] overflow-y-auto overscroll-contain rounded-el border border-line bg-surface-2 py-1 shadow-card"
        >
          {placeholder && (
            <button
              type="button"
              onClick={() => pick('')}
              className="block w-full cursor-pointer px-2 py-1.5 text-left text-[13.5px] text-ink-3 transition-colors hover:bg-surface-3 @mobile:px-3"
            >
              {placeholder}
            </button>
          )}
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => pick(opt)}
              className={cn(
                'block w-full cursor-pointer px-2 py-1.5 text-left text-[13.5px] transition-colors hover:bg-surface-3 @mobile:px-3',
                opt === selected ? 'font-semibold text-accent-light' : 'text-ink',
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
