import type { ReactNode } from 'react';
import Tooltip from '@/components/landing/Tooltip';
import { cn } from '@/lib/cn';
import {
  resolveHighlight,
  useHighlightsEnabled,
  type HighlightId,
  type HighlightKind,
} from '@/components/landing/highlights';

type Props = {
  id: HighlightId;
  children: ReactNode;
  className?: string;
  size?: 'md' | 'lg';
};

const STROKE: Record<HighlightKind, string> = {
  question: '#ef4444',
  admin: '#3b82f6',
};

const BADGE_SIZE = {
  md: 'px-1 text-[10px]',
  lg: 'px-2 py-0.5 text-[15px]',
};

const LOOP = 'M92 8 C146 2 197 18 194 47 C191 79 142 96 94 93 C43 90 4 72 9 44 C14 17 63 4 111 8 C130 10 150 15 138 9';

const ANCHOR_X = 100;
const ANCHOR_Y = 6;

export default function Highlight({ id, children, className, size = 'md' }: Props) {
  const enabled = useHighlightsEnabled();
  const { kind, tag, label } = resolveHighlight(id);

  if (!enabled) return <span className={cn('inline-flex', className)}>{children}</span>;

  return (
    <Tooltip content={label} className={cn('relative isolate', className)}>
      {children}
      <span
        aria-hidden
        className="absolute top-[calc(-10px-12.5%)] right-[calc(-15px-12.5%)] bottom-[calc(-10px-12.5%)] left-[calc(-15px-12.5%)] -z-10"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-[calc(-10px-12.5%)] right-[calc(-15px-12.5%)] bottom-[calc(-10px-12.5%)] left-[calc(-15px-12.5%)] z-40 -rotate-2 overflow-visible"
      >
        <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
          <path
            d={LOOP}
            fill="none"
            stroke={STROKE[kind]}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span
          style={{ backgroundColor: STROKE[kind], left: `${ANCHOR_X / 2}%`, top: `${ANCHOR_Y}%` }}
          className={cn(
            'absolute -translate-x-1/2 -translate-y-1/2 rounded leading-[1.4] font-bold text-white',
            BADGE_SIZE[size],
          )}
        >
          {tag}
        </span>
      </span>
    </Tooltip>
  );
}
