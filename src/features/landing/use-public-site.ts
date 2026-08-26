import { brand } from '@/lib/brand';
import { useGetPublicAutobrandQuery } from '@/lib/redux/api/landing-api/autobrand-api/autobrand-api-slice';

/**
 * The public brand payload from the RTK cache — SiteGate fetches it before the
 * landing paints, so consumers never see a loading state of their own.
 */
export default function usePublicSite() {
  const { data } = useGetPublicAutobrandQuery({ subdomain: brand.makeSlug });
  return data;
}
