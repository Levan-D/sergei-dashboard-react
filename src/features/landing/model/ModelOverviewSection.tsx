import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import { TechSpecsCard } from '@/features/landing/shared/TechSpecsCard';
import { modelOverview } from '@/features/landing/data';

export function ModelOverviewSection() {
  return (
    <section className="bg-surface-2">
      <Container>
        <SectionTitle className="mb-8 w1280:mb-10">Model overview</SectionTitle>
        <div className="flex flex-col items-start gap-10 w1440:flex-row w1440:gap-[146px]">
          <div className="flex flex-col gap-5 w1280:gap-6">
            {modelOverview.map((p, i) => (
              <p key={i} className="t-body leading-[1.4]">
                {p}
              </p>
            ))}
          </div>
          <TechSpecsCard title="Last generation" />
        </div>
      </Container>
    </section>
  );
}
