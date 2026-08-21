import { useForm, Controller } from 'react-hook-form';
import { showToast } from '@/lib/toast';
import { brand } from '@/lib/brand';
import SiteLoader from '@/features/_admin/site/SiteLoader';
import { useUpdateAdminCommunityMutation } from '@/lib/redux/api/admin-api/site/site-mutations';
import type { AutobrandSiteType } from '@/lib/redux/api/admin-api/admin-types';
import Button from '@/components/_admin/ui/Button';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Select from '@/components/_admin/forms/Select';
import Toggle from '@/components/_admin/forms/Toggle';
import { StatCard } from '@/components/_admin/StatCard';
import { IdentityCell, MutedCell } from '@/components/_admin/table-cells';
import Avatar from '@/components/_admin/ui/Avatar';
import Input from '@/components/_admin/forms/Input';
import Table from '@/components/_admin/ui/Table';

const logbooks = [
  {
    initials: 'SV',
    bg: undefined,
    name: 'Sergei V.',
    car: 'BMW M4 Competition G82',
    mileage: '20,500 km',
    owned: '2 years',
    date: 'Apr 5',
  },
  {
    initials: 'MK',
    bg: '#8b5cf6',
    name: 'Maria K.',
    car: 'BMW X5 G05',
    mileage: '34,200 km',
    owned: '3 years',
    date: 'Apr 3',
  },
  {
    initials: 'JP',
    bg: 'var(--green)',
    name: 'James P.',
    car: 'BMW M3 G80',
    mileage: '8,100 km',
    owned: '1 year',
    date: 'Apr 1',
  },
];

const fmt = (n: number | null | undefined) => (typeof n === 'number' ? n.toLocaleString('en-US') : '—');

const fmtDelta = (n: number | null | undefined) => {
  if (typeof n !== 'number') return { value: '—', color: undefined };
  return { value: n > 0 ? `+${fmt(n)}` : fmt(n), color: n > 0 ? 'var(--green)' : undefined };
};

type CommunityFormValues = {
  show_on_landing: boolean;
  title: string;
  subtitle: string;
  max_logbooks: string;
};

type Props = { site: AutobrandSiteType };

function CommunityForm({ site }: Props) {
  const stats = site.motority_stats;
  const [updateCommunity, { isLoading: isSaving }] = useUpdateAdminCommunityMutation();
  const {
    register,
    control,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = useForm<CommunityFormValues>({
    defaultValues: {
      show_on_landing: site.community?.show_on_landing ?? true,
      title: site.community?.title ?? '',
      subtitle: site.community?.subtitle ?? '',
      max_logbooks: String(site.community?.max_logbooks ?? 4),
    },
  });
  const showBlock = watch('show_on_landing');

  const onSubmit = async (values: CommunityFormValues) => {
    try {
      await updateCommunity({
        subdomain: brand.makeSlug,
        community: {
          show_on_landing: values.show_on_landing,
          title: values.title,
          subtitle: values.subtitle,
          max_logbooks: Number(values.max_logbooks),
        },
      }).unwrap();
      reset(values);
      showToast('✅ Community settings saved');
    } catch {
      showToast('⚠️ Could not save community settings');
    }
  };

  return (
    <div>
      <div className="mb-4 flex gap-2 @max-mobile:flex-wrap @mobile:mb-6 @mobile:gap-3">
        <StatCard label="Total Logbooks" value={fmt(stats?.total_logbooks)} />
        <StatCard label="Active Owners" value={fmt(stats?.active_owners)} />
        <StatCard
          label="New This Month"
          value={fmtDelta(stats?.new_this_month).value}
          valueStyle={{ color: fmtDelta(stats?.new_this_month).color }}
        />
      </div>

      <SectionCard>
        <SectionHeader
          title="Community Block Settings"
          right={
            <Button sm loading={isSaving} disabled={!isDirty} onClick={handleSubmit(onSubmit)}>
              Save
            </Button>
          }
        />
        <div className="flex flex-col gap-3 p-5 @mobile:gap-4">
          <div className="flex items-center gap-2.5">
            <Toggle on={showBlock} onClick={() => setValue('show_on_landing', !showBlock, { shouldDirty: true })} />
            <label>Show Community block on landing</label>
          </div>
          <FormGroup label="Section Title">
            <Input type="text" {...register('title')} />
          </FormGroup>
          <FormGroup label="Section Subtitle">
            <Input type="text" {...register('subtitle')} />
          </FormGroup>
          <FormGroup label="Max logbooks to show">
            <Controller
              name="max_logbooks"
              control={control}
              render={({ field }) => (
                <Select options={['4', '6', '8', '12']} value={field.value} onChange={field.onChange} />
              )}
            />
          </FormGroup>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader title="Recent Logbooks" sub={`Latest from ${site.make?.name ?? brand.name} owners`} />
        <Table className="@max-mobile:hidden">
          <thead>
            <tr>
              <th>Owner</th>
              <th>Car</th>
              <th>Mileage</th>
              <th>Owned</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {logbooks.map((l) => (
              <tr key={l.name}>
                <IdentityCell initials={l.initials} bg={l.bg} name={l.name} />
                <td>{l.car}</td>
                <td>{l.mileage}</td>
                <td>{l.owned}</td>
                <MutedCell>{l.date}</MutedCell>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="hidden flex-col gap-2 p-3 @max-mobile:flex">
          {logbooks.map((l) => (
            <div key={l.name} className="w-full overflow-hidden rounded-el border border-line bg-surface-2">
              <div className="flex items-center gap-2.5 p-3">
                <Avatar sm initials={l.initials} bg={l.bg} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-ink">{l.name}</p>
                  <p className="truncate text-[11px] text-ink-3">{l.car}</p>
                </div>
                <p className="text-[11px] text-ink-3">{l.date}</p>
              </div>
              <div className="flex items-center gap-4 border-t border-line px-3 py-2.5 text-[12px] text-ink-3">
                <span>
                  <span className="text-ink-2">{l.mileage}</span> mileage
                </span>
                <span>
                  <span className="text-ink-2">{l.owned}</span> owned
                </span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export default function CommunityPage() {
  return <SiteLoader>{(site) => <CommunityForm site={site} />}</SiteLoader>;
}
