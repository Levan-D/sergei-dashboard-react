import { brand } from '@/lib/brand';
import { useGetAdminMediaQuery } from '@/lib/redux/api/admin-api/media/media-api';
import Spinner from '@/components/_admin/ui/Spinner';
import ErrorState from '@/components/_admin/ui/ErrorState';
import MediaLibrary from '@/features/_admin/media/MediaLibrary';

export default function MediaPage() {
  const { data, isError, error, isFetching, refetch } = useGetAdminMediaQuery({ subdomain: brand.makeSlug });

  if (isError && !data) return <ErrorState error={error} isRetrying={isFetching} onRetry={refetch} />;
  if (!data) return <Spinner />;
  return <MediaLibrary items={data.items ?? []} />;
}
