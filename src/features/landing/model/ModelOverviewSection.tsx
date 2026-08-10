import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import { TechSpecsCard } from '@/features/landing/shared/TechSpecsCard';
import { modelOverview } from '@/features/landing/data';

export function ModelOverviewSection() {
  return (
    <section className="bg-bg">
      <Container className="flex flex-col items-start gap-10 w1440:flex-row w1440:gap-24">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <SectionTitle>Model overview</SectionTitle>
          <div className="flex flex-col gap-5">
            {modelOverview.map((p, i) => (
              <p key={i} className="text-base leading-[1.4] text-ink-2 w960:text-lg">
                {p}
              </p>
            ))}
          </div>
        </div>
        <TechSpecsCard title="Last generation" />
      </Container>
    </section>
  );
}
