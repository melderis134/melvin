import { PageHeader } from '@/components/layout/PageHeader';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PresupuestoRow } from '@/lib/supabase/types';
import { PresupuestoTable } from './PresupuestoTable';

export const dynamic = 'force-dynamic';

export default async function PresupuestoPage() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('presupuesto')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <div>
      <PageHeader title="Presupuesto" subtitle="Todos los gastos del casamiento en un solo lugar." />
      <PresupuestoTable rows={(data ?? []) as PresupuestoRow[]} />
    </div>
  );
}
