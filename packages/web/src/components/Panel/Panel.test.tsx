import { render, screen } from '@testing-library/react';
import { Panel } from './Panel';

describe('Panel', () => {
  it('renders children', () => {
    render(<Panel>panel content</Panel>);
    expect(screen.getByText('panel content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Panel title="OPERATIONS">content</Panel>);
    expect(screen.getByText('OPERATIONS')).toBeInTheDocument();
  });

  it('does not render title element when title is omitted', () => {
    const { container } = render(<Panel>content</Panel>);
    expect(container.querySelector('[data-panel-title]')).toBeNull();
  });
});
