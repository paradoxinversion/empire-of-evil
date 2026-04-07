export type SubValueVariant = 'positive' | 'warning' | 'negative' | 'neutral';

const SUB_COLOR: Record<SubValueVariant, string> = {
  positive: 'text-positive',
  warning:  'text-warning',
  negative: 'text-negative',
  neutral:  'text-text-muted',
};

interface StatWidgetProps {
  label: string;
  value: string;
  subValue?: string;
  subVariant?: SubValueVariant;
  onClick?: () => void;
}

export function StatWidget({ label, value, subValue, subVariant = 'positive', onClick }: StatWidgetProps) {
  return (
    <div
      className={`bg-bg-surface border border-border-subtle p-3 flex-1 ${onClick ? 'cursor-pointer hover:bg-bg-elevated transition-colors duration-fast' : ''}`}
      onClick={onClick}
    >
      <div className="font-mono text-[9px] tracking-[0.12em] text-text-muted mb-1.5">
        {label}
      </div>
      <div className="font-mono text-xl text-text-primary leading-none mb-0.5">
        {value}
      </div>
      {subValue && (
        <div data-sub-value className={`font-mono text-[10px] ${SUB_COLOR[subVariant]}`}>
          {subValue}
        </div>
      )}
    </div>
  );
}
