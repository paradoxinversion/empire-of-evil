import type { ReactNode } from 'react';

interface PanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Panel({ title, children, className = '' }: PanelProps) {
  return (
    <div className={`bg-bg-surface border border-border-subtle rounded-sm p-3.5 ${className}`}>
      {title && (
        <div
          data-panel-title
          className="font-mono text-[10px] tracking-[0.1em] text-text-muted mb-2.5"
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
