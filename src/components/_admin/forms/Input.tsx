import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full appearance-none rounded-el border border-line bg-surface-2 px-2 py-2 font-sans text-[13.5px] text-ink transition-[border] outline-none focus:border-accent disabled:cursor-not-allowed disabled:text-ink-3 read-only:cursor-default read-only:focus:border-line @mobile:px-3',
        className,
      )}
      {...rest}
    />
  );
});

export default Input;
