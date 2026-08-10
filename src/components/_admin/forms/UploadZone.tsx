import { cn } from '@/lib/cn';

type Props = {
  icon: string;
  text: string;
  hint?: string;
  onClick?: () => void;
  compact?: boolean;
  className?: string;
};

export default function UploadZone({ icon, text, hint, onClick, compact, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-card border-2 border-dashed border-line-2 text-center transition-all hover:border-accent hover:bg-accent-bg',
        compact ? 'p-3 @mobile:p-4' : 'p-8',
        className,
      )}
    >
      <span className={cn('mb-2 block', compact ? 'text-lg' : 'text-[28px]')}>{icon}</span>
      <span className="block text-[13px] text-ink-2">{text}</span>
      {hint && <span className="mt-1 block text-[11px] text-ink-3">{hint}</span>}
    </button>
  );
}
