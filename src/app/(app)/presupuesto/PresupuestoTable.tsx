'use client';

import { EditableTable } from '@/components/table/EditableTable';
import { ColumnDef } from '@/components/table/types';
import { PresupuestoRow } from '@/lib/supabase/types';
import { createPresupuesto, deletePresupuesto, updatePresupuesto } from './actions';

const CATEGORIA_OPTIONS = [
  'Salón',
  'Catering',
  'Fotografía',
  'Música',
  'Decoración',
  'Souvenirs',
  'Invitaciones',
  'Proveedores varios',
  'Hospedaje/Transporte',
  'Outfits',
  'Ceremonia',
  'Civil',
  'Otros',
];

const QUIEN_PAGA_OPTIONS = ['Novios', 'Familia de Meli', 'Familia de Kev', 'Otros'];
const ESTADO_OPTIONS = ['No pagado', 'Seña', 'Segundo pago', 'Pagado completo'];

const columns: ColumnDef<PresupuestoRow>[] = [
  { key: 'nombre', label: 'Nombre', type: 'text' },
  { key: 'categoria', label: 'Categoría', type: 'select', options: CATEGORIA_OPTIONS },
  { key: 'costo', label: 'Costo', type: 'number', align: 'right', sum: true },
  { key: 'quien_paga', label: 'Quién paga', type: 'select', options: QUIEN_PAGA_OPTIONS },
  { key: 'vencimiento', label: 'Vencimiento', type: 'date' },
  { key: 'estado', label: 'Estado', type: 'select', options: ESTADO_OPTIONS },
  { key: 'notas', label: 'Notas', type: 'text' },
];

export function PresupuestoTable({ rows }: { rows: PresupuestoRow[] }) {
  return (
    <EditableTable
      columns={columns}
      rows={rows}
      onUpdate={updatePresupuesto}
      onDelete={deletePresupuesto}
      onCreate={createPresupuesto}
      emptyLabel="Todavía no cargaste ítems de presupuesto."
    />
  );
}
