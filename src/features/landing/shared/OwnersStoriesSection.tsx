import { useParams } from 'react-router-dom';
import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import StoryCard from '@/components/landing/StoryCard';
import { useGetCatalogLogbookPostsQuery, type CatalogPostType } from '@/lib/redux/api/catalog-api/catalog-api-slice';
import { brand, brandPostsUrl } from '@/lib/brand';
import { coverStyle, mediaUrl } from '@/lib/media';
import type { OwnerStory } from '@/features/landing/data';

function toOwnerStory(post: CatalogPostType): OwnerStory {
  const media = (post.items ?? []).flatMap((item) => [
    ...(item.media ? [item.media] : []),
    ...(item.gallery ?? []).map((g) => g.data),
  ]);
  const images = media
    .map((m) => coverStyle(m))
    .filter((bg): bg is string => !!bg)
    .slice(0, 5)
    .map((bg) => ({ bg, emoji: '' }));
  const category = post.category;
  const poster = post.sub_author ?? post.author?.owner_author;
  return {
    car: post.author?.name ?? '',
    meta: [post.author?.generation_name, post.author?.owner_author?.slug].filter(Boolean).join(' / '),
    tag: (typeof category === 'string' ? category : category?.name) ?? undefined,
    title: post.title ?? '',
    text: post.announce ?? post.announce_generated ?? '',
    author: poster?.name ?? post.author?.name ?? '',
    reposts: post.statistics?.reposts ?? 0,
    comments: post.statistics?.comments ?? 0,
    likes: post.statistics?.likes ?? 0,
    images: images.length ? images : undefined,
    url: post.url,
    avatar: mediaUrl(poster?.picture, 'small') ?? undefined,
  };
}

export function OwnersStoriesSection() {
  const { model, gen } = useParams();
  const { data, isFetching, isError } = useGetCatalogLogbookPostsQuery({
    type: 'car',
    make: brand.makeSlug,
    // model: model ?? '',  TODO: comment this out
    page: 1,
    perPage: 9,
  });
  const stories = (data?.items ?? []).map(toOwnerStory);

  if (isFetching || isError || data?.items?.length === 0) return <></>;

  return (
    <section className="bg-surface-2">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionTitle>Owners' stories</SectionTitle>
          <a
            href={brandPostsUrl(model, gen)}
            target="_blank"
            rel="noopener noreferrer"
            className="t-button flex cursor-pointer items-center gap-2 tracking-[0.01em] text-ink uppercase transition-colors hover:text-ink-2"
          >
            All {brand.name} posts
            <span className="h-5 w-5 shrink-0 rounded-full border-[1.5px] border-current" />
          </a>
        </div>
        <div className="mt-10 columns-1 gap-6 w960:columns-2 w1280:mt-[60px] w1440:columns-3">
          {stories.map((s, i) => (
            <StoryCard key={i} story={s} />
          ))}
        </div>
      </Container>
    </section>
  );
}
