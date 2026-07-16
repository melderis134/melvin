'use client';

import { EditableTable } from '@/components/table/EditableTable';
import { ColumnDef } from '@/components/table/types';
import { InvitacionesRow } from '@/lib/supabase/types';
import { createInvitacion, deleteInvitacion, updateInvitacion } from './actions';

const ESTADO_OPTIONS = ['Pendiente', 'En diseño', 'Aprobado', 'Impreso / Listo'];

const columns: ColumnDef<InvitacionesRow>[] = [
  { key: 'item', label: 'Item', type: 'text' },
  { key: 'estado', label: 'Estado', type: 'select', options: ESTADO_OPTIONS },
  { key: 'proveedor', label: 'Proveedor', type: 'text' },
  { key: 'costo', label: 'Costo', type: 'number', align: 'right', sum: true },
  { key: 'vencimiento', label: 'Vencimiento', type: 'date' },
  { key: 'notas', label: 'Notas', type: 'text' },
];

export function InvitacionesTable({ rows }: { rows: InvitacionesRow[] }) {
  return (
    <EditableTable
      columns={columns}
      rows={rows}
      onUpdate={updateInvitacion}
      onDelete={deleteInvitacion}
      onCreate={createInvitacion}
      emptyLabel="Todavía no cargaste ítems de invitaciones."
    />
  );
}
