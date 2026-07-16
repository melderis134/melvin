import { PageHeader } from '@/components/layout/PageHeader';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AcompananteRow } from '@/lib/supabase/types';
import { AcompanantesTable } from './AcompanantesTable';

export const dynamic = 'force-dynamic';

export default async function AcompanantesPage() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('acompanantes')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <div>
      <PageHeader title="Acompañantes" subtitle="Padrinos, damas y demás acompañantes." />
      <AcompanantesTable rows={(data ?? []) as AcompananteRow[]} />
    </div>
  );
}
