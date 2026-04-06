import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';
import type { TagVariant } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Tag>;

const variants: TagVariant[] = [
  'operative', 'scientist', 'troop', 'admin', 'unassigned',
  'active', 'traveling', 'injured', 'plot', 'activity',
  'stable', 'unrest', 't1', 't2', 't3', 't4',
  'ready', 'research', 'hostile', 'neutral',
];

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {variants.map((v) => (
        <Tag key={v} variant={v}>{v.toUpperCase()}</Tag>
      ))}
    </div>
  ),
};

export const Operative: Story = { args: { variant: 'operative', children: 'OPERATIVE' } };
export const Scientist: Story = { args: { variant: 'scientist', children: 'SCIENTIST' } };
export const Hostile: Story = { args: { variant: 'hostile', children: 'HOSTILE' } };
export const Plot: Story = { args: { variant: 'plot', children: 'ON PLOT' } };
