'use server';

import { revalidatePath } from 'next/cache';
import { deleteRow, insertRow, updateRow } from '@/lib/actions/crud';
import { DecoracionRow } from '@/lib/supabase/types';

const TABLE = 'decoraciones';
const PATH = '/decoraciones';

export async function updateDecoracion(id: string, patch: Partial<DecoracionRow>) {
  await updateRow(TABLE, id, patch);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function deleteDecoracion(id: string) {
  await deleteRow(TABLE, id);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function createDecoracion(values: Partial<DecoracionRow>) {
  await insertRow(TABLE, values);
  revalidatePath(PATH);
  revalidatePath('/');
}
