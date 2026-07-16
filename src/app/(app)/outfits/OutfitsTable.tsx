'use client';

import { EditableTable } from '@/components/table/EditableTable';
import { ColumnDef } from '@/components/table/types';
import { OutfitRow } from '@/lib/supabase/types';
import { createOutfit, deleteOutfit, updateOutfit } from './actions';

const ESTADO_OPTIONS = ['Pendiente', 'Probado', 'Comprado / Listo'];

const columns: ColumnDef<OutfitRow>[] = [
  { key: 'persona', label: 'Persona', type: 'text' },
  { key: 'item', label: 'Item', type: 'text' },
  { key: 'proveedor', label: 'Proveedor', type: 'text' },
  { key: 'costo', label: 'Costo', type: 'number', align: 'right', sum: true },
  { key: 'estado', label: 'Estado', type: 'select', options: ESTADO_OPTIONS },
  { key: 'notas', label: 'Notas', type: 'text' },
];

export function OutfitsTable({ rows }: { rows: OutfitRow[] }) {
  return (
    <EditableTable
      columns={columns}
      rows={rows}
      onUpdate={updateOutfit}
      onDelete={deleteOutfit}
      onCreate={createOutfit}
      emptyLabel="Todavía no cargaste outfits."
    />
  );
}
