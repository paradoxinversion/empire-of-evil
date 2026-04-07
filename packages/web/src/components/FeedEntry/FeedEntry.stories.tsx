import type { Meta, StoryObj } from '@storybook/react';
import { FeedEntry } from './FeedEntry';

const meta: Meta<typeof FeedEntry> = {
  title: 'Components/FeedEntry',
  component: FeedEntry,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof FeedEntry>;

export const Intel: Story = {
  args: { day: 47, text: '<strong>Zone 4</strong> — Intelligence level increased to 35.', type: 'intel' },
};
export const Intercept: Story = {
  args: { day: 47, text: 'We have confirmed the target is operational. Proceed with caution.', type: 'intercept' },
};
export const Internal: Story = {
  args: { day: 47, text: '<strong>Operation: Silent Ledger</strong> — Phase 2 complete.', type: 'internal' },
};
export const News: Story = {
  args: { day: 47, text: 'Local officials deny any wrongdoing in the Zone 4 incident.', type: 'news' },
};
export const Unread: Story = {
  args: { day: 48, text: 'New threat detected in <strong>Zone 9</strong>.', type: 'intel', unread: true },
};
