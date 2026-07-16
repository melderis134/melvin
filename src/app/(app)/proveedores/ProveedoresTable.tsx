'use client';

import { EditableTable } from '@/components/table/EditableTable';
import { ColumnDef } from '@/components/table/types';
import { ProveedorRow } from '@/lib/supabase/types';
import { createProveedor, deleteProveedor, updateProveedor } from './actions';

const ESTADO_OPTIONS = ['No pagado', 'Seña', 'Segundo pago', 'Pagado completo'];

const columns: ColumnDef<ProveedorRow>[] = [
  { key: 'nombre', label: 'Nombre', type: 'text' },
  { key: 'rubro', label: 'Rubro', type: 'text' },
  { key: 'contacto', label: 'Contacto', type: 'text' },
  { key: 'costo', label: 'Costo', type: 'number', align: 'right', sum: true },
  { key: 'estado_pago', label: 'Estado de pago', type: 'select', options: ESTADO_OPTIONS },
  { key: 'notas', label: 'Notas', type: 'text' },
];

export function ProveedoresTable({ rows }: { rows: ProveedorRow[] }) {
  return (
    <EditableTable
      columns={columns}
      rows={rows}
      onUpdate={updateProveedor}
      onDelete={deleteProveedor}
      onCreate={createProveedor}
      emptyLabel="Todavía no cargaste proveedores."
    />
  );
}
