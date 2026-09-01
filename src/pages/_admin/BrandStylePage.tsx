import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { showToast } from '@/lib/toast';
import { brand } from '@/lib/brand';
import { errorSummary, scrollToFirstError, VALIDATE_ON_SUBMIT } from '@/lib/form-errors';
import { fmtFileSize, releaseLocalFile, toLocalFile, type LocalFileType } from '@/lib/files';
import { uploadFilesTus } from '@/lib/tus';
import SiteLoader from '@/features/_admin/site/SiteLoader';
import { useUpdateAdminBrandStyleMutation } from '@/lib/redux/api/admin-api/site/site-mutations';
import { useRegisterAdminMediaMutation } from '@/lib/redux/api/admin-api/media/media-api';
import { adminMediaUrl, type AdminMediaType, type AutobrandSiteType } from '@/lib/redux/api/admin-api/admin-types';
import Badge from '@/components/_admin/ui/Badge';
import Button from '@/components/_admin/ui/Button';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import { MediaPickRow } from '@/components/_admin/MediaRow';
import MediaPreview from '@/components/_admin/MediaPreview';

type AssetStateType = {
  file: LocalFileType | null;
  pick: AdminMediaType | null;
  removed: boolean;
};

type AssetKeyType = 'logo' | 'favicon';

const EMPTY_ASSET: AssetStateType = { file: null, pick: null, removed: false };

const hasAsset = (asset: AssetStateType, existing: AdminMediaType | null | undefined) =>
  !!(asset.file || asset.pick || (existing && !asset.removed));

const fontRowClass = (selected: boolean) =>
  selected
    ? 'flex w-full cursor-pointer items-center gap-2 border-b border-line bg-accent-bg px-5 py-2 text-left @mobile:gap-3 @mobile:py-3'
    : 'flex w-full cursor-pointer items-center gap-2 border-b border-line px-5 py-2 text-left hover:bg-surface-2 @mobile:gap-3 @mobile:py-3';

type RecommendationProps = { children: React.ReactNode };

function Recommendation({ children }: RecommendationProps) {
  return (
    <div className="mt-2.5 rounded-el border border-line bg-surface-2 px-2 py-2.5 text-[11px] text-ink-3 @mobile:px-3">
      <strong className="text-ink-2">Recommendations:</strong> {children}
    </div>
  );
}

type StyleFormValues = { font: string };

type Props = { site: AutobrandSiteType };

function BrandStyleForm({ site }: Props) {
  const style = site.brand_style;
  const [logoAsset, setLogoAsset] = useState<AssetStateType>(EMPTY_ASSET);
  const [faviconAsset, setFaviconAsset] = useState<AssetStateType>(EMPTY_ASSET);
  const [isSavingAssets, setIsSavingAssets] = useState(false);
  const [registerMedia] = useRegisterAdminMediaMutation();
  const [updateBrandStyle] = useUpdateAdminBrandStyleMutation();
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isDirty },
  } = useForm<StyleFormValues>({
    ...VALIDATE_ON_SUBMIT,
    defaultValues: { font: style?.font ?? 'system' },
  });
  const font = watch('font');
  const brandFont = style?.font && style.font !== 'system' ? style.font : null;

  const assetsDirty = [logoAsset, faviconAsset].some((a) => a.file || a.pick || a.removed);

  /**
   * The two assets are staged in component state rather than form values, so
   * they are registered here as fields with no input of their own: the rules
   * read the staged state, and `data-field` on the section gives the scroll a
   * target.
   */
  const {
    register: registerAsset,
    handleSubmit: handleAssetsSubmit,
    formState: { errors: assetErrors },
  } = useForm(VALIDATE_ON_SUBMIT);
  registerAsset('logo', { validate: () => hasAsset(logoAsset, style?.logo) || 'Upload a logo' });
  registerAsset('favicon', { validate: () => hasAsset(faviconAsset, style?.favicon) || 'Upload a favicon' });

  const setterOf: Record<AssetKeyType, typeof setLogoAsset> = { logo: setLogoAsset, favicon: setFaviconAsset };

  const stageFile = (key: AssetKeyType) => (files: File[]) =>
    setterOf[key]((prev) => {
      releaseLocalFile(prev.file);
      return { file: toLocalFile(files[0]), pick: null, removed: false };
    });

  const stagePick = (key: AssetKeyType) => (media: AdminMediaType) =>
    setterOf[key]((prev) => {
      releaseLocalFile(prev.file);
      return { file: null, pick: media, removed: false };
    });

  const uploadAsset = async (local: LocalFileType) => {
    const [id] = await uploadFilesTus([local.file]);
    const entry = await registerMedia({ subdomain: brand.makeSlug, file_id: id, name: local.file.name, kind: 'logo' })
      .unwrap()
      .catch(() => undefined);
    return entry?.file ?? { id };
  };

  const resolveAsset = async (asset: AssetStateType, existing: AdminMediaType | null | undefined) => {
    if (asset.file) return uploadAsset(asset.file);
    if (asset.pick) return asset.pick.file ?? asset.pick;
    if (asset.removed) return null;
    return existing ?? null;
  };

  const onSaveAssets = async () => {
    setIsSavingAssets(true);
    try {
      const logo = await resolveAsset(logoAsset, style?.logo);
      const favicon = await resolveAsset(faviconAsset, style?.favicon);
      await updateBrandStyle({
        subdomain: brand.makeSlug,
        brand_style: { logo, favicon, colors: style?.colors ?? null, font: style?.font ?? null },
      }).unwrap();
      releaseLocalFile(logoAsset.file);
      releaseLocalFile(faviconAsset.file);
      setLogoAsset(EMPTY_ASSET);
      setFaviconAsset(EMPTY_ASSET);
      showToast('✅ Assets saved');
    } catch {
      showToast('⚠️ Could not save assets');
    } finally {
      setIsSavingAssets(false);
    }
  };

  const assetPreview = (key: AssetKeyType, asset: AssetStateType, existing: AdminMediaType | null | undefined) => {
    const set = setterOf[key];
    const clearStaged = () =>
      set((prev) => {
        releaseLocalFile(prev.file);
        return { ...EMPTY_ASSET };
      });
    if (asset.file) {
      return (
        <MediaPreview
          url={asset.file.url}
          kind="image"
          name={asset.file.file.name}
          meta={fmtFileSize(asset.file.file.size)}
          onRemove={clearStaged}
        />
      );
    }
    if (asset.pick) {
      return (
        <MediaPreview
          url={adminMediaUrl(asset.pick) ?? ''}
          kind="image"
          name={asset.pick.name ?? String(asset.pick.id)}
          meta={asset.pick.meta ?? ''}
          onRemove={clearStaged}
        />
      );
    }
    if (existing && !asset.removed) {
      return (
        <MediaPreview
          url={adminMediaUrl(existing) ?? ''}
          kind="image"
          name={existing.name ?? existing.filename ?? String(existing.id)}
          meta={[existing.filetype, existing.width && existing.height ? `${existing.width}×${existing.height}` : null]
            .filter(Boolean)
            .join(' · ')}
          onRemove={() => set((prev) => ({ ...prev, removed: true }))}
        />
      );
    }
    return null;
  };

  const colors = [
    { label: 'Primary', hex: style?.colors?.primary ?? '' },
    { label: 'Background', hex: style?.colors?.background ?? '' },
    { label: 'Text', hex: style?.colors?.text ?? '' },
    { label: 'Secondary', hex: style?.colors?.secondary ?? '' },
  ];

  return (
    <div>
      <SectionCard>
        <SectionHeader
          title={<>Logo &amp; Favicon</>}
          sub="Brand identity assets"
          error={errorSummary(assetErrors)}
          right={
            <Button
              sm
              loading={isSavingAssets}
              disabled={!assetsDirty}
              onClick={handleAssetsSubmit(onSaveAssets, scrollToFirstError)}
            >
              Save
            </Button>
          }
        />
        <fieldset disabled={isSavingAssets} className="contents">
        <div className="border-b border-line p-5" data-field="logo">
          <p className="mb-1 text-xs font-bold tracking-[.06em] text-ink-2 uppercase">Brand Logo</p>
          <p className="mb-3.5 text-xs text-ink-3">Primary logo shown in the site header and on landing pages.</p>
          {assetPreview('logo', logoAsset, style?.logo) ?? (
            <MediaPickRow
              stack
              icon="🖼️"
              text="Drop logo or click to upload"
              hint="SVG preferred · PNG/WebP accepted · transparent background · max 2MB"
              kinds={['logo']}
              maxSizeMB={2}
              disabled={isSavingAssets}
              onFiles={stageFile('logo')}
              onPick={stagePick('logo')}
            />
          )}
          {assetErrors.logo && <p className="mt-1.5 text-[11px] text-red">{String(assetErrors.logo.message)}</p>}
          <Recommendation>
            Use SVG for best quality at all sizes. If using raster formats (PNG, WebP), provide at least 400×200 px at
            2× resolution. Transparent background required.
          </Recommendation>
        </div>
        <div className="p-5" data-field="favicon">
          <p className="mb-1 text-xs font-bold tracking-[.06em] text-ink-2 uppercase">Favicon</p>
          <p className="mb-3.5 text-xs text-ink-3">Shown in browser tabs and bookmarks.</p>
          {assetPreview('favicon', faviconAsset, style?.favicon) ?? (
            <MediaPickRow
              stack
              icon="📌"
              text="Drop favicon or click to upload"
              hint="ICO · PNG · SVG · WebP · 32×32 or 64×64 px recommended · max 500 KB"
              kinds={['favicon']}
              maxSizeMB={0.5}
              disabled={isSavingAssets}
              onFiles={stageFile('favicon')}
              onPick={stagePick('favicon')}
            />
          )}
          {assetErrors.favicon && <p className="mt-1.5 text-[11px] text-red">{String(assetErrors.favicon.message)}</p>}
          <Recommendation>
            Use a square image — 32×32 px minimum, 64×64 px preferred for crisp rendering on high-DPI displays. ICO
            format ensures broadest browser compatibility; SVG favicons are supported in modern browsers. Keep the
            design simple and recognisable at small sizes.
          </Recommendation>
        </div>
        </fieldset>
      </SectionCard>

      <SectionCard>
        <SectionHeader
          title="Brand Colors"
          sub="Used across the landing page UI"
          right={
            <Button sm onClick={() => showToast('✅ Brand colors saved')}>
              Save
            </Button>
          }
        />
        <div className="flex gap-2 p-5 @mobile:gap-3">
          {colors.map((c) => (
            <div key={c.label} className="flex flex-1 flex-col gap-1.5">
              <button
                type="button"
                className="h-12 w-full cursor-pointer rounded-el border border-line transition-transform hover:scale-[1.04]"
                style={{ background: c.hex || 'var(--surface3)' }}
                onClick={() => showToast(`🎨 Color picker — ${c.label}`)}
              />
              <div className="text-[11px] font-medium text-ink-2">
                {c.label}
                <br />
                <span className="font-mono text-[10px]">{c.hex || '—'}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader
          title="Typography"
          sub="Brand font selection"
          right={
            <Button sm disabled={!isDirty} onClick={handleSubmit(() => showToast('✅ Font saved'))}>
              Save
            </Button>
          }
        />
        {brandFont && (
          <button type="button" className={fontRowClass(font === brandFont)} onClick={() => setValue('font', brandFont, { shouldDirty: true })}>
            <span className="block w-[100px] text-xl font-bold text-ink">Aa</span>
            <span className="block">
              <span className="block text-[13px] font-semibold text-ink">{brandFont}</span>
              <span className="block text-xs text-ink-3">Brand font · Uploaded</span>
            </span>
            {font === brandFont && (
              <Badge color="blue" className="ml-auto">
                Selected
              </Badge>
            )}
          </button>
        )}
        <button type="button" className={fontRowClass(font === 'system')} onClick={() => setValue('font', 'system', { shouldDirty: true })}>
          <span
            className="block w-[100px] text-xl font-bold text-ink"
            style={{ fontFamily: 'Helvetica,Arial,sans-serif' }}
          >
            Aa
          </span>
          <span className="block">
            <span className="block text-[13px] font-semibold text-ink">System</span>
            <span className="block text-xs text-ink-3">System font</span>
          </span>
          {font === 'system' && (
            <Badge color="blue" className="ml-auto">
              Selected
            </Badge>
          )}
        </button>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-2 px-5 py-2 text-left hover:bg-surface-2 @mobile:gap-3 @mobile:py-3"
          onClick={() => showToast('📁 Font upload — .woff, .woff2, .ttf')}
        >
          <span className="block w-[100px] text-xl font-bold text-ink-3">+</span>
          <span className="block">
            <span className="block text-[13px] font-semibold text-ink-3">Upload custom font</span>
            <span className="block text-xs text-ink-3">.woff, .woff2, .ttf</span>
          </span>
        </button>
      </SectionCard>
    </div>
  );
}

export default function BrandStylePage() {
  return <SiteLoader>{(site) => <BrandStyleForm site={site} />}</SiteLoader>;
}
