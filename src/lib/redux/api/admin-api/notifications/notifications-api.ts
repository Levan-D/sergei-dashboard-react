import { adminApiSlice } from '@/lib/redux/api/admin-api/admin-api-slice';
import { unwrapData } from '@/lib/redux/api/admin-api/admin-types';

export type AdminNotificationType = {
  id: number;
  type: string;
  surface: string;
  surface_label: string;
  title: string;
  body: string;
  meta: string;
  read: boolean;
  payload: Record<string, unknown> | unknown[];
  created_at: string;
};

export type AdminNotificationsResponseType = {
  items: AdminNotificationType[];
  count: number;
  unread_count: number;
};

export type GetAdminNotificationsArgType = { subdomain: string };

export type SendAdminNotificationArgType = {
  subdomain: string;
  title: string;
  body: string;
};

export type ReadAdminNotificationArgType = {
  subdomain: string;
  id: number | string;
};

export type ReadAllAdminNotificationsArgType = { subdomain: string };

/**
 * Brand admin inbox (MOTORITY-4202) — separate from FCM push and from the
 * app's /api/v2/me/interactions feed. Read state is per user, and unread_count
 * drives both the sidebar badge and the Dashboard card.
 *
 * The backend also writes entries here itself: creating a model or generation,
 * and saving hero or style, each add a card. `payload` is a keyed object when
 * present and an empty array when not.
 *
 * Verified 2026-08-21: the list endpoint ignores page / per-page / limit and
 * always returns everything — server-side pagination does not exist yet.
 */
export const notificationsApi = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNotifications: builder.query<AdminNotificationsResponseType, GetAdminNotificationsArgType>({
      query: ({ subdomain }) => `/api/autobrands/${subdomain}/notifications`,
      transformResponse: (response: { data: AdminNotificationsResponseType } | AdminNotificationsResponseType) =>
        unwrapData(response),
      providesTags: (_result, _error, { subdomain }) => [{ type: 'adminNotifications', id: subdomain }],
    }),

    sendAdminNotification: builder.mutation<AdminNotificationType, SendAdminNotificationArgType>({
      query: ({ subdomain, ...body }) => ({
        url: `/api/autobrands/${subdomain}/notifications`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: AdminNotificationType } | AdminNotificationType) => unwrapData(response),
    }),

    readAdminNotification: builder.mutation<void, ReadAdminNotificationArgType>({
      query: ({ subdomain, id }) => ({
        url: `/api/autobrands/${subdomain}/notifications/${id}/read`,
        method: 'POST',
      }),
    }),

    readAllAdminNotifications: builder.mutation<void, ReadAllAdminNotificationsArgType>({
      query: ({ subdomain }) => ({
        url: `/api/autobrands/${subdomain}/notifications/read-all`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetAdminNotificationsQuery,
  useSendAdminNotificationMutation,
  useReadAdminNotificationMutation,
  useReadAllAdminNotificationsMutation,
} = notificationsApi;
