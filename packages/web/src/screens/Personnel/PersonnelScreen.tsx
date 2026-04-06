import { useState } from 'react';
import { Panel } from '../../components/Panel/Panel';
import { TabBar } from '../../components/TabBar/TabBar';
import { AllAgentsTab } from './AllAgentsTab';
import { SquadsTab } from './SquadsTab';
import { InnerCircleTab } from './InnerCircleTab';
import { CharacterProfile } from './CharacterProfile';

type PersonnelTab = 'all-agents' | 'squads' | 'inner-circle';

const TABS = [
  { key: 'all-agents',   label: 'ALL AGENTS' },
  { key: 'squads',       label: 'SQUADS' },
  { key: 'inner-circle', label: 'INNER CIRCLE' },
];

export function PersonnelScreen() {
  const [activeTab, setActiveTab] = useState<PersonnelTab>('all-agents');
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  return (
    <div>
      <div className="font-mono text-base text-text-primary mb-4 tracking-tight">
        PERSONNEL
      </div>

      <div className="flex gap-3" style={{ minHeight: '640px' }}>
        {/* Left — roster */}
        <div style={{ flex: '0 0 55%' }} className="flex flex-col gap-3">
          <div className="border-b border-border-subtle">
            <TabBar
              tabs={TABS}
              activeTab={activeTab}
              onChange={key => {
                setActiveTab(key as PersonnelTab);
                setSelectedPersonId(null);
              }}
            />
          </div>

          {activeTab === 'all-agents' && (
            <AllAgentsTab
              onSelectPerson={setSelectedPersonId}
              selectedPersonId={selectedPersonId}
            />
          )}
          {activeTab === 'squads' && (
            <SquadsTab
              onSelectPerson={setSelectedPersonId}
              selectedPersonId={selectedPersonId}
            />
          )}
          {activeTab === 'inner-circle' && (
            <InnerCircleTab onSelectPerson={setSelectedPersonId} />
          )}
        </div>

        {/* Right — profile */}
        <div style={{ flex: '0 0 45%' }} className="overflow-y-auto">
          {selectedPersonId ? (
            <CharacterProfile
              personId={selectedPersonId}
              onClose={() => setSelectedPersonId(null)}
            />
          ) : (
            <Panel>
              <div className="text-text-muted text-[11px]">
                Select an agent to view their profile.
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
