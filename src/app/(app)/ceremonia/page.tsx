import { PageHeader } from '@/components/layout/PageHeader';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CeremoniaRow } from '@/lib/supabase/types';
import { CeremoniaTable } from './CeremoniaTable';

export const dynamic = 'force-dynamic';

export default async function CeremoniaPage() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('ceremonia')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <div>
      <PageHeader title="Ceremonia" subtitle="Detalles y organización de la ceremonia." />
      <CeremoniaTable rows={(data ?? []) as CeremoniaRow[]} />
    </div>
  );
}
