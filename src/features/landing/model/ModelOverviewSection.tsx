import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import Highlight from '@/components/landing/Highlight';
import { TechSpecsCard } from '@/features/landing/shared/TechSpecsCard';
import { modelOverview } from '@/features/landing/data';

export function ModelOverviewSection() {
  return (
    <section className="bg-surface-2">
      <Container>
        <SectionTitle className="mb-8 w1280:mb-10">Model overview</SectionTitle>
        <div className="flex flex-col items-start gap-10 w1280:flex-row w1280:gap-[64px] w1440:gap-[146px]">
          <div className="flex flex-col gap-5 w1280:gap-6">
            {modelOverview.map((p, i) => (
              <p key={i} className="t-body leading-[1.4]">
                {p}
              </p>
            ))}
          </div>
          <Highlight id="8r" size="lg" className="block w-full shrink-0 w1280:w-[335px] w1440:w-[464px]">
            <TechSpecsCard title="Last generation" />
          </Highlight>
        </div>
      </Container>
    </section>
  );
}
