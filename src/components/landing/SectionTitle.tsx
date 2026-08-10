import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = { className?: string; children: ReactNode };

export default function SectionTitle({ className, children }: Props) {
  return <h2 className={cn('t-h2', className)}>{children}</h2>;
}
