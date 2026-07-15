'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { deleteRow, insertRow, updateRow } from '@/lib/actions/crud';
import { InvitadoRow, RsvpRevisarRow } from '@/lib/supabase/types';

const PATH = '/invitados';

export async function updateInvitado(id: string, patch: Partial<InvitadoRow>) {
  await updateRow('invitados', id, patch);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function deleteInvitado(id: string) {
  await deleteRow('invitados', id);
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function createInvitado(values: Partial<InvitadoRow>) {
  await insertRow('invitados', values);
  revalidatePath(PATH);
  revalidatePath('/');
}

function rsvpToInvitadoFields(rsvp: RsvpRevisarRow) {
  return {
    estado: 'Confirmado' as const,
    email: rsvp.email,
    preferencia_menu: rsvp.preferencia_menu,
    ayuda_con: rsvp.ayuda_con,
    toma_alcohol: rsvp.toma_alcohol,
    otras_consideraciones: rsvp.otras_consideraciones,
    fecha_confirmacion: new Date().toISOString(),
  };
}

export async function resolveRsvpToExisting(rsvp: RsvpRevisarRow, guestId: string) {
  const supabase = createServerSupabaseClient();
  const { error: updateError } = await supabase
    .from('invitados')
    .update(rsvpToInvitadoFields(rsvp))
    .eq('id', guestId);
  if (updateError) throw new Error(updateError.message);

  const { error: deleteError } = await supabase.from('rsvp_revisar').delete().eq('id', rsvp.id);
  if (deleteError) throw new Error(deleteError.message);

  revalidatePath(PATH);
  revalidatePath('/');
}

export async function resolveRsvpAsNew(rsvp: RsvpRevisarRow) {
  const supabase = createServerSupabaseClient();
  const { error: insertError } = await supabase.from('invitados').insert({
    nombre_apellido: rsvp.nombre_recibido,
    ...rsvpToInvitadoFields(rsvp),
  });
  if (insertError) throw new Error(insertError.message);

  const { error: deleteError } = await supabase.from('rsvp_revisar').delete().eq('id', rsvp.id);
  if (deleteError) throw new Error(deleteError.message);

  revalidatePath(PATH);
  revalidatePath('/');
}

export async function deleteRsvpRevisar(id: string) {
  await deleteRow('rsvp_revisar', id);
  revalidatePath(PATH);
}
