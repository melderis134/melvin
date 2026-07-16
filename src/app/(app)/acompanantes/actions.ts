'use server';

import { revalidatePath } from 'next/cache';
import { deleteRow, insertRow, updateRow } from '@/lib/actions/crud';
import { AcompananteRow } from '@/lib/supabase/types';

const TABLE = 'acompanantes';
const PATH = '/acompanantes';

export async function updateAcompanante(id: string, patch: Partial<AcompananteRow>) {
  await updateRow(TABLE, id, patch);
  revalidatePath(PATH);
}

export async function deleteAcompanante(id: string) {
  await deleteRow(TABLE, id);
  revalidatePath(PATH);
}

export async function createAcompanante(values: Partial<AcompananteRow>) {
  await insertRow(TABLE, values);
  revalidatePath(PATH);
}
