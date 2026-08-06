import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { HeroType, LandingModel } from './types';

type Chip = { label: string; active: boolean };

type LandingState = {
  heroType: HeroType;
  decadesFilter: boolean;
  bodyTypes: Chip[];
  powerTypes: Chip[];
  models: LandingModel[];
};

const chip = (label: string, active = true): Chip => ({ label, active });

const initialState: LandingState = {
  heroType: 'image',
  decadesFilter: true,
  bodyTypes: [
    chip('Compact'),
    chip('Convertible'),
    chip('Coupe'),
    chip('Roadster'),
    chip('SAV'),
    chip('Sedan'),
    chip('Touring'),
    chip('Hatchback', false),
    chip('Wagon', false),
  ],
  powerTypes: [chip('Electric'), chip('Hybrid'), chip('Combustion')],
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
    setHeroType(state, action: PayloadAction<HeroType>) {
      state.heroType = action.payload;
    },
    toggleDecadesFilter(state) {
      state.decadesFilter = !state.decadesFilter;
    },
    toggleBodyType(state, action: PayloadAction<string>) {
      const c = state.bodyTypes.find((c) => c.label === action.payload);
      if (c) c.active = !c.active;
    },
    togglePowerType(state, action: PayloadAction<string>) {
      const c = state.powerTypes.find((c) => c.label === action.payload);
      if (c) c.active = !c.active;
    },
    toggleLandingModelVisible(state, action: PayloadAction<string>) {
      const m = state.models.find((m) => m.name === action.payload);
      if (m) m.visible = !m.visible;
    },
  },
});

export const { setHeroType, toggleDecadesFilter, toggleBodyType, togglePowerType, toggleLandingModelVisible } =
  landingSlice.actions;
export default landingSlice.reducer;
