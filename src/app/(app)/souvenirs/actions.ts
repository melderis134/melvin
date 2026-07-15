'use server';

import { revalidatePath } from 'next/cache';
import { deleteRow, insertRow, updateRow } from '@/lib/actions/crud';
import { SouvenirRow } from '@/lib/supabase/types';

const TABLE = 'souvenirs';
const PATH = '/souvenirs';

export async function updateSouvenir(id: string, patch: Partial<SouvenirRow>) {
  await updateRow(TABLE, id, patch);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function deleteSouvenir(id: string) {
  await deleteRow(TABLE, id);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function createSouvenir(values: Partial<SouvenirRow>) {
  await insertRow(TABLE, values);
  revalidatePath(PATH);
  revalidatePath('/');
}
