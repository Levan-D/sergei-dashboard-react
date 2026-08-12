import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/lib/redux/api/base-query';

export type VehicleKind = 'car' | 'moto' | 'racing' | 'truck';

export type CatalogLogoType = {
  url?: string;
  url_domain?: string;
  image_small?: string;
  image_medium?: string;
  image_big?: string;
} | null;

export type PaginatedResponse<T> = {
  items: T[];
  current_page: number;
  last_page: number;
  total: number;
  count: number;
};

export type CatalogMakeType = {
  id?: number;
  name: string;
  slug: string;
  type?: VehicleKind;
  logo?: CatalogLogoType;
  info: { name: string; value: string }[] | null;
  about: string | null;
  subscribed?: boolean;
};

export type CatalogModelItemType = {
  type: VehicleKind;
  subscribed?: boolean;
  make: {
    id: number;
    name: string;
    slug: string;
    logo: CatalogLogoType;
    info: { name: string; value: string }[];
    about: string | null;
  };
  model: {
    id: number;
    name: string;
    slug: string;
    type: VehicleKind;
    info: { name: string; value: string }[];
    about: string | null;
  };
};

export type CatalogGenerationType = {
  id: number;
  name: string;
  slug: string;
  logo?: CatalogLogoType;
  since: number | null;
  until: number | null;
  year?: number | null;
  bodies?: string[];
  info?: { name: string; value?: string }[];
  about?: string | null;
};

export type GetCatalogMakesParamsType = {
  type: VehicleKind;
  page: number;
  perPage?: number;
};

export const catalogApiSlice = createApi({
  reducerPath: 'catalogApi',
  baseQuery,
  tagTypes: ['getCatalogMakes', 'catalogModels', 'catalogGenerations'],

  endpoints: (builder) => ({
    getCatalogMakes: builder.query<PaginatedResponse<CatalogMakeType>, GetCatalogMakesParamsType>({
      query: ({ type = 'car', page, perPage = 20 }) =>
        `/api/v3/public/catalog/handbook/makes?type=${type}&per-page=${perPage}&page=${page}`,
      keepUnusedDataFor: 600,

      transformResponse: (
        response: { data: PaginatedResponse<CatalogMakeType> } | PaginatedResponse<CatalogMakeType>,
      ) => ('data' in response ? response.data : response),
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg?.page !== previousArg?.page || currentArg?.type !== previousArg?.type;
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => `${endpointName}-${queryArgs.type}`,
      merge: (currentCacheData, incomingData, { arg }) => {
        if (arg.page === 1) {
          return incomingData;
        }
        currentCacheData.current_page = arg.page;
        currentCacheData.items.push(...incomingData.items);
      },
      providesTags: () => [{ type: 'getCatalogMakes', id: 'LIST' }],
    }),

    getCatalogModels: builder.query<CatalogModelItemType[], { type: VehicleKind; make: string }>({
      query: ({ type = 'car', make }) => `/api/v2/public/catalog/handbook/makes/${make}/models?type=${type}`,
      keepUnusedDataFor: 600,

      transformResponse: (response: { data: CatalogModelItemType[] } | CatalogModelItemType[]) =>
        Array.isArray(response) ? response : response.data,
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg?.type !== previousArg?.type || currentArg?.make !== previousArg?.make;
      },
      providesTags: () => [{ type: 'catalogModels', id: 'LIST' }],
    }),

    getCatalogGenerations: builder.query<CatalogGenerationType[], { type: VehicleKind; make: string; model: string }>({
      query: ({ type = 'car', make, model }) =>
        `/api/v2/public/catalog/handbook/makes/${make}/models/${model}/generations?type=${type}`,
      keepUnusedDataFor: 600,

      transformResponse: (response: { data: CatalogGenerationType[] } | CatalogGenerationType[]) =>
        Array.isArray(response) ? response : response.data,
      forceRefetch: ({ currentArg, previousArg }) => {
        return (
          currentArg?.type !== previousArg?.type ||
          currentArg?.make !== previousArg?.make ||
          currentArg?.model !== previousArg?.model
        );
      },
      providesTags: () => [{ type: 'catalogGenerations', id: 'LIST' }],
    }),
  }),
});

export const { useGetCatalogMakesQuery, useGetCatalogModelsQuery, useGetCatalogGenerationsQuery } = catalogApiSlice;
