import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/lib/redux/api/base-query';

export type VehicleKind = 'car' | 'moto' | 'racing' | 'truck';

export type CatalogLogoType = {
  id?: string | null;
  url?: string;
  url_domain?: string;
  image_small?: string;
  image_medium?: string;
  image_big?: string;
  media_type?: string;
  filetype?: string;
  width?: number | null;
  height?: number | null;
  default?: boolean | null;
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

export type TopLogbookCountersType = {
  followers?: number;
  subscriptions?: number;
  posts?: number;
  comments?: number;
  likes?: number;
  dislikes?: number;
  common_followers?: number;
};

export type TopLogbookAuthorType = {
  id: number;
  type?: string;
  name: string;
  canonical_name?: string;
  slug: string;
  url?: string;
  rating?: number;
  position?: number;
  promoted?: boolean;
  verification_status?: string;
  is_vendor?: boolean;
  ownership?: number | null;
  vehicle_status?: number | null;
  engagement_rate?: number;
  popular_tags?: string[];
  counters?: TopLogbookCountersType;
  picture?: CatalogLogoType;
  cover?: CatalogLogoType;
  owner_author?: TopLogbookAuthorType | null;
  make_name?: string | null;
  model_name?: string | null;
  generation_name?: string | null;
};

export type GetTopLogbooksParamsType = {
  type: VehicleKind;
  make?: string;
  model?: string;
  generation?: string;
  page?: number;
  perPage?: number;
};

export type CatalogPostStatisticsType = {
  rating?: number;
  likes?: number;
  dislikes?: number;
  views?: number;
  comments?: number;
  reposts?: number;
};

export type CatalogPostItemType = {
  type?: string;
  text?: string;
  media?: CatalogLogoType;
  gallery?: { data?: CatalogLogoType }[] | null;
};

export type CatalogPostType = {
  id: number;
  title?: string | null;
  announce?: string | null;
  announce_generated?: string | null;
  slug: string;
  type?: string;
  created_at?: string;
  url?: string;
  statistics?: CatalogPostStatisticsType;
  category?: { name?: string } | string | null;
  items?: CatalogPostItemType[] | null;
  author?: TopLogbookAuthorType | null;
  sub_author?: TopLogbookAuthorType | null;
};

export const catalogApiSlice = createApi({
  reducerPath: 'catalogApi',
  baseQuery,
  tagTypes: [
    'getCatalogMakes',
    'catalogModels',
    'catalogGenerations',
    'getTopLogbooks',
    'getNewLogbooks',
    'getCatalogLogbookPosts',
  ],

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

    getTopLogbooks: builder.query<PaginatedResponse<TopLogbookAuthorType>, GetTopLogbooksParamsType>({
      query: ({ type = 'car', make = '', model = '', generation = '', page = 1, perPage = 10 }) =>
        `/api/v2/public/catalog/logbooks/authors?model-type=${type}&make-slug=${make}&model-slug=${model}&generation-slug=${generation}&page=${page}&per-page=${perPage}`,
      keepUnusedDataFor: 0,

      transformResponse: (
        response: { data: PaginatedResponse<TopLogbookAuthorType> } | PaginatedResponse<TopLogbookAuthorType>,
      ) => {
        const data = 'data' in response ? response.data : response;
        console.log('[public] GET /api/v2/public/catalog/logbooks/authors', data);
        return data;
      },
      providesTags: () => [{ type: 'getTopLogbooks', id: 'LIST' }],
    }),

    getNewLogbooks: builder.query<
      PaginatedResponse<TopLogbookAuthorType>,
      { make: string; page?: number; perPage?: number }
    >({
      query: ({ make, page = 1, perPage = 3 }) =>
        `/api/public/author?page=${page}&per-page=${perPage}&type=logbook&search-type=new&make=${make}`,
      keepUnusedDataFor: 0,

      transformResponse: (
        response: { data: PaginatedResponse<TopLogbookAuthorType> } | PaginatedResponse<TopLogbookAuthorType>,
      ) => {
        const data = 'data' in response ? response.data : response;
        console.log('[public] GET /api/public/author?search-type=new', data);
        return data;
      },
      providesTags: () => [{ type: 'getNewLogbooks', id: 'LIST' }],
    }),

    getCatalogLogbookPosts: builder.query<PaginatedResponse<CatalogPostType>, GetTopLogbooksParamsType>({
      query: ({ type = 'car', make = '', model = '', generation = '', page = 1, perPage = 10 }) =>
        `/api/v2/public/catalog/logbooks/posts?model-type=${type}&make-slug=${make}&model-slug=${model}&generation-slug=${generation}&page=${page}&per-page=${perPage}`,
      keepUnusedDataFor: 0,

      transformResponse: (
        response: { data: PaginatedResponse<CatalogPostType> } | PaginatedResponse<CatalogPostType>,
      ) => ('data' in response ? response.data : response),
      providesTags: () => [{ type: 'getCatalogLogbookPosts', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetCatalogMakesQuery,
  useGetCatalogModelsQuery,
  useGetCatalogGenerationsQuery,
  useGetTopLogbooksQuery,
  useGetNewLogbooksQuery,
  useGetCatalogLogbookPostsQuery,
} = catalogApiSlice;
