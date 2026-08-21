import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/lib/toast';
import { ROUTING } from '@/lib/routing';
import { brand } from '@/lib/brand';
import SiteLoader from '@/features/_admin/site/SiteLoader';
import { useUpdateAdminSettingsMutation } from '@/lib/redux/api/admin-api/site/site-mutations';
import { useCreateAdminBackupMutation } from '@/lib/redux/api/admin-api/history/history-api';
import type { AutobrandSiteType } from '@/lib/redux/api/admin-api/admin-types';
import Button from '@/components/_admin/ui/Button';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Select from '@/components/_admin/forms/Select';
import Toggle from '@/components/_admin/forms/Toggle';
import Input from '@/components/_admin/forms/Input';

const LOCALE_LABELS: Record<string, string> = { en: 'English', de: 'Deutsch', ru: 'Русский' };

const LOCALE_CODES = Object.fromEntries(Object.entries(LOCALE_LABELS).map(([code, label]) => [label, code]));

type SettingsFormValues = {
  brand_name: string;
  domain: string;
  contact_email: string;
  default_locale: string;
  maintenance: boolean;
};

type Props = { site: AutobrandSiteType };

function SettingsForm({ site }: Props) {
  const navigate = useNavigate();
  const [updateSettings, { isLoading: isSaving }] = useUpdateAdminSettingsMutation();
  const [createBackup, { isLoading: isBackingUp }] = useCreateAdminBackupMutation();
  const {
    register,
    control,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = useForm<SettingsFormValues>({
    defaultValues: {
      brand_name: site.make?.name ?? '',
      domain: site.domain ?? '',
      contact_email: site.contact_email ?? '',
      default_locale: LOCALE_LABELS[site.default_locale ?? ''] ?? 'English',
      maintenance: site.maintenance ?? false,
    },
  });
  const maint = watch('maintenance');

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      await updateSettings({
        subdomain: brand.makeSlug,
        contact_email: values.contact_email,
        default_locale: LOCALE_CODES[values.default_locale] ?? 'en',
        maintenance: values.maintenance,
      }).unwrap();
      reset(values);
      showToast('✅ Settings saved');
    } catch {
      showToast('⚠️ Could not save settings');
    }
  };

  const onBackup = async () => {
    try {
      await createBackup({ subdomain: brand.makeSlug }).unwrap();
      showToast('💾 Manual backup created');
    } catch {
      showToast('⚠️ Could not create backup');
    }
  };

  return (
    <SectionCard>
      <SectionHeader
        title="General Settings"
        right={
          <Button sm loading={isSaving} disabled={!isDirty} onClick={handleSubmit(onSubmit)}>
            Save Changes
          </Button>
        }
      />
      <div className="flex flex-wrap gap-3 p-5 @mobile:gap-4">
        <FormGroup half label="Brand Name" hint="Comes from the Motority catalog">
          <Input type="text" readOnly {...register('brand_name')} />
        </FormGroup>
        <FormGroup half label="Domain" hint="Bound to the catalog make slug">
          <Input type="text" readOnly {...register('domain')} />
        </FormGroup>
        <FormGroup half label="Contact Email">
          <Input type="email" {...register('contact_email')} />
        </FormGroup>
        <FormGroup half label="Default Language" hint="Translations are not supported yet">
          <Controller
            name="default_locale"
            control={control}
            render={({ field }) => (
              <Select disabled options={Object.values(LOCALE_LABELS)} value={field.value} onChange={field.onChange} />
            )}
          />
        </FormGroup>
      </div>
      <div className="px-5 pb-5">
        <div className="rounded-card border border-line bg-surface-2 p-3 @mobile:p-4">
          <div className="mb-2.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Maintenance Mode</p>
              <p className="mt-0.5 text-xs text-ink-3">Show placeholder page to visitors</p>
            </div>
            <Toggle on={maint} onClick={() => setValue('maintenance', !maint, { shouldDirty: true })} />
          </div>
          {maint && (
            <p className="rounded-el bg-yellow-bg p-2.5 text-xs text-yellow">
              ⚠️ Maintenance mode is ON — visitors see a placeholder page
            </p>
          )}
        </div>
      </div>
      <div className="px-5 pb-5">
        <p className="mb-2 text-xs font-bold tracking-[.06em] text-ink-2 uppercase @mobile:mb-3">
          Backup &amp; Restore
        </p>
        <div className="flex gap-1.5">
          <Button variant="ghost" loading={isBackingUp} onClick={onBackup}>
            Create Backup
          </Button>
          <Button variant="ghost" onClick={() => navigate(ROUTING.adminHistory)}>
            Restore from History
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

export default function SettingsPage() {
  return <SiteLoader>{(site) => <SettingsForm site={site} />}</SiteLoader>;
}
