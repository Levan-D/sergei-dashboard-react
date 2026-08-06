import { cssTransition, toast } from 'react-toastify';

const TOAST_ID = 'admin-toast';

export const adminToastTransition = cssTransition({
  enter: 'admin-toast-in',
  exit: 'admin-toast-out',
});

export function showToast(message: string) {
  const m = message.match(/^(\S+)\s(.+)$/);
  const content = (
    <>
      <span>{m ? m[1] : 'ℹ️'}</span>
      <span>{m ? m[2] : message}</span>
    </>
  );
  if (toast.isActive(TOAST_ID)) {
    toast.update(TOAST_ID, { render: content, autoClose: 2800 });
  } else {
    toast(content, { toastId: TOAST_ID });
  }
}
