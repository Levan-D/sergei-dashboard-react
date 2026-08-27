import { cn } from '@/lib/cn';

type Props = { initials: string; bg?: string; sm?: boolean; imageUrl?: string | null };

export default function Avatar({ initials, bg, sm, imageUrl }: Props) {
  const size = sm ? 'h-[26px] w-[26px] text-[10px]' : 'h-8 w-8 text-xs';
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={initials}
        className={cn('shrink-0 rounded-full object-cover', size)}
        style={{ background: bg ?? 'var(--surface3)' }}
      />
    );
  }
  return (
    <div
      className={cn('flex shrink-0 items-center justify-center rounded-full font-bold text-white', size)}
      style={{ background: bg ?? 'var(--accent)' }}
    >
      {initials}
    </div>
  );
}
