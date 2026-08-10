import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import LogbookCard from '@/components/landing/LogbookCard';
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
          <p className="cursor-pointer pt-2 text-base font-medium tracking-[0.01em] text-white uppercase transition-colors hover:text-white/70">
            Browse all logbooks ◉
          </p>
        </div>
        <div className="mt-6 flex gap-4 overflow-x-auto overscroll-x-contain pb-2 w640:mt-10 w640:gap-6">
          {ownerLogbooks.map((l, i) => (
            <LogbookCard key={i} logbook={l} />
          ))}
        </div>
      </Container>
    </section>
  );
}
