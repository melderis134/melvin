'use client';

import { EditableTable } from '@/components/table/EditableTable';
import { ColumnDef } from '@/components/table/types';
import { TodoRow } from '@/lib/supabase/types';
import { createTodo, deleteTodo, updateTodo } from './actions';

const ESTADO_OPTIONS = ['Pendiente', 'En progreso', 'Hecho'];

const columns: ColumnDef<TodoRow>[] = [
  { key: 'tarea', label: 'Tarea', type: 'text' },
  { key: 'estado', label: 'Estado', type: 'select', options: ESTADO_OPTIONS },
  { key: 'vencimiento', label: 'Vencimiento', type: 'date' },
  { key: 'responsable', label: 'Responsable', type: 'text' },
  { key: 'notas', label: 'Notas', type: 'text' },
];

export function TodoTable({ rows }: { rows: TodoRow[] }) {
  return (
    <EditableTable
      columns={columns}
      rows={rows}
      onUpdate={updateTodo}
      onDelete={deleteTodo}
      onCreate={createTodo}
      emptyLabel="Todavía no cargaste tareas."
    />
  );
}
