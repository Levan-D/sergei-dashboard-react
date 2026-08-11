import { useEffect, useState } from 'react';
import Container from '@/components/landing/Container';
import { IconArrowRight } from '@/components/landing/icons';
import { cn } from '@/lib/cn';

type Props = { slides: string[] };

export function HeroSlideshow({ slides }: Props) {
  const [active, setActive] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const goTo = (i: number) => {
    setActive(i);
    setResetKey((k) => k + 1);
  };
  const advance = () => goTo((active + 1) % slides.length);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length, resetKey]);

  return (
    <>
      {slides.map((bg, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[900ms]"
          style={{ background: bg, opacity: i === active ? 1 : 0 }}
        />
      ))}
      <button
        type="button"
        aria-label="Next slide"
        onClick={advance}
        className="absolute top-1/2 right-4 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl bg-accent text-white transition-transform hover:scale-105 w640:right-5 w1280:right-10 w1440:right-20 w1920:right-40"
      >
        <IconArrowRight size={20} />
      </button>
      <div className="pointer-events-auto absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 w1280:bottom-10">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={cn(
              'h-1 cursor-pointer rounded-[1px] transition-all',
              i === active ? 'w-20 bg-accent' : 'w-10 bg-white/30 hover:bg-white/60',
            )}
          />
        ))}
      </div>
      <Container
        noPadding="y"
        className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-end w1280:bottom-10"
      >
        <p className="t-stat-label text-white">
          {active + 1}/{slides.length}
        </p>
      </Container>
    </>
  );
}
