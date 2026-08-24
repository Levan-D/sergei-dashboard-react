import { cn } from '@/lib/cn';

type Props = {
  progress: number;
  size?: number;
  className?: string;
};

/**
 * Determinate upload ring, ported from the main frontend's circular-loader:
 * a conic-gradient fill masked down to a 4px ring.
 */
export default function CircularLoader({ progress, size = 40, className }: Props) {
  const mask = 'radial-gradient(farthest-side, transparent calc(100% - 5px), black calc(100% - 4px))';
  return (
    <span
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('block rounded-full', className)}
      style={{
        width: size,
        height: size,
        background: `conic-gradient(var(--accent) ${progress * 3.6}deg, rgba(243, 243, 246, 0.55) 0deg)`,
        mask,
        WebkitMask: mask,
      }}
    />
  );
}
