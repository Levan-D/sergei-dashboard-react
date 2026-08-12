import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';

type Placement = 'top' | 'bottom';

type Position = { top: number; left: number; side: Placement; arrowX: number };

type Props = {
  content: ReactNode;
  children: ReactNode;
  placement?: Placement;
  className?: string;
};

const GAP = 10;
const EDGE = 8;

export default function Tooltip({ content, children, placement = 'top', className }: Props) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<Position | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const showTimer = useRef<number | undefined>(undefined);

  const measure = () => {
    const trigger = triggerRef.current;
    const tip = tipRef.current;
    if (!trigger || !tip) return;
    const rect = trigger.getBoundingClientRect();
    const { width, height } = tip.getBoundingClientRect();
    let side: Placement = placement;
    if (side === 'top' && rect.top - height - GAP < EDGE) side = 'bottom';
    if (side === 'bottom' && rect.bottom + height + GAP > window.innerHeight - EDGE) side = 'top';
    const top = side === 'top' ? rect.top - height - GAP : rect.bottom + GAP;
    const left = Math.min(
      Math.max(rect.left + rect.width / 2 - width / 2, EDGE),
      Math.max(window.innerWidth - width - EDGE, EDGE),
    );
    const arrowX = Math.min(Math.max(rect.left + rect.width / 2 - left, 14), width - 14);
    setPos({ top, left, side, arrowX });
  };

  useLayoutEffect(() => {
    if (!open) return;
    measure();
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const update = () => measure();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(showTimer.current), []);

  const show = () => {
    window.clearTimeout(showTimer.current);
    showTimer.current = window.setTimeout(() => setOpen(true), 120);
  };

  const hide = () => {
    window.clearTimeout(showTimer.current);
    setOpen(false);
    setVisible(false);
    setPos(null);
  };

  return (
    <span
      ref={triggerRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      className={cn('inline-flex', className)}
    >
      {children}
      {open &&
        createPortal(
          <div
            ref={tipRef}
            role="tooltip"
            style={{ top: pos?.top, left: pos?.left }}
            className={cn(
              'fixed z-[300] max-w-[280px] rounded-lg bg-[#1c1c1f] px-3 py-2 text-[13px] leading-[1.4] font-medium text-white shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-[opacity,transform] duration-150',
              !pos && 'invisible',
              visible
                ? 'translate-y-0 opacity-100'
                : cn('opacity-0', pos?.side === 'bottom' ? '-translate-y-1' : 'translate-y-1'),
            )}
          >
            {content}
            <span
              style={{ left: pos?.arrowX }}
              className={cn(
                'absolute h-2 w-2 -translate-x-1/2 rotate-45 bg-[#1c1c1f]',
                pos?.side === 'top' ? '-bottom-1' : '-top-1',
              )}
            />
          </div>,
          document.body,
        )}
    </span>
  );
}
