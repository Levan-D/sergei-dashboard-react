import { useEffect, useState } from 'react';
import {
  adminMediaFileUrl,
  adminMediaUrl,
  type AdminMediaKindType,
  type AdminMediaType,
} from '@/lib/redux/api/admin-api/admin-types';
import { IconX, IconChevronLeft, IconChevronRight } from '@/components/_admin/icons';

export const isVideoMedia = (media: AdminMediaType) =>
  media.kind === 'video' ||
  media.file?.media_type === 'video' ||
  (media.file?.filetype ?? media.filetype ?? '').startsWith('video');

const LOGO_FILETYPES = ['image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'];
const LOGO_EXTENSIONS = ['.svg', '.ico'];

/**
 * The server only maps svg to kind "logo" — ico and the rest register as
 * plain "image". For the UI buckets we classify by filetype instead, so
 * brand-asset formats (svg, ico) always land under Logos.
 */
export const mediaKindOf = (media: AdminMediaType): AdminMediaKindType => {
  const info = media.file ?? media;
  if (LOGO_FILETYPES.includes(info.filetype ?? '')) return 'logo';
  const name = (info.filename ?? media.name ?? info.url ?? '').toLowerCase();
  if (LOGO_EXTENSIONS.some((ext) => name.endsWith(ext))) return 'logo';
  return media.kind ?? (isVideoMedia(media) ? 'video' : 'image');
};

type Props = {
  items: AdminMediaType[];
  index: number;
  onNavigate: (index: number) => void;
  onClose: () => void;
};

/**
 * Fullscreen lightbox, ported from the main frontend's gallery component:
 * keyboard navigation, wrap-around slides, swipe on touch, "n of m" footer.
 */
export default function MediaGallery({ items, index, onNavigate, onClose }: Props) {
  const media = items[index];
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const next = () => onNavigate((index + 1) % items.length);
  const prev = () => onNavigate((index - 1 + items.length) % items.length);

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && items.length > 1) next();
      if (e.key === 'ArrowLeft' && items.length > 1) prev();
    };
    document.addEventListener('keyup', onKeyUp);
    return () => document.removeEventListener('keyup', onKeyUp);
  });

  useEffect(() => {
    for (let i = 1; i <= 3; i++) {
      const upcoming = items[(index + i) % items.length];
      if (!upcoming || isVideoMedia(upcoming)) continue;
      const url = adminMediaUrl(upcoming, 'big');
      if (url) new Image().src = url;
    }
  }, [index, items]);

  if (!media) return null;

  const src = isVideoMedia(media) ? adminMediaFileUrl(media) : adminMediaUrl(media, 'big');

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 50 && items.length > 1) (distance > 0 ? next : prev)();
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-black/90">
      <button
        type="button"
        aria-label="Close gallery"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <IconX size={20} />
      </button>

      {items.length > 1 && (
        <button
          type="button"
          aria-label="Previous file"
          onClick={prev}
          className="absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-white/10 text-white transition-colors hover:bg-white/20 @mobile:left-6"
        >
          <IconChevronLeft size={22} />
        </button>
      )}

      <div
        className="flex min-h-0 flex-1 items-center justify-center p-4 @mobile:p-12"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
        onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
        onTouchEnd={onTouchEnd}
      >
        {src && isVideoMedia(media) ? (
          <video
            key={String(media.id)}
            src={src}
            poster={adminMediaUrl(media, 'big') ?? undefined}
            controls
            className="max-h-full max-w-full"
          />
        ) : src ? (
          <img src={src} alt={media.name ?? 'Media file'} className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="text-5xl">🖼️</span>
        )}
      </div>

      {items.length > 1 && (
        <button
          type="button"
          aria-label="Next file"
          onClick={next}
          className="absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-white/10 text-white transition-colors hover:bg-white/20 @mobile:right-6"
        >
          <IconChevronRight size={22} />
        </button>
      )}

      <p className="pb-5 text-center text-xs text-white/70">
        {media.name ? `${media.name} · ` : ''}
        {index + 1} of {items.length}
      </p>
    </div>
  );
}
