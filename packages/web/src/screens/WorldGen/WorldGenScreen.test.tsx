import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, vi } from 'vitest';
import { WorldGenScreen } from './WorldGenScreen';
import { useGameStore } from '../../store/gameStore';

vi.mock('../../store/gameStore');

const newGame = vi.fn();

beforeEach(() => {
  newGame.mockReset();
  const storeState = { status: 'idle' as const, newGame };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vi.mocked(useGameStore).mockImplementation((selector: any) => selector(storeState));
});

describe('WorldGenScreen', () => {
  it('renders the GENERATE WORLD button', () => {
    render(<WorldGenScreen />);
    expect(screen.getByRole('button', { name: /GENERATE WORLD/i })).toBeInTheDocument();
  });

  it('shows all param fields', () => {
    render(<WorldGenScreen />);
    expect(screen.getByLabelText(/NATIONS/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ZONES PER NATION/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/POPULATION DENSITY/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/MAP WIDTH/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/MAP HEIGHT/i)).toBeInTheDocument();
  });

  it('initializes fields with default values', () => {
    render(<WorldGenScreen />);
    expect(screen.getByLabelText(/^NATIONS/i)).toHaveValue(5);
    expect(screen.getByLabelText(/ZONES PER NATION/i)).toHaveValue(4);
  });

  it('calls store.newGame with correct params on submit', async () => {
    render(<WorldGenScreen />);
    await userEvent.click(screen.getByRole('button', { name: /GENERATE WORLD/i }));
    expect(newGame).toHaveBeenCalledWith(
      expect.objectContaining({
        nationCount: 5,
        zonesPerNation: 4,
        populationDensity: 10,
        mapWidth: 20,
        mapHeight: 20,
      })
    );
  });

  it('allows changing a field and submitting updated value', async () => {
    render(<WorldGenScreen />);
    const nationsInput = screen.getByLabelText(/^NATIONS/i);
    fireEvent.change(nationsInput, { target: { value: '8' } });
    await userEvent.click(screen.getByRole('button', { name: /GENERATE WORLD/i }));
    expect(newGame).toHaveBeenCalledWith(expect.objectContaining({ nationCount: 8 }));
  });
});
