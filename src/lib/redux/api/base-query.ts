import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL ?? 'https://backend.motority.com';

/**
 * Dev token. Everything under /api/autobrands/* is staff-gated and there is no
 * login screen yet, so paste a bearer token here by hand. Remove this constant
 * and read from auth state once login lands.
 */
const AUTH_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3ODc1NjQyNTMsImV4cCI6MTc5MDE1NjI1Mywicm9sZXMiOlsiUk9MRV9NRU1CRVIiLCJST0xFX1VTRVIiXSwiaWQiOjIzNTUsIm1hdHJpeF9pZCI6IkBicnV0dXNicnV0dXNfMjM1NTp0ZXN0LmNoYXQubW90b3JpdHkuY29tIn0.Kg-9Ah_H5H0Ntbr8VwPHKLPJadiy8GPonRGuTL3NlOicL2hpScNL37ylLtp9HF4Ul3FrRt7CaedrsR2Z2m9hkgGHpBt3cVG6oZwWISVkmsoeYO2UR-mfAJolEBFbjWAx-6QcoNS8VC-fhnq_CI0sFY2-j-e8USbHIlsdRjTjrVLHSzu8n15x4yyHwAgFwKT29Ymn0B-SIGI816ahNVblppzsa8Ksk3OQNoe26cjJJ-HPX9owSsdgEXzn5_HExZjV35pIpK_guXLLwXh6qo-nTGMuhHK5AQCZ8oqOjjMVSKBAUKUPPhxLOfIjBPd0kxtLV1z5boiZVYte7GpDXdWhWS-BbUHJq8zJDtmChCtPqWg4o65ffDW9hy5wdKj-KlhSZJn6xQqu6w98QWAqsdV18pWLNTFhuj6cI_5XuPzGXGtmkYADmuDkIzXEX5FOEr-kgY7CjizdcKKgTxuq6sM3rXY9RWSqZMUEAFVYCmWX1wnCauJFXVhAttLa-_clfa2oSEt-fXe43rQXAiJtPKaj7tK6BK1_sunSZu2Y1dA4vG1R3qPyVndUmYoxgixmCnrrS-QIR2eKFA0e_0Cuh_GTESRNKjxMlgSorvf4I_0G2MJjlLMImBCRLbV5yckpQ4kSNHUTfHdPBFXULEa1TGLWana443hqktwcgJg81N2tz9M';

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
