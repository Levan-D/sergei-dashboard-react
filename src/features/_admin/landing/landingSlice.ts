import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LandingModel } from './types';

type LandingState = {
  models: LandingModel[];
};

const initialState: LandingState = {
  models: [
    {
      name: 'BMW M4',
      meta: 'Coupe / M Division',
      emoji: '🚗',
      generations: 3,
      logbooks: '284',
      badge: 'green',
      visible: true,
    },
    {
      name: 'BMW M3',
      meta: 'Sedan / M Division',
      emoji: '🚗',
      generations: 6,
      logbooks: '412',
      badge: 'green',
      visible: true,
    },
    { name: 'BMW X5', meta: 'SAV', emoji: '🚙', generations: 4, logbooks: '634', badge: 'green', visible: true },
    {
      name: 'BMW iX',
      meta: 'SAV / Electric',
      emoji: '⚡',
      generations: 1,
      logbooks: '47',
      badge: 'yellow',
      visible: false,
    },
  ],
};

const landingSlice = createSlice({
  name: 'landing',
  initialState,
  reducers: {
    toggleLandingModelVisible(state, action: PayloadAction<string>) {
      const m = state.models.find((m) => m.name === action.payload);
      if (m) m.visible = !m.visible;
    },
  },
});

export const { toggleLandingModelVisible } = landingSlice.actions;
export default landingSlice.reducer;
