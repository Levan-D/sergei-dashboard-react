/**
 * The swap point for admin catalog reads.
 *
 * MOTORITY-4200 says to reuse the public handbook endpoints, so today these are
 * straight re-exports of the public slice — same cache, no duplication.
 *
 * They are re-exported rather than consumed directly because the handbook
 * payload does not cover the admin screens: a model carries only
 * id/name/slug/type/info/about, with no years, no image and no counts, while a
 * generation does carry since/until, logo and bodies[]. If a brand-scoped read
 * endpoint arrives, only this file changes.
 *
 * Visibility is not in either payload — merge against hidden_model_ids /
 * hidden_generation_ids from getAdminSite.
 */
export {
  useGetCatalogModelsQuery as useGetAdminCatalogModelsQuery,
  useGetCatalogGenerationsQuery as useGetAdminCatalogGenerationsQuery,
} from '@/lib/redux/api/catalog-api/catalog-api-slice';

export type {
  CatalogModelItemType as AdminCatalogModelSourceType,
  CatalogGenerationType as AdminCatalogGenerationSourceType,
} from '@/lib/redux/api/catalog-api/catalog-api-slice';
