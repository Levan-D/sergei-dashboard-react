import { useState } from 'react';
import { useAppDispatch } from '@/store';
import { showToast } from '@/store/uiSlice';
import { Badge, Button, SectionCard, SectionHeader } from '@/components/ui';
import { CurrentMedia, MediaPickRow } from '@/components/MediaRow';

const colors = [
  { label: 'Primary', hex: '#1C69D4' },
  { label: 'Background', hex: '#000000' },
  { label: 'Text', hex: '#FFFFFF' },
  { label: 'Secondary', hex: '#6F6F6F' },
];

function Recommendation({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2.5 rounded-el border border-line bg-surface-2 px-3 py-2.5 text-[11px] text-ink-3">
      <strong className="text-ink-2">Recommendations:</strong> {children}
    </div>
  );
}

export default function BrandStylePage() {
  const dispatch = useAppDispatch();
  const [logoVisible, setLogoVisible] = useState(true);

  return (
    <div>
      <SectionCard>
        <SectionHeader
          title={<>Logo &amp; Favicon</>}
          sub="Brand identity assets"
          right={
            <Button sm onClick={() => dispatch(showToast('✅ Assets saved'))}>
              Save
            </Button>
          }
        />
        <div className="border-b border-line p-5">
          <div className="mb-1 text-xs font-bold tracking-[.06em] text-ink-2 uppercase">Brand Logo</div>
          <div className="mb-3.5 text-xs text-ink-3">Primary logo shown in the site header and on landing pages.</div>
          <MediaPickRow
            icon="🖼️"
            text="Drop logo or click to upload"
            hint="SVG preferred · PNG/WebP accepted · transparent background · max 2MB"
          />
          {logoVisible && (
            <CurrentMedia
              emoji="🔵"
              bg="#f1f5f9"
              name="bmw-logo.svg"
              meta="12 KB · SVG · Vector"
              onRemove={() => {
                setLogoVisible(false);
                dispatch(showToast('🗑️ Logo removed'));
              }}
            />
          )}
          <Recommendation>
            Use SVG for best quality at all sizes. If using raster formats (PNG, WebP), provide at least 400×200 px at
            2× resolution. Transparent background required.
          </Recommendation>
        </div>
        <div className="p-5">
          <div className="mb-1 text-xs font-bold tracking-[.06em] text-ink-2 uppercase">Favicon</div>
          <div className="mb-3.5 text-xs text-ink-3">Shown in browser tabs and bookmarks.</div>
          <MediaPickRow
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
            <Button sm onClick={() => dispatch(showToast('✅ Brand colors saved'))}>
              Save
            </Button>
          }
        />
        <div className="grid grid-cols-4 gap-3 p-5">
          {colors.map((c) => (
            <div key={c.label} className="flex flex-col gap-1.5">
              <div
                className="h-12 w-full cursor-pointer rounded-el border border-line transition-transform duration-100 hover:scale-[1.04]"
                style={{ background: c.hex }}
                onClick={() => dispatch(showToast(`🎨 Color picker — ${c.label}`))}
              />
              <div className="text-[11px] font-medium text-ink-2">
                {c.label}
                <br />
                <span className="font-mono text-[10px]">{c.hex}</span>
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
            <Button sm onClick={() => dispatch(showToast('✅ Font saved'))}>
              Save
            </Button>
          }
        />
        <div
          className="flex cursor-pointer items-center gap-3 border-b border-line bg-accent-bg px-5 py-3"
          onClick={() => dispatch(showToast('✅ BMW Type Next selected'))}
        >
          <div className="w-[100px] text-xl font-bold text-ink">Aa</div>
          <div>
            <div className="text-[13px] font-semibold text-ink">BMW Type Next</div>
            <div className="text-xs text-ink-3">Brand font · Uploaded</div>
          </div>
          <Badge color="blue" className="ml-auto">
            Selected
          </Badge>
        </div>
        <div
          className="flex cursor-pointer items-center gap-3 border-b border-line px-5 py-3 hover:bg-surface-2"
          onClick={() => dispatch(showToast('✅ Helvetica Neue selected'))}
        >
          <div className="w-[100px] text-xl font-bold text-ink" style={{ fontFamily: 'Helvetica,Arial,sans-serif' }}>
            Aa
          </div>
          <div>
            <div className="text-[13px] font-semibold text-ink">Helvetica Neue</div>
            <div className="text-xs text-ink-3">System font</div>
          </div>
        </div>
        <div
          className="flex cursor-pointer items-center gap-3 px-5 py-3 hover:bg-surface-2"
          onClick={() => dispatch(showToast('📁 Font upload — .woff, .woff2, .ttf'))}
        >
          <div className="w-[100px] text-xl font-bold text-ink-3">+</div>
          <div>
            <div className="text-[13px] font-semibold text-ink-3">Upload custom font</div>
            <div className="text-xs text-ink-3">.woff, .woff2, .ttf</div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
