import { adminApiSlice } from '@/lib/redux/api/admin-api/admin-api-slice';
import {
  unwrapData,
  type AdminListResponseType,
  type AdminMediaKindType,
  type AdminMediaType,
} from '@/lib/redux/api/admin-api/admin-types';

/**
 * Brand media library (MOTORITY-4201). Files are uploaded through the existing
 * TUS flow first; this API only registers, lists and removes the resulting
 * FileInfo against the brand. Kinds are image, video and logo — there is no
 * font kind, so Brand Style's custom font upload has nowhere to go.
 *
 * Nothing here attaches an asset to a model or generation; 4200 does not
 * describe an image field on either.
 */
export type GetAdminMediaArgType = {
  subdomain: string;
  kind?: AdminMediaKindType;
};

export type RegisterAdminMediaArgType = {
  subdomain: string;
  file_id: string;
  kind?: AdminMediaKindType;
  name?: string;
};

export type DeleteAdminMediaArgType = {
  subdomain: string;
  id: number | string;
};

export const mediaApi = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminMedia: builder.query<AdminListResponseType<AdminMediaType>, GetAdminMediaArgType>({
      query: ({ subdomain, kind }) => `/api/autobrands/${subdomain}/media${kind ? `?kind=${kind}` : ''}`,
      transformResponse: (
        response:
          | { data: AdminListResponseType<AdminMediaType> | AdminMediaType[] }
          | AdminListResponseType<AdminMediaType>
          | AdminMediaType[],
      ) => {
        const unwrapped = unwrapData(response);
        return Array.isArray(unwrapped) ? { items: unwrapped } : unwrapped;
      },
      providesTags: (_result, _error, { subdomain, kind }) => [
        { type: 'adminMedia', id: `${subdomain}:${kind ?? 'all'}` },
      ],
    }),

    /**
     * Registers an already-uploaded FileInfo into the library. Same file twice
     * returns 409. The 201 body is a complete library entry, so instead of an
     * invalidate-and-refetch (which blanks the grid for a beat) it is unshifted
     * straight into the cached list — new files land at index 0, same as the
     * server orders them.
     */
    registerAdminMedia: builder.mutation<AdminMediaType, RegisterAdminMediaArgType>({
      query: ({ subdomain, ...body }) => ({
        url: `/api/autobrands/${subdomain}/media`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: AdminMediaType } | AdminMediaType) => unwrapData(response),
      async onQueryStarted({ subdomain }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          mediaApi.util.updateQueryData('getAdminMedia', { subdomain }, (draft) => {
            draft.items.unshift(data);
            if (typeof draft.count === 'number') draft.count += 1;
          }),
        );
      },
    }),

    deleteAdminMedia: builder.mutation<void, DeleteAdminMediaArgType>({
      query: ({ subdomain, id }) => ({
        url: `/api/autobrands/${subdomain}/media/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ subdomain, id }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          mediaApi.util.updateQueryData('getAdminMedia', { subdomain }, (draft) => {
            draft.items = draft.items.filter((item) => item.id !== id);
            if (typeof draft.count === 'number') draft.count -= 1;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const { useGetAdminMediaQuery, useRegisterAdminMediaMutation, useDeleteAdminMediaMutation } = mediaApi;
