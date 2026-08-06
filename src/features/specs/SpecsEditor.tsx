import { useState, type DragEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { openModal, showToast } from '@/store/uiSlice';
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
import { Button, SectionCard, SectionHeader } from '@/components/ui';
import { IconDownload, IconDrag4, IconDrag6, IconX } from '@/components/icons';

type DragTarget =
  | { level: 'mod'; id: string }
  | { level: 'group'; modId: string; id: string }
  | { level: 'row'; modId: string; groupId: string; id: string };

function isAfter(e: DragEvent) {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  return e.clientY > r.top + r.height / 2;
}

function DragHandle({ size }: { size: 'md' | 'sm' | 'xs' }) {
  return (
    <div
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

export default function SpecsEditor() {
  const dispatch = useAppDispatch();
  const mods = useAppSelector((s) => s.specs.mods);
  const [drag, setDrag] = useState<DragTarget | null>(null);

  const nakedInput =
    'border-none bg-transparent p-[3px_4px] rounded-[3px] focus:bg-surface-3 focus:outline-none min-w-0';

  return (
    <SectionCard>
      <SectionHeader
        title="Technical Specifications"
        sub="Modifications, groups, and individual characteristics"
        right={
          <div className="flex gap-1.5">
            <Button variant="ghost" sm onClick={() => dispatch(openModal('import-specs'))}>
              <IconDownload size={13} />
              Import Excel
            </Button>
            <Button
              sm
              onClick={() => {
                dispatch(addModification());
                dispatch(showToast('✅ New modification added'));
              }}
            >
              + Add Modification
            </Button>
          </div>
        }
      />

      <div className="px-5 pb-5">
        {mods.map((mod) => (
          <div
            key={mod.id}
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              setDrag({ level: 'mod', id: mod.id });
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragEnd={() => setDrag(null)}
            onDragOver={(e) => {
              if (drag?.level !== 'mod' || drag.id === mod.id) return;
              e.preventDefault();
              e.stopPropagation();
              dispatch(moveMod({ dragId: drag.id, overId: mod.id, after: isAfter(e) }));
            }}
            className={cn(
              'mt-4 overflow-hidden rounded-card border border-line',
              drag?.level === 'mod' && drag.id === mod.id && 'opacity-40',
            )}
          >
            <div className="flex items-center gap-2.5 border-b border-line bg-surface-2 px-4 py-3">
              <DragHandle size="md" />
              <div className="flex-1">
                <div className="mb-[3px] text-[10px] font-semibold tracking-[.06em] text-ink-3 uppercase">
                  Modification
                </div>
                <input
                  type="text"
                  placeholder="e.g. 3.0 AT 480 hp"
                  value={mod.name}
                  onChange={(e) => dispatch(setModName({ modId: mod.id, name: e.target.value }))}
                  className="w-full rounded-none border-0 border-b border-line-2 bg-transparent p-[2px_0] text-sm font-bold text-ink focus:border-b-accent"
                  style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
                />
              </div>
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  sm
                  onClick={() => {
                    dispatch(addGroup(mod.id));
                    dispatch(showToast('✅ New group added'));
                  }}
                >
                  + Group
                </Button>
                <Button
                  variant="danger"
                  sm
                  onClick={() => {
                    dispatch(removeModification(mod.id));
                    dispatch(showToast('🗑️ Modification removed'));
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>

            <div className="px-4 pb-3">
              {mod.groups.map((grp) => (
                <div
                  key={grp.id}
                  draggable
                  onDragStart={(e) => {
                    e.stopPropagation();
                    setDrag({ level: 'group', modId: mod.id, id: grp.id });
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragEnd={() => setDrag(null)}
                  onDragOver={(e) => {
                    if (drag?.level !== 'group' || drag.modId !== mod.id || drag.id === grp.id) return;
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(moveGroup({ modId: mod.id, dragId: drag.id, overId: grp.id, after: isAfter(e) }));
                  }}
                  className={cn(
                    'mt-3 overflow-hidden rounded-el border border-line',
                    drag?.level === 'group' && drag.id === grp.id && 'opacity-40',
                  )}
                >
                  <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-3 py-2">
                    <DragHandle size="sm" />
                    <input
                      type="text"
                      placeholder="Group name"
                      value={grp.name}
                      onChange={(e) => dispatch(setGroupName({ modId: mod.id, groupId: grp.id, name: e.target.value }))}
                      className="min-w-0 flex-1 rounded-none border-0 border-b border-line-2 bg-transparent p-[1px_0] text-[13px] font-bold text-accent-light focus:border-b-accent"
                      style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
                    />
                    <div className="ml-auto flex gap-1.5">
                      <Button variant="ghost" sm onClick={() => dispatch(addRow({ modId: mod.id, groupId: grp.id }))}>
                        + Add row
                      </Button>
                      <Button
                        variant="danger"
                        sm
                        onClick={() => {
                          dispatch(removeGroup({ modId: mod.id, groupId: grp.id }));
                          dispatch(showToast('🗑️ Group removed'));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {grp.rows.map((row) => (
                      <div
                        key={row.id}
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          setDrag({ level: 'row', modId: mod.id, groupId: grp.id, id: row.id });
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragEnd={() => setDrag(null)}
                        onDragOver={(e) => {
                          if (
                            drag?.level !== 'row' ||
                            drag.modId !== mod.id ||
                            drag.groupId !== grp.id ||
                            drag.id === row.id
                          )
                            return;
                          e.preventDefault();
                          e.stopPropagation();
                          dispatch(
                            moveRow({
                              modId: mod.id,
                              groupId: grp.id,
                              dragId: drag.id,
                              overId: row.id,
                              after: isAfter(e),
                            }),
                          );
                        }}
                        className={cn(
                          'group flex items-center gap-2 border-b border-line px-3 py-1.5 transition-colors duration-100 last:border-b-0 hover:bg-surface-2',
                          drag?.level === 'row' && drag.id === row.id && 'opacity-40',
                        )}
                      >
                        <DragHandle size="xs" />
                        <input
                          type="text"
                          placeholder="Characteristic name"
                          value={row.key}
                          onChange={(e) =>
                            dispatch(
                              setRow({
                                modId: mod.id,
                                groupId: grp.id,
                                rowId: row.id,
                                field: 'key',
                                text: e.target.value,
                              }),
                            )
                          }
                          className={cn('flex-1 text-xs text-ink-2', nakedInput)}
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={row.value}
                          onChange={(e) =>
                            dispatch(
                              setRow({
                                modId: mod.id,
                                groupId: grp.id,
                                rowId: row.id,
                                field: 'value',
                                text: e.target.value,
                              }),
                            )
                          }
                          className={cn('flex-[1.2] text-xs font-semibold text-ink', nakedInput)}
                        />
                        <button
                          onClick={() => {
                            dispatch(removeRow({ modId: mod.id, groupId: grp.id, rowId: row.id }));
                            dispatch(showToast('🗑️ Row removed'));
                          }}
                          className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border-none bg-transparent text-ink-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-red-bg hover:text-red"
                        >
                          <IconX size={10} sw={2.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
