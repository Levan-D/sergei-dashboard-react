import { adminApiSlice } from '@/lib/redux/api/admin-api/admin-api-slice';
import {
  unwrapData,
  type AdminListResponseType,
  type AdminNotificationType,
} from '@/lib/redux/api/admin-api/admin-types';

export type AdminNotificationsResponseType = AdminListResponseType<AdminNotificationType> & {
  unread_count?: number;
};

/**
 * Brand admin inbox (MOTORITY-4202) — separate from FCM push and from the
 * app's /api/v2/me/interactions feed. Read state is per user, and unread_count
 * drives both the sidebar badge and the Dashboard card.
 *
 * The backend also writes entries here itself: creating a model or generation,
 * and saving hero or style, each add a card. There are no notification
 * settings — Settings has none in the mock either.
 */
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
