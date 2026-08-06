import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { showToast } from '@/lib/toast';
import { ROUTING } from '@/lib/routing';
import { addCustomLink, removeCustomLink } from '@/features/_admin/catalog/catalogSlice';
import Button from '@/components/_admin/ui/Button';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import Toggle from '@/components/_admin/forms/Toggle';
import { IconPlus, IconX } from '@/components/_admin/icons';
import PickMediaModal from '@/features/_admin/media/PickMediaModal';
import Input from '@/components/_admin/forms/Input';

/* ── Gallery ── */
type GalleryPhoto = { id: number; emoji: string; bg: string };

export function GallerySection({ sub, initial }: { sub: string; initial: GalleryPhoto[] }) {
  const [photos, setPhotos] = useState(initial);
  const [pickOpen, setPickOpen] = useState(false);
  return (
    <SectionCard>
      <SectionHeader
        title="Gallery"
        sub={sub}
        right={
          <Button variant="ghost" sm onClick={() => setPickOpen(true)}>
            + Add from Library
          </Button>
        }
      />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2.5 px-5 py-3 md:py-4">
        {photos.map((p) => (
          <div key={p.id} className="group relative aspect-[4/3] overflow-hidden rounded-el border border-line">
            <div className="flex h-full w-full items-center justify-center text-2xl" style={{ background: p.bg }}>
              {p.emoji}
            </div>
            <button
              onClick={() => {
                setPhotos((ph) => ph.filter((x) => x.id !== p.id));
                showToast('🗑️ Photo removed');
              }}
              className="absolute top-[5px] right-[5px] flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full border-none bg-black/70 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            >
              <IconX size={10} sw={2.5} />
            </button>
          </div>
        ))}
        <div
          onClick={() => showToast('📁 File picker opened')}
          className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-el border-2 border-dashed border-line-2 text-[11px] font-semibold text-ink-3 transition-all duration-150 hover:border-accent hover:bg-accent-bg hover:text-accent-light"
        >
          <IconPlus size={20} sw={1.5} />
          <span>Upload</span>
        </div>
      </div>
      <div className="px-5 pb-3 text-[11px] text-ink-3 md:pb-4">Drag to reorder · JPG, WebP · max 5MB each</div>
      <PickMediaModal open={pickOpen} onClose={() => setPickOpen(false)} />
    </SectionCard>
  );
}

/* ── External links ── */
const fixedLinks = [
  {
    label: 'Buy Car',
    icon: '🛒',
    iconBg: 'rgba(34,197,94,.12)',
    iconColor: 'var(--green)',
    placeholder: 'https://bmw.com/buy/...',
  },
  {
    label: 'Buy Parts',
    icon: '🔧',
    iconBg: 'rgba(234,179,8,.12)',
    iconColor: 'var(--yellow)',
    placeholder: 'https://bmwparts.com/...',
  },
  {
    label: 'Official Site',
    icon: '🌐',
    iconBg: 'var(--accent-bg)',
    iconColor: 'var(--accent-light)',
    placeholder: 'https://bmw.com/...',
  },
];

export function ExternalLinksSection({ sub, target }: { sub: string; target: 'model' | 'gen' }) {
  const dispatch = useAppDispatch();
  const links = useAppSelector((s) => (target === 'model' ? s.catalog.modelCustomLinks : s.catalog.genCustomLinks));
  return (
    <SectionCard>
      <SectionHeader title="External Links" sub={sub} />
      <div className="flex flex-col gap-3.5 p-5">
        {fixedLinks.map((l) => (
          <div key={l.label} className="flex items-center gap-2 md:gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] text-base"
              style={{ background: l.iconBg, color: l.iconColor }}
            >
              {l.icon}
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <label>{l.label}</label>
              <Input type="url" placeholder={l.placeholder} />
            </div>
          </div>
        ))}
        <div>
          {links.map((l, i) => (
            <div key={l.id} className="flex items-center gap-2 border-t border-dashed border-line-2 py-2.5 md:gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-surface-3 text-base text-ink-3">
                🔗
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <label>Custom Link {i + 1}</label>
                <Input type="url" placeholder="https://..." />
              </div>
              <button
                title="Remove"
                onClick={() => {
                  dispatch(removeCustomLink({ target, id: l.id }));
                  showToast('🗑️ Link removed');
                }}
                className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-[5px] border border-line bg-transparent text-ink-3 hover:border-red hover:bg-red-bg hover:text-red"
              >
                <IconX size={11} sw={2.5} />
              </button>
            </div>
          ))}
        </div>
        <Button variant="ghost" sm className="self-start" onClick={() => dispatch(addCustomLink(target))}>
          <IconPlus size={13} />
          Add custom link
        </Button>
      </div>
    </SectionCard>
  );
}

/* ── Publish sidebar card ── */
export function PublishCard({ saveLabel, savedToast }: { saveLabel: string; savedToast: string }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  return (
    <SectionCard className="mb-0">
      <SectionHeader compact title="Publish" />
      <div className="flex flex-col gap-2 px-3 py-3.5 md:gap-3 md:px-4">
        <div className="flex items-center gap-2.5">
          <Toggle
            on={visible}
            onClick={() => {
              setVisible(!visible);
              showToast('👁️ Visibility updated');
            }}
          />
          <label>Visible on landing</label>
        </div>
        <div className="h-px bg-line" />
        <Button className="w-full justify-center" onClick={() => showToast(savedToast)}>
          {saveLabel}
        </Button>
        <Button variant="ghost" className="w-full justify-center" onClick={() => navigate(ROUTING.adminCatalog)}>
          Cancel
        </Button>
      </div>
    </SectionCard>
  );
}

/* ── Info sidebar card ── */
export function InfoCard({ rows }: { rows: { label: string; value: string; muted?: boolean }[] }) {
  return (
    <SectionCard className="mb-0">
      <SectionHeader compact title="Info" />
      <div className="flex flex-col gap-2 px-3 py-3.5 md:px-4">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between text-xs">
            <span className="text-ink-3">{r.label}</span>
            <span className={r.muted ? 'text-ink-3' : 'font-semibold'}>{r.value}</span>
          </div>
        ))}
        <div className="my-1 h-px bg-line" />
      </div>
    </SectionCard>
  );
}
