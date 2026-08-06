import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '@/store';

export const VIEWPORT_SIZES = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type ViewportKey = keyof typeof VIEWPORT_SIZES;

interface ViewportState {
  width: number | null;
  screens: {
    [K in ViewportKey]: boolean;
  };
}

const getMatchedSizes = (size: number): ViewportState['screens'] =>
  Object.entries(VIEWPORT_SIZES).reduce(
    (acc, [key, breakpoint]) => ({
      ...acc,
      [key]: size >= breakpoint,
    }),
    {} as ViewportState['screens'],
  );

const initialState: ViewportState = {
  width: null,
  screens: {
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    '2xl': false,
  },
};

const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    setViewportWidth: (state, action: PayloadAction<number>) => {
      state.width = action.payload;
      state.screens = getMatchedSizes(action.payload);
    },
  },
});

export const { setViewportWidth } = screenSlice.actions;
export default screenSlice.reducer;

export const useBreakpoint = (breakpoint: ViewportKey) => {
  return useAppSelector((state) => state.screen.screens[breakpoint]);
};

export const useIsAbove = (breakpoint: ViewportKey) => {
  const size = useAppSelector((state) => state.screen.width);
  return size !== null && size >= VIEWPORT_SIZES[breakpoint];
};

export const useIsBelow = (breakpoint: ViewportKey) => {
  const size = useAppSelector((state) => state.screen.width);
  return size !== null && size < VIEWPORT_SIZES[breakpoint];
};
