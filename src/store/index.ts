import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { catalogApiSlice } from '@/lib/redux/api/landing-api/catalog-api/catalog-api-slice';
import { adminApiSlice } from '@/lib/redux/api/admin-api';
import { autobrandApiSlice } from '@/lib/redux/api/landing-api/autobrand-api/autobrand-api-slice';
import catalog from '@/features/_admin/catalog/catalogSlice';
import specs from '@/features/_admin/specs/specsSlice';
import screen from './screenSlice';
import uploads from './uploadsSlice';

export const store = configureStore({
  reducer: {
    catalog,
    specs,
    screen,
    uploads,
    [catalogApiSlice.reducerPath]: catalogApiSlice.reducer,
    [adminApiSlice.reducerPath]: adminApiSlice.reducer,
    [autobrandApiSlice.reducerPath]: autobrandApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(catalogApiSlice.middleware, adminApiSlice.middleware, autobrandApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
