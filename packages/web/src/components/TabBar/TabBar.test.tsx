import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabBar } from './TabBar';

const tabs = [
  { key: 'overview', label: 'OVERVIEW' },
  { key: 'citizens', label: 'CITIZENS' },
  { key: 'activity', label: 'ACTIVITY' },
];

describe('TabBar', () => {
  it('renders all tab labels', () => {
    render(<TabBar tabs={tabs} activeTab="overview" onChange={() => {}} />);
    expect(screen.getByText('OVERVIEW')).toBeInTheDocument();
    expect(screen.getByText('CITIZENS')).toBeInTheDocument();
    expect(screen.getByText('ACTIVITY')).toBeInTheDocument();
  });

  it('calls onChange with the correct key when a tab is clicked', async () => {
    const onChange = vi.fn();
    render(<TabBar tabs={tabs} activeTab="overview" onChange={onChange} />);
    await userEvent.click(screen.getByText('CITIZENS'));
    expect(onChange).toHaveBeenCalledWith('citizens');
  });

  it('marks the active tab with data-active', () => {
    render(<TabBar tabs={tabs} activeTab="citizens" onChange={() => {}} />);
    const citizensTab = screen.getByText('CITIZENS').closest('button');
    expect(citizensTab).toHaveAttribute('data-active', 'true');
    const overviewTab = screen.getByText('OVERVIEW').closest('button');
    expect(overviewTab).not.toHaveAttribute('data-active', 'true');
  });
});
