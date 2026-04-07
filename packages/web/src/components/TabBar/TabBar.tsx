interface Tab {
  key: string;
  label: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (key: string) => void;
}

export function TabBar({ tabs, activeTab, onChange }: TabBarProps) {
  return (
    <div className="flex border-b border-border-subtle mb-3">
      {tabs.map(tab => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            type="button"
            data-active={isActive ? 'true' : undefined}
            onClick={() => onChange(tab.key)}
            className={`
              font-mono text-[10px] tracking-[0.08em] px-3.5 py-2
              border-b-2 -mb-px transition-colors duration-fast cursor-pointer
              ${isActive
                ? 'text-text-primary border-accent-red'
                : 'text-text-muted border-transparent hover:text-text-secondary'}
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
