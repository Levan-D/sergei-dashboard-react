import { adminApiSlice } from '@/lib/redux/api/admin-api/admin-api-slice';
import {
  unwrapData,
  type AdminCatalogGenerationType,
  type AdminCatalogModelType,
  type AdminListResponseType,
} from '@/lib/redux/api/admin-api/admin-types';

/**
 * Brand-scoped admin catalog reads (MOTORITY-4200). Despite the ticket saying
 * "reuse the handbook", a dedicated staff API exists and is far richer — it
 * carries visible / logbooks_count / generations_count / about / info, and on
 * test it has all 410 BMW models while the public handbook has none. All
 * shapes verified live 2026-08-26.
 */
export type GetAdminCatalogModelsArgType = { subdomain: string };

export type GetAdminCatalogModelArgType = { subdomain: string; id: number | string };

export type GetAdminCatalogGenerationsArgType = { subdomain: string; modelId: number | string };

export type GetAdminCatalogGenerationArgType = { subdomain: string; id: number | string };

export const catalogQueriesApi = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCatalogModels: builder.query<AdminListResponseType<AdminCatalogModelType>, GetAdminCatalogModelsArgType>({
      query: ({ subdomain }) => `/api/autobrands/${subdomain}/catalog/models`,
      transformResponse: (
        response:
          | { data: AdminListResponseType<AdminCatalogModelType> }
          | AdminListResponseType<AdminCatalogModelType>,
      ) => unwrapData(response),
      providesTags: (_result, _error, { subdomain }) => [{ type: 'adminCatalogModels', id: subdomain }],
    }),

    getAdminCatalogModel: builder.query<AdminCatalogModelType, GetAdminCatalogModelArgType>({
      query: ({ subdomain, id }) => `/api/autobrands/${subdomain}/catalog/models/${id}`,
      transformResponse: (response: { data: AdminCatalogModelType } | AdminCatalogModelType) => unwrapData(response),
      providesTags: (_result, _error, { id }) => [{ type: 'adminCatalogModels', id: `model-${id}` }],
    }),

    getAdminCatalogGenerations: builder.query<
      AdminListResponseType<AdminCatalogGenerationType>,
      GetAdminCatalogGenerationsArgType
    >({
      query: ({ subdomain, modelId }) => `/api/autobrands/${subdomain}/catalog/models/${modelId}/generations`,
      transformResponse: (
        response:
          | { data: AdminListResponseType<AdminCatalogGenerationType> }
          | AdminListResponseType<AdminCatalogGenerationType>,
      ) => unwrapData(response),
      providesTags: (_result, _error, { modelId }) => [{ type: 'adminCatalogGenerations', id: String(modelId) }],
    }),

    getAdminCatalogGeneration: builder.query<AdminCatalogGenerationType, GetAdminCatalogGenerationArgType>({
      query: ({ subdomain, id }) => `/api/autobrands/${subdomain}/catalog/generations/${id}`,
      transformResponse: (response: { data: AdminCatalogGenerationType } | AdminCatalogGenerationType) =>
        unwrapData(response),
      providesTags: (_result, _error, { id }) => [{ type: 'adminCatalogGenerations', id: `gen-${id}` }],
    }),
  }),
});

export const {
  useGetAdminCatalogModelsQuery,
  useGetAdminCatalogModelQuery,
  useGetAdminCatalogGenerationsQuery,
  useGetAdminCatalogGenerationQuery,
} = catalogQueriesApi;
