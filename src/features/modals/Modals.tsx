import { useState, type ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeModal, showToast } from '@/store/uiSlice';
import { cn } from '@/lib/cn';
import { Button, Chip, FormGroup, UploadZone } from '@/components/ui';
import { IconImage } from '@/components/icons';
import { mediaFiles } from '@/features/media/data';

function ModalShell({
  title,
  sub,
  footer,
  width,
  children,
}: {
  title: string;
  sub?: string;
  footer: ReactNode;
  width?: number;
  children: ReactNode;
}) {
  const dispatch = useAppDispatch();
  return (
    <div
      className="max-h-[82vh] overflow-y-auto rounded-[14px] border border-line bg-surface"
      style={{ width: width ?? 540, maxWidth: '90vw' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="sticky top-0 z-[1] flex items-center justify-between border-b border-line bg-surface px-6 py-5">
        <div>
          <div className="text-base font-bold text-ink">{title}</div>
          {sub && <div className="mt-0.5 text-xs text-ink-3">{sub}</div>}
        </div>
        <button
          onClick={() => dispatch(closeModal())}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] border-none bg-transparent p-1 text-xl text-ink-3 hover:bg-surface-2 hover:text-ink"
        >
          ✕
        </button>
      </div>
      {children}
      <div className="sticky bottom-0 flex justify-end gap-2 border-t border-line bg-surface px-6 py-4">{footer}</div>
    </div>
  );
}

function CancelButton() {
  const dispatch = useAppDispatch();
  return (
    <Button variant="ghost" onClick={() => dispatch(closeModal())}>
      Cancel
    </Button>
  );
}

function AddModelModal() {
  const dispatch = useAppDispatch();
  const done = (msg: string) => {
    dispatch(closeModal());
    dispatch(showToast(msg));
  };
  return (
    <ModalShell
      title="Add Model"
      footer={
        <>
          <CancelButton />
          <Button onClick={() => done('✅ Model saved successfully')}>Save Model</Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4 p-5">
        <FormGroup label="Model Name">
          <input type="text" placeholder="e.g. BMW M5" />
        </FormGroup>
        <FormGroup label="Production Years">
          <input type="text" placeholder="e.g. 2021 – Present" />
        </FormGroup>
        <FormGroup label="Description" full>
          <textarea rows={3} placeholder="Model description..." />
        </FormGroup>
        <FormGroup label="Body Type">
          <select>
            <option>Sedan</option>
            <option>Coupe</option>
            <option>SAV</option>
            <option>Convertible</option>
            <option>Touring</option>
          </select>
        </FormGroup>
        <FormGroup label="Power Type">
          <select>
            <option>Combustion</option>
            <option>Electric</option>
            <option>Hybrid</option>
          </select>
        </FormGroup>
        <FormGroup label="Main Image" full>
          <UploadZone
            icon="🖼️"
            text="Upload model image"
            hint="JPG, WebP · max 5MB"
            onClick={() => dispatch(showToast('📁 File picker opened'))}
          />
        </FormGroup>
        <FormGroup label="External Links" full>
          <div className="flex flex-col gap-2">
            <input type="url" placeholder="Buy car link" />
            <input type="url" placeholder="Official site link" />
            <input type="url" placeholder="Configurator link" />
          </div>
        </FormGroup>
      </div>
    </ModalShell>
  );
}

function EditGenModal() {
  const dispatch = useAppDispatch();
  return (
    <ModalShell
      title="Edit Generation — BMW M4 G82"
      footer={
        <>
          <CancelButton />
          <Button
            onClick={() => {
              dispatch(closeModal());
              dispatch(showToast('✅ Generation saved'));
            }}
          >
            Save Changes
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4 p-5">
        <FormGroup label="Generation Name">
          <input type="text" defaultValue="BMW M4 G82" />
        </FormGroup>
        <FormGroup label="Years">
          <input type="text" defaultValue="2020 – Present" />
        </FormGroup>
        <FormGroup label="Description" full>
          <textarea
            rows={3}
            defaultValue="The G82 M4 features the S58 engine producing 480hp in Competition trim, with available xDrive all-wheel drive."
          />
        </FormGroup>
        <FormGroup label="Main Image" full>
          <UploadZone
            icon="📷"
            text="Change generation image"
            onClick={() => dispatch(showToast('📁 File picker opened'))}
          />
        </FormGroup>
        <FormGroup label="External Links" full>
          <div className="flex flex-col gap-2">
            <input type="url" placeholder="Buy car link" defaultValue="https://bmw.com/buy/m4" />
            <input type="url" placeholder="Buy parts" defaultValue="https://bmw-parts.com" />
          </div>
        </FormGroup>
      </div>
    </ModalShell>
  );
}

function AddGenModal() {
  const dispatch = useAppDispatch();
  return (
    <ModalShell
      title="Add Generation"
      footer={
        <>
          <CancelButton />
          <Button
            onClick={() => {
              dispatch(closeModal());
              dispatch(showToast('✅ Generation added'));
            }}
          >
            Add Generation
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4 p-5">
        <FormGroup label="Generation Name">
          <input type="text" placeholder="e.g. BMW M4 G82 CS" />
        </FormGroup>
        <FormGroup label="Years">
          <input type="text" placeholder="e.g. 2023 – Present" />
        </FormGroup>
        <FormGroup label="Description" full>
          <textarea rows={2} placeholder="Generation description..." />
        </FormGroup>
        <FormGroup label="Main Image" full>
          <UploadZone icon="🖼️" text="Upload image" onClick={() => dispatch(showToast('📁 File picker opened'))} />
        </FormGroup>
      </div>
    </ModalShell>
  );
}

function InviteUserModal() {
  const dispatch = useAppDispatch();
  return (
    <ModalShell
      title="Invite User"
      width={420}
      footer={
        <>
          <CancelButton />
          <Button
            onClick={() => {
              dispatch(closeModal());
              dispatch(showToast('📧 Invitation sent!'));
            }}
          >
            Send Invitation
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 p-5">
        <FormGroup label="Full Name">
          <input type="text" placeholder="e.g. John Smith" />
        </FormGroup>
        <FormGroup label="Email Address">
          <input type="email" placeholder="john@company.com" />
        </FormGroup>
        <FormGroup label="Role">
          <select>
            <option>Admin</option>
            <option>Super Admin</option>
          </select>
        </FormGroup>
        <div className="rounded-el bg-surface-2 p-3 text-xs text-ink-3">
          A temporary password will be sent to this email. The user must change it on first login.
        </div>
      </div>
    </ModalShell>
  );
}

function EditRoleModal() {
  const dispatch = useAppDispatch();
  return (
    <ModalShell
      title="Edit Role — Max Richter"
      width={360}
      footer={
        <>
          <CancelButton />
          <Button
            onClick={() => {
              dispatch(closeModal());
              dispatch(showToast('✅ Role updated'));
            }}
          >
            Save
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 p-5">
        <FormGroup label="Role">
          <select>
            <option>Admin</option>
            <option>Super Admin</option>
          </select>
        </FormGroup>
      </div>
    </ModalShell>
  );
}

function ImportSpecsModal() {
  const dispatch = useAppDispatch();
  return (
    <ModalShell
      title="Import Specifications from Excel"
      sub="Upload a filled template to auto-populate specs"
      width={480}
      footer={
        <>
          <CancelButton />
          <Button
            onClick={() => {
              dispatch(closeModal());
              dispatch(showToast('✅ Specs imported from Excel'));
            }}
          >
            Import
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-3 rounded-card border border-line bg-surface-2 p-3.5">
          <div className="text-2xl">📄</div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-ink">Download template first</div>
            <div className="mt-0.5 text-xs text-ink-3">Fill in your specs data, then upload the file below</div>
          </div>
          <Button variant="ghost" sm onClick={() => dispatch(showToast('📥 specs-template.xlsx downloading...'))}>
            Download
          </Button>
        </div>
        <UploadZone
          icon="📊"
          text="Drop your filled Excel file here"
          hint=".xlsx · max 10MB"
          onClick={() => dispatch(showToast('📁 File picker opened — select .xlsx'))}
        />
        <div className="rounded-el bg-surface-2 px-3 py-2.5 text-xs text-ink-3">
          ⚠️ Importing will overwrite all existing specs for this generation. This cannot be undone.
        </div>
      </div>
    </ModalShell>
  );
}

const mediaFilters = ['All', 'Images', 'Videos', 'Logos'];

function PickMediaModal() {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  return (
    <ModalShell
      title="Media Library"
      sub="Select a file to insert into the hero block"
      width={680}
      footer={
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-ink-3">
            <IconImage size={13} />
            {selected ? `Selected: ${selected}` : 'No file selected'}
          </div>
          <div className="flex gap-2">
            <CancelButton />
            <Button
              disabled={!selected}
              style={{ opacity: selected ? 1 : 0.5, cursor: selected ? 'pointer' : 'not-allowed' }}
              onClick={() => {
                if (!selected) return;
                dispatch(closeModal());
                dispatch(showToast(`✅ ${selected} inserted`));
              }}
            >
              Choose
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex gap-2 border-b border-line px-5 py-3">
        {mediaFilters.map((f) => (
          <Chip
            key={f}
            label={f}
            active={filter === f}
            onClick={() => {
              setFilter(f);
              dispatch(showToast(`🔍 Filtered: ${f === 'All' ? 'All files' : f.toLowerCase()}`));
            }}
          />
        ))}
      </div>
      <div className="grid max-h-[420px] grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3 overflow-y-auto p-5">
        {mediaFiles.map((f) => (
          <div
            key={f.name}
            onClick={() => setSelected(f.name)}
            className={cn(
              'relative cursor-pointer overflow-hidden rounded-el border bg-surface-2 transition-all duration-150',
              selected === f.name
                ? "border-accent shadow-[0_0_0_2px_var(--accent-bg)] after:absolute after:top-1 after:right-1 after:flex after:h-[18px] after:w-[18px] after:items-center after:justify-center after:rounded-full after:bg-accent after:text-[10px] after:font-bold after:text-white after:content-['✓']"
                : 'border-line hover:-translate-y-px hover:border-line-2',
            )}
          >
            <div className="flex h-[90px] items-center justify-center text-[22px]" style={{ background: f.bg }}>
              {f.emoji}
            </div>
            <div className="px-2.5 py-2">
              <div className="overflow-hidden text-xs font-semibold text-ellipsis whitespace-nowrap text-ink">
                {f.name}
              </div>
              <div className="text-[11px] text-ink-3">{f.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </ModalShell>
  );
}

export default function Modals() {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((s) => s.ui.modal);

  return (
    <div
      onClick={() => dispatch(closeModal())}
      className={cn(
        'fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 backdrop-blur-[4px] transition-opacity duration-200',
        modal ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      {modal === 'add-model' && <AddModelModal />}
      {modal === 'edit-gen' && <EditGenModal />}
      {modal === 'add-gen' && <AddGenModal />}
      {modal === 'invite-user' && <InviteUserModal />}
      {modal === 'edit-role' && <EditRoleModal />}
      {modal === 'import-specs' && <ImportSpecsModal />}
      {modal === 'pick-media' && <PickMediaModal />}
    </div>
  );
}
