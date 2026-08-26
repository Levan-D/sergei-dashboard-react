import { useState, type ReactNode } from 'react';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/cn';
import { IconImage, IconX } from '@/components/_admin/icons';
import Button from '@/components/_admin/ui/Button';
import DropZone, { type DropZoneKind } from '@/components/_admin/forms/DropZone';
import PickMediaModal from '@/features/_admin/media/PickMediaModal';
import type { AdminMediaType } from '@/lib/redux/api/admin-api/admin-types';

type MediaPickRowProps = {
  icon: string;
  text: string;
  hint?: string;
  compact?: boolean;
  stack?: boolean;
  kinds?: DropZoneKind[];
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
  onFiles?: (files: File[]) => void;
  onPick?: (media: AdminMediaType) => void;
};

/** "Upload zone — or — Choose from Media Library" row used across the app. `stack` lays it out vertically. */
export function MediaPickRow({
  icon,
  text,
  hint,
  compact,
  stack,
  kinds,
  maxFiles,
  maxSizeMB,
  disabled,
  onFiles,
  onPick,
}: MediaPickRowProps) {
  const [pickOpen, setPickOpen] = useState(false);
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 @mobile:gap-3',
        stack && '@max-mobile:flex-col @max-mobile:items-stretch',
      )}
    >
      <DropZone
        icon={icon}
        text={text}
        hint={hint}
        compact={compact}
        kinds={kinds}
        maxFiles={maxFiles}
        maxSizeMB={maxSizeMB}
        disabled={disabled}
        onFiles={onFiles ?? (() => showToast('📁 Upload is not wired for this section yet'))}
        className={cn(stack && '@max-mobile:min-w-0 @max-mobile:flex-none')}
      />
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
        disabled={disabled}
        className={cn('shrink-0 whitespace-nowrap', stack && '@max-mobile:w-full @max-mobile:justify-center')}
        onClick={() => setPickOpen(true)}
      >
        <IconImage size={14} />
        Choose from Media Library
      </Button>
      <PickMediaModal
        open={pickOpen}
        onClose={() => setPickOpen(false)}
        onPick={onPick ?? (() => showToast('📁 Library pick is not wired for this section yet'))}
        kinds={kinds}
      />
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
  emoji?: string;
  bg?: string;
  imageUrl?: string;
  name: string;
  meta: string;
  onRemove: () => void;
};

/** Currently selected file row with a remove button. */
export function CurrentMedia({ emoji, bg, imageUrl, name, meta, onRemove }: CurrentMediaProps) {
  return (
    <div className="mt-2.5 flex items-center gap-2.5 rounded-el border border-line bg-surface-2 p-2.5 px-2 @mobile:px-3">
      <div
        className="flex h-[34px] w-12 shrink-0 items-center justify-center rounded-[5px] bg-cover bg-center text-base"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : { background: bg }}
      >
        {!imageUrl && emoji}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold text-ink">{name}</p>
        <p className="mt-0.5 text-[11px] text-ink-3">{meta}</p>
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
