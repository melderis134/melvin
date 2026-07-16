'use client';

import { EditableTable } from '@/components/table/EditableTable';
import { ColumnDef } from '@/components/table/types';
import { PufloRow } from '@/lib/supabase/types';
import { createPuflo, deletePuflo, updatePuflo } from './actions';

const ESTADO_OPTIONS = ['Pendiente', 'En progreso', 'Hecho'];

const columns: ColumnDef<PufloRow>[] = [
  { key: 'item', label: 'Item', type: 'text' },
  { key: 'estado', label: 'Estado', type: 'select', options: ESTADO_OPTIONS },
  { key: 'responsable', label: 'Responsable', type: 'text' },
  { key: 'notas', label: 'Notas', type: 'text' },
];

export function PufloTable({ rows }: { rows: PufloRow[] }) {
  return (
    <EditableTable
      columns={columns}
      rows={rows}
      onUpdate={updatePuflo}
      onDelete={deletePuflo}
      onCreate={createPuflo}
      emptyLabel="Todavía no cargaste ítems acá."
    />
  );
}
