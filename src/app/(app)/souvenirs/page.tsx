import { PageHeader } from '@/components/layout/PageHeader';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SouvenirRow } from '@/lib/supabase/types';
import { SouvenirsTable } from './SouvenirsTable';

export const dynamic = 'force-dynamic';

export default async function SouvenirsPage() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('souvenirs')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <div>
      <PageHeader
        title="Souvenirs"
        subtitle="Souvenirs para los invitados y papelería del día: numeritos, place cards, etiquetas."
      />
      <SouvenirsTable rows={(data ?? []) as SouvenirRow[]} />
    </div>
  );
}
