import { useState } from 'react';
import { cn } from '@/lib/cn';
import { showToast } from '@/lib/toast';
import Modal from '@/components/_admin/Modal';
import Button from '@/components/_admin/ui/Button';
import Chip from '@/components/_admin/ui/Chip';
import { IconImage } from '@/components/_admin/icons';
import { mediaFiles } from './data';

const mediaFilters = ['All', 'Images', 'Videos', 'Logos'];

type Props = { open: boolean; onClose: () => void };

export default function PickMediaModal({ open, onClose }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  const close = () => {
    setSelected(null);
    setFilter('All');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Media Library"
      sub="Select a file to insert into the hero block"
      width={680}
      footer={
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-ink-3">
            <IconImage size={13} />
            {selected ? `Selected: ${selected}` : 'No file selected'}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button
              disabled={!selected}
              style={{ opacity: selected ? 1 : 0.5, cursor: selected ? 'pointer' : 'not-allowed' }}
              onClick={() => {
                if (!selected) return;
                close();
                showToast(`✅ ${selected} inserted`);
              }}
            >
              Choose
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex gap-2 border-b border-line px-5 py-2 @mobile:py-3">
        {mediaFilters.map((f) => (
          <Chip
            key={f}
            label={f}
            active={filter === f}
            onClick={() => {
              setFilter(f);
              showToast(`🔍 Filtered: ${f === 'All' ? 'All files' : f.toLowerCase()}`);
            }}
          />
        ))}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2 p-5 @mobile:gap-3">
        {mediaFiles.map((f) => (
          <div
            key={f.name}
            onClick={() => setSelected(f.name)}
            className={cn(
              'relative cursor-pointer overflow-hidden rounded-el border bg-surface-2 transition-all duration-150',
              selected === f.name
                ? "border-accent shadow-[0_0_0_2px_var(--accent-bg)] after:absolute after:top-1 after:right-1 after:flex after:h-[18px] after:w-[18px] after:items-center after:justify-center after:rounded-full after:bg-accent after:text-[10px] after:font-bold after:text-white after:content-['✓']"
                : 'border-line hover:-translate-y-px hover:border-line-2',
            )}
          >
            <div className="flex h-[90px] items-center justify-center text-[22px]" style={{ background: f.bg }}>
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
      </div>
    </Modal>
  );
}
