import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export default function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-20 w-full resize-y appearance-none rounded-el border border-line bg-surface-2 px-2 py-2 font-sans text-[13.5px] text-ink transition-[border] duration-150 outline-none focus:border-accent md:px-3',
        className,
      )}
      {...rest}
    />
  );
}
