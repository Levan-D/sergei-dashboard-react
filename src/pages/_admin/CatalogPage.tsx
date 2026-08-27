import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { showToast } from '@/lib/toast';
import { brand } from '@/lib/brand';
import { cn } from '@/lib/cn';
import { ROUTING } from '@/lib/routing';
import { setTab, setGenFilterModelId } from '@/features/_admin/catalog/catalogSlice';
import {
  useGetAdminCatalogModelsQuery,
  useGetAdminCatalogGenerationsQuery,
} from '@/lib/redux/api/admin-api/catalog/catalog-queries';
import {
  useSetAdminCatalogModelVisibilityMutation,
  useSetAdminCatalogGenerationVisibilityMutation,
} from '@/lib/redux/api/admin-api/catalog/catalog-mutations';
import type { AdminCatalogGenerationType, AdminCatalogModelType } from '@/lib/redux/api/admin-api/admin-types';
import Badge from '@/components/_admin/ui/Badge';
import Button from '@/components/_admin/ui/Button';
import Spinner from '@/components/_admin/ui/Spinner';
import ErrorState from '@/components/_admin/ui/ErrorState';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import Select from '@/components/_admin/forms/Select';
import Toggle from '@/components/_admin/forms/Toggle';
import Table from '@/components/_admin/ui/Table';
import { MutedCell, ActionsCell } from '@/components/_admin/table-cells';

const cardClass =
  'w-full cursor-pointer overflow-hidden rounded-el border border-line bg-surface-2 transition-colors hover:border-line-2';

const logbooksBadge = (count: number): 'green' | 'gray' => (count > 0 ? 'green' : 'gray');

const fmtYears = (years: string | null) => years ?? '—';

type ModelsTabProps = {
  models: AdminCatalogModelType[];
  generationsTotal: number;
};

function ModelsTab({ models, generationsTotal }: ModelsTabProps) {
  const navigate = useNavigate();
  const [setVisibility] = useSetAdminCatalogModelVisibilityMutation();

  const openModel = (id: number | null) => navigate(`${ROUTING.adminCatalogModel}${id ?? 'new'}`);

  const toggleVisible = (m: AdminCatalogModelType) => {
    setVisibility({ subdomain: brand.makeSlug, id: m.id, visible: !m.visible })
      .unwrap()
      .then(() => showToast('👁️ Visibility updated'))
      .catch(() => showToast('⚠️ Could not update visibility'));
  };

  return (
    <div>
      <SectionHeader
        title={`${brand.name} Models`}
        sub={`${models.length} models · ${generationsTotal} generations total`}
        right={
          <Button sm onClick={() => openModel(null)}>
            + Add Model
          </Button>
        }
      />
      <Table className="@max-mobile:hidden">
        <thead>
          <tr>
            <th>Model Name</th>
            <th>Years</th>
            <th>Generations</th>
            <th>Logbooks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={m.id} className="cursor-pointer" onClick={() => openModel(m.id)}>
              <td>
                <p className="text-[13.5px] font-semibold text-ink">{m.name}</p>
              </td>
              <MutedCell>{fmtYears(m.years)}</MutedCell>
              <td>{m.generations_count}</td>
              <td>
                <Badge color={logbooksBadge(m.logbooks_count)}>{m.logbooks_count}</Badge>
              </td>
              <ActionsCell>
                <Button
                  variant="ghost"
                  sm
                  onClick={(e) => {
                    e.stopPropagation();
                    openModel(m.id);
                  }}
                >
                  Edit
                </Button>
                <Toggle
                  on={m.visible}
                  title="Toggle visibility"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVisible(m);
                  }}
                />
              </ActionsCell>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="hidden flex-col gap-2 p-3 @max-mobile:flex">
        {models.map((m) => (
          <div key={m.id} onClick={() => openModel(m.id)} className={cardClass}>
            <div className="flex items-center gap-2.5 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-ink">{m.name}</p>
                <p className="text-[11px] text-ink-3">{fmtYears(m.years)}</p>
              </div>
              <Toggle
                on={m.visible}
                title="Toggle visibility"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVisible(m);
                }}
              />
            </div>
            <div className="flex items-center gap-2 border-t border-line px-3 py-2.5">
              <p className="text-[12px] text-ink-3">{m.generations_count} gens</p>
              <Badge color={logbooksBadge(m.logbooks_count)}>{m.logbooks_count}</Badge>
              <Button
                variant="ghost"
                sm
                className="ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  openModel(m.id);
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type GenerationRowsProps = {
  model: AdminCatalogModelType;
  generations: AdminCatalogGenerationType[];
};

function GenerationRows({ model, generations }: GenerationRowsProps) {
  const navigate = useNavigate();
  const [setVisibility] = useSetAdminCatalogGenerationVisibilityMutation();

  const openGen = (id: number | null) => navigate(`${ROUTING.adminCatalogGen}${id ?? 'new'}`);

  const toggleVisible = (g: AdminCatalogGenerationType) => {
    setVisibility({ subdomain: brand.makeSlug, id: g.id, modelId: model.id, visible: !g.visible })
      .unwrap()
      .then(() => showToast('👁️ Visibility updated'))
      .catch(() => showToast('⚠️ Could not update visibility'));
  };

  return (
    <div>
      <SectionHeader
        title={`${model.name} — Generations`}
        right={
          <Button sm onClick={() => openGen(null)}>
            + Add Generation
          </Button>
        }
      />
      <Table className="@max-mobile:hidden">
        <thead>
          <tr>
            <th>Generation</th>
            <th>Years</th>
            <th>Logbooks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {generations.map((g) => (
            <tr key={g.id} className="cursor-pointer" onClick={() => openGen(g.id)}>
              <td>
                <p className="text-[13.5px] font-semibold text-ink">{g.name}</p>
              </td>
              <MutedCell>{fmtYears(g.years)}</MutedCell>
              <td>
                <Badge color={logbooksBadge(g.logbooks_count)}>{g.logbooks_count}</Badge>
              </td>
              <ActionsCell>
                <Button
                  variant="ghost"
                  sm
                  onClick={(e) => {
                    e.stopPropagation();
                    openGen(g.id);
                  }}
                >
                  Edit
                </Button>
                <Toggle
                  on={g.visible}
                  title="Toggle visibility"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVisible(g);
                  }}
                />
              </ActionsCell>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="hidden flex-col gap-2 p-3 @max-mobile:flex">
        {generations.map((g) => (
          <div key={g.id} onClick={() => openGen(g.id)} className={cardClass}>
            <div className="flex items-center gap-2.5 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-ink">{g.name}</p>
                <p className="text-[11px] text-ink-3">{fmtYears(g.years)}</p>
              </div>
              <Toggle
                on={g.visible}
                title="Toggle visibility"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVisible(g);
                }}
              />
            </div>
            <div className="flex items-center gap-2 border-t border-line px-3 py-2.5">
              <Badge color={logbooksBadge(g.logbooks_count)}>{g.logbooks_count}</Badge>
              <Button
                variant="ghost"
                sm
                className="ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  openGen(g.id);
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type GenerationsTabProps = { models: AdminCatalogModelType[] };

function GenerationsTab({ models }: GenerationsTabProps) {
  const dispatch = useAppDispatch();
  const modelId = useAppSelector((s) => s.catalog.genFilterModelId);
  const model = models.find((m) => m.id === modelId) ?? null;

  const { data, isError, error, isFetching, refetch } = useGetAdminCatalogGenerationsQuery(
    { subdomain: brand.makeSlug, modelId: modelId ?? 0 },
    { skip: modelId == null },
  );

  const generations = data?.items ?? [];

  return (
    <div>
      <div className="flex items-center gap-3 border-t border-b border-line bg-surface-2 px-5 py-3 @mobile:gap-4 @mobile:py-4">
        <label className="whitespace-nowrap">Model</label>
        <Select
          className="max-w-[280px]"
          placeholder="— Select a model —"
          value={model?.name ?? ''}
          onChange={(name) => {
            const picked = models.find((m) => m.name === name);
            dispatch(setGenFilterModelId(picked?.id ?? null));
          }}
          options={models.map((m) => m.name)}
        />
        {model && data && (
          <Badge color="gray" className="whitespace-nowrap">
            {generations.length}{' '}
            <span className="@max-mobile:hidden">generation{generations.length !== 1 ? 's' : ''}</span>
            <span className="hidden @max-mobile:inline">gen{generations.length !== 1 ? 's' : ''}</span>
          </Badge>
        )}
      </div>

      {!model ? (
        <div className="px-5 py-12 text-center text-ink-3">
          <p className="mb-2 text-[32px] @mobile:mb-3">📋</p>
          <p className="mb-1 text-sm font-semibold text-ink-2">Select a model</p>
          <p className="text-[13px]">Choose a model above to view and manage its generations</p>
        </div>
      ) : isError && !data ? (
        <ErrorState error={error} isRetrying={isFetching} onRetry={refetch} />
      ) : !data ? (
        <Spinner className="py-10" />
      ) : (
        <GenerationRows model={model} generations={generations} />
      )}
    </div>
  );
}

export default function CatalogPage() {
  const dispatch = useAppDispatch();
  const tab = useAppSelector((s) => s.catalog.tab);
  const { data, isError, error, isFetching, refetch } = useGetAdminCatalogModelsQuery({ subdomain: brand.makeSlug });

  if (isError && !data) return <ErrorState error={error} isRetrying={isFetching} onRetry={refetch} />;
  if (!data) return <Spinner />;

  const models = data.items;
  const generationsTotal = models.reduce((sum, m) => sum + m.generations_count, 0);

  return (
    <div className="rounded-card border border-line bg-surface">
      <div className="flex gap-0.5 border-b border-line px-5 pt-3 @mobile:pt-4">
        {(['models', 'gen'] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => dispatch(setTab(t))}
            className={cn(
              'cursor-pointer border-b-2 px-3 py-2 text-left text-[13px] font-semibold transition-all @mobile:px-4',
              tab === t ? 'border-accent text-accent-light' : 'border-transparent text-ink-3 hover:text-ink',
            )}
          >
            {t === 'models' ? 'Models' : 'Generations'}
          </button>
        ))}
      </div>

      {tab === 'models' && <ModelsTab models={models} generationsTotal={generationsTotal} />}
      {tab === 'gen' && <GenerationsTab models={models} />}
    </div>
  );
}
