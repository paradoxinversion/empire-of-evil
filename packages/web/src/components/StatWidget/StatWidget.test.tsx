import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatWidget } from './StatWidget';

describe('StatWidget', () => {
  it('renders the label and value', () => {
    render(<StatWidget label="MONEY" value="$1,247,430" />);
    expect(screen.getByText('MONEY')).toBeInTheDocument();
    expect(screen.getByText('$1,247,430')).toBeInTheDocument();
  });

  it('renders subValue when provided', () => {
    render(<StatWidget label="MONEY" value="$1,247,430" subValue="+$8,240/day" />);
    expect(screen.getByText('+$8,240/day')).toBeInTheDocument();
  });

  it('does not render subValue element when omitted', () => {
    const { container } = render(<StatWidget label="MONEY" value="$1,247,430" />);
    expect(container.querySelector('[data-sub-value]')).toBeNull();
  });

  it('calls onClick when clicked and onClick is provided', async () => {
    const onClick = vi.fn();
    render(<StatWidget label="MONEY" value="$1,247,430" onClick={onClick} />);
    await userEvent.click(screen.getByText('$1,247,430'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
