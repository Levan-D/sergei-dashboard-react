import Modal from '@/components/_admin/Modal';
import { showToast } from '@/lib/toast';
import Button from '@/components/_admin/ui/Button';
import UploadZone from '@/components/_admin/forms/UploadZone';

type Props = { open: boolean; onClose: () => void };

export default function ImportSpecsModal({ open, onClose }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Import Specifications from Excel"
      sub="Upload a filled template to auto-populate specs"
      width={480}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onClose();
              showToast('✅ Specs imported from Excel');
            }}
          >
            Import
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3 p-5 md:gap-4">
        <div className="flex items-center gap-2 rounded-card border border-line bg-surface-2 p-3.5 md:gap-3">
          <div className="text-2xl">📄</div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-ink">Download template first</div>
            <div className="mt-0.5 text-xs text-ink-3">Fill in your specs data, then upload the file below</div>
          </div>
          <Button variant="ghost" sm onClick={() => showToast('📥 specs-template.xlsx downloading...')}>
            Download
          </Button>
        </div>
        <UploadZone
          icon="📊"
          text="Drop your filled Excel file here"
          hint=".xlsx · max 10MB"
          onClick={() => showToast('📁 File picker opened — select .xlsx')}
        />
        <div className="rounded-el bg-surface-2 px-2 py-2.5 text-xs text-ink-3 md:px-3">
          ⚠️ Importing will overwrite all existing specs for this generation. This cannot be undone.
        </div>
      </div>
    </Modal>
  );
}
