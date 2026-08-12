import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
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

type Box = { w: number; h: number };

const SAMPLES = 16;
const TAIL = 4;

const seedOf = (id: string) => {
  let s = 0;
  for (const ch of id) s = (s * 31 + ch.charCodeAt(0)) % 997;
  return s;
};

const bleedFor = ({ w, h }: Box) => ({
  x: Math.min(14 + w * 0.1, 40),
  y: Math.min(9 + h * 0.12, 34),
});

function exponentFor(a: number, b: number, halfW: number, halfH: number) {
  const u = halfW / a;
  const v = halfH / b;
  for (let n = 2.2; n <= 12; n += 0.25) {
    if (Math.pow(u, n) + Math.pow(v, n) <= 0.88) return n;
  }
  return 12;
}

function buildPath(total: Box, content: Box, seed: number) {
  const cx = total.w / 2;
  const cy = total.h / 2;
  const a = total.w / 2 - 2;
  const b = total.h / 2 - 2;
  const n = exponentFor(a, b, content.w / 2, content.h / 2);

  const pts: [number, number][] = [];
  for (let i = 0; i <= SAMPLES + TAIL; i++) {
    const theta = -Math.PI / 2 + (i / SAMPLES) * Math.PI * 2;
    const wob = 1 + 0.028 * Math.sin(seed + i * 2.1) + 0.014 * Math.sin(seed * 0.7 + i * 4.3);
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const x = cx + a * Math.sign(c) * Math.pow(Math.abs(c), 2 / n) * wob;
    const y = cy + b * Math.sign(s) * Math.pow(Math.abs(s), 2 / n) * wob;
    pts.push([x, y]);
  }

  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }

  return { d, topY: pts[0][1] };
}

export default function Highlight({ id, children, className, size = 'md' }: Props) {
  const enabled = useHighlightsEnabled();
  const { kind, tag, label } = resolveHighlight(id);
  const visualRef = useRef<HTMLSpanElement>(null);
  const [host, setHost] = useState<Box | null>(null);

  useLayoutEffect(() => {
    if (!enabled) return;
    const el = visualRef.current;
    const target = el?.offsetParent;
    if (!el || !(target instanceof HTMLElement)) return;
    const measure = () => setHost({ w: target.offsetWidth, h: target.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(target);
    return () => ro.disconnect();
  }, [enabled]);

  if (!enabled) return <span className={cn('inline-flex', className)}>{children}</span>;

  const geo = host
    ? (() => {
        const bleed = bleedFor(host);
        const total = { w: host.w + 2 * bleed.x, h: host.h + 2 * bleed.y };
        return { bleed, total, ...buildPath(total, host, seedOf(id)) };
      })()
    : null;

  const insets = geo
    ? { top: -geo.bleed.y, bottom: -geo.bleed.y, left: -geo.bleed.x, right: -geo.bleed.x }
    : { inset: 0 };

  return (
    <Tooltip content={label} className={cn('relative isolate', className)}>
      {children}
      <span aria-hidden style={insets} className="absolute -z-10" />
      <span ref={visualRef} aria-hidden style={insets} className="pointer-events-none absolute z-40 overflow-visible">
        {geo && (
          <>
            <svg
              viewBox={`0 0 ${geo.total.w} ${geo.total.h}`}
              preserveAspectRatio="none"
              className="h-full w-full overflow-visible"
            >
              <path
                d={geo.d}
                fill="none"
                stroke={STROKE[kind]}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <span
              style={{ backgroundColor: STROKE[kind], left: '50%', top: geo.topY }}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-1/2 rounded leading-[1.4] font-bold text-white',
                BADGE_SIZE[size],
              )}
            >
              {tag}
            </span>
          </>
        )}
      </span>
    </Tooltip>
  );
}
