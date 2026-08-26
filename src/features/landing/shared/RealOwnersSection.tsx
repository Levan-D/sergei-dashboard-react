import { useParams } from 'react-router-dom';
import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import LogbookCard from '@/components/landing/LogbookCard';
import Carousel from '@/components/landing/Carousel';
import { IconChevronRight } from '@/components/landing/icons';
import { useGetTopLogbooksQuery, type TopLogbookAuthorType } from '@/lib/redux/api/landing-api/catalog-api/catalog-api-slice';
import { useGetPublicAutobrandQuery } from '@/lib/redux/api/landing-api/autobrand-api/autobrand-api-slice';
import { brand, brandCatalogUrl } from '@/lib/brand';
import { mediaUrl } from '@/lib/media';
import type { OwnerLogbook } from '@/features/landing/data';

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
  const { data: site } = useGetPublicAutobrandQuery({ subdomain: brand.makeSlug });
  const community = site?.community;
  const { data, isFetching, isError } = useGetTopLogbooksQuery({
    type: 'car',
    make: brand.makeSlug,
    model: model ?? '',
    generation: gen ?? '',
    page: 1,
    perPage: community?.max_logbooks ?? 4,
  });
  const logbooks = (data?.items ?? []).map(toOwnerLogbook);
  const catalogUrl = brandCatalogUrl(model, gen);

  if (community?.show_on_landing === false) return <></>;
  if (isFetching || isError || data?.items?.length === 0) return <></>;

  return (
    <section className="landing-dark">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex w-full flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <SectionTitle>{community?.title ?? 'Real owners'}</SectionTitle>
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
              {community?.subtitle && <p className="t-subhead text-white/80">{community.subtitle}</p>}
            </div>
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
