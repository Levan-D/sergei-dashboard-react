import { cn } from '@/lib/cn';

export default function Toggle({
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
