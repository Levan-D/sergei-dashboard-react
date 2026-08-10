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
    <div
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-card border-2 border-dashed border-line-2 text-center transition-all duration-150 hover:border-accent hover:bg-accent-bg',
        compact ? 'p-3 @mobile:p-4' : 'p-8',
        className,
      )}
    >
      <div className={cn('mb-2', compact ? 'text-lg' : 'text-[28px]')}>{icon}</div>
      <div className="text-[13px] text-ink-2">{text}</div>
      {hint && <div className="mt-1 text-[11px] text-ink-3">{hint}</div>}
    </div>
  );
}
