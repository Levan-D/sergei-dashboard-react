import { useState, type HTMLAttributes } from 'react';
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { useAppDispatch, useAppSelector } from '@/store';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/cn';
import {
  addModification,
  removeModification,
  setModName,
  addGroup,
  removeGroup,
  setGroupName,
  addRow,
  removeRow,
  setRow,
  moveMod,
  moveGroup,
  moveRow,
} from './specsSlice';
import type { SpecMod } from './types';
import Button from '@/components/_admin/ui/Button';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import { IconDownload, IconDrag4, IconDrag6, IconX } from '@/components/_admin/icons';
import ImportSpecsModal from './ImportSpecsModal';
import Input from '@/components/_admin/forms/Input';

type SpecGroup = SpecMod['groups'][number];
type SpecRow = SpecGroup['rows'][number];

const nakedInput = 'border-none bg-transparent p-[3px_4px] rounded-[3px] focus:bg-surface-3 focus:outline-none min-w-0';

const useDndSensors = () => useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

/** Translate a dnd-kit drop into the slice's move payload (`after` = moving down the list). */
const dropToMove = (
  list: { id: string }[],
  e: DragEndEvent,
  onMove: (dragId: string, overId: string, after: boolean) => void,
) => {
  const overId = e.over?.id;
  if (overId == null || overId === e.active.id) return;
  const from = list.findIndex((x) => x.id === e.active.id);
  const to = list.findIndex((x) => x.id === overId);
  if (from === -1 || to === -1) return;
  onMove(String(e.active.id), String(overId), from < to);
};

type DragHandleProps = { size: 'md' | 'sm' | 'xs' } & HTMLAttributes<HTMLDivElement>;

function DragHandle({ size, ...rest }: DragHandleProps) {
  return (
    <div
      {...rest}
      className={cn(
        'flex shrink-0 cursor-grab touch-none items-center justify-center rounded p-0.5 px-1 text-ink-3 hover:bg-surface-3 hover:text-ink-2 active:cursor-grabbing',
        size === 'sm' && 'opacity-70',
        size === 'xs' && 'opacity-50',
      )}
    >
      {size === 'xs' ? <IconDrag4 size={9} /> : <IconDrag6 size={size === 'sm' ? 10 : 12} />}
    </div>
  );
}

type RowItemProps = { modId: string; groupId: string; row: SpecRow };

function RowItem({ modId, groupId, row }: RowItemProps) {
  const dispatch = useAppDispatch();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group flex items-center gap-2 border-b border-line px-2 py-1.5 transition-colors duration-100 last:border-b-0 hover:bg-surface-2 @mobile:px-3',
        isDragging && 'relative z-10 bg-surface-2',
      )}
    >
      <DragHandle size="xs" {...attributes} {...listeners} />
      <Input
        type="text"
        placeholder="Characteristic name"
        value={row.key}
        onChange={(e) => dispatch(setRow({ modId, groupId, rowId: row.id, field: 'key', text: e.target.value }))}
        className={cn('flex-1 text-xs text-ink-2', nakedInput)}
      />
      <Input
        type="text"
        placeholder="Value"
        value={row.value}
        onChange={(e) => dispatch(setRow({ modId, groupId, rowId: row.id, field: 'value', text: e.target.value }))}
        className={cn('flex-[1.2] text-xs font-semibold text-ink', nakedInput)}
      />
      <button
        onClick={() => {
          dispatch(removeRow({ modId, groupId, rowId: row.id }));
          showToast('🗑️ Row removed');
        }}
        className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border-none bg-transparent text-ink-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-red-bg hover:text-red"
      >
        <IconX size={10} sw={2.5} />
      </button>
    </div>
  );
}

type GroupItemProps = { modId: string; grp: SpecGroup };

function GroupItem({ modId, grp }: GroupItemProps) {
  const dispatch = useAppDispatch();
  const sensors = useDndSensors();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: grp.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'mt-2 overflow-hidden rounded-el border border-line @mobile:mt-3',
        isDragging && 'relative z-10 border-accent shadow-[0_8px_24px_rgba(0,0,0,.35)]',
      )}
    >
      <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-2 py-2 @mobile:px-3">
        <DragHandle size="sm" {...attributes} {...listeners} />
        <Input
          type="text"
          placeholder="Group name"
          value={grp.name}
          onChange={(e) => dispatch(setGroupName({ modId, groupId: grp.id, name: e.target.value }))}
          className="min-w-0 flex-1 rounded-none border-0 border-b border-line-2 bg-transparent p-[1px_0] text-[13px] font-bold text-accent-light focus:border-b-accent"
        />
        <div className="ml-auto flex gap-1.5">
          <Button variant="ghost" sm onClick={() => dispatch(addRow({ modId, groupId: grp.id }))}>
            + Add row
          </Button>
          <Button
            variant="danger"
            sm
            onClick={() => {
              dispatch(removeGroup({ modId, groupId: grp.id }));
              showToast('🗑️ Group removed');
            }}
          >
            Remove
          </Button>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={(e) =>
          dropToMove(grp.rows, e, (dragId, overId, after) =>
            dispatch(moveRow({ modId, groupId: grp.id, dragId, overId, after })),
          )
        }
      >
        <SortableContext items={grp.rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col">
            {grp.rows.map((row) => (
              <RowItem key={row.id} modId={modId} groupId={grp.id} row={row} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

type ModItemProps = { mod: SpecMod };

function ModItem({ mod }: ModItemProps) {
  const dispatch = useAppDispatch();
  const sensors = useDndSensors();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: mod.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'mt-3 overflow-hidden rounded-card border border-line @mobile:mt-4',
        isDragging && 'relative z-10 border-accent shadow-[0_8px_24px_rgba(0,0,0,.35)]',
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-line bg-surface-2 px-3 py-2 @mobile:px-4 @mobile:py-3">
        <DragHandle size="md" {...attributes} {...listeners} />
        <div className="flex-1">
          <div className="mb-[3px] text-[10px] font-semibold tracking-[.06em] text-ink-3 uppercase">Modification</div>
          <Input
            type="text"
            placeholder="e.g. 3.0 AT 480 hp"
            value={mod.name}
            onChange={(e) => dispatch(setModName({ modId: mod.id, name: e.target.value }))}
            className="w-full rounded-none border-0 border-b border-line-2 bg-transparent p-[2px_0] text-sm font-bold text-ink focus:border-b-accent"
          />
        </div>
        <div className="flex gap-1.5">
          <Button
            variant="ghost"
            sm
            onClick={() => {
              dispatch(addGroup(mod.id));
              showToast('✅ New group added');
            }}
          >
            + Group
          </Button>
          <Button
            variant="danger"
            sm
            onClick={() => {
              dispatch(removeModification(mod.id));
              showToast('🗑️ Modification removed');
            }}
          >
            Remove
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={(e) =>
          dropToMove(mod.groups, e, (dragId, overId, after) =>
            dispatch(moveGroup({ modId: mod.id, dragId, overId, after })),
          )
        }
      >
        <SortableContext items={mod.groups.map((g) => g.id)} strategy={verticalListSortingStrategy}>
          <div className="px-3 pb-2 @mobile:px-4 @mobile:pb-3">
            {mod.groups.map((grp) => (
              <GroupItem key={grp.id} modId={mod.id} grp={grp} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default function SpecsEditor() {
  const dispatch = useAppDispatch();
  const mods = useAppSelector((s) => s.specs.mods);
  const sensors = useDndSensors();
  const [importOpen, setImportOpen] = useState(false);

  return (
    <SectionCard>
      <SectionHeader
        stack
        title="Technical Specifications"
        sub="Modifications, groups, and individual characteristics"
        right={
          <div className="flex flex-wrap gap-1.5">
            <Button variant="ghost" sm onClick={() => setImportOpen(true)}>
              <IconDownload size={13} />
              Import Excel
            </Button>
            <Button
              sm
              onClick={() => {
                dispatch(addModification());
                showToast('✅ New modification added');
              }}
            >
              + Add Modification
            </Button>
          </div>
        }
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={(e) => dropToMove(mods, e, (dragId, overId, after) => dispatch(moveMod({ dragId, overId, after })))}
      >
        <SortableContext items={mods.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          <div className="px-5 pb-5">
            {mods.map((mod) => (
              <ModItem key={mod.id} mod={mod} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <ImportSpecsModal open={importOpen} onClose={() => setImportOpen(false)} />
    </SectionCard>
  );
}
