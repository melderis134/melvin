'use server';

import { revalidatePath } from 'next/cache';
import { deleteRow, insertRow, updateRow } from '@/lib/actions/crud';
import { InvitacionesRow } from '@/lib/supabase/types';

const TABLE = 'invitaciones';
const PATH = '/invitaciones';

export async function updateInvitacion(id: string, patch: Partial<InvitacionesRow>) {
  await updateRow(TABLE, id, patch);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function deleteInvitacion(id: string) {
  await deleteRow(TABLE, id);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function createInvitacion(values: Partial<InvitacionesRow>) {
  await insertRow(TABLE, values);
  revalidatePath(PATH);
  revalidatePath('/');
}
