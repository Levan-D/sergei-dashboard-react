import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import type { SpecMod, SpecRow } from './types';

const row = (key: string, value: string): SpecRow => ({ id: nanoid(), key, value });

const initialState: { mods: SpecMod[] } = {
  mods: [
    {
      id: 'mod-1',
      name: '3.0 AT 510 hp – Competition',
      groups: [
        {
          id: 'grp-1',
          name: 'General information',
          rows: [
            row('Country of origin', 'Germany'),
            row('Car class', 'A'),
            row('Number of doors', '4'),
            row('Number of seats', '5'),
          ],
        },
        {
          id: 'grp-2',
          name: 'Engine',
          rows: [
            row('Engine type', 'Gasoline'),
            row('Maximum power', '510 hp • 375 kW • 6250 rpm'),
            row('Engine capacity', '2993 cc'),
            row('Type of supercharging', 'Turbocharging'),
          ],
        },
        {
          id: 'grp-3',
          name: 'Dimensions',
          rows: [row('Length', '4794 mm'), row('Width', '1887 mm'), row('Wheelbase', '2857 mm')],
        },
      ],
    },
  ],
};

/** Move `dragId` next to `overId` (before/after). Returns false if nothing changed. */
function reorder<T extends { id: string }>(list: T[], dragId: string, overId: string, after: boolean): boolean {
  const from = list.findIndex((x) => x.id === dragId);
  if (from === -1) return false;
  const [item] = list.splice(from, 1);
  let to = list.findIndex((x) => x.id === overId);
  if (to === -1) {
    list.splice(from, 0, item);
    return false;
  }
  if (after) to += 1;
  list.splice(to, 0, item);
  return to !== from;
}

const specsSlice = createSlice({
  name: 'specs',
  initialState,
  reducers: {
    addModification(state) {
      state.mods.push({ id: nanoid(), name: '', groups: [] });
    },
    removeModification(state, action: PayloadAction<string>) {
      state.mods = state.mods.filter((m) => m.id !== action.payload);
    },
    setModName(state, action: PayloadAction<{ modId: string; name: string }>) {
      const m = state.mods.find((m) => m.id === action.payload.modId);
      if (m) m.name = action.payload.name;
    },
    addGroup(state, action: PayloadAction<string>) {
      const m = state.mods.find((m) => m.id === action.payload);
      if (m) m.groups.push({ id: nanoid(), name: '', rows: [] });
    },
    removeGroup(state, action: PayloadAction<{ modId: string; groupId: string }>) {
      const m = state.mods.find((m) => m.id === action.payload.modId);
      if (m) m.groups = m.groups.filter((g) => g.id !== action.payload.groupId);
    },
    setGroupName(state, action: PayloadAction<{ modId: string; groupId: string; name: string }>) {
      const g = state.mods
        .find((m) => m.id === action.payload.modId)
        ?.groups.find((g) => g.id === action.payload.groupId);
      if (g) g.name = action.payload.name;
    },
    addRow(state, action: PayloadAction<{ modId: string; groupId: string }>) {
      const g = state.mods
        .find((m) => m.id === action.payload.modId)
        ?.groups.find((g) => g.id === action.payload.groupId);
      if (g) g.rows.push({ id: nanoid(), key: '', value: '' });
    },
    removeRow(state, action: PayloadAction<{ modId: string; groupId: string; rowId: string }>) {
      const g = state.mods
        .find((m) => m.id === action.payload.modId)
        ?.groups.find((g) => g.id === action.payload.groupId);
      if (g) g.rows = g.rows.filter((r) => r.id !== action.payload.rowId);
    },
    setRow(
      state,
      action: PayloadAction<{ modId: string; groupId: string; rowId: string; field: 'key' | 'value'; text: string }>,
    ) {
      const r = state.mods
        .find((m) => m.id === action.payload.modId)
        ?.groups.find((g) => g.id === action.payload.groupId)
        ?.rows.find((r) => r.id === action.payload.rowId);
      if (r) r[action.payload.field] = action.payload.text;
    },
    moveMod(state, action: PayloadAction<{ dragId: string; overId: string; after: boolean }>) {
      reorder(state.mods, action.payload.dragId, action.payload.overId, action.payload.after);
    },
    moveGroup(state, action: PayloadAction<{ modId: string; dragId: string; overId: string; after: boolean }>) {
      const m = state.mods.find((m) => m.id === action.payload.modId);
      if (m) reorder(m.groups, action.payload.dragId, action.payload.overId, action.payload.after);
    },
    moveRow(
      state,
      action: PayloadAction<{ modId: string; groupId: string; dragId: string; overId: string; after: boolean }>,
    ) {
      const g = state.mods
        .find((m) => m.id === action.payload.modId)
        ?.groups.find((g) => g.id === action.payload.groupId);
      if (g) reorder(g.rows, action.payload.dragId, action.payload.overId, action.payload.after);
    },
  },
});

export const {
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
} = specsSlice.actions;
export default specsSlice.reducer;
