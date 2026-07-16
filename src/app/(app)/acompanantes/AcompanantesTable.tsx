'use client';

import { EditableTable } from '@/components/table/EditableTable';
import { ColumnDef } from '@/components/table/types';
import { AcompananteRow } from '@/lib/supabase/types';
import { createAcompanante, deleteAcompanante, updateAcompanante } from './actions';

const columns: ColumnDef<AcompananteRow>[] = [
  { key: 'nombre', label: 'Nombre', type: 'text' },
  { key: 'rol', label: 'Rol', type: 'text' },
  { key: 'contacto', label: 'Contacto', type: 'text' },
  { key: 'notas', label: 'Notas', type: 'text' },
];

export function AcompanantesTable({ rows }: { rows: AcompananteRow[] }) {
  return (
    <EditableTable
      columns={columns}
      rows={rows}
      onUpdate={updateAcompanante}
      onDelete={deleteAcompanante}
      onCreate={createAcompanante}
      emptyLabel="Todavía no cargaste acompañantes (padrinos, damas, etc.)."
    />
  );
}
