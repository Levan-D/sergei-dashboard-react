import { useRef, useState } from 'react';
import { useForm, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/cn';
import { fmtFileSize, releaseLocalFile, toLocalFile, type LocalFileType } from '@/lib/files';
import { brand } from '@/lib/brand';
import { errorSummary, scrollToFirstError, VALIDATE_ON_SUBMIT } from '@/lib/form-errors';
import { uploadFilesTus, type TusMediaType } from '@/lib/tus';
import SiteLoader from '@/features/_admin/site/SiteLoader';
import { useUpdateAdminHeroMutation } from '@/lib/redux/api/admin-api/site/site-mutations';
import { useRegisterAdminMediaMutation } from '@/lib/redux/api/admin-api/media/media-api';
import {
  adminMediaFileUrl,
  adminMediaUrl,
  type AdminMediaType,
  type AutobrandSiteType,
} from '@/lib/redux/api/admin-api/admin-types';
import type { HeroType } from '../types';
import HeroSlideGrid, { type HeroSlideItemType } from './HeroSlideGrid';
import Badge from '@/components/_admin/ui/Badge';
import Button from '@/components/_admin/ui/Button';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Toggle from '@/components/_admin/forms/Toggle';
import MediaPreview from '@/components/_admin/MediaPreview';
import DropZone from '@/components/_admin/forms/DropZone';
import { MediaPickRow, MediaSectionLabel } from '@/components/_admin/MediaRow';
import PickMediaModal from '@/features/_admin/media/PickMediaModal';
import { IconImage, IconVideo, IconCarousel } from '@/components/_admin/icons';
import Input from '@/components/_admin/forms/Input';

const MAX_SLIDES = 6;

type SingleFileField = 'image_file' | 'video_file' | 'video_thumbnail_file';
type SinglePickField = 'image_pick' | 'video_pick' | 'video_thumbnail_pick';
type SingleRemovedField = 'image_removed' | 'video_removed' | 'video_thumbnail_removed';

type HeroFormValues = {
  type: HeroType;
  headline: string;
  subheadline: string;
  cta_primary: { text: string; url: string };
  cta_secondary: { text: string; url: string };
  autoplay: boolean;
  slide_duration_seconds: string;
  image_file: LocalFileType | null;
  video_file: LocalFileType | null;
  video_thumbnail_file: LocalFileType | null;
  image_pick: AdminMediaType | null;
  video_pick: AdminMediaType | null;
  video_thumbnail_pick: AdminMediaType | null;
  image_removed: boolean;
  video_removed: boolean;
  video_thumbnail_removed: boolean;
  slides: HeroSlideItemType[];
};

type CtaFieldsProps = { register: UseFormRegister<HeroFormValues>; errors: FieldErrors<HeroFormValues> };

function HeroCtaFields({ register, errors }: CtaFieldsProps) {
  return (
    <div className="flex flex-wrap gap-3 p-5 @mobile:gap-4">
      <div className="h-px w-full bg-line" />
      <FormGroup label="H1 — Headline" full error={errors.headline?.message}>
        <Input
          type="text"
          placeholder="Main heading"
          aria-invalid={!!errors.headline}
          {...register('headline', { validate: (v) => v.trim().length > 0 || 'Headline is required' })}
        />
      </FormGroup>
      <FormGroup label="H2 — Subheadline" full>
        <Input type="text" placeholder="Supporting text" {...register('subheadline')} />
      </FormGroup>
      <FormGroup half label="CTA Primary — Button Text">
        <Input type="text" placeholder="e.g. Explore Models" {...register('cta_primary.text')} />
      </FormGroup>
      <FormGroup half label="CTA Primary — Link URL">
        <Input type="url" placeholder="https://..." {...register('cta_primary.url')} />
      </FormGroup>
      <FormGroup half label="CTA Secondary — Button Text">
        <Input type="text" placeholder="e.g. Join Community" {...register('cta_secondary.text')} />
      </FormGroup>
      <FormGroup half label="CTA Secondary — Link URL">
        <Input type="url" placeholder="https://..." {...register('cta_secondary.url')} />
      </FormGroup>
    </div>
  );
}

const seedSlides = (site: AutobrandSiteType): HeroSlideItemType[] =>
  (site.hero?.slides ?? []).map((s, i) => ({
    id: String(s.id ?? `remote-${i}`),
    name: s.media?.name ?? `Slide ${i + 1}`,
    meta: s.media?.filetype ?? '',
    previewUrl: adminMediaUrl(s.media),
    file: null,
    mediaId: s.media?.id ?? null,
    media: s.media ?? null,
  }));

type Props = { site: AutobrandSiteType };

function HeroForm({ site }: Props) {
  const hero = site.hero;
  const [updateHero] = useUpdateAdminHeroMutation();
  const [registerMedia] = useRegisterAdminMediaMutation();
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<HeroFormValues>({
    ...VALIDATE_ON_SUBMIT,
    defaultValues: {
      type: hero?.type ?? 'image',
      headline: hero?.headline ?? '',
      subheadline: hero?.subheadline ?? '',
      cta_primary: { text: hero?.cta_primary?.text ?? '', url: hero?.cta_primary?.url ?? '' },
      cta_secondary: { text: hero?.cta_secondary?.text ?? '', url: hero?.cta_secondary?.url ?? '' },
      autoplay: hero?.autoplay ?? true,
      slide_duration_seconds: String(hero?.slide_duration_seconds ?? 5),
      image_file: null,
      video_file: null,
      video_thumbnail_file: null,
      image_pick: null,
      video_pick: null,
      video_thumbnail_pick: null,
      image_removed: false,
      video_removed: false,
      video_thumbnail_removed: false,
      slides: seedSlides(site),
    },
  });
  const heroType = watch('type');
  const autoplay = watch('autoplay');
  const imageFile = watch('image_file');
  const videoFile = watch('video_file');
  const thumbFile = watch('video_thumbnail_file');
  const imagePick = watch('image_pick');
  const videoPick = watch('video_pick');
  const thumbPick = watch('video_thumbnail_pick');
  const imageRemoved = watch('image_removed');
  const videoRemoved = watch('video_removed');
  const thumbRemoved = watch('video_thumbnail_removed');
  const slides = watch('slides');

  const existingImageUrl = adminMediaUrl(hero?.image);
  const existingVideoUrl = adminMediaFileUrl(hero?.video);
  const existingThumbUrl = adminMediaUrl(hero?.video_thumbnail);

  /**
   * The hero renders one tab's media, so only that tab has to be filled. The
   * rule hangs off `type` because that is the value it follows; switching tabs
   * moves the requirement with it.
   */
  const mediaCheck = (values: HeroFormValues) => {
    if (values.type === 'image') {
      if (values.image_file || values.image_pick || (hero?.image && !values.image_removed)) return true;
      return 'Upload a photo';
    }
    if (values.type === 'video') {
      if (values.video_file || values.video_pick || (hero?.video && !values.video_removed)) return true;
      return 'Upload a video';
    }
    return values.slides.length > 0 || 'Add at least one slide';
  };
  register('type', { validate: (_, values) => mediaCheck(values) });

  const pickFieldOf: Record<SingleFileField, SinglePickField> = {
    image_file: 'image_pick',
    video_file: 'video_pick',
    video_thumbnail_file: 'video_thumbnail_pick',
  };

  const removedFieldOf: Record<SingleFileField, SingleRemovedField> = {
    image_file: 'image_removed',
    video_file: 'video_removed',
    video_thumbnail_file: 'video_thumbnail_removed',
  };

  const replaceSingle = (field: SingleFileField) => (files: File[]) => {
    releaseLocalFile(watch(field));
    setValue(field, toLocalFile(files[0]), { shouldDirty: true });
    setValue(pickFieldOf[field], null, { shouldDirty: true });
    setValue(removedFieldOf[field], false, { shouldDirty: true });
  };

  const pickSingle = (field: SingleFileField) => (media: AdminMediaType) => {
    releaseLocalFile(watch(field));
    setValue(field, null, { shouldDirty: true });
    setValue(pickFieldOf[field], media, { shouldDirty: true });
    setValue(removedFieldOf[field], false, { shouldDirty: true });
  };

  const removeSingle = (field: SingleFileField) => () => {
    releaseLocalFile(watch(field));
    setValue(field, null, { shouldDirty: true });
    setValue(pickFieldOf[field], null, { shouldDirty: true });
    showToast('🗑️ File removed');
  };

  const removeExisting = (field: SingleFileField) => () => {
    setValue(removedFieldOf[field], true, { shouldDirty: true });
  };

  const [slidePickOpen, setSlidePickOpen] = useState(false);
  const slideKeyRef = useRef(0);
  const slidesLeft = MAX_SLIDES - slides.length;

  const addSlides = (incoming: File[]) => {
    if (slidesLeft <= 0) {
      showToast(`⚠️ Maximum ${MAX_SLIDES} slides`);
      return;
    }
    const files = incoming.slice(0, slidesLeft);
    if (incoming.length > files.length) showToast(`⚠️ Maximum ${MAX_SLIDES} slides`);
    const next = files.map((file) => {
      const local = toLocalFile(file);
      return {
        id: `local-${slideKeyRef.current++}-${file.name}`,
        name: file.name,
        meta: fmtFileSize(file.size),
        previewUrl: local.url,
        file,
      };
    });
    setValue('slides', [...slides, ...next], { shouldDirty: true });
  };

  const addSlidesFromLibrary = (incoming: AdminMediaType[]) => {
    if (slidesLeft <= 0) {
      showToast(`⚠️ Maximum ${MAX_SLIDES} slides`);
      return;
    }
    const mediaList = incoming.slice(0, slidesLeft);
    if (incoming.length > mediaList.length) showToast(`⚠️ Maximum ${MAX_SLIDES} slides`);
    const next = mediaList.map((media, i) => ({
      id: `pick-${media.id}-${slideKeyRef.current++}`,
      name: media.name ?? `Slide ${slides.length + i + 1}`,
      meta: media.meta ?? '',
      previewUrl: adminMediaUrl(media),
      file: null,
      media: media.file ?? media,
    }));
    setValue('slides', [...slides, ...next], { shouldDirty: true });
  };

  const removeSlide = (id: string) => {
    const target = slides.find((s) => s.id === id);
    if (target?.file && target.previewUrl) URL.revokeObjectURL(target.previewUrl);
    setValue(
      'slides',
      slides.filter((s) => s.id !== id),
      { shouldDirty: true },
    );
    showToast('🗑️ Slide removed');
  };

  const uploadOne = async (local: LocalFileType, mediaType: TusMediaType) => {
    const [id] = await uploadFilesTus([local.file], mediaType);
    const entry = await registerMedia({ subdomain: brand.makeSlug, file_id: id, name: local.file.name })
      .unwrap()
      .catch(() => undefined);
    return entry?.file ?? { id };
  };

  const resolveSingle = async (
    local: LocalFileType | null,
    pick: AdminMediaType | null,
    removed: boolean,
    existing: AdminMediaType | null | undefined,
    mediaType: TusMediaType,
  ) => {
    if (local) return uploadOne(local, mediaType);
    if (pick) return pick.file ?? pick;
    if (removed) return null;
    return existing ?? null;
  };

  const onSubmit = async (values: HeroFormValues) => {
    try {
      const image = await resolveSingle(values.image_file, values.image_pick, values.image_removed, hero?.image, 'image');
      const video = await resolveSingle(values.video_file, values.video_pick, values.video_removed, hero?.video, 'video');
      const thumb = await resolveSingle(
        values.video_thumbnail_file,
        values.video_thumbnail_pick,
        values.video_thumbnail_removed,
        hero?.video_thumbnail,
        'image',
      );

      const slidePayload = [];
      for (const slide of values.slides) {
        if (slide.file) {
          const local = { file: slide.file, url: slide.previewUrl ?? '' };
          slidePayload.push({ media: await uploadOne(local, 'image') });
        } else if (slide.media) {
          slidePayload.push({ media: slide.media });
        } else if (slide.mediaId != null) {
          slidePayload.push({ media: { id: slide.mediaId } });
        }
      }

      await updateHero({
        subdomain: brand.makeSlug,
        hero: {
          type: values.type,
          headline: values.headline,
          subheadline: values.subheadline,
          cta_primary: values.cta_primary,
          cta_secondary: values.cta_secondary,
          autoplay: values.autoplay,
          slide_duration_seconds: Number(values.slide_duration_seconds),
          image,
          video,
          video_thumbnail: thumb,
          slides: slidePayload,
        },
      }).unwrap();
      reset(values);
      showToast('✅ Hero block saved');
    } catch {
      showToast('⚠️ Could not save hero block');
    }
  };

  const tabs: { id: HeroType; label: string; icon: React.ReactNode }[] = [
    { id: 'image', label: 'Photo', icon: <IconImage size={14} /> },
    { id: 'video', label: 'Video', icon: <IconVideo size={14} /> },
    { id: 'carousel', label: 'Carousel', icon: <IconCarousel size={14} /> },
  ];

  return (
    <SectionCard>
      <SectionHeader
        title="Hero Block"
        sub="Top visual of the landing page"
        error={errorSummary(errors)}
        right={
          <Button sm loading={isSubmitting} disabled={!isDirty} onClick={handleSubmit(onSubmit, scrollToFirstError)}>
            Save Changes
          </Button>
        }
      />
      <fieldset disabled={isSubmitting} className={cn('contents', isSubmitting && '[&_button]:cursor-not-allowed')}>
      <div className="flex gap-1 border-b border-line bg-surface-2 px-3 py-2 @mobile:px-4 @mobile:py-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setValue('type', t.id, { shouldDirty: true })}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-el border px-3 py-[7px] font-sans text-[12.5px] font-semibold transition-all @mobile:px-4',
              heroType === t.id
                ? 'border-line bg-surface text-accent-light shadow-[0_1px_4px_rgba(0,0,0,.15)] [&_svg]:opacity-100'
                : 'border-transparent bg-transparent text-ink-3 hover:border-line hover:bg-surface hover:text-ink [&_svg]:opacity-70 [&_svg]:hover:opacity-100',
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className={heroType === 'image' ? '' : 'hidden'} data-field={heroType === 'image' ? 'type' : undefined}>
        <div className="p-5">
          <MediaSectionLabel>Background Photo</MediaSectionLabel>
          {imageFile ? (
            <MediaPreview
              url={imageFile.url}
              kind="image"
              name={imageFile.file.name}
              meta={fmtFileSize(imageFile.file.size)}
              onRemove={removeSingle('image_file')}
            />
          ) : imagePick ? (
            <MediaPreview
              url={adminMediaUrl(imagePick) ?? ''}
              kind="image"
              name={imagePick.name ?? 'Library photo'}
              meta={imagePick.meta ?? ''}
              onRemove={removeSingle('image_file')}
            />
          ) : existingImageUrl && !imageRemoved ? (
            <MediaPreview
              url={existingImageUrl}
              kind="image"
              name={hero?.image?.name ?? hero?.image?.filename ?? 'Current photo'}
              meta={hero?.image?.filetype ?? ''}
              onRemove={removeExisting('image_file')}
            />
          ) : (
            <MediaPickRow
              stack
              icon="🖼️"
              text="Drop image or click to upload"
              hint="1600×900px · JPG/WebP · max 5MB"
              kinds={['image']}
              maxSizeMB={5}
              disabled={isSubmitting}
              onFiles={replaceSingle('image_file')}
              onPick={pickSingle('image_file')}
            />
          )}
        </div>
      </div>

      <div className={heroType === 'video' ? '' : 'hidden'} data-field={heroType === 'video' ? 'type' : undefined}>
        <div className="p-5">
          <MediaSectionLabel>Background Video</MediaSectionLabel>
          {videoFile ? (
            <MediaPreview
              url={videoFile.url}
              kind="video"
              name={videoFile.file.name}
              meta={fmtFileSize(videoFile.file.size)}
              onRemove={removeSingle('video_file')}
            />
          ) : videoPick ? (
            <MediaPreview
              url={adminMediaFileUrl(videoPick) ?? ''}
              kind="video"
              name={videoPick.name ?? 'Library video'}
              meta={videoPick.meta ?? ''}
              onRemove={removeSingle('video_file')}
            />
          ) : existingVideoUrl && !videoRemoved ? (
            <MediaPreview
              url={existingVideoUrl}
              kind="video"
              name={hero?.video?.name ?? hero?.video?.filename ?? 'Current video'}
              meta={hero?.video?.filetype ?? ''}
              onRemove={removeExisting('video_file')}
            />
          ) : (
            <MediaPickRow
              stack
              icon="🎬"
              text="Drop video or click to upload"
              hint="MP4/WebM · max 100MB · recommended 1920×1080"
              kinds={['video']}
              maxSizeMB={100}
              disabled={isSubmitting}
              onFiles={replaceSingle('video_file')}
              onPick={pickSingle('video_file')}
            />
          )}

          <MediaSectionLabel className="mt-4 @mobile:mt-5">Preview Thumbnail</MediaSectionLabel>
          {thumbFile ? (
            <MediaPreview
              url={thumbFile.url}
              kind="image"
              name={thumbFile.file.name}
              meta={fmtFileSize(thumbFile.file.size)}
              onRemove={removeSingle('video_thumbnail_file')}
            />
          ) : thumbPick ? (
            <MediaPreview
              url={adminMediaUrl(thumbPick) ?? ''}
              kind="image"
              name={thumbPick.name ?? 'Library thumbnail'}
              meta={thumbPick.meta ?? ''}
              onRemove={removeSingle('video_thumbnail_file')}
            />
          ) : existingThumbUrl && !thumbRemoved ? (
            <MediaPreview
              url={existingThumbUrl}
              kind="image"
              name={hero?.video_thumbnail?.name ?? hero?.video_thumbnail?.filename ?? 'Current thumbnail'}
              meta={hero?.video_thumbnail?.filetype ?? ''}
              onRemove={removeExisting('video_thumbnail_file')}
            />
          ) : (
            <MediaPickRow
              stack
              icon="🖼️"
              text="Upload thumbnail image"
              hint="Shown before video loads"
              compact
              kinds={['image']}
              maxSizeMB={5}
              disabled={isSubmitting}
              onFiles={replaceSingle('video_thumbnail_file')}
              onPick={pickSingle('video_thumbnail_file')}
            />
          )}
        </div>
      </div>

      <div className={heroType === 'carousel' ? '' : 'hidden'} data-field={heroType === 'carousel' ? 'type' : undefined}>
        <div className="p-5">
          <MediaSectionLabel>
            Carousel Slides{' '}
            <Badge color="gray" className="ml-1.5 text-[11px]">
              {slides.length} of {MAX_SLIDES}
            </Badge>
          </MediaSectionLabel>
          <HeroSlideGrid
            slides={slides}
            disabled={isSubmitting}
            onChange={(next) => setValue('slides', next, { shouldDirty: true })}
            onRemove={removeSlide}
          >
            {slidesLeft > 0 && (
              <>
                <DropZone
                  icon="+"
                  text="Add slides"
                  compact
                  kinds={['image']}
                  maxFiles={MAX_SLIDES}
                  maxSizeMB={5}
                  disabled={isSubmitting}
                  onFiles={addSlides}
                  className="flex aspect-[4/3] w-[calc(33.333%-7px)] min-w-0 flex-none flex-col items-center justify-center @mobile:w-[calc(20%-8px)]"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setSlidePickOpen(true)}
                  className="flex aspect-[4/3] w-[calc(33.333%-7px)] min-w-0 flex-none cursor-pointer flex-col items-center justify-center gap-1.5 rounded-card border-2 border-dashed border-line-2 bg-transparent p-3 text-center transition-all hover:border-accent hover:bg-accent-bg disabled:cursor-not-allowed disabled:opacity-50 @mobile:w-[calc(20%-8px)] @mobile:p-4"
                >
                  <IconImage size={18} className="text-ink-3" />
                  <span className="block text-[13px] text-ink-2">From library</span>
                </button>
              </>
            )}
          </HeroSlideGrid>
          <PickMediaModal
            open={slidePickOpen}
            onClose={() => setSlidePickOpen(false)}
            multiple
            onPickMany={addSlidesFromLibrary}
            kinds={['image']}
          />
          <p className="mt-2.5 text-[11px] text-ink-3">Drag to reorder · JPG/WebP · max 5MB each</p>
          <div className="mt-3 flex items-center gap-5 border-t border-line pt-3.5">
            <div className="flex flex-row items-center gap-2.5">
              <Toggle on={autoplay} onClick={() => setValue('autoplay', !autoplay, { shouldDirty: true })} />
              <label>Autoplay</label>
            </div>
            <FormGroup label="Slide duration (seconds)">
              <Input type="text" style={{ width: 80 }} {...register('slide_duration_seconds')} />
            </FormGroup>
          </div>
        </div>
      </div>

      <HeroCtaFields register={register} errors={errors} />
      </fieldset>
    </SectionCard>
  );
}

export function HeroBlock() {
  return <SiteLoader>{(site) => <HeroForm site={site} />}</SiteLoader>;
}
