import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginScreen } from './LoginScreen';

describe('LoginScreen', () => {
  it('renders the NEW GAME button', () => {
    render(<LoginScreen onNewGame={() => {}} />);
    expect(screen.getByRole('button', { name: /NEW GAME/i })).toBeInTheDocument();
  });

  it('calls onNewGame when the button is clicked', async () => {
    const onNewGame = vi.fn();
    render(<LoginScreen onNewGame={onNewGame} />);
    await userEvent.click(screen.getByRole('button', { name: /NEW GAME/i }));
    expect(onNewGame).toHaveBeenCalledOnce();
  });

  it('renders the application branding', () => {
    render(<LoginScreen onNewGame={() => {}} />);
    expect(screen.getByText(/EMPIRE OF EVIL/i)).toBeInTheDocument();
  });
});
