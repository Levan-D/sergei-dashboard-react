import Container from '@/components/landing/Container';
import Carousel from '@/components/landing/Carousel';
import { galleryImages } from '@/features/landing/data';
import { twMerge } from 'tailwind-merge';

export function GalleryStrip() {
  return (
    <section className="bg-bg">
      <Container noPadding="t">
        <Carousel scrollAmount={700} trackClassName="gap-0 w1280:gap-0  ">
          {galleryImages.map((g, i) => (
            <div
              key={i}
              className={twMerge(
                'flex h-[460px] w-[700px] shrink-0 items-center justify-center overflow-hidden text-7xl',
                i === 0 && 'rounded-l-lg',
                i + 1 === galleryImages.length && 'rounded-r-lg',
              )}
              style={{ background: g.bg }}
            >
              {g.emoji}
            </div>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
