import { cn } from '@/lib/cn';

export default function Avatar({ initials, bg, sm }: { initials: string; bg?: string; sm?: boolean }) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-bold text-white',
        sm ? 'h-[26px] w-[26px] text-[10px]' : 'h-8 w-8 text-xs',
      )}
      style={{ background: bg ?? 'var(--accent)' }}
    >
      {initials}
    </div>
  );
}
