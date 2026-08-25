import { useState, type ReactNode } from 'react';
import { DndContext, DragOverlay, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/cn';
import { IconX } from '@/components/_admin/icons';
import type { AdminMediaType } from '@/lib/redux/api/admin-api/admin-types';

export type HeroSlideItemType = {
  id: string;
  name: string;
  meta: string;
  previewUrl: string | null;
  file: File | null;
  mediaId?: string | number | null;
  media?: AdminMediaType | null;
};

const tileClass =
  'group relative aspect-[4/3] w-[calc(33.333%-7px)] overflow-hidden rounded-el border border-line @mobile:w-[calc(20%-8px)]';

type TileBodyProps = { slide: HeroSlideItemType; index: number };

function TileBody({ slide, index }: TileBodyProps) {
  return (
    <>
      {slide.previewUrl ? (
        <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${slide.previewUrl})` }} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-surface-3 text-2xl">🖼️</div>
      )}
      <span className="absolute top-[5px] left-[5px] flex h-[22px] w-[22px] items-center justify-center rounded-full border border-line-2 bg-black/70 text-[11px] font-bold text-white">
        {index + 1}
      </span>
    </>
  );
}

type TileProps = { slide: HeroSlideItemType; index: number; disabled?: boolean; onRemove: (id: string) => void };

function SlideTile({ slide, index, disabled, onRemove }: TileProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: slide.id,
    disabled,
  });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        tileClass,
        disabled ? 'opacity-60' : 'cursor-grab active:cursor-grabbing',
        isDragging && 'border-2 border-dashed border-accent bg-accent-bg',
      )}
      {...attributes}
      {...listeners}
    >
      {!isDragging && (
        <>
          <TileBody slide={slide} index={index} />
          <button
            type="button"
            title="Remove slide"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onRemove(slide.id)}
            className="absolute top-[5px] right-[5px] flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full border-none bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <IconX size={10} sw={2.5} />
          </button>
        </>
      )}
    </div>
  );
}

type Props = {
  slides: HeroSlideItemType[];
  disabled?: boolean;
  onChange: (slides: HeroSlideItemType[]) => void;
  onRemove: (id: string) => void;
  children?: ReactNode;
};

export default function HeroSlideGrid({ slides, disabled, onChange, onRemove, children }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const overId = e.over?.id;
    if (overId == null || overId === e.active.id) return;
    const from = slides.findIndex((s) => s.id === e.active.id);
    const to = slides.findIndex((s) => s.id === overId);
    if (from === -1 || to === -1) return;
    onChange(arrayMove(slides, from, to));
  };

  const active = slides.find((s) => s.id === activeId);
  const activeIndex = slides.findIndex((s) => s.id === activeId);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <SortableContext items={slides.map((s) => s.id)} strategy={rectSortingStrategy}>
        <div className="flex flex-wrap gap-2.5">
          {slides.map((slide, i) => (
            <SlideTile key={slide.id} slide={slide} index={i} disabled={disabled} onRemove={onRemove} />
          ))}
          {children}
        </div>
      </SortableContext>
      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(.2,0,0,1)' }}>
        {active ? (
          <div className="relative h-full w-full rotate-2 scale-105 cursor-grabbing overflow-hidden rounded-el border-2 border-accent shadow-[0_18px_44px_rgba(0,0,0,.55)]">
            <TileBody slide={active} index={activeIndex} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
