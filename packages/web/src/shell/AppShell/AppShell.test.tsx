import { render, screen } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';
import { AppShell } from './AppShell';
import { useGameState } from '../../hooks/useGameState';
import { useGameStore } from '../../store/gameStore';
import { useNavigationStore } from '../../store/navigationStore';
import type { GameState } from '@empire-of-evil/engine';

vi.mock('../../hooks/useGameState');
vi.mock('../../store/gameStore');
vi.mock('../../store/navigationStore');

const mockGameState: Partial<GameState> = {
  date: 0,
  empire: {
    id: 'empire-1',
    overlordId: 'person-1',
    petId: 'person-2',
    resources: { money: 0, science: 0, infrastructure: 0 },
    evil: { actual: 0, perceived: 0 },
    innerCircleIds: [],
    unlockedPlotIds: [],
    unlockedActivityIds: [],
  },
  zones: {},
  pendingEvents: [],
};

beforeEach(() => {
  vi.mocked(useGameState).mockReturnValue(mockGameState as GameState);
  const gameStoreState = { status: 'ready' as const, advanceTo: vi.fn(), pauseAdvance: vi.fn() };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vi.mocked(useGameStore).mockImplementation((selector: any) => selector(gameStoreState));
  const navState = { activeScreen: 'empire', setActiveScreen: vi.fn() };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vi.mocked(useNavigationStore).mockImplementation((selector: any) => selector(navState));
});

describe('AppShell', () => {
  it('renders children in the content area', () => {
    render(<AppShell><div>CONTENT</div></AppShell>);
    expect(screen.getByText('CONTENT')).toBeInTheDocument();
  });

  it('renders the topbar', () => {
    render(<AppShell><div>content</div></AppShell>);
    expect(screen.getByText('EMPIRE OF EVIL INC.')).toBeInTheDocument();
  });

  it('renders the sidebar navigation', () => {
    render(<AppShell><div>content</div></AppShell>);
    expect(screen.getByText('EMPIRE')).toBeInTheDocument();
  });
});
