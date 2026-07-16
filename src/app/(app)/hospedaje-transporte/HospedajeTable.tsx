'use client';

import { EditableTable } from '@/components/table/EditableTable';
import { ColumnDef } from '@/components/table/types';
import { HospedajeTransporteRow } from '@/lib/supabase/types';
import { createHospedaje, deleteHospedaje, updateHospedaje } from './actions';

const ESTADO_OPTIONS = ['No pagado', 'Seña', 'Segundo pago', 'Pagado completo'];

const columns: ColumnDef<HospedajeTransporteRow>[] = [
  { key: 'item', label: 'Item', type: 'text' },
  { key: 'proveedor', label: 'Proveedor', type: 'text' },
  { key: 'costo', label: 'Costo', type: 'number', align: 'right', sum: true },
  { key: 'estado', label: 'Estado', type: 'select', options: ESTADO_OPTIONS },
  { key: 'notas', label: 'Notas', type: 'text' },
];

export function HospedajeTable({ rows }: { rows: HospedajeTransporteRow[] }) {
  return (
    <EditableTable
      columns={columns}
      rows={rows}
      onUpdate={updateHospedaje}
      onDelete={deleteHospedaje}
      onCreate={createHospedaje}
      emptyLabel="Todavía no cargaste ítems de hospedaje o transporte."
    />
  );
}
