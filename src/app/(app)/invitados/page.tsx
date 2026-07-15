import { PageHeader } from '@/components/layout/PageHeader';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { InvitadoRow, RsvpRevisarRow } from '@/lib/supabase/types';
import { InvitadosClient } from './InvitadosClient';

export const dynamic = 'force-dynamic';

export default async function InvitadosPage() {
  const supabase = createServerSupabaseClient();

  const [{ data: guests, error: guestsError }, { data: rsvpRows, error: rsvpError }] = await Promise.all([
    supabase.from('invitados').select('*').order('nombre_apellido', { ascending: true }),
    supabase.from('rsvp_revisar').select('*').order('fecha', { ascending: false }),
  ]);

  if (guestsError) throw new Error(guestsError.message);
  if (rsvpError) throw new Error(rsvpError.message);

  return (
    <div>
      <PageHeader title="Invitados" subtitle="Lista maestra y confirmaciones de RSVP." />
      <InvitadosClient guests={(guests ?? []) as InvitadoRow[]} rsvpRows={(rsvpRows ?? []) as RsvpRevisarRow[]} />
    </div>
  );
}
