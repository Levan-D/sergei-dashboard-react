import Container from '@/components/landing/Container';
import Button from '@/components/landing/Button';
import { HeroSlideshow } from '@/features/landing/shared/HeroSlideshow';
import { HeroFacts } from '@/features/landing/shared/HeroFacts';
import { IconChevronRight } from '@/components/landing/icons';
import { heroImages, landingGens } from '@/features/landing/data';

const slides = [
  heroImages.model.bg,
  'linear-gradient(115deg, #2b3540 0%, #4a5a68 55%, #202830 100%)',
  'linear-gradient(115deg, #3a3230 0%, #6a5a50 55%, #2a2422 100%)',
  'linear-gradient(115deg, #22302a 0%, #486052 55%, #1a241f 100%)',
];

export function ModelHero() {
  return (
    <section className="relative flex min-h-[720px] flex-col justify-between w1440:min-h-[800px] w1600:min-h-[900px] w1920:min-h-[940px]">
      <HeroSlideshow slides={slides} />
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/50 to-transparent to-45%" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/50 to-transparent to-40%" />
      <Container noPadding="y" className="relative pt-[84px] w1280:pt-[100px]">
        <div className="t-wordmark flex items-center gap-1">
          <span className="text-white/60">Home</span>
          <IconChevronRight size={12} className="text-white" />
          <span className="text-white">M4</span>
        </div>
      </Container>
      <Container noPadding="y" className="relative pb-14 w1280:pb-20">
        <div className="flex max-w-[608px] flex-col gap-8 w1280:gap-12">
          <div className="flex flex-col gap-3 w1280:gap-6">
            <p className="t-card-years text-accent-sky uppercase">M Division / 2014 - Present</p>
            <h1 className="t-h1 text-white">BMW M4</h1>
            <p className="t-lead text-white">The art of performance</p>
          </div>
          <HeroFacts
            items={landingGens.slice(0, 3).map((g) => ({
              label: `Generation ${g.slug.toUpperCase()}`,
              value: 'BMW M4',
            }))}
          />
          <div className="flex flex-wrap gap-4 w1280:gap-6">
            <Button>Explore generations</Button>
            <Button variant="secondary">Join the community</Button>
            <Button variant="ghost">Configure yours</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
