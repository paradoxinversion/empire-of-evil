import { render, screen } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';
import { Topbar } from './Topbar';
import { useGameStore } from '../../store/gameStore';
import { useGameState } from '../../hooks/useGameState';
import type { GameState } from '@empire-of-evil/engine';

vi.mock('../../store/gameStore');
vi.mock('../../hooks/useGameState');

const mockGameState: Partial<GameState> = {
  date: 46,
  empire: {
    id: 'empire-1',
    overlordId: 'person-1',
    petId: 'person-2',
    resources: { money: 1247430, science: 2847, infrastructure: 12 },
    evil: { actual: 47, perceived: 47 },
    innerCircleIds: [],
    unlockedPlotIds: [],
    unlockedActivityIds: [],
  },
  pendingEvents: [],
};

const storeState = { status: 'ready' as const, advanceTo: vi.fn(), pauseAdvance: vi.fn() };

beforeEach(() => {
  vi.mocked(useGameState).mockReturnValue(mockGameState as GameState);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vi.mocked(useGameStore).mockImplementation((selector: any) => selector(storeState));
});

describe('Topbar', () => {
  it('displays the formatted game date', () => {
    render(<Topbar />);
    expect(screen.getByText(/DAY 47/)).toBeInTheDocument();
  });

  it('displays the money value', () => {
    render(<Topbar />);
    expect(screen.getByText(/\$1,247,430/)).toBeInTheDocument();
  });

  it('displays the EVIL tier', () => {
    render(<Topbar />);
    expect(screen.getByText('THREAT')).toBeInTheDocument();
  });

  it('shows ADVANCE button when status is ready', () => {
    render(<Topbar />);
    expect(screen.getByRole('button', { name: /ADVANCE/i })).toBeInTheDocument();
  });
});
