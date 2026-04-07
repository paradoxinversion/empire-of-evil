import { render, screen } from '@testing-library/react';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders children', () => {
    render(<Tag variant="active">ACTIVE</Tag>);
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('applies the correct data-variant attribute', () => {
    render(<Tag variant="hostile">HOSTILE</Tag>);
    expect(screen.getByText('HOSTILE')).toHaveAttribute('data-variant', 'hostile');
  });

  const variants = [
    'operative', 'scientist', 'troop', 'admin', 'unassigned',
    'active', 'traveling', 'injured', 'plot', 'activity',
    'stable', 'unrest', 't1', 't2', 't3', 't4',
    'ready', 'research', 'hostile', 'neutral',
  ] as const;

  variants.forEach((variant) => {
    it(`renders without error for variant: ${variant}`, () => {
      render(<Tag variant={variant}>{variant.toUpperCase()}</Tag>);
      expect(screen.getByText(variant.toUpperCase())).toBeInTheDocument();
    });
  });
});
