'use server';

import { revalidatePath } from 'next/cache';
import { deleteRow, insertRow, updateRow } from '@/lib/actions/crud';
import { ProveedorRow } from '@/lib/supabase/types';

const TABLE = 'proveedores';
const PATH = '/proveedores';

export async function updateProveedor(id: string, patch: Partial<ProveedorRow>) {
  await updateRow(TABLE, id, patch);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function deleteProveedor(id: string) {
  await deleteRow(TABLE, id);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function createProveedor(values: Partial<ProveedorRow>) {
  await insertRow(TABLE, values);
  revalidatePath(PATH);
  revalidatePath('/');
}
