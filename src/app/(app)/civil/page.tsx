import { PageHeader } from '@/components/layout/PageHeader';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CivilRow } from '@/lib/supabase/types';
import { CivilTable } from './CivilTable';

export const dynamic = 'force-dynamic';

export default async function CivilPage() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('civil')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <div>
      <PageHeader title="Civil" subtitle="Trámites del casamiento civil." />
      <CivilTable rows={(data ?? []) as CivilRow[]} />
    </div>
  );
}
