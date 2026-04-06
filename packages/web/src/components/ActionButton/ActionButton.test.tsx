import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionButton } from './ActionButton';

describe('ActionButton', () => {
  it('renders children', () => {
    render(<ActionButton onClick={() => {}}>ADVANCE</ActionButton>);
    expect(screen.getByRole('button', { name: 'ADVANCE' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<ActionButton onClick={onClick}>CLICK ME</ActionButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<ActionButton onClick={onClick} disabled>DISABLED</ActionButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('is a disabled button when disabled prop is true', () => {
    render(<ActionButton onClick={() => {}} disabled>DISABLED</ActionButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders primary variant', () => {
    render(<ActionButton onClick={() => {}} variant="primary">PRIMARY</ActionButton>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders destructive variant', () => {
    render(<ActionButton onClick={() => {}} variant="destructive">TERMINATE</ActionButton>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
