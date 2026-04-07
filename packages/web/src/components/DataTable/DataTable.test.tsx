import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable } from './DataTable';

const columns = [
  { key: 'name', label: 'NAME' },
  { key: 'status', label: 'STATUS' },
];

const rows = [
  { name: 'Agent Alpha', status: 'ACTIVE', _key: 'agent-alpha' },
  { name: 'Agent Beta', status: 'TRAVELING', _key: 'agent-beta' },
];

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.getByText('NAME')).toBeInTheDocument();
    expect(screen.getByText('STATUS')).toBeInTheDocument();
  });

  it('renders row data', () => {
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.getByText('Agent Alpha')).toBeInTheDocument();
    expect(screen.getByText('TRAVELING')).toBeInTheDocument();
  });

  it('calls onRowClick when a row is clicked', async () => {
    const onRowClick = vi.fn();
    render(<DataTable columns={columns} rows={rows} onRowClick={onRowClick} />);
    await userEvent.click(screen.getByText('Agent Alpha'));
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);
  });

  it('renders empty state when rows is empty', () => {
    render(<DataTable columns={columns} rows={[]} emptyText="No agents." />);
    expect(screen.getByText('No agents.')).toBeInTheDocument();
  });
});
