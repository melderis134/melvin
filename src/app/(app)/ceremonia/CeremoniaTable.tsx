'use client';

import { EditableTable } from '@/components/table/EditableTable';
import { ColumnDef } from '@/components/table/types';
import { CeremoniaRow } from '@/lib/supabase/types';
import { createCeremonia, deleteCeremonia, updateCeremonia } from './actions';

const ESTADO_OPTIONS = ['Pendiente', 'En progreso', 'Hecho'];

const columns: ColumnDef<CeremoniaRow>[] = [
  { key: 'item', label: 'Item', type: 'text' },
  { key: 'estado', label: 'Estado', type: 'select', options: ESTADO_OPTIONS },
  { key: 'responsable', label: 'Responsable', type: 'text' },
  { key: 'notas', label: 'Notas', type: 'text' },
];

export function CeremoniaTable({ rows }: { rows: CeremoniaRow[] }) {
  return (
    <EditableTable
      columns={columns}
      rows={rows}
      onUpdate={updateCeremonia}
      onDelete={deleteCeremonia}
      onCreate={createCeremonia}
      emptyLabel="Todavía no cargaste ítems de la ceremonia."
    />
  );
}
