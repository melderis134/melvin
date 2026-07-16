'use client';

import { EditableTable } from '@/components/table/EditableTable';
import { ColumnDef } from '@/components/table/types';
import { DecoracionRow } from '@/lib/supabase/types';
import { createDecoracion, deleteDecoracion, updateDecoracion } from './actions';

const ESTADO_OPTIONS = ['No pagado', 'Seña', 'Segundo pago', 'Pagado completo'];

const columns: ColumnDef<DecoracionRow>[] = [
  { key: 'item', label: 'Item', type: 'text' },
  { key: 'proveedor', label: 'Proveedor', type: 'text' },
  { key: 'costo', label: 'Costo', type: 'number', align: 'right', sum: true },
  { key: 'estado', label: 'Estado', type: 'select', options: ESTADO_OPTIONS },
  { key: 'notas', label: 'Notas', type: 'text' },
];

export function DecoracionesTable({ rows }: { rows: DecoracionRow[] }) {
  return (
    <EditableTable
      columns={columns}
      rows={rows}
      onUpdate={updateDecoracion}
      onDelete={deleteDecoracion}
      onCreate={createDecoracion}
      emptyLabel="Todavía no cargaste ítems de decoración."
    />
  );
}
