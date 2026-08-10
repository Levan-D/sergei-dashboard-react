import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { IconArrowRight } from '@/components/landing/icons';

type ArrowProps = {
  direction: 'left' | 'right';
  show: boolean;
  onClick: () => void;
};

function Arrow({ direction, show, onClick }: ArrowProps) {
  return (
    <button
      type="button"
      aria-label={direction === 'left' ? 'Scroll left' : 'Scroll right'}
      onClick={onClick}
      className={cn(
        'absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm transition-opacity hover:bg-black/70',
        direction === 'left' ? 'left-2 w1440:left-6' : 'right-2 w1440:right-6',
        !show && 'invisible opacity-0',
      )}
    >
      <IconArrowRight size={20} className={direction === 'left' ? 'rotate-180' : undefined} />
    </button>
  );
}

type Props = {
  children: ReactNode;
  scrollAmount?: number;
  className?: string;
};

export default function Carousel({ children, scrollAmount = 448, className }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    const content = contentRef.current;
    if (!el || !content) return;

    const updateArrows = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 20);
    };

    el.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    const ro = new ResizeObserver(() => requestAnimationFrame(updateArrows));
    ro.observe(el);
    ro.observe(content);
    const settle = setTimeout(updateArrows, 0);
    updateArrows();

    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
      ro.disconnect();
      clearTimeout(settle);
    };
  }, []);

  const scrollByAmount = (direction: 1 | -1) =>
    scrollRef.current?.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });

  return (
    <div className={cn('relative -mx-5 w960:-mx-10 w1440:-mx-20', className)}>
      <div
        ref={scrollRef}
        className="[scrollbar-width:none] overflow-x-auto overscroll-x-contain pl-5 [-ms-overflow-style:none] w960:pl-10 w1440:pl-20 [&::-webkit-scrollbar]:hidden"
      >
        <div ref={contentRef} className="flex w-max gap-4 w640:gap-6">
          {children}
          <div className="w-5 shrink-0 w960:w-10 w1440:w-20" />
        </div>
      </div>
      <Arrow direction="left" show={showLeft} onClick={() => scrollByAmount(-1)} />
      <Arrow direction="right" show={showRight} onClick={() => scrollByAmount(1)} />
    </div>
  );
}
