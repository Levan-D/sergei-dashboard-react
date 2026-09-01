import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { showToast } from '@/lib/toast';
import { brand } from '@/lib/brand';
import { errorSummary, scrollToFirstError, VALIDATE_ON_SUBMIT } from '@/lib/form-errors';
import { ROUTING } from '@/lib/routing';
import { useGetAdminCatalogModelQuery } from '@/lib/redux/api/admin-api/catalog/catalog-queries';
import {
  useCreateAdminCatalogModelMutation,
  useUpdateAdminCatalogModelMutation,
  useSetAdminCatalogModelVisibilityMutation,
} from '@/lib/redux/api/admin-api/catalog/catalog-mutations';
import type { AdminCatalogModelType } from '@/lib/redux/api/admin-api/admin-types';
import Chip from '@/components/_admin/ui/Chip';
import Spinner from '@/components/_admin/ui/Spinner';
import ErrorState from '@/components/_admin/ui/ErrorState';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Select from '@/components/_admin/forms/Select';
import { MediaPickRow } from '@/components/_admin/MediaRow';
import { ExternalLinksSection, GallerySection, InfoCard, PublishCard } from '@/features/_admin/editor/EditorShared';
import Input from '@/components/_admin/forms/Input';
import Textarea from '@/components/_admin/forms/Textarea';

const decades = ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

type ModelFormValues = {
  name: string;
  about: string;
};

type Props = { model: AdminCatalogModelType | null };

function ModelEditorForm({ model }: Props) {
  const navigate = useNavigate();
  const isNew = model === null;
  const [activeDecades, setActiveDecades] = useState<Record<string, boolean>>({ '2020s': true });
  const [visible, setVisible] = useState(model?.visible ?? true);
  const [createModel] = useCreateAdminCatalogModelMutation();
  const [updateModel] = useUpdateAdminCatalogModelMutation();
  const [setModelVisibility] = useSetAdminCatalogModelVisibilityMutation();
  const {
    register,
    handleSubmit,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<ModelFormValues>({
    ...VALIDATE_ON_SUBMIT,
    defaultValues: { name: model?.name ?? '', about: model?.about ?? '' },
  });

  const onVisibleChange = (next: boolean) => {
    setVisible(next);
    if (isNew) return;
    setModelVisibility({ subdomain: brand.makeSlug, id: model.id, visible: next })
      .unwrap()
      .then(() => showToast('👁️ Visibility updated'))
      .catch(() => {
        setVisible(!next);
        showToast('⚠️ Could not update visibility');
      });
  };

  const onSave = handleSubmit(async (values) => {
    try {
      if (isNew) {
        const created = await createModel({
          subdomain: brand.makeSlug,
          name: values.name.trim(),
          about: values.about.trim() || null,
        }).unwrap();
        if (!visible) {
          await setModelVisibility({ subdomain: brand.makeSlug, id: created.id, visible: false })
            .unwrap()
            .catch(() => undefined);
        }
        showToast('✅ Model saved');
        navigate(ROUTING.adminCatalog);
      } else {
        await updateModel({
          subdomain: brand.makeSlug,
          id: model.id,
          name: values.name.trim(),
          about: values.about.trim() || null,
          info: model.info,
        }).unwrap();
        showToast('✅ Model saved');
      }
    } catch {
      showToast('⚠️ Could not save the model');
    }
  }, scrollToFirstError);

  return (
    <div className="flex h-auto items-start gap-5 @max-mobile:flex-col">
      {/* LEFT COLUMN */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 @max-mobile:w-full @mobile:gap-4 [&>div]:mb-0">
        <SectionCard>
          <SectionHeader title="Basic Information" />
          <div className="flex flex-wrap gap-3 p-5 @mobile:gap-4">
            <FormGroup half label="Model Name" error={errors.name?.message}>
              <Input
                type="text"
                placeholder="e.g. BMW M4"
                aria-invalid={!!errors.name}
                {...register('name', { validate: (v) => v.trim().length > 0 || 'Model name is required' })}
              />
            </FormGroup>
            <FormGroup half label="Production Years" hint="Computed from this model's generations">
              <Input type="text" placeholder="—" value={model?.years ?? ''} readOnly />
            </FormGroup>
            <FormGroup half label="Body Type">
              <Select
                disabled
                placeholder="— Select —"
                options={['Sedan', 'Coupe', 'SAV', 'Convertible', 'Roadster', 'Touring', 'Compact', 'Hatchback', 'Other']}
              />
            </FormGroup>
            <FormGroup half label="Power Type">
              <Select disabled placeholder="— Select —" options={['Combustion', 'Electric', 'Hybrid', 'Plug-in Hybrid']} />
            </FormGroup>
            <FormGroup label="Description" full hint="Markdown supported" error={errors.about?.message}>
              <Textarea
                rows={5}
                placeholder="Describe this model — its history, key features, generations overview..."
                aria-invalid={!!errors.about}
                {...register('about', { validate: (v) => v.trim().length > 0 || 'Description is required' })}
              />
            </FormGroup>
          </div>
        </SectionCard>

        <SectionCard>
          <SectionHeader title="Model Overview" sub="Displayed in the overview section of the model page" />
          <div className="flex flex-wrap gap-3 p-5 @mobile:gap-4">
            <FormGroup label="Overview Text" full hint="Markdown supported">
              <Textarea
                rows={6}
                placeholder="Write a comprehensive overview of this model — its place in the lineup, what makes it special, key attributes and target audience..."
              />
            </FormGroup>
          </div>
        </SectionCard>

        <SectionCard>
          <SectionHeader title="Main Image" sub="Primary photo shown in the catalog grid and model card" />
          <div className="p-5">
            <MediaPickRow
              stack
              icon="🖼️"
              text="Drop image or click to upload"
              hint="JPG / WebP · min 800×533 · max 5MB"
            />
          </div>
        </SectionCard>

        <GallerySection
          sub="Additional photos on the model detail page"
          initial={[
            { id: 1, emoji: '🚗', bg: 'linear-gradient(135deg,#2d3748,#1a202c)' },
            { id: 2, emoji: '🚗', bg: 'linear-gradient(135deg,#1a1a2e,#16213e)' },
            { id: 3, emoji: '🏎️', bg: 'linear-gradient(135deg,#2d6a4f,#1b4332)' },
          ]}
        />

        <ExternalLinksSection sub="CTA buttons shown on the model page" target="model" />
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="flex w-[260px] shrink-0 flex-col gap-2 @max-mobile:w-full @mobile:gap-3">
        <PublishCard
          saveLabel="Save Model"
          visible={visible}
          onVisibleChange={onVisibleChange}
          onSave={onSave}
          saving={isSubmitting}
          saveDisabled={!isNew && !isDirty}
          error={errorSummary(errors)}
          className="@max-mobile:order-last"
        />

        <SectionCard className="mb-0">
          <SectionHeader compact title="Series" />
          <div className="px-3 py-3.5 @mobile:px-4">
            <Select
              disabled
              placeholder="— Select series —"
              options={[
                '1 Series',
                '2 Series',
                '3 Series',
                '4 Series',
                '5 Series',
                '6 Series',
                '7 Series',
                'X Series',
                'M Division',
                'i Series (Electric)',
              ]}
            />
          </div>
        </SectionCard>

        <SectionCard className="mb-0">
          <SectionHeader compact title="Decade" />
          <div className="flex flex-wrap gap-1.5 px-3 py-3.5 @mobile:px-4">
            {decades.map((d) => (
              <Chip
                key={d}
                label={d}
                active={!!activeDecades[d]}
                onClick={() => setActiveDecades((a) => ({ ...a, [d]: !a[d] }))}
                className="px-2.5 py-[3px] text-[11px]"
              />
            ))}
          </div>
        </SectionCard>

        {!isNew && (
          <InfoCard
            rows={[
              { label: 'Generations', value: String(model.generations_count) },
              { label: 'Logbooks', value: String(model.logbooks_count) },
            ]}
          />
        )}
      </div>
    </div>
  );
}

export default function ModelEditorPage() {
  const { name: param } = useParams();
  const isNew = param === 'new';
  const { data, isError, error, isFetching, refetch } = useGetAdminCatalogModelQuery(
    { subdomain: brand.makeSlug, id: param ?? '' },
    { skip: isNew },
  );

  if (isNew) return <ModelEditorForm model={null} />;
  if (isError && !data) return <ErrorState error={error} isRetrying={isFetching} onRetry={refetch} />;
  if (!data) return <Spinner />;
  return <ModelEditorForm key={data.id} model={data} />;
}
