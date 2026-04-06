import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, vi } from 'vitest';
import { Sidebar } from './Sidebar';
import { useGameState } from '../../hooks/useGameState';
import { useNavigationStore } from '../../store/navigationStore';
import type { GameState } from '@empire-of-evil/engine';

vi.mock('../../hooks/useGameState');
vi.mock('../../store/navigationStore');

const mockGameState: Partial<GameState> = {
  empire: {
    id: 'empire-1',
    overlordId: 'person-1',
    petId: 'person-2',
    resources: { money: 0, science: 0, infrastructure: 12 },
    evil: { actual: 47, perceived: 47 },
    innerCircleIds: [],
    unlockedPlotIds: [],
    unlockedActivityIds: [],
      unlockedResearchIds: [],
  },
  zones: {},
};

const setActiveScreen = vi.fn();

beforeEach(() => {
  vi.mocked(useGameState).mockReturnValue(mockGameState as GameState);
  const navState = { activeScreen: 'empire', setActiveScreen };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vi.mocked(useNavigationStore).mockImplementation((selector: any) => selector(navState));
});

describe('Sidebar', () => {
  it('renders all navigation items', () => {
    render(<Sidebar />);
    expect(screen.getByText('EMPIRE')).toBeInTheDocument();
    expect(screen.getByText('PERSONNEL')).toBeInTheDocument();
    expect(screen.getByText('SCIENCE')).toBeInTheDocument();
    expect(screen.getByText('PLOTS')).toBeInTheDocument();
  });

  it('calls setActiveScreen when a nav item is clicked', async () => {
    render(<Sidebar />);
    await userEvent.click(screen.getByText('INTEL'));
    expect(setActiveScreen).toHaveBeenCalledWith('intel');
  });

  it('marks the active screen nav item with data-active', () => {
    render(<Sidebar />);
    const empireItem = screen.getByText('EMPIRE').closest('[data-nav-item]');
    expect(empireItem).toHaveAttribute('data-active', 'true');
  });

  it('displays the EVIL score', () => {
    render(<Sidebar />);
    expect(screen.getByText('47')).toBeInTheDocument();
  });
});
