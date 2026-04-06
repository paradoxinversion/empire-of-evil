import type { Meta, StoryObj } from '@storybook/react';
import { ActionButton } from './ActionButton';

const meta: Meta<typeof ActionButton> = {
  title: 'Components/ActionButton',
  component: ActionButton,
  parameters: { layout: 'centered' },
  args: { onClick: () => {} },
};
export default meta;
type Story = StoryObj<typeof ActionButton>;

export const Default: Story = { args: { variant: 'default', children: 'DEFAULT' } };
export const Primary: Story = { args: { variant: 'primary', children: 'ADVANCE ▾' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'TERMINATE' } };
export const DisabledDefault: Story = { args: { variant: 'default', children: 'DISABLED', disabled: true } };
export const DisabledPrimary: Story = { args: { variant: 'primary', children: 'GENERATING...', disabled: true } };
