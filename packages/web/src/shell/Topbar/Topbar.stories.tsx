import type { Meta, StoryObj } from '@storybook/react';
import { Topbar } from './Topbar';
import { useGameStore } from '../../store/gameStore';
import { useGameState } from '../../hooks/useGameState';
import type { GameState } from '@empire-of-evil/engine';

const meta: Meta<typeof Topbar> = {
  title: 'Shell/Topbar',
  component: Topbar,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, { parameters }) => {
      const { gameState, status } = parameters;
      useGameStore.setState({ status: status ?? 'ready', advanceTo: () => {}, pauseAdvance: () => {} });
      // Patch useGameState for Storybook via module mock isn't straightforward;
      // use a wrapper component that re-exports the story with mocked state.
      return <Story />;
    },
  ],
};
export default meta;
type Story = StoryObj<typeof Topbar>;

// For stories we use the real hooks — run `pnpm dev` and start a game to see Topbar.
// These stories are structural placeholders.
export const Default: Story = {};
