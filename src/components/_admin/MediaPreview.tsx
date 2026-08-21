import { cn } from '@/lib/cn';
import { IconX } from '@/components/_admin/icons';
import Button from '@/components/_admin/ui/Button';

type Props = {
  url: string;
  kind: 'image' | 'video';
  name: string;
  meta: string;
  onRemove: () => void;
  className?: string;
};

/** Full-size preview that replaces the drop zone once a file is chosen. */
export default function MediaPreview({ url, kind, name, meta, onRemove, className }: Props) {
  return (
    <div className={cn('overflow-hidden rounded-card border border-line bg-surface-2', className)}>
      {kind === 'video' ? (
        <video src={url} controls className="block max-h-[320px] w-full bg-black object-contain" />
      ) : (
        <img src={url} alt={name} className="block max-h-[320px] w-full bg-black object-contain" />
      )}
      <div className="flex items-center gap-2.5 border-t border-line px-3 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-ink">{name}</p>
          <p className="mt-0.5 text-[11px] text-ink-3">{meta}</p>
        </div>
        <Button variant="danger" sm onClick={onRemove}>
          <IconX size={11} sw={2.5} />
          Remove
        </Button>
      </div>
    </div>
  );
}
