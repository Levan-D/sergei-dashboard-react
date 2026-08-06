import type { CSSProperties } from 'react';

export function StatCard({
  label,
  value,
  sub,
  valueStyle,
}: {
  label: string;
  value: string;
  sub?: string;
  valueStyle?: CSSProperties;
}) {
  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-card">
      <div className="mb-2 text-xs font-medium text-ink-3">{label}</div>
      <div className="font-mono text-[28px] font-bold text-ink" style={valueStyle}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-ink-3">{sub}</div>}
    </div>
  );
}
