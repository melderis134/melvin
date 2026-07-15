'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { deleteRow, insertRow, updateRow } from '@/lib/actions/crud';
import { InspoRow } from '@/lib/supabase/types';

const PATH = '/inspo';

export async function createInspo(values: Partial<InspoRow>) {
  await insertRow('inspo', values);
  revalidatePath(PATH);
}

export async function updateInspo(id: string, patch: Partial<InspoRow>) {
  await updateRow('inspo', id, patch);
  revalidatePath(PATH);
}

export async function deleteInspo(id: string, fotoUrl: string) {
  const supabase = createServerSupabaseClient();

  const marker = '/storage/v1/object/public/inspo/';
  const idx = fotoUrl.indexOf(marker);
  if (idx !== -1) {
    const objectPath = decodeURIComponent(fotoUrl.slice(idx + marker.length));
    await supabase.storage.from('inspo').remove([objectPath]);
  }

  await deleteRow('inspo', id);
  revalidatePath(PATH);
}
