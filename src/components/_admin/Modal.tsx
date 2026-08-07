import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  sub?: string;
  footer: ReactNode;
  width?: number;
  children: ReactNode;
};

export default function Modal({ open, onClose, title, sub, footer, width, children }: Props) {
  return createPortal(
    <div
      onClick={onClose}
      className={cn(
        'admin fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 backdrop-blur-[4px] transition-opacity duration-200',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      {open && (
        <div
          className="@container flex max-h-[82dvh] flex-col overflow-hidden rounded-[14px] border border-line bg-surface"
          style={{ width: width ?? 540, maxWidth: '90vw' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-5 md:px-6">
            <div>
              <div className="text-base font-bold text-ink">{title}</div>
              {sub && <div className="mt-1.5 text-xs text-ink-3">{sub}</div>}
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] border-none bg-transparent p-1 text-xl text-ink-3 hover:bg-surface-2 hover:text-ink"
            >
              ✕
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
          <div className="flex shrink-0 justify-end gap-2 border-t border-line px-4 py-3 md:px-6 md:py-4">{footer}</div>
        </div>
      )}
    </div>,
    document.body,
  );
}
