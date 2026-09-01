import { useForm } from 'react-hook-form';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/cn';
import { brand } from '@/lib/brand';
import { errorSummary, scrollToFirstError, VALIDATE_ON_SUBMIT } from '@/lib/form-errors';
import SiteLoader from '@/features/_admin/site/SiteLoader';
import { useUpdateAdminAboutMutation } from '@/lib/redux/api/admin-api/site/site-mutations';
import type { AutobrandSiteType } from '@/lib/redux/api/admin-api/admin-types';
import Button from '@/components/_admin/ui/Button';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Input from '@/components/_admin/forms/Input';
import Textarea from '@/components/_admin/forms/Textarea';

const fmt = (n: number | null | undefined) => (typeof n === 'number' ? n.toLocaleString('en-US') : '—');

const fmtDelta = (n: number | null | undefined) => {
  if (typeof n !== 'number') return { value: '—', color: undefined };
  return { value: n > 0 ? `+${fmt(n)}` : fmt(n), color: n > 0 ? 'var(--green)' : undefined };
};

const FACT_SLOTS = 6;

const padFacts = (facts: { name: string; value: string }[]) => [
  ...facts,
  ...Array.from({ length: Math.max(0, FACT_SLOTS - facts.length) }, () => ({ name: '', value: '' })),
];

type SecondScreenFormValues = {
  about: string;
  facts: { name: string; value: string }[];
};

type Props = { site: AutobrandSiteType };

function SecondScreenForm({ site }: Props) {
  const stats = site.motority_stats;
  const [updateAbout, { isLoading: isSaving }] = useUpdateAdminAboutMutation();
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<SecondScreenFormValues>({
    ...VALIDATE_ON_SUBMIT,
    defaultValues: {
      about: site.about ?? '',
      facts: padFacts(site.facts ?? []),
    },
  });
  const facts = watch('facts');
  // The landing always shows six facts, so all six must be filled before saving.
  const factRule = { validate: (v: string) => v.trim().length > 0 || 'Please fill out all the facts' };

  const onSubmit = async (values: SecondScreenFormValues) => {
    try {
      await updateAbout({
        subdomain: brand.makeSlug,
        about: values.about,
        facts: values.facts.map((f) => ({ name: f.name.trim(), value: f.value.trim() })),
      }).unwrap();
      reset(values);
      showToast('✅ Second screen saved');
    } catch {
      showToast('⚠️ Could not save second screen');
    }
  };

  const statTiles: { label: string; value: string; color?: string; small?: boolean }[] = [
    { label: 'Total Logbooks', value: fmt(stats?.total_logbooks) },
    { label: 'Active Owners', value: fmt(stats?.active_owners) },
    { label: 'New This Month', ...fmtDelta(stats?.new_this_month) },
    { label: 'Top Model', value: stats?.top_model ?? '—', small: true },
    { label: 'Models in catalog', value: fmt(stats?.models_count) },
    { label: 'Generations', value: fmt(stats?.generations_count) },
  ];

  return (
    <SectionCard>
      <SectionHeader
        title="Second Screen"
        sub={<>About, Facts &amp; Motority Stats block</>}
        error={errorSummary(errors)}
        right={
          <Button sm loading={isSaving} disabled={!isDirty} onClick={handleSubmit(onSubmit, scrollToFirstError)}>
            Save Changes
          </Button>
        }
      />
      <div className="border-b border-line p-5">
        <div className="mb-2 text-xs font-bold tracking-[.06em] text-ink-2 uppercase @mobile:mb-3">
          About{' '}
          <span className="text-[11px] font-normal tracking-normal text-ink-3 normal-case">
            — pulled from Motority, editable
          </span>
        </div>
        <FormGroup label="Brand Description" error={errors.about?.message}>
          <Textarea
            rows={5}
            aria-invalid={!!errors.about}
            {...register('about', { validate: (v) => v.trim().length > 0 || 'Brand description is required' })}
          />
        </FormGroup>
      </div>
      <div className="border-b border-line p-5">
        <div className="mb-2 text-xs font-bold tracking-[.06em] text-ink-2 uppercase @mobile:mb-3">
          Facts{' '}
          <span className="text-[11px] font-normal tracking-normal text-ink-3 normal-case">
            — pulled from Motority, editable
          </span>
        </div>
        <div className="flex flex-wrap gap-2 @mobile:gap-3">
          {facts.map((_, i) => (
            <div
              key={i}
              className="flex w-full flex-col gap-2 rounded-el border border-line bg-surface-2 p-3.5 @mobile:w-[calc(50%-6px)]"
            >
              <p className="text-[10px] font-bold tracking-[.06em] text-ink-3 uppercase">Fact {i + 1}</p>
              <Input
                type="text"
                placeholder="Fact name"
                aria-invalid={!!errors.facts?.[i]?.name}
                {...register(`facts.${i}.name`, factRule)}
              />
              <Input
                type="text"
                placeholder="Fact value"
                aria-invalid={!!errors.facts?.[i]?.value}
                {...register(`facts.${i}.value`, factRule)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2 @mobile:mb-3">
          <p className="text-xs font-bold tracking-[.06em] text-ink-2 uppercase">Motority Stats</p>
          <p className="rounded-[20px] border border-line bg-surface-3 px-2 py-0.5 text-[11px] text-ink-3">
            Read-only · auto-updated
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {statTiles.map((s) => (
            <div
              key={s.label}
              className="w-full rounded-el border border-line bg-surface-2 p-3.5 @sm:w-[calc(50%-5px)] @mobile:w-[calc((100%-20px)/3)]"
            >
              <p className="mb-1 text-[11px] text-ink-3">{s.label}</p>
              <p
                className={cn('font-mono font-bold', s.small ? 'text-[15px]' : 'text-[22px]')}
                style={{ color: s.color ?? 'var(--text)' }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-2.5 text-[11px] text-ink-3">Stats are pulled live from Motority and cannot be edited here.</p>
      </div>
    </SectionCard>
  );
}

type SecondScreenProps = { silent?: boolean };

export function SecondScreen({ silent }: SecondScreenProps) {
  return <SiteLoader silent={silent}>{(site) => <SecondScreenForm site={site} />}</SiteLoader>;
}
