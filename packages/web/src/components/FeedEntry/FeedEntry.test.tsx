import { render, screen } from '@testing-library/react';
import { FeedEntry } from './FeedEntry';

describe('FeedEntry', () => {
  it('renders the day number', () => {
    render(<FeedEntry day={47} text="Something happened." type="internal" />);
    expect(screen.getByText('DAY 47')).toBeInTheDocument();
  });

  it('renders the text', () => {
    render(<FeedEntry day={12} text="Intel report received." type="intel" />);
    expect(screen.getByText('Intel report received.')).toBeInTheDocument();
  });

  it('applies data-type attribute', () => {
    const { container } = render(<FeedEntry day={1} text="test" type="intercept" />);
    expect(container.firstChild).toHaveAttribute('data-type', 'intercept');
  });

  it('applies data-unread attribute when unread', () => {
    const { container } = render(<FeedEntry day={1} text="test" type="news" unread />);
    expect(container.firstChild).toHaveAttribute('data-unread', 'true');
  });
});
