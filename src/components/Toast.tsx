import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { hideToast } from '@/store/uiSlice';
import { cn } from '@/lib/cn';

export default function Toast() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector((s) => s.ui.toast);

  useEffect(() => {
    if (!toast?.visible) return;
    const t = setTimeout(() => dispatch(hideToast()), 2800);
    return () => clearTimeout(t);
  }, [toast?.id, toast?.visible, dispatch]);

  return (
    <div
      className={cn(
        'fixed right-6 bottom-6 z-[2000] flex items-center gap-2 rounded-card border border-line-2 bg-surface-2 px-[18px] py-3 text-[13px] font-semibold text-ink shadow-[0_8px_32px_rgba(0,0,0,.6)] transition-all duration-300',
        toast?.visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0',
      )}
    >
      <span>{toast?.icon}</span>
      <span>{toast?.text}</span>
    </div>
  );
}
