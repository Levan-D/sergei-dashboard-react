import { useState } from 'react';
import { cn } from '@/lib/cn';
import Button from '@/components/_admin/ui/Button';

const DEFAULT_MAX_RETRIES = 3;

const statusOf = (error: unknown): string | number | null => {
  if (typeof error !== 'object' || !error || !('status' in error)) return null;
  const status = (error as { status: unknown }).status;
  return typeof status === 'string' || typeof status === 'number' ? status : null;
};

const messageFor = (status: string | number | null) => {
  if (status === 401) return 'Your session has expired. Sign in again to continue.';
  if (status === 403) return 'You do not have access to this brand. Ask a Super Admin to add you as staff.';
  if (status === 404) return 'This was not found on the server.';
  if (status === 422) return 'The server rejected the data as invalid.';
  if (status === 'FETCH_ERROR') return 'Could not reach the server. Check your connection.';
  return 'Something went wrong.';
};

type Props = {
  error?: unknown;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  maxRetries?: number;
  className?: string;
};

/**
 * Generic failure card. Derives its message from an RTK Query error, or takes one
 * directly. Retries are manual only — never automatic — and stop after maxRetries.
 */
export default function ErrorState({
  error,
  message,
  onRetry,
  isRetrying,
  maxRetries = DEFAULT_MAX_RETRIES,
  className,
}: Props) {
  const [attempts, setAttempts] = useState(0);
  const status = statusOf(error);
  const retriesLeft = maxRetries - attempts;
  const canRetry = !!onRetry && retriesLeft > 0;

  return (
    <div className={cn('rounded-card border border-line bg-surface p-5', className)}>
      <p className="text-sm font-semibold text-ink">{message ?? messageFor(status)}</p>
      {status != null && <p className="mt-1 font-mono text-[11px] text-ink-3">Error {String(status)}</p>}
      {canRetry ? (
        <Button
          className="mt-3"
          variant="ghost"
          loading={isRetrying}
          onClick={() => {
            setAttempts((a) => a + 1);
            onRetry?.();
          }}
        >
          Try again
        </Button>
      ) : (
        onRetry && <p className="mt-3 text-xs text-ink-3">Still not working. Please contact Motority support.</p>
      )}
    </div>
  );
}
