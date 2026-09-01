import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'min-h-20 w-full resize-none appearance-none rounded-el border border-line bg-surface-2 px-2 py-2 font-sans text-[13.5px] text-ink transition-[border] outline-none focus:border-accent disabled:cursor-not-allowed disabled:text-ink-3 read-only:cursor-default read-only:focus:border-line aria-invalid:border-red aria-invalid:focus:border-red @mobile:px-3',
        className,
      )}
      {...rest}
    />
  );
});

export default Textarea;
