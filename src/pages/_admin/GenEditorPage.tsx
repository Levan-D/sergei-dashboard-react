import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppSelector } from '@/store';
import { showToast } from '@/lib/toast';
import { brand } from '@/lib/brand';
import { ROUTING } from '@/lib/routing';
import {
  useGetAdminCatalogGenerationQuery,
  useGetAdminCatalogModelsQuery,
} from '@/lib/redux/api/admin-api/catalog/catalog-queries';
import {
  useCreateAdminCatalogGenerationMutation,
  useUpdateAdminCatalogGenerationMutation,
  useSetAdminCatalogGenerationVisibilityMutation,
} from '@/lib/redux/api/admin-api/catalog/catalog-mutations';
import type { AdminCatalogGenerationType, AdminCatalogModelType } from '@/lib/redux/api/admin-api/admin-types';
import Spinner from '@/components/_admin/ui/Spinner';
import ErrorState from '@/components/_admin/ui/ErrorState';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Select from '@/components/_admin/forms/Select';
import { MediaPickRow } from '@/components/_admin/MediaRow';
import { ExternalLinksSection, GallerySection, InfoCard, PublishCard } from '@/features/_admin/editor/EditorShared';
import SpecsEditor from '@/features/_admin/specs/SpecsEditor';
import Input from '@/components/_admin/forms/Input';
import Textarea from '@/components/_admin/forms/Textarea';

type GenFormValues = {
  name: string;
  years: string;
  about: string;
};

type Props = {
  generation: AdminCatalogGenerationType | null;
  models: AdminCatalogModelType[];
};

function GenEditorForm({ generation, models }: Props) {
  const navigate = useNavigate();
  const isNew = generation === null;
  const defaultModelId = useAppSelector((s) => s.catalog.genFilterModelId);
  const [parentModelId, setParentModelId] = useState<number | null>(generation?.model_id ?? defaultModelId);
  const [visible, setVisible] = useState(generation?.visible ?? true);
  const [createGeneration] = useCreateAdminCatalogGenerationMutation();
  const [updateGeneration] = useUpdateAdminCatalogGenerationMutation();
  const [setGenVisibility] = useSetAdminCatalogGenerationVisibilityMutation();
  const {
    register,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm<GenFormValues>({
    defaultValues: {
      name: generation?.name ?? '',
      years: generation?.years ?? '',
      about: generation?.about ?? '',
    },
  });

  const parentModel = models.find((m) => m.id === parentModelId) ?? null;

  const onVisibleChange = (next: boolean) => {
    setVisible(next);
    if (isNew) return;
    setGenVisibility({ subdomain: brand.makeSlug, id: generation.id, modelId: generation.model_id, visible: next })
      .unwrap()
      .then(() => showToast('👁️ Visibility updated'))
      .catch(() => {
        setVisible(!next);
        showToast('⚠️ Could not update visibility');
      });
  };

  const onSave = handleSubmit(async (values) => {
    if (!values.name.trim()) {
      showToast('⚠️ Generation name is required');
      return;
    }
    try {
      if (isNew) {
        if (parentModelId == null) {
          showToast('⚠️ Pick a parent model first');
          return;
        }
        const created = await createGeneration({
          subdomain: brand.makeSlug,
          modelId: parentModelId,
          name: values.name.trim(),
          years: values.years.trim() || null,
          about: values.about.trim() || null,
        }).unwrap();
        if (!visible) {
          await setGenVisibility({
            subdomain: brand.makeSlug,
            id: created.id,
            modelId: parentModelId,
            visible: false,
          })
            .unwrap()
            .catch(() => undefined);
        }
        showToast('✅ Generation saved');
        navigate(ROUTING.adminCatalog);
      } else {
        await updateGeneration({
          subdomain: brand.makeSlug,
          id: generation.id,
          modelId: generation.model_id,
          name: values.name.trim(),
          years: values.years.trim() || null,
          about: values.about.trim() || null,
          info: generation.info,
          sort: generation.sort,
          euro_ncap: generation.euro_ncap,
        }).unwrap();
        showToast('✅ Generation saved');
      }
    } catch {
      showToast('⚠️ Could not save the generation');
    }
  });

  return (
    <div className="flex h-auto items-start gap-5 @max-mobile:flex-col">
      {/* LEFT COLUMN */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 @max-mobile:w-full @mobile:gap-4 [&>div]:mb-0">
        <SectionCard>
          <SectionHeader title="Basic Information" />
          <div className="flex flex-wrap gap-3 p-5 @mobile:gap-4">
            <FormGroup half label="Generation Name">
              <Input type="text" placeholder="e.g. BMW M4 G82" {...register('name')} />
            </FormGroup>
            <FormGroup half label="Production Years">
              <Input type="text" placeholder="e.g. 2020 – Present" {...register('years')} />
            </FormGroup>
            <FormGroup label="Parent Model" full>
              <Select
                placeholder="— Select model —"
                disabled={!isNew}
                value={parentModel?.name ?? generation?.model_name ?? ''}
                onChange={(name) => {
                  const picked = models.find((m) => m.name === name);
                  setParentModelId(picked?.id ?? null);
                }}
                options={models.map((m) => m.name)}
              />
            </FormGroup>
            <FormGroup label="Description" full hint="Markdown supported">
              <Textarea
                rows={4}
                placeholder="Describe this generation — key changes, facelift details, performance specs overview..."
                {...register('about')}
              />
            </FormGroup>
          </div>
        </SectionCard>

        <SectionCard>
          <SectionHeader title="Generation Overview" sub="Displayed in the overview section of the generation page" />
          <div className="flex flex-wrap gap-3 p-5 @mobile:gap-4">
            <FormGroup label="Overview Text" full hint="Markdown supported">
              <Textarea
                rows={6}
                placeholder="Write a comprehensive overview of this generation — key engineering changes, performance updates, design evolution, notable variants..."
              />
            </FormGroup>
          </div>
        </SectionCard>

        <SectionCard>
          <SectionHeader title="Main Image" sub="Primary photo for this generation" />
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
          sub="Additional photos for this generation"
          initial={[
            { id: 1, emoji: '🏎️', bg: 'linear-gradient(135deg,#1e3a5f,#0f3460)' },
            { id: 2, emoji: '🚗', bg: 'linear-gradient(135deg,#2d3748,#1a202c)' },
          ]}
        />

        <ExternalLinksSection sub="CTA buttons shown on the generation page" target="gen" />

        <SpecsEditor />
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="flex w-[260px] shrink-0 flex-col gap-2 @max-mobile:w-full @mobile:gap-3">
        <PublishCard
          saveLabel="Save Generation"
          visible={visible}
          onVisibleChange={onVisibleChange}
          onSave={onSave}
          saving={isSubmitting}
          saveDisabled={!isNew && !isDirty}
          className="@max-mobile:order-last"
        />
        {!isNew && <InfoCard rows={[{ label: 'Logbooks', value: String(generation.logbooks_count) }]} />}
      </div>
    </div>
  );
}

export default function GenEditorPage() {
  const { name: param } = useParams();
  const isNew = param === 'new';
  const models = useGetAdminCatalogModelsQuery({ subdomain: brand.makeSlug });
  const single = useGetAdminCatalogGenerationQuery({ subdomain: brand.makeSlug, id: param ?? '' }, { skip: isNew });

  const isError = models.isError || (!isNew && single.isError);
  const error = models.isError ? models.error : single.error;
  const retry = () => {
    if (models.isError) models.refetch();
    if (single.isError) single.refetch();
  };

  if (isError && !(models.data && (isNew || single.data))) {
    return <ErrorState error={error} isRetrying={models.isFetching || single.isFetching} onRetry={retry} />;
  }
  if (!models.data || (!isNew && !single.data)) return <Spinner />;
  return (
    <GenEditorForm key={single.data?.id ?? 'new'} generation={isNew ? null : (single.data ?? null)} models={models.data.items} />
  );
}
