import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import LogbookCard from '@/components/landing/LogbookCard';
import Carousel from '@/components/landing/Carousel';
import { ownerLogbooks } from '@/features/landing/data';

export function RealOwnersSection() {
  return (
    <section className="landing-dark">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-4">
            <SectionTitle>Real owners</SectionTitle>
            <p className="text-base tracking-[0.01em] text-white/80 w640:text-lg w960:text-2xl w960:leading-[1.1]">
              BMW owners documenting their journeys on Motority
            </p>
          </div>
          <p className="flex cursor-pointer items-center gap-2 pt-2 text-base font-medium tracking-[0.01em] text-white/80 uppercase transition-colors hover:text-white">
            Browse all logbooks
            <span className="h-5 w-5 shrink-0 rounded-full border border-current" />
          </p>
        </div>
        <Carousel className="mt-6 w640:mt-[60px]">
          {ownerLogbooks.map((l, i) => (
            <LogbookCard key={i} logbook={l} />
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
