import type { OwnerStory } from '@/features/landing/data';
import { IconRepost, IconComment, IconHeart } from '@/components/landing/icons';

type StoryImageProps = { story: OwnerStory };

function StoryImage({ story }: StoryImageProps) {
  if (!story.image) return null;
  return (
    <div className="flex h-[220px] items-center justify-center text-5xl" style={{ background: story.image.bg }}>
      {story.image.emoji}
    </div>
  );
}

type StoryCardProps = { story: OwnerStory };

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <div className="mb-6 cursor-pointer break-inside-avoid overflow-hidden rounded-lg border border-line bg-surface transition-colors hover:border-line-2">
      {!story.imageLast && <StoryImage story={story} />}
      <div className="flex flex-col gap-3 p-6">
        <div className="flex flex-col gap-1 border-b border-line pb-3">
          <p className="text-xl font-semibold">{story.car}</p>
          <p className="text-sm text-ink-2">{story.meta}</p>
        </div>
        {story.tag && <p className="text-xs tracking-[0.05em] text-ink-3 uppercase">{story.tag}</p>}
        <p className="text-base font-bold tracking-[0.01em] uppercase">{story.title}</p>
        <p className="line-clamp-3 text-sm leading-[1.4] text-ink-2">{story.text}</p>
        <div className="mt-1 flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[10px] font-bold">
            {story.author
              .split(' ')
              .map((w) => w[0])
              .join('')}
          </div>
          <p className="text-sm font-medium">{story.author}</p>
          <div className="ml-auto flex items-center gap-3 text-sm text-ink-2">
            <span className="flex items-center gap-1">
              <IconRepost size={16} /> {story.reposts}
            </span>
            <span className="flex items-center gap-1">
              <IconComment size={16} /> {story.comments}
            </span>
            <span className="flex items-center gap-1">
              <IconHeart size={16} /> {story.likes}
            </span>
          </div>
        </div>
      </div>
      {story.imageLast && <StoryImage story={story} />}
    </div>
  );
}
