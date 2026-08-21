import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { showToast } from '@/lib/toast';
import SiteLoader from '@/features/_admin/site/SiteLoader';
import type { AutobrandSiteType } from '@/lib/redux/api/admin-api/admin-types';
import Badge from '@/components/_admin/ui/Badge';
import Button from '@/components/_admin/ui/Button';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import { CurrentMedia, MediaPickRow } from '@/components/_admin/MediaRow';

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
  const logo = style?.logo;
  const [logoRemoved, setLogoRemoved] = useState(false);
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isDirty },
  } = useForm<StyleFormValues>({
    defaultValues: { font: style?.font ?? 'system' },
  });
  const font = watch('font');
  const brandFont = style?.font && style.font !== 'system' ? style.font : null;

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
          right={
            <Button sm disabled={!logoRemoved} onClick={() => showToast('✅ Assets saved')}>
              Save
            </Button>
          }
        />
        <div className="border-b border-line p-5">
          <p className="mb-1 text-xs font-bold tracking-[.06em] text-ink-2 uppercase">Brand Logo</p>
          <p className="mb-3.5 text-xs text-ink-3">Primary logo shown in the site header and on landing pages.</p>
          <MediaPickRow
            stack
            icon="🖼️"
            text="Drop logo or click to upload"
            hint="SVG preferred · PNG/WebP accepted · transparent background · max 2MB"
          />
          {logo && !logoRemoved && (
            <CurrentMedia
              emoji="🔵"
              bg="#f1f5f9"
              name={logo.name ?? `logo #${logo.id}`}
              meta={[logo.filetype, logo.width && logo.height ? `${logo.width}×${logo.height}` : null]
                .filter(Boolean)
                .join(' · ')}
              onRemove={() => {
                setLogoRemoved(true);
                showToast('🗑️ Logo removed');
              }}
            />
          )}
          <Recommendation>
            Use SVG for best quality at all sizes. If using raster formats (PNG, WebP), provide at least 400×200 px at
            2× resolution. Transparent background required.
          </Recommendation>
        </div>
        <div className="p-5">
          <p className="mb-1 text-xs font-bold tracking-[.06em] text-ink-2 uppercase">Favicon</p>
          <p className="mb-3.5 text-xs text-ink-3">Shown in browser tabs and bookmarks.</p>
          <MediaPickRow
            stack
            icon="📌"
            text="Drop favicon or click to upload"
            hint="ICO · PNG · SVG · 32×32 or 64×64 px recommended · max 500 KB"
          />
          <Recommendation>
            Use a square image — 32×32 px minimum, 64×64 px preferred for crisp rendering on high-DPI displays. ICO
            format ensures broadest browser compatibility; SVG favicons are supported in modern browsers. Keep the
            design simple and recognisable at small sizes.
          </Recommendation>
        </div>
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
