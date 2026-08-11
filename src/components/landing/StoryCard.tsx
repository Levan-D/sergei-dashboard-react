import { useState, type MouseEvent } from 'react';
import type { OwnerStory } from '@/features/landing/data';
import { IconRepost, IconComment, IconHeart, IconChevronRight } from '@/components/landing/icons';
import { cn } from '@/lib/cn';

type MediaArrowProps = {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
};

function MediaArrow({ direction, disabled, onClick }: MediaArrowProps) {
  return (
    <button
      type="button"
      aria-label={direction === 'prev' ? 'Previous image' : 'Next image'}
      disabled={disabled}
      onClick={onClick}
      className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 border-line-2 bg-surface-2 text-ink transition-colors hover:bg-surface-3 disabled:cursor-default disabled:hover:bg-surface-2"
    >
      <IconChevronRight size={20} className={cn(direction === 'prev' && 'rotate-180', disabled && 'opacity-20')} />
    </button>
  );
}

type StoryMediaProps = { story: OwnerStory };

function StoryMedia({ story }: StoryMediaProps) {
  const images = story.images ?? (story.image ? [story.image] : []);
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;
  const current = images[Math.min(index, images.length - 1)];

  const step = (delta: number) => (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIndex((i) => Math.min(Math.max(i + delta, 0), images.length - 1));
  };

  return (
    <div
      className="group relative flex h-[220px] items-center justify-center text-5xl w1280:h-[300px]"
      style={{ background: current.bg }}
    >
      {current.emoji}
      {images.length > 1 && (
        <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
          <MediaArrow direction="prev" disabled={index === 0} onClick={step(-1)} />
          <MediaArrow direction="next" disabled={index === images.length - 1} onClick={step(1)} />
        </div>
      )}
    </div>
  );
}

type StoryCardProps = { story: OwnerStory };

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <div className="mb-6 cursor-pointer break-inside-avoid overflow-hidden rounded-lg bg-surface transition-transform">
      {!story.imageLast && <StoryMedia story={story} />}
      <div className="flex flex-col gap-3 p-6 w1280:gap-4">
        <div className="flex flex-col gap-1 border-b border-line pb-3 w1280:gap-2 w1280:pb-4">
          <p className="t-card-name">{story.car}</p>
          <p className="t-lb-meta text-ink-2">{story.meta}</p>
        </div>
        {story.tag && <p className="t-eyebrow tracking-[0.05em] text-accent">{story.tag}</p>}
        <p className="t-card-name uppercase">{story.title}</p>
        <p className="t-body line-clamp-3 leading-[1.4] text-ink-2">{story.text}</p>
        <div className="mt-1 flex items-center gap-2 border-t border-line pt-3 w1280:pt-4">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[10px] font-bold w1280:h-8 w1280:w-8">
            {story.author
              .split(' ')
              .map((w) => w[0])
              .join('')}
          </div>
          <p className="t-lb-meta font-medium">{story.author}</p>
          <div className="t-lb-meta ml-auto flex items-center gap-3 font-medium text-ink w1280:gap-4">
            <span className="flex items-center gap-1">
              <IconRepost size={24} className="h-4 w-4 w1280:h-6 w1280:w-6" /> {story.reposts}
            </span>
            <span className="flex items-center gap-1">
              <IconComment size={24} className="h-4 w-4 w1280:h-6 w1280:w-6" /> {story.comments}
            </span>
            <span className="flex items-center gap-1">
              <IconHeart size={24} className="h-4 w-4 w1280:h-6 w1280:w-6" /> {story.likes}
            </span>
          </div>
        </div>
      </div>
      {story.imageLast && <StoryMedia story={story} />}
    </div>
  );
}
