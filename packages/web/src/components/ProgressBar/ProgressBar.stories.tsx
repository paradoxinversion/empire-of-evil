import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'padded' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Positive: Story = { args: { value: 65, color: 'positive', height: 3 } };
export const Warning: Story = { args: { value: 80, color: 'warning', height: 3 } };
export const Negative: Story = { args: { value: 15, color: 'negative', height: 3 } };
export const Evil: Story = { args: { value: 47, color: 'evil', height: 3 } };
export const Tall: Story = { args: { value: 60, color: 'info', height: 4 } };
export const Thin: Story = { args: { value: 30, color: 'neutral', height: 2 } };
