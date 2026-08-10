import { galleryImages } from '@/features/landing/data';

export function GalleryStrip() {
  return (
    <section className="flex gap-1 overflow-x-auto overscroll-x-contain bg-bg py-1">
      {galleryImages.map((g, i) => (
        <div
          key={i}
          className="flex h-[240px] w-[75vw] shrink-0 items-center justify-center text-7xl w960:h-[340px] w960:w-[480px]"
          style={{ background: g.bg }}
        >
          {g.emoji}
        </div>
      ))}
    </section>
  );
}
