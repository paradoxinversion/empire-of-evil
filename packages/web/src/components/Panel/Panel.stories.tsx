import type { Meta, StoryObj } from '@storybook/react';
import { Panel } from './Panel';

const meta: Meta<typeof Panel> = {
  title: 'Components/Panel',
  component: Panel,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof Panel>;

export const WithTitle: Story = {
  args: { title: 'ACTIVE OPERATIONS', children: 'Panel content goes here.' },
};

export const WithoutTitle: Story = {
  args: { children: 'Panel content without a title.' },
};

export const Nested: Story = {
  render: () => (
    <Panel title="OUTER PANEL">
      <Panel title="INNER PANEL">Nested content</Panel>
    </Panel>
  ),
};
