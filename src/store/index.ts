import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { catalogApiSlice } from '@/lib/redux/api/landing-api/catalog-api/catalog-api-slice';
import { adminApiSlice } from '@/lib/redux/api/admin-api';
import { autobrandApiSlice } from '@/lib/redux/api/landing-api/autobrand-api/autobrand-api-slice';
import { authApiSlice } from '@/lib/redux/api/auth-api/auth-api-slice';
import catalog from '@/features/_admin/catalog/catalogSlice';
import specs from '@/features/_admin/specs/specsSlice';
import auth from './authSlice';
import { authListener } from './auth-middleware';
import screen from './screenSlice';
import uploads from './uploadsSlice';

export const store = configureStore({
  reducer: {
    auth,
    catalog,
    specs,
    screen,
    uploads,
    [catalogApiSlice.reducerPath]: catalogApiSlice.reducer,
    [adminApiSlice.reducerPath]: adminApiSlice.reducer,
    [autobrandApiSlice.reducerPath]: autobrandApiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      // Persistence listener runs before the API middleware so the cookie is
      // already written by the time any refetch fires with the new token.
      .prepend(authListener.middleware)
      .concat(
        catalogApiSlice.middleware,
        adminApiSlice.middleware,
        autobrandApiSlice.middleware,
        authApiSlice.middleware,
      ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
