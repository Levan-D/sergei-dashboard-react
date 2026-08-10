import Container from '@/components/landing/Container';
import Button from '@/components/landing/Button';
import { heroImages, landingGens } from '@/features/landing/data';

export function ModelHero() {
  return (
    <section className="relative flex min-h-[520px] flex-col justify-end w960:min-h-[620px]">
      <div className="absolute inset-0" style={{ background: heroImages.model.bg }} />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent to-45%" />
      <Container noPadding="y" className="relative pt-24 pb-10">
        <p className="t-stat-label tracking-[0.05em] text-white/70 uppercase">Home / M4</p>
      </Container>
      <Container noPadding="y" className="relative pb-14">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="t-eyebrow tracking-[0.05em] text-accent-light uppercase">M Division</p>
            <h1 className="t-h1 text-white">BMW M4</h1>
            <p className="t-lead text-white">The art of performance</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {landingGens.slice(0, 3).map((g) => (
              <div
                key={g.slug}
                className="cursor-pointer rounded-lg border border-white/30 px-4 py-2 transition-colors hover:border-white/60"
              >
                <p className="t-stat-label text-white/60 uppercase">Generation {g.slug.toUpperCase()}</p>
                <p className="t-card-years font-semibold text-white">BMW M4</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <Button>Explore generations</Button>
            <Button variant="secondary">Join the community</Button>
            <Button variant="ghost">Configure yours</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
