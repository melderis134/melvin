'use server';

import { revalidatePath } from 'next/cache';
import { deleteRow, insertRow, updateRow } from '@/lib/actions/crud';
import { HospedajeTransporteRow } from '@/lib/supabase/types';

const TABLE = 'hospedaje_transporte';
const PATH = '/hospedaje-transporte';

export async function updateHospedaje(id: string, patch: Partial<HospedajeTransporteRow>) {
  await updateRow(TABLE, id, patch);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function deleteHospedaje(id: string) {
  await deleteRow(TABLE, id);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function createHospedaje(values: Partial<HospedajeTransporteRow>) {
  await insertRow(TABLE, values);
  revalidatePath(PATH);
  revalidatePath('/');
}
