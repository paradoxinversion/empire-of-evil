import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import type { Row } from './DataTable';
import { Tag } from '../Tag/Tag';

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof DataTable>;

const personnelColumns = [
  { key: 'name', label: 'NAME', sortable: true },
  { key: 'dept', label: 'DEPT' },
  { key: 'location', label: 'LOCATION', sortable: true },
  { key: 'status', label: 'STATUS' },
];

const personnelRows: Row[] = [
  { _key: '1', name: 'Elena Voss', dept: <Tag variant="scientist">SCIENTIST</Tag>, location: 'Zone 4', status: <Tag variant="active">ACTIVE</Tag> },
  { _key: '2', name: 'Marco Drax', dept: <Tag variant="operative">OPERATIVE</Tag>, location: 'Zone 7', status: <Tag variant="traveling">TRAVELING</Tag> },
  { _key: '3', name: 'Jin Kazawa', dept: <Tag variant="troop">TROOP</Tag>, location: 'Zone 2', status: <Tag variant="injured">INJURED</Tag> },
];

export const Personnel: Story = {
  args: { columns: personnelColumns, rows: personnelRows, onRowClick: () => {} },
};

export const Empty: Story = {
  args: { columns: personnelColumns, rows: [], emptyText: 'No agents assigned.' },
};

export const WithSelection: Story = {
  args: { columns: personnelColumns, rows: personnelRows, selectedRowKey: '2' },
};
