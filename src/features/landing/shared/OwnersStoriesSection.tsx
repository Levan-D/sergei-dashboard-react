import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import StoryCard from '@/components/landing/StoryCard';
import { ownerStories } from '@/features/landing/data';

export function OwnersStoriesSection() {
  return (
    <section className="bg-bg">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionTitle>Owners' stories</SectionTitle>
          <span className="cursor-pointer text-base font-medium tracking-[0.01em] text-ink uppercase transition-colors duration-150 hover:text-ink-2">
            All BMW posts
          </span>
        </div>
        <div className="mt-10 columns-1 gap-6 w960:columns-2 w1440:columns-3">
          {ownerStories.map((s, i) => (
            <StoryCard key={i} story={s} />
          ))}
        </div>
      </Container>
    </section>
  );
}
