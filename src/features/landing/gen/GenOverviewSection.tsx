import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import { TechSpecsCard } from '@/features/landing/shared/TechSpecsCard';
import { genOverview } from '@/features/landing/data';

export function GenOverviewSection() {
  return (
    <section className="bg-surface-2">
      <Container>
        <SectionTitle className="mb-8 w1280:mb-10">Generation overview</SectionTitle>
        <div className="flex flex-col items-start gap-10 w1440:flex-row w1440:gap-[146px]">
          <div className="flex flex-col gap-5 w1280:gap-6">
            {genOverview.map((p, i) => (
              <p key={i} className="t-body leading-[1.4]">
                {p}
              </p>
            ))}
          </div>
          <TechSpecsCard title="Technical specifications" />
        </div>
      </Container>
    </section>
  );
}
