export type ProgressBarColor = 'positive' | 'warning' | 'negative' | 'info' | 'evil' | 'neutral';

const COLOR_CLASSES: Record<ProgressBarColor, string> = {
  positive: 'bg-positive',
  warning:  'bg-warning',
  negative: 'bg-negative',
  info:     'bg-info',
  evil:     'bg-evil-threat',
  neutral:  'bg-border-strong',
};

interface ProgressBarProps {
  value: number;
  color?: ProgressBarColor;
  height?: 2 | 3 | 4;
}

const HEIGHT_CLASSES: Record<2 | 3 | 4, string> = {
  2: 'h-0.5',
  3: 'h-[3px]',
  4: 'h-1',
};

export function ProgressBar({ value, color = 'neutral', height = 3 }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full bg-border-subtle rounded-sm overflow-hidden ${HEIGHT_CLASSES[height]}`}
    >
      <div
        className={`${HEIGHT_CLASSES[height]} rounded-sm transition-all duration-base ${COLOR_CLASSES[color]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
