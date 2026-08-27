import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type CatalogState = {
  tab: 'models' | 'gen';
  genFilterModelId: number | null;
};

const initialState: CatalogState = {
  tab: 'models',
  genFilterModelId: null,
};

/**
 * Pure UI state for the Cars Catalog screen — which tab is open and which
 * model the Generations tab is filtered to. Survives trips into the editors.
 * Catalog data itself lives in the RTK Query cache.
 */
const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setTab(state, action: PayloadAction<'models' | 'gen'>) {
      state.tab = action.payload;
    },
    setGenFilterModelId(state, action: PayloadAction<number | null>) {
      state.genFilterModelId = action.payload;
    },
  },
});

export const { setTab, setGenFilterModelId } = catalogSlice.actions;
export default catalogSlice.reducer;
