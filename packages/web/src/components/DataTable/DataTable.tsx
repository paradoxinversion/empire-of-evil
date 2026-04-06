import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export type Row = Record<string, ReactNode> & { _key: string };

interface DataTableProps {
  columns: Column[];
  rows: Row[];
  onRowClick?: (row: Row) => void;
  selectedRowKey?: string;
  emptyText?: string;
}

export function DataTable({ columns, rows, onRowClick, selectedRowKey, emptyText = '—' }: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = sortKey
    ? [...rows].sort((a, b) => {
        const av = String(a[sortKey] ?? '');
        const bv = String(b[sortKey] ?? '');
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      })
    : rows;

  return (
    <table className="w-full border-collapse text-[12px]">
      <thead>
        <tr>
          {columns.map(col => (
            <th
              key={col.key}
              style={col.width ? { width: col.width } : undefined}
              className={`font-mono text-[9px] tracking-[0.1em] text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal ${col.sortable ? 'cursor-pointer select-none hover:text-text-secondary' : ''}`}
              onClick={col.sortable ? () => handleSort(col.key) : undefined}
            >
              <span className="inline-flex items-center gap-1">
                {col.label}
                {col.sortable && sortKey === col.key && (
                  sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />
                )}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="py-4 text-center text-text-muted">
              {emptyText}
            </td>
          </tr>
        ) : (
          sorted.map(row => (
            <tr
              key={row._key}
              className={`border-b border-bg-elevated transition-colors duration-fast ${onRowClick ? 'cursor-pointer hover:bg-bg-elevated' : ''} ${selectedRowKey === row._key ? 'bg-bg-selected' : ''}`}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col, i) => (
                <td
                  key={col.key}
                  className={`py-1.5 pr-2 align-middle ${i === 0 ? 'text-text-primary' : 'text-text-secondary'}`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
