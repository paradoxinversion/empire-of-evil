import type { Meta, StoryObj } from '@storybook/react';
import { WorldGenScreen } from './WorldGenScreen';
import { useGameStore } from '../../store/gameStore';

const meta: Meta<typeof WorldGenScreen> = {
  title: 'Screens/WorldGenScreen',
  component: WorldGenScreen,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof WorldGenScreen>;

export const Idle: Story = {
  decorators: [(Story) => {
    useGameStore.setState({ status: 'idle', newGame: () => {} });
    return <Story />;
  }],
};
