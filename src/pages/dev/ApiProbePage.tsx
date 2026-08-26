import { useState } from 'react';
import { useAppDispatch, type AppDispatch } from '@/store';
import { cn } from '@/lib/cn';
import { siteQueriesApi } from '@/lib/redux/api/admin-api/site/site-queries';
import { staffApi } from '@/lib/redux/api/admin-api/staff/staff-api';
import { mediaApi } from '@/lib/redux/api/admin-api/media/media-api';
import { notificationsApi } from '@/lib/redux/api/admin-api/notifications/notifications-api';
import { historyApi } from '@/lib/redux/api/admin-api/history/history-api';
import { autobrandApiSlice } from '@/lib/redux/api/landing-api/autobrand-api/autobrand-api-slice';
import { catalogApiSlice } from '@/lib/redux/api/landing-api/catalog-api/catalog-api-slice';
import Button from '@/components/_admin/ui/Button';
import Badge from '@/components/_admin/ui/Badge';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Input from '@/components/_admin/forms/Input';

type CtxType = {
  subdomain: string;
  make: string;
  model: string;
  generation: string;
  host: string;
};

type ProbeStatusType = 'idle' | 'loading' | 'ok' | 'error';

type ProbeResultType = {
  status: ProbeStatusType;
  data?: unknown;
  error?: unknown;
  ms?: number;
};

type ProbeType = {
  id: string;
  group: string;
  path: (c: CtxType) => string;
  run: (c: CtxType, dispatch: AppDispatch) => Promise<unknown>;
};

type FireableType<T> = { unwrap: () => Promise<T>; unsubscribe: () => void };

const fire = async <T,>(p: FireableType<T>): Promise<T> => {
  try {
    return await p.unwrap();
  } finally {
    p.unsubscribe();
  }
};

const force = { forceRefetch: true } as const;

const PROBES: ProbeType[] = [
  {
    id: 'getAdminMe',
    group: 'Admin — session',
    path: () => '/api/autobrands/me',
    run: (_c, d) => fire(d(siteQueriesApi.endpoints.getAdminMe.initiate(undefined, force))),
  },
  {
    id: 'getAdminSite',
    group: 'Admin — CMS',
    path: (c) => `/api/autobrands/${c.subdomain}`,
    run: (c, d) => fire(d(siteQueriesApi.endpoints.getAdminSite.initiate({ subdomain: c.subdomain }, force))),
  },
  {
    id: 'getAdminStaff',
    group: 'Admin — staff',
    path: (c) => `/api/autobrands/${c.subdomain}/staff`,
    run: (c, d) => fire(d(staffApi.endpoints.getAdminStaff.initiate({ subdomain: c.subdomain }, force))),
  },
  {
    id: 'getAdminMedia',
    group: 'Admin — media',
    path: (c) => `/api/autobrands/${c.subdomain}/media`,
    run: (c, d) => fire(d(mediaApi.endpoints.getAdminMedia.initiate({ subdomain: c.subdomain }, force))),
  },
  {
    id: 'getAdminMediaImages',
    group: 'Admin — media',
    path: (c) => `/api/autobrands/${c.subdomain}/media?kind=image`,
    run: (c, d) => fire(d(mediaApi.endpoints.getAdminMedia.initiate({ subdomain: c.subdomain, kind: 'image' }, force))),
  },
  {
    id: 'getAdminNotifications',
    group: 'Admin — notifications',
    path: (c) => `/api/autobrands/${c.subdomain}/notifications`,
    run: (c, d) =>
      fire(d(notificationsApi.endpoints.getAdminNotifications.initiate({ subdomain: c.subdomain }, force))),
  },
  {
    id: 'getAdminHistory',
    group: 'Admin — history',
    path: (c) => `/api/autobrands/${c.subdomain}/history`,
    run: (c, d) => fire(d(historyApi.endpoints.getAdminHistory.initiate({ subdomain: c.subdomain }, force))),
  },
  {
    id: 'getPublicAutobrand',
    group: 'Public — autobrand',
    path: (c) => `/api/v3/public/autobrands/${c.subdomain}`,
    run: (c, d) => fire(d(autobrandApiSlice.endpoints.getPublicAutobrand.initiate({ subdomain: c.subdomain }, force))),
  },
  {
    id: 'resolveAutobrandHost',
    group: 'Public — autobrand',
    path: (c) => `/api/v3/public/autobrands/resolve?host=${c.host}`,
    run: (c, d) => fire(d(autobrandApiSlice.endpoints.resolveAutobrandHost.initiate({ host: c.host }, force))),
  },
  {
    id: 'getCatalogMakes',
    group: 'Public — handbook',
    path: () => '/api/v3/public/catalog/handbook/makes',
    run: (_c, d) => fire(d(catalogApiSlice.endpoints.getCatalogMakes.initiate({ type: 'car', page: 1 }, force))),
  },
  {
    id: 'getCatalogModels',
    group: 'Public — handbook',
    path: (c) => `/api/v2/public/catalog/handbook/makes/${c.make}/models`,
    run: (c, d) => fire(d(catalogApiSlice.endpoints.getCatalogModels.initiate({ type: 'car', make: c.make }, force))),
  },
  {
    id: 'getCatalogGenerations',
    group: 'Public — handbook',
    path: (c) => `/api/v2/public/catalog/handbook/makes/${c.make}/models/${c.model}/generations`,
    run: (c, d) =>
      fire(
        d(
          catalogApiSlice.endpoints.getCatalogGenerations.initiate(
            { type: 'car', make: c.make, model: c.model },
            force,
          ),
        ),
      ),
  },
  {
    id: 'getTopLogbooks',
    group: 'Public — community',
    path: (c) => `/api/v2/public/catalog/logbooks/authors?make-slug=${c.make}`,
    run: (c, d) =>
      fire(d(catalogApiSlice.endpoints.getTopLogbooks.initiate({ type: 'car', make: c.make, perPage: 3 }, force))),
  },
  {
    id: 'getCatalogLogbookPosts',
    group: 'Public — community',
    path: (c) => `/api/v2/public/catalog/logbooks/posts?make-slug=${c.make}`,
    run: (c, d) =>
      fire(
        d(catalogApiSlice.endpoints.getCatalogLogbookPosts.initiate({ type: 'car', make: c.make, perPage: 3 }, force)),
      ),
  },
];

const GROUPS = [...new Set(PROBES.map((p) => p.group))];

const badgeFor = (status: ProbeStatusType) => {
  if (status === 'ok') return 'green' as const;
  if (status === 'error') return 'red' as const;
  if (status === 'loading') return 'yellow' as const;
  return 'gray' as const;
};

export default function ApiProbePage() {
  const dispatch = useAppDispatch();
  const [ctx, setCtx] = useState<CtxType>({
    subdomain: 'bmw',
    make: 'bmw',
    model: 'm4',
    generation: 'g82',
    host: 'bmw.motority.com',
  });
  const [results, setResults] = useState<Record<string, ProbeResultType>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const patchCtx = (patch: Partial<CtxType>) => setCtx((c) => ({ ...c, ...patch }));

  const runProbe = async (probe: ProbeType) => {
    setSelected(probe.id);
    setResults((r) => ({ ...r, [probe.id]: { status: 'loading' } }));
    const started = performance.now();
    try {
      const data = await probe.run(ctx, dispatch);
      setResults((r) => ({
        ...r,
        [probe.id]: { status: 'ok', data, ms: Math.round(performance.now() - started) },
      }));
    } catch (error) {
      setResults((r) => ({
        ...r,
        [probe.id]: { status: 'error', error, ms: Math.round(performance.now() - started) },
      }));
    }
  };

  const runAll = async () => {
    for (const probe of PROBES) await runProbe(probe);
  };

  const copy = (label: string, value: unknown) => {
    navigator.clipboard.writeText(JSON.stringify(value, null, 2));
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1200);
  };

  const copyAll = () => {
    const payload = PROBES.reduce<Record<string, unknown>>((acc, p) => {
      const result = results[p.id];
      if (!result || result.status === 'idle' || result.status === 'loading') return acc;
      acc[p.id] = {
        path: p.path(ctx),
        status: result.status,
        ...(result.status === 'ok' ? { data: result.data } : { error: result.error }),
      };
      return acc;
    }, {});
    copy('all', payload);
  };

  const active = selected ? results[selected] : undefined;
  const activeProbe = PROBES.find((p) => p.id === selected);
  const doneCount = PROBES.filter((p) => {
    const s = results[p.id]?.status;
    return s === 'ok' || s === 'error';
  }).length;

  return (
    <div className="admin min-h-dvh bg-bg p-4 text-ink md:p-6">
      <SectionCard>
        <SectionHeader
          title="API probe"
          sub="Fire every read endpoint and copy the raw payloads"
          right={
            <div className="flex flex-wrap gap-1.5">
              <Button variant="ghost" sm onClick={copyAll}>
                {copied === 'all' ? 'Copied' : `Copy all (${doneCount})`}
              </Button>
              <Button sm onClick={runAll}>
                Run all
              </Button>
            </div>
          }
        />
        <div className="flex flex-col gap-3 border-b border-line p-5">
          <div className="flex flex-wrap gap-3">
            <FormGroup half label="Subdomain">
              <Input type="text" value={ctx.subdomain} onChange={(e) => patchCtx({ subdomain: e.target.value })} />
            </FormGroup>
            <FormGroup half label="Host">
              <Input type="text" value={ctx.host} onChange={(e) => patchCtx({ host: e.target.value })} />
            </FormGroup>
            <FormGroup half label="Make slug">
              <Input type="text" value={ctx.make} onChange={(e) => patchCtx({ make: e.target.value })} />
            </FormGroup>
            <FormGroup half label="Model slug">
              <Input type="text" value={ctx.model} onChange={(e) => patchCtx({ model: e.target.value })} />
            </FormGroup>
          </div>
        </div>
      </SectionCard>

      <div className="flex items-start gap-4 @max-mobile:flex-col">
        <div className="w-[380px] shrink-0 @max-mobile:w-full">
          {GROUPS.map((group) => (
            <SectionCard key={group}>
              <SectionHeader compact title={group} />
              <div className="flex flex-col">
                {PROBES.filter((p) => p.group === group).map((probe) => {
                  const result = results[probe.id];
                  const status = result?.status ?? 'idle';
                  return (
                    <button
                      key={probe.id}
                      type="button"
                      onClick={() => runProbe(probe)}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 border-b border-line px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-surface-2',
                        selected === probe.id && 'bg-accent-bg',
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-ink">{probe.id}</span>
                        <span className="block truncate font-mono text-[10px] text-ink-3">{probe.path(ctx)}</span>
                      </span>
                      {result?.ms !== undefined && (
                        <span className="shrink-0 font-mono text-[10px] text-ink-3">{result.ms}ms</span>
                      )}
                      <Badge color={badgeFor(status)}>{status}</Badge>
                    </button>
                  );
                })}
              </div>
            </SectionCard>
          ))}
        </div>

        <div className="min-w-0 flex-1 @max-mobile:w-full">
          <SectionCard>
            <SectionHeader
              compact
              title={activeProbe ? activeProbe.id : 'Response'}
              sub={activeProbe ? activeProbe.path(ctx) : 'Pick an endpoint on the left'}
              right={
                active && active.status !== 'loading' ? (
                  <Button
                    variant="ghost"
                    sm
                    onClick={() => copy(activeProbe?.id ?? 'one', active.status === 'ok' ? active.data : active.error)}
                  >
                    {copied === activeProbe?.id ? 'Copied' : 'Copy'}
                  </Button>
                ) : null
              }
            />
            <pre className="max-h-[70dvh] overflow-auto p-4 font-mono text-[11px] leading-[1.6] whitespace-pre text-ink-2">
              {!active && 'No request yet.'}
              {active?.status === 'loading' && 'Loading...'}
              {active?.status === 'ok' && JSON.stringify(active.data, null, 2)}
              {active?.status === 'error' && JSON.stringify(active.error, null, 2)}
            </pre>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
