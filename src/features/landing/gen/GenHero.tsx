import { Link, useParams } from 'react-router-dom';
import { ROUTING, landingModelPath } from '@/lib/routing';
import Container from '@/components/landing/Container';
import Button from '@/components/landing/Button';
import { HeroSlideshow } from '@/features/landing/shared/HeroSlideshow';
import { HeroFacts } from '@/features/landing/shared/HeroFacts';
import { IconChevronRight } from '@/components/landing/icons';
import { heroImages, genHeroStats } from '@/features/landing/data';

const slides = [
  heroImages.gen.bg,
  'linear-gradient(115deg, #303845 0%, #506070 55%, #232a33 100%)',
  'linear-gradient(115deg, #40342c 0%, #70604e 55%, #2c241e 100%)',
  'linear-gradient(115deg, #2a3230 0%, #506a60 55%, #1e2624 100%)',
];

export function GenHero() {
  const { model = 'm4', gen = 'g82' } = useParams();
  return (
    <section className="relative flex min-h-[720px] flex-col justify-between w1440:min-h-[800px] w1600:min-h-[900px] w1920:min-h-[940px]">
      <HeroSlideshow slides={slides} />
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/50 to-transparent to-45%" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/50 to-transparent to-40%" />
      <Container noPadding="y" className="relative pt-[84px] w1280:pt-[100px]">
        <div className="t-wordmark flex items-center gap-1">
          <Link to={ROUTING.home} className="cursor-pointer text-white/60 transition-colors hover:text-white">
            Home
          </Link>
          <IconChevronRight size={12} className="text-white" />
          <Link
            to={landingModelPath(model)}
            className="cursor-pointer text-white/60 transition-colors hover:text-white"
          >
            {model.toUpperCase()}
          </Link>
          <IconChevronRight size={12} className="text-white" />
          <span className="text-white">{gen.toUpperCase()} Coupe</span>
        </div>
      </Container>
      <Container noPadding="y" className="relative pb-14 w1280:pb-20">
        <div className="flex flex-col gap-8 w1280:max-w-[585px] w1280:gap-12">
          <div className="flex flex-col gap-3 w1280:gap-6">
            <p className="t-card-years text-accent-sky uppercase">M Division / Competition / 2021 - Present</p>
            <h1 className="t-h1 text-white">BMW M4 G82 Coupe</h1>
            <p className="t-lead text-white">
              The fourth-generation M4 arrives wider, faster, and more uncompromising than any before it. A handbuilt
              S58 engine, xDrive availability, and a 6-speed manual — all in one generation.
            </p>
          </div>
          <HeroFacts items={genHeroStats.map((s) => ({ label: s.label, value: s.value }))} />
          <div className="flex flex-col gap-4 w1280:flex-row w1280:flex-wrap w1280:gap-6">
            <Button variant="secondary" className="w-full w1280:w-auto">
              Join the community
            </Button>
            <Button variant="ghost" className="w-full border-transparent w1280:w-auto">
              Configure yours
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
