'use server';

import { revalidatePath } from 'next/cache';
import { deleteRow, insertRow, updateRow } from '@/lib/actions/crud';
import { OutfitRow } from '@/lib/supabase/types';

const TABLE = 'outfits';
const PATH = '/outfits';

export async function updateOutfit(id: string, patch: Partial<OutfitRow>) {
  await updateRow(TABLE, id, patch);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function deleteOutfit(id: string) {
  await deleteRow(TABLE, id);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function createOutfit(values: Partial<OutfitRow>) {
  await insertRow(TABLE, values);
  revalidatePath(PATH);
  revalidatePath('/');
}
