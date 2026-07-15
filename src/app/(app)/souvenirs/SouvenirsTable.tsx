'use client';

import { EditableTable } from '@/components/table/EditableTable';
import { ColumnDef } from '@/components/table/types';
import { formatCurrency } from '@/lib/format';
import { SouvenirRow } from '@/lib/supabase/types';
import { createSouvenir, deleteSouvenir, updateSouvenir } from './actions';

const TIPO_OPTIONS = [
  'Souvenir',
  'Numerito de mesa',
  'Tarjeta de lugar',
  'Etiqueta souvenir',
  'Etiqueta vino',
  'Newspaper',
  'Juegos para invitados',
  'Libro de firmas',
  'Cartelería baño',
  'Kit de emergencia baño',
  'Otro',
];

const ESTADO_OPTIONS = ['Pendiente', 'En diseño/cotización', 'Encargado', 'Recibido'];

const columns: ColumnDef<SouvenirRow>[] = [
  { key: 'item', label: 'Item', type: 'text' },
  { key: 'tipo', label: 'Tipo', type: 'select', options: TIPO_OPTIONS },
  { key: 'proveedor', label: 'Proveedor', type: 'text' },
  { key: 'cantidad', label: 'Cantidad', type: 'number', align: 'right', formatValue: (v) => String(v ?? '') },
  { key: 'costo_unitario', label: 'Costo unitario', type: 'number', align: 'right' },
  {
    key: 'costo_total',
    label: 'Costo total',
    type: 'computed',
    align: 'right',
    sum: true,
    formatValue: (v) => formatCurrency(v as number | null),
  },
  { key: 'estado', label: 'Estado', type: 'select', options: ESTADO_OPTIONS },
  { key: 'notas', label: 'Notas', type: 'text' },
];

export function SouvenirsTable({ rows }: { rows: SouvenirRow[] }) {
  return (
    <EditableTable
      columns={columns}
      rows={rows}
      onUpdate={updateSouvenir}
      onDelete={deleteSouvenir}
      onCreate={createSouvenir}
      emptyLabel="Todavía no cargaste souvenirs ni papelería del día."
    />
  );
}
