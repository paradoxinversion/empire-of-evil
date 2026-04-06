import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TabBar } from './TabBar';

const meta: Meta<typeof TabBar> = {
  title: 'Components/TabBar',
  component: TabBar,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof TabBar>;

const TwoTabs = () => {
  const [active, setActive] = useState('a');
  return <TabBar tabs={[{ key: 'a', label: 'ALL AGENTS' }, { key: 'b', label: 'SQUADS' }]} activeTab={active} onChange={setActive} />;
};

const ThreeTabs = () => {
  const [active, setActive] = useState('overview');
  return (
    <TabBar
      tabs={[
        { key: 'overview', label: 'OVERVIEW' },
        { key: 'citizens', label: 'CITIZENS' },
        { key: 'activity', label: 'ACTIVITY' },
      ]}
      activeTab={active}
      onChange={setActive}
    />
  );
};

export const TwoTabsStory: Story = { render: () => <TwoTabs /> };
export const ThreeTabsStory: Story = { render: () => <ThreeTabs /> };
