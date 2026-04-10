import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { GameState } from '@empire-of-evil/engine';
import { IntelScreen } from './IntelScreen';
import { useGameStore } from '../../store/gameStore';
import * as gameStoreModule from '../../store/gameStore';

// Mock the engine and child components
vi.mock('../../components/TileMap/TileMap', () => ({
  TileMap: () => <div>TileMap</div>,
}));

vi.mock('@empire-of-evil/engine', () => ({
  advanceTime: vi.fn(function* (gameState: GameState) {
    // Simulate one day advancement
    gameState.eventLog.push({
      event: {
        id: `event-${Date.now()}`,
        category: 'informational',
        title: 'Simulated Event',
        body: 'Game advanced one day',
        relatedEntityIds: [],
        requiresResolution: false,
        createdOnDate: gameState.date + 1,
      },
      resolvedOnDate: gameState.date + 1,
    });
    gameState.date += 1;
    yield { type: 'day_complete' };
  }),
}));

describe('IntelScreen - Feed Re-render on Advance', () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.setState({
      gameState: {
        date: 0,
        eventLog: [
          {
            event: {
              id: 'initial-event',
              category: 'informational',
              title: 'Initial Event',
              body: 'Test',
              relatedEntityIds: [],
              requiresResolution: false,
              createdOnDate: 0,
            },
            resolvedOnDate: 0,
          },
        ],
        empire: { id: 'emp-1' } as any,
        zones: {},
        nations: {},
        tiles: {},
        governingOrganizations: {},
        persons: {},
        plots: {},
        activities: {},
        pendingEvents: [],
      } as GameState,
      version: 0,
      status: 'ready' as const,
      activeInterrupts: [],
      targetDate: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('displays initial eventLog entries', () => {
    render(<IntelScreen />);
    expect(screen.getByText('Initial Event')).toBeInTheDocument();
  });

  it('should re-render feed when version increments', async () => {
    const { rerender } = render(<IntelScreen />);
    
    expect(screen.getByText('Initial Event')).toBeInTheDocument();

    // Simulate version increment (which happens during advanceTime)
    await waitFor(() => {
      useGameStore.setState((s) => ({ version: s.version + 1 }));
    });

    // Force re-render to verify the hook is being called
    rerender(<IntelScreen />);

    // The component should still show the initial event
    // (since the gameState object is the same reference, but was mutated)
    expect(screen.getByText('Initial Event')).toBeInTheDocument();
  });

  it('receives updated eventLog after store state changes', async () => {
    render(<IntelScreen />);
    expect(screen.getByText('Initial Event')).toBeInTheDocument();

    // Update the store's gameState with a new event (simulating advancement)
    act(() => {
      const current = useGameStore.getState().gameState;
      if (current) {
        current.eventLog.push({
          event: {
            id: 'new-event',
            category: 'informational',
            title: 'New Event After Advance',
            body: 'This happened after advancing',
            relatedEntityIds: [],
            requiresResolution: false,
            createdOnDate: 1,
          },
          resolvedOnDate: 1,
        });
        // Increment version to trigger re-render
        useGameStore.setState((s) => ({ version: s.version + 1 }));
      }
    });

    // After version increment, component should re-render and show new event
    await waitFor(
      () => {
        expect(screen.getByText('New Event After Advance')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
});
