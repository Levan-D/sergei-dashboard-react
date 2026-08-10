import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type PaddingSide = 'all' | 'x' | 'y' | 't' | 'r' | 'b' | 'l';

const PADDING = {
  all: 'p-5 w960:p-10 w1440:p-20',
  t: 'pt-5 w960:pt-10 w1440:pt-20',
  r: 'pr-5 w960:pr-10 w1440:pr-20',
  b: 'pb-5 w960:pb-10 w1440:pb-20',
  l: 'pl-5 w960:pl-10 w1440:pl-20',
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
        'mx-auto w-full max-w-[1600px]',
        kept.length === EDGES.length ? PADDING.all : kept.map((edge) => PADDING[edge]),
        className,
      )}
    >
      {children}
    </div>
  );
}
