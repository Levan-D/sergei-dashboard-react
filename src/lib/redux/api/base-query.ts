import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL ?? 'https://backend.motority.com';

/**
 * Dev token. Everything under /api/autobrands/* is staff-gated and there is no
 * login screen yet, so paste a bearer token here by hand. Remove this constant
 * and read from auth state once login lands.
 */
const AUTH_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3ODQ3OTE2ODcsImV4cCI6MTc4NzM4MzY4Nywicm9sZXMiOlsiUk9MRV9NRU1CRVIiLCJST0xFX1VTRVIiXSwiaWQiOjIzNTUsIm1hdHJpeF9pZCI6IkBicnV0dXNicnV0dXNfMjM1NTp0ZXN0LmNoYXQubW90b3JpdHkuY29tIn0.fSu_MSSaeYPdieijEDD6pCV2hL3T0P2Ow_5W8zNwruYKpjM2sVJaD8uNXztd2oEq4Jk4oQ-Jll0_8J4LJEod4GXDV5olEJuwuejVyZzHrtp-foZZYUqR41-9A63BlxhAEXd9QCVEN99K1LqXnIqHeiTuF0_QPqFjoKVaL3enoeInEZzMCG3IUgnszSkeh6c0x1Mut_fYJOsubL_ygbZbZukK9efMyc0Y8y7lX-rqIGsiKOcv5YDsqzBxxXefx0dpOlD2DYXl2PDsDWQ-ZIhwZNxdMMOFjV4Za1Cb-qQcmfXvxdzrbD6qNQPOKFIWnjVRLQcD6y_uEW64L-wSsDtRefrEj0A-RyTotyjw-XFc_WPvx9674iX_WkjzFQigIUok9qW1QUOb5PwLvqoWzd5AgnV-T7rUC6HrNG6gV8YL_hjy0OBLCUu_Bg5S9j4wK1NHSYgIu7Wi_FkFWjc5TLYIce7h14W7bSaG6AosF_79Zz9dOdIILpW3BzvpU12INwN-emkXGHD8erpGcc4bmtZOH5pWFWxmbJ4L6WMszHfIJ-4xBStesCmgLOJ_wtP146cT_A0_-8IKUB31obVn1-CTqwn0TsA29Uo6W_xvogSEd_FroEXNRtyCjACldgkGjXKgBpmbnls6MJhPsJueR6FQoP_Mqf-2f2ug2SmTUco12iw';

export const authHeaders = () => {
  const headers: Record<string, string> = { 'Accept-Language': 'en' };
  if (AUTH_TOKEN) headers.Authorization = `Bearer ${AUTH_TOKEN}`;
  return headers;
};

export const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    for (const [key, value] of Object.entries(authHeaders())) headers.set(key, value);
    return headers;
  },
});
