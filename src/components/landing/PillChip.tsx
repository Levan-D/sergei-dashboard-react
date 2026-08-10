import { cn } from '@/lib/cn';

type Props = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export default function PillChip({ label, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-full border border-accent px-2.5 font-barlow text-sm leading-[1.1] font-medium tracking-[0.01em] transition-colors w640:h-[38px] w640:min-w-[38px] w640:px-3 w640:text-base',
        active ? 'bg-accent font-semibold text-white' : 'bg-transparent text-accent hover:bg-accent-bg',
      )}
    >
      {label}
    </button>
  );
}
