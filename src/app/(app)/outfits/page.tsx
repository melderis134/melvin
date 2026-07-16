import { PageHeader } from '@/components/layout/PageHeader';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { OutfitRow } from '@/lib/supabase/types';
import { OutfitsTable } from './OutfitsTable';

export const dynamic = 'force-dynamic';

export default async function OutfitsPage() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('outfits')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);

  return (
    <div>
      <PageHeader title="Outfits" subtitle="Vestimenta de los novios y del cortejo." />
      <OutfitsTable rows={(data ?? []) as OutfitRow[]} />
    </div>
  );
}
