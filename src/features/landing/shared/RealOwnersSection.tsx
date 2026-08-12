import { useParams } from 'react-router-dom';
import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import LogbookCard from '@/components/landing/LogbookCard';
import Carousel from '@/components/landing/Carousel';
import { IconChevronRight } from '@/components/landing/icons';
import Highlight from '@/components/landing/Highlight';
import { useGetTopLogbooksQuery, type TopLogbookAuthorType } from '@/lib/redux/api/catalog-api/catalog-api-slice';
import { brand, brandCatalogUrl } from '@/lib/brand';
import { mediaUrl } from '@/lib/media';
import { ownerLogbooks, type OwnerLogbook } from '@/features/landing/data';

const fmtCount = (n?: number) => (typeof n === 'number' ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '—');

function toOwnerLogbook(author: TopLogbookAuthorType): OwnerLogbook {
  const imageUrl = mediaUrl(author.picture);
  return {
    name: author.owner_author?.name ?? author.name,
    car: author.name,
    url: author.url,
    avatar: mediaUrl(author.owner_author?.picture, 'small') ?? undefined,
    meta: [author.generation_name, author.owner_author?.slug].filter(Boolean).join(' / '),
    stats: [
      { label: 'Posts', value: fmtCount(author.counters?.posts) },
      { label: 'Followers', value: fmtCount(author.counters?.followers) },
    ],
    image: imageUrl
      ? { bg: `url("${imageUrl}") center / cover no-repeat`, emoji: '' }
      : { bg: 'linear-gradient(135deg,#4b5563,#1f2937)', emoji: '🚗' },
  };
}

export function RealOwnersSection() {
  const { model, gen } = useParams();
  const { data } = useGetTopLogbooksQuery({
    type: 'car',
    make: brand.makeSlug,
    model: model ?? '',
    generation: gen ?? '',
    page: 1,
    perPage: 10,
  });
  const logbooks = data?.items?.length ? data.items.map(toOwnerLogbook) : ownerLogbooks;
  const catalogUrl = brandCatalogUrl(model, gen);

  return (
    <section className="landing-dark">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col">
            <Highlight id="5b" className="w-full">
              <div className="flex w-full flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <SectionTitle>Real owners</SectionTitle>
                  <a
                    href={catalogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Browse all logbooks"
                    className="shrink-0 cursor-pointer text-white w640:hidden"
                  >
                    <IconChevronRight size={20} />
                  </a>
                </div>
                <p className="t-subhead text-white/80">BMW owners documenting their journeys on Motority</p>
              </div>
            </Highlight>
          </div>
          <a
            href={catalogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="t-button hidden cursor-pointer items-center gap-2 pt-2 tracking-[0.01em] text-white/80 uppercase transition-colors hover:text-white w640:flex"
          >
            Browse all logbooks
            <span className="h-5 w-5 shrink-0 rounded-full border border-current" />
          </a>
        </div>
        <Carousel className="mt-6 w960:mt-10 w1280:mt-[60px]">
          {logbooks.map((l, i) => (
            <LogbookCard key={i} logbook={l} />
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
