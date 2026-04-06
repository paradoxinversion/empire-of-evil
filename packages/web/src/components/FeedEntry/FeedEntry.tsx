export type FeedEntryType = 'intel' | 'intercept' | 'internal' | 'news';

const DOT_COLOR: Record<FeedEntryType, string> = {
  intel:     'bg-info',
  intercept: 'bg-warning',
  internal:  'bg-accent-red',
  news:      'bg-border-subtle',
};

interface FeedEntryProps {
  day: number;
  text: string;
  type: FeedEntryType;
  unread?: boolean;
}

export function FeedEntry({ day, text, type, unread }: FeedEntryProps) {
  return (
    <div
      data-type={type}
      data-unread={unread ? 'true' : undefined}
      className={`flex gap-2.5 py-2 border-b border-bg-elevated ${unread ? 'bg-bg-elevated/40' : ''}`}
    >
      <div className={`w-0.5 flex-shrink-0 rounded-sm self-stretch ${DOT_COLOR[type]}`} />
      <div className="font-mono text-[9px] text-text-muted w-[38px] flex-shrink-0 pt-px">
        DAY {day}
      </div>
      <div
        className={`text-[11px] leading-relaxed ${type === 'intercept' ? 'italic' : ''} text-text-secondary`}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}
