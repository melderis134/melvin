import { PageHeader } from '@/components/layout/PageHeader';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PufloRow } from '@/lib/supabase/types';
import { PufloTable } from './PufloTable';

export const dynamic = 'force-dynamic';

export default async function PufloPage() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('puflo')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <div>
      <PageHeader title="Puflo" subtitle="Otros pendientes sueltos." />
      <PufloTable rows={(data ?? []) as PufloRow[]} />
    </div>
  );
}
