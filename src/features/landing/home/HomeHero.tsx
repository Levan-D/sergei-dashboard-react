import Container from '@/components/landing/Container';
import Button from '@/components/landing/Button';
import { heroImages } from '@/features/landing/data';

export function HomeHero() {
  return (
    <section className="relative flex min-h-[480px] items-end w640:min-h-[560px] w960:min-h-[720px] w1440:min-h-[860px]">
      <div className="absolute inset-0" style={{ background: heroImages.home.bg }} />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent to-45%" />
      <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent to-40%" />
      <Container noPadding="y" className="relative pb-14 w1440:pb-20">
        <div className="flex max-w-[624px] flex-col gap-8 w1440:gap-12">
          <div className="flex flex-col gap-6">
            <h1 className="font-condensed text-[36px] leading-[1.1] font-semibold tracking-[0.01em] text-white uppercase w640:text-[44px] w960:text-[64px] w1440:text-[78px]">
              The ultimate driving machine
            </h1>
            <p className="max-w-[585px] text-base leading-[1.1] tracking-[0.01em] text-white w640:text-lg w960:text-2xl">
              Over a century of precision engineering. From the mountains of Bavaria to every road on earth –
              performance is not a feature, it's a philosophy.
            </p>
          </div>
          <div className="flex flex-col gap-4 w640:flex-row w640:flex-wrap w960:gap-6">
            <Button className="w-full w640:w-auto">Explore models</Button>
            <Button variant="secondary" className="w-full w640:w-auto">
              Join the community
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
