import { adminApiSlice } from '@/lib/redux/api/admin-api/admin-api-slice';
import {
  unwrapData,
  type AutobrandBrandStyleType,
  type AutobrandCommunityType,
  type AutobrandFactType,
  type AutobrandFiltersType,
  type AutobrandHeroType,
  type AutobrandSettingsType,
  type AutobrandSiteType,
} from '@/lib/redux/api/admin-api/admin-types';

type SubdomainArgType = { subdomain: string };

export type UpdateAdminHeroArgType = SubdomainArgType & { hero: AutobrandHeroType };

export type UpdateAdminAboutArgType = SubdomainArgType & {
  about?: string | null;
  facts?: AutobrandFactType[];
};

export type UpdateAdminFiltersArgType = SubdomainArgType & { filters: AutobrandFiltersType };

export type UpdateAdminModelVisibilityArgType = SubdomainArgType & {
  hidden_model_ids?: number[];
  hidden_generation_ids?: number[];
};

export type UpdateAdminBrandStyleArgType = SubdomainArgType & { brand_style: AutobrandBrandStyleType };

export type UpdateAdminCommunityArgType = SubdomainArgType & { community: AutobrandCommunityType };

export type UpdateAdminSettingsArgType = SubdomainArgType & AutobrandSettingsType;

type SiteResponseType = { data: AutobrandSiteType } | AutobrandSiteType;

/**
 * Every mutation below hits the same PUT /api/autobrands/{subdomain} with a
 * partial body. The backend exposes one write for the whole CMS payload
 * (MOTORITY-4193, 4196, 4197, 4198, 4204) — these are per-screen wrappers so a
 * Save button only sends the block it owns.
 */
const putSite = (subdomain: string, body: Record<string, unknown>) => ({
  url: `/api/autobrands/${subdomain}`,
  method: 'PUT',
  body,
});

export const siteMutationsApi = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /** Landing Page → Hero Block save. Photo/video/carousel, H1/H2, both CTAs. MOTORITY-4196 */
    updateAdminHero: builder.mutation<AutobrandSiteType, UpdateAdminHeroArgType>({
      query: ({ subdomain, hero }) => putSite(subdomain, { hero }),
      transformResponse: (response: SiteResponseType) => unwrapData(response),
    }),

    /**
     * Landing Page → Second Screen save. Writes through to the catalog Make
     * (makes.about / makes.info), so this also changes what the Motority app
     * shows for this brand. There is no landing-only override. MOTORITY-4197
     */
    updateAdminAbout: builder.mutation<AutobrandSiteType, UpdateAdminAboutArgType>({
      query: ({ subdomain, about, facts }) => putSite(subdomain, { about, facts }),
      transformResponse: (response: SiteResponseType) => unwrapData(response),
    }),

    /**
     * Landing Page → Filters Configuration save. This is chip *visibility*
     * only — it does not filter anything server-side. MOTORITY-4196
     */
    updateAdminFilters: builder.mutation<AutobrandSiteType, UpdateAdminFiltersArgType>({
      query: ({ subdomain, filters }) => putSite(subdomain, { filters }),
      transformResponse: (response: SiteResponseType) => unwrapData(response),
    }),

    /**
     * Show/hide toggles in Models on Landing and Cars Catalog.
     * Visibility is not a field on a model — it is an id list on the site
     * payload, so the catalog list has to be merged against these arrays.
     * Send the full replacement array, not a delta. MOTORITY-4196, 4200
     */
    updateAdminModelVisibility: builder.mutation<AutobrandSiteType, UpdateAdminModelVisibilityArgType>({
      query: ({ subdomain, hidden_model_ids, hidden_generation_ids }) =>
        putSite(subdomain, { hidden_model_ids, hidden_generation_ids }),
      transformResponse: (response: SiteResponseType) => unwrapData(response),
    }),

    /** Brand Style — logo, favicon, the four colors, selected font. MOTORITY-4198 */
    updateAdminBrandStyle: builder.mutation<AutobrandSiteType, UpdateAdminBrandStyleArgType>({
      query: ({ subdomain, brand_style }) => putSite(subdomain, { brand_style }),
      transformResponse: (response: SiteResponseType) => unwrapData(response),
    }),

    /**
     * Community → Community Block Settings. Covers the Real Owners block only;
     * Owners' Stories has no admin counterpart. Join-the-community resolves to
     * the brand's vendor Channel. MOTORITY-4198
     */
    updateAdminCommunity: builder.mutation<AutobrandSiteType, UpdateAdminCommunityArgType>({
      query: ({ subdomain, community }) => putSite(subdomain, { community }),
      transformResponse: (response: SiteResponseType) => unwrapData(response),
    }),

    /**
     * General Settings — brand_name (writes Make.name), contact_email,
     * default_locale, maintenance, enabled. The subdomain is bound to
     * Make.slug and is not editable here. MOTORITY-4204
     */
    updateAdminSettings: builder.mutation<AutobrandSiteType, UpdateAdminSettingsArgType>({
      query: ({ subdomain, ...settings }) => putSite(subdomain, settings),
      transformResponse: (response: SiteResponseType) => unwrapData(response),
    }),
  }),
});

export const {
  useUpdateAdminHeroMutation,
  useUpdateAdminAboutMutation,
  useUpdateAdminFiltersMutation,
  useUpdateAdminModelVisibilityMutation,
  useUpdateAdminBrandStyleMutation,
  useUpdateAdminCommunityMutation,
  useUpdateAdminSettingsMutation,
} = siteMutationsApi;
