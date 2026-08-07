import { useState, useRef, type Ref } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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

const TYPE = { mod: 'spec-mod', group: 'spec-group', row: 'spec-row' };

const nakedInput = 'border-none bg-transparent p-[3px_4px] rounded-[3px] focus:bg-surface-3 focus:outline-none min-w-0';

/** Is the pointer past the vertical midpoint of `el`? */
function pastMidpoint(el: HTMLElement, clientY: number) {
  const r = el.getBoundingClientRect();
  return clientY > r.top + r.height / 2;
}

function DragHandle({ size, innerRef }: { size: 'md' | 'sm' | 'xs'; innerRef: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={innerRef}
      className={cn(
        'flex shrink-0 cursor-grab items-center justify-center rounded p-0.5 px-1 text-ink-3 hover:bg-surface-3 hover:text-ink-2 active:cursor-grabbing',
        size === 'sm' && 'opacity-70',
        size === 'xs' && 'opacity-50',
      )}
    >
      {size === 'xs' ? <IconDrag4 size={9} /> : <IconDrag6 size={size === 'sm' ? 10 : 12} />}
    </div>
  );
}

function RowItem({ modId, groupId, row }: { modId: string; groupId: string; row: SpecRow }) {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({ type: TYPE.row, item: { id: row.id, modId, groupId }, collect: (m) => ({ isDragging: m.isDragging() }) }),
    [row.id, modId, groupId],
  );
  const [, drop] = useDrop<{ id: string; modId: string; groupId: string }>(
    () => ({
      accept: TYPE.row,
      hover(item, monitor) {
        if (item.id === row.id || item.modId !== modId || item.groupId !== groupId) return;
        const el = ref.current;
        const off = monitor.getClientOffset();
        if (!el || !off) return;
        dispatch(moveRow({ modId, groupId, dragId: item.id, overId: row.id, after: pastMidpoint(el, off.y) }));
      },
    }),
    [row.id, modId, groupId, dispatch],
  );
  drag(handleRef);
  preview(drop(ref));
  return (
    <div
      ref={ref}
      className={cn(
        'group flex items-center gap-2 border-b border-line px-2 py-1.5 transition-colors duration-100 last:border-b-0 hover:bg-surface-2 @mobile:px-3',
        isDragging && 'opacity-40',
      )}
    >
      <DragHandle size="xs" innerRef={handleRef} />
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

function GroupItem({ modId, grp }: { modId: string; grp: SpecGroup }) {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({ type: TYPE.group, item: { id: grp.id, modId }, collect: (m) => ({ isDragging: m.isDragging() }) }),
    [grp.id, modId],
  );
  const [, drop] = useDrop<{ id: string; modId: string }>(
    () => ({
      accept: TYPE.group,
      hover(item, monitor) {
        if (item.id === grp.id || item.modId !== modId) return;
        const el = ref.current;
        const off = monitor.getClientOffset();
        if (!el || !off) return;
        dispatch(moveGroup({ modId, dragId: item.id, overId: grp.id, after: pastMidpoint(el, off.y) }));
      },
    }),
    [grp.id, modId, dispatch],
  );
  drag(handleRef);
  preview(drop(ref));
  return (
    <div
      ref={ref}
      className={cn('mt-2 overflow-hidden rounded-el border border-line @mobile:mt-3', isDragging && 'opacity-40')}
    >
      <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-2 py-2 @mobile:px-3">
        <DragHandle size="sm" innerRef={handleRef} />
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
      <div className="flex flex-col">
        {grp.rows.map((row) => (
          <RowItem key={row.id} modId={modId} groupId={grp.id} row={row} />
        ))}
      </div>
    </div>
  );
}

function ModItem({ mod }: { mod: SpecMod }) {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({ type: TYPE.mod, item: { id: mod.id }, collect: (m) => ({ isDragging: m.isDragging() }) }),
    [mod.id],
  );
  const [, drop] = useDrop<{ id: string }>(
    () => ({
      accept: TYPE.mod,
      hover(item, monitor) {
        if (item.id === mod.id) return;
        const el = ref.current;
        const off = monitor.getClientOffset();
        if (!el || !off) return;
        dispatch(moveMod({ dragId: item.id, overId: mod.id, after: pastMidpoint(el, off.y) }));
      },
    }),
    [mod.id, dispatch],
  );
  drag(handleRef);
  preview(drop(ref));
  return (
    <div
      ref={ref}
      className={cn('mt-3 overflow-hidden rounded-card border border-line @mobile:mt-4', isDragging && 'opacity-40')}
    >
      <div className="flex items-center gap-2.5 border-b border-line bg-surface-2 px-3 py-2 @mobile:px-4 @mobile:py-3">
        <DragHandle size="md" innerRef={handleRef} />
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

      <div className="px-3 pb-2 @mobile:px-4 @mobile:pb-3">
        {mod.groups.map((grp) => (
          <GroupItem key={grp.id} modId={mod.id} grp={grp} />
        ))}
      </div>
    </div>
  );
}

export default function SpecsEditor() {
  const dispatch = useAppDispatch();
  const mods = useAppSelector((s) => s.specs.mods);
  const [importOpen, setImportOpen] = useState(false);

  return (
    <DndProvider backend={HTML5Backend}>
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

        <div className="px-5 pb-5">
          {mods.map((mod) => (
            <ModItem key={mod.id} mod={mod} />
          ))}
        </div>
        <ImportSpecsModal open={importOpen} onClose={() => setImportOpen(false)} />
      </SectionCard>
    </DndProvider>
  );
}
