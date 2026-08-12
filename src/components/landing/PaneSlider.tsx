import { useRef, useState, type ReactNode, type TouchEvent } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  slides: ReactNode[];
  active: number;
  onStep: (direction: 1 | -1) => void;
  loop?: boolean;
  className?: string;
};

export default function PaneSlider({ slides, active, onStep, loop = false, className }: Props) {
  const [drag, setDrag] = useState(0);
  const startX = useRef<number | null>(null);

  const offsetOf = (i: number) => {
    let offset = i - active;
    if (loop) {
      const n = slides.length;
      offset = ((offset % n) + n) % n;
      if (offset > n / 2) offset -= n;
    }
    return offset;
  };

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    setDrag(e.touches[0].clientX - startX.current);
  };

  const onTouchEnd = () => {
    const delta = drag;
    startX.current = null;
    setDrag(0);
    if (Math.abs(delta) >= 60) onStep(delta < 0 ? 1 : -1);
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={cn('relative touch-pan-y overflow-hidden', className)}
    >
      {slides.map((slide, i) => {
        const offset = offsetOf(i);
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              transform: `translateX(calc(${offset * 100}% + ${drag}px))`,
              transition: drag !== 0 || Math.abs(offset) > 1 ? 'none' : 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {slide}
          </div>
        );
      })}
    </div>
  );
}
