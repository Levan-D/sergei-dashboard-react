import Container from '@/components/landing/Container';
import Button from '@/components/landing/Button';
import { heroImages, genHeroStats } from '@/features/landing/data';

export function GenHero() {
  return (
    <section className="relative flex min-h-[560px] flex-col justify-end w960:min-h-[680px]">
      <div className="absolute inset-0" style={{ background: heroImages.gen.bg }} />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent to-45%" />
      <Container noPadding="y" className="relative pt-24 pb-10">
        <div className="text-xs tracking-[0.05em] text-white/70 uppercase">Home / M4</div>
      </Container>
      <Container noPadding="y" className="relative pb-14">
        <div className="flex max-w-[624px] flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="text-sm tracking-[0.05em] text-accent-light uppercase">M Division / G82 (2020-2024)</div>
            <h1 className="font-condensed text-[40px] leading-[1.1] font-semibold tracking-[0.01em] text-white uppercase w960:text-[56px] w1440:text-[64px]">
              BMW M4 G82 Coupe
            </h1>
            <p className="text-base leading-[1.3] tracking-[0.01em] text-white w960:text-lg">
              The fourth-generation M4 arrives wider, faster, and more uncompromising than any before it. A handbuilt
              S58 engine, xDrive availability, and a 6-speed manual — all in one generation.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {genHeroStats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <div className="text-xs tracking-[0.05em] text-white/60 uppercase">{s.label}</div>
                <div className="text-xl font-semibold text-white">{s.value}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <Button>Join the community</Button>
            <Button variant="ghost">Configure yours</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
