import { render, screen } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';
import { EmpireScreen } from './EmpireScreen';
import { useGameState } from '../../hooks/useGameState';
import type { GameState } from '@empire-of-evil/engine';

vi.mock('../../hooks/useGameState');

const mockGameState: Partial<GameState> = {
  date: 0,
  empire: {
    id: 'empire-1',
    overlordId: 'person-1',
    petId: 'person-2',
    resources: { money: 1500000, science: 500, infrastructure: 3 },
    evil: { actual: 5, perceived: 5 },
    innerCircleIds: [],
    unlockedPlotIds: [],
    unlockedActivityIds: [],
  },
  zones: { 'z1': { id: 'z1', name: 'Zone Alpha', nationId: 'n1', governingOrganizationId: 'org-1', tileIds: [], buildingIds: [], generationWealth: 10, economicOutput: 500, population: 1000, intelLevel: 0, taxRate: 0.1, activeEffectIds: [] } },
  plots: {},
  activities: {},
  persons: {
    'person-1': { id: 'person-1', name: 'The Overlord', zoneId: 'z1', homeZoneId: 'z1', governingOrganizationId: 'org-1', attributes: {}, skills: {}, loyalties: {}, intelLevel: 0, health: 100, money: 0, activeEffectIds: [], dead: false, agentStatus: { job: 'unassigned', salary: 0 } },
  },
  pendingEvents: [],
  eventLog: [],
  nations: { 'n1': { id: 'n1', name: 'Test Nation', size: 1, governingOrganizationId: 'org-1' } },
};

beforeEach(() => {
  vi.mocked(useGameState).mockReturnValue(mockGameState as GameState);
});

describe('EmpireScreen', () => {
  it('renders without error', () => {
    render(<EmpireScreen />);
    expect(screen.getByText('EMPIRE OVERVIEW')).toBeInTheDocument();
  });

  it('displays the money value', () => {
    render(<EmpireScreen />);
    expect(screen.getByText('$1,500,000')).toBeInTheDocument();
  });

  it('renders the ACTIVE OPERATIONS panel', () => {
    render(<EmpireScreen />);
    expect(screen.getByText('ACTIVE OPERATIONS')).toBeInTheDocument();
  });

  it('renders the RECENT ACTIVITY panel', () => {
    render(<EmpireScreen />);
    expect(screen.getByText('RECENT ACTIVITY')).toBeInTheDocument();
  });

  it('renders the CONTROLLED ZONES panel', () => {
    render(<EmpireScreen />);
    expect(screen.getByText('CONTROLLED ZONES')).toBeInTheDocument();
  });
});
