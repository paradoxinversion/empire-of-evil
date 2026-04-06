import type { Meta, StoryObj } from '@storybook/react';
import { StatWidget } from './StatWidget';

const meta: Meta<typeof StatWidget> = {
  title: 'Components/StatWidget',
  component: StatWidget,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof StatWidget>;

export const Money: Story = {
  args: { label: 'MONEY', value: '$1,247,430', subValue: '+$8,240/day', subVariant: 'positive' },
};
export const Infrastructure: Story = {
  args: { label: 'INFRASTRUCTURE', value: '12/15', subValue: '80% capacity', subVariant: 'warning' },
};
export const Evil: Story = {
  args: { label: 'EVIL', value: '47', subValue: 'THREAT tier', subVariant: 'warning' },
};
export const Science: Story = {
  args: { label: 'SCIENCE', value: '2,847', subValue: '+140/day', subVariant: 'positive' },
};
export const NoSubValue: Story = {
  args: { label: 'AGENTS', value: '12' },
};
