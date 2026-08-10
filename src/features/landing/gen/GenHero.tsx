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
        <p className="t-stat-label tracking-[0.05em] text-white/70 uppercase">Home / M4</p>
      </Container>
      <Container noPadding="y" className="relative pb-14">
        <div className="flex max-w-[624px] flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="t-eyebrow tracking-[0.05em] text-accent-light uppercase">M Division / G82 (2020-2024)</p>
            <h1 className="t-h1 text-white">BMW M4 G82 Coupe</h1>
            <p className="t-lead text-white">
              The fourth-generation M4 arrives wider, faster, and more uncompromising than any before it. A handbuilt
              S58 engine, xDrive availability, and a 6-speed manual — all in one generation.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {genHeroStats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <p className="t-stat-label tracking-[0.05em] text-white/60 uppercase">{s.label}</p>
                <p className="t-card-name text-white">{s.value}</p>
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
