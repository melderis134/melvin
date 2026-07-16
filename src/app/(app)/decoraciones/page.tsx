import { PageHeader } from '@/components/layout/PageHeader';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { DecoracionRow } from '@/lib/supabase/types';
import { DecoracionesTable } from './DecoracionesTable';

export const dynamic = 'force-dynamic';

export default async function DecoracionesPage() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('decoraciones')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <div>
      <PageHeader title="Decoración" subtitle="Flores, ambientación y decoración del salón." />
      <DecoracionesTable rows={(data ?? []) as DecoracionRow[]} />
    </div>
  );
}
