import { useState } from 'react';
import { showToast } from '@/lib/toast';
import Button from '@/components/_admin/ui/Button';
import Chip from '@/components/_admin/ui/Chip';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import { mediaFiles } from '@/features/_admin/media/data';

const filters = ['All', 'Images', 'Videos', 'Logos'];

export default function MediaPage() {
  const [active, setActive] = useState<Record<string, boolean>>({ All: true });

  return (
    <SectionCard>
      <SectionHeader
        title="Media Library"
        sub="Brand assets — images, videos, logos"
        right={
          <Button sm onClick={() => showToast('📁 Upload dialog opened')}>
            + Upload
          </Button>
        }
      />
      <div className="flex gap-2 px-5 pt-3 @mobile:pt-4">
        {filters.map((f) => (
          <Chip key={f} label={f} active={!!active[f]} onClick={() => setActive((a) => ({ ...a, [f]: !a[f] }))} />
        ))}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2 p-5 @mobile:gap-3">
        {mediaFiles.slice(0, 6).map((f) => (
          <button
            type="button"
            key={f.name}
            onClick={() => showToast(`${f.name.endsWith('.mp4') ? '🎬' : '🖼️'} ${f.name} selected`)}
            className="cursor-pointer overflow-hidden rounded-el border border-line bg-surface-2 text-left transition-all hover:-translate-y-px hover:border-line-2"
          >
            <span className="flex h-20 items-center justify-center text-[22px]" style={{ background: f.bg }}>
              {f.emoji}
            </span>
            <span className="block px-2.5 py-2">
              <span className="block overflow-hidden text-xs font-semibold text-ellipsis whitespace-nowrap text-ink">
                {f.name}
              </span>
              <span className="block text-[11px] text-ink-3">{f.meta}</span>
            </span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => showToast('📁 Upload dialog opened')}
          className="cursor-pointer overflow-hidden rounded-el border-2 border-dashed border-line-2 bg-surface-2 text-left transition-all hover:-translate-y-px"
        >
          <span className="flex h-20 items-center justify-center bg-transparent text-[28px] text-ink-3">+</span>
          <span className="block px-2.5 py-2">
            <span className="block text-xs font-semibold text-ink-3">Upload new</span>
          </span>
        </button>
      </div>
    </SectionCard>
  );
}
