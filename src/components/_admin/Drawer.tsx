import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';

type Props = { open: boolean; onClose: () => void; children: ReactNode };

export default function Drawer({ open, onClose, children }: Props) {
  return createPortal(
    <div
      onClick={onClose}
      className={cn(
        'admin fixed inset-0 z-[1000] bg-black/75 backdrop-blur-[4px] transition-opacity duration-200',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn('h-full w-fit transition-transform duration-200', !open && '-translate-x-full')}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
