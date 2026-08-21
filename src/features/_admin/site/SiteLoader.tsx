import { brand } from '@/lib/brand';
import { useGetAdminSiteQuery } from '@/lib/redux/api/admin-api/site/site-queries';
import type { AutobrandSiteType } from '@/lib/redux/api/admin-api/admin-types';
import Spinner from '@/components/_admin/ui/Spinner';
import ErrorState from '@/components/_admin/ui/ErrorState';

type Props = {
  children: (site: AutobrandSiteType) => React.ReactNode;
  silent?: boolean;
};

/**
 * Fetches the brand CMS payload and hands it to its child.
 *
 * `silent` renders nothing while loading or on error, for secondary sections on a
 * page where another SiteLoader already shows both. They share one cache entry, so
 * this is presentation only, not an extra request.
 */
export default function SiteLoader({ children, silent }: Props) {
  const { data: site, isError, error, isFetching, refetch } = useGetAdminSiteQuery({ subdomain: brand.makeSlug });

  if (isError && !site) {
    if (silent) return null;
    return <ErrorState error={error} isRetrying={isFetching} onRetry={refetch} />;
  }

  if (!site) return silent ? null : <Spinner />;
  return <>{children(site)}</>;
}
