import Modal from '@/components/_admin/Modal';
import Button from '@/components/_admin/ui/Button';

type Props = {
  open: boolean;
  title: string;
  description: string | string[];
  actionLabel: string;
  /** Defaults to `danger`; pass `secondary` when the action is not destructive. */
  actionVariant?: 'danger' | 'secondary';
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

/** Confirmation gate for destructive actions — deactivations, restores, deletions. */
export default function ConfirmModal({
  open,
  title,
  description,
  actionLabel,
  actionVariant = 'danger',
  loading,
  onConfirm,
  onClose,
}: Props) {
  const lines = Array.isArray(description) ? description : [description];
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      width={420}
      footer={
        <>
          <Button variant="ghost" disabled={loading} onClick={onClose}>
            Cancel
          </Button>
          <Button variant={actionVariant} loading={loading} onClick={onConfirm}>
            {actionLabel}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-2 p-5">
        {lines.map((line, i) => (
          <p key={i} className="text-[13px] text-ink-2">
            {line}
          </p>
        ))}
      </div>
    </Modal>
  );
}
