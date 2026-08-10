import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import LogbookCard from '@/components/landing/LogbookCard';
import Carousel from '@/components/landing/Carousel';
import { IconChevronRight } from '@/components/landing/icons';
import { ownerLogbooks } from '@/features/landing/data';

export function RealOwnersSection() {
  return (
    <section className="landing-dark">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <SectionTitle>Real owners</SectionTitle>
              <IconChevronRight size={20} className="shrink-0 cursor-pointer text-white w640:hidden" />
            </div>
            <p className="t-subhead text-white/80">BMW owners documenting their journeys on Motority</p>
          </div>
          <p className="t-button hidden cursor-pointer items-center gap-2 pt-2 tracking-[0.01em] text-white/80 uppercase transition-colors hover:text-white w640:flex">
            Browse all logbooks
            <span className="h-5 w-5 shrink-0 rounded-full border border-current" />
          </p>
        </div>
        <Carousel className="mt-6 w960:mt-10 w1280:mt-[60px]">
          {ownerLogbooks.map((l, i) => (
            <LogbookCard key={i} logbook={l} />
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
