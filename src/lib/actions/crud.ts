import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function updateRow(table: string, id: string, patch: Record<string, unknown>) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from(table).update(patch).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteRow(table: string, id: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function insertRow(table: string, values: Record<string, unknown>) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from(table).insert(values);
  if (error) throw new Error(error.message);
}
