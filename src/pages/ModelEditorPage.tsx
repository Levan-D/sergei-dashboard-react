import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { initModelEditor, updateModelEditor } from '@/features/catalog/catalogSlice';
import { Chip, FormGroup, SectionCard, SectionHeader } from '@/components/ui';
import { MediaPickRow } from '@/components/MediaRow';
import { ExternalLinksSection, GallerySection, InfoCard, PublishCard } from '@/features/editor/EditorShared';

const decades = ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

export default function ModelEditorPage() {
  const dispatch = useAppDispatch();
  const { name } = useParams();
  const editor = useAppSelector((s) => s.catalog.modelEditor);
  const [activeDecades, setActiveDecades] = useState<Record<string, boolean>>({ '2020s': true });

  // Seed the editor from the URL param on direct navigation / reload.
  useEffect(() => {
    const target = name === 'new' ? null : decodeURIComponent(name ?? '');
    const current = editor.isNew ? null : editor.name;
    if (target !== current) dispatch(initModelEditor(target));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <div className="grid h-auto grid-cols-[1fr_260px] items-start gap-5">
      {/* LEFT COLUMN */}
      <div className="flex min-w-0 flex-col gap-4 [&>div]:mb-0">
        <SectionCard>
          <SectionHeader title="Basic Information" />
          <div className="grid grid-cols-2 gap-4 p-5">
            <FormGroup label="Model Name">
              <input
                type="text"
                placeholder="e.g. BMW M4"
                value={editor.name}
                onChange={(e) => dispatch(updateModelEditor({ name: e.target.value }))}
              />
            </FormGroup>
            <FormGroup label="Production Years">
              <input
                type="text"
                placeholder="e.g. 2014 – Present"
                value={editor.years}
                onChange={(e) => dispatch(updateModelEditor({ years: e.target.value }))}
              />
            </FormGroup>
            <FormGroup label="Body Type">
              <select defaultValue="">
                <option value="">— Select —</option>
                <option>Sedan</option>
                <option>Coupe</option>
                <option>SAV</option>
                <option>Convertible</option>
                <option>Roadster</option>
                <option>Touring</option>
                <option>Compact</option>
                <option>Hatchback</option>
                <option>Other</option>
              </select>
            </FormGroup>
            <FormGroup label="Power Type">
              <select defaultValue="">
                <option value="">— Select —</option>
                <option>Combustion</option>
                <option>Electric</option>
                <option>Hybrid</option>
                <option>Plug-in Hybrid</option>
              </select>
            </FormGroup>
            <FormGroup label="Description" full hint="Markdown supported">
              <textarea
                rows={5}
                placeholder="Describe this model — its history, key features, generations overview..."
                value={editor.desc}
                onChange={(e) => dispatch(updateModelEditor({ desc: e.target.value }))}
              />
            </FormGroup>
          </div>
        </SectionCard>

        <SectionCard>
          <SectionHeader title="Model Overview" sub="Displayed in the overview section of the model page" />
          <div className="grid grid-cols-2 gap-4 p-5">
            <FormGroup label="Overview Text" full hint="Markdown supported">
              <textarea
                rows={6}
                placeholder="Write a comprehensive overview of this model — its place in the lineup, what makes it special, key attributes and target audience..."
              />
            </FormGroup>
          </div>
        </SectionCard>

        <SectionCard>
          <SectionHeader title="Main Image" sub="Primary photo shown in the catalog grid and model card" />
          <div className="p-5">
            <MediaPickRow icon="🖼️" text="Drop image or click to upload" hint="JPG / WebP · min 800×533 · max 5MB" />
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
      <div className="flex flex-col gap-3">
        <PublishCard saveLabel="Save Model" savedToast="✅ Model saved" />

        <SectionCard className="mb-0">
          <SectionHeader compact title="Series" />
          <div className="px-4 py-3.5">
            <select defaultValue="" className="w-full">
              <option value="">— Select series —</option>
              <option>1 Series</option>
              <option>2 Series</option>
              <option>3 Series</option>
              <option>4 Series</option>
              <option>5 Series</option>
              <option>6 Series</option>
              <option>7 Series</option>
              <option>X Series</option>
              <option>M Division</option>
              <option>i Series (Electric)</option>
            </select>
          </div>
        </SectionCard>

        <SectionCard className="mb-0">
          <SectionHeader compact title="Decade" />
          <div className="flex flex-wrap gap-1.5 px-4 py-3.5">
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

        {!editor.isNew && (
          <InfoCard
            rows={[
              { label: 'Generations', value: '3' },
              { label: 'Logbooks', value: '284' },
              { label: 'Last edited', value: '2h ago', muted: true },
            ]}
          />
        )}
      </div>
    </div>
  );
}
