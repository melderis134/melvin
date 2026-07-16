'use client';

import { EditableTable } from '@/components/table/EditableTable';
import { ColumnDef } from '@/components/table/types';
import { CivilRow } from '@/lib/supabase/types';
import { createCivil, deleteCivil, updateCivil } from './actions';

const ESTADO_OPTIONS = ['Pendiente', 'Turno sacado', 'Hecho'];

const columns: ColumnDef<CivilRow>[] = [
  { key: 'tramite', label: 'Trámite', type: 'text' },
  { key: 'estado', label: 'Estado', type: 'select', options: ESTADO_OPTIONS },
  { key: 'fecha_turno', label: 'Fecha de turno', type: 'date' },
  { key: 'notas', label: 'Notas', type: 'text' },
];

export function CivilTable({ rows }: { rows: CivilRow[] }) {
  return (
    <EditableTable
      columns={columns}
      rows={rows}
      onUpdate={updateCivil}
      onDelete={deleteCivil}
      onCreate={createCivil}
      emptyLabel="Todavía no cargaste trámites civiles."
    />
  );
}
