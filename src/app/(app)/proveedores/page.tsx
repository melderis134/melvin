import { PageHeader } from '@/components/layout/PageHeader';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProveedorRow } from '@/lib/supabase/types';
import { ProveedoresTable } from './ProveedoresTable';

export const dynamic = 'force-dynamic';

export default async function ProveedoresPage() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('proveedores')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <div>
      <PageHeader title="Proveedores" subtitle="Contactos y estado de pago de cada proveedor." />
      <ProveedoresTable rows={(data ?? []) as ProveedorRow[]} />
    </div>
  );
}
