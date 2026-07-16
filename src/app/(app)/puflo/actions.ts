'use server';

import { revalidatePath } from 'next/cache';
import { deleteRow, insertRow, updateRow } from '@/lib/actions/crud';
import { PufloRow } from '@/lib/supabase/types';

const TABLE = 'puflo';
const PATH = '/puflo';

export async function updatePuflo(id: string, patch: Partial<PufloRow>) {
  await updateRow(TABLE, id, patch);
  revalidatePath(PATH);
}

export async function deletePuflo(id: string) {
  await deleteRow(TABLE, id);
  revalidatePath(PATH);
}

export async function createPuflo(values: Partial<PufloRow>) {
  await insertRow(TABLE, values);
  revalidatePath(PATH);
}
