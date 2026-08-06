import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/cn';
import { setHeroType } from '../landingSlice';
import type { HeroType } from '../types';
import Badge from '@/components/_admin/ui/Badge';
import Button from '@/components/_admin/ui/Button';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Toggle from '@/components/_admin/forms/Toggle';
import { MediaPickRow, MediaSectionLabel } from '@/components/_admin/MediaRow';
import { IconImage, IconVideo, IconCarousel } from '@/components/_admin/icons';
import Input from '@/components/_admin/forms/Input';

/* ── Hero CTA form fields (shared by the three hero types) ── */
function HeroCtaFields({ prefill }: { prefill?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3 p-5 md:gap-4">
      <div className="col-span-full h-px bg-line" />
      <FormGroup label="H1 — Headline" full>
        <Input type="text" defaultValue={prefill ? 'The Ultimate Driving Machine' : ''} placeholder="Main heading" />
      </FormGroup>
      <FormGroup label="H2 — Subheadline" full>
        <Input
          type="text"
          defaultValue={prefill ? 'Over a century of precision engineering.' : ''}
          placeholder="Supporting text"
        />
      </FormGroup>
      <FormGroup label="CTA Primary — Button Text">
        <Input type="text" defaultValue={prefill ? 'Explore Models' : ''} placeholder="e.g. Explore Models" />
      </FormGroup>
      <FormGroup label="CTA Primary — Link URL">
        <Input type="url" defaultValue={prefill ? 'https://bmw.motority.com/models' : ''} placeholder="https://..." />
      </FormGroup>
      <FormGroup label="CTA Secondary — Button Text">
        <Input type="text" defaultValue={prefill ? 'Join the Community' : ''} placeholder="e.g. Join Community" />
      </FormGroup>
      <FormGroup label="CTA Secondary — Link URL">
        <Input type="url" defaultValue={prefill ? 'https://motority.com/join' : ''} placeholder="https://..." />
      </FormGroup>
    </div>
  );
}

const slides = [
  {
    num: 1,
    name: 'hero-main.jpg',
    meta: '2.4 MB · 1600×900',
    emoji: '🏎️',
    bg: 'linear-gradient(135deg,#1e3a5f,#0f3460)',
  },
  {
    num: 2,
    name: 'm4-front.jpg',
    meta: '1.1 MB · 800×533',
    emoji: '🚗',
    bg: 'linear-gradient(135deg,#2d3748,#1a202c)',
  },
  {
    num: 3,
    name: 'x5-road.jpg',
    meta: '1.8 MB · 1200×800',
    emoji: '🚙',
    bg: 'linear-gradient(135deg,#2d6a4f,#1b4332)',
  },
];

export function HeroBlock() {
  const dispatch = useAppDispatch();
  const heroType = useAppSelector((s) => s.landing.heroType);
  const [autoplay, setAutoplay] = useState(true);

  const tabs: { id: HeroType; label: string; icon: React.ReactNode }[] = [
    { id: 'image', label: 'Photo', icon: <IconImage size={14} /> },
    { id: 'video', label: 'Video', icon: <IconVideo size={14} /> },
    { id: 'carousel', label: 'Carousel', icon: <IconCarousel size={14} /> },
  ];

  return (
    <SectionCard>
      <SectionHeader
        title="Hero Block"
        sub="Top visual of the landing page"
        right={
          <Button sm onClick={() => showToast('✅ Hero block saved')}>
            Save Changes
          </Button>
        }
      />
      <div className="flex gap-1 border-b border-line bg-surface-2 px-3 py-2 md:px-4 md:py-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => dispatch(setHeroType(t.id))}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-el border px-3 py-[7px] font-sans text-[12.5px] font-semibold transition-all duration-150 md:px-4',
              heroType === t.id
                ? 'border-line bg-surface text-accent-light shadow-[0_1px_4px_rgba(0,0,0,.15)] [&_svg]:opacity-100'
                : 'border-transparent bg-transparent text-ink-3 hover:border-line hover:bg-surface hover:text-ink [&_svg]:opacity-70 [&_svg]:hover:opacity-100',
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className={heroType === 'image' ? '' : 'hidden'}>
        <div className="p-5">
          <MediaSectionLabel>Background Photo</MediaSectionLabel>
          <MediaPickRow icon="🖼️" text="Drop image or click to upload" hint="1600×900px · JPG/WebP · max 5MB" />
        </div>
        <HeroCtaFields prefill />
      </div>

      <div className={heroType === 'video' ? '' : 'hidden'}>
        <div className="p-5">
          <MediaSectionLabel>Background Video</MediaSectionLabel>
          <MediaPickRow
            icon="🎬"
            text="Drop video or click to upload"
            hint="MP4/WebM · max 100MB · recommended 1920×1080"
          />
          <MediaSectionLabel className="mt-3 md:mt-4">Preview Thumbnail</MediaSectionLabel>
          <MediaPickRow icon="🖼️" text="Upload thumbnail image" hint="Shown before video loads" compact />
        </div>
        <HeroCtaFields />
      </div>

      <div className={heroType === 'carousel' ? '' : 'hidden'}>
        <div className="p-5">
          <div className="mb-2 flex items-center justify-between md:mb-3">
            <MediaSectionLabel className="mb-0">
              Carousel Slides{' '}
              <Badge color="gray" className="ml-1.5 text-[11px]">
                3 slides
              </Badge>
            </MediaSectionLabel>
            <Button variant="ghost" sm onClick={() => showToast('➕ New slide added')}>
              + Add Slide
            </Button>
          </div>
          {slides.map((s) => (
            <div key={s.num} className="flex items-center gap-2.5 border-b border-line py-2.5 last-of-type:border-b-0">
              <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-line-2 bg-surface-3 text-[11px] font-bold text-ink-3">
                {s.num}
              </div>
              <div
                className="flex h-9 w-[52px] shrink-0 items-center justify-center rounded-[5px] text-base"
                style={{ background: s.bg }}
              >
                {s.emoji}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-ink">{s.name}</div>
                <div className="mt-0.5 text-[11px] text-ink-3">{s.meta}</div>
              </div>
              <div className="ml-auto flex gap-1.5">
                <Button variant="ghost" sm onClick={() => showToast(`✏️ Slide ${s.num} editing`)}>
                  Edit
                </Button>
                <Button variant="danger" sm onClick={() => showToast('🗑️ Slide removed')}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <div className="mt-2.5">
            <MediaPickRow icon="+" text="Upload new slide" compact />
          </div>
          <div className="mt-2 flex items-center gap-5 border-t border-line pt-3.5 md:mt-3">
            <div className="flex flex-row items-center gap-2.5">
              <Toggle on={autoplay} onClick={() => setAutoplay(!autoplay)} />
              <label>Autoplay</label>
            </div>
            <FormGroup label="Slide duration (seconds)">
              <Input type="text" defaultValue="5" style={{ width: 80 }} />
            </FormGroup>
          </div>
        </div>
        <HeroCtaFields prefill />
      </div>
    </SectionCard>
  );
}
