'use server';

import { revalidatePath } from 'next/cache';
import { deleteRow, insertRow, updateRow } from '@/lib/actions/crud';
import { CeremoniaRow } from '@/lib/supabase/types';

const TABLE = 'ceremonia';
const PATH = '/ceremonia';

export async function updateCeremonia(id: string, patch: Partial<CeremoniaRow>) {
  await updateRow(TABLE, id, patch);
  revalidatePath(PATH);
}

export async function deleteCeremonia(id: string) {
  await deleteRow(TABLE, id);
  revalidatePath(PATH);
}

export async function createCeremonia(values: Partial<CeremoniaRow>) {
  await insertRow(TABLE, values);
  revalidatePath(PATH);
}
