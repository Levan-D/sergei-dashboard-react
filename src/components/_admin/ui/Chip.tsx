import { cn } from '@/lib/cn';

type Props = {
  label: string;
  active: boolean;
  onClick?: () => void;
  withX?: boolean;
  className?: string;
};

export default function Chip({ label, active, onClick, withX, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex cursor-pointer items-center gap-[5px] rounded-[20px] border py-[5px] pr-2 pl-3.5 text-xs font-semibold transition-all select-none @mobile:pr-3',
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
            'block h-2.5 w-2.5 shrink-0 transition-opacity',
            active ? 'opacity-70' : 'pointer-events-none opacity-0',
          )}
        >
          <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
