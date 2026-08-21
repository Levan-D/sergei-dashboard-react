import { cn } from '@/lib/cn';

type Props = { className?: string };

export default function Spinner({ className }: Props) {
  return (
    <div className={cn('flex items-center justify-center py-16', className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line-2 border-t-accent" />
    </div>
  );
}
