import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { catalogModels, genData, modelDetails, genYears } from './data';
import type { GenRow, ModelRow } from './types';

type ModelEditorState = {
  isNew: boolean;
  name: string;
  years: string;
  desc: string;
};

type GenEditorState = {
  isNew: boolean;
  name: string;
  years: string;
  desc: string;
  model: string;
};

type CustomLink = { id: number };

type CatalogState = {
  tab: 'models' | 'gen';
  genFilter: string;
  models: ModelRow[];
  gens: Record<string, GenRow[]>;
  modelEditor: ModelEditorState;
  genEditor: GenEditorState;
  modelCustomLinks: CustomLink[];
  genCustomLinks: CustomLink[];
  linkCounter: number;
};

const initialState: CatalogState = {
  tab: 'models',
  genFilter: '',
  models: catalogModels,
  gens: genData,
  modelEditor: { isNew: true, name: '', years: '', desc: '' },
  genEditor: { isNew: true, name: '', years: '', desc: '', model: '' },
  modelCustomLinks: [],
  genCustomLinks: [],
  linkCounter: 0,
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setTab(state, action: PayloadAction<'models' | 'gen'>) {
      state.tab = action.payload;
    },
    setGenFilter(state, action: PayloadAction<string>) {
      state.genFilter = action.payload;
    },
    toggleModelVisible(state, action: PayloadAction<string>) {
      const m = state.models.find((m) => m.name === action.payload);
      if (m) m.visible = !m.visible;
    },
    toggleGenVisible(state, action: PayloadAction<{ model: string; name: string }>) {
      const g = state.gens[action.payload.model]?.find((g) => g.name === action.payload.name);
      if (g) g.visible = !g.visible;
    },
    initModelEditor(state, action: PayloadAction<string | null>) {
      const name = action.payload;
      if (!name) {
        state.modelEditor = { isNew: true, name: '', years: '', desc: '' };
      } else {
        const d = modelDetails[name] ?? { years: '', desc: '' };
        state.modelEditor = { isNew: false, name, years: d.years, desc: d.desc };
      }
    },
    updateModelEditor(state, action: PayloadAction<Partial<ModelEditorState>>) {
      Object.assign(state.modelEditor, action.payload);
    },
    initGenEditor(state, action: PayloadAction<{ name: string | null; model: string }>) {
      const { name, model } = action.payload;
      if (!name) {
        state.genEditor = { isNew: true, name: '', years: '', desc: '', model };
      } else {
        state.genEditor = {
          isNew: false,
          name,
          years: genYears(name),
          desc: `${name} — key generation details with performance updates and engineering refinements.`,
          model,
        };
      }
    },
    updateGenEditor(state, action: PayloadAction<Partial<GenEditorState>>) {
      Object.assign(state.genEditor, action.payload);
    },
    addCustomLink(state, action: PayloadAction<'model' | 'gen'>) {
      state.linkCounter++;
      const list = action.payload === 'model' ? state.modelCustomLinks : state.genCustomLinks;
      list.push({ id: state.linkCounter });
    },
    removeCustomLink(state, action: PayloadAction<{ target: 'model' | 'gen'; id: number }>) {
      const { target, id } = action.payload;
      if (target === 'model') {
        state.modelCustomLinks = state.modelCustomLinks.filter((l) => l.id !== id);
      } else {
        state.genCustomLinks = state.genCustomLinks.filter((l) => l.id !== id);
      }
    },
  },
});

export const {
  setTab,
  setGenFilter,
  toggleModelVisible,
  toggleGenVisible,
  initModelEditor,
  updateModelEditor,
  initGenEditor,
  updateGenEditor,
  addCustomLink,
  removeCustomLink,
} = catalogSlice.actions;
export default catalogSlice.reducer;
