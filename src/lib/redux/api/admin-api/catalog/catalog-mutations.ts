import { adminApiSlice } from '@/lib/redux/api/admin-api/admin-api-slice';
import {
  unwrapData,
  type AdminCatalogGenerationType,
  type AdminCatalogModelType,
} from '@/lib/redux/api/admin-api/admin-types';

/**
 * Only the two writes MOTORITY-4200 actually documents.
 *
 * Edit, visibility-PATCH and delete are described as "CRUD" in the ticket but no
 * path or field list was given, so they are deliberately absent rather than
 * guessed. Visibility today goes through updateAdminModelVisibility on the site
 * payload. Deletion is rejected by the backend when the model has logbooks.
 */
export type CreateAdminCatalogModelArgType = {
  subdomain: string;
  name: string;
  years?: string;
};

export type CreateAdminCatalogGenerationArgType = {
  subdomain: string;
  modelId: number | string;
  name: string;
  years?: string;
};

export const catalogMutationsApi = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /** Cars Catalog → + Add Model. Body shape unverified beyond name/years. */
    createAdminCatalogModel: builder.mutation<AdminCatalogModelType, CreateAdminCatalogModelArgType>({
      query: ({ subdomain, ...body }) => ({
        url: `/api/autobrands/${subdomain}/catalog/models`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: AdminCatalogModelType } | AdminCatalogModelType) => unwrapData(response),
    }),

    /** Cars Catalog → + Add Generation. Years is the one field the ticket confirms. */
    createAdminCatalogGeneration: builder.mutation<AdminCatalogGenerationType, CreateAdminCatalogGenerationArgType>({
      query: ({ subdomain, modelId, ...body }) => ({
        url: `/api/autobrands/${subdomain}/catalog/models/${modelId}/generations`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: AdminCatalogGenerationType } | AdminCatalogGenerationType) =>
        unwrapData(response),
    }),
  }),
});

export const { useCreateAdminCatalogModelMutation, useCreateAdminCatalogGenerationMutation } = catalogMutationsApi;
