'use server';

import { revalidatePath } from 'next/cache';
import { deleteRow, insertRow, updateRow } from '@/lib/actions/crud';
import { PresupuestoRow } from '@/lib/supabase/types';

const TABLE = 'presupuesto';
const PATH = '/presupuesto';

export async function updatePresupuesto(id: string, patch: Partial<PresupuestoRow>) {
  await updateRow(TABLE, id, patch);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function deletePresupuesto(id: string) {
  await deleteRow(TABLE, id);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function createPresupuesto(values: Partial<PresupuestoRow>) {
  await insertRow(TABLE, values);
  revalidatePath(PATH);
  revalidatePath('/');
}
