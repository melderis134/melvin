import { PageHeader } from '@/components/layout/PageHeader';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { InvitacionesRow } from '@/lib/supabase/types';
import { InvitacionesTable } from './InvitacionesTable';

export const dynamic = 'force-dynamic';

export default async function InvitacionesPage() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('invitaciones')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <div>
      <PageHeader title="Invitaciones" subtitle="Diseño e impresión de la tarjeta de invitación." />
      <InvitacionesTable rows={(data ?? []) as InvitacionesRow[]} />
    </div>
  );
}
