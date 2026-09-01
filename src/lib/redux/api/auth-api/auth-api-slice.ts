import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { LoginResponseType } from '@/lib/auth/session';

const baseUrl = import.meta.env.VITE_API_URL ?? 'https://backend.motority.com';

export type LoginArgType = {
  username: string;
  password: string;
};

/**
 * Login is public and must not carry a bearer, so this slice uses a plain
 * fetchBaseQuery rather than the shared one with its refresh-and-retry wrapper.
 * Sending a stale token here would also be pointless: the whole reason we are
 * on this screen is that there is no usable session.
 *
 * The field name on the wire is `username`, not `email` (verified live: sending
 * `email` answers `The key "username" must be provided`). It accepts either a
 * username or an email address as the value.
 */
export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('Accept-Language', 'en');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponseType, LoginArgType>({
      query: (body) => ({
        url: '/api/public/login',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;

/**
 * Pull a usable message out of a failed login. The backend returns
 * `{code, message, errors}` where `errors` is keyed by field, and the HTTP
 * status does not always agree with the body's `code`, so the body wins.
 */
export function loginErrorMessage(error: unknown): string {
  const data = (error as { data?: { message?: string; errors?: unknown } })?.data;
  const errors = data?.errors;

  if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
    const first = Object.values(errors as Record<string, unknown>)[0];
    if (typeof first === 'string') return first;
    // Some endpoints nest as [{ message }] instead of a plain string.
    if (Array.isArray(first) && typeof first[0] === 'string') return first[0];
    if (Array.isArray(first) && typeof (first[0] as { message?: string })?.message === 'string') {
      return (first[0] as { message: string }).message;
    }
  }

  const status = (error as { status?: number })?.status;
  if (status === 401) return 'Incorrect username or password';
  if (typeof data?.message === 'string' && data.message !== 'Fields validation error') return data.message;
  return 'Could not sign in, please try again';
}
