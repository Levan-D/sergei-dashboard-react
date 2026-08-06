import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { initGenEditor, updateGenEditor } from '@/features/_admin/catalog/catalogSlice';
import { genData } from '@/features/_admin/catalog/data';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Select from '@/components/_admin/forms/Select';
import { MediaPickRow } from '@/components/_admin/MediaRow';
import { ExternalLinksSection, GallerySection, InfoCard, PublishCard } from '@/features/_admin/editor/EditorShared';
import SpecsEditor from '@/features/_admin/specs/SpecsEditor';
import Input from '@/components/_admin/forms/Input';
import Textarea from '@/components/_admin/forms/Textarea';

export default function GenEditorPage() {
  const dispatch = useAppDispatch();
  const { name } = useParams();
  const editor = useAppSelector((s) => s.catalog.genEditor);
  const models = useAppSelector((s) => s.catalog.models);

  // Seed the editor from the URL param on direct navigation / reload.
  useEffect(() => {
    const target = name === 'new' ? null : decodeURIComponent(name ?? '');
    const current = editor.isNew ? null : editor.name;
    if (target !== current) {
      const parent = target
        ? (Object.keys(genData).find((m) => genData[m].some((g) => g.name === target)) ?? '')
        : editor.model;
      dispatch(initGenEditor({ name: target, model: parent }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <div className="grid h-auto grid-cols-[1fr_260px] items-start gap-5">
      {/* LEFT COLUMN */}
      <div className="flex min-w-0 flex-col gap-3 md:gap-4 [&>div]:mb-0">
        <SectionCard>
          <SectionHeader title="Basic Information" />
          <div className="grid grid-cols-2 gap-3 p-5 md:gap-4">
            <FormGroup label="Generation Name">
              <Input
                type="text"
                placeholder="e.g. BMW M4 G82"
                value={editor.name}
                onChange={(e) => dispatch(updateGenEditor({ name: e.target.value }))}
              />
            </FormGroup>
            <FormGroup label="Production Years">
              <Input
                type="text"
                placeholder="e.g. 2020 – Present"
                value={editor.years}
                onChange={(e) => dispatch(updateGenEditor({ years: e.target.value }))}
              />
            </FormGroup>
            <FormGroup label="Parent Model" full>
              <Select
                placeholder="— Select model —"
                value={editor.model}
                onChange={(v) => dispatch(updateGenEditor({ model: v }))}
                options={models.map((m) => m.name)}
              />
            </FormGroup>
            <FormGroup label="Description" full hint="Markdown supported">
              <Textarea
                rows={4}
                placeholder="Describe this generation — key changes, facelift details, performance specs overview..."
                value={editor.desc}
                onChange={(e) => dispatch(updateGenEditor({ desc: e.target.value }))}
              />
            </FormGroup>
          </div>
        </SectionCard>

        <SectionCard>
          <SectionHeader title="Generation Overview" sub="Displayed in the overview section of the generation page" />
          <div className="grid grid-cols-2 gap-3 p-5 md:gap-4">
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
            <MediaPickRow icon="🖼️" text="Drop image or click to upload" hint="JPG / WebP · min 800×533 · max 5MB" />
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
      <div className="flex flex-col gap-2 md:gap-3">
        <PublishCard saveLabel="Save Generation" savedToast="✅ Generation saved" />
        <InfoCard
          rows={[
            { label: 'Logbooks', value: '147' },
            { label: 'Modifications', value: '1' },
            { label: 'Last edited', value: '5h ago', muted: true },
          ]}
        />
      </div>
    </div>
  );
}
