import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { initModelEditor, updateModelEditor } from '@/features/_admin/catalog/catalogSlice';
import Chip from '@/components/_admin/ui/Chip';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Select from '@/components/_admin/forms/Select';
import { MediaPickRow } from '@/components/_admin/MediaRow';
import { ExternalLinksSection, GallerySection, InfoCard, PublishCard } from '@/features/_admin/editor/EditorShared';
import Input from '@/components/_admin/forms/Input';
import Textarea from '@/components/_admin/forms/Textarea';

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
    <div className="flex h-auto items-start gap-5 @max-mobile:flex-col">
      {/* LEFT COLUMN */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 @max-mobile:w-full @mobile:gap-4 [&>div]:mb-0">
        <SectionCard>
          <SectionHeader title="Basic Information" />
          <div className="flex flex-wrap gap-3 p-5 @mobile:gap-4">
            <FormGroup half label="Model Name">
              <Input
                type="text"
                placeholder="e.g. BMW M4"
                value={editor.name}
                onChange={(e) => dispatch(updateModelEditor({ name: e.target.value }))}
              />
            </FormGroup>
            <FormGroup half label="Production Years">
              <Input
                type="text"
                placeholder="e.g. 2014 – Present"
                value={editor.years}
                onChange={(e) => dispatch(updateModelEditor({ years: e.target.value }))}
              />
            </FormGroup>
            <FormGroup half label="Body Type">
              <Select
                placeholder="— Select —"
                options={[
                  'Sedan',
                  'Coupe',
                  'SAV',
                  'Convertible',
                  'Roadster',
                  'Touring',
                  'Compact',
                  'Hatchback',
                  'Other',
                ]}
              />
            </FormGroup>
            <FormGroup half label="Power Type">
              <Select placeholder="— Select —" options={['Combustion', 'Electric', 'Hybrid', 'Plug-in Hybrid']} />
            </FormGroup>
            <FormGroup label="Description" full hint="Markdown supported">
              <Textarea
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
        <PublishCard saveLabel="Save Model" savedToast="✅ Model saved" className="@max-mobile:order-last" />

        <SectionCard className="mb-0">
          <SectionHeader compact title="Series" />
          <div className="px-3 py-3.5 @mobile:px-4">
            <Select
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
