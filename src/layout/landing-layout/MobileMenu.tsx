import { cn } from '@/lib/cn';
import { IconClose } from '@/components/landing/icons';

type Props = {
  open: boolean;
  links: string[];
  onClose: () => void;
};

export default function MobileMenu({ open, links, onClose }: Props) {
  return (
    <div
      onClick={onClose}
      className={cn(
        'fixed inset-0 z-[100] overflow-hidden transition-opacity',
        open ? 'opacity-100' : 'pointer-events-none invisible opacity-0',
      )}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'absolute top-0 right-0 flex h-full w-[300px] max-w-[85vw] flex-col bg-surface transition-transform',
          !open && 'translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-end px-5 w640:h-20">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-ink transition-colors hover:bg-surface-2"
          >
            <IconClose size={20} />
          </button>
        </div>
        <nav className="flex flex-col">
          {links.map((l) => (
            <button
              key={l}
              type="button"
              onClick={onClose}
              className="cursor-pointer border-b border-line px-5 py-4 text-left font-barlow text-base font-medium text-ink uppercase transition-colors first:border-t hover:bg-surface-2"
            >
              {l}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
