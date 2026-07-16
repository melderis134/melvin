'use server';

import { revalidatePath } from 'next/cache';
import { deleteRow, insertRow, updateRow } from '@/lib/actions/crud';
import { TodoRow } from '@/lib/supabase/types';

const TABLE = 'todo_list';
const PATH = '/todo';

export async function updateTodo(id: string, patch: Partial<TodoRow>) {
  await updateRow(TABLE, id, patch);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function deleteTodo(id: string) {
  await deleteRow(TABLE, id);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function createTodo(values: Partial<TodoRow>) {
  await insertRow(TABLE, values);
  revalidatePath(PATH);
  revalidatePath('/');
}
