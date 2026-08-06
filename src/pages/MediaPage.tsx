import { useState } from 'react';
import { useAppDispatch } from '@/store';
import { showToast } from '@/store/uiSlice';
import { Button, Chip, SectionCard, SectionHeader } from '@/components/ui';
import { mediaFiles } from '@/features/media/data';

const filters = ['All', 'Images', 'Videos', 'Logos'];

export default function MediaPage() {
  const dispatch = useAppDispatch();
  const [active, setActive] = useState<Record<string, boolean>>({ All: true });

  return (
    <SectionCard>
      <SectionHeader
        title="Media Library"
        sub="Brand assets — images, videos, logos"
        right={
          <Button sm onClick={() => dispatch(showToast('📁 Upload dialog opened'))}>
            + Upload
          </Button>
        }
      />
      <div className="flex gap-2 px-5 pt-4">
        {filters.map((f) => (
          <Chip key={f} label={f} active={!!active[f]} onClick={() => setActive((a) => ({ ...a, [f]: !a[f] }))} />
        ))}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3 p-5">
        {mediaFiles.slice(0, 6).map((f) => (
          <div
            key={f.name}
            onClick={() => dispatch(showToast(`${f.name.endsWith('.mp4') ? '🎬' : '🖼️'} ${f.name} selected`))}
            className="cursor-pointer overflow-hidden rounded-el border border-line bg-surface-2 transition-all duration-150 hover:-translate-y-px hover:border-line-2"
          >
            <div className="flex h-20 items-center justify-center text-[22px]" style={{ background: f.bg }}>
              {f.emoji}
            </div>
            <div className="px-2.5 py-2">
              <div className="overflow-hidden text-xs font-semibold text-ellipsis whitespace-nowrap text-ink">
                {f.name}
              </div>
              <div className="text-[11px] text-ink-3">{f.meta}</div>
            </div>
          </div>
        ))}
        <div
          onClick={() => dispatch(showToast('📁 Upload dialog opened'))}
          className="cursor-pointer overflow-hidden rounded-el border-2 border-dashed border-line-2 bg-surface-2 transition-all duration-150 hover:-translate-y-px"
        >
          <div className="flex h-20 items-center justify-center bg-transparent text-[28px] text-ink-3">+</div>
          <div className="px-2.5 py-2">
            <div className="text-xs font-semibold text-ink-3">Upload new</div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
