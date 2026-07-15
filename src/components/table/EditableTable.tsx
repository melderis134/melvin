'use client';

import { useState, useTransition } from 'react';
import { ColumnDef } from './types';
import { Badge } from './badge-styles';
import { formatCurrency } from '@/lib/format';

interface EditableTableProps<T extends { id: string }> {
  columns: ColumnDef<T>[];
  rows: T[];
  onUpdate: (id: string, patch: Partial<T>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCreate: (draft: Partial<T>) => Promise<void>;
  emptyLabel?: string;
}

type CellKey = { rowId: string; key: string };

export function EditableTable<T extends { id: string }>({
  columns,
  rows,
  onUpdate,
  onDelete,
  onCreate,
  emptyLabel = 'Sin registros todavía.',
}: EditableTableProps<T>) {
  const [editingCell, setEditingCell] = useState<CellKey | null>(null);
  const [newRow, setNewRow] = useState<Record<string, string>>({});
  const [, startTransition] = useTransition();

  function columnSum(key: string) {
    return rows.reduce((acc, row) => {
      const v = (row as unknown as Record<string, unknown>)[key];
      return acc + (typeof v === 'number' ? v : 0);
    }, 0);
  }

  function coerce(col: ColumnDef<T>, raw: string): unknown {
    if (raw === '') return null;
    if (col.type === 'number') return Number(raw);
    return raw;
  }

  function commitEdit(rowId: string, col: ColumnDef<T>, raw: string) {
    setEditingCell(null);
    const patch = { [col.key]: coerce(col, raw) } as Partial<T>;
    startTransition(() => {
      onUpdate(rowId, patch);
    });
  }

  function toggleCheckbox(rowId: string, col: ColumnDef<T>, checked: boolean) {
    const patch = { [col.key]: checked } as Partial<T>;
    startTransition(() => {
      onUpdate(rowId, patch);
    });
  }

  function handleDelete(id: string) {
    if (!window.confirm('¿Eliminar este registro? Esta acción no se puede deshacer.')) return;
    startTransition(() => {
      onDelete(id);
    });
  }

  function submitNewRow() {
    const primaryKey = columns[0].key;
    if (!newRow[primaryKey]?.trim()) return;
    const patch: Record<string, unknown> = {};
    for (const col of columns) {
      if (col.type === 'computed') continue;
      patch[col.key] = coerce(col, newRow[col.key] ?? '');
    }
    startTransition(() => {
      onCreate(patch as Partial<T>);
    });
    setNewRow({});
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-paper-soft">
              {columns.map((col, i) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left align-bottom ${
                    i === 0 ? 'sticky left-0 z-10 bg-paper-soft' : ''
                  } ${col.align === 'right' ? 'text-right' : ''}`}
                >
                  <div className="text-xs font-medium tracking-wide text-ink-soft uppercase">{col.label}</div>
                  {col.sum && (
                    <div className="mt-0.5 text-sm font-semibold text-ink">{formatCurrency(columnSum(col.key))}</div>
                  )}
                </th>
              ))}
              <th className="w-10 px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="group border-b border-border last:border-0 hover:bg-paper-soft/50">
                {columns.map((col, i) => {
                  const value = (row as unknown as Record<string, unknown>)[col.key];
                  const isEditing = editingCell?.rowId === row.id && editingCell?.key === col.key;
                  const stickyCls = i === 0 ? 'sticky left-0 z-10 bg-surface group-hover:bg-[var(--color-paper-soft)]' : '';

                  if (col.type === 'checkbox') {
                    return (
                      <td key={col.key} className={`px-4 py-3 ${stickyCls}`}>
                        <input
                          type="checkbox"
                          checked={Boolean(value)}
                          onChange={(e) => toggleCheckbox(row.id, col, e.target.checked)}
                          className="h-4 w-4 rounded border-border accent-[var(--color-accent)]"
                        />
                      </td>
                    );
                  }

                  if (col.type === 'computed') {
                    const display = col.formatValue ? col.formatValue(value, row) : String(value ?? '—');
                    return (
                      <td key={col.key} className={`px-4 py-3 text-ink-soft ${stickyCls} ${col.align === 'right' ? 'text-right' : ''}`}>
                        {display}
                      </td>
                    );
                  }

                  if (col.type === 'select') {
                    if (isEditing) {
                      return (
                        <td key={col.key} className={`px-2 py-2 ${stickyCls}`}>
                          <select
                            autoFocus
                            defaultValue={String(value ?? '')}
                            onChange={(e) => commitEdit(row.id, col, e.target.value)}
                            onBlur={() => setEditingCell(null)}
                            className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-sm outline-none focus:border-accent"
                          >
                            <option value="">—</option>
                            {col.options?.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </td>
                      );
                    }
                    return (
                      <td
                        key={col.key}
                        onClick={() => setEditingCell({ rowId: row.id, key: col.key })}
                        className={`cursor-pointer px-4 py-3 ${stickyCls}`}
                      >
                        {value ? <Badge value={String(value)} /> : <span className="text-ink-soft">—</span>}
                      </td>
                    );
                  }

                  // text / number / date
                  if (isEditing) {
                    return (
                      <td key={col.key} className={`px-2 py-2 ${stickyCls}`}>
                        <input
                          autoFocus
                          type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                          defaultValue={value === null || value === undefined ? '' : String(value)}
                          onBlur={(e) => commitEdit(row.id, col, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                            if (e.key === 'Escape') setEditingCell(null);
                          }}
                          className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-sm outline-none focus:border-accent"
                        />
                      </td>
                    );
                  }

                  const display =
                    col.type === 'number'
                      ? col.formatValue
                        ? col.formatValue(value, row)
                        : formatCurrency(value as number | null)
                      : col.formatValue
                        ? col.formatValue(value, row)
                        : String(value ?? '');

                  return (
                    <td
                      key={col.key}
                      onClick={() => setEditingCell({ rowId: row.id, key: col.key })}
                      className={`cursor-pointer px-4 py-3 ${stickyCls} ${col.align === 'right' ? 'text-right' : ''} ${!value ? 'text-ink-soft' : ''}`}
                    >
                      {value ? display : '—'}
                    </td>
                  );
                })}
                <td className="px-2 py-3 text-center">
                  <button
                    onClick={() => handleDelete(row.id)}
                    aria-label="Eliminar"
                    className="rounded-md p-1.5 text-ink-soft opacity-0 transition group-hover:opacity-100 hover:bg-accent-soft hover:text-danger"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-ink-soft">
                  {emptyLabel}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-paper-soft/40">
              {columns.map((col, i) => (
                <td key={col.key} className={`px-2 py-2 ${i === 0 ? 'sticky left-0 z-10 bg-[var(--color-paper-soft)]' : ''}`}>
                  {col.type === 'computed' ? null : col.type === 'checkbox' ? null : col.type === 'select' ? (
                    <select
                      value={newRow[col.key] ?? ''}
                      onChange={(e) => setNewRow((prev) => ({ ...prev, [col.key]: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-sm outline-none focus:border-accent"
                    >
                      <option value="">—</option>
                      {col.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                      placeholder={i === 0 ? 'Agregar…' : ''}
                      value={newRow[col.key] ?? ''}
                      onChange={(e) => setNewRow((prev) => ({ ...prev, [col.key]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') submitNewRow();
                      }}
                      className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-sm outline-none focus:border-accent"
                    />
                  )}
                </td>
              ))}
              <td className="px-2 py-2 text-center">
                <button
                  onClick={submitNewRow}
                  aria-label="Agregar registro"
                  className="rounded-md bg-ink p-1.5 text-paper transition hover:bg-ink/90"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
