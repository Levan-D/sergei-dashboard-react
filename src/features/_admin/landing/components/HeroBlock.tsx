import { useForm, type UseFormRegister } from 'react-hook-form';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/cn';
import { fmtFileSize, releaseLocalFile, toLocalFile, type LocalFileType } from '@/lib/files';
import { brand } from '@/lib/brand';
import { uploadFilesTus, type TusMediaType } from '@/lib/tus';
import SiteLoader from '@/features/_admin/site/SiteLoader';
import { useUpdateAdminHeroMutation } from '@/lib/redux/api/admin-api/site/site-mutations';
import { useRegisterAdminMediaMutation } from '@/lib/redux/api/admin-api/media/media-api';
import {
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
import { IconImage, IconVideo, IconCarousel } from '@/components/_admin/icons';
import Input from '@/components/_admin/forms/Input';

type SingleFileField = 'image_file' | 'video_file' | 'video_thumbnail_file';

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
  slides: HeroSlideItemType[];
};

type CtaFieldsProps = { register: UseFormRegister<HeroFormValues> };

function HeroCtaFields({ register }: CtaFieldsProps) {
  return (
    <div className="flex flex-wrap gap-3 p-5 @mobile:gap-4">
      <div className="h-px w-full bg-line" />
      <FormGroup label="H1 — Headline" full>
        <Input type="text" placeholder="Main heading" {...register('headline')} />
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
    formState: { isDirty, isSubmitting },
  } = useForm<HeroFormValues>({
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
      slides: seedSlides(site),
    },
  });
  const heroType = watch('type');
  const autoplay = watch('autoplay');
  const imageFile = watch('image_file');
  const videoFile = watch('video_file');
  const thumbFile = watch('video_thumbnail_file');
  const slides = watch('slides');

  const existingImageUrl = adminMediaUrl(hero?.image);
  const existingVideoUrl = adminMediaUrl(hero?.video);
  const existingThumbUrl = adminMediaUrl(hero?.video_thumbnail);

  const replaceSingle = (field: SingleFileField) => (files: File[]) => {
    releaseLocalFile(watch(field));
    setValue(field, toLocalFile(files[0]), { shouldDirty: true });
  };

  const removeSingle = (field: SingleFileField) => () => {
    releaseLocalFile(watch(field));
    setValue(field, null, { shouldDirty: true });
    showToast('🗑️ File removed');
  };

  const addSlides = (files: File[]) => {
    const next = files.map((file, i) => {
      const local = toLocalFile(file);
      return {
        id: `local-${slides.length + i}-${file.name}`,
        name: file.name,
        meta: fmtFileSize(file.size),
        previewUrl: local.url,
        file,
      };
    });
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

  const uploadOne = async (local: LocalFileType | null, mediaType: TusMediaType) => {
    if (!local) return undefined;
    const [id] = await uploadFilesTus([local.file], mediaType);
    await registerMedia({ subdomain: brand.makeSlug, file_id: id })
      .unwrap()
      .catch(() => undefined);
    return { id };
  };

  const mediaRef = (media?: AdminMediaType | null) => (media?.id != null ? { id: media.id } : undefined);

  const onSubmit = async (values: HeroFormValues) => {
    try {
      const image = (await uploadOne(values.image_file, 'image')) ?? mediaRef(hero?.image);
      const video = (await uploadOne(values.video_file, 'video')) ?? mediaRef(hero?.video);
      const thumb = (await uploadOne(values.video_thumbnail_file, 'image')) ?? mediaRef(hero?.video_thumbnail);

      const slidePayload = [];
      for (const slide of values.slides) {
        if (slide.file) {
          const [id] = await uploadFilesTus([slide.file], 'image');
          await registerMedia({ subdomain: brand.makeSlug, file_id: id })
            .unwrap()
            .catch(() => undefined);
          slidePayload.push({ media: { id } });
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
          ...(image ? { image } : {}),
          ...(video ? { video } : {}),
          ...(thumb ? { video_thumbnail: thumb } : {}),
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
        right={
          <Button sm loading={isSubmitting} disabled={!isDirty} onClick={handleSubmit(onSubmit)}>
            Save Changes
          </Button>
        }
      />
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

      <div className={heroType === 'image' ? '' : 'hidden'}>
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
          ) : existingImageUrl ? (
            <MediaPreview
              url={existingImageUrl}
              kind="image"
              name={hero?.image?.name ?? 'Current photo'}
              meta={hero?.image?.filetype ?? ''}
              onRemove={() => showToast('🗑️ Removing saved media is not wired yet')}
            />
          ) : (
            <MediaPickRow
              stack
              icon="🖼️"
              text="Drop image or click to upload"
              hint="1600×900px · JPG/WebP · max 5MB"
              kinds={['image']}
              maxSizeMB={5}
              onFiles={replaceSingle('image_file')}
            />
          )}
        </div>
      </div>

      <div className={heroType === 'video' ? '' : 'hidden'}>
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
          ) : existingVideoUrl ? (
            <MediaPreview
              url={existingVideoUrl}
              kind="video"
              name={hero?.video?.name ?? 'Current video'}
              meta={hero?.video?.filetype ?? ''}
              onRemove={() => showToast('🗑️ Removing saved media is not wired yet')}
            />
          ) : (
            <MediaPickRow
              stack
              icon="🎬"
              text="Drop video or click to upload"
              hint="MP4/WebM · max 100MB · recommended 1920×1080"
              kinds={['video']}
              maxSizeMB={100}
              onFiles={replaceSingle('video_file')}
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
          ) : existingThumbUrl ? (
            <MediaPreview
              url={existingThumbUrl}
              kind="image"
              name={hero?.video_thumbnail?.name ?? 'Current thumbnail'}
              meta={hero?.video_thumbnail?.filetype ?? ''}
              onRemove={() => showToast('🗑️ Removing saved media is not wired yet')}
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
              onFiles={replaceSingle('video_thumbnail_file')}
            />
          )}
        </div>
      </div>

      <div className={heroType === 'carousel' ? '' : 'hidden'}>
        <div className="p-5">
          <MediaSectionLabel>
            Carousel Slides{' '}
            <Badge color="gray" className="ml-1.5 text-[11px]">
              {slides.length} slide{slides.length !== 1 ? 's' : ''}
            </Badge>
          </MediaSectionLabel>
          <HeroSlideGrid slides={slides} onChange={(next) => setValue('slides', next, { shouldDirty: true })} onRemove={removeSlide}>
            <DropZone
              icon="+"
              text="Add slides"
              compact
              kinds={['image']}
              maxFiles={10}
              maxSizeMB={5}
              onFiles={addSlides}
              className="flex aspect-[4/3] w-[calc(33.333%-7px)] min-w-0 flex-none flex-col items-center justify-center @mobile:w-[calc(20%-8px)]"
            />
          </HeroSlideGrid>
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

      <HeroCtaFields register={register} />
    </SectionCard>
  );
}

export function HeroBlock() {
  return <SiteLoader>{(site) => <HeroForm site={site} />}</SiteLoader>;
}
