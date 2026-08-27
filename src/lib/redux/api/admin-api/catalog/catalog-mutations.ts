import { adminApiSlice } from '@/lib/redux/api/admin-api/admin-api-slice';
import { catalogQueriesApi } from '@/lib/redux/api/admin-api/catalog/catalog-queries';
import { siteQueriesApi } from '@/lib/redux/api/admin-api/site/site-queries';
import {
  unwrapData,
  type AdminCatalogGenerationType,
  type AdminCatalogModelType,
  type AdminEuroNcapType,
  type AdminInfoPairType,
} from '@/lib/redux/api/admin-api/admin-types';

/**
 * Brand catalog CRUD (MOTORITY-4200), all verified live 2026-08-26. Every
 * mutation patches the query caches directly instead of refetching, matching
 * the media/site pattern. Model `years` is computed from generations and is
 * not writable; generation `bodies` accepted no write shape we tried yet.
 */
export type CreateAdminCatalogModelArgType = {
  subdomain: string;
  name: string;
  about?: string | null;
  info?: AdminInfoPairType[];
};

export type UpdateAdminCatalogModelArgType = CreateAdminCatalogModelArgType & { id: number | string };

export type CreateAdminCatalogGenerationArgType = {
  subdomain: string;
  modelId: number | string;
  name: string;
  years?: string | null;
  about?: string | null;
  info?: AdminInfoPairType[];
  sort?: number | null;
  euro_ncap?: Partial<AdminEuroNcapType>;
};

export type UpdateAdminCatalogGenerationArgType = Omit<CreateAdminCatalogGenerationArgType, 'modelId'> & {
  id: number | string;
  modelId: number | string;
};

export type CatalogVisibilityArgType = { subdomain: string; id: number; visible: boolean };

export type CatalogGenerationVisibilityArgType = CatalogVisibilityArgType & { modelId: number | string };

export type DeleteAdminCatalogModelArgType = { subdomain: string; id: number };

export type DeleteAdminCatalogGenerationArgType = { subdomain: string; id: number; modelId: number | string };

const sortByName = <T extends { name: string }>(items: T[]) =>
  items.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

const setHiddenId = (list: number[] | null | undefined, id: number, hidden: boolean): number[] => {
  const next = (list ?? []).filter((x) => x !== id);
  if (hidden) next.push(id);
  return next;
};

export const catalogMutationsApi = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAdminCatalogModel: builder.mutation<AdminCatalogModelType, CreateAdminCatalogModelArgType>({
      query: ({ subdomain, ...body }) => ({
        url: `/api/autobrands/${subdomain}/catalog/models`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: AdminCatalogModelType } | AdminCatalogModelType) => unwrapData(response),
      async onQueryStarted({ subdomain }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          catalogQueriesApi.util.updateQueryData('getAdminCatalogModels', { subdomain }, (draft) => {
            draft.items.push(data);
            sortByName(draft.items);
            if (typeof draft.count === 'number') draft.count = draft.items.length;
          }),
        );
      },
    }),

    updateAdminCatalogModel: builder.mutation<AdminCatalogModelType, UpdateAdminCatalogModelArgType>({
      query: ({ subdomain, id, ...body }) => ({
        url: `/api/autobrands/${subdomain}/catalog/models/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: { data: AdminCatalogModelType } | AdminCatalogModelType) => unwrapData(response),
      async onQueryStarted({ subdomain, id }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          catalogQueriesApi.util.updateQueryData('getAdminCatalogModels', { subdomain }, (draft) => {
            const i = draft.items.findIndex((m) => m.id === data.id);
            if (i !== -1) draft.items[i] = data;
          }),
        );
        dispatch(catalogQueriesApi.util.updateQueryData('getAdminCatalogModel', { subdomain, id }, () => data));
      },
    }),

    createAdminCatalogGeneration: builder.mutation<AdminCatalogGenerationType, CreateAdminCatalogGenerationArgType>({
      query: ({ subdomain, modelId, ...body }) => ({
        url: `/api/autobrands/${subdomain}/catalog/models/${modelId}/generations`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: AdminCatalogGenerationType } | AdminCatalogGenerationType) =>
        unwrapData(response),
      async onQueryStarted({ subdomain, modelId }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          catalogQueriesApi.util.updateQueryData('getAdminCatalogGenerations', { subdomain, modelId }, (draft) => {
            draft.items.push(data);
            if (typeof draft.count === 'number') draft.count = draft.items.length;
          }),
        );
        dispatch(
          catalogQueriesApi.util.updateQueryData('getAdminCatalogModels', { subdomain }, (draft) => {
            const parent = draft.items.find((m) => m.id === data.model_id);
            if (parent) parent.generations_count += 1;
          }),
        );
      },
    }),

    updateAdminCatalogGeneration: builder.mutation<AdminCatalogGenerationType, UpdateAdminCatalogGenerationArgType>({
      query: ({ subdomain, id, modelId: _modelId, ...body }) => ({
        url: `/api/autobrands/${subdomain}/catalog/generations/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: { data: AdminCatalogGenerationType } | AdminCatalogGenerationType) =>
        unwrapData(response),
      async onQueryStarted({ subdomain, id, modelId }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          catalogQueriesApi.util.updateQueryData('getAdminCatalogGenerations', { subdomain, modelId }, (draft) => {
            const i = draft.items.findIndex((g) => g.id === data.id);
            if (i !== -1) draft.items[i] = data;
          }),
        );
        dispatch(catalogQueriesApi.util.updateQueryData('getAdminCatalogGeneration', { subdomain, id }, () => data));
      },
    }),

    /** Optimistic: the toggle flips instantly, the site's hidden_* mirror follows, both undo on error. */
    setAdminCatalogModelVisibility: builder.mutation<AdminCatalogModelType, CatalogVisibilityArgType>({
      query: ({ subdomain, id, visible }) => ({
        url: `/api/autobrands/${subdomain}/catalog/models/${id}/visibility`,
        method: 'PATCH',
        body: { visible },
      }),
      transformResponse: (response: { data: AdminCatalogModelType } | AdminCatalogModelType) => unwrapData(response),
      async onQueryStarted({ subdomain, id, visible }, { dispatch, queryFulfilled }) {
        const patches = [
          dispatch(
            catalogQueriesApi.util.updateQueryData('getAdminCatalogModels', { subdomain }, (draft) => {
              const m = draft.items.find((x) => x.id === id);
              if (m) m.visible = visible;
            }),
          ),
          dispatch(
            siteQueriesApi.util.updateQueryData('getAdminSite', { subdomain }, (draft) => {
              draft.hidden_model_ids = setHiddenId(draft.hidden_model_ids, id, !visible);
            }),
          ),
        ];
        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
    }),

    setAdminCatalogGenerationVisibility: builder.mutation<
      AdminCatalogGenerationType,
      CatalogGenerationVisibilityArgType
    >({
      query: ({ subdomain, id, visible }) => ({
        url: `/api/autobrands/${subdomain}/catalog/generations/${id}/visibility`,
        method: 'PATCH',
        body: { visible },
      }),
      transformResponse: (response: { data: AdminCatalogGenerationType } | AdminCatalogGenerationType) =>
        unwrapData(response),
      async onQueryStarted({ subdomain, id, modelId, visible }, { dispatch, queryFulfilled }) {
        const patches = [
          dispatch(
            catalogQueriesApi.util.updateQueryData('getAdminCatalogGenerations', { subdomain, modelId }, (draft) => {
              const g = draft.items.find((x) => x.id === id);
              if (g) g.visible = visible;
            }),
          ),
          dispatch(
            siteQueriesApi.util.updateQueryData('getAdminSite', { subdomain }, (draft) => {
              draft.hidden_generation_ids = setHiddenId(draft.hidden_generation_ids, id, !visible);
            }),
          ),
        ];
        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
    }),

    /** 409 when the model still has logbooks — surfaced to the caller, cache rolls back. */
    deleteAdminCatalogModel: builder.mutation<void, DeleteAdminCatalogModelArgType>({
      query: ({ subdomain, id }) => ({
        url: `/api/autobrands/${subdomain}/catalog/models/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ subdomain, id }, { dispatch, queryFulfilled }) {
        const patches = [
          dispatch(
            catalogQueriesApi.util.updateQueryData('getAdminCatalogModels', { subdomain }, (draft) => {
              draft.items = draft.items.filter((m) => m.id !== id);
              if (typeof draft.count === 'number') draft.count = draft.items.length;
            }),
          ),
          dispatch(
            siteQueriesApi.util.updateQueryData('getAdminSite', { subdomain }, (draft) => {
              draft.hidden_model_ids = setHiddenId(draft.hidden_model_ids, id, false);
            }),
          ),
        ];
        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
    }),

    deleteAdminCatalogGeneration: builder.mutation<void, DeleteAdminCatalogGenerationArgType>({
      query: ({ subdomain, id }) => ({
        url: `/api/autobrands/${subdomain}/catalog/generations/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ subdomain, id, modelId }, { dispatch, queryFulfilled }) {
        const patches = [
          dispatch(
            catalogQueriesApi.util.updateQueryData('getAdminCatalogGenerations', { subdomain, modelId }, (draft) => {
              draft.items = draft.items.filter((g) => g.id !== id);
              if (typeof draft.count === 'number') draft.count = draft.items.length;
            }),
          ),
          dispatch(
            catalogQueriesApi.util.updateQueryData('getAdminCatalogModels', { subdomain }, (draft) => {
              const parent = draft.items.find((m) => m.id === Number(modelId));
              if (parent && parent.generations_count > 0) parent.generations_count -= 1;
            }),
          ),
          dispatch(
            siteQueriesApi.util.updateQueryData('getAdminSite', { subdomain }, (draft) => {
              draft.hidden_generation_ids = setHiddenId(draft.hidden_generation_ids, id, false);
            }),
          ),
        ];
        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
    }),
  }),
});

export const {
  useCreateAdminCatalogModelMutation,
  useUpdateAdminCatalogModelMutation,
  useCreateAdminCatalogGenerationMutation,
  useUpdateAdminCatalogGenerationMutation,
  useSetAdminCatalogModelVisibilityMutation,
  useSetAdminCatalogGenerationVisibilityMutation,
  useDeleteAdminCatalogModelMutation,
  useDeleteAdminCatalogGenerationMutation,
} = catalogMutationsApi;
