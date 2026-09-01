import { useForm } from 'react-hook-form';
import { showToast } from '@/lib/toast';
import { brand } from '@/lib/brand';
import { errorSummary, scrollToFirstError, VALIDATE_ON_SUBMIT } from '@/lib/form-errors';
import SiteLoader from '@/features/_admin/site/SiteLoader';
import { useUpdateAdminFiltersMutation } from '@/lib/redux/api/admin-api/site/site-mutations';
import type { AutobrandSiteType } from '@/lib/redux/api/admin-api/admin-types';
import Button from '@/components/_admin/ui/Button';
import Chip from '@/components/_admin/ui/Chip';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import Toggle from '@/components/_admin/forms/Toggle';

type FiltersFormValues = {
  decades_enabled: boolean;
  body_types: { label: string; active: boolean }[];
  power_types: { label: string; active: boolean }[];
};

type Props = { site: AutobrandSiteType };

function FiltersForm({ site }: Props) {
  const [updateFilters, { isLoading: isSaving }] = useUpdateAdminFiltersMutation();
  const {
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FiltersFormValues>({
    ...VALIDATE_ON_SUBMIT,
    defaultValues: {
      decades_enabled: site.filters?.decades_enabled ?? true,
      body_types: (site.filters?.body_types ?? []).map((c) => ({ label: c.label, active: !!c.active })),
      power_types: (site.filters?.power_types ?? []).map((c) => ({ label: c.label, active: !!c.active })),
    },
  });
  const decades = watch('decades_enabled');
  const bodyTypes = watch('body_types');
  const powerTypes = watch('power_types');

  const onSubmit = async (values: FiltersFormValues) => {
    try {
      await updateFilters({
        subdomain: brand.makeSlug,
        filters: {
          decades_enabled: values.decades_enabled,
          body_types: values.body_types,
          power_types: values.power_types,
        },
      }).unwrap();
      reset(values);
      showToast('✅ Filters saved');
    } catch {
      showToast('⚠️ Could not save filters');
    }
  };

  return (
    <SectionCard>
      <SectionHeader
        title="Filters Configuration"
        sub="Visible filters on the models section"
        error={errorSummary(errors)}
        right={
          <Button sm loading={isSaving} disabled={!isDirty} onClick={handleSubmit(onSubmit, scrollToFirstError)}>
            Save
          </Button>
        }
      />
      <div className="flex flex-col gap-3 p-5 @mobile:gap-4">
        <div className="flex items-center gap-2.5">
          <Toggle on={decades} onClick={() => setValue('decades_enabled', !decades, { shouldDirty: true })} />
          <label>Decades filter (1960s, 1970s … 2020s)</label>
        </div>
        <div>
          <label className="mb-2 block">Body Types</label>
          <div className="flex flex-wrap gap-2">
            {bodyTypes.map((c, i) => (
              <Chip
                key={c.label}
                label={c.label}
                active={c.active}
                withX
                onClick={() => setValue(`body_types.${i}.active`, !c.active, { shouldDirty: true })}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="mb-2 block">Power Types</label>
          <div className="flex flex-wrap gap-2">
            {powerTypes.map((c, i) => (
              <Chip
                key={c.label}
                label={c.label}
                active={c.active}
                withX
                onClick={() => setValue(`power_types.${i}.active`, !c.active, { shouldDirty: true })}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

type FiltersConfigProps = { silent?: boolean };

export function FiltersConfig({ silent }: FiltersConfigProps) {
  return <SiteLoader silent={silent}>{(site) => <FiltersForm site={site} />}</SiteLoader>;
}
