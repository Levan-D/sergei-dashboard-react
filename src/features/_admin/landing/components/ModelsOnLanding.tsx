import { useNavigate } from 'react-router-dom';
import { showToast } from '@/lib/toast';
import { brand } from '@/lib/brand';
import { ROUTING } from '@/lib/routing';
import { useGetAdminCatalogModelsQuery } from '@/lib/redux/api/admin-api/catalog/catalog-queries';
import { useSetAdminCatalogModelVisibilityMutation } from '@/lib/redux/api/admin-api/catalog/catalog-mutations';
import type { AdminCatalogModelType } from '@/lib/redux/api/admin-api/admin-types';
import Badge from '@/components/_admin/ui/Badge';
import Button from '@/components/_admin/ui/Button';
import Spinner from '@/components/_admin/ui/Spinner';
import ErrorState from '@/components/_admin/ui/ErrorState';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import Toggle from '@/components/_admin/forms/Toggle';
import Table from '@/components/_admin/ui/Table';
import { ActionsCell } from '@/components/_admin/table-cells';

const logbooksBadge = (count: number): 'green' | 'gray' => (count > 0 ? 'green' : 'gray');

type BodyProps = { models: AdminCatalogModelType[] };

function ModelsOnLandingBody({ models }: BodyProps) {
  const navigate = useNavigate();
  const [setVisibility] = useSetAdminCatalogModelVisibilityMutation();

  const visibleCount = models.filter((m) => m.visible).length;

  const setVisible = (m: AdminCatalogModelType, visible: boolean) => {
    setVisibility({ subdomain: brand.makeSlug, id: m.id, visible })
      .unwrap()
      .then(() => showToast('👁️ Visibility updated'))
      .catch(() => showToast('⚠️ Could not update visibility'));
  };

  const openEditor = (id: number) => navigate(`${ROUTING.adminCatalogModel}${id}`);

  const actions = (
    <>
      <Button variant="ghost" sm onClick={() => navigate(ROUTING.adminCatalog)}>
        Manage in Catalog
      </Button>
      <Button sm onClick={() => navigate(`${ROUTING.adminCatalogModel}new`)}>
        + Add Model
      </Button>
    </>
  );

  return (
    <SectionCard>
      <SectionHeader
        title="Models on Landing"
        sub={`${visibleCount} model${visibleCount !== 1 ? 's' : ''} visible`}
        right={<div className="flex gap-1.5 @max-mobile:hidden">{actions}</div>}
      />
      <div className="hidden flex-wrap gap-1.5 border-b border-line px-5 py-3 @max-mobile:flex">{actions}</div>

      <Table className="@max-mobile:hidden">
        <thead>
          <tr>
            <th>Model</th>
            <th>Generations</th>
            <th>Logbooks</th>
            <th>Visible</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={m.id}>
              <td>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-10 shrink-0 items-center justify-center rounded-[5px] bg-surface-3 text-sm">
                    🚗
                  </div>
                  <div>
                    <p className="text-[13.5px] font-semibold text-ink">{m.name}</p>
                    <p className="text-[11px] text-ink-3">{m.years ?? '—'}</p>
                  </div>
                </div>
              </td>
              <td>{m.generations_count}</td>
              <td>
                <Badge color={logbooksBadge(m.logbooks_count)}>{m.logbooks_count}</Badge>
              </td>
              <td>
                <Toggle on={m.visible} onClick={() => setVisible(m, !m.visible)} />
              </td>
              <ActionsCell>
                <Button variant="ghost" sm onClick={() => openEditor(m.id)}>
                  Edit
                </Button>
                {m.visible ? (
                  <Button variant="danger" sm onClick={() => setVisible(m, false)}>
                    Hide
                  </Button>
                ) : (
                  <Button variant="secondary" sm onClick={() => setVisible(m, true)}>
                    Show
                  </Button>
                )}
              </ActionsCell>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="hidden flex-col gap-2 p-3 @max-mobile:flex">
        {models.map((m) => (
          <div key={m.id} className="w-full overflow-hidden rounded-el border border-line bg-surface-2">
            <div className="flex items-center gap-2.5 p-3">
              <div className="flex h-7 w-10 shrink-0 items-center justify-center rounded-[5px] bg-surface-3 text-sm">
                🚗
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-ink">{m.name}</p>
                <p className="text-[11px] text-ink-3">{m.years ?? '—'}</p>
              </div>
              <Toggle on={m.visible} title="Visible on landing" onClick={() => setVisible(m, !m.visible)} />
            </div>
            <div className="flex items-center gap-2 border-t border-line px-3 py-2.5">
              <p className="text-[12px] text-ink-3">{m.generations_count} gens</p>
              <Badge color={logbooksBadge(m.logbooks_count)}>{m.logbooks_count}</Badge>
              <div className="ml-auto flex gap-1.5">
                <Button variant="ghost" sm onClick={() => openEditor(m.id)}>
                  Edit
                </Button>
                {m.visible ? (
                  <Button variant="danger" sm onClick={() => setVisible(m, false)}>
                    Hide
                  </Button>
                ) : (
                  <Button variant="secondary" sm onClick={() => setVisible(m, true)}>
                    Show
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function ModelsOnLanding() {
  const { data, isError, error, isFetching, refetch } = useGetAdminCatalogModelsQuery({ subdomain: brand.makeSlug });

  if (isError && !data) return <ErrorState error={error} isRetrying={isFetching} onRetry={refetch} />;
  if (!data) return <Spinner />;
  return <ModelsOnLandingBody models={data.items} />;
}
