import { useState, type ReactNode } from 'react';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/cn';
import { IconImage, IconX } from '@/components/_admin/icons';
import Button from '@/components/_admin/ui/Button';
import PickMediaModal from '@/features/_admin/media/PickMediaModal';

type MediaPickRowProps = {
  icon: string;
  text: string;
  hint?: string;
  compact?: boolean;
  stack?: boolean;
};

/** "Upload zone — or — Choose from Media Library" row used across the app. `stack` lays it out vertically. */
export function MediaPickRow({ icon, text, hint, compact, stack }: MediaPickRowProps) {
  const [pickOpen, setPickOpen] = useState(false);
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 @mobile:gap-3',
        stack && '@max-mobile:flex-col @max-mobile:items-stretch',
      )}
    >
      <div
        onClick={() => showToast('📁 File picker opened')}
        className={cn(
          'min-w-[180px] flex-1 cursor-pointer rounded-card border-2 border-dashed border-line-2 text-center transition-all duration-150 hover:border-accent hover:bg-accent-bg',
          stack && '@max-mobile:min-w-0 @max-mobile:flex-none',
          compact ? 'p-3 @mobile:p-4' : 'px-5 py-3 @mobile:py-4',
        )}
      >
        <div className={cn('mb-2', compact ? 'text-lg' : 'text-[28px]')}>{icon}</div>
        <div className="text-[13px] text-ink-2">{text}</div>
        {hint && <div className="mt-1 text-[11px] text-ink-3">{hint}</div>}
      </div>
      <div
        className={cn(
          'shrink-0 rounded-[20px] border border-line bg-surface-3 px-[9px] py-[3px] text-[11px] font-semibold text-ink-3',
          stack && '@max-mobile:self-center',
        )}
      >
        or
      </div>
      <Button
        variant="ghost"
        className={cn('shrink-0 whitespace-nowrap', stack && '@max-mobile:w-full @max-mobile:justify-center')}
        onClick={() => setPickOpen(true)}
      >
        <IconImage size={14} />
        Choose from Media Library
      </Button>
      <PickMediaModal open={pickOpen} onClose={() => setPickOpen(false)} />
    </div>
  );
}

type MediaSectionLabelProps = { children: ReactNode; className?: string };

export function MediaSectionLabel({ children, className }: MediaSectionLabelProps) {
  return (
    <span className={cn('mb-2.5 block text-[11px] font-bold tracking-[.07em] text-ink-3 uppercase', className)}>
      {children}
    </span>
  );
}

type CurrentMediaProps = {
  emoji: string;
  bg: string;
  name: string;
  meta: string;
  onRemove: () => void;
};

/** Currently selected file row with a remove button. */
export function CurrentMedia({ emoji, bg, name, meta, onRemove }: CurrentMediaProps) {
  return (
    <div className="mt-2.5 flex items-center gap-2.5 rounded-el border border-line bg-surface-2 p-2.5 px-2 @mobile:px-3">
      <div
        className="flex h-[34px] w-12 shrink-0 items-center justify-center rounded-[5px] text-base"
        style={{ background: bg }}
      >
        {emoji}
      </div>
      <div>
        <div className="text-[13px] font-semibold text-ink">{name}</div>
        <div className="mt-0.5 text-[11px] text-ink-3">{meta}</div>
      </div>
      <button
        onClick={onRemove}
        title="Remove"
        className="ml-auto flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-[5px] border border-line bg-transparent text-ink-3 hover:border-red hover:bg-red-bg hover:text-red"
      >
        <IconX size={12} sw={2.5} />
      </button>
    </div>
  );
}
