import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type PaddingSide = 'all' | 'x' | 'y' | 't' | 'r' | 'b' | 'l';

const PADDING = {
  t: 'pt-10 w960:pt-15 w1280:pt-20',
  r: 'pr-4 w640:pr-5 w1280:pr-10 w1440:pr-20 w1920:pr-40',
  b: 'pb-10 w960:pb-15 w1280:pb-20',
  l: 'pl-4 w640:pl-5 w1280:pl-10 w1440:pl-20 w1920:pl-40',
};

const EDGES = ['t', 'r', 'b', 'l'] as const;

const SIDE_EDGES: Record<PaddingSide, readonly (typeof EDGES)[number][]> = {
  all: EDGES,
  x: ['l', 'r'],
  y: ['t', 'b'],
  t: ['t'],
  r: ['r'],
  b: ['b'],
  l: ['l'],
};

type Props = {
  className?: string;
  noPadding?: PaddingSide | PaddingSide[];
  children: ReactNode;
};

export default function Container({ className, noPadding, children }: Props) {
  const requested = noPadding === undefined ? [] : Array.isArray(noPadding) ? noPadding : [noPadding];
  const dropped = new Set(requested.flatMap((side) => SIDE_EDGES[side]));
  const kept = EDGES.filter((edge) => !dropped.has(edge));

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1920px]',
        kept.map((edge) => PADDING[edge]),
        className,
      )}
    >
      {children}
    </div>
  );
}
