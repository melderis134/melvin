import { PageHeader } from '@/components/layout/PageHeader';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { HospedajeTransporteRow } from '@/lib/supabase/types';
import { HospedajeTable } from './HospedajeTable';

export const dynamic = 'force-dynamic';

export default async function HospedajeTransportePage() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('hospedaje_transporte')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <div>
      <PageHeader title="Hospedaje / Transporte" subtitle="Alojamiento y traslados para los invitados." />
      <HospedajeTable rows={(data ?? []) as HospedajeTransporteRow[]} />
    </div>
  );
}
